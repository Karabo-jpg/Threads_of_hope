# Threads of Hope - API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_token>
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "woman|donor|ngo|admin",
  "phoneNumber": "+254712345678",
  "country": "Kenya"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "role": "woman",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token"
  }
}
```

### Login

**POST** `/auth/login`

Authenticate and receive access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "role": "woman"
    },
    "token": "jwt_token"
  }
}
```

### Get Profile

**GET** `/auth/profile`

Get current user profile (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "woman"
  }
}
```

---

## Child Welfare Endpoints

### Register Child

**POST** `/children`

Register a new child (NGO/Admin only).

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "dateOfBirth": "2015-06-15",
  "gender": "female",
  "currentStatus": "orphan",
  "currentLocation": "Nairobi",
  "medicalConditions": "None",
  "educationLevel": "Primary"
}
```

### Get All Children

**GET** `/children?page=1&limit=20&status=orphan&search=Jane`

Get list of children (NGO/Admin only).

### Get Child by ID

**GET** `/children/:id`

Get detailed information about a specific child.

### Add Child Event

**POST** `/children/:id/events`

Record a new event for a child.

**Request Body:**
```json
{
  "eventType": "health_checkup",
  "eventDate": "2024-01-15",
  "title": "Annual Health Checkup",
  "description": "Routine health examination completed",
  "outcome": "All vitals normal"
}
```

---

## Training Program Endpoints

### Get All Programs

**GET** `/training?page=1&limit=20&category=sewing&status=active`

Get list of training programs.

### Create Program

**POST** `/training`

Create a new training program (NGO/Admin only).

**Request Body:**
```json
{
  "title": "Basic Tailoring Skills",
  "description": "Learn fundamental tailoring techniques",
  "category": "tailoring",
  "duration": 60,
  "skillLevel": "beginner",
  "maxParticipants": 20,
  "startDate": "2024-02-01",
  "location": "Nairobi Community Center"
}
```

### Enroll in Program

**POST** `/training/:id/enroll`

Enroll in a training program (Woman role).

### Update Progress

**PUT** `/training/enrollments/:enrollmentId/progress`

Update enrollment progress.

**Request Body:**
```json
{
  "progress": 75,
  "proofOfProgress": ["url_to_image1", "url_to_image2"]
}
```

---

## Donation Endpoints

### Make Donation

**POST** `/donations`

Make a donation (Donor role).

**Request Body:**
```json
{
  "recipientType": "child|woman|ngo|program|general",
  "recipientId": "uuid",
  "ngoId": "uuid",
  "amount": 100.00,
  "currency": "USD",
  "paymentMethod": "credit_card",
  "purpose": "Education support",
  "message": "Hope this helps!",
  "isAnonymous": false
}
```

### Get Donations

**GET** `/donations?page=1&limit=20&recipientType=child`

Get donation history.

### Get Donation Statistics

**GET** `/donations/statistics`

Get donation statistics for current user.

### Create Impact Report

**POST** `/donations/:id/impact-reports`

Create impact report for a donation (NGO only).

**Request Body:**
```json
{
  "amountUsed": 50.00,
  "category": "education",
  "title": "School Supplies Purchased",
  "description": "Used funds to buy school supplies for 5 children",
  "beneficiaries": 5,
  "photos": ["url1", "url2"]
}
```

---

## Collaboration Endpoints

### Create Collaboration Request

**POST** `/collaboration`

Create a collaboration request (NGO only).

**Request Body:**
```json
{
  "title": "Joint Training Program",
  "description": "Seeking partner for vocational training",
  "collaborationType": "joint_program",
  "duration": "6 months",
  "location": "Nairobi",
  "visibility": "public"
}
```

### Get Collaborations

**GET** `/collaboration?type=joint_program&status=open`

Get collaboration requests.

### Create Resource

**POST** `/collaboration/resources`

Share a resource (NGO only).

**Request Body:**
```json
{
  "title": "Training Manual - Tailoring",
  "description": "Comprehensive tailoring training guide",
  "resourceType": "training_material",
  "category": "tailoring",
  "fileUrl": "https://...",
  "accessLevel": "ngo_only"
}
```

---

## Message Endpoints

### Send Message

**POST** `/messages`

Send a message to another user.

**Request Body:**
```json
{
  "recipientId": "uuid",
  "subject": "Meeting Request",
  "content": "Would like to discuss collaboration...",
  "priority": "normal"
}
```

### Get Inbox

**GET** `/messages/inbox?page=1&limit=20&isRead=false`

Get inbox messages.

### Get Sent Messages

**GET** `/messages/sent`

Get sent messages.

---

## Notification Endpoints

### Get Notifications

**GET** `/notifications?page=1&limit=20&isRead=false`

Get user notifications.

### Mark as Read

**PUT** `/notifications/:id/read`

Mark notification as read.

### Mark All as Read

**PUT** `/notifications/mark-all-read`

Mark all notifications as read.

---

## Admin Endpoints

### Get Dashboard Statistics

**GET** `/admin/dashboard/stats`

Get comprehensive system statistics (Admin only).

### Get All Users

**GET** `/admin/users?role=ngo&isApproved=false`

Get list of users (Admin only).

### Update User Status

**PUT** `/admin/users/:id/status`

Approve/reject or activate/deactivate user (Admin only).

**Request Body:**
```json
{
  "isApproved": true,
  "isActive": true,
  "reason": "Verification completed"
}
```

### Get Audit Logs

**GET** `/admin/audit-logs?action=CREATE&entityType=Child&startDate=2024-01-01`

Get system audit logs (Admin only).

---

## Error Responses

All endpoints return error responses in this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Rate Limiting

- General API: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes
- Password reset: 3 requests per hour
- File uploads: 20 requests per 15 minutes

---

## Pagination

List endpoints support pagination with these query parameters:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

Response includes pagination metadata:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "pages": 5
    }
  }
}
```


