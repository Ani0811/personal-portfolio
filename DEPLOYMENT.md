# Render Deployment Guide

## Prerequisites
✅ Gunicorn, WhiteNoise, dj-database-url, psycopg2-binary installed
✅ settings.py configured for production
✅ Gmail App Password for email notifications

## Deploy to Render

### 1. Create MySQL Database (Optional - or use PostgreSQL)
1. Go to Render Dashboard → New → PostgreSQL (or MySQL via Docker)
2. Name: `portfolio-db`
3. Database: `portfolio_db`
4. User: `portfolio_user`
5. **Copy the Internal Database URL** (starts with `postgresql://` or `mysql://`)

### 2. Deploy Backend (Django)
1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name**: `portfolio-backend`
   - **Runtime**: Python 3
   - **Build Command**: `cd backend && chmod +x build.sh && ./build.sh`
   - **Start Command**: `cd backend && gunicorn config.wsgi:application`

4. **Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   DJANGO_SECRET_KEY=<auto-generate or use your own 50-char random string>
   DJANGO_DEBUG=False
   DJANGO_ALLOWED_HOSTS=<your-render-backend-url>.onrender.com
   DATABASE_URL=<paste-internal-database-url-from-step-1>
   EMAIL_HOST_USER=anirudha.basuthakur@gmail.com
   EMAIL_HOST_PASSWORD=mrju qzjt nmow yhgz
   CORS_ALLOWED_ORIGINS=https://<your-frontend-url>.netlify.app,https://<your-frontend-url>.vercel.app
   PYTHON_VERSION=3.11.0
   ```

5. Click **Create Web Service**

### 3. After First Deploy
1. Open your backend URL: `https://<your-service>.onrender.com/admin/`
2. Create a superuser via Render Shell:
   ```bash
   python manage.py createsuperuser
   ```

### 4. Deploy Frontend (Vite React)
**Option A: Netlify**
1. Connect GitHub repo
2. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
3. Environment Variables:
   ```
   VITE_API_URL=https://<your-backend>.onrender.com
   ```

**Option B: Vercel**
1. Import GitHub repo
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment Variables:
   ```
   VITE_API_URL=https://<your-backend>.onrender.com
   ```

### 5. Update CORS Settings
After deploying frontend, update backend environment variable:
```
CORS_ALLOWED_ORIGINS=https://your-deployed-frontend.netlify.app
```
(Or comma-separated if you have multiple domains)

### 6. Test Contact Form
1. Visit your deployed frontend
2. Submit a contact form
3. Check your Gmail for the notification email
4. Verify message saved in Django admin

---

## Troubleshooting

**Static files not loading?**
- Run `python manage.py collectstatic` (automatically done in build.sh)
- Check STATIC_ROOT and WhiteNoise middleware order

**Database connection error?**
- Verify DATABASE_URL is correct
- Check database is running and accessible

**CORS errors?**
- Add your frontend URL to CORS_ALLOWED_ORIGINS
- Include both http and https if testing locally

**Email not sending?**
- Verify EMAIL_HOST_USER and EMAIL_HOST_PASSWORD are set
- Check Gmail App Password is correct (16 chars, no spaces)

---

## Environment Variables Summary

**Backend (Render Web Service)**:
```
DJANGO_SECRET_KEY=<50-char-random-string>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=your-backend.onrender.com
DATABASE_URL=postgresql://user:pass@host:5432/db
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
CORS_ALLOWED_ORIGINS=https://your-frontend.netlify.app
PYTHON_VERSION=3.11.0
```

**Frontend (Netlify/Vercel)**:
```
VITE_API_URL=https://your-backend.onrender.com
```
