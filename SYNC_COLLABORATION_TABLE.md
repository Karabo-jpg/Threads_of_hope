# Sync Collaboration Table to Database

## Problem
The `collaboration_requests` table doesn't exist in the Supabase database yet.

## Solution
Run the database sync script on Render to create all missing tables.

## Steps:

### 1. Open Render Dashboard
Go to: https://dashboard.render.com/

### 2. Access Your Backend Service
- Click on your `threads-of-hope` web service
- Go to the **Shell** tab (left sidebar)

### 3. Run the Sync Command
In the shell, type:
```bash
node src/scripts/syncDatabase.js
```

### 4. Verify Success
You should see output like:
```
✅ Database connection established successfully.
🔄 Creating tables...
✅ All tables created successfully!
📋 Tables created:
  ✅ collaboration_requests
  ... (and others)
```

### 5. Test the Collaboration Page
- Go back to your app
- Refresh the Collaboration page
- Try clicking "New Request" to create a collaboration

## Alternative: Quick Test with Postman/Browser
After syncing, you can test the API directly:
```
GET https://threads-of-hope.onrender.com/api/collaboration
```

---

**Note:** This only needs to be done once to create the missing tables.

