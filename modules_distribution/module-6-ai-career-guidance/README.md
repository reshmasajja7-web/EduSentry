# EduSentry — Part 6: AI Career Guidance & Strategic Mentorship

**Assigned Teammate:** Teammate 6 (Recommender Systems & Career Strategy Engineer)  
**Module Identifier:** `module-6-ai-career-guidance`  
**Suggested GitHub Branch:** `feature/module-6-ai-career-guidance`  
**Team Repository:** `https://github.com/<team-lead-username>/edusentry`  

---

## 🎯 Domain & Responsibilities
Owns the AI career roadmap recommendation engine, interactive career path milestones, animated skill acquisition progress bars, career badge achievements, and AI mascot mentor.

---

## 📂 Files Included in this Module
```
├── .env.example\n├── index.html\n├── package.json\n├── postcss.config.js\n├── public/edusentry_ambient_bg.jpg\n├── public/favicon.svg\n├── public/hero-bg.svg\n├── src/App.jsx\n├── src/components/AIMascot.jsx\n├── src/components/AchievementBadge.jsx\n├── src/components/AnimatedCounter.jsx\n├── src/components/AppShell.jsx\n├── src/components/Block.jsx\n├── src/components/Btn.jsx\n├── src/components/GlassCard.jsx\n├── src/components/Logo.jsx\n├── src/components/ModuleHeader.jsx\n├── src/components/ProtectedRoute.jsx\n├── src/components/Sidebar.jsx\n├── src/context/AuthContext.jsx\n├── src/context/ThemeContext.jsx\n├── src/context/WorkspaceDataContext.jsx\n├── src/data/careerRoadmaps.js\n├── src/data/careers.js\n├── src/index.css\n├── src/lib/api.js\n├── src/main.jsx\n├── src/pages/CareerGuidance.jsx\n├── src/pages/PublicCareerWrapper.jsx\n├── src/pages/career-guidance.css\n├── tailwind.config.js\n├── vite.config.js
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
./push_to_github.sh https://github.com/<your-username>/module-6-ai-career-guidance.git
```

### Method 2: Manual Git Commands
```bash
git init
git add .
git commit -m "feat(module-6-ai-career-guidance): initial release of EduSentry — Part 6: AI Career Guidance & Strategic Mentorship"
git branch -M main
git remote add origin https://github.com/<your-username>/module-6-ai-career-guidance.git
git push -u origin main
```

---

## 🔀 How to Submit a Pull Request to the Main Team Repository
1. On GitHub, navigate to the main team repository: `https://github.com/<team-lead-username>/edusentry`.
2. Click **Fork** (or clone the main repo if you are added as a collaborator).
3. Push your module branch:
   ```bash
   git checkout -b feature/module-6-ai-career-guidance
   git add .
   git commit -m "feat(module-6-ai-career-guidance): implement module components and logic"
   git push -u origin feature/module-6-ai-career-guidance
   ```
4. Click **Compare & pull request** on GitHub and assign your team lead for review!
