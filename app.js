// ============================================================
// CodeLingo — App State Manager & Router
// ============================================================

const DEFAULT_STATE = {
  username: 'CodeLearner',
  avatar: '🧑‍💻',
  isLoggedIn: false,
  totalXP: 0,
  lessonsCompleted: 0,
  perfectLessons: 0,
  streakDays: 1,
  lastActiveDate: new Date().toDateString(),
  completedLessons: [],
  earnedBadges: [],
  currentCourse: null,
  joinDate: new Date().toISOString(),
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
  const data = `${state.username}:${state.totalXP}:${state.streakDays}:${state.lessonsCompleted}:${_SECRET}`;
  // Simple obfuscated hash function
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return btoa(hash.toString());
}

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
      updateStreak();
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

  if (last === yesterday.toDateString()) {
    AppState.streakDays += 1;
  } else {
    AppState.streakDays = 1;
  }
  AppState.lastActiveDate = today;
  saveState();
}

function addXP(amount) {
  const prevLevel = getLevel(AppState.totalXP).level;
  AppState.totalXP += amount;
  const newLevel = getLevel(AppState.totalXP).level;
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
const routes = {
  '#home':        () => renderHome(),
  '#courses':     () => renderCourses(),
  '#leaderboard': () => renderLeaderboard(),
  '#profile':     () => renderProfile(),
  '#auth':        () => renderAuth(),
};

function navigate(hash) {
  window.location.hash = hash;
}

function handleRoute() {
  let hash = window.location.hash || '#home';
  
  // Auth Guard
  if (!AppState.isLoggedIn && hash !== '#auth') {
    navigate('#auth');
    return;
  }
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.route === hash);
  });

  const main = document.getElementById('app-main');
  main.classList.add('page-exit');
  setTimeout(() => {
    main.classList.remove('page-exit');
    const render = routes[hash] || routes['#home'];
    render();
    main.classList.add('page-enter');
    setTimeout(() => main.classList.remove('page-enter'), 400);
  }, 150);
}

window.navigate = navigate;
window.handleRoute = handleRoute;

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
  location.reload(); // Quickest way to re-render all JS components with new language
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

// ── Bootstrap ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadLang();
  translateStaticUI();
  loadTheme();
  loadState();
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
  setupNav();
});

function setupNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.route));
  });
}
