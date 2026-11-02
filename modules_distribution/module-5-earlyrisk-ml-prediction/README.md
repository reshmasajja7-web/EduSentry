# EduSentry — Part 5: EarlyRisk Prediction ML Engine

**Assigned Teammate:** Teammate 5 (Machine Learning & Predictive Modeling Engineer)  
**Module Identifier:** `module-5-earlyrisk-ml-prediction`  
**Suggested GitHub Branch:** `feature/module-5-earlyrisk-ml-prediction`  
**Team Repository:** `https://github.com/<team-lead-username>/edusentry`  

---

## 🎯 Domain & Responsibilities
Owns the proactive academic setback prediction engine, multi-factor ML risk scoring model, interactive radial Risk Gauge, historical trend curves, and What-If simulator.

---

## 📂 Files Included in this Module
```
├── .env.example\n├── backend/src/earlyRisk.js\n├── backend/test/validation.test.js\n├── index.html\n├── package.json\n├── postcss.config.js\n├── public/edusentry_ambient_bg.jpg\n├── public/favicon.svg\n├── public/hero-bg.svg\n├── src/App.jsx\n├── src/components/AppShell.jsx\n├── src/components/Block.jsx\n├── src/components/Btn.jsx\n├── src/components/Logo.jsx\n├── src/components/ModuleHeader.jsx\n├── src/components/ProtectedRoute.jsx\n├── src/components/Sidebar.jsx\n├── src/components/risk/AcademicModal.jsx\n├── src/components/risk/RiskGauge.jsx\n├── src/components/risk/TrendChart.jsx\n├── src/context/AuthContext.jsx\n├── src/context/ThemeContext.jsx\n├── src/context/WorkspaceDataContext.jsx\n├── src/index.css\n├── src/lib/api.js\n├── src/lib/earlyRisk.js\n├── src/main.jsx\n├── src/pages/PublicRiskWrapper.jsx\n├── src/pages/RiskPrediction.jsx\n├── tailwind.config.js\n├── vite.config.js
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
./push_to_github.sh https://github.com/<your-username>/module-5-earlyrisk-ml-prediction.git
```

### Method 2: Manual Git Commands
```bash
git init
git add .
git commit -m "feat(module-5-earlyrisk-ml-prediction): initial release of EduSentry — Part 5: EarlyRisk Prediction ML Engine"
git branch -M main
git remote add origin https://github.com/<your-username>/module-5-earlyrisk-ml-prediction.git
git push -u origin main
```

---

## 🔀 How to Submit a Pull Request to the Main Team Repository
1. On GitHub, navigate to the main team repository: `https://github.com/<team-lead-username>/edusentry`.
2. Click **Fork** (or clone the main repo if you are added as a collaborator).
3. Push your module branch:
   ```bash
   git checkout -b feature/module-5-earlyrisk-ml-prediction
   git add .
   git commit -m "feat(module-5-earlyrisk-ml-prediction): implement module components and logic"
   git push -u origin feature/module-5-earlyrisk-ml-prediction
   ```
4. Click **Compare & pull request** on GitHub and assign your team lead for review!
