# EduSentry — Part 4: Smart Study Suite (Flashcards, Summaries & Quiz)

**Assigned Teammate:** Teammate 4 (EdTech & Active Recall Tools Engineer)  
**Module Identifier:** `module-4-smart-study-suite`  
**Suggested GitHub Branch:** `feature/module-4-smart-study-suite`  
**Team Repository:** `https://github.com/<team-lead-username>/edusentry`  

---

## 🎯 Domain & Responsibilities
Owns the active recall study tools: AI-generated 3D interactive flip flashcards, multi-tier bulleted summaries, and diagnostic multiple-choice quizzes with answer explanations.

---

## 📂 Files Included in this Module
```
├── .env.example\n├── index.html\n├── package.json\n├── postcss.config.js\n├── public/edusentry_ambient_bg.jpg\n├── public/favicon.svg\n├── public/hero-bg.svg\n├── src/App.jsx\n├── src/components/AppShell.jsx\n├── src/components/Block.jsx\n├── src/components/Btn.jsx\n├── src/components/Logo.jsx\n├── src/components/ModuleHeader.jsx\n├── src/components/ProtectedRoute.jsx\n├── src/components/Sidebar.jsx\n├── src/components/WorkspaceLayout.jsx\n├── src/context/AuthContext.jsx\n├── src/context/ThemeContext.jsx\n├── src/context/WorkspaceDataContext.jsx\n├── src/index.css\n├── src/lib/api.js\n├── src/lib/textProcessing.js\n├── src/main.jsx\n├── src/pages/Flashcards.jsx\n├── src/pages/Quiz.jsx\n├── src/pages/Summaries.jsx\n├── tailwind.config.js\n├── vite.config.js
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
./push_to_github.sh https://github.com/<your-username>/module-4-smart-study-suite.git
```

### Method 2: Manual Git Commands
```bash
git init
git add .
git commit -m "feat(module-4-smart-study-suite): initial release of EduSentry — Part 4: Smart Study Suite (Flashcards, Summaries & Quiz)"
git branch -M main
git remote add origin https://github.com/<your-username>/module-4-smart-study-suite.git
git push -u origin main
```

---

## 🔀 How to Submit a Pull Request to the Main Team Repository
1. On GitHub, navigate to the main team repository: `https://github.com/<team-lead-username>/edusentry`.
2. Click **Fork** (or clone the main repo if you are added as a collaborator).
3. Push your module branch:
   ```bash
   git checkout -b feature/module-4-smart-study-suite
   git add .
   git commit -m "feat(module-4-smart-study-suite): implement module components and logic"
   git push -u origin feature/module-4-smart-study-suite
   ```
4. Click **Compare & pull request** on GitHub and assign your team lead for review!
