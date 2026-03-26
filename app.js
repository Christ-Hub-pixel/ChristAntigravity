// ============================================================
// CodeLingo — App State Manager & Router
// ============================================================

const DEFAULT_STATE = {
  isLoggedIn: false,
  username: 'CodeLearner',
  avatar: '🧑‍💻',
  password: '', // New: Store password for local sessions
  totalXP: 0,
  lessonsCompleted: 0,
  perfectLessons: 0,
  streakDays: 1,
  lastActiveDate: new Date().toDateString(),
  completedLessons: [],
  earnedBadges: [],
  currentCourse: null,
  joinDate: new Date().toISOString(),
  hearts: 5,
  maxHearts: 5,
  lastHeartRefill: Date.now(),
  gems: 500,
  dailyGoal: 'relaxed',
  dailyXP: 0,
  notifications: [],
  uiPrefs: {
    showAI: true,
    theme: 'dark',
    language: 'fr'
  },
  aiChatHistory: [], // New: Persist AI chat history
  _sig: '', // Integrity signature
};

// ── Security Utilities ──────────────────────────────────────
/**
 * Robust HTML escaping to prevent XSS.
 */
function escHtml(str) {
  if (typeof str !== 'string') return str;
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, m => map[m]);
}
window.escHtml = escHtml;

/**
 * Simple integrity check for state to prevent casual tampering.
 * Not cryptographically secure (it's frontend), but follows best practices for friction.
 */
const _SECRET = 'lingo_expert_2024_auth';
function calculateSignature(state) {
  const data = `${state.username}:${state.totalXP}:${state.streakDays}:${state.lessonsCompleted}:${state.hearts || 5}:${state.gems || 0}:${_SECRET}`;
  // Simple obfuscated hash function
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return btoa(hash.toString());
}

