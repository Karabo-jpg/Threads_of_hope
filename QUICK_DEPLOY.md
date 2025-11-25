# ⚡ QUICK DEPLOYMENT - 15 Minutes to Public URL

## 🎯 Goal: Get a public URL for full points (5 pts)

---

## ✅ What You Already Have
- Working application locally ✅
- Supabase database configured ✅
- GitHub repository ready ✅

---

## 🚀 3-Step Deployment

### STEP 1: Deploy Backend (5 minutes)

1. **Go to**: https://render.com/
2. **Sign up** with GitHub (free)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repo
5. Configure:
   - **Name**: `threads-of-hope-backend`
   - **Root Directory**: Leave empty or type `backend`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free
6. **Add Environment Variables** (click Advanced):
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
   ```
7. Click **"Create Web Service"**
8. **COPY YOUR BACKEND URL**: `https://[your-app-name].onrender.com`

---

### STEP 2: Deploy Frontend (5 minutes)

1. **Go to**: https://vercel.com/
2. **Sign up** with GitHub (free)
3. Click **"Add New..."** → **"Project"**
4. Import your repository
5. Configure:
   - **Framework**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)
6. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://[YOUR-BACKEND-URL-FROM-STEP1].onrender.com/api
   REACT_APP_SOCKET_URL=https://[YOUR-BACKEND-URL-FROM-STEP1].onrender.com
   ```
7. Click **"Deploy"**
8. **YOUR PUBLIC URL IS READY!**: `https://[your-app-name].vercel.app`

---

### STEP 3: Final Update (2 minutes)

1. Go back to **Render** dashboard
2. Click your backend service
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL` to your Vercel URL
5. Save (auto redeploys)

---

## 🎉 DONE! Test Your Public URL

Visit: `https://your-app-name.vercel.app`

Login with:
- **Email**: `donor@example.com`
- **Password**: `Donor@2024`

Test donation submission!

---

## 📋 Submit for Grading

**Your Public URL**: `https://your-app-name.vercel.app`

✅ **5 Points**: Deployed solution exists!

---

## ⚠️ Important Notes

### Free Tier Limitations:
- **Render**: Backend sleeps after 15 min of inactivity (first request takes 30-60 seconds to wake)
- **Vercel**: Unlimited bandwidth, instant load times

### If Backend is Slow:
This is normal for Render free tier. First request wakes the server. Tell your grader to wait 30-60 seconds if the first load is slow!

---

## 🆘 Troubleshooting

**Problem**: Frontend shows "Network Error"
- **Fix**: Check REACT_APP_API_URL in Vercel environment variables
- **Redeploy**: Vercel Dashboard → Deployments → Redeploy

**Problem**: Backend shows "Application Error"
- **Fix**: Check Render logs for errors
- **Most common**: Missing environment variables

**Problem**: CORS Error
- **Fix**: Make sure FRONTEND_URL in Render matches your Vercel URL exactly

---

## Alternative: Both on Render (Easier!)

**Option 2: Deploy Both on Render**

1. Deploy backend (as above)
2. Deploy frontend as **Static Site**:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Environment Variables**: Same as Vercel

---

## 💡 Pro Tips

1. **Use meaningful names**: `threads-of-hope-backend`, `threads-of-hope-frontend`
2. **Keep URLs handy**: Save both URLs for your documentation
3. **Test before submitting**: Make sure you can login and donate
4. **Screenshot**: Take screenshots of working deployment
5. **Video demo**: Consider recording a quick demo

---

## ✨ You Got This!

Total time: **~15 minutes**  
Result: **Professional public deployment**  
Points: **5/5** ✅

Good luck! 🚀

