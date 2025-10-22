# 🚀 GitHub Pages Deployment Guide

This guide explains how to deploy ShowUp to GitHub Pages.

---

## ✅ **What's Been Set Up**

### 1. **Static Export Configuration**
- ✅ `next.config.js` configured for static export
- ✅ Base path set to `/showup` (your repo name)
- ✅ Images set to unoptimized (required for static sites)
- ✅ Trailing slashes enabled

### 2. **GitHub Actions Workflow**
- ✅ Auto-deploy on push to `gh-pages` branch
- ✅ Builds Next.js app
- ✅ Deploys to GitHub Pages
- ✅ Located at: `.github/workflows/deploy-gh-pages.yml`

### 3. **Branch Structure**
- `main` - Main development branch
- `gh-pages` - GitHub Pages deployment branch

---

## 🎯 **Enable GitHub Pages**

### **Step 1: Push the gh-pages branch**

Already done! The branch has been created. Now push it:

```bash
cd /Users/chinmayjoshi/ShowUp
git add .
git commit -m "Configure GitHub Pages deployment"
git push -u origin gh-pages
```

### **Step 2: Enable GitHub Pages in Repository Settings**

1. **Go to your repository:**
   https://github.com/Chinmayjoshi18/showup

2. **Click on "Settings" tab**

3. **Scroll down to "Pages" in the left sidebar**

4. **Configure:**
   - **Source:** GitHub Actions
   - This will use the workflow we created

5. **Wait for deployment** (~2-3 minutes)

6. **Visit your site:**
   https://chinmayjoshi18.github.io/showup/

---

## 🔄 **Deployment Process**

### **Automatic Deployment:**

Every time you push to `gh-pages` branch:
1. GitHub Actions workflow triggers
2. Installs dependencies (`npm ci`)
3. Builds the app (`npm run build`)
4. Exports static files to `/out`
5. Deploys to GitHub Pages
6. Site goes live in ~2 minutes

### **Manual Deployment:**

```bash
# Make changes
cd /Users/chinmayjoshi/ShowUp
git checkout gh-pages

# Commit and push
git add .
git commit -m "Update: description of changes"
git push origin gh-pages

# GitHub Actions will auto-deploy
```

---

## ⚠️ **Important Limitations**

### **GitHub Pages is Static-Only:**

Because GitHub Pages only serves static files, some features won't work:

#### **❌ Won't Work:**
- ❌ Server-side rendering (SSR)
- ❌ API routes (`/api/*`)
- ❌ Dynamic routes without pre-rendering
- ❌ Real-time features (WebSockets)
- ❌ Backend processing

#### **✅ Will Work:**
- ✅ Client-side rendering
- ✅ Static pages
- ✅ Client-side routing
- ✅ Firebase client SDK (Auth, Firestore, Storage)
- ✅ All UI features
- ✅ Local storage
- ✅ Client-side API calls

---

## 🔥 **Firebase Integration**

### **Good News:**
Firebase works perfectly with GitHub Pages because it's all client-side!

### **Add Environment Variables:**

Since GitHub Pages doesn't support server-side env vars, you need to make Firebase config public (it's designed to be public).

**Option 1: Hardcode in `firebase.config.ts`** (Recommended for public repos)
```typescript
// Already configured - your Firebase config is safe to be public
```

**Option 2: Use GitHub Secrets + Build-time Injection**
1. Go to: Settings → Secrets and variables → Actions
2. Add secrets:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - etc.
3. Update workflow to inject during build

**Note:** Firebase config is designed to be public. Your security comes from Firestore/Storage rules, not hiding the config.

---

## 🎨 **What Works on GitHub Pages**

### **✅ Full UI Experience:**
- Beautiful responsive design
- All animations and effects
- Mobile optimizations
- Interactive components
- Client-side routing

### **✅ Firebase Features:**
- Authentication (sign in/sign out)
- Firestore database reads/writes
- Cloud Storage uploads/downloads
- Analytics tracking
- Remote Config
- Cloud Messaging (push notifications)

### **✅ Core Features:**
- Event browsing and search
- Wishlist/favorites
- Reviews and ratings UI
- Offers and coupons
- Booking flow (saves to Firestore)
- User profile