async function hashPassword(password) {
  if (!password) return '';
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
window.hashPassword = hashPassword;

// ── State ──────────────────────────────────────────────────
let AppState = {};

function loadState() {
  try {
    const saved = localStorage.getItem('codelingo_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Integrity check
      const currentSig = calculateSignature(parsed);
      if (parsed._sig !== currentSig) {
        console.warn('⚠️ State integrity check failed. Possible manual manipulation detected.');
        // If manipulated, we could reset or just warn. Let's reset for "Security Expert" feel.
        if (parsed.totalXP > 50000 || parsed.streakDays > 1000) { // Only reset if highly suspicious
           console.error('State reset due to suspicious values.');
           AppState = { ...DEFAULT_STATE };
           saveState();
           return;
        }
      }

      AppState = { ...DEFAULT_STATE, ...parsed };
      // Auto-login existing users who already made progress so they aren't locked out
      if (parsed.lessonsCompleted > 0 || parsed.streakDays > 1) {
         AppState.isLoggedIn = true;
      }
      
      // Ensure new properties exist for older saves
      if (AppState.hearts === undefined) AppState.hearts = 5;
      if (AppState.maxHearts === undefined) AppState.maxHearts = 5;
      if (AppState.gems === undefined) AppState.gems = 500;
      if (!AppState.uiPrefs) AppState.uiPrefs = { showAI: true, theme: 'dark', language: 'fr' };
      if (!AppState.lastHeartRefill) AppState.lastHeartRefill = Date.now();

      updateStreak();
      checkHearts();
    } else {
      AppState = { ...DEFAULT_STATE };
      saveState();
    }
  } catch (e) {
    AppState = { ...DEFAULT_STATE };
  }
}

function saveState() {
  try {
    AppState._sig = calculateSignature(AppState);
    localStorage.setItem('codelingo_state', JSON.stringify(AppState));
  } catch (e) {
    console.warn('Could not save state:', e);
  }
}

function updateStreak() {
  const today = new Date().toDateString();
  const last = AppState.lastActiveDate;
  if (last === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const tips = [
    "Astuce : Utilise le Playground pour tester tes propres idées !",
    "Conseil : Pratiquer 10 minutes par jour est mieux qu'une heure par semaine.",
    "Le saviez-vous ? Python a été nommé d'après les Monty Python.",
    "Astuce : Ton tuteur IA 🤖 peut t'expliquer n'importe quelle erreur de code.",
    "Objectif : Essaie de compléter une unité entière cette semaine !"
  ];
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  if (last === yesterday.toDateString()) {
    AppState.streakDays += 1;
    addNotification({
      title: 'Bon retour ! 🔥',
      message: `Série de ${AppState.streakDays} jours ! ${randomTip}`,
      icon: '⚡'
    });
  } else {
    AppState.streakDays = 1;
    addNotification({
      title: 'C\'est reparti ! 🚀',
      message: `Nouvelle série aujourd'hui ! ${randomTip}`,
      icon: '🎯'
    });
  }

  AppState.dailyXP = 0; // Reset daily progress
  AppState.lastActiveDate = today;
  saveState();
}

function checkHearts() {
  if (AppState.hearts < AppState.maxHearts) {
    const now = Date.now();
    const msPerHeart = 4 * 60 * 60 * 1000; // 4 hours per heart
    const elapsed = now - (AppState.lastHeartRefill || now);
    const heartsGained = Math.floor(elapsed / msPerHeart);
    
    if (heartsGained > 0) {
      AppState.hearts = Math.min(AppState.maxHearts, AppState.hearts + heartsGained);
      AppState.lastHeartRefill = now - (elapsed % msPerHeart);
      saveState();
    }
  } else {
    AppState.lastHeartRefill = Date.now();
  }
}

function addXP(amount) {
  const prevLevel = getLevel(AppState.totalXP).level;
  
  // Track daily progress
  const prevDailyXP = AppState.dailyXP || 0;
  AppState.dailyXP = prevDailyXP + amount;
  AppState.totalXP += amount;
  
  const newLevel = getLevel(AppState.totalXP).level;
  
  // Check Goal Completion
  const goals = { relaxed: 5, regular: 15, serious: 30, insane: 50 };
  const target = goals[AppState.dailyGoal] || 5;
  
  if (prevDailyXP < target && AppState.dailyXP >= target) {
    if (typeof addNotification === 'function') {
      addNotification({
        title: 'Objectif atteint ! 🎯',
        message: `Félicitations ! Tu as atteint ton objectif quotidien de ${target} XP. Continue comme ça !`,
        icon: '🏆'
      });
    }
  }

  saveState();
  return { leveledUp: newLevel > prevLevel, newLevel };
}

let lastLessonTime = 0;

function completeLesson(lessonId, xpReward, perfect) {
  const now = Date.now();
  // Anti-cheat: minimum 5 seconds per lesson
  if (now - lastLessonTime < 5000 && lastLessonTime !== 0) {
    console.warn('⚡ Slow down! Accuracy is better than speed.');
    return { leveledUp: false, newBadges: [] };
  }
  lastLessonTime = now;

  if (!AppState.completedLessons.includes(lessonId)) {
    AppState.completedLessons.push(lessonId);
    AppState.lessonsCompleted += 1;
    if (perfect) AppState.perfectLessons += 1;
  }
  const result = addXP(xpReward);

  // Check for new badges
  const newBadges = checkNewBadges(AppState);
  newBadges.forEach(b => AppState.earnedBadges.push(b.id));
  if (newBadges.length) saveState();

  return { ...result, newBadges };
}

window.AppState = AppState;
window.loadState = loadState;
window.saveState = saveState;
window.addXP = addXP;
window.completeLesson = completeLesson;

// ── Router ─────────────────────────────────────────────────
window.routes = {
  '#home':        () => renderHome(),
  '#courses':     () => renderCourses(),
  '#leaderboard': () => renderLeaderboard(),
  '#profile':     () => renderProfile(),
  '#auth':        () => renderAuth(),
  '#playground':  () => renderSandbox(),
  '#reference':   () => renderReference(),
  '#lesson':      () => renderLessonRoute(),
  '#about':       () => renderAbout(),
};

function navigate(hash) {
  window.location.hash = hash;
}

function handleRoute() {
  let hash = window.location.hash || '#home';
  
  // Allow about page without login
  if (!AppState.isLoggedIn && hash !== '#auth' && hash !== '#about') {
    navigate('#auth');
    return;
  }
  
  // Cleanup lesson UI if leaving lesson
  if (hash !== '#lesson' && typeof window.removeLessonFooter === 'function') {
    window.removeLessonFooter();
  }
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.route === hash);
  });

  const main = document.getElementById('app-main');
  main.classList.add('page-exit');
  
  setTimeout(() => {
    main.classList.remove('page-exit');
    
    const avatar = AppState.avatar || '🧑‍💻';
    main.innerHTML = `
      <div class="splash-loading splash-loading--mini">
        <div class="splash-logo">${avatar}</div>
        <div class="splash-text">Chargement...</div>
      </div>
    `;
    main.classList.add('page-enter');
    
    setTimeout(() => {
      main.classList.remove('page-enter');
      const render = window.routes[hash] || window.routes['#home'];
      render();
      main.classList.add('page-enter');
      setTimeout(() => main.classList.remove('page-enter'), 300);
    }, 350);
  }, 150);
}

