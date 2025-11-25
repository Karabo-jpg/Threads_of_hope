# 🚀 Quick Deployment Guide - Get Your Public URL

This guide will help you deploy **Threads of Hope** to get a public URL for your project submission.

## Prerequisites
- GitHub account
- Vercel account (free - sign up with GitHub)
- Render account (free - sign up with GitHub)
- Your Supabase database is already configured ✅

---

## Step 1: Push Your Code to GitHub (If Not Already)

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"

# Create a repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/threads-of-hope.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### 2.1 Sign Up for Render
1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with your GitHub account

### 2.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select **"threads-of-hope"** repository

### 2.3 Configure Service
- **Name**: `threads-of-hope-backend`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Select **"Free"**

### 2.4 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these variables (copy from your backend/.env):

```
NODE_ENV=production
PORT=5000
DB_HOST=aws-1-eu-north-1.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.nvqhxrxgwmadcdblbzoc
DB_PASSWORD=@MuthonimThreads
JWT_SECRET=threads_of_hope_supabase_secret_key_change_in_production_minimum_32_chars
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=refresh_token_secret_for_supabase_change_in_production_secure
REFRESH_TOKEN_EXPIRES_IN=30d
FRONTEND_URL=https://threads-of-hope.vercel.app
ENABLE_EMAIL=false
ENABLE_SMS=false
BCRYPT_ROUNDS=10
ENABLE_2FA=true
DEFAULT_LANGUAGE=en
SUPPORTED_LANGUAGES=en,sw,fr
```

### 2.5 Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. **Copy your backend URL** (e.g., `https://threads-of-hope-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Sign Up for Vercel
1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign up with your GitHub account

### 3.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your **"threads-of-hope"** repository
3. Click **"Import"**

### 3.3 Configure Project
- **Framework Preset**: `Create React App`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### 3.4 Add Environment Variables
Click **"Environment Variables"** and add:

```
REACT_APP_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
REACT_APP_SOCKET_URL=https://YOUR-BACKEND-URL.onrender.com
```

**Replace** `YOUR-BACKEND-URL` with the URL from Step 2.5

### 3.5 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. **Your public URL is ready!** (e.g., `https://threads-of-hope.vercel.app`)

---

## Step 4: Update Backend with Frontend URL

1. Go back to Render dashboard
2. Click on your backend service
3. Go to **"Environment"** tab
4. Update **FRONTEND_URL** with your Vercel URL
5. Service will automatically redeploy

---

## Step 5: Test Your Deployment

Visit your Vercel URL (e.g., `https://threads-of-hope.vercel.app`)

**Test the following:**
- ✅ Application loads
- ✅ Can login with test credentials:
  - Email: `donor@example.com`
  - Password: `Donor@2024`
- ✅ Can submit a donation
- ✅ Dashboard shows data

---

## 🎯 Submit Your Public URL

**Your Public URL**: `https://your-app-name.vercel.app`

Use this URL for your project submission to get full points!

---

## Alternative Platforms (If You Prefer)

### Option 2: Netlify + Railway
- **Frontend**: Netlify (similar to Vercel)
- **Backend**: Railway (similar to Render)

### Option 3: Heroku (Paid)
- Both frontend and backend on Heroku
- No free tier anymore, but very reliable

---

## Troubleshooting

### Backend not connecting to database
- Check environment variables on Render
- Verify Supabase credentials are correct
- Check Render logs for errors

### Frontend not connecting to backend
- Verify REACT_APP_API_URL is correct
- Check CORS settings in backend
- Redeploy frontend after updating env vars

### CORS Errors
Add this to backend `app.js` if not already there:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## 📞 Need Help?

If you encounter issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check Vercel logs: Dashboard → Your Project → Deployments → View Logs
3. Verify all environment variables are set correctly

---

## 🎉 Success!

Once deployed, you'll have:
- ✅ Public URL accessible from anywhere
- ✅ Professional deployment setup
- ✅ Full 5 points for deployment requirement

Good luck with your submission! 🚀

