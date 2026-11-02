# EduSentry — Part 1: Core Auth, Landing & Theme System

**Assigned Teammate:** Teammate 1 (Platform Architect / Team Lead)  
**Module Identifier:** `module-1-auth-landing`  
**Suggested GitHub Branch:** `feature/module-1-auth-landing`  
**Team Repository:** `https://github.com/<team-lead-username>/edusentry`  

---

## 🎯 Domain & Responsibilities
Owns user authentication, session security, high-contrast dark theme, landing hero showcase, and core Express/PostgreSQL backend services.

---

## 📂 Files Included in this Module
```
├── .env.example\n├── backend/.env.example\n├── backend/README.md\n├── backend/package.json\n├── backend/sql/schema.sql\n├── backend/src/auth.js\n├── backend/src/db.js\n├── backend/src/server.js\n├── backend/src/sms.js\n├── backend/src/validation.js\n├── index.html\n├── package.json\n├── postcss.config.js\n├── public/edusentry_ambient_bg.jpg\n├── public/favicon.svg\n├── public/hero-bg.svg\n├── src/App.jsx\n├── src/components/AppShell.jsx\n├── src/components/Block.jsx\n├── src/components/Btn.jsx\n├── src/components/DynamicWorkflow.jsx\n├── src/components/Logo.jsx\n├── src/components/ModuleHeader.jsx\n├── src/components/ProtectedRoute.jsx\n├── src/components/PublicHeader.jsx\n├── src/components/Sidebar.jsx\n├── src/components/SponsorsSection.jsx\n├── src/context/AuthContext.jsx\n├── src/context/ThemeContext.jsx\n├── src/context/WorkspaceDataContext.jsx\n├── src/index.css\n├── src/lib/api.js\n├── src/main.jsx\n├── src/pages/About.jsx\n├── src/pages/Features.jsx\n├── src/pages/ForgotPassword.jsx\n├── src/pages/Home.css\n├── src/pages/Home.jsx\n├── src/pages/Login.jsx\n├── src/pages/Register.jsx\n├── tailwind.config.js\n├── vite.config.js
```

---

## 🛠️ How to Run & Test Standalone
```bash
# 1. Install dependencies:
npm install

# 2. Run local development server:
npm run dev
# The module opens at http://localhost:5173
```

---

## 🚀 How to Push to Your Personal GitHub Account

### Method 1: Automated Script (Fastest — 5 Seconds)
```bash
./push_to_github.sh https://github.com/<your-username>/module-1-auth-landing.git
```

### Method 2: Manual Git Commands
```bash
git init
git add .
git commit -m "feat(module-1-auth-landing): initial release of EduSentry — Part 1: Core Auth, Landing & Theme System"
git branch -M main
git remote add origin https://github.com/<your-username>/module-1-auth-landing.git
git push -u origin main
```

---

## 🔀 How to Submit a Pull Request to the Main Team Repository
1. On GitHub, navigate to the main team repository: `https://github.com/<team-lead-username>/edusentry`.
2. Click **Fork** (or clone the main repo if you are added as a collaborator).
3. Push your module branch:
   ```bash
   git checkout -b feature/module-1-auth-landing
   git add .
   git commit -m "feat(module-1-auth-landing): implement module components and logic"
   git push -u origin feature/module-1-auth-landing
   ```
4. Click **Compare & pull request** on GitHub and assign your team lead for review!
