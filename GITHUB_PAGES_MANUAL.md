# 🚀 GitHub Pages Manual Deployment Guide

This guide explains how to manually deploy ShowUp to GitHub Pages.

---

## ✅ **What's Been Set Up**

### **Configuration:**
- ✅ `next.config.js` configured for static export
- ✅ Base path set to `/showup` (your repo name)
- ✅ Images set to unoptimized (required for static sites)
- ✅ `.nojekyll` file to prevent Jekyll processing

### **Deployment Method:**
- ✅ **Manual deployment** from `gh-pages` branch
- ✅ Build locally, push to GitHub
- ✅ Full control over what gets deployed
- ✅ Deployment script: `deploy.sh`

---

## 🎯 **Quick Start - Deploy Now!**

### **Option 1: Use Deployment Script** (Easiest)

Just run this one command:

```bash
cd /Users/chinmayjoshi/ShowUp
./deploy.sh
```

**What it does:**
1. ✅ Installs dependencies
2. ✅ Builds Next.js app
3. ✅ Switches to gh-pages branch
4. ✅ Copies build files
5. ✅ Commits and pushes
6. ✅ Switches back to your branch

**Time:** ~2-3 minutes

---

### **Option 2: Manual Steps** (Step-by-step)

If you prefer to do it manually:

```bash
cd /Users/chinmayjoshi/ShowUp

# 1. Build the app
npm install
npm run build

# 2. Switch to gh-pages branch
git checkout gh-pages

# 3. Copy built files
rm -rf !(out|node_modules|.git)
cp -r out/* .
touch .nojekyll

# 4. Commit and push
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin gh-pages

# 5. Switch back to main
git checkout main
```

---

## 🎛️ **Enable GitHub Pages in Repository**

### **Step 1: Go to Repository Settings**

Visit: https://github.com/Chinmayjoshi18/showup/settings/pages

### **Step 2: Configure Source**

Under "Build and deployment":

1. **Source:** Select "**Deploy from a branch**"
2. **Branch:** Select "**gh-pages**"
3. **Folder:** Select "**/ (root)**"
4. **Click "Save"**

### **Step 3: Wait for Deployment**

- GitHub will process the deployment (~1-2 minutes)
- You'll see a blue banner with "Your site is ready to be published"
- Then a green banner with "Your site is live"

### **Step 4: Visit Your Site**

🌐 **https://chinmayjoshi18.github.io/showup/**

---

## 📋 **Branch Structure**

```
Repository: Chinmayjoshi18/showup

├── main branch
│   ├── Source code
│   ├── All components
│   ├── Configuration files
│   └── Deploy script (deploy.sh)
│
└── gh-pages branch
    ├── Built static files only
    ├── HTML, CSS, JS, images
    ├── No source code
    └── This is what GitHub Pages serves
```

---

## 🔄 **Deployment Workflow**

### **Every Time You Want to Deploy:**

```bash
# 1. Make your changes in main branch
git checkout main
# ... make changes ...
git add .
git commit -m "Your changes"
git push origin main

# 2. Deploy to GitHub Pages
./deploy.sh

# 3. Your site updates in ~1-2 minutes
```

**That's it!** 🎉

---

## 📊 **What Gets Deployed**

### **In gh-pages branch:**
```
gh-pages/
├── index.html          # Your home page
├── _next/              # Next.js built files
├── browse.html         # Browse page
├── event/              # Event pages
├── checkout.html       # Checkout page
├── profile.html        # Profile page
├── signin.html         # Sign in page
├── .nojekyll           # Prevents Jekyll processing
└── [all other pages]
```

### **NOT in gh-pages branch:**
- ❌ Source code (`.tsx`, `.ts` files)
- ❌ Node modules
- ❌ Configuration files
- ❌ Only the built static files

---

## 🎨 **What Works on GitHub Pages**

### **✅ Full UI Experience:**
- Beautiful responsive design
- All animations and effects
- Mobile optimizations
- Interactive components
- Client-side routing

### **✅ Firebase Features (Client-side):**
- Authentication (sign in/sign out)
- Firestore database reads/writes
- Cloud Storage uploads/downloads
- Analytics tracking
- Remote Config
- Cloud Messaging

### **✅ Core Features:**
- Event browsing and search
- Wishlist/favorites
- Reviews and ratings UI
- Offers and coupons
- Booking flow (saves to Firestore)
- User profile

---

## 🔥 **Firebase Configuration**

### **Add Your Domain to Firebase:**

Since you're deploying to GitHub Pages, add the domain to Firebase:

1. **Go to:** https://console.firebase.google.com/project/showup-e088f/authentication/settings

2. **Under "Authorized domains", add:**
   ```
   chinmayjoshi18.github.io
   ```

3. **Click "Add domain"**

**Your Firebase config in `firebase.config.ts` is already set up and safe to be public!**

---

## 🛠️ **Customization**

### **Change Deployment Message:**

When running `./deploy.sh`, you'll be prompted for a commit message. Or edit the script to customize.

### **Test Build Locally Before Deploying:**

```bash
# Build
npm run build

# Serve locally
npx serve out

# Visit: http://localhost:3000/showup
# Test everything works before deploying
```

