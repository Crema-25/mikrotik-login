# 🚀 Zanoon — Quick Start Guide

> Get your Zanoon HotSpot portal running in 5 minutes

## ⚡ 30-Second Overview

**Zanoon** is a modern, dark-themed WiFi login portal for MikroTik routers.

```
Dark theme + Responsive + Lightweight (64KB) + No CDN + Full MikroTik support
```

## 📋 What You Get

✅ Professional login page  
✅ Session status display  
✅ Dark & light themes  
✅ Mobile-optimized  
✅ Works offline  
✅ < 100KB total  

## 🎯 3 Steps to Deploy

### Step 1: Upload Files
```bash
# SSH into your router
ssh admin@192.168.1.1

# Create directory
mkdir -p /flash/hotspot/zanoon

# From your computer, upload files:
scp -r ./* admin@192.168.1.1:/flash/hotspot/zanoon/
```

### Step 2: Configure Profile
```bash
# On router terminal:
/ip hotspot profile set [ find name="hsprof1" ] \
  login-path="/flash/hotspot/zanoon/login.html" \
  status-path="/flash/hotspot/zanoon/status.html" \
  logout-path="/flash/hotspot/zanoon/logout.html" \
  error-path="/flash/hotspot/zanoon/error.html"
```

### Step 3: Restart HotSpot
```bash
/ip hotspot stop
/ip hotspot start
```

**✓ Done!** Connect to WiFi and test.

## 🎨 Customize It

### Change Logo
Replace `assets/logo.svg` with your logo (keep same filename)

### Change Contact Info
Edit each HTML file and update:
```html
<!-- Email -->
zanoon752@gmail.com

<!-- Phone -->
+261 38 01 347 54
```

### Change Colors
Edit `css/style.css` line 8-20:
```css
:root {
  --color-primary: #9333ea;  /* Change this purple */
}
```

### Change Text
Edit HTML headers in each file:
```html
<h1 class="header-title">Your Company Name</h1>
```

## 📱 Features by Device

### 📱 Phone (320px+)
- Vertical form layout
- Full-width buttons
- Optimized touch interaction
- No horizontal scroll

### 💻 Tablet (768px+)
- Centered layout
- Better spacing
- Multi-column info cards
- Wider forms

### 🖥️ Desktop (1920px+)
- Centered container (480px wide)
- Balanced spacing
- Full theme toggle
- Optimal readability

## 🌙 Light/Dark Theme

Users can toggle theme with ☀️/🌙 button (top right).

Preference is saved automatically. Respects system preferences on first visit.

## 🔒 Security

- ✅ No password storage
- ✅ No tracking
- ✅ No external scripts
- ✅ All local processing
- ✅ HTTPS ready

## 🐛 If Something Goes Wrong

### Blank page?
```bash
# Restart hotspot
ssh admin@192.168.1.1
/ip hotspot restart
```

### No styling?
```bash
# Check CSS file exists
ls /flash/hotspot/zanoon/css/

# Check file permissions
chmod 644 /flash/hotspot/zanoon/css/style.css
```

### MikroTik variables not showing?
```bash
# Verify profile configuration
/ip hotspot profile print detail

# Check file paths match your configuration
ls /flash/hotspot/zanoon/*.html
```

## 📞 Support

- **Email:** zanoon752@gmail.com
- **Phone:** +261 38 01 347 54

## 📚 More Info

- [Full Documentation](README.md)
- [Testing Guide](TESTING.md)
- [Deployment Script](deploy.sh)

---

**Ready to go?** Connect to your WiFi!

🎉 Welcome to Zanoon
