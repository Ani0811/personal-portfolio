from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMultiAlternatives
from django.core.exceptions import ValidationError
from django.conf import settings
import logging
import json
import os
from datetime import datetime
from django.utils import timezone
from zoneinfo import ZoneInfo
from .models import ContactMessage
from .serializers import ContactMessageSerializer

logger = logging.getLogger(__name__)


class ContactMessageViewSet(viewsets.ModelViewSet):
    """Admin-only viewset for managing contact messages."""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        # Allow anyone to create a message, but restrict list/retrieve/update/delete to admins
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class ContactCreateView(generics.CreateAPIView):
    """
    POST-only endpoint to create contact messages (open to anyone).
    
    This view:
    1. Validates all input fields thoroughly
    2. Saves to database with error handling
    3. Backs up to JSON file (production fallback)
    4. Sends email notification (or logs if email unavailable)
    5. Returns success response
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

    def _validate_contact_data(self, data):
        """Additional validation beyond serializer."""
        errors = {}
        
        # Validate name
        name = data.get('name', '').strip()
        if not name or len(name) < 2:
            errors['name'] = 'Name must be at least 2 characters long.'
        elif len(name) > 255:
            errors['name'] = 'Name must not exceed 255 characters.'
        
        # Validate email
        email = data.get('email', '').strip()
        if not email:
            errors['email'] = 'Email is required.'
        elif len(email) > 254:
            errors['email'] = 'Email address is too long.'
        
        # Validate message
        message = data.get('message', '').strip()
        if not message or len(message) < 10:
            errors['message'] = 'Message must be at least 10 characters long.'
        elif len(message) > 5000:
            errors['message'] = 'Message must not exceed 5000 characters.'
        
        # Phone is optional but validate if provided
        phone = data.get('phone_number', '').strip()
        if phone and len(phone) > 30:
            errors['phone_number'] = 'Phone number must not exceed 30 characters.'
        
        if errors:
            raise ValidationError(errors)
        
        return {
            'name': name,
            'email': email,
            'message': message,
            'phone_number': phone
        }

    def _backup_to_json(self, contact_data):
        """
        Backup contact message to JSON file as fallback.
        Critical for production where SQLite might not persist.
        """
        try:
            backup_dir = os.path.join(settings.BASE_DIR, 'contact_backups')
            os.makedirs(backup_dir, exist_ok=True)
            
            backup_file = os.path.join(backup_dir, 'contact_messages.json')
            
            # Read existing messages
            messages = []
            if os.path.exists(backup_file):
                try:
                    with open(backup_file, 'r', encoding='utf-8') as f:
                        messages = json.load(f)
                except (json.JSONDecodeError, IOError):
                    logger.warning("Could not read existing backup file, starting fresh")
                    messages = []
            
            # Add new message with timestamp
            contact_data['backup_timestamp'] = datetime.now().isoformat()
            messages.append(contact_data)
            
            # Write back to file
            with open(backup_file, 'w', encoding='utf-8') as f:
                json.dump(messages, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Contact message backed up to JSON: {contact_data.get('email')}")
            return True
        except Exception as e:
            logger.error(f"Failed to backup contact message to JSON: {e}", exc_info=True)
            return False

    def _log_contact_submission(self, contact_data):
        """
        Log contact submission to application logs.
        This ensures we have a record even if database and JSON fail.
        """
        try:
            log_message = (
                f"\n{'='*80}\n"
                f"CONTACT FORM SUBMISSION\n"
                f"{'='*80}\n"
                f"Name: {contact_data.get('name')}\n"
                f"Email: {contact_data.get('email')}\n"
                f"Phone: {contact_data.get('phone_number', 'N/A')}\n"
                f"Message:\n{contact_data.get('message')}\n"
                f"Timestamp: {contact_data.get('created_at')}\n"
                f"{'='*80}\n"
            )
            logger.info(log_message)
        except Exception as e:
            logger.error(f"Failed to log contact submission: {e}")

    def create(self, request):
        """Handle contact form submission with comprehensive error handling."""
        try:
            # Step 1: Validate input data
            validated_data = self._validate_contact_data(request.data)
            
            # Step 2: Save to database with error handling
            serializer = self.get_serializer(data=validated_data)
            serializer.is_valid(raise_exception=True)
            
            db_saved = False
            try:
                self.perform_create(serializer)
                db_saved = True
                logger.info(f"Contact message saved to database: {validated_data['email']}")
            except Exception as db_error:
                logger.error(f"Failed to save to database: {db_error}", exc_info=True)
                # Continue anyway - we'll use backup methods
            
            # Step 3: Backup to JSON file (critical for production)
            contact_data_for_backup = {
                'id': serializer.instance.id if db_saved else None,
                'name': validated_data['name'],
                'email': validated_data['email'],
                'phone_number': validated_data.get('phone_number', ''),
                'message': validated_data['message'],
                'created_at': serializer.instance.created_at.isoformat() if db_saved else datetime.now().isoformat(),
                'db_saved': db_saved
            }
            self._backup_to_json(contact_data_for_backup)
            
            # Step 4: Log to application logs
            self._log_contact_submission(contact_data_for_backup)
            
            # Step 5: Attempt to send email notification
            headers = self.get_success_headers(serializer.data) if db_saved else {}

            # Step 5: Attempt to send email notification
            headers = self.get_success_headers(serializer.data) if db_saved else {}
            self._send_email_notification(contact_data_for_backup)
            
            # Step 6: Return success response
            response_data = {
                'success': True,
                'message': 'Your message has been received successfully. We will get back to you soon!',
                'data': serializer.data if db_saved else {
                    'name': validated_data['name'],
                    'email': validated_data['email'],
                    'message': 'Message received and logged'
                }
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)
            
        except ValidationError as ve:
            logger.warning(f"Validation error in contact form: {ve}")
            return Response(
                {'success': False, 'errors': ve.message_dict if hasattr(ve, 'message_dict') else str(ve)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error processing contact form: {e}", exc_info=True)
            return Response(
                {'success': False, 'message': 'An error occurred while processing your message. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _send_email_notification(self, contact_data):
        """
        Send email notification about new contact message.
        Falls back to logging if email is not configured or fails.
        """
    def _send_email_notification(self, contact_data):
        """
        Send email notification about new contact message.
        Falls back to logging if email is not configured or fails.
        """
        try:
            name = contact_data.get('name', 'Unknown')
            email = contact_data.get('email', 'N/A')
            phone = contact_data.get('phone_number', 'N/A')
            message_text = contact_data.get('message', 'N/A')
            created_at_str = contact_data.get('created_at', 'N/A')
            
            # Format timestamp nicely
            try:
                if isinstance(created_at_str, str):
                    created_dt = datetime.fromisoformat(created_at_str.replace('Z', '+00:00'))
                    created_ist = created_dt.astimezone(ZoneInfo('Asia/Kolkata'))
                    created_at = created_ist.strftime('%d-%m-%Y %H:%M %Z')
                else:
                    created_at = str(created_at_str)
            except Exception:
                created_at = created_at_str
            
            # Check if email is properly configured
            smtp_user = getattr(settings, 'EMAIL_HOST_USER', '')
            smtp_pass = getattr(settings, 'EMAIL_HOST_PASSWORD', '')
            email_backend = getattr(settings, 'EMAIL_BACKEND', '')
            
            # Log email status
            if 'dummy' in email_backend.lower():
                logger.warning(
                    f"Email backend is set to dummy. Contact message from {email} will be logged only.\n"
                    f"To enable email, configure EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in production."
                )
                return
            
            if not smtp_user or not smtp_pass:
                logger.warning(
                    f"SMTP not configured. Contact message from {email} logged but not emailed.\n"
                    f"Set EMAIL_HOST_USER and EMAIL_HOST_PASSWORD environment variables."
                )
                return
            
            # Prepare email content
            subject = f"🔔 New Contact Form Submission from {name}"
            
            # Plain text version
            text_content = f"""
