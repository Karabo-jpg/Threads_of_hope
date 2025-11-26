# Training Programs Data Flow Explanation

## Where Active Programs Are Fetched From

### 1. Frontend Request (TrainingPrograms.jsx)
**Location:** `frontend/src/pages/woman/TrainingPrograms.jsx`

**Code:**
```javascript
const response = await api.get('/training', {
  params: { status: 'active' },
});
```

**What it does:**
- Makes a GET request to `/api/training` (the `api` service automatically adds `/api` prefix)
- Sends `status: 'active'` as a query parameter
- This filters for only active training programs

### 2. API Service (api.js)
**Location:** `frontend/src/services/api.js`

**What it does:**
- Adds the base URL: `https://threads-of-hope.onrender.com/api` (or localhost in development)
- Automatically adds the JWT token from localStorage to the Authorization header
- Handles 401 errors by redirecting to login

**Full URL:** `https://threads-of-hope.onrender.com/api/training?status=active`

### 3. Backend Route (trainingRoutes.js)
**Location:** `backend/src/routes/trainingRoutes.js`

**Code:**
```javascript
router.get('/', verifyToken, trainingController.getAllPrograms);
```

**What it does:**
- Matches GET requests to `/api/training`
- Requires authentication (verifyToken middleware)
- Calls `getAllPrograms` controller function

### 4. Backend Controller (trainingController.js)
**Location:** `backend/src/controllers/trainingController.js`

**Function:** `getAllPrograms`

**What it does:**
1. Extracts query parameters:
   - `status: 'active'` (from frontend request)
   - `page`, `limit`, `category`, `search`, `skillLevel` (optional)

2. Builds a database query filter:
   ```javascript
   const where = {};
   if (status) where.status = status; // Filters for status = 'active'
   ```

3. Queries the database:
   ```javascript
   const { count, rows } = await TrainingProgram.findAndCountAll({
     where, // { status: 'active' }
     limit: 20,
     offset: 0,
     include: [{ model: User, as: 'creator' }],
     order: [['createdAt', 'DESC']],
   });
   ```

4. Returns the response:
   ```javascript
   res.json({
     success: true,
     data: {
       programs: rows, // Array of training program objects
       pagination: {
         total: count,
         page: 1,
         limit: 20,
         pages: Math.ceil(count / 20),
       },
     },
   });
   ```

### 5. Database Table (training_programs)
**Location:** Supabase PostgreSQL database

**Table:** `training_programs`

**Key Fields:**
- `id` (UUID)
- `title` (String)
- `description` (Text)
- `category` (Enum: 'sewing', 'tailoring', 'cooking', etc.)
- `status` (Enum: 'draft', 'active', 'full', 'completed', 'cancelled')
- `duration` (Integer - days)
- `startDate` (Date)
- `maxParticipants` (Integer)
- `createdBy` (UUID - references users table)
- `createdAt`, `updatedAt` (Timestamps)

**Query:** 
```sql
SELECT * FROM training_programs 
WHERE status = 'active' 
ORDER BY "createdAt" DESC 
LIMIT 20;
```

### 6. Frontend Response Handling (TrainingPrograms.jsx)
**Location:** `frontend/src/pages/woman/TrainingPrograms.jsx`

**Code:**
```javascript
const responseData = response.data?.data || response.data;
const programsList = responseData?.programs || responseData;
setPrograms(Array.isArray(programsList) ? programsList : []);
```

**What it does:**
- Extracts the programs array from the nested response structure
- Handles different response formats (defensive programming)
- Sets the programs state, which triggers a re-render to display the cards

## Complete Data Flow Diagram

```
User clicks "Browse Programs" button
    ↓
navigate('/woman/training')
    ↓
TrainingPrograms component mounts
    ↓
useEffect triggers fetchPrograms()
    ↓
api.get('/training', { params: { status: 'active' } })
    ↓
HTTP GET: https://threads-of-hope.onrender.com/api/training?status=active
    ↓
Backend: trainingRoutes.js → verifyToken middleware
    ↓
Backend: trainingController.getAllPrograms()
    ↓
Database Query: TrainingProgram.findAndCountAll({ where: { status: 'active' } })
    ↓
Supabase: SELECT * FROM training_programs WHERE status = 'active'
    ↓
Backend: Returns { success: true, data: { programs: [...], pagination: {...} } }
    ↓
Frontend: Extracts programs array from response
    ↓
Frontend: setPrograms(programsList) → Updates state
    ↓
React re-renders → Displays program cards
```

## Active Programs vs Enrollments

### Active Programs (TrainingPrograms.jsx)
- **Source:** All training programs in the database with `status = 'active'`
- **Purpose:** Shows available programs that women can enroll in
- **Endpoint:** `GET /api/training?status=active`
- **Who can see:** All authenticated users (but only women can enroll)

### Active Enrollments (WomanDashboard.jsx)
- **Source:** User's personal enrollments in training programs
- **Purpose:** Shows programs the logged-in woman is currently enrolled in
- **Endpoint:** `GET /api/training/my-enrollments`
- **Who can see:** Only the logged-in woman user
- **Filter:** `status IN ('active', 'approved')`

## Key Points

1. **Active Programs** = All programs available for enrollment (status = 'active')
2. **Active Enrollments** = Programs the current user is enrolled in
3. The database table is `training_programs` in Supabase
4. The API automatically filters by status when provided
5. Programs are created by NGOs and can be enrolled in by women

