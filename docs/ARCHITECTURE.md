# Threads of Hope - System Architecture

## Overview

Threads of Hope is built using a modern, scalable microservices-oriented architecture with a React frontend, Node.js/Express backend, and PostgreSQL database.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐ │
│  │  React Web App │  │ React Native   │  │  Mobile Browser  │ │
│  │   (Port 3000)  │  │   (iOS/Android)│  │                  │ │
│  └────────────────┘  └────────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LOAD BALANCER / CDN                          │
│                      (AWS CloudFront)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Node.js/Express API (Port 5000)                │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  │  │  Auth    │  │  Child   │  │ Training │  │ Donation │  │ │
│  │  │ Services │  │ Services │  │ Services │  │ Services │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐
│   PostgreSQL     │  │    Redis     │  │  Socket.IO       │
│   (Port 5432)    │  │  (Port 6379) │  │  (Real-time)     │
│                  │  │              │  │                  │
│  Primary Database│  │ Cache/Queue  │  │  Notifications   │
└──────────────────┘  └──────────────┘  └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │SendGrid  │  │ Twilio   │  │  AWS S3  │  │  CloudWatch  │   │
│  │  Email   │  │   SMS    │  │  Storage │  │  Monitoring  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

#### Web Application
- **Framework**: React 18
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **UI Library**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client
- **Internationalization**: i18next
- **Form Management**: Formik + Yup
- **Charts**: Recharts

#### Mobile Application
- **Framework**: React Native
- **Navigation**: React Navigation
- **Same state management and libraries as web

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **ORM**: Sequelize
- **Authentication**: JWT, Passport.js
- **Validation**: Express-validator
- **Documentation**: Swagger/OpenAPI
- **Real-time**: Socket.io
- **File Upload**: Multer
- **Email**: SendGrid
- **SMS**: Twilio
- **Logging**: Winston
- **Security**: Helmet, CORS

### Database

- **Primary Database**: PostgreSQL 14+
- **Caching**: Redis
- **Object Storage**: AWS S3

### DevOps

- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions / GitLab CI
- **Cloud Platform**: AWS (EC2, RDS, S3, CloudFront)
- **Monitoring**: CloudWatch, Sentry
- **Load Balancing**: AWS ELB
- **SSL/TLS**: Let's Encrypt

---

## System Components

### 1. Authentication & Authorization

**Components:**
- JWT token-based authentication
- Role-based access control (RBAC)
- OAuth 2.0 integration (Google)
- 2FA support (TOTP)
- Password reset functionality

**Security Features:**
- Bcrypt password hashing (10 rounds)
- Token expiration and refresh
- Rate limiting on auth endpoints
- Account lockout after failed attempts
- Email verification
- Audit logging

### 2. User Management

**User Roles:**
- Admin (full system access)
- NGO Partner (child management, training creation)
- Woman (training enrollment, progress tracking)
- Donor (donations, impact viewing)

**Features:**
- Profile management
- Role-specific dashboards
- Multi-language support
- Notification preferences

### 3. Child Welfare Module

**Features:**
- Child registration with detailed profiles
- Welfare event timeline
- Medical and education history
- Document management
- Case number assignment
- Search and filtering
- Export functionality

**Access Control:**
- NGOs can only access their registered children
- Admins have full access
- Audit trail for all changes

### 4. Training & Empowerment Module

**Features:**
- Program creation and management
- Enrollment workflow
- Progress tracking
- Certificate generation
- Badge system
- Proof of progress upload

**Workflow:**
1. NGO creates program
2. Woman enrolls
3. Approval process
4. Progress updates
5. Certificate issuance

### 5. Donation & Impact Module

**Features:**
- Multiple donation types
- Anonymous donations
- Recurring donations
- Payment processing integration
- Impact report creation
- Fund allocation tracking
- Receipt generation

**Transparency:**
- Detailed impact reports
- Photo documentation
- Beneficiary updates
- Financial breakdowns

### 6. Collaboration Platform

**Features:**
- Collaboration requests
- Resource sharing
- NGO-to-NGO communication
- Document exchange
- Access control levels

### 7. Messaging System

**Features:**
- Direct messaging
- Inbox/Sent management
- Read receipts
- Message archiving
- Priority levels

### 8. Notification System

**Channels:**
- In-app notifications
- Email (SendGrid)
- SMS (Twilio)
- Push notifications (planned)

**Triggers:**
- Enrollment approvals
- Donation receipts
- Program updates
- Child events
- System alerts

### 9. Admin Panel

**Features:**
- Comprehensive dashboard
- User approval workflow
- System statistics
- Audit log viewer
- Data export
- System health monitoring

---

## Database Schema

