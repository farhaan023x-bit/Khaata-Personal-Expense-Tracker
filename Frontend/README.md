# 💰 Khaata - Personal Finance Web Application

A full-featured, responsive, and deployment-ready personal finance application (Khaata) designed with a modern **Money Green / Emerald Luxury** aesthetic. Built with React 19, Vite, React Router 7, and Axios.

---

## 🌟 Key Features

- **Cohesive Full-Page Layout**: Dedicated sticky glassmorphic **Header (Navbar)**, rich interactive **Body (Dashboard & Ledger)**, and comprehensive **Footer** with live contact information (`farhaan023x@gmail.com`).
- **Interactive Authentication & State**:
  - Global `AuthContext` for seamless session management.
  - Dedicated **Logout button** in the header with an accessible, animated confirmation modal and automatic token cleanup.
- **Dynamic Real-Time Dashboard**:
  - Live Net Expense balance and total monthly calculation.
  - Category spending breakdown with animated SVG progress rings.
  - Search transactions by title, note, or category filter chips.
  - Quick Expense creation form with client-side validation.
  - In-place transaction editing and permanent deletion with confirmation modal.
  - Pagination controls.
- **Advanced Dynamic Motion**:
  - Floating money badges (`@keyframes floatBob`).
  - Pulsing indicators and glowing interactive cards (`@keyframes pulseGlow`).
  - Interactive toast notification feedback system (replacing default browser alerts).
- **Deployment-Ready Architecture**:
  - Environment-variable controlled API Base URL (`VITE_API_URL`).
  - Single-Page Application (SPA) routing support out-of-the-box for **Vercel** (`vercel.json`) and **Netlify** (`_redirects`).

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and specify your backend API URL:
```bash
# For local development
VITE_API_URL=http://localhost:8000

# For production (e.g. Render, Railway, AWS)
# VITE_API_URL=https://your-expense-backend.onrender.com
```

### 3. Run Locally
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 🌐 1-Click Deployment Guide

### Deploying to Vercel
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import this repository.
4. In **Environment Variables**, add:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-api-domain.com`
5. Click **Deploy**. Vercel will automatically read `vercel.json` for SPA rewrites.

### Deploying to Netlify
1. Connect your repository to [Netlify](https://netlify.com).
2. Set Build command: `npm run build`
3. Set Publish directory: `dist`
4. Add environment variable `VITE_API_URL` in Site Settings.
5. Click **Deploy Site**. The `public/_redirects` file guarantees zero 404s on page refresh.

---

## 📬 Contact & Support

For questions, inquiries, or feedback:
- **Email**: [farhaan023x@gmail.com](mailto:farhaan023x@gmail.com)
- **Developer**: Farhan
