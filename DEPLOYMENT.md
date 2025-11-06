# BrainBoost Deployment Guide

## Quick Deployment Steps

### 1. Database Setup (MongoDB Atlas - FREE)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster (FREE tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

### 2. Backend Deployment (Render - FREE)

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `https://github.com/chiranjeevkr/Brainboost`
4. Configure:
   - **Name**: brainboost-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   - `MONGODB_URI`: (paste your MongoDB Atlas connection string)
   - `JWT_SECRET`: (any random string, e.g., "mySecretKey123")
   - `PORT`: 5000
6. Click "Create Web Service"
7. Copy your backend URL (e.g., `https://brainboost-backend.onrender.com`)

### 3. Frontend Deployment (Vercel - FREE)

1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New" → "Project"
3. Import your repository: `chiranjeevkr/Brainboost`
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: build
5. Add Environment Variable:
   - `REACT_APP_API_URL`: (paste your Render backend URL)
6. Click "Deploy"

### 4. Update Frontend API URL

Before deploying frontend, update the API URL in all frontend files:

Replace `http://localhost:5000` with your Render backend URL in:
- `frontend/src/components/Login.tsx`
- `frontend/src/components/Register.tsx`
- `frontend/src/components/KidMemoryGame.tsx`
- `frontend/src/components/ColorMatchGame.tsx`
- `frontend/src/components/CountingStarsGame.tsx`
- `frontend/src/components/CreativityGame.tsx`

### 5. Alternative: Deploy Everything on Render

1. Deploy Backend (as above)
2. Deploy Frontend:
   - Click "New +" → "Static Site"
   - Connect repository
   - Root Directory: frontend
   - Build Command: `npm install && npm run build`
   - Publish Directory: build

## Free Hosting Options Summary

| Service | What to Deploy | Free Tier |
|---------|---------------|-----------|
| MongoDB Atlas | Database | 512MB storage |
| Render | Backend + Frontend | 750 hours/month |
| Vercel | Frontend | Unlimited |
| Netlify | Frontend | 100GB bandwidth |

## Your Live URLs (After Deployment)

- **Frontend**: https://brainboost.vercel.app (or your custom domain)
- **Backend**: https://brainboost-backend.onrender.com
- **Database**: MongoDB Atlas (cloud)

## Important Notes

- Render free tier may sleep after 15 minutes of inactivity (first request takes ~30 seconds)
- MongoDB Atlas free tier has 512MB storage limit
- Vercel has unlimited deployments for personal projects
- Always use environment variables for sensitive data
- Never commit .env files to GitHub

## Troubleshooting

**CORS Error**: Add your Vercel URL to backend CORS configuration
**Database Connection Failed**: Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for all IPs)
**Build Failed**: Check Node version compatibility (use Node 18+)
