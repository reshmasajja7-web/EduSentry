# EduSentry — 6-Module Team GitHub Collaboration Guide

Yes, it is **100% possible** and standard industry engineering practice to divide the EduSentry platform into **6 distinct modular parts** so that all 6 team members can collaborate, push code from their own GitHub accounts, and showcase their individual module contributions on their GitHub profiles!

---

## 🏆 The 6 Modular Team Divisions

| Part # | Module Title & Domain | Core Pages & Files Owned | Assigned Teammate Role |
| :--- | :--- | :--- | :--- |
| **Part 1** | **Core Auth, Landing & Theme System** | `Home.jsx`, `Home.css`, `Features.jsx`, `About.jsx`, `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `DynamicWorkflow.jsx`, `Sidebar.jsx`, `AppShell.jsx`, `auth.js`, `server.js`, `schema.sql` | **Teammate 1 (Team Lead / Platform Architect)** |
| **Part 2** | **Student Progress & Analytics Dashboard** | `Dashboard.jsx`, `Profile.jsx`, `activityLog.js`, SVG Progress Curves, Risk Velocity Gauge, Streak Synchronization | **Teammate 2 (Data Analytics & Visualization Engineer)** |
| **Part 3** | **AI Tutor & Multi-LLM RAG Engine** | `AITutorChat.jsx`, `UploadNotes.jsx`, `PublicAITutor.jsx`, `ragEngine.js`, `fileExtract.js`, `sampleDocument.js` | **Teammate 3 (AI / NLP & RAG Systems Engineer)** |
| **Part 4** | **Smart Study Suite (Flashcards, Summaries & Quiz)** | `Summaries.jsx`, `Flashcards.jsx`, `Quiz.jsx`, `textProcessing.js`, AI Diagnostic Exam, Cloze Test | **Teammate 4 (EdTech & Active Recall Tools Engineer)** |
| **Part 5** | **EarlyRisk Prediction ML Engine** | `RiskPrediction.jsx`, `PublicRiskWrapper.jsx`, `backend/src/earlyRisk.js`, `RiskGauge.jsx`, `TrendChart.jsx`, `AcademicModal.jsx` | **Teammate 5 (Machine Learning & Predictive Modeling Engineer)** |
| **Part 6** | **AI Career Guidance & Strategic Mentorship** | `CareerGuidance.jsx`, `PublicCareerWrapper.jsx`, `career-guidance.css`, `careers.js`, `AIMascot.jsx`, `GlassCard.jsx`, `AchievementBadge.jsx` | **Teammate 6 (Recommender Systems & Career Strategy Engineer)** |

---

## 🛠️ Three Proven Collaboration Strategies

You can choose whichever strategy your college/professor prefers:

### Strategy 1: Fork & Pull Request (Most Common University & Open-Source Workflow)
- **How it works**:
  1. Team Lead creates the main GitHub repository (e.g. `https://github.com/<team-lead>/edusentry`).
  2. Each of the 5 friends clicks **"Fork"** on GitHub to copy the repo into their personal account (`https://github.com/<friend-username>/edusentry`).
  3. The friend downloads their Part zip file (`part-X-....zip`), extracts it into their local cloned fork, and pushes to their fork.
  4. The friend opens a **Pull Request (PR)** on GitHub from their fork to the main repo!
  5. The Team Lead merges the PR.
- **Why this is awesome**:
  - Every teammate's personal GitHub shows a public repository and pull request under their account.
  - The main repo's **Contributors** page lists all 6 members with exact commit and code line counts.
  - Teammates gain green contribution squares on their GitHub profile graph!

### Strategy 2: Direct Collaborator Branches (Fastest & Simplest)
- **How it works**:
  1. Team Lead creates the main repo and adds the 5 friends as Collaborators (`Settings` ➔ `Collaborators` ➔ `Add people`).
  2. Friends clone the main repo directly: `git clone https://github.com/<team-lead>/edusentry.git`.
  3. Each friend creates their branch: `git checkout -b feature/part-X-modulename`.
  4. They unzip their module files, commit, and push: `git push -u origin feature/part-X-modulename`.
  5. Open PR and merge into `main`.

### Strategy 3: 6 Independent Repositories (Personal Portfolio Showcase)
- **How it works**:
  - Each friend has their own standalone GitHub repository:
    - Teammate 1: `https://github.com/<user1>/edusentry-part1-auth-landing`
    - Teammate 2: `https://github.com/<user2>/edusentry-part2-dashboard-analytics`
    - Teammate 3: `https://github.com/<user3>/edusentry-part3-ai-tutor-rag`
    - Teammate 4: `https://github.com/<user4>/edusentry-part4-smart-study-suite`
    - Teammate 5: `https://github.com/<user5>/edusentry-part5-earlyrisk-ml-prediction`
    - Teammate 6: `https://github.com/<user6>/edusentry-part6-ai-career-guidance`
  - Each module folder contains its own `package.json`, `README.md`, and automated `./push_to_github.sh` script to push in 5 seconds.

---

## 📋 Step-by-Step Guide for Team Lead & All 6 Teammates

### 👑 Step 1: Team Lead Sets Up the Main Repository
```bash
# In the root of the project:
git init
git add .
git commit -m "feat(core): initial release of EduSentry learning workspace platform"
git branch -M main
git remote add origin https://github.com/<team-lead-username>/edusentry.git
git push -u origin main
```
*Tip: On GitHub, go to `Settings` -> `Collaborators` -> click `Add people` to invite your 5 teammates.*

