# SG Fashion — Garment & Apparel Store

Premium retail garment store website with WhatsApp ordering, admin dashboard, and Cloudinary image management.

---

## Project Structure

```
workspace/
├── frontend/          ← Deploy to Vercel (Static Site)
│   ├── index.html
│   ├── catalog.html
│   ├── admin.html
│   ├── about.html
│   ├── contact.html
│   ├── product-details.html
│   ├── css/
│   ├── js/
│   │   ├── config.js       ← API base URL (edit before deploy if needed)
│   │   ├── main.js
│   │   ├── catalog.js
│   │   ├── order.js
│   │   ├── detail.js
│   │   ├── contact.js
│   │   ├── admin.js
│   │   └── products-data.js
│   └── vercel.json         ← Static site + API proxy config
│
├── backend/           ← Deploy to Vercel (Node.js / Serverless)
│   ├── api/
│   │   └── index.js        ← Vercel serverless entry point
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── data/               ← JSON fallback storage (no MongoDB)
│   ├── scripts/
│   ├── cloudinary.js
│   ├── db.js
│   ├── server.js           ← Express Router (imported by api/index.js)
│   ├── package.json
│   ├── .env.example        ← Copy → .env and fill in values
│   └── vercel.json         ← Serverless Node.js config
│
├── server.js          ← LOCAL DEV ONLY (not deployed)
├── package.json       ← LOCAL DEV ONLY
└── .env               ← LOCAL DEV ONLY (never commit)
```

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in environment variables
cp .env.example .env   # edit .env with your real values

# 3. Start the full-stack local server
npm run dev
# → http://localhost:3000
```

---

## Vercel Deployment

### Step 1 — Deploy the Backend

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your Git repository and set the **Root Directory** to `backend/`
3. Add all environment variables from `backend/.env.example`:

| Variable | Value |
|----------|-------|
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | your strong password |
| `MONGODB_URI` | your MongoDB Atlas connection string |
| `CLOUDINARY_CLOUD_NAME` | from Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | from Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | from Cloudinary dashboard |
| `STORE_NAME` | `SG Fashion` |
| `STORE_WHATSAPP_NUMBER` | `91XXXXXXXXXX` |
| `STORE_PHONE` | `+91 XXXXX XXXXX` |
| `STORE_EMAIL` | `support@yourdomain.com` |
| `STORE_ADDRESS` | your store address |
| `STORE_HOURS` | `Mon – Sat: 10AM – 9PM` |
| `FRONTEND_URL` | *(fill in after Step 2)* |

4. Deploy. Note the backend URL, e.g. `https://sg-fashion-api.vercel.app`

---

### Step 2 — Deploy the Frontend

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your repo and set the **Root Directory** to `frontend/`
3. No build command needed (static site) — Vercel auto-detects it.
4. **Update `frontend/vercel.json`** before deploying:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://sg-fashion-api.vercel.app/api/:path*"
    }
  ]
}
```
Replace `sg-fashion-api.vercel.app` with **your actual backend URL from Step 1**.

5. Deploy. Note the frontend URL, e.g. `https://sg-fashion.vercel.app`

---

### Step 3 — Link Frontend ↔ Backend (CORS)

Go back to your **backend Vercel project** → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `FRONTEND_URL` | `https://sg-fashion.vercel.app` |

Redeploy the backend. Now both projects can communicate.

---

## Admin Panel

- URL: `/admin` (e.g. `https://sg-fashion.vercel.app/admin`)
- Username: value of `ADMIN_USERNAME` env var (default: `admin`)
- Password: value of `ADMIN_PASSWORD` env var (default: `admin123` — **change this!**)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML + CSS + JavaScript |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (falls back to JSON files) |
| Images | Cloudinary |
| Hosting | Vercel (static + serverless) |
| Orders | WhatsApp deep links |