// ── Guest / Demo Mode ──────────────────────────────────────
function loginAsGuest() {
  AppState.isLoggedIn = true;
  AppState.username   = 'Invité';
  AppState.avatar     = '👻';
  AppState.isGuest    = true; // flag for UI
  saveState();
  translateStaticUI();
  document.getElementById('app-topbar').style.display = 'flex';
  document.getElementById('app-nav').style.display    = 'flex';
  document.getElementById('app-main').style.paddingBottom = '';
  navigate('#home');
}
window.loginAsGuest = loginAsGuest;

// ── Auto-Logout After 30 min Inactivity ───────────────────
let _inactivityTimer;
function resetInactivityTimer() {
  clearTimeout(_inactivityTimer);
  _inactivityTimer = setTimeout(() => {
    if (AppState.isLoggedIn) {
      addNotification({ icon: '⏰', title: 'Session expirée', message: 'Tu as été déconnecté après 30 minutes d\'inactivité.' });
      logoutUser && logoutUser(); // only if auth.js loaded
    }
  }, 30 * 60 * 1000); // 30 minutes
}
['click','keydown','touchstart','mousemove'].forEach(ev =>
  document.addEventListener(ev, resetInactivityTimer, { passive: true })
);
resetInactivityTimer();

window.navigate = navigate;
window.handleRoute = handleRoute;
window.DEFAULT_STATE = DEFAULT_STATE;

// ── Theme System ───────────────────────────────────────────
const THEMES = [
  { id: 'light', icon: '☀️',  label: 'Light' },
  { id: 'dark',  icon: '🌙', label: 'Dark'  },
  { id: 'auto',  icon: '⚙️',  label: 'Auto'  },
];

let currentThemeIdx = 0;

function loadTheme() {
  const saved = localStorage.getItem('codelingo_theme') || 'light';
  const idx = THEMES.findIndex(t => t.id === saved);
  currentThemeIdx = idx >= 0 ? idx : 0;
  applyTheme(false);
}

function applyTheme(animate = true) {
  const theme = THEMES[currentThemeIdx];
  document.documentElement.setAttribute('data-theme', theme.id);
  localStorage.setItem('codelingo_theme', theme.id);

  const icon = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');
  if (icon) {
    if (animate) {
      icon.style.transform = 'scale(0) rotate(-180deg)';
      setTimeout(() => {
        icon.textContent = theme.icon;
        icon.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
        icon.style.transform = 'scale(1) rotate(0deg)';
      }, 150);
    } else {
      icon.textContent = theme.icon;
    }
  }
  if (label) label.textContent = theme.label;
}

function translateStaticUI() {
  const lang = window.LANGUAGES.find(l => l.id === currentLang);
  const flag = document.getElementById('lang-flag');
  const short = document.getElementById('lang-short');
  if (flag && lang) flag.textContent = lang.flag;
  if (short && lang) short.textContent = lang.short;

  const m = id => { const el = document.getElementById(id); if (el) el.textContent = t(id.replace('nav-lbl-', 'nav_')); };
  m('nav-lbl-home'); m('nav-lbl-courses'); m('nav-lbl-rank'); m('nav-lbl-profile');
}

function cycleLang() {
  const idx = window.LANGUAGES.findIndex(l => l.id === currentLang);
  const next = window.LANGUAGES[(idx + 1) % window.LANGUAGES.length];
  setLang(next.id);
  
  // Dynamic UI Update instead of location.reload()
  translateStaticUI();
  
  // Re-run current route renderer if possible
  const hash = window.location.hash || '#home';
  if (hash !== '#lesson') { // Don't interrupt lessons
    const render = window.routes[hash] || window.routes['#home'];
    if (typeof render === 'function') render();
  }
}

window.cycleLang = cycleLang;
window.translateStaticUI = translateStaticUI;

function cycleTheme() {
  currentThemeIdx = (currentThemeIdx + 1) % THEMES.length;
  applyTheme(true);
}

function setThemeFromProfile(themeId) {
  const idx = THEMES.findIndex(t => t.id === themeId);
  if (idx < 0) return;
  currentThemeIdx = idx;
  applyTheme(true);

  // Highlight active button in the profile picker
  document.querySelectorAll('.theme-pick-btn').forEach(btn => {
    const isActive = btn.dataset.themeId === themeId;
    btn.style.borderColor = isActive ? 'var(--accent-purple)' : 'var(--border)';
    btn.style.background = isActive ? 'rgba(124,58,237,0.12)' : 'var(--bg-card)';
  });
}

window.setThemeFromProfile = setThemeFromProfile;