---

### 👤 Teammate 1 (Part 1 — Core Auth & Dynamic Workflow)
```bash
# From extracted part-1-auth-landing:
git checkout -b feature/part-1-auth-landing
git add src/pages/Home.jsx src/pages/Home.css src/pages/Features.jsx src/pages/About.jsx \
        src/pages/Login.jsx src/pages/Register.jsx src/pages/ForgotPassword.jsx \
        src/components/AppShell.jsx src/components/Sidebar.jsx src/components/DynamicWorkflow.jsx \
        backend/src/auth.js backend/src/server.js backend/src/db.js backend/sql/schema.sql
git commit -m "feat(auth-landing): implement authentication, responsive sidebar, and server core"
git push -u origin feature/part-1-auth-landing
```

---

### 👤 Teammate 2 (Part 2 — Dashboard Analytics & Profile)
```bash
# From extracted part-2-dashboard-analytics:
git checkout -b feature/part-2-dashboard-analytics
git add src/pages/Dashboard.jsx src/pages/Profile.jsx src/lib/activityLog.js \
        src/components/Block.jsx src/components/Btn.jsx
git commit -m "feat(dashboard): add interactive telemetry curves, risk standing, and streak synchronization"
git push -u origin feature/part-2-dashboard-analytics
```

---

### 👤 Teammate 3 (Part 3 — AI Tutor & Multi-LLM RAG Engine)
```bash
# From extracted part-3-ai-tutor-rag:
git checkout -b feature/part-3-ai-tutor-rag
git add src/pages/AITutorChat.jsx src/pages/UploadNotes.jsx src/pages/PublicAITutor.jsx \
        src/lib/ragEngine.js src/lib/fileExtract.js src/data/sampleDocument.js
git commit -m "feat(ai-tutor): integrate Gemini, GPT-4o, Claude, DeepSeek and hybrid RAG citations"
git push -u origin feature/part-3-ai-tutor-rag
```

---

### 👤 Teammate 4 (Part 4 — Smart Study Suite: Flashcards, Summaries, Quiz)
```bash
# From extracted part-4-smart-study-suite:
git checkout -b feature/part-4-smart-study-suite
git add src/pages/Summaries.jsx src/pages/Flashcards.jsx src/pages/Quiz.jsx \
        src/lib/textProcessing.js
git commit -m "feat(study-suite): implement flashcard mastery tracking, AI summaries, and diagnostic quiz rationale"
git push -u origin feature/part-4-smart-study-suite
```

---

### 👤 Teammate 5 (Part 5 — EarlyRisk Prediction ML Engine)
```bash
# From extracted part-5-earlyrisk-ml-prediction:
git checkout -b feature/part-5-earlyrisk-ml-prediction
git add src/pages/RiskPrediction.jsx src/pages/PublicRiskWrapper.jsx \
        src/components/risk/ src/lib/earlyRisk.js backend/src/earlyRisk.js
git commit -m "feat(earlyrisk): implement multi-factor ML regression model and What-If simulator"
git push -u origin feature/part-5-earlyrisk-ml-prediction
```

---

### 👤 Teammate 6 (Part 6 — AI Career Guidance & Mentorship)
```bash
# From extracted part-6-ai-career-guidance:
git checkout -b feature/part-6-ai-career-guidance
git add src/pages/CareerGuidance.jsx src/pages/PublicCareerWrapper.jsx \
        src/pages/career-guidance.css src/data/careers.js src/components/AIMascot.jsx \
        src/components/GlassCard.jsx src/components/AchievementBadge.jsx src/components/AnimatedCounter.jsx
git commit -m "feat(career): integrate AI Career Mentor, interactive roadmap, and skill badges"
git push -u origin feature/part-6-ai-career-guidance
```

---

## 🔀 Step 3: Open and Merge Pull Requests on GitHub
1. In the GitHub repository, click the **Pull requests** tab.
2. Click **New pull request**.
3. Set the `base` branch to `main` and the `compare` branch to `feature/part-X-...`.
4. Add a descriptive title (e.g., `feat(module-2): student analytics dashboard`).
5. Click **Create pull request**.
6. The Team Lead reviews and clicks **Merge pull request** ➔ **Confirm merge**.
7. Repeat for all 6 modules!

---

## 📦 Zip Packages Available

| Part File | Target Teammate | Description |
| :--- | :--- | :--- |
| `part-1-auth-landing.zip` | Teammate 1 | Landing page, Auth, AppShell, Navigation, Server Core |
| `part-2-dashboard-analytics.zip` | Teammate 2 | Analytics Dashboard, SVG Telemetry Curves, Profile, Streaks |
| `part-3-ai-tutor-rag.zip` | Teammate 3 | AI Tutor Chat, Notes Ingestion, Hybrid BM25/TF-IDF RAG |
| `part-4-smart-study-suite.zip` | Teammate 4 | Active Recall Flashcards, Neural Summaries, Diagnostic Quiz |
| `part-5-earlyrisk-ml-prediction.zip` | Teammate 5 | EarlyRisk ML Prediction Model, Simulator, Risk Gauge |
| `part-6-ai-career-guidance.zip` | Teammate 6 | AI Career Guidance, Roadmap, AI Mentor, Gamification |
| `edusentry-complete-platform.zip` | Team Lead | Master platform full source code |
