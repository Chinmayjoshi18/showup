# Admin Panel Setup Guide

## 🔐 Admin Credentials

**Default Admin Login:**
- **Email**: `admin@showup.com`
- **Password**: `ShowUp@Admin2024`
- **Access URL**: `https://your-showup-domain.com/admin`

---

## 🚀 First-Time Setup

### Step 1: Create Admin Firebase Account

You need to create the admin account in Firebase Authentication:

#### Option A: Using Firebase Console (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your ShowUp project
3. Navigate to **Authentication** → **Users**
4. Click **"Add user"**
5. Enter:
   - **Email**: `admin@showup.com`
   - **Password**: `ShowUp@Admin2024`
6. Click **"Add user"**

#### Option B: Using Your Sign-Up Page
1. Go to your ShowUp site: `/signin`
2. Sign up with:
   - **Email**: `admin@showup.com`
   - **Password**: `ShowUp@Admin2024`
   - **Name**: `Admin User`
3. This will create the Firebase user automatically

---

## 🎯 How to Access Admin Panel

### For You (Admin):
1. Open your browser
2. Go to: `https://your-showup-domain.com/admin`
3. You'll be redirected to: `/admin/login`
4. Enter credentials:
   - Email: `admin@showup.com`
   - Password: `ShowUp@Admin2024`
5. Click **"Access Admin Panel"**
6. You're in! 🎉

### Session Details:
- **Session Duration**: 24 hours
- **Auto-logout**: After 24 hours of inactivity
- **Manual logout**: Click "Sign Out" in sidebar

---

## 🔒 Security Recommendations

### ⚠️ IMPORTANT: Change Default Password

After first login, you should change the admin password:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. **Authentication** → **Users**
3. Find `admin@showup.com`
4. Click the 3 dots → **Reset password**
5. Use a strong password like: `MySecure@Pass2024!`

### 🔐 Strong Password Requirements:
- At least 12 characters
- Mix of uppercase and lowercase
- Include numbers and symbols
- Don't use common words
- Don't share with anyone

### 🛡️ Additional Security:
1. **Enable 2FA** (if available in your Firebase plan)
2. **Monitor login attempts** in Firebase Analytics
3. **Regular password changes** (every 90 days)
4. **Use password manager** (1Password, LastPass, etc.)

---

## 📊 Admin Panel Features

Once logged in, you have access to:

### 1. **Dashboard Overview**
- Total users count
- Total organizers
- Pending approvals
- Revenue metrics
- Growth indicators
- Recent activity

### 2. **Analytics**
- Revenue trends (12-month chart)
- Category performance
- Top performing cities
- Booking analytics

### 3. **User Management**
- View all users
- Search by name/email
- Filter by role (Admin/Organizer/Customer)
- User activity status

### 4. **Organizer Management**
- Add new organizers
- Remove organizer roles
- View organizer details
- Organization tracking

### 5. **Event Approvals**
- Review pending events
- Approve/reject events
- View event details
- Price change approvals

### 6. **Booking Management**
- View all bookings
- Booking statistics
- Revenue tracking
- Customer details

---

## 🔧 Troubleshooting

### Can't Login?

**Problem**: "Invalid admin credentials" error

**Solutions**:
1. ✅ Make sure you created `admin@showup.com` in Firebase
2. ✅ Check password is exactly: `ShowUp@Admin2024`
3. ✅ Try resetting password in Firebase Console
4. ✅ Clear browser cache and try again
5. ✅ Try incognito/private mode

### Session Expired?

**Problem**: Redirected to login after being logged in

**Solution**: 
- Sessions expire after 24 hours
- Just login again with same credentials

### Page Won't Load?

**Problem**: Admin page shows error or blank screen

**Solutions**:
1. ✅ Check browser console (F12) for errors
2. ✅ Make sure Vercel deployment succeeded
3. ✅ Clear browser cache
4. ✅ Try different browser
5. ✅ Contact developer if persists

---

## 🎨 Customization

### Want Different Credentials?

Edit `/app/admin/login/page.tsx`:

```typescript
// Find these lines (around line 17-18):
const ADMIN_EMAIL = 'admin@showup.com'
const ADMIN_PASSWORD = 'ShowUp@Admin2024'

// Change to your preferred credentials:
const ADMIN_EMAIL = 'your-email@example.com'
const ADMIN_PASSWORD = 'YourSecurePassword123!'
```

Then:
1. Commit and push changes
2. Create the new user in Firebase
3. Login with new credentials

### Want Longer Sessions?

Edit `/app/admin/page.tsx`:

```typescript
// Find this line (around line 92):
const twentyFourHours = 24 * 60 * 60 * 1000

// Change to longer duration (e.g., 7 days):
const sevenDays = 7 * 24 * 60 * 60 * 1000
```

---

## 📞 Support

If you need help:
1. Check Firebase Console for errors
2. Check browser console (F12)
3. Review Vercel deployment logs
4. Contact the developer

---

## ✅ Quick Checklist

Before going live:

- [ ] Created admin@showup.com in Firebase
- [ ] Changed default password
- [ ] Successfully logged into admin panel
- [ ] Tested all admin features
- [ ] Set up monitoring/alerts
- [ ] Documented custom credentials (if changed)
- [ ] Backed up Firebase project
- [ ] Enabled 2FA (if available)

---

**Created**: January 2024  
**Last Updated**: January 2024  
**Version**: 1.0

🎉 **Your admin panel is ready to use!**