### **⚠️ Requires External Services:**
- Payment processing (needs backend - use Firebase Functions)
- Email/SMS notifications (needs backend)
- QR code generation (can use client-side library)

---

## 🚀 **Recommended Architecture**

For a production-ready app on GitHub Pages:

### **Frontend (GitHub Pages):**
- Next.js static export
- All UI components
- Firebase client SDK
- Client-side logic

### **Backend (Firebase Functions):**
```
/functions
  /src
    /api
      - payment.ts (Juspay integration)
      - email.ts (SendGrid/SES)
      - qrcode.ts (QR generation)
    /triggers
      - onBookingCreated.ts (send emails/SMS)
      - onPaymentSuccess.ts (generate ticket)
```

---

## 📊 **Deployment Status**

Check deployment status:
1. **Go to:** https://github.com/Chinmayjoshi18/showup/actions
2. **Click on latest workflow run**
3. **See build and deployment logs**

### **Troubleshooting:**

**Build fails?**
- Check workflow logs
- Ensure all dependencies are in `package.json`
- Test build locally: `npm run build`

**404 on refresh?**
- This is normal for GitHub Pages with client-side routing
- Create a `404.html` that redirects to `index.html`
- Or use hash routing

**Images not loading?**
- Check image paths (use relative paths)
- Ensure images are in `/public` directory
- Check `basePath` in `next.config.js`

---

## 🔧 **Build Locally**

Test the static export before deploying:

```bash
cd /Users/chinmayjoshi/ShowUp

# Build for production
npm run build

# The static files will be in /out directory
# Open out/index.html in browser to test

# Or serve locally
npx serve out
# Visit: http://localhost:3000/showup
```

---

## 🎯 **Next Steps After Deployment**

### **1. Test Your Live Site:**
Visit: https://chinmayjoshi18.github.io/showup/

### **2. Set Up Custom Domain** (Optional)
- Buy a domain (GoDaddy, Namecheap, etc.)
- Add CNAME file to public directory
- Configure DNS settings
- Update in GitHub Pages settings

### **3. Add Firebase Functions** (For Backend Features)
```bash
# Initialize Firebase Functions
firebase init functions

# Deploy functions
firebase deploy --only functions
```

### **4. Monitor Performance:**
- Google Analytics (already configured)
- Firebase Performance Monitoring
- GitHub Actions build times

---

## 📋 **Maintenance**

### **Update Content:**
```bash
git checkout gh-pages
# Make changes
git add .
git commit -m "Update content"
git push origin gh-pages
```

### **Merge from main:**
```bash
git checkout gh-pages
git merge main
git push origin gh-pages
```

### **Roll Back:**
```bash
git checkout gh-pages
git log  # Find commit to revert to
git reset --hard <commit-hash>
git push origin gh-pages --force
```

---

## ✅ **Summary**

### **What You Get:**
- ✅ Free hosting on GitHub Pages
- ✅ Auto-deploy on push
- ✅ HTTPS enabled
- ✅ Global CDN
- ✅ Custom domain support
- ✅ Firebase integration works perfectly
- ✅ Professional-looking URL

### **Your Live Site:**
```
https://chinmayjoshi18.github.io/showup/
```

### **Deployment Command:**
```bash
git add .
git commit -m "Update"
git push origin gh-pages
```

**That's it!** Your ShowUp app will be live in ~2 minutes! 🎉

---

## 🆘 **Need Help?**

### **Common Issues:**

1. **Pages not updating?**
   - Clear GitHub Actions cache
   - Hard refresh browser (Cmd+Shift+R)

2. **Firebase not working?**
   - Check Firebase config in `firebase.config.ts`
   - Verify domain in Firebase Console (add `chinmayjoshi18.github.io`)

3. **404 errors?**
   - Check `basePath` in `next.config.js`
   - Ensure trailing slashes

4. **Build failing?**
   - Check Actions logs
   - Test locally: `npm run build`

---

**Your ShowUp app is ready for GitHub Pages!** 🚀

Visit: https://chinmayjoshi18.github.io/showup/ (after enabling in settings)

