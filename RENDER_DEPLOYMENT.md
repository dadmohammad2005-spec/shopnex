# 🚀 Deploying shall_shoop to Render for Free

shall_shoop is fully configured for **100% Free, Instant Deployment on [Render](https://render.com/)**.

Both the **Django REST Backend** and the **React + Vite Frontend** are wired together in the `render.yaml` Blueprint file.

---

## ⚡ Option 1: 1-Click Instant Blueprint Deployment (Recommended)

### Step 1: Push This Codebase to Your GitHub Account
Open PowerShell or your terminal in this `shall_shoop` project directory and run:

```bash
# 1. Rename branch to main if needed
git branch -M main

# 2. Add your GitHub remote repository (replace with your GitHub repository URL)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/shall_shoop.git

# 3. Push the codebase
git push -u origin main
```

*(If you haven't created the repository on GitHub yet, go to [github.com/new](https://github.com/new), create a new public or private repository named `shall_shoop`, and run the commands above).*

---

### Step 2: Deploy on Render via Blueprint
1. Log in to **[Render.com](https://dashboard.render.com/)** (sign in free with GitHub).
2. In the top right, click **"New +"** and choose **"Blueprint"**.
3. Connect your **`shall_shoop`** GitHub repository.
4. Render will automatically detect the **`render.yaml`** file and display:
   - **`shall-shoop-backend`**: Free Web Service (Python, Gunicorn, Whitenoise, SQLite / PostgreSQL)
   - **`shall-shoop-frontend`**: Free Static Site (Node, React, Vite)
5. Click **"Apply"**.

Render will automatically:
- Install Python requirements and build static assets with WhiteNoise.
- Run migrations and seed products and site settings.
- Install React dependencies, compile Vite, and set up SPA rewriting.

---

### Step 3: Link the Frontend to the Backend URL
1. Once **`shall-shoop-backend`** finishes deploying, copy its URL from the dashboard (e.g., `https://shall-shoop-backend-xxxx.onrender.com`).
2. Go to your **`shall-shoop-frontend`** service on Render.
3. In **Environment**, set or verify:
   - `VITE_API_BASE_URL` = `https://shall-shoop-backend-xxxx.onrender.com/api`
4. Click **"Save Changes"** (Render will automatically re-deploy the frontend in 60 seconds).

---

## 🛠️ Option 2: Manual Service Creation (Alternative)

If you prefer to configure each service manually in the Render dashboard:

### 1. Backend Service (Web Service)
- **Type**: Web Service
- **Name**: `shall-shoop-backend`
- **Root Directory**: `backend`
- **Runtime**: `Python`
- **Build Command**: `./build.sh`
- **Start Command**: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
- **Plan**: `Free`
- **Environment Variables**:
  - `PYTHON_VERSION`: `3.11.9`
  - `DJANGO_DEBUG`: `False`
  - `DJANGO_SECRET_KEY`: *(Generate a secure random string)*
  - `DJANGO_ALLOWED_HOSTS`: `.onrender.com,localhost,127.0.0.1`
  - `CSRF_TRUSTED_ORIGINS`: `https://*.onrender.com`
  - `CORS_ALLOWED_ORIGINS`: `https://*.onrender.com`

---

### 2. Frontend Service (Static Site)
- **Type**: Static Site
- **Name**: `shall-shoop-frontend`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Redirects / Rewrites** (in settings tab):
  - **Type**: `Rewrite`
  - **Source**: `/*`
  - **Destination**: `/index.html`
- **Environment Variables**:
  - `VITE_API_BASE_URL`: `https://<YOUR_BACKEND_SERVICE_NAME>.onrender.com/api`

---

## 🔑 Default Production Credentials

- **Admin Dashboard**: `https://<YOUR_BACKEND_URL>/admin/`
  - **Email**: `dadmohammad2005@gmail.com`
  - **Password**: `Admin12345!`
- **Demo Customer**:
  - **Email**: `customer@shallshoop.com`
  - **Password**: `Customer12345!`
- **Contact Concierge**:
  - **Email**: `dadmohammad2005@gmail.com`
  - **Location**: `Quetta, Balochistan, Pakistan`

