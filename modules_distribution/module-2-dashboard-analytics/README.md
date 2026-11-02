# EduSentry — Part 2: Student Progress & Analytics Dashboard

**Assigned Teammate:** Teammate 2 (Data Analytics & Visualization Engineer)  
**Module Identifier:** `module-2-dashboard-analytics`  
**Suggested GitHub Branch:** `feature/module-2-dashboard-analytics`  
**Team Repository:** `https://github.com/<team-lead-username>/edusentry`  

---

## 🎯 Domain & Responsibilities
Owns the interactive student command center, real-time multi-metric SVG progress curve analytics, study streaks, and student profile identity management.

---

## 📂 Files Included in this Module
```
├── .env.example\n├── index.html\n├── package.json\n├── postcss.config.js\n├── public/edusentry_ambient_bg.jpg\n├── public/favicon.svg\n├── public/hero-bg.svg\n├── src/App.jsx\n├── src/components/AppShell.jsx\n├── src/components/Block.jsx\n├── src/components/Btn.jsx\n├── src/components/Logo.jsx\n├── src/components/ModuleHeader.jsx\n├── src/components/ProtectedRoute.jsx\n├── src/components/Sidebar.jsx\n├── src/components/Tag.jsx\n├── src/context/AuthContext.jsx\n├── src/context/ThemeContext.jsx\n├── src/context/WorkspaceDataContext.jsx\n├── src/index.css\n├── src/lib/activityLog.js\n├── src/lib/api.js\n├── src/main.jsx\n├── src/pages/Dashboard.jsx\n├── src/pages/Profile.jsx\n├── tailwind.config.js\n├── vite.config.js
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
./push_to_github.sh https://github.com/<your-username>/module-2-dashboard-analytics.git
```

### Method 2: Manual Git Commands
```bash
git init
git add .
git commit -m "feat(module-2-dashboard-analytics): initial release of EduSentry — Part 2: Student Progress & Analytics Dashboard"
git branch -M main
git remote add origin https://github.com/<your-username>/module-2-dashboard-analytics.git
git push -u origin main
```

---

## 🔀 How to Submit a Pull Request to the Main Team Repository
1. On GitHub, navigate to the main team repository: `https://github.com/<team-lead-username>/edusentry`.
2. Click **Fork** (or clone the main repo if you are added as a collaborator).
3. Push your module branch:
   ```bash
   git checkout -b feature/module-2-dashboard-analytics
   git add .
   git commit -m "feat(module-2-dashboard-analytics): implement module components and logic"
   git push -u origin feature/module-2-dashboard-analytics
   ```
4. Click **Compare & pull request** on GitHub and assign your team lead for review!
