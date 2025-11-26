# Threads of Hope

A secure, cross-platform web and mobile application for coordinating child welfare tracking and empowering women through skills development in Sub-Saharan Africa.

## 📦 Repository Access

**This is a public GitHub repository.** You can access it at:
- **GitHub URL**: https://github.com/Karabo-jpg/Threads_of_hope
- **Clone Command**: `git clone https://github.com/Karabo-jpg/Threads_of_hope.git`

The repository contains all source code, configuration files, and documentation needed to run the application locally or deploy it to production.

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

## 🚀 Quick Start - Step-by-Step Setup Instructions

Follow these instructions carefully to set up and run the Threads of Hope application on your local machine.

### Step 1: Prerequisites

Before you begin, ensure you have the following installed on your computer:

1. **Node.js** (version 18.x or higher)
   - Download from: https://nodejs.org/
   - Verify installation by running: `node --version` (should show v18.x or higher)
   - Verify npm is installed: `npm --version`

2. **PostgreSQL** (version 14.x or higher) OR **Supabase Account** (free cloud database)
   - PostgreSQL: Download from https://www.postgresql.org/download/
   - OR use Supabase (recommended for quick setup): https://supabase.com (free tier available)

3. **Git** (to clone the repository)
   - Download from: https://git-scm.com/downloads
   - Verify installation: `git --version`

### Step 2: Download the Project

1. **Open your terminal/command prompt** (PowerShell on Windows, Terminal on Mac/Linux)

2. **Navigate to the folder where you want to save the project** (e.g., Desktop or Documents)
   ```bash
   cd Desktop
   ```

3. **Clone the repository from GitHub**
   ```bash
   git clone https://github.com/Karabo-jpg/Threads_of_hope.git
   ```

4. **Navigate into the project folder**
   ```bash
   cd Threads_of_hope
   ```

   You should now be in the project root directory.

### Step 3: Backend Setup

1. **Navigate to the backend folder**
   ```bash
   cd backend
   ```

2. **Install all backend dependencies**
   ```bash
   npm install
   ```
   This will take 1-2 minutes. Wait for it to complete successfully.

3. **Create environment configuration file**
   - Copy the example environment file:
     ```bash
     # On Windows (PowerShell):
     Copy-Item .env.example .env
     
     # On Mac/Linux:
     cp .env.example .env
     ```

4. **Configure your database connection**
   - Open the `.env` file in a text editor (Notepad, VS Code, etc.)
   - **If using Supabase (recommended):**
     - Sign up at https://supabase.com (free)
     - Create a new project
     - Go to Project Settings > Database
     - Copy your connection details and update these variables in `.env`:
       ```
       DB_HOST=your-supabase-host.supabase.co
       DB_PORT=5432
       DB_NAME=postgres
       DB_USER=postgres
       DB_PASSWORD=your-supabase-password
       ```
   - **If using local PostgreSQL:**
     - Update these variables in `.env`:
       ```
       DB_HOST=localhost
       DB_PORT=5432
       DB_NAME=threadsofhope
       DB_USER=postgres
       DB_PASSWORD=your-postgres-password
       ```
   - **Set JWT secret** (any random string, e.g., `mySecretKey123!@#`):
     ```
     JWT_SECRET=your-random-secret-key-here
     ```
   - **Set frontend URL** (for CORS):
     ```
     FRONTEND_URL=http://localhost:3000
     ```

5. **Create database tables**
   ```bash
   npm run sync:db
   ```
   You should see: `✅ All tables created successfully!`

6. **Seed test accounts** (optional, for testing)
   ```bash
   npm run seed:test-accounts
   ```

7. **Start the backend server**
   ```bash
   npm start
   ```
   You should see: `Server running on port 5000` or similar.

   **Keep this terminal window open** - the backend must stay running.

### Step 4: Frontend Setup

1. **Open a NEW terminal/command prompt window** (keep the backend running in the first terminal)

2. **Navigate to the project root, then into frontend folder**
   ```bash
   cd path/to/Threads_of_hope/frontend
   ```
   (Replace `path/to` with your actual path)

3. **Install all frontend dependencies**
   ```bash
   npm install
   ```
   This will take 2-3 minutes. Wait for it to complete.

4. **Create environment configuration file**
   ```bash
   # On Windows (PowerShell):
   Copy-Item .env.example .env
   
   # On Mac/Linux:
   cp .env.example .env
   ```

5. **Configure frontend environment**
   - Open the `.env` file in the frontend folder
   - Set the backend API URL:
     ```
     REACT_APP_API_URL=http://localhost:5000
     ```

6. **Start the frontend development server**
   ```bash
   npm start
   ```
   Your browser should automatically open to `http://localhost:3000`
   - If it doesn't open automatically, manually go to: http://localhost:3000

### Step 5: Verify Installation

1. **Check that both servers are running:**
   - Backend: Terminal 1 should show the server is running
   - Frontend: Terminal 2 should show "Compiled successfully!" and your browser should be open

2. **Test the application:**
   - You should see the login page in your browser
   - Try logging in with test credentials (see Default Credentials section below)

3. **If you see errors:**
   - Check that both terminals show no error messages
   - Verify your database connection in the backend `.env` file
   - Make sure both servers are running (backend on port 5000, frontend on port 3000)

### Troubleshooting

**Problem: "npm install" fails**
- Solution: Make sure you have Node.js 18+ installed. Try deleting `node_modules` folder and `package-lock.json`, then run `npm install` again.

**Problem: "Cannot connect to database"**
- Solution: Double-check your database credentials in `backend/.env`. If using Supabase, make sure your project is active and the password is correct.

**Problem: Frontend shows "Network Error"**
- Solution: Make sure the backend is running on port 5000. Check `backend/.env` has `FRONTEND_URL=http://localhost:3000`.

**Problem: Port already in use**
- Solution: Another application is using port 3000 or 5000. Close other applications or change the port in the configuration files.

**Problem: Tables not created**
- Solution: Run `npm run sync:db` again in the backend folder. Check your database connection first.

### Alternative: Using Docker (Advanced)

If you have Docker installed, you can run everything with one command:

```bash
docker-compose up -d
```

This will start both backend and frontend automatically. However, you still need to configure the `.env` files as described above.

### ✅ Setup Complete - What You Should See

When everything is set up correctly:

1. **Backend Terminal** should show:
   ```
   ✅ Database connection established successfully.
   Server running on port 5000
   ```

2. **Frontend Terminal** should show:
   ```
   Compiled successfully!
   webpack compiled successfully
   ```

3. **Browser** should automatically open to:
   ```
   http://localhost:3000
   ```
   And display the Threads of Hope login page.

4. **You can now log in** using the test credentials below.

If you see all of the above, congratulations! Your setup is complete and the application is running successfully. 🎉

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


