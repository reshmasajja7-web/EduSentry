# EduSentry — Part 3: AI Tutor & Multi-LLM RAG Engine

**Assigned Teammate:** Teammate 3 (AI / NLP & RAG Systems Engineer)  
**Module Identifier:** `module-3-ai-tutor-rag`  
**Suggested GitHub Branch:** `feature/module-3-ai-tutor-rag`  
**Team Repository:** `https://github.com/<team-lead-username>/edusentry`  

---

## 🎯 Domain & Responsibilities
Owns the document upload ingest pipeline, multi-LLM AI Tutor sandbox (Gemini, GPT-4o, Claude, DeepSeek), and hybrid contextual RAG citation engine.

---

## 📂 Files Included in this Module
```
├── .env.example\n├── backend/src/aiProvider.js\n├── backend/src/api.js\n├── backend/src/ragModels.js\n├── backend/test/ai-provider.test.js\n├── backend/test/rag-models.test.js\n├── index.html\n├── package.json\n├── postcss.config.js\n├── public/edusentry_ambient_bg.jpg\n├── public/favicon.svg\n├── public/hero-bg.svg\n├── src/App.jsx\n├── src/components/AppShell.jsx\n├── src/components/Block.jsx\n├── src/components/Btn.jsx\n├── src/components/Logo.jsx\n├── src/components/ModuleHeader.jsx\n├── src/components/ProtectedRoute.jsx\n├── src/components/Sidebar.jsx\n├── src/components/WorkspaceLayout.jsx\n├── src/context/AuthContext.jsx\n├── src/context/ThemeContext.jsx\n├── src/context/WorkspaceDataContext.jsx\n├── src/data/sampleDocument.js\n├── src/index.css\n├── src/lib/api.js\n├── src/lib/fileExtract.js\n├── src/lib/ragEngine.js\n├── src/main.jsx\n├── src/pages/AITutorChat.jsx\n├── src/pages/PublicAITutor.jsx\n├── src/pages/UploadNotes.jsx\n├── tailwind.config.js\n├── vite.config.js
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
./push_to_github.sh https://github.com/<your-username>/module-3-ai-tutor-rag.git
```

### Method 2: Manual Git Commands
```bash
git init
git add .
git commit -m "feat(module-3-ai-tutor-rag): initial release of EduSentry — Part 3: AI Tutor & Multi-LLM RAG Engine"
git branch -M main
git remote add origin https://github.com/<your-username>/module-3-ai-tutor-rag.git
git push -u origin main
```

---

## 🔀 How to Submit a Pull Request to the Main Team Repository
1. On GitHub, navigate to the main team repository: `https://github.com/<team-lead-username>/edusentry`.
2. Click **Fork** (or clone the main repo if you are added as a collaborator).
3. Push your module branch:
   ```bash
   git checkout -b feature/module-3-ai-tutor-rag
   git add .
   git commit -m "feat(module-3-ai-tutor-rag): implement module components and logic"
   git push -u origin feature/module-3-ai-tutor-rag
   ```
4. Click **Compare & pull request** on GitHub and assign your team lead for review!
