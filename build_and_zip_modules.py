import os
import shutil
import zipfile

PROJECT_ROOT = '/home/user/PROJECT SE/edusentry-final'
DIST_ROOT = os.path.join(PROJECT_ROOT, 'modules_distribution')

# Common scaffolding files included in every module so they are fully runnable & standalone:
COMMON_FILES = [
    'package.json',
    'vite.config.js',
    'tailwind.config.js',
    'postcss.config.js',
    'index.html',
    '.env.example',
    'public/favicon.svg',
    'public/edusentry_ambient_bg.jpg',
    'public/hero-bg.svg',
    'src/main.jsx',
    'src/App.jsx',
    'src/index.css',
    'src/lib/api.js',
    'src/context/ThemeContext.jsx',
    'src/context/AuthContext.jsx',
    'src/context/WorkspaceDataContext.jsx',
    'src/components/Logo.jsx',
    'src/components/Sidebar.jsx',
    'src/components/AppShell.jsx',
    'src/components/ProtectedRoute.jsx',
    'src/components/ModuleHeader.jsx',
    'src/components/Btn.jsx',
    'src/components/Block.jsx',
]

MODULES = {
    'module-1-auth-landing': {
        'title': 'EduSentry — Part 1: Core Auth, Landing & Theme System',
        'short_name': 'part-1-auth-landing',
        'role': 'Teammate 1 (Platform Architect / Team Lead)',
        'description': 'Owns user authentication, session security, high-contrast dark theme, landing hero showcase, and core Express/PostgreSQL backend services.',
        'files': [
            'src/pages/Home.jsx',
            'src/pages/Home.css',
            'src/pages/Features.jsx',
            'src/pages/About.jsx',
            'src/pages/Login.jsx',
            'src/pages/Register.jsx',
            'src/pages/ForgotPassword.jsx',
            'src/components/DynamicWorkflow.jsx',
            'src/components/PublicHeader.jsx',
            'src/components/SponsorsSection.jsx',
            'backend/package.json',
            'backend/README.md',
            'backend/.env.example',
            'backend/src/server.js',
            'backend/src/auth.js',
            'backend/src/db.js',
            'backend/src/sms.js',
            'backend/src/validation.js',
            'backend/sql/schema.sql',
        ]
    },
    'module-2-dashboard-analytics': {
        'title': 'EduSentry — Part 2: Student Progress & Analytics Dashboard',
        'short_name': 'part-2-dashboard-analytics',
        'role': 'Teammate 2 (Data Analytics & Visualization Engineer)',
        'description': 'Owns the interactive student command center, real-time multi-metric SVG progress curve analytics, study streaks, and student profile identity management.',
        'files': [
            'src/pages/Dashboard.jsx',
            'src/pages/Profile.jsx',
            'src/components/Tag.jsx',
            'src/lib/activityLog.js',
        ]
    },
    'module-3-ai-tutor-rag': {
        'title': 'EduSentry — Part 3: AI Tutor & Multi-LLM RAG Engine',
        'short_name': 'part-3-ai-tutor-rag',
        'role': 'Teammate 3 (AI / NLP & RAG Systems Engineer)',
        'description': 'Owns the document upload ingest pipeline, multi-LLM AI Tutor sandbox (Gemini, GPT-4o, Claude, DeepSeek), and hybrid contextual RAG citation engine.',
        'files': [
            'src/pages/AITutorChat.jsx',
            'src/pages/UploadNotes.jsx',
            'src/pages/PublicAITutor.jsx',
            'src/components/WorkspaceLayout.jsx',
            'src/data/sampleDocument.js',
            'src/lib/ragEngine.js',
            'src/lib/fileExtract.js',
            'backend/src/aiProvider.js',
            'backend/src/ragModels.js',
            'backend/src/api.js',
            'backend/test/ai-provider.test.js',
            'backend/test/rag-models.test.js',
        ]
    },
    'module-4-smart-study-suite': {
        'title': 'EduSentry — Part 4: Smart Study Suite (Flashcards, Summaries & Quiz)',
        'short_name': 'part-4-smart-study-suite',
        'role': 'Teammate 4 (EdTech & Active Recall Tools Engineer)',
        'description': 'Owns the active recall study tools: AI-generated 3D interactive flip flashcards, multi-tier bulleted summaries, and diagnostic multiple-choice quizzes with answer explanations.',
        'files': [
            'src/pages/Summaries.jsx',
            'src/pages/Flashcards.jsx',
            'src/pages/Quiz.jsx',
            'src/components/WorkspaceLayout.jsx',
            'src/lib/textProcessing.js',
        ]
    },
    'module-5-earlyrisk-ml-prediction': {
        'title': 'EduSentry — Part 5: EarlyRisk Prediction ML Engine',
        'short_name': 'part-5-earlyrisk-ml-prediction',
        'role': 'Teammate 5 (Machine Learning & Predictive Modeling Engineer)',
        'description': 'Owns the proactive academic setback prediction engine, multi-factor ML risk scoring model, interactive radial Risk Gauge, historical trend curves, and What-If simulator.',
        'files': [
            'src/pages/RiskPrediction.jsx',
            'src/pages/PublicRiskWrapper.jsx',
            'src/components/risk/RiskGauge.jsx',
            'src/components/risk/TrendChart.jsx',
            'src/components/risk/AcademicModal.jsx',
            'src/lib/earlyRisk.js',
            'backend/src/earlyRisk.js',
            'backend/test/validation.test.js',
        ]
    },
    'module-6-ai-career-guidance': {
        'title': 'EduSentry — Part 6: AI Career Guidance & Strategic Mentorship',
        'short_name': 'part-6-ai-career-guidance',
        'role': 'Teammate 6 (Recommender Systems & Career Strategy Engineer)',
        'description': 'Owns the AI career roadmap recommendation engine, interactive career path milestones, animated skill acquisition progress bars, career badge achievements, and AI mascot mentor.',
        'files': [
            'src/pages/CareerGuidance.jsx',
            'src/pages/PublicCareerWrapper.jsx',
            'src/pages/career-guidance.css',
            'src/components/AIMascot.jsx',
            'src/components/GlassCard.jsx',
            'src/components/AchievementBadge.jsx',
            'src/components/AnimatedCounter.jsx',
            'src/data/careers.js',
            'src/data/careerRoadmaps.js',
        ]
    }
}

