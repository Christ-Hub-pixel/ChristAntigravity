// ============================================================
// CodeLingo — Auth Component (Login / Signup with Avatar Pick)
// ============================================================

const AVATARS = [
  '🧑‍💻','👨‍💻','👩‍💻','🧒','👦','👧',
  '🧑','👱','🧔','👴','👵','🧓',
  '🐱','🐶','🦊','🐸','🐼','🐨',
  '🦁','🐯','🐮','🐧','🦉','🦄',
  '🚀','⚡','🎯','🔥','💎','🌟',
];

let selectedAvatar = '🧑‍💻';

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
              <button
                class="avatar-pick-btn ${a === selectedAvatar ? 'selected' : ''}"
                onclick="pickAvatar('${a}')"
                title="${a}"
              >${a}</button>
            `).join('')}
          </div>
        </div>

        <form id="auth-form" onsubmit="handleAuthSubmit(event)">
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

function handleAuthSubmit(e) {
  e.preventDefault();
  const username = document.getElementById('auth-username').value.trim();

  const nameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!nameRegex.test(username)) {
    alert('Nom invalide — 3 à 20 caractères (lettres, chiffres, _).');
    return;
  }

  AppState.username = username;
  AppState.avatar   = selectedAvatar;
  AppState.isLoggedIn = true;
  saveState();

  document.getElementById('app-topbar').style.display = 'flex';
  document.getElementById('app-nav').style.display = 'flex';
  document.getElementById('app-main').style.paddingBottom = '';

  navigate('#home');
}

window.renderAuth       = renderAuth;
window.handleAuthSubmit = handleAuthSubmit;
window.pickAvatar       = pickAvatar;
window.AVATARS          = AVATARS;
