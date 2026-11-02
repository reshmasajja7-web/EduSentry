#!/bin/bash
# ============================================================
# EduSentry Module Git Automation Script
# ============================================================
set -e

MODULE_NAME="module-1-auth-landing"
MODULE_TITLE="EduSentry — Part 1: Core Auth, Landing & Theme System"

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
