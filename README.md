# 🌙 ZANOON — Premium MikroTik HotSpot Portal

> Dark, elegant, and premium WiFi authentication portal for MikroTik RouterOS 7.25+

## 📋 Overview

**Zanoon** is a complete, production-ready HotSpot portal designed for MikroTik RouterOS. It combines stunning dark-themed design with full MikroTik HotSpot compatibility.

### ✨ Features

- ✅ **Full MikroTik Compatibility** – Works seamlessly with RouterOS 7.25+ HotSpot system
- 🌈 **Dual Themes** – Dark mode (default) + Light mode with localStorage persistence
- 📱 **Fully Responsive** – Optimized for mobile (320px+), tablet, and desktop
- ⚡ **Ultra-Lightweight** – < 1MB total size, zero CDN dependencies
- 🎨 **Premium Design** – Dark/purple theme with shadow aura effects
- 🔒 **Privacy-First** – No tracking, no external APIs, all local
- ♿ **Accessible** – WCAG compliant with keyboard navigation
- 🚀 **High Performance** – Instant loading, smooth animations with prefers-reduced-motion support

## 📁 Project Structure

```
zanoon-hotspot/
├── login.html           # Main login page
├── status.html          # Session status display
├── logout.html          # Logout confirmation
├── error.html           # Error handling
├── redirect.html        # Redirect after auth
│
├── css/
│   └── style.css        # Complete styling system
│
├── js/
│   └── app.js           # Core functionality
│
├── assets/
│   └── logo.svg         # Zanoon logo
│
└── README.md            # This file
```

## 🚀 Installation

### Prerequisites

- MikroTik RouterOS 7.25 or later
- Access to HotSpot configuration files

### Steps

1. **Prepare files:**
   ```bash
   # On your computer, organize files in the above structure
   ```

2. **Upload to MikroTik:**
   - Connect via WinBox or SSH
   - Navigate to: `IP > Hotspot > Server Profiles > [your-profile] > Files`
   - Upload all files maintaining the directory structure

   Or via SSH/SCP:
   ```bash
   scp -r ./zanoon-hotspot/* admin@<mikrotik-ip>:/flash/hotspot/
   ```

3. **Configure in MikroTik:**
   - IP > Hotspot > Server Profiles
   - Select your profile
   - Set:
     - **Login Page:** `login.html`
     - **Status Page:** `status.html`
     - **Logout Page:** `logout.html`
     - **Error Page:** `error.html`

## 🎨 Customization

### Color Theme

Edit CSS variables in `css/style.css`:

```css
:root {
  /* Dark Mode Colors */
  --color-primary: #9333ea;           /* Purple */
  --color-primary-dark: #7c3aed;      /* Darker Purple */
  --color-primary-light: #a855f7;     /* Lighter Purple */
  
  /* Update these to change the theme */
  --bg-primary: #0f172a;              /* Background */
  --color-text: #e2e8f0;              /* Text */
}
```

### Support Information

Edit in each HTML file:

```html
<!-- Email -->
zanoon752@gmail.com

<!-- Phone -->
+261 38 01 347 54
```

### Branding

- **Logo:** Replace `assets/logo.svg` with your branded logo
- **Title:** Update "Zanoon" text in headers
- **Subtitle:** Modify "Bienvenue sur Zanoon Service WiFi"

## 📱 Responsive Breakpoints

Tested on:
- **Mobile:** 320px, 375px, 414px
- **Tablet:** 768px
- **Desktop:** 1024px, 1366px, 1920px+

## 🔐 MikroTik Variables

The portal correctly uses:

```html
$(link-login-only)              <!-- Login form endpoint -->
$(link-orig)                    <!-- Original destination -->
$(link-logout)                  <!-- Logout endpoint -->
$(link-status)                  <!-- Status page -->
$(username)                     <!-- Current user -->
$(ip)                          <!-- Client IP -->
$(error)                       <!-- Error message -->
$(session-time-remaining)      <!-- Session duration -->
$(uptime)                      <!-- Connection time -->
$(bytes-in)                    <!-- Downloaded bytes -->
$(bytes-out)                   <!-- Uploaded bytes -->
$(status)                      <!-- Error status -->
```

## ⚙️ Features by Page

### login.html
- Clean login form with username/password
- Password show/hide toggle
- Real-time form validation
- Error display from MikroTik
- Support contact information
- Announcement section
- Rates/pricing placeholder

### status.html
- Connected user information
- IP address display
- Session duration
- Data usage statistics (uploaded/downloaded)
- Logout button with confirmation
- Quick support access

### logout.html
- Success message
- Reconnection button
- Support contact options

### error.html
- Error display
- Troubleshooting tips
- Support contact information
- Back button

### redirect.html
- Auto-redirect with countdown
- Manual redirect link
- Loading spinner

## 🎬 Animations

All animations respect `prefers-reduced-motion`:

- **Fade In** – Content appears on page load
- **Slide Down** – Header slides down
- **Slide Up** – Alerts slide up
- **Logo Float** – Subtle floating animation
- **Gradient Shift** – Background animation
- **Spin** – Loading spinner

## 🔒 Security & Privacy

✅ **No tracking or analytics**
✅ **No external API calls**
✅ **No password storage**
✅ **No third-party libraries**
✅ **All processing local**
✅ **HTML escaping for XSS prevention**

## 🌐 Offline Functionality

The portal works completely offline before authentication:
- ✅ No CDN dependencies
- ✅ No Google Fonts
- ✅ No icon libraries
- ✅ All SVG assets local
- ✅ Pure CSS and JavaScript

## 📊 Performance Metrics

- **Total Size:** ~950 KB (including all assets)
- **CSS:** ~32 KB
- **JavaScript:** ~9 KB
- **HTML Pages:** ~8-12 KB each
- **Logo SVG:** ~3 KB
- **Load Time:** < 1 second on modern connections

## 🎯 Browser Compatibility

- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (iOS 12+)
- ✅ Android Chrome
- ⚠️ IE11 (no animations)

## 🛠️ Troubleshooting

### Portal shows blank page
1. Check file paths are correct
2. Verify CSS and JS load properly
3. Check MikroTik logs: `system > logging`

### MikroTik variables not displaying
1. Ensure files are in correct HotSpot directory
2. Restart HotSpot service: `ip hotspot > stop/start`
3. Check template file format (must be .html)

### Theme not toggling
1. Verify `localStorage` is enabled in browser
2. Check browser console for errors
3. Clear browser cache

### Styling issues
1. Clear browser cache (Ctrl+Shift+Delete)
2. Verify CSS file is loaded (F12 > Network tab)
3. Check no custom CSS overrides in MikroTik

## 📝 License

Created for use with MikroTik RouterOS HotSpot systems.

## 📞 Support

- **Email:** zanoon752@gmail.com
- **Phone:** +261 38 01 347 54
- **Documentation:** See inline comments in HTML/CSS/JS

---

**Made with ❤️ for MikroTik HotSpot Administrators**

*Version 1.0.0 — 2025*
