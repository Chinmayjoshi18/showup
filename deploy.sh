#!/bin/bash

# Manual GitHub Pages Deployment Script
# This script builds and deploys ShowUp to GitHub Pages

echo "🚀 ShowUp - GitHub Pages Manual Deployment"
echo "==========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🔨 Step 2: Building Next.js app for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    echo "Please fix the errors and try again."
    exit 1
fi

echo ""
echo "✅ Build successful! Static files are in /out directory"
echo ""

echo "📤 Step 3: Preparing to deploy to gh-pages branch..."

# Check if gh-pages branch exists
if ! git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "Creating gh-pages branch..."
    git branch gh-pages
fi

# Save current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# Commit current changes if any
if [ -n "$(git status --porcelain)" ]; then
    echo ""
    echo "⚠️  You have uncommitted changes in $CURRENT_BRANCH"
    read -p "Do you want to commit them? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
    fi
fi

echo ""
echo "📂 Step 4: Copying build files to gh-pages branch..."

# Switch to gh-pages branch
git checkout gh-pages

# Remove old files (except .git, node_modules, and out)
find . -maxdepth 1 ! -name '.' ! -name '..' ! -name '.git' ! -name 'node_modules' ! -name 'out' -exec rm -rf {} +

# Copy built files from out directory to root
cp -r out/* .

# Add .nojekyll file
touch .nojekyll

# Add all files
git add .

# Commit
echo ""
read -p "Enter deployment commit message (or press Enter for default): " deploy_msg
if [ -z "$deploy_msg" ]; then
    deploy_msg="Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
fi

git commit -m "$deploy_msg"

if [ $? -ne 0 ]; then
    echo "⚠️  No changes to commit"
else
    echo "✅ Changes committed to gh-pages branch"
fi

echo ""
echo "🚀 Step 5: Pushing to GitHub..."
git push origin gh-pages

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 🎉 🎉 DEPLOYMENT SUCCESSFUL! 🎉 🎉 🎉"
    echo ""
    echo "Your site will be live in ~2 minutes at:"
    echo "👉 https://chinmayjoshi18.github.io/showup/"
    echo ""
else
    echo ""
    echo "❌ Push failed!"
    echo "Please check your git credentials and try again."
fi

# Switch back to original branch
echo ""
echo "↩️  Switching back to $CURRENT_BRANCH branch..."
git checkout "$CURRENT_BRANCH"

echo ""
echo "✅ Done!"
echo ""
echo "📋 Next steps:"
echo "1. Go to: https://github.com/Chinmayjoshi18/showup/settings/pages"
echo "2. Set Source to: Deploy from a branch"
echo "3. Select branch: gh-pages"
echo "4. Select folder: / (root)"
echo "5. Click Save"
echo ""
echo "Your site will be live at: https://chinmayjoshi18.github.io/showup/"