### **Deploy Specific Branch:**

```bash
# Deploy from a feature branch
git checkout feature-branch
./deploy.sh
# This will build from feature-branch and deploy to gh-pages
```

---

## 🧪 **Troubleshooting**

### **"Build failed"**
```bash
# Check for errors
npm run build

# Fix any TypeScript or build errors
# Then try deploying again
./deploy.sh
```

### **"Push failed"**
```bash
# Make sure you're authenticated with GitHub
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Try pushing manually
git push origin gh-pages
```

### **"Site not updating"**
- Wait 2-3 minutes (GitHub Pages takes time)
- Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check deployment status: https://github.com/Chinmayjoshi18/showup/deployments

### **"404 on refresh"**
This is normal for GitHub Pages with client-side routing. Options:
- Use hash routing
- Handle 404 in your app
- Accept that direct URL navigation requires going through home page

### **"Images not loading"**
- Check `next.config.js` has correct `basePath`
- Ensure images are in `/public` directory
- Check browser console for errors

---

## 📱 **Testing Deployment**

### **Before Deploying:**
```bash
# Build locally
npm run build

# Check the /out directory
ls -la out/

# Serve locally
npx serve out

# Test in browser
open http://localhost:3000/showup
```

### **After Deploying:**
1. Wait 2-3 minutes
2. Visit: https://chinmayjoshi18.github.io/showup/
3. Test all pages
4. Check Firebase features work
5. Test on mobile

---

## 🔒 **Security Notes**

### **What's Safe to Deploy:**
- ✅ Firebase config (designed to be public)
- ✅ All UI code
- ✅ Client-side logic

### **What to Keep Private:**
- ❌ Server-side API keys
- ❌ Database credentials
- ❌ Payment gateway secrets

**Note:** GitHub Pages only serves static files. All secrets should be in environment variables or Firebase backend.

---

## 📊 **Monitoring Deployment**

### **Check Deployment Status:**
- **Deployments:** https://github.com/Chinmayjoshi18/showup/deployments
- **Actions:** https://github.com/Chinmayjoshi18/showup/actions (if any)
- **Settings:** https://github.com/Chinmayjoshi18/showup/settings/pages

### **View Live Site:**
- **Your Site:** https://chinmayjoshi18.github.io/showup/
- **Repository:** https://github.com/Chinmayjoshi18/showup

---

## 🎯 **Quick Reference Commands**

### **Deploy to GitHub Pages:**
```bash
./deploy.sh
```

### **Build and Test Locally:**
```bash
npm run build
npx serve out
```

### **Switch Branches:**
```bash
git checkout main       # Development
git checkout gh-pages   # Deployed files
```

### **Update and Deploy:**
```bash
git checkout main
# ... make changes ...
git add .
git commit -m "Update: description"
git push origin main
./deploy.sh
```

### **View Deployment Status:**
```bash
# Open in browser
open https://github.com/Chinmayjoshi18/showup/deployments
```

---

## 🚀 **Deployment Checklist**

Before each deployment:

- [ ] All changes committed to main branch
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] Firebase config is correct
- [ ] Tested locally (`npx serve out`)
- [ ] Ready to deploy

Then:
```bash
./deploy.sh
```

After deployment:
- [ ] Wait 2-3 minutes
- [ ] Visit live site
- [ ] Test on desktop
- [ ] Test on mobile
- [ ] Check Firebase features work
- [ ] ✅ Deployment successful!

---

## 💡 **Pro Tips**

### **1. Deployment Branches:**
Keep `main` for development and `gh-pages` for deployment:
- Work in `main` branch
- Only deploy via `./deploy.sh`
- Never manually edit `gh-pages` branch

### **2. Test Before Deploy:**
Always build and test locally before deploying:
```bash
npm run build && npx serve out
```

### **3. Deployment Frequency:**
- Deploy often (after each feature)
- Deploy after bug fixes
- Deploy before showing clients/users

### **4. Version Control:**
Tag important deployments:
```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## 📄 **Summary**

### **To Deploy:**
```bash
cd /Users/chinmayjoshi/ShowUp
./deploy.sh
```

### **To Enable GitHub Pages:**
1. Go to: https://github.com/Chinmayjoshi18/showup/settings/pages
2. Source: "Deploy from a branch"
3. Branch: "gh-pages"
4. Folder: "/ (root)"
5. Save

### **Your Live Site:**
```
https://chinmayjoshi18.github.io/showup/
```

---

## 🆘 **Need Help?**

### **Deployment Script Not Working?**
```bash
chmod +x deploy.sh
./deploy.sh
```

### **Can't Push to GitHub?**
```bash
git config --list
# Check your GitHub credentials
```

### **Build Fails?**
```bash
npm run build
# Check error messages
# Fix issues in code
```

### **Site Not Updating?**
- Wait 2-3 minutes
- Hard refresh (Cmd+Shift+R)
- Check: https://github.com/Chinmayjoshi18/showup/deployments

---

**You're all set for manual GitHub Pages deployment!** 🎉

**Next:** Run `./deploy.sh` and enable GitHub Pages in settings!

