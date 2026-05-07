# Deployment Checklist: College Discovery Platform

## STEP 1: Rotate Supabase Database Password (CRITICAL)

Your password was exposed in chat, so rotate it first.

1. Go to: https://app.supabase.com/projects
2. Click your project: "Rayudu-Somisetty's Project"
3. Left menu → **Settings** → **Database**
4. Under "Database connections" → Click **Reset password**
5. Copy the new password (you'll use it in next steps)
6. Scroll down to "Connection string (Prisma)" → Select **Prisma**
7. Copy the new connection strings:
   - Pooler URL (contains `.pooler.supabase.com`, port 6543): save as DATABASE_URL
   - Direct URL (contains `.supabase.co`, port 5432): save as DIRECT_URL
8. Save both URLs in a text file for the backend deployment step

**Example format (DO NOT use these values):**
```
DATABASE_URL="postgresql://postgres.PROJECTID:NEWPASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.PROJECTID:NEWPASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"
```

---

## STEP 2: Deploy Backend to Railway

### 2a. Create Railway Account
1. Go to: https://railway.app
2. Click **Login** → **GitHub** (authorize with your GitHub account)
3. Once logged in, click **New Project**

### 2b. Connect Your Repository
1. Click **Deploy from GitHub**
2. Authorize Railway to access your GitHub
3. Search for and select: `developers-arena-task-2-web-dev-internship`
4. Click **Deploy**
5. Wait for Railway to detect the project

### 2c. Configure Backend Deployment
1. In Railway dashboard, click your project
2. Click **Settings** tab
3. Under **Build**, set:
   - **Build command**: `npm run build`
   - **Start command**: `npm run start`
4. Under **Root directory**, set: `backend`
5. Click **Deploy** (or wait for auto-deploy)

### 2d: Add Environment Variables
1. Click **Variables** tab (or Environment)
2. Add these key-value pairs:
   - `DATABASE_URL` = (paste your pooler URL from Step 1)
   - `DIRECT_URL` = (paste your direct URL from Step 1)
   - `NODE_ENV` = `production`
   - `PORT` = `4000`
   - `FRONTEND_ORIGIN` = (you'll update this after frontend deploy; for now use: `http://localhost:3000`)

3. Click **Save**
4. Railway will redeploy automatically

### 2e: Run Database Migration (One-time)
1. In Railway dashboard, click your project
2. Click **Command Palette** (or terminal icon)
3. Run: `npm run db:migrate:deploy`
4. Wait for migration to complete
5. (Optional) Run: `npm run db:seed` to populate sample data

### 2f: Get Your Backend URL
1. In Railway dashboard, click your project
2. Click the **Deployments** tab
3. Copy the **URL** (looks like: `https://your-backend.up.railway.app`)
4. Save this URL for Step 3e

---

## STEP 3: Deploy Frontend to Vercel

### 3a: Create Vercel Account
1. Go to: https://vercel.com
2. Click **Sign Up** → **Continue with GitHub**
3. Authorize Vercel to access your GitHub

### 3b: Import Project
1. Click **Add New...** → **Project**
2. Search for: `developers-arena-task-2-web-dev-internship`
3. Click **Import**

### 3c: Configure Frontend
1. Under **Root Directory**, set to: `frontend`
2. Under **Framework**, confirm: `Next.js`
3. Click **Deploy**
4. Wait for deployment to complete (~2-5 min)

### 3d: Add Environment Variables
1. In Vercel dashboard, click your project
2. Click **Settings** → **Environment Variables**
3. Add:
   - Name: `NEXT_PUBLIC_API_BASE_URL`
   - Value: (paste the backend URL from Step 2f)
   - Click **Add**
4. Vercel will automatically redeploy

### 3e: Get Your Frontend URL
1. In Vercel dashboard, click **Deployments**
2. Copy the domain URL (looks like: `https://your-app.vercel.app`)
3. Save this URL for Step 4

---

## STEP 4: Update Backend CORS (Post-Deployment)

Now that you have both live URLs, update backend to allow only your frontend.

1. Go back to Railway dashboard
2. Click your backend project
3. Click **Variables** tab
4. Edit `FRONTEND_ORIGIN`:
   - Change value from `http://localhost:3000` to your frontend Vercel URL
   - Example: `https://your-app.vercel.app`
5. Click **Save**
6. Railway auto-redeploys

---

## STEP 5: Verify Everything Works

### 5a: Test Backend Health
1. Open browser and go to:
   ```
   https://your-backend.up.railway.app/health
   ```
2. You should see: `{"ok":true}`

### 5b: Test Frontend Pages
1. Open: `https://your-app.vercel.app`
2. Click **Explore colleges** → verify colleges load from database
3. Click a college name → verify detail page loads
4. Try adding colleges to compare → click **Compare** button
5. Go to **Predict** → enter rank, click **Predict** → verify results show

### 5c: Verify Database Connection
In Railway dashboard:
1. Click your backend project → **Logs** tab
2. Scroll through logs
3. Look for: `[INFO]` messages showing database queries
4. If you see SQL query logs (Prisma debug), database is connected

---

## STEP 6: Submission Ready

Once all verifications pass, you have:

- ✅ Frontend live at: `https://your-app.vercel.app`
- ✅ Backend live at: `https://your-backend.up.railway.app`
- ✅ Database connected to PostgreSQL (Supabase)
- ✅ All 4 features working end-to-end (College Listing, Detail, Compare, Predictor)

**Submit:**
- Frontend URL
- Backend URL
- GitHub repo link

---

## Troubleshooting

**Frontend shows "Failed to fetch":**
- Check that `NEXT_PUBLIC_API_BASE_URL` in Vercel matches your backend URL
- Check that backend `FRONTEND_ORIGIN` includes your frontend URL
- Redeploy frontend after updating env vars

**Backend returns 500 errors:**
- Check Railway logs for database connection errors
- Verify DATABASE_URL and DIRECT_URL are correct (from Step 1)
- Ensure migration ran successfully (Step 2e)

**Colleges don't load:**
- Check backend logs for SQL errors
- Verify database migration ran: `npm run db:migrate:deploy`
- Optionally seed data: `npm run db:seed`

**Changes don't deploy:**
- Railway and Vercel auto-deploy on env var changes
- Wait 2-3 minutes for redeployment
- Refresh browser hard (Ctrl+Shift+R) to clear cache

---

## Quick Reference: Your Live URLs (Fill in after deployment)

- Frontend: `https://_______________`
- Backend: `https://_______________`
- Supabase Project: `https://app.supabase.com/projects/ptekaygddtuxxcwwcxuo`
