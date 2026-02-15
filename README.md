# Personal Portfolio

A modern, full-stack personal portfolio website showcasing projects, skills, and professional experience. Built with a Node.js/Express backend and React (Vite) frontend, featuring a bold, art-driven UI with dynamic animations and theme support.

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
- **Node.js + Express**: Fast, lightweight API for contact form submissions
- **MySQL Database**: Reliable relational database for contact messages
- **JWT Authentication**: Secure admin API with token-based auth
- **Nodemailer**: HTML email notifications via Gmail SMTP
- **CORS + Helmet**: Secure cross-origin handling and HTTP headers
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
- **Runtime**: Node.js 18+
- **Framework**: Express 4
- **Database**: MySQL (mysql2)
- **Auth**: JSON Web Tokens (jsonwebtoken + bcryptjs)
- **Email**: Nodemailer
- **Security**: Helmet, CORS
- **Validation**: express-validator

### DevOps
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Version Control**: Git/GitHub

## 📁 Project Structure

```
personal-portfolio/
├── server/                     # Node.js/Express backend
│   ├── src/
│   │   ├── index.js           # Express app entry point
│   │   ├── db/
│   │   │   ├── connection.js  # MySQL pool
│   │   │   └── migrate.js     # Schema migrations + admin seed
│   │   ├── routes/
│   │   │   ├── contact.js     # Public contact API
│   │   │   └── admin.js       # Admin API (JWT protected)
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT auth middleware
│   │   └── services/
│   │       └── email.js       # Nodemailer email service
│   ├── package.json           # Node dependencies
│   ├── build.sh               # Render deployment script
│   └── .env.example           # Environment template
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
- **Node.js 18+**
- **npm**
- **MySQL 8+** (local or cloud — e.g. PlanetScale, Aiven, Railway)

### Backend Setup

```bash
# Navigate to server directory
cd server

# Copy env template and fill in your values
cp .env.example .env

# Install dependencies
npm install

# Run migrations (creates tables + optional admin user)
npm run migrate

# Start development server (auto-restarts on file changes)
npm run dev
```

Backend will be available at `http://localhost:8000/`

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

Create a `.env` file in the `server/` directory (see `.env.example`):

```env
# Server
PORT=8000
NODE_ENV=development

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=portfolio

# JWT
JWT_SECRET=your-random-secret-here

# Admin user (auto-created on migrate)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme123

# CORS
FRONTEND_URL=http://localhost:5173

# Email — Gmail SMTP (optional)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
CONTACT_NOTIFICATION_EMAIL=your-email@gmail.com
```

### Frontend Configuration

The frontend automatically connects to:
- `http://127.0.0.1:8000` in development
- `https://personal-portfolio-gsee.onrender.com` in production

Modify API endpoints in your axios configuration if needed.

## 📡 API Endpoints

### Public Endpoints
- `POST /api/contact/` - Submit contact form (AllowAny)

### Admin Endpoints (JWT Authentication Required)
- `POST /api/admin/login` - Login and receive JWT token
- `GET /api/admin/contact-messages` - List all contact messages
- `GET /api/admin/contact-messages/:id` - Retrieve specific message
- `PUT /api/admin/contact-messages/:id` - Update message (mark read, etc.)
- `DELETE /api/admin/contact-messages/:id` - Delete message

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
3. **Root Directory**: `server`
4. **Build Command**: `./build.sh`
5. **Start Command**: `node src/index.js`

**Environment Variables on Render**:
```
NODE_ENV=production
PORT=8000
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=portfolio
JWT_SECRET=your-production-secret
FRONTEND_URL=https://personal-portfolio-three-delta-53.vercel.app
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-admin-password
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

## 🔒 Security Features

### Production Settings
- Helmet.js for secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
- JWT-based admin authentication with bcrypt password hashing
- Input validation via express-validator

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

## 📦 Build for Production

### Frontend

```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/`

### Backend

```bash
cd server
npm ci --production
npm run migrate
```

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

- Node.js, Express, and MySQL communities
- React and Vite teams
- Tailwind CSS and Framer Motion
- Vercel and Render for hosting platforms

---

**Note**: This portfolio emphasizes bold, art-driven UI design with purposeful animations and a coherent color palette. The codebase follows best practices for both frontend and backend development, with clear separation of concerns and maintainable architecture.