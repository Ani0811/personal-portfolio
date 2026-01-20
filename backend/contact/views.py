from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
import logging
from django.utils import timezone
from zoneinfo import ZoneInfo
from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        # Allow anyone to create a message, but restrict list/retrieve/update/delete to admins
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class ContactCreateView(generics.CreateAPIView):
    """POST-only endpoint to create contact messages (open to anyone)."""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        # Send email notification (best-effort). Skip if SMTP credentials are not configured.
        try:
            contact_data = serializer.data
            name = contact_data.get('name', 'Unknown')
            email = contact_data.get('email', 'N/A')
            phone = contact_data.get('phone_number', 'N/A')
            message_text = contact_data.get('message', 'N/A')
            # Prefer the model instance datetime (aware) and format it nicely in IST;
            # fall back to serialized string if unavailable.
            created_dt = getattr(serializer.instance, 'created_at', None)
            if created_dt:
                try:
                    # Convert to Asia/Kolkata (IST) and format as DD-MM-YYYY with time
                    created_ist = created_dt.astimezone(ZoneInfo('Asia/Kolkata'))
                    created_at = created_ist.strftime('%d-%m-%Y %H:%M %Z')
                except Exception:
                    # Fallback to localtime formatting if zone conversion fails
                    created_local = timezone.localtime(created_dt)
                    created_at = created_local.strftime('%d-%m-%Y %H:%M:%S')
            else:
                created_at = contact_data.get('created_at', 'N/A')
            
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
            Submitted at: {created_at}
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
            
            # Send email to yourself only if SMTP settings exist
            recipient_email = settings.EMAIL_HOST_USER
            smtp_user = getattr(settings, 'EMAIL_HOST_USER', '')
            smtp_pass = getattr(settings, 'EMAIL_HOST_PASSWORD', '')
            logger = logging.getLogger(__name__)

            if recipient_email and smtp_user and smtp_pass:
                try:
                    msg = EmailMultiAlternatives(
                        subject=subject,
                        body=text_content,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        to=[recipient_email]
                    )
                    msg.attach_alternative(html_content, "text/html")
                    # Best-effort send; don't allow SMTP errors to break the API.
                    msg.send(fail_silently=True)
                except Exception as send_err:
                    logger.warning("ContactCreateView: failed to send email notification: %s", send_err)
            else:
                logger.info("ContactCreateView: SMTP not configured, skipping email send.")
        except Exception as e:
            # Log any unexpected error but don't fail the request
            logging.getLogger(__name__).exception("Failed to prepare/send contact email: %s", e)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
