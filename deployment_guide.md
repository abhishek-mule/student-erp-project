# 🚀 College ERP Deployment Roadmap

This guide outlines the steps to deploy your multi-tenant monorepo to production.

## 1. 📂 Database (Neon)
*   Create a new project on [Neon](https://neon.tech).
*   Copy the `DIRECT_URL` (for migrations) and `DATABASE_URL` (for the app).
*   Run the initial migration from your local machine:
    ```bash
    cd packages/prisma
    npx prisma migrate deploy
    ```

## 2. 🚂 Backend API (Render)
*   Create a new **Web Service** on [Render](https://render.com).
*   Link your GitHub repository and point to the `apps/api` folder.
*   **Essential Environment Variables**:
    *   `DATABASE_URL`: (Neon URL)
    *   `R2_ACCESS_KEY_ID`: Cloudflare credentials.
    *   `R2_SECRET_ACCESS_KEY`: Cloudflare credentials.
    *   `R2_BUCKET_NAME`: Your bucket name.
    *   `R2_ENDPOINT`: Your Cloudflare endpoint.
    *   `PORT`: `3001` (Render will assign one).

## 3. 🌐 Frontend (Vercel)
*   Import your repository to [Vercel](https://vercel.com).
*   **Settings**:
    *   **Root Directory**: `apps/web`
    *   **Build Command**: `cd ../.. && npx prisma generate && npx turbo run build --filter=web`
    *   **Install Command**: `cd ../.. && npm install`
*   **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: Your Render API domain.
    *   `NEXT_PUBLIC_SOCKET_URL`: Same as API URL.

## ☁️ Cloudflare R2
Ensure your R2 bucket has **CORS** enabled to allow the Render API to upload files:
```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"]
  }
]
```
