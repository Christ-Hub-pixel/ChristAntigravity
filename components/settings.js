/**
 * CodeLingo — Quick Settings Component
 * 
 * Centralizes secondary UI controls (Theme, AI visibility, Language)
 * to keep the main interface clean and professional.
 */

function renderQuickSettings() {
  const container = document.getElementById('settings-panel-container');
  if (!container) return;

  const { showAI, theme, language } = AppState.uiPrefs;

  container.innerHTML = `
    <div class="settings-panel-content">
      <div class="settings-header">
        <h3>${t('settings_title') || 'Paramètres Rapides'}</h3>
        <button class="settings-close" onclick="toggleSettings()">✕</button>
      </div>

      <div class="settings-body">
        <!-- AI Toggle -->
        <div class="settings-item">
          <div class="settings-info">
            <span class="settings-icon">🤖</span>
            <div>
              <div class="settings-label">Aide Lingo AI</div>
              <div class="settings-desc">Afficher le tuteur flottant</div>
            </div>
          </div>
          <label class="switch">
            <input type="checkbox" ${showAI ? 'checked' : ''} onchange="updateUIPref('showAI', this.checked)">
            <span class="slider round"></span>
          </label>
        </div>

        <!-- Theme Toggle -->
        <div class="settings-item">
          <div class="settings-info">
            <span class="settings-icon">${theme === 'dark' ? '🌙' : '☀️'}</span>
            <div>
              <div class="settings-label">Mode Sombre</div>
              <div class="settings-desc">Changer l'apparence</div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="toggleThemeArchitecture()">
            ${theme === 'dark' ? 'Activer Clair' : 'Activer Sombre'}
          </button>
        </div>

        <!-- Language Selector -->
        <div class="settings-item">
          <div class="settings-info">
            <span class="settings-icon">🌐</span>
            <div>
              <div class="settings-label">Langue</div>
              <div class="settings-desc">Français (Natif)</div>
            </div>
          </div>
          <div class="lang-pill active">FR</div>
        </div>
      </div>

      <div class="settings-footer">
        CodeLingo v1.1.2 — Architecture Smart
      </div>
    </div>
  `;
}

function toggleSettings() {
  const panel = document.getElementById('settings-panel-container');
  if (!panel) return;
  const isHidden = panel.style.display === 'none' || !panel.style.display;
  panel.style.display = isHidden ? 'flex' : 'none';
  if (isHidden) renderQuickSettings();
}

function updateUIPref(key, value) {
  AppState.uiPrefs[key] = value;
  saveState();
  applyUIArchitecture();
}

function toggleThemeArchitecture() {
  const newTheme = AppState.uiPrefs.theme === 'dark' ? 'light' : 'dark';
  AppState.uiPrefs.theme = newTheme;
  saveState();
  applyUIArchitecture();
  renderQuickSettings();
}

/**
 * Applies the architectural UI changes based on preferences.
 */
function applyUIArchitecture() {
  const { showAI, theme } = AppState.uiPrefs;

  // AI Visibility
  const aiFab = document.querySelector('.ai-fab');
  if (aiFab) {
    aiFab.style.display = showAI ? 'flex' : 'none';
  }

  // Theme
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'light') {
    document.body.classList.add('light-mode'); // Support legacy light-mode class if any
  } else {
    document.body.classList.remove('light-mode');
  }
}

// Initial application
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(applyUIArchitecture, 100);
});

window.toggleSettings = toggleSettings;
window.updateUIPref = updateUIPref;
window.toggleThemeArchitecture = toggleThemeArchitecture;