You have received a new contact form submission:

Name: {name}
Email: {email}
Phone: {phone}

Message:
{message_text}

---
Database Status: {'Saved' if contact_data.get('db_saved') else 'Backup only'}
"""
            
            # HTML version with modern design
            html_content = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Contact Form Submission</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0e1a; color: #e4e7eb;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0e1a; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1f35 0%, #0f1624 100%); border: 1px solid #2a3350; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%); padding: 32px 40px; text-align: center;">
                                        <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                                            New Contact Form Submission
                                        </h1>
                                        <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255, 255, 255, 0.9);">
                                            Someone reached out via your portfolio
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px;">
                                        <!-- Sender Info Card -->
                                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(14, 165, 233, 0.05); border: 1px solid rgba(14, 165, 233, 0.2); border-radius: 12px; margin-bottom: 24px;">
                                            <tr>
                                                <td style="padding: 24px;">
                                                    <h2 style="margin: 0 0 20px; font-size: 18px; font-weight: 700; color: #0ea5e9; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Contact Details
                                                    </h2>
                                                    
                                                    <!-- Name -->
                                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                                                        <tr>
                                                            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                                                <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                                                                    Name
                                                                </div>
                                                                <div style="font-size: 16px; color: #e4e7eb; font-weight: 600;">
                                                                    {name}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    
                                                    <!-- Email -->
                                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                                                        <tr>
                                                            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                                                <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                                                                    Email
                                                                </div>
                                                                <div style="font-size: 16px; font-weight: 600;">
                                                                    <a href="mailto:{email}" style="color: #0ea5e9; text-decoration: none;">
                                                                        {email}
                                                                    </a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    
                                                    <!-- Phone -->
                                                    <table width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="padding: 12px 0;">
                                                                <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                                                                    Phone
                                                                </div>
                                                                <div style="font-size: 16px; color: #e4e7eb; font-weight: 600;">
                                                                    {phone if phone != 'N/A' else 'Not provided'}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Message Card -->
                                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(124, 58, 237, 0.05); border: 1px solid rgba(124, 58, 237, 0.2); border-radius: 12px;">
                                            <tr>
                                                <td style="padding: 24px;">
                                                    <h2 style="margin: 0 0 16px; font-size: 18px; font-weight: 700; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Message
                                                    </h2>
                                                    <div style="font-size: 15px; line-height: 1.7; color: #cbd5e1; white-space: pre-wrap; word-wrap: break-word;">
                                                        {message_text}
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Quick Reply Button -->
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                                            <tr>
                                                <td align="center">
                                                    <a href="mailto:{email}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; letter-spacing: 0.3px; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);">
                                                        Reply to {name}
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: rgba(0, 0, 0, 0.3); padding: 24px 40px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                                        <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                                            Submitted on {created_at}
                                        </p>
                                        <p style="margin: 8px 0 0; font-size: 12px; color: #64748b;">
                                            This message was sent via your portfolio contact form
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """
            
            # Attempt to send email
            try:
                recipient_email = settings.EMAIL_HOST_USER
                msg = EmailMultiAlternatives(
                    subject=subject,
                    body=text_content,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[recipient_email]
                )
                msg.attach_alternative(html_content, "text/html")
                msg.send(fail_silently=False)
                logger.info(f"Email notification sent successfully to {recipient_email}")
            except Exception as send_err:
                logger.error(f"Failed to send email notification: {send_err}", exc_info=True)
                
        except Exception as e:
            logger.error(f"Error in email notification process: {e}", exc_info=True)
