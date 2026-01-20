# Personal Portfolio

A modern, full-stack personal portfolio website showcasing projects, skills, and professional experience. Built with Django REST Framework backend and React (Vite) frontend, featuring a bold, art-driven UI with dynamic animations and theme support.

## 🚀 Live Demo

- **Frontend**: [https://personal-portfolio-three-delta-53.vercel.app](https://personal-portfolio-three-delta-53.vercel.app)
- **Backend API**: [https://personal-portfolio-gsee.onrender.com](https://personal-portfolio-gsee.onrender.com)

## ✨ Features

### Frontend
- **Modern React Architecture**: Built with Vite for lightning-fast development and optimized builds
- **Interactive Hero Section**: 3D tilt effects with distributed system visualization
- **Dynamic Theme System**: Light/Dark mode with smooth transitions
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for engaging user interactions
- **Performance Optimized**: Lazy loading, code splitting, and optimized assets
- **Project Showcase**: Interactive cards displaying portfolio projects with images and technologies
- **Skills Section**: Visual representation of technical skills and expertise
- **Certifications Display**: Professional certifications with credential verification
- **Contact Form**: Real-time validation and API integration

### Backend
- **Django REST Framework**: Robust API for contact form submissions
- **Admin Dashboard**: Full-featured Django admin for managing contact messages
- **SQLite Database**: Lightweight, serverless database solution
- **CORS Configuration**: Secure cross-origin resource sharing
- **Email Integration**: Optional email notifications for contact form submissions
- **Security Features**: HTTPS enforcement, HSTS, CSP headers in production
- **WhiteNoise**: Efficient static file serving
- **Environment-based Configuration**: Separate settings for development and production

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Icons**: Custom SVG icons

### Backend
- **Framework**: Django 6.0.1
- **API**: Django REST Framework 3.15.0
- **Database**: SQLite
- **CORS**: django-cors-headers 4.9.0
- **Static Files**: WhiteNoise 6.11.0
- **Server**: Gunicorn 23.0.0
- **Environment**: python-dotenv 1.0.0

### DevOps
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Version Control**: Git/GitHub

## 📁 Project Structure

```
personal-portfolio/
├── backend/                    # Django backend
│   ├── config/                # Django settings and configuration
│   │   ├── settings.py       # Main settings file
│   │   ├── urls.py           # Root URL configuration
│   │   └── wsgi.py           # WSGI application
│   ├── contact/               # Contact app
│   │   ├── models.py         # ContactMessage model
│   │   ├── serializers.py    # DRF serializers
│   │   ├── views.py          # API views
│   │   ├── urls.py           # Contact app URLs
│   │   └── admin.py          # Admin configuration
│   ├── manage.py             # Django management script
│   ├── requirements.txt      # Python dependencies
│   ├── build.sh              # Render deployment script
│   └── db.sqlite3            # SQLite database
│
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── about/        # About section
│   │   │   ├── certifications/ # Certifications section
│   │   │   ├── common/       # Reusable components (Button, Card, Badge, etc.)
│   │   │   ├── contact/      # Contact form
│   │   │   ├── footer/       # Footer component
│   │   │   ├── herosection/  # Hero with 3D effects
│   │   │   ├── navigation/   # Navigation bar
│   │   │   ├── projects/     # Projects showcase
│   │   │   ├── scrolltotop/  # Scroll to top button
│   │   │   ├── skills/       # Skills display
│   │   │   └── themes/       # Theme provider and toggle
│   │   ├── styles/           # Global styles and animations
│   │   ├── App.jsx           # Main application component
│   │   ├── main.jsx          # Application entry point
│   │   └── index.css         # Global CSS with Tailwind
│   ├── public/               # Static assets
│   │   └── assets/           # Images, icons, certificates
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── postcss.config.js     # PostCSS configuration
│   └── package.json          # Node dependencies
│
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **npm or yarn**

### Backend Setup (Windows PowerShell)

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Backend will be available at `http://127.0.0.1:8000/`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173/`

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Django
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# CORS
FRONTEND_URL=http://localhost:5173

# Email (optional)
EMAIL_HOST_USER=your-email@example.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Frontend Configuration

The frontend automatically connects to:
- `http://127.0.0.1:8000` in development
- `https://personal-portfolio-gsee.onrender.com` in production

Modify API endpoints in your axios configuration if needed.

## 📡 API Endpoints

### Public Endpoints
- `POST /api/contact/` - Submit contact form (AllowAny)

### Admin Endpoints (Authentication Required)
- `GET /api/contact-messages/` - List all contact messages
- `GET /api/contact-messages/{id}/` - Retrieve specific message
- `PUT /api/contact-messages/{id}/` - Update message
- `DELETE /api/contact-messages/{id}/` - Delete message

### Admin Panel
- `/admin/` - Django admin interface

## 🎨 Design System

### Color Palette
The portfolio uses a custom design token system with two themes:
- **Dark Theme**: Deep navy backgrounds with cyan/purple accents
- **Light Theme**: Clean whites with blue/purple accents

### Typography
- Expressive, characterful font families
- Optimized for readability with proper contrast ratios (WCAG AA/AAA)

### Animations
- CSS-first animations with Framer Motion enhancements
- Respects `prefers-reduced-motion` preference
- Interactive 3D tilt effects on hero section

## 🚢 Deployment

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod
```

**Environment Variables on Vercel**:
- No special configuration needed (static build)

### Backend (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. **Build Command**: `./build.sh`
4. **Start Command**: `gunicorn config.wsgi:application`

**Environment Variables on Render**:
```
DJANGO_SECRET_KEY=your-production-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=personal-portfolio-gsee.onrender.com
FRONTEND_URL=https://personal-portfolio-three-delta-53.vercel.app
```

## 🔒 Security Features

### Production Settings
- HTTPS enforcement (`SECURE_SSL_REDIRECT`)
- Secure cookies (`SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`)
- HTTP Strict Transport Security (HSTS)
- Content Security headers
- XSS protection
- Clickjacking protection (X-Frame-Options)

### CORS Configuration
- Whitelist-based origin validation
- Credentials support for authenticated requests
- Automatic localhost inclusion for development

## 📝 Contact Form Features

- Real-time field validation
- Server-side validation
- Success/error feedback
- Email notifications (configurable)
- Admin dashboard for message management
- Timestamps in IST timezone
- HTML email templates with modern design

## 🧪 Testing

```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests (if configured)
cd frontend
npm run test
```

## 📦 Build for Production

### Frontend

```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/`

### Backend

```bash
cd backend
python manage.py collectstatic --noinput
```

Static files will be in `backend/staticfiles/`

## 🤝 Contributing

This is a personal portfolio project. If you'd like to use it as a template:

1. Fork the repository
2. Update personal information in components
3. Replace images and assets in `frontend/public/assets/`
4. Modify color scheme in `tailwind.config.js` and theme files
5. Update API endpoints to match your backend

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Anirudha Basu Thakur**
- Portfolio: [https://personal-portfolio-three-delta-53.vercel.app](https://personal-portfolio-three-delta-53.vercel.app)
- Email: anirudha.basuthakur@gmail.com

## 🙏 Acknowledgments

- Django and Django REST Framework communities
- React and Vite teams
- Tailwind CSS and Framer Motion
- Vercel and Render for hosting platforms

---

**Note**: This portfolio emphasizes bold, art-driven UI design with purposeful animations and a coherent color palette. The codebase follows best practices for both frontend and backend development, with clear separation of concerns and maintainable architecture.