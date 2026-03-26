// ============================================================
// CodeLingo — Auth Component (2 steps: Avatar/Name → Language)
// ============================================================

const AVATARS = [
  '🧑‍💻','👨‍💻','👩‍💻','🧒','👦','👧',
  '🧑','👱','🧔','👴','👵','🧓',
  '🐱','🐶','🦊','🐸','🐼','🐨',
  '🦁','🐯','🐮','🐧','🦉','🦄',
  '🚀','⚡','🎯','🔥','💎','🌟',
];

let selectedAvatar = '🧑‍💻';

// ── Step 1: Avatar + Username ──────────────────────────────
function renderAuth() {
  document.getElementById('app-topbar').style.display = 'none';
  document.getElementById('app-nav').style.display = 'none';
  document.getElementById('app-main').style.paddingBottom = '0';

  document.getElementById('app-main').innerHTML = `
    <div class="auth-wrapper">
      <img src="assets/logo.png" alt="CodeLingo" class="auth-logo">

      <div class="card auth-card">
        <h2 class="auth-title">${t('auth_login_title')}</h2>

        <!-- Avatar Picker -->
        <div class="auth-avatar-section">
          <div class="auth-avatar-preview" id="auth-avatar-preview">${selectedAvatar}</div>
          <div class="auth-avatar-grid" id="auth-avatar-grid">
            ${AVATARS.map(a => `
              <button class="avatar-pick-btn ${a === selectedAvatar ? 'selected' : ''}" onclick="pickAvatar('${a}')">${a}</button>
            `).join('')}
          </div>
        </div>

        <form id="auth-form" onsubmit="handleAuthStep1(event)">
          <div class="auth-field">
            <label class="auth-label">${t('auth_username')}</label>
            <input type="text" id="auth-username" class="fill-input" required
              placeholder="CodeLearner" maxlength="20" autocomplete="username">
          </div>
          <div class="auth-field">
            <label class="auth-label">${t('auth_password')}</label>
            <input type="password" id="auth-password" class="fill-input" required
              placeholder="••••••••" autocomplete="current-password">
          </div>
          <button type="submit" class="btn btn-primary btn-full btn-lg" style="margin-top:8px;">
            ${t('auth_btn')} →
          </button>
        </form>
        <div class="auth-divider"><span>ou</span></div>
        <button class="btn btn-secondary btn-full" onclick="loginAsGuest()">
          👻 Mode Invité (sans compte)
        </button>
        <button class="btn btn-ghost btn-sm auth-about-link" onclick="navigate('#about')">
          ℹ️ À propos de CodeLingo
        </button>
      </div>
    </div>
  `;
}

function pickAvatar(avatar) {
  selectedAvatar = avatar;
  const preview = document.getElementById('auth-avatar-preview');
  if (preview) {
    preview.textContent = avatar;
    preview.style.transform = 'scale(1.3)';
    setTimeout(() => { preview.style.transform = 'scale(1)'; }, 200);
  }
  document.querySelectorAll('.avatar-pick-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.textContent.trim() === avatar);
  });
}

async function handleAuthStep1(e) {
  e.preventDefault();
  const username = document.getElementById('auth-username').value.trim();
  const password = document.getElementById('auth-password').value.trim();
  const nameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!nameRegex.test(username)) {
    showModal({ icon: '👤', title: 'Nom invalide', message: '3 à 20 caractères (lettres, chiffres, _).' });
    return;
  }
  if (password.length < 6) {
    showModal({ icon: '🔑', title: 'Mot de passe', message: '6 caractères minimum pour votre sécurité.' });
    return;
  }
  // Hash the password before saving
  const hashedPassword = await hashPassword(password);
  
  // Save temporarily (not logged in yet)
  AppState.username = username;
  AppState.avatar   = selectedAvatar;
  AppState.password = hashedPassword; 
  
  // Go to step 2 — language selection
  renderLangPicker();
}

// ── Step 2: Language Picker (Duolingo-style) ───────────────
const LANG_DATA = [
  { id: 'fr', flag: '🇫🇷', label: 'Français',    sub: 'Interface en français' },
  { id: 'en', flag: '🇬🇧', label: 'English',     sub: 'Interface in English' },
  { id: 'es', flag: '🇪🇸', label: 'Español',     sub: 'Interfaz en español' },
  { id: 'de', flag: '🇩🇪', label: 'Deutsch',     sub: 'Benutzeroberfläche auf Deutsch' },
  { id: 'pt', flag: '🇵🇹', label: 'Português',   sub: 'Interface em português' },
];

function renderLangPicker() {
  document.getElementById('app-main').innerHTML = `
    <div class="auth-wrapper">
      <div class="lang-pick-header">
        <div class="lang-pick-title">🌐 Choisis ta langue</div>
        <div class="lang-pick-sub">La langue de l'interface seulement — les leçons restent en anglais</div>
      </div>

      <div class="lang-pick-grid">
        ${LANG_DATA.map(lang => `
          <button
            class="lang-card ${currentLang === lang.id ? 'selected' : ''}"
            onclick="selectAuthLang('${lang.id}')"
            id="lang-card-${lang.id}"
          >
            <span class="lang-card-flag">${lang.flag}</span>
            <div class="lang-card-info">
              <div class="lang-card-name">${lang.label}</div>
              <div class="lang-card-sub">${lang.sub}</div>
            </div>
            <div class="lang-card-check ${currentLang === lang.id ? 'visible' : ''}">✓</div>
          </button>
        `).join('')}
      </div>

      <button class="btn btn-primary btn-lg" style="margin-top:24px;min-width:280px;" onclick="finishAuth()">
        Commencer →
      </button>
      <button class="btn btn-secondary btn-sm" style="margin-top:10px;" onclick="renderAuth()">
        ← Retour
      </button>
    </div>
  `;
}

function selectAuthLang(langId) {
  setLang(langId);
  document.querySelectorAll('.lang-card').forEach(card => {
    card.classList.remove('selected');
    const check = card.querySelector('.lang-card-check');
    if (check) check.classList.remove('visible');
  });
  const selected = document.getElementById(`lang-card-${langId}`);
  if (selected) {
    selected.classList.add('selected');
    const check = selected.querySelector('.lang-card-check');
    if (check) check.classList.add('visible');
    selected.style.transform = 'scale(0.97)';
    setTimeout(() => { selected.style.transform = ''; }, 150);
  }
}

function finishAuth() {
  AppState.isLoggedIn = true;
  saveState();
  translateStaticUI();

  document.getElementById('app-topbar').style.display = 'flex';
  document.getElementById('app-nav').style.display = 'flex';
  document.getElementById('app-main').style.paddingBottom = '';

  navigate('#home');
}

