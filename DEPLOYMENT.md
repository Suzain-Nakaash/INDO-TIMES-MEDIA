# IndoTimesMedia — Deployment Guide

This guide covers deploying the IndoTimesMedia application to production using Vercel (Frontend) and Railway (Backend).

## 1. Backend Deployment (Railway.app)

Railway is recommended for the backend as it provides easy Express.js hosting along with managed PostgreSQL and Redis databases.

### Prerequisites
1. A GitHub account
2. A Railway.app account
3. A Cloudinary account (for media storage)

### Steps
1. Push your code to a GitHub repository.
2. Go to [Railway.app](https://railway.app/) and create a **New Project**.
3. Select **Deploy from GitHub repo** and choose your repository.
4. **Add Databases**:
   - Click `New` -> `Database` -> `Add PostgreSQL`
   - Click `New` -> `Database` -> `Add Redis`
5. **Configure Environment Variables**:
   Go to your web service's `Variables` tab and add:
   ```env
   NODE_ENV=production
   PORT=5000
   
   # Railway will auto-inject these if you link the databases
   DATABASE_URL=postgresql://... 
   REDIS_URL=redis://...
   
   # Security (Generate strong random strings)
   JWT_ACCESS_SECRET=your_super_secret_access_token_key_here
   JWT_REFRESH_SECRET=your_super_secret_refresh_token_key_here
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d
   
   # Admin Account
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=YourSecurePassword123
   
   # Cloudinary (Get from your Cloudinary dashboard)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # S3 (Optional - If using AWS S3 instead of Cloudinary)
   S3_ENDPOINT=
   S3_ACCESS_KEY=
   S3_SECRET_KEY=
   S3_BUCKET_NAME=
   
   # Frontend URL (Important for CORS)
   CORS_ORIGINS=https://indotimesmedia.vercel.app,http://localhost:3000
   FRONTEND_URL=https://indotimesmedia.vercel.app
   ```
6. **Generate Domain**:
   Go to `Settings` -> `Networking` -> `Generate Domain`.
   *Copy this domain, you'll need it for the frontend.*

---

## 2. Frontend Deployment (Vercel)

Vercel is the optimal hosting provider for Next.js applications.

### Steps
1. Go to [Vercel.com](https://vercel.com/) and click **Add New Project**.
2. Import your GitHub repository.
3. Set the **Framework Preset** to `Next.js`.
4. Set the **Root Directory** to `frontend`.
5. **Environment Variables**:
   ```env
   # The domain you generated in Railway
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
   
   NEXT_PUBLIC_SITE_URL=https://indotimesmedia.vercel.app
   NEXT_PUBLIC_SITE_NAME=IndoTimesMedia
   ```
6. Click **Deploy**.

---

## 3. Post-Deployment Steps

### 1. Database Migration
Once your Railway backend is running, you need to push the database schema:
```bash
# Locally, using your Railway DATABASE_URL
npx prisma db push --schema=./prisma/schema.prisma
```

### 2. Admin Seeding
To create your first admin user, run the seed script:
```bash
npm run seed
```
*(Or use the Railway console to run `npm run seed` inside your container)*

### 3. Update CORS
Once your Vercel frontend is deployed and has a final URL, ensure that URL is added to the `CORS_ORIGINS` variable in your Railway backend.

## 4. Alternative: Docker VPS Deployment

If you prefer to host everything on a single VPS (DigitalOcean, Hetzner, etc.):

1. Clone the repo on your server
2. Copy `.env.example` to `.env` and fill in the values
3. Run `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`
4. The frontend will be built automatically
5. Run migrations: `docker exec -it indotimes-app-prod npx prisma db push`
6. Run seeds: `docker exec -it indotimes-app-prod npm run seed`