### Core Tables

#### users
- Primary user table
- Stores authentication data
- Role-based information
- Profile details

#### ngo_profiles
- Extended NGO information
- Organization details
- Verification status

#### children
- Child registration data
- Medical/education history
- Case management

#### child_events
- Timeline of events
- Welfare records
- Historical data

#### training_programs
- Program details
- Curriculum
- Enrollment capacity

#### enrollments
- Program enrollment records
- Progress tracking
- Certificate status

#### donations
- Donation records
- Payment information
- Allocation tracking

#### impact_reports
- NGO-submitted reports
- Fund usage documentation
- Photos and metrics

#### messages
- User-to-user communication
- Read status

#### notifications
- System notifications
- Delivery status

#### audit_logs
- System activity tracking
- Compliance logging

### Relationships

```sql
users (1) ──── (1) ngo_profiles
users (1) ──── (M) children (registeredBy)
users (1) ──── (M) training_programs (createdBy)
users (1) ──── (M) enrollments
users (1) ──── (M) donations (donorId)
users (1) ──── (M) messages (sender/recipient)
users (1) ──── (M) notifications

children (1) ──── (M) child_events
training_programs (1) ──── (M) enrollments
donations (1) ──── (M) impact_reports
```

---

## API Architecture

### RESTful Principles

- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response format
- Consistent error handling
- Standard status codes

### Endpoint Structure

```
/api/v1/
├── /auth
│   ├── POST /register
│   ├── POST /login
│   └── GET /profile
├── /children
│   ├── GET /
│   ├── POST /
│   ├── GET /:id
│   └── POST /:id/events
├── /training
│   ├── GET /
│   ├── POST /
│   └── POST /:id/enroll
├── /donations
│   ├── GET /
│   ├── POST /
│   └── POST /:id/impact-reports
├── /messages
├── /notifications
└── /admin
```

### Middleware Stack

```
Request
  ↓
CORS
  ↓
Helmet (Security Headers)
  ↓
Body Parser
  ↓
Rate Limiter
  ↓
Authentication
  ↓
Authorization (Role Check)
  ↓
Validation
  ↓
Audit Logger
  ↓
Route Handler
  ↓
Error Handler
  ↓
Response
```

---

## Security Architecture

### Authentication Flow

```
1. User submits credentials
2. Server validates credentials
3. Password hash comparison
4. JWT token generated
5. Token returned to client
6. Client stores token
7. Token sent in subsequent requests
8. Server validates token
9. User context established
```

### Authorization Levels

1. **Public**: No authentication required
2. **Authenticated**: Valid token required
3. **Role-Based**: Specific role required
4. **Owner-Based**: Resource ownership verified
5. **Admin**: Admin role required

### Data Protection

- **At Rest**: Database encryption
- **In Transit**: HTTPS/TLS 1.3
- **Passwords**: Bcrypt hashing
- **Tokens**: Signed JWT
- **Sensitive Data**: Field-level encryption
- **File Uploads**: Virus scanning

---

## Scalability Considerations

### Horizontal Scaling

- Stateless API design
- Load balancer distribution
- Session storage in Redis
- Database read replicas

### Caching Strategy

- Redis for session data
- API response caching
- Static asset CDN
- Database query caching

### Performance Optimization

- Database indexing
- Query optimization
- Connection pooling
- Lazy loading
- Code splitting (frontend)
- Image optimization
- GZIP compression

---

## Monitoring & Observability

### Logging

- **Application Logs**: Winston
- **Access Logs**: Morgan
- **Error Logs**: Sentry
- **Audit Logs**: Database

### Metrics

- Response times
- Error rates
- User activity
- System resources
- Database performance

### Alerts

- Error rate threshold
- Response time degradation
- Database connection issues
- Disk space warnings
- Security events

---

## Disaster Recovery

### Backup Strategy

- **Database**: Daily automated backups
- **Files**: S3 versioning
- **Retention**: 30 days
- **Testing**: Monthly restore tests

### High Availability

- Multi-AZ deployment
- Automated failover
- Load balancing
- Database replication

### Recovery Plan

1. Identify issue
2. Switch to backup
3. Investigate root cause
4. Apply fix
5. Restore normal operation
6. Post-mortem analysis

---

## Future Enhancements

- Microservices architecture
- GraphQL API
- Machine learning for impact prediction
- Blockchain for donation transparency
- Progressive Web App (PWA)
- AI chatbot support
- Advanced analytics dashboard
- Integration with payment gateways
- Video conferencing for mentorship
- Mobile offline support

---

## Compliance

- GDPR compliance
- Data protection regulations
- Regular security audits
- Penetration testing
- Compliance certifications


