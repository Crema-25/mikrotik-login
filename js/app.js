/* ============================================
   ZANOON - APP.JS
   Login Portal Core Functionality
   ============================================ */

(function() {
  'use strict';

  // APP CONFIGURATION
  const APP = {
    theme: localStorage.getItem('zanoon-theme') || 'dark',
    locale: 'fr',
    debug: false,
  };

  // ============================================
  // THEME MANAGEMENT
  // ============================================

  function initTheme() {
    const html = document.documentElement;
    
    // Restore saved theme or use system preference
    let savedTheme = localStorage.getItem('zanoon-theme');
    
    if (!savedTheme) {
      // Check system preference
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      savedTheme = prefersLight ? 'light' : 'dark';
    }
    
    applyTheme(savedTheme);
    setupThemeToggle();
  }

  function applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
      APP.theme = 'light';
      updateThemeToggleButton();
    } else {
      html.removeAttribute('data-theme');
      APP.theme = 'dark';
      updateThemeToggleButton();
    }
    
    localStorage.setItem('zanoon-theme', theme);
  }

  function setupThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const newTheme = APP.theme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    }
  }

  function updateThemeToggleButton() {
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.textContent = APP.theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // ============================================
  // PASSWORD VISIBILITY TOGGLE
  // ============================================

  function setupPasswordToggle() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach((input) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'password-field-wrapper';
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
      
      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'btn-icon-toggle';
      toggleBtn.setAttribute('aria-label', 'Afficher/Masquer le mot de passe');
      toggleBtn.innerHTML = getEyeIcon();
      
      wrapper.appendChild(toggleBtn);
      
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        toggleBtn.innerHTML = isPassword ? getEyeSlashIcon() : getEyeIcon();
      });
    });
  }

  function getEyeIcon() {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`;
  }

  function getEyeSlashIcon() {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>`;
  }

  // ============================================
  // FORM HANDLING
  // ============================================

  function setupFormHandling() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      // Handle form submission via MikroTik
      loginForm.addEventListener('submit', (e) => {
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.classList.add('btn-loading');
          submitBtn.disabled = true;
          
          const spinner = document.createElement('span');
          spinner.className = 'spinner';
          spinner.style.marginRight = '8px';
          
          const originalContent = submitBtn.innerHTML;
          submitBtn.innerHTML = '';
          submitBtn.appendChild(spinner);
          submitBtn.appendChild(document.createTextNode('Connexion...'));
        }
      });
      
      // Prevent form submission if validation fails
      const usernameInput = loginForm.querySelector('input[name*="username"], input[name*="user"], input[name="login"]');
      const passwordInput = loginForm.querySelector('input[type="password"]');
      
      if (usernameInput && passwordInput) {
        loginForm.addEventListener('submit', (e) => {
          if (!usernameInput.value.trim() || !passwordInput.value.trim()) {
            e.preventDefault();
            showErrorAlert('Veuillez remplir tous les champs');
          }
        });
      }
    }
  }

  // ============================================
  // ERROR HANDLING
  // ============================================

  function showErrorAlert(message) {
    removeExistingAlerts();
    const container = document.querySelector('.container') || document.body;
    
    const alert = document.createElement('div');
    alert.className = 'alert alert-error fade-in';
    alert.setAttribute('role', 'alert');
    alert.innerHTML = `
      <div class="alert-icon">⚠️</div>
      <div class="alert-content">
        <div class="alert-title">Erreur</div>
        <p class="alert-message">${escapeHtml(message)}</p>
      </div>
    `;
    
    const firstChild = container.firstChild;
    if (firstChild) {
      container.insertBefore(alert, firstChild);
    } else {
      container.appendChild(alert);
    }
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
      alert.style.animation = 'fadeOut 300ms ease-out forwards';
      setTimeout(() => alert.remove(), 300);
    }, 8000);
  }

  function showSuccessAlert(message) {
    removeExistingAlerts();
    const container = document.querySelector('.container') || document.body;
    
    const alert = document.createElement('div');
    alert.className = 'alert alert-success fade-in';
    alert.setAttribute('role', 'alert');
    alert.innerHTML = `
      <div class="alert-icon">✓</div>
      <div class="alert-content">
        <div class="alert-title">Succès</div>
        <p class="alert-message">${escapeHtml(message)}</p>
      </div>
    `;
    
    container.insertBefore(alert, container.firstChild);
    
    setTimeout(() => {
      alert.style.animation = 'fadeOut 300ms ease-out forwards';
      setTimeout(() => alert.remove(), 300);
    }, 6000);
  }

  function removeExistingAlerts() {
    document.querySelectorAll('.alert').forEach((alert) => {
      alert.remove();
    });
  }

  // ============================================
  // UTILITIES
  // ============================================

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function log(message, data = null) {
    if (APP.debug) {
      console.log(`[ZANOON] ${message}`, data || '');
    }
  }

  // ============================================
  // STATUS PAGE HANDLING
  // ============================================

  function initStatusPage() {
    // Auto-refresh session info if available
    const statusContainer = document.getElementById('sessionStatus');
    if (statusContainer) {
      // Update any dynamic status information
      updateSessionDisplay();
    }
  }

  function updateSessionDisplay() {
    const statusContainer = document.getElementById('sessionStatus');
    if (!statusContainer) return;
    
    // Get any available status parameters from page (MikroTik variables)
    const username = document.querySelector('[data-username]')?.getAttribute('data-username') || '';
    const ip = document.querySelector('[data-ip]')?.getAttribute('data-ip') || '';
    const bytesIn = document.querySelector('[data-bytes-in]')?.getAttribute('data-bytes-in') || '';
    const bytesOut = document.querySelector('[data-bytes-out]')?.getAttribute('data-bytes-out') || '';
    
    log('Status display updated', { username, ip, bytesIn, bytesOut });
  }

  // ============================================
  // LOGOUT HANDLING
  // ============================================

  function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        if (!confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
          e.preventDefault();
        }
      });
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function init() {
    log('Initializing Zanoon portal...');
    
    // Initialize theme
    initTheme();
    
    // Setup interactive elements
    setupPasswordToggle();
    setupFormHandling();
    setupLogoutButton();
    
    // Check if this is status page
    initStatusPage();
    
    // Handle any MikroTik error messages
    handleMikrotikErrors();
    
    log('Zanoon portal initialized');
  }

  function handleMikrotikErrors() {
    // Check for error parameter in URL or page
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error') || urlParams.get('err');
    
    if (error) {
      const errorMessage = decodeURIComponent(error);
      showErrorAlert(`Erreur de connexion: ${errorMessage}`);
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose error handlers for inline scripts
  window.ZanoonApp = {
    showError: showErrorAlert,
    showSuccess: showSuccessAlert,
    log: log,
    APP: APP,
  };

})();
