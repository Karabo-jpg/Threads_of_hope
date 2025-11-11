# Threads of Hope

A secure, cross-platform web and mobile application for coordinating child welfare tracking and empowering women through skills development in Sub-Saharan Africa.

## 🌟 Overview

**Threads of Hope** enables:
- NGOs to track and coordinate child welfare
- Women to access training and mentorship programs
- Donors to transparently track their impact
- Organizations to collaborate effectively

## 👥 User Roles

1. **Admin**: Full system access, user management, analytics
2. **NGO/Partner**: Child registration, welfare tracking, collaboration
3. **Woman**: Training enrollment, progress tracking, skill development
4. **Donor**: Fund allocation, impact reporting, transparent tracking

## 🚀 Features

### Core Functionality
- ✅ Multi-role onboarding and registration
- ✅ Child welfare tracking with complete history
- ✅ Women empowerment programs with certifications
- ✅ Transparent donation tracking and impact reporting
- ✅ NGO collaboration platform with messaging
- ✅ Real-time notifications (email, SMS, push)
- ✅ Comprehensive admin dashboard with analytics
- ✅ Multi-language support (English, Swahili, French)

### Security & Compliance
- 🔒 JWT and OAuth 2.0 authentication
- 🔒 Role-based access control (RBAC)
- 🔒 HTTPS encryption
- 🔒 Optional 2FA
- 🔒 GDPR compliance
- 🔒 Comprehensive audit logging
- 🔒 Daily automated backups

## 🛠️ Technology Stack

### Frontend
- **Web**: React with TypeScript
- **Mobile**: React Native (iOS & Android)
- **State Management**: Redux Toolkit
- **UI Framework**: Material-UI / Tailwind CSS
- **Localization**: i18next

### Backend
- **Framework**: Node.js with Express
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT, Passport.js
- **API Documentation**: Swagger/OpenAPI

### Infrastructure
- **Cloud**: AWS (supports GCP/Azure)
- **Email**: SendGrid
- **SMS**: Twilio
- **Storage**: AWS S3
- **CDN**: CloudFront

## 📁 Project Structure

```
threads-of-hope/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Route controllers
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth, validation, error handling
│   │   ├── services/    # Business logic
│   │   ├── utils/       # Utility functions
│   │   └── app.js       # Express app setup
│   ├── tests/           # Test files
│   ├── migrations/      # Database migrations
│   └── package.json
├── frontend/            # React web application
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── store/       # Redux store
│   │   ├── hooks/       # Custom hooks
│   │   ├── utils/       # Utilities
│   │   ├── locales/     # Translation files
│   │   └── App.tsx
│   └── package.json
├── mobile/              # React Native app
│   ├── src/
│   ├── ios/
│   ├── android/
│   └── package.json
├── docs/                # Documentation
│   ├── API.md
│   ├── USER_GUIDE.md
│   ├── DEVELOPER.md
│   ├── DEPLOYMENT.md
│   └── ARCHITECTURE.md
├── scripts/             # Deployment scripts
└── docker-compose.yml   # Docker configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm or yarn
- Docker (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/threads-of-hope.git
cd threads-of-hope
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run migrate
npm run seed
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

### Using Docker
```bash
docker-compose up -d
```

## 🔑 Default Credentials

For testing purposes (change in production):

```
Admin:
Email: admin@threadsofhope.org
Password: Admin@2024

NGO Partner:
Email: ngo@example.org
Password: NGO@2024

Woman:
Email: woman@example.com
Password: Woman@2024

Donor:
Email: donor@example.com
Password: Donor@2024
```

## 📚 Documentation

- [API Reference](docs/API.md)
- [User Guide](docs/USER_GUIDE.md)
- [Developer Guide](docs/DEVELOPER.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test
npm run test:coverage

# Frontend tests
cd frontend
npm test
npm run test:coverage
```

## 📦 Deployment

See [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

Quick deploy to AWS:
```bash
npm run deploy:aws
```

## 🌍 Localization

The application supports:
- 🇬🇧 English (default)
- 🇰🇪 Swahili
- 🇫🇷 French

## 🤝 Contributing

This project follows Agile Scrum methodology. Please read our contribution guidelines before submitting PRs.

## 📄 License

This project is licensed under the MIT License.

## 📧 Support

For support, email support@threadsofhope.org

## 🙏 Acknowledgments

Built to empower communities in Sub-Saharan Africa through technology and collaboration.

---

Made with ❤️ for communities in need