GITIGNORE_CONTENT = """# Dependencies
node_modules/
.pnp
.pnp.js

# Production build
dist/
build/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log

# Editor
.vscode/
.idea/
*.swp
*.swo
.DS_Store
"""

PUSH_SCRIPT_TEMPLATE = """#!/bin/bash
# ============================================================
# EduSentry Module Git Automation Script
# ============================================================
set -e

MODULE_NAME="{module_dir}"
MODULE_TITLE="{module_title}"

echo "============================================================"
echo "  🚀 EduSentry Git Helper for: $MODULE_TITLE"
echo "============================================================"
echo ""
echo "This script will initialize git, stage all files in this module,"
echo "commit them, and push directly to your personal GitHub repository."
echo ""

if [ -z "$1" ]; then
  echo "Enter your personal GitHub repository URL:"
  echo "(Example: https://github.com/your-username/$MODULE_NAME.git)"
  read -p "Repository URL: " REPO_URL
else
  REPO_URL="$1"
fi

if [ -z "$REPO_URL" ]; then
  echo "❌ Error: No repository URL provided. Aborting."
  exit 1
fi

echo ""
echo "📦 Initializing Git repository..."
git init

echo "📋 Staging all files..."
git add .

echo "💾 Committing changes..."
git commit -m "feat($MODULE_NAME): initial release of $MODULE_TITLE" || echo "Already committed."

echo "🌿 Setting main branch..."
git branch -M main

echo "🔗 Connecting remote origin: $REPO_URL..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "============================================================"
echo "  ✅ SUCCESS: $MODULE_NAME successfully pushed to:"
echo "  $REPO_URL"
echo "============================================================"
"""

README_TEMPLATE = """# {title}

**Assigned Teammate:** {role}  
**Module Identifier:** `{module_dir}`  
**Suggested GitHub Branch:** `feature/{module_dir}`  
**Team Repository:** `https://github.com/<team-lead-username>/edusentry`  

---

## 🎯 Domain & Responsibilities
{description}

---

## 📂 Files Included in this Module
```
{files_tree}
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
./push_to_github.sh https://github.com/<your-username>/{module_dir}.git
```

### Method 2: Manual Git Commands
```bash
git init
git add .
git commit -m "feat({module_dir}): initial release of {title}"
git branch -M main
git remote add origin https://github.com/<your-username>/{module_dir}.git
git push -u origin main
```

---

## 🔀 How to Submit a Pull Request to the Main Team Repository
1. On GitHub, navigate to the main team repository: `https://github.com/<team-lead-username>/edusentry`.
2. Click **Fork** (or clone the main repo if you are added as a collaborator).
3. Push your module branch:
   ```bash
   git checkout -b feature/{module_dir}
   git add .
   git commit -m "feat({module_dir}): implement module components and logic"
   git push -u origin feature/{module_dir}
   ```
4. Click **Compare & pull request** on GitHub and assign your team lead for review!
"""