// ── Language Picker Modal (accessible from anywhere) ──────
function openLangModal() {
  let modal = document.getElementById('lang-modal');
  if (modal) { modal.remove(); return; }

  modal = document.createElement('div');
  modal.id = 'lang-modal';
  modal.className = 'lang-modal-overlay';
  modal.onclick = (e) => { if (e.target === modal) closeLangModal(); };
  modal.innerHTML = `
    <div class="lang-modal-box">
      <div class="lang-modal-header">
        <span>🌐 Langue de l'interface</span>
        <button onclick="closeLangModal()" class="lang-modal-close">✕</button>
      </div>
      <div class="lang-modal-note">
        ℹ️ Ceci change seulement l'interface — les questions restent dans leur langue d'origine.
      </div>
      <div class="lang-modal-list">
        ${LANG_DATA.map(lang => `
          <button class="lang-modal-row ${currentLang === lang.id ? 'active' : ''}" onclick="changeLangLive('${lang.id}')">
            <span class="lang-modal-flag">${lang.flag}</span>
            <span class="lang-modal-label">${lang.label}</span>
            ${currentLang === lang.id ? '<span class="lang-modal-tick">✓</span>' : ''}
          </button>
        `).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('open'));
}

function closeLangModal() {
  const modal = document.getElementById('lang-modal');
  if (!modal) return;
  modal.classList.remove('open');
  setTimeout(() => modal.remove(), 250);
}

function changeLangLive(langId) {
  setLang(langId);
  translateStaticUI();
  closeLangModal();
  // Re-render current page to update UI strings (NOT lesson content)
  const hash = window.location.hash || '#home';
  if (hash === '#lesson') return; // Don't interrupt mid-lesson!
  const render = window.routes?.[hash] || window.renderHome;
  if (typeof render === 'function') {
    const main = document.getElementById('app-main');
    main.classList.add('page-exit');
    setTimeout(() => { main.classList.remove('page-exit'); render(); }, 120);
  }
}

// Backwards compat for old cycleLang button
function cycleLang() { openLangModal(); }

// ── Profile Dropdown Menu ──────────────────────────────────
function toggleProfileMenu() {
  const menu = document.getElementById('profile-menu');
  if (!menu) { navigate('#profile'); return; }

  // Sync avatar/name into menu header
  const avatarEl = document.getElementById('profile-menu-avatar');
  const nameEl   = document.getElementById('profile-menu-name');
  if (avatarEl) avatarEl.textContent = AppState.avatar || '👤';
  if (nameEl)   nameEl.textContent   = AppState.username || 'Utilisateur';

  // Also update the nav icon
  const navIcon = document.getElementById('nav-profile-avatar');
  if (navIcon) navIcon.textContent = AppState.avatar || '👤';

  const isOpen = menu.classList.contains('open');
  if (isOpen) {
    closeProfileMenu();
  } else {
    menu.classList.add('open');
    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', closeProfileMenuOutside, { once: true });
    }, 0);
  }
}

function closeProfileMenu() {
  const menu = document.getElementById('profile-menu');
  if (menu) menu.classList.remove('open');
}

function closeProfileMenuOutside(e) {
  const wrapper = document.getElementById('nav-profile');
  if (wrapper && !wrapper.contains(e.target)) closeProfileMenu();
}

// ── Logout ────────────────────────────────────────────────
function logoutUser() {
  showModal({
    icon: '🚪',
    title: 'Déconnexion',
    message: 'Es-tu sûr de vouloir te déconnecter ?',
    confirmText: 'Déconnexion',
    cancelText: 'Annuler',
    onConfirm: () => {
      // Keep language & theme preferences
      const lang  = AppState.lang;
      const theme = AppState.theme;
      // Reset to fresh state
      const fresh = {
        isLoggedIn: false, username: '', avatar: '🧑‍💻', password: '',
        totalXP: 0, streakDays: 0, lastActiveDate: '', completedLessons: [],
        hearts: 5, maxHearts: 5, gems: 500, currentCourse: 'python',
        notifications: [], dailyGoal: 20, dailyXP: 0,
        lang, theme,
      };
      Object.assign(AppState, fresh);
      saveState();

      closeProfileMenu();
      document.getElementById('app-topbar').style.display = 'none';
      document.getElementById('app-nav').style.display = 'none';
      renderAuth();
    }
  });
}

window.renderAuth            = renderAuth;
window.handleAuthStep1       = handleAuthStep1;
window.pickAvatar            = pickAvatar;
window.renderLangPicker      = renderLangPicker;
window.selectAuthLang        = selectAuthLang;
window.finishAuth            = finishAuth;
window.openLangModal         = openLangModal;
window.closeLangModal        = closeLangModal;
window.changeLangLive        = changeLangLive;
window.cycleLang             = cycleLang;
window.AVATARS               = AVATARS;
window.logoutUser            = logoutUser;
window.toggleProfileMenu     = toggleProfileMenu;
window.closeProfileMenu      = closeProfileMenu;
