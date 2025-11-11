# Threads of Hope - Developer Guide

## Getting Started

### Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm or yarn
- Git
- VS Code (recommended)

### Development Environment Setup

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/threads-of-hope.git
cd threads-of-hope
```

2. **Install dependencies:**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configure environment:**

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env
```

4. **Setup database:**

```bash
cd backend
npm run migrate
npm run seed  # Optional: load sample data
```

5. **Start development servers:**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

---

## Project Structure

### Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── childController.js   # Child welfare logic
│   │   ├── trainingController.js
│   │   ├── donationController.js
│   │   └── ...
│   ├── models/
│   │   ├── index.js             # Model associations
│   │   ├── User.js
│   │   ├── Child.js
│   │   └── ...
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── childRoutes.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   ├── validation.js        # Input validation
│   │   ├── errorHandler.js      # Error handling
│   │   └── ...
│   ├── services/
│   │   ├── emailService.js      # Email functionality
│   │   ├── smsService.js        # SMS functionality
│   │   └── notificationService.js
│   ├── utils/
│   │   ├── jwt.js               # JWT utilities
│   │   └── fileUpload.js        # File upload handling
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
├── tests/
│   ├── auth.test.js
│   ├── child.test.js
│   └── setup.js
├── migrations/                   # Database migrations
├── seeders/                      # Database seeders
├── Dockerfile
├── package.json
└── jest.config.js
```

### Frontend Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── common/              # Reusable components
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── PrivateRoute.jsx
│   │   └── layout/              # Layout components
│   │       ├── Header.jsx
│   │       ├── Sidebar.jsx
│   │       └── Layout.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── admin/
│   │   │   └── Dashboard.jsx
│   │   ├── ngo/
│   │   │   └── Dashboard.jsx
│   │   ├── woman/
│   │   │   └── Dashboard.jsx
│   │   └── donor/
│   │       └── Dashboard.jsx
│   ├── services/
│   │   ├── api.js               # Axios configuration
│   │   ├── authService.js       # Auth API calls
│   │   └── socketService.js     # WebSocket handling
│   ├── store/
│   │   ├── index.js             # Redux store
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── notificationSlice.js
│   │       └── uiSlice.js
│   ├── locales/
│   │   ├── en.json              # English translations
│   │   ├── sw.json              # Swahili translations
│   │   └── fr.json              # French translations
│   ├── App.js                   # Main app component
│   ├── index.js                 # Entry point
│   ├── theme.js                 # MUI theme
│   └── i18n.js                  # Internationalization
├── Dockerfile
└── package.json
```

---

## Coding Standards

### JavaScript/Node.js

- Use ES6+ syntax
- Use async/await over callbacks
- Use const/let, never var
- Use arrow functions where appropriate
- Follow Airbnb style guide
- Use meaningful variable names
- Add JSDoc comments for functions

#### Example:

```javascript
/**
 * Register a new child in the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {Promise<void>}
 */
exports.registerChild = async (req, res, next) => {
  try {
    const caseNumber = `CH-${Date.now()}`;
    const child = await Child.create({
      ...req.body,
      registeredBy: req.user.id,
      caseNumber,
    });

    res.status(201).json({
      success: true,
      message: 'Child registered successfully',
      data: child,
    });
  } catch (error) {
    next(error);
  }
};
```

### React/JSX

- Use functional components
- Use hooks (useState, useEffect, etc.)
- Keep components small and focused
- Use PropTypes or TypeScript
- Follow React best practices
- Use meaningful component names

#### Example:

```jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import api from '../services/api';

const ChildList = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await api.get('/children');
      setChildren(response.data.data.children);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4">Children</Typography>
      {/* Render children list */}
    </Box>
  );
};

export default ChildList;
```

---

## API Development

### Creating a New Endpoint

1. **Create Controller:**

```javascript
// src/controllers/exampleController.js
exports.getExample = async (req, res, next) => {
  try {
    // Your logic here
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
```

2. **Create Route:**

```javascript
// src/routes/exampleRoutes.js
const express = require('express');
const { verifyToken } = require('../middleware/auth');
const exampleController = require('../controllers/exampleController');

const router = express.Router();

router.get('/', verifyToken, exampleController.getExample);

module.exports = router;
```

3. **Register Route:**

```javascript
// src/app.js
app.use('/api/example', require('./routes/exampleRoutes'));
```

### Adding Validation

```javascript
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

const exampleValidation = [
  body('email').isEmail(),
  body('name').notEmpty().trim(),
  validate,
];

router.post('/', exampleValidation, controller.create);
```

---

## Database Development

### Creating a Model

```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Example = sequelize.define('Example', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Additional fields
}, {
  tableName: 'examples',
  timestamps: true,
});

module.exports = Example;
```

### Creating a Migration

```bash
npx sequelize-cli migration:generate --name create-examples-table
```

```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('examples', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('examples');
  }
};
```

---

## Testing

### Unit Testing

```javascript
// tests/example.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Example API', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/api/example');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## Git Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Production hotfixes

### Commit Messages

Follow conventional commits:

```
feat: Add child registration endpoint
fix: Resolve authentication bug
docs: Update API documentation
test: Add tests for donation module
refactor: Improve error handling
```

### Pull Request Process

1. Create feature branch from `develop`
2. Make changes and commit
3. Push branch to remote
4. Create pull request
5. Request code review
6. Address feedback
7. Merge after approval

---

## Debugging

### Backend Debugging

Use VS Code debugger with this configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "program": "${workspaceFolder}/backend/src/server.js",
      "envFile": "${workspaceFolder}/backend/.env"
    }
  ]
}
```

### Frontend Debugging

- Use React DevTools browser extension
- Use Redux DevTools for state inspection
- Console logging: `console.log`, `console.error`

---

## Performance Optimization

### Backend

- Use database indexes
- Implement caching with Redis
- Optimize queries (avoid N+1)
- Use connection pooling
- Enable GZIP compression

### Frontend

- Code splitting
- Lazy loading
- Image optimization
- Minimize bundle size
- Use React.memo for expensive components

---

## Common Tasks

### Adding a New Feature

1. Create database model and migration
2. Create controller with business logic
3. Create routes
4. Add validation middleware
5. Create frontend components
6. Add API service calls
7. Write tests
8. Update documentation

### Adding a New Notification Type

1. Add type to Notification model enum
2. Update notification service
3. Create email template
4. Add translation strings
5. Test notification delivery

### Adding a New User Role

1. Update User model enum
2. Update authentication middleware
3. Create role-specific routes
4. Create dashboard component
5. Update navigation menu
6. Add translations

---

## Useful Commands

```bash
# Backend
npm run dev              # Start development server
npm test                 # Run tests
npm run migrate          # Run migrations
npm run migrate:undo     # Undo last migration
npm run seed             # Seed database
npm run lint             # Lint code

# Frontend
npm start                # Start development server
npm test                 # Run tests
npm run build            # Build for production
npm run lint             # Lint code

# Docker
docker-compose up        # Start all services
docker-compose down      # Stop all services
docker-compose logs -f   # View logs
```

---

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## Getting Help

- Check existing documentation
- Search GitHub issues
- Ask in team Slack channel
- Contact lead developer

---

## Contributing

See CONTRIBUTING.md for detailed contribution guidelines.


