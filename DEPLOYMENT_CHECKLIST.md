# 🚀 Quick Deployment Checklist

## Pre-Deployment

- [x] Contact view rewritten with validation
- [x] JSON backup system implemented
- [x] Logging added for all submissions
- [x] Email settings updated to use SMTP
- [x] Management command created
- [x] `.gitignore` updated
- [ ] Test locally

## Local Testing

```bash
# 1. Start backend
cd backend
python manage.py runserver

# 2. Test via frontend or curl
curl -X POST http://localhost:8000/api/contact/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone_number": "1234567890",
    "message": "This is a test message to verify everything works!"
  }'

# 3. Verify message saved
python manage.py view_contact_messages

# 4. Check JSON backup
cat contact_backups/contact_messages.json

# 5. Check Django admin
# Visit http://localhost:8000/admin/
```

## Render Deployment

### 1. Commit and Push Changes

```bash
git add .
git commit -m "feat: Overhaul contact system with triple redundancy"
git push origin main
```

### 2. Set Environment Variables on Render

**Required:**
```
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=personal-portfolio-gsee.onrender.com
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Optional (for email notifications):**
```
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password
```

**To get Gmail App Password:**
1. Enable 2FA on Google Account
2. Visit: https://myaccount.google.com/apppasswords
3. Generate App Password for "Mail"
4. Copy the 16-character password
5. Set as EMAIL_HOST_PASSWORD

### 3. Deploy

Render will automatically deploy when you push to main.

### 4. Verify Deployment

```bash
# Check deployment logs
# Look for: "Contact message saved to database"
# Look for: "Contact message backed up to JSON"

# Test the deployed endpoint
curl -X POST https://personal-portfolio-gsee.onrender.com/api/contact/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Test",
    "email": "test@example.com",
    "message": "Testing production deployment!"
  }'
```

### 5. Access Messages in Production

**Method 1: Django Admin** (Recommended)
```
https://personal-portfolio-gsee.onrender.com/admin/
```

**Method 2: Render Shell**
```bash
# Open Shell from Render dashboard, then:
python manage.py view_contact_messages
# or
cat contact_backups/contact_messages.json
```

**Method 3: Check Logs**
```
Render Dashboard → Logs → Search for "CONTACT FORM SUBMISSION"
```

## Post-Deployment Testing

### Test 1: Submit Valid Message
```bash
curl -X POST https://your-backend.onrender.com/api/contact/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Real User",
    "email": "real@example.com",
    "phone_number": "+1234567890",
    "message": "Hello! I would like to get in touch regarding your portfolio."
  }'

# Expected response:
{
  "success": true,
  "message": "Your message has been received successfully...",
  "data": { ... }
}
```

### Test 2: Test Validation
```bash
curl -X POST https://your-backend.onrender.com/api/contact/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A",
    "email": "invalid",
    "message": "Short"
  }'

# Expected response (400 Bad Request):
{
  "success": false,
  "errors": {
    "name": ["Name must be at least 2 characters long."],
    "email": ["Enter a valid email address."],
    "message": ["Message must be at least 10 characters long."]
  }
}
```

### Test 3: Verify Message Receipt

1. **Check Django Admin:**
   - Go to admin panel
   - Navigate to Contact messages
   - Should see the new message

2. **Check JSON Backup:**
   ```bash
   # In Render Shell
   cat contact_backups/contact_messages.json
   ```

3. **Check Logs:**
   - Look for "CONTACT FORM SUBMISSION" in Render logs

4. **Check Email (if configured):**
   - Should receive email notification at EMAIL_HOST_USER address

## Rollback Plan

If something goes wrong:

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or checkout previous version
git log --oneline
git checkout <previous-commit-hash>
git push origin main --force
```

## Monitoring

### What to Monitor:

1. **Logs** - Check for errors after deployment
2. **Admin Panel** - Verify messages are being saved
3. **JSON Backup** - Ensure backup file is being created
4. **Email** - Confirm notifications are being sent (if configured)

### Log Entries to Look For:

✅ Success indicators:
```
Contact message saved to database: user@example.com
Contact message backed up to JSON: user@example.com
Email notification sent successfully
```

⚠️ Warning indicators:
```
Failed to save to database: [error]
SMTP not configured, skipping email send
Email backend is set to dummy
```

❌ Error indicators:
```
Failed to backup contact message to JSON: [error]
Failed to send email notification: [error]
Unexpected error processing contact form: [error]
```

## Troubleshooting

### Issue: "Messages not appearing in admin"

**Solution:**
1. Check Render logs for database errors
2. Verify `db.sqlite3` file exists
3. Check JSON backup as fallback
4. Run migrations: `python manage.py migrate`

### Issue: "Email not sending"

**Solution:**
1. Verify EMAIL_HOST_USER is set
2. Verify EMAIL_HOST_PASSWORD is set (App Password, not regular password)
3. Check if Gmail has App Passwords enabled (requires 2FA)
4. Check logs for SMTP errors
5. Note: Messages still save even if email fails

### Issue: "500 Internal Server Error"

**Solution:**
1. Check Render logs for detailed error
2. Verify all environment variables are set
3. Check if database migrations are complete
4. Verify SECRET_KEY is set

### Issue: "CORS errors from frontend"

**Solution:**
1. Verify FRONTEND_URL is set correctly
2. Ensure no trailing slash in FRONTEND_URL
3. Check CORS_ALLOWED_ORIGINS in settings

## Success Criteria

✅ All checks passed:

- [ ] Code deployed to Render successfully
- [ ] Test message submitted via frontend
- [ ] Message appears in Django admin
- [ ] Message appears in JSON backup file
- [ ] Message logged in application logs
- [ ] Email received (if EMAIL configured)
- [ ] Validation working (rejects invalid input)
- [ ] Frontend shows success message
- [ ] No errors in Render logs

## Next Steps

After successful deployment:

1. 📧 Set up email notifications (if not already done)
2. 🔐 Consider adding rate limiting to prevent spam
3. 📊 Monitor message volume
4. 🗄️ Consider migrating to PostgreSQL for production (optional)
5. 🔔 Set up Slack/Discord webhook for instant notifications (optional)

## Support Resources

- **Production Guide:** `backend/CONTACT_SYSTEM_GUIDE.md`
- **Summary:** `CONTACT_OVERHAUL_SUMMARY.md`
- **View Messages:** `python manage.py view_contact_messages --help`

---

**Ready to deploy? Follow the steps above and check each box as you go!**