window.cycleTheme = cycleTheme;

// ── UI Utilities ──────────────────────────────────────────
function showModal({ icon = '⚠️', title = 'Attention', message = '...', confirmText = 'OK', cancelText = 'Annuler', onConfirm = null }) {
  const overlay = document.getElementById('modal-overlay');
  const iconEl = document.getElementById('modal-icon');
  const titleEl = document.getElementById('modal-title');
  const msgEl = document.getElementById('modal-message');
  const confirmBtn = document.getElementById('modal-confirm-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');

  if (!overlay) return;

  iconEl.textContent = icon;
  titleEl.textContent = title;
  msgEl.textContent = message;
  confirmBtn.textContent = confirmText;
  cancelBtn.textContent = cancelText;

  cancelBtn.style.display = onConfirm ? 'block' : 'none';

  overlay.classList.add('active');

  const close = () => overlay.classList.remove('active');

  confirmBtn.onclick = () => { close(); if (onConfirm) onConfirm(); };
  cancelBtn.onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };
}

function updateOnlineStatus() {
  const banner = document.getElementById('offline-banner');
  if (!banner) return;
  if (navigator.onLine) {
    banner.classList.remove('active');
  } else {
    banner.classList.add('active');
  }
}

window.showModal = showModal;

// ── Notifications ──────────────────────────────────────────
function toggleNotifications() {
  const dropdown = document.getElementById('notification-dropdown');
  const badge = document.getElementById('notification-badge');
  
  if (dropdown.classList.contains('hidden')) {
    dropdown.classList.remove('hidden');
    badge.classList.add('hidden'); // Clear badge on open
    renderNotifList();
    
    // Auto-close on outside click
    const closeOnOutside = (e) => {
      if (!e.target.closest('.notification-bell-wrapper')) {
        dropdown.classList.add('hidden');
        document.removeEventListener('click', closeOnOutside);
      }
    };
    setTimeout(() => document.addEventListener('click', closeOnOutside), 10);
  } else {
    dropdown.classList.add('hidden');
  }
}

function addNotification(notif) {
  // notif: { id, title, message, icon, time, unread: true }
  const state = AppState;
  state.notifications = state.notifications || [];
  
  // Prevent duplicate notifications for same ID (if any)
  if (notif.id && state.notifications.some(n => n.id === notif.id)) return;

  state.notifications.unshift({
    id: Date.now(),
    time: 'À l\'instant',
    unread: true,
    ...notif
  });
  if (state.notifications.length > 10) state.notifications.pop();
  
  saveState();
  updateNotifBadge();
}

function updateNotifBadge() {
  const badge = document.getElementById('notification-badge');
  if (!badge) return;
  const unreadCount = (AppState.notifications || []).filter(n => n.unread).length;
  if (unreadCount > 0) {
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function renderNotifList() {
  const list = document.getElementById('notif-list');
  if (!list) return;
  const notifs = AppState.notifications || [];
  
  if (notifs.length === 0) {
    list.innerHTML = `<div class="notif-empty">Aucune nouvelle notification</div>`;
    return;
  }
  
  list.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="markNotifRead(${n.id})">
      <div class="notif-icon">${n.icon || '📢'}</div>
      <div class="notif-content">
        <div class="notif-title">${n.title}</div>
        <div class="notif-message">${n.message}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>
  `).join('');
}

function markNotifRead(id) {
  const notif = AppState.notifications.find(n => n.id === id);
  if (notif) notif.unread = false;
  saveState();
  renderNotifList();
  updateNotifBadge();
}

window.toggleNotifications = toggleNotifications;
window.addNotification = addNotification;
window.markNotifRead = markNotifRead;
window.updateNotifBadge = updateNotifBadge;

// ── PWA Installation ──────────────────────────────────────
let deferredPrompt;
const installBtn = document.getElementById('install-app-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI signify the PWA can be installed
  if (installBtn) installBtn.classList.remove('hidden');
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Deploiement de l'app: ${outcome}`);
    if (outcome === 'accepted') {
      showModal({
        icon: '📲',
        title: 'Application installée',
        message: 'CodeLingo a été ajouté à votre écran d\'accueil !'
      });
      installBtn.classList.add('hidden');
    }
    deferredPrompt = null;
  });
}

window.addEventListener('appinstalled', (evt) => {
  console.log('CodeLingo a été installé sur l\'appareil');
  if (installBtn) installBtn.classList.add('hidden');
});

// ── Bootstrap ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadLang();
  translateStaticUI();
  loadTheme();
  loadState();

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
  setupNav();
});

function setupNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.route));
  });
}
