# Contact System - Production Guide

## Overview

The contact form system has been redesigned to ensure **zero data loss** in production. Messages are now stored in three redundant ways:

1. **SQLite Database** - Primary storage
2. **JSON Backup File** - Automatic fallback (`contact_backups/contact_messages.json`)
3. **Application Logs** - Detailed logging of all submissions

## Why This Approach?

In production environments like Render with ephemeral file systems, SQLite databases may not persist between deployments. The JSON backup ensures you can always access contact messages, even if the database is lost.

## Viewing Contact Messages

### Method 1: Django Admin (Recommended)

Access the admin panel at: `https://your-backend-url.onrender.com/admin/`

1. Log in with your admin credentials
2. Navigate to **Contact messages**
3. View, filter, and manage all messages

### Method 2: Management Command (Production SSH)

If you have SSH access to your production server (Render Shell):

```bash
# View all messages
python manage.py view_contact_messages

# View latest 10 messages
python manage.py view_contact_messages --limit 10

# Export messages to a file
python manage.py view_contact_messages --export messages.json
```

### Method 3: Direct JSON File Access

On your production server, the backup file is located at:
```
backend/contact_backups/contact_messages.json
```

You can download this file via:
- Render Shell: `cat contact_backups/contact_messages.json`
- Or access it through your deployment logs

### Method 4: Application Logs

Every contact submission is logged in detail. Check your application logs:

```bash
# On Render, view logs from the dashboard
# or use the Render CLI
render logs -t personal-portfolio-gsee
```

Look for entries marked with:
```
CONTACT FORM SUBMISSION
```

## Email Notifications

The system attempts to send email notifications for each contact submission.

### Email Configuration (Production)

Set these environment variables on Render:

```bash
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password
```

**For Gmail:**
1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password (not your regular password)

**Email Backend Behavior:**
- **Development** (`DEBUG=True`): Console backend (prints to terminal)
- **Production with credentials**: SMTP backend (sends real emails)
- **Production without credentials**: Console backend (logs only, no emails sent)

**Note:** Even if email fails, messages are still saved to database, JSON backup, and logs.

## How the New Contact View Works

### Request Flow

1. **Validation** - Input is thoroughly validated (name, email, message length, etc.)
2. **Database Save** - Attempts to save to SQLite database
3. **JSON Backup** - Always backs up to `contact_backups/contact_messages.json`
4. **Logging** - Logs full message details to application logs
5. **Email Notification** - Attempts to send email (if configured)
6. **Success Response** - Returns success even if some steps fail

### Error Handling

The system is designed to **never fail completely**:

- If database save fails → Still backs up to JSON and logs
- If JSON backup fails → Still saves to database and logs
- If email fails → Still saves and returns success
- If validation fails → Returns proper error message to user

### Response Format

**Success:**
```json
{
  "success": true,
  "message": "Your message has been received successfully. We will get back to you soon!",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello!",
    "created_at": "2026-01-21T10:30:00Z"
  }
}
```

**Validation Error:**
```json
{
  "success": false,
  "errors": {
    "name": ["Name must be at least 2 characters long."],
    "message": ["Message must be at least 10 characters long."]
  }
}
```

## Deployment Checklist

### On Render

1. **Set Environment Variables:**
   ```
   DJANGO_SECRET_KEY=your-secret-key
   DJANGO_DEBUG=False
   DJANGO_ALLOWED_HOSTS=personal-portfolio-gsee.onrender.com
   FRONTEND_URL=https://your-frontend-url.vercel.app
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   ```

2. **Database Persistence:**
   - SQLite file persists in `/opt/render/project/src/`
   - JSON backup provides additional redundancy

3. **Check Logs After Deployment:**
   ```bash
   render logs -t personal-portfolio-gsee
   ```

## Testing Contact Form

### Local Testing

1. Start backend: `python manage.py runserver`
2. Submit a test message through the frontend
3. Check console for logs
4. Verify in `backend/contact_backups/contact_messages.json`
5. Check Django admin at `http://localhost:8000/admin/`

### Production Testing

1. Submit message through production frontend
2. Check Render logs for confirmation
3. Download and inspect `contact_messages.json` via Render Shell
4. Verify in Django admin panel

## Backup Strategy

### Automatic Backups

- JSON file is automatically updated on every submission
- Messages are appended (never deleted automatically)
- Each message includes timestamp and database save status

### Manual Backup

Download the backup file regularly:

```bash
# Via Render Shell
cat backend/contact_backups/contact_messages.json > messages_backup.json

# Via management command
python manage.py view_contact_messages --export backup_$(date +%Y%m%d).json
```

## Security Notes

1. ✅ Contact endpoint is public (POST only)
2. ✅ Admin endpoints require authentication
3. ✅ Input validation prevents injection attacks
4. ✅ Rate limiting recommended (consider Django Ratelimit)
5. ✅ CORS configured for your frontend only
6. ✅ Backup files excluded from Git (`.gitignore`)

## Troubleshooting

### "Messages not appearing in admin"

- Check Render logs for errors
- Verify database file exists: `ls -la db.sqlite3`
- Check JSON backup: `cat contact_backups/contact_messages.json`
- Look for errors in application logs

### "Email not sending"

- Verify `EMAIL_HOST_USER` and `EMAIL_HOST_PASSWORD` are set
- Check if using Gmail App Password (not regular password)
- Review logs for SMTP errors
- Note: Messages still save even if email fails

### "Database resets after deployment"

- This is expected on some platforms
- JSON backup ensures no data loss
- Consider migrating to managed PostgreSQL for production

## Future Improvements

- [ ] Add PostgreSQL support for production
- [ ] Implement rate limiting on contact endpoint
- [ ] Add webhook notifications (Slack/Discord)
- [ ] Create admin dashboard for message management
- [ ] Add message read/unread status tracking
- [ ] Implement message search and filtering

## Support

For issues or questions:
1. Check application logs first
2. Review JSON backup file
3. Verify environment variables are set correctly
4. Check Django admin for database entries