def create_module_tree(files_list):
    lines = []
    for f in sorted(files_list):
        lines.append(f"├── {f}")
    return "\\n".join(lines)

def make_zip(source_dir, output_zip):
    print(f"Creating zip: {output_zip} ...")
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                file_path = os.path.join(root, file)
                archive_path = os.path.relpath(file_path, source_dir)
                zf.write(file_path, archive_path)
    print(f"Created: {output_zip} ({os.path.getsize(output_zip) / (1024*1024):.2f} MB)")

def main():
    print("🚀 Starting EduSentry 6-Module Division and Packaging...")
    os.makedirs(DIST_ROOT, exist_ok=True)

    created_zips = []

    for mod_dir_name, info in MODULES.items():
        mod_path = os.path.join(DIST_ROOT, mod_dir_name)
        print(f"\\n--- Processing {info['title']} ({mod_dir_name}) ---")
        
        # Clean target directory
        if os.path.exists(mod_path):
            shutil.rmtree(mod_path)
        os.makedirs(mod_path, exist_ok=True)

        all_files = list(set(COMMON_FILES + info['files']))

        # Copy each file
        for rel_file in all_files:
            src_file = os.path.join(PROJECT_ROOT, rel_file)
            dest_file = os.path.join(mod_path, rel_file)
            
            if os.path.exists(src_file):
                os.makedirs(os.path.dirname(dest_file), exist_ok=True)
                shutil.copy2(src_file, dest_file)
            else:
                print(f"  ⚠️ Warning: File not found: {src_file}")

        # Write .gitignore
        with open(os.path.join(mod_path, '.gitignore'), 'w') as f:
            f.write(GITIGNORE_CONTENT)

        # Write push_to_github.sh
        script_path = os.path.join(mod_path, 'push_to_github.sh')
        with open(script_path, 'w') as f:
            f.write(PUSH_SCRIPT_TEMPLATE.format(
                module_dir=mod_dir_name,
                module_title=info['title']
            ))
        os.chmod(script_path, 0o755)

        # Write README.md
        readme_path = os.path.join(mod_path, 'README.md')
        with open(readme_path, 'w') as f:
            f.write(README_TEMPLATE.format(
                title=info['title'],
                role=info['role'],
                module_dir=mod_dir_name,
                description=info['description'],
                files_tree=create_module_tree(all_files)
            ))

        # Generate module zip file
        zip_name = f"{info['short_name']}.zip"
        zip_output_dist = os.path.join(DIST_ROOT, zip_name)
        make_zip(mod_path, zip_output_dist)
        created_zips.append(zip_output_dist)

        # Also copy with alternate naming (module-X-...)
        alt_zip = os.path.join(DIST_ROOT, f"{mod_dir_name}.zip")
        shutil.copy2(zip_output_dist, alt_zip)

        # Copy to project root
        root_zip = os.path.join(PROJECT_ROOT, zip_name)
        shutil.copy2(zip_output_dist, root_zip)

    # Now create the Complete Platform Zip (all non-ignored project files)
    print("\\n--- Generating Complete Platform ZIP: edusentry-complete-platform.zip ---")
    complete_zip_path = os.path.join(DIST_ROOT, 'edusentry-complete-platform.zip')
    
    with zipfile.ZipFile(complete_zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(PROJECT_ROOT):
            # Ignore node_modules, dist, .git, and modules_distribution to avoid bloat/recursion
            dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', '.git', 'modules_distribution', '__pycache__']]
            for file in files:
                if file.endswith('.zip') or file.endswith('.tar.gz') or file.endswith('.bak'):
                    continue
                file_path = os.path.join(root, file)
                archive_path = os.path.relpath(file_path, PROJECT_ROOT)
                zf.write(file_path, archive_path)
    
    print(f"Created complete platform zip: {complete_zip_path} ({os.path.getsize(complete_zip_path) / (1024*1024):.2f} MB)")
    
    # Copy complete zip to project root
    shutil.copy2(complete_zip_path, os.path.join(PROJECT_ROOT, 'edusentry-complete-platform.zip'))

    # Copy all generated zips to /home/user/Desktop and /home/user/Downloads if they exist
    dest_folders = ['/home/user/Desktop', '/home/user/Downloads']
    for dest in dest_folders:
        if os.path.exists(dest):
            print(f"Copying zips to {dest}...")
            for z in os.listdir(DIST_ROOT):
                if z.endswith('.zip'):
                    shutil.copy2(os.path.join(DIST_ROOT, z), os.path.join(dest, z))

    print("\\n✅ All 6 module divisions and zips regenerated successfully!")

if __name__ == '__main__':
    main()
