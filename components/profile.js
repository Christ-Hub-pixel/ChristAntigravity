// ============================================================
// CodeLingo — Profile Component
// ============================================================

function renderProfile() {
  const state = AppState;
  const level = getLevel(state.totalXP);
  const xpProgress = getXPProgress(state.totalXP);
  const nextLevel = LEVELS.find(l => l.level === level.level + 1);
  const joinDate = new Date(state.joinDate);
  const daysActive = Math.floor((Date.now() - joinDate.getTime()) / 86400000) + 1;

  // Build streak calendar (last 28 days)
  const calDays = [];
  const today = new Date();
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const isToday = i === 0;
    const isActive = i < state.streakDays;
    calDays.push({ day: d.getDate(), isToday, isActive });
  }

  // Count per-language lessons
  const pyDone = state.completedLessons.filter(id => id.startsWith('py-')).length;
  const jsDone = state.completedLessons.filter(id => id.startsWith('js-')).length;
  const pyTotal = COURSES.python.units.reduce((a, u) => a + u.lessons.length, 0);
  const jsTotal = COURSES.javascript.units.reduce((a, u) => a + u.lessons.length, 0);

  document.getElementById('app-main').innerHTML = `
    <div class="profile-v2-container">
      <!-- Profile Hero v2 -->
      <div class="profile-v2-hero">
        <div class="avatar-ring-container" onclick="toggleAvatarPicker()">
          <div class="level-ring" style="--p: ${xpProgress}%"></div>
          <div class="avatar-v2-display" id="profile-avatar-display">${state.avatar}</div>
          <div style="position:absolute;bottom:0px;right:0px;background:var(--accent-blue);border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:1rem;border:3.5px solid white;z-index:10;box-shadow:0 3px 6px rgba(0,0,0,0.2);">✏️</div>
        </div>
        <div class="profile-v2-name">${escHtml(state.username)}</div>
        <div class="profile-v2-meta">
          ${t('level_prefix')} ${level.level} — ${escHtml(level.name)}
        </div>
        
        <div style="margin-top:20px;max-width:320px;margin-left:auto;margin-right:auto;">
          <div style="display:flex;justify-content:space-between;font-size:0.75rem;font-weight:900;margin-bottom:6px;">
            <span>${state.totalXP} XP</span>
            <span>${nextLevel ? `${nextLevel.minXP - state.totalXP} ${t('xp_to_next')}` : t('max_level')}</span>
          </div>
          <div class="progress-bar-track" style="height:10px;background:rgba(0,0,0,0.2);border:none;">
            <div class="progress-bar-fill" id="profile-xp-bar" style="width:0%;background:var(--accent-yellow);box-shadow:0 0 10px rgba(255,214,0,0.4);"></div>
          </div>
        </div>
      </div>

      <!-- Avatar Picker Panel (glassy) -->
      <div id="avatar-picker-panel" class="profile-glass-card mb-20" style="display:none;margin: -10px 15px 20px;">
        <div class="avatar-picker-header" style="font-weight:900;margin-bottom:12px;text-align:center;">Choisis ton avatar</div>
        <div class="auth-avatar-grid">
          ${(window.AVATARS || ['🧑‍💻','👨‍💻','👩‍💻','🐱','🐶','🦊','🐸','🐼','🦁','🐯','🚀','⚡','🎯','🔥','💎','🌟']).map(a => `
            <button class="avatar-pick-btn ${a === state.avatar ? 'selected' : ''}" onclick="changeAvatar('${a}')">${a}</button>
          `).join('')}
        </div>
      </div>

      <!-- Stats Grid v2 -->
      <div class="stats-v2-grid">
        <div class="stat-v2-card">
          <span class="stat-v2-icon">🔥</span>
          <span class="stat-v2-val">${state.streakDays}</span>
          <span class="stat-v2-lbl">${t('pr_streak')}</span>
        </div>
        <div class="stat-v2-card">
          <span class="stat-v2-icon">🏅</span>
          <span class="stat-v2-val">${state.earnedBadges.length}</span>
          <span class="stat-v2-lbl">${t('pr_badges')}</span>
        </div>
        <div class="stat-v2-card">
          <span class="stat-v2-icon">💎</span>
          <span class="stat-v2-val">${state.perfectLessons}</span>
          <span class="stat-v2-lbl">${t('pr_perfect')}</span>
        </div>
      </div>

      <!-- Language Progress v2 -->
      <div class="section-header" style="padding: 0 15px;"><span class="section-title">${t('pr_lang_progress')}</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;padding:0 15px;margin-bottom:30px;">
        ${Object.values(COURSES).map(course => {
          const prefixMap = { 'python': 'py-', 'javascript': 'js-', 'sql': 'sql-', 'html_css': 'hc-' };
          const prefix = prefixMap[course.id] || course.id.substring(0, 2);
          const done = state.completedLessons.filter(id => id.startsWith(prefix)).length;
          const total = course.units.reduce((a, u) => a + u.lessons.length, 0);
          const percent = total ? Math.round((done / total) * 100) : 0;
          
          return `
            <div class="profile-v2-course-card">
              <div class="p-v2-course-header">
                <div class="p-v2-course-title">
                  <span class="p-v2-course-icon">${course.icon}</span>
                  ${course.name}
                </div>
                <div style="font-weight:900;color:var(--text-primary);font-size:0.95rem;">${percent}%</div>
              </div>
              <div class="p-v2-progress-track">
                <div class="p-v2-progress-fill" style="width:${percent}%;background:${course.color};">
                  <div class="p-v2-progress-glow"></div>
                </div>
              </div>
              <div class="p-v2-course-stats">
                <span>⚡ ${done} Leçons</span>
                <span>${total} Total</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Activity Calendar (Glass version) -->
      <div class="section-header" style="padding: 0 15px;"><span class="section-title">${t('pr_activity')}</span></div>
      <div class="profile-glass-card mb-30" style="margin-left:15px;margin-right:15px;">
        <div class="streak-calendar">
          ${calDays.map(d => `
            <div class="cal-day ${d.isToday ? 'today' : d.isActive ? 'active-day' : ''}" title="${d.isToday ? 'Today' : ''}">
              ${d.day}
            </div>
          `).join('')}
        </div>
        <div style="margin-top:12px;font-size:0.75rem;color:var(--text-muted);display:flex;gap:16px;justify-content:center;">
          <span>${t('pr_cal_active')}</span>
          <span style="color:var(--accent-purple);font-weight:800;">${t('pr_cal_today')}</span>
        </div>
      </div>

      <!-- Daily Goals (Mimo Style) -->
      <div class="section-header" style="padding: 0 15px;"><span class="section-title">🎯 ${t('pr_daily_goal')}</span></div>
      <div class="profile-glass-card mb-30" style="margin-left:15px;margin-right:15px;">
        <div class="goal-picker" style="grid-template-columns:1fr 1fr;">
          ${[
            {id:'relaxed',xp:5,label:t('goal_relaxed')},
            {id:'regular',xp:15,label:t('goal_regular')},
            {id:'serious',xp:30,label:t('goal_serious')},
            {id:'insane',xp:50,label:t('goal_insane')}
          ].map(goal => `
            <div class="goal-option ${state.dailyGoal === goal.id ? 'active' : ''}" onclick="setDailyGoal('${goal.id}')" style="padding:10px;border-radius:12px;">
              <div class="goal-info">
                <span class="goal-label" style="font-size:0.8rem;">${goal.label}</span>
                <span class="goal-xp" style="font-size:0.65rem;">${goal.xp} XP</span>
              </div>
              <div class="goal-check">${state.dailyGoal === goal.id ? '✅' : ''}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Appearance & Themes -->
      <div class="section-header" style="padding: 0 15px;"><span class="section-title">🎨 Thèmes</span></div>
      <div class="profile-glass-card mb-30" style="margin-left:15px;margin-right:15px;">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
          ${[{id:'dark',icon:'🌙',lbl:'Sombre'},{id:'light',icon:'☀️',lbl:'Clair'},{id:'auto',icon:'⚙️',lbl:'Auto'}].map(thm => `
            <button onclick="setThemeFromProfile('${thm.id}')" class="stat-v2-card" style="padding:10px;">
              <span style="font-size:1.5rem;">${thm.icon}</span>
              <span style="font-size:0.7rem;font-weight:800;">${thm.lbl}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Security & Settings (Compact Group) -->
      <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:15px;padding:0 15px;margin-bottom:30px;">
        <div class="profile-glass-card">
          <div style="font-weight:900;font-size:0.95rem;margin-bottom:8px;">🛡️ Sécurité</div>
            <button class="btn btn-secondary btn-sm btn-full" onclick="exportStateToken()">Jeton 🔑</button>
            <a href="privacy.html" target="_blank" class="btn btn-ghost btn-sm btn-full" style="margin-top:5px;font-size:0.7rem;">Confidentialité 📄</a>
        </div>
        <div class="profile-glass-card">
           <div style="font-weight:900;font-size:0.95rem;margin-bottom:8px;">⚙️ Compte</div>
           <button class="btn btn-secondary btn-sm btn-full" onclick="changeUsername()">Renommer</button>
           <button class="btn btn-danger btn-sm btn-full" onclick="confirmReset()" style="margin-top:5px;">Effacer</button>
        </div>
      </div>

      <!-- QR Share -->
      <div class="profile-glass-card mb-40" style="margin-left:15px;margin-right:15px;text-align:center;">
        <div style="font-weight:900;margin-bottom:10px;">📲 Partager mon profil</div>
        <div style="background:white; padding:10px; display:inline-block; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
          <img id="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(window.location.href)}" style="width:140px;height:140px;">
        </div>
      </div>
    </div>
  `;

  // Animate XP bar
  requestAnimationFrame(() => {
    setTimeout(() => {
      const bar = document.getElementById('profile-xp-bar');
      if (bar) bar.style.width = xpProgress + '%';
    }, 100);
  });

  updateTopbar();
}

function changeUsername() {
  const newName = prompt(t('pr_edit_prompt'), AppState.username);
  if (!newName) return;
  const trimmed = newName.trim();
  
  // Expert Validation: Alphanumeric and underscores only, 3-20 chars
  const nameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!nameRegex.test(trimmed)) {
    alert('Invalid username. Use 3-20 alphanumeric characters or underscores.');
    return;
  }

  if (trimmed.length > 0) {
    AppState.username = trimmed;
    saveState();
    renderProfile();
  }
}

function confirmReset() {
  showModal({
    icon: '🗑️',
    title: t('pr_reset'),
    message: t('pr_reset_confirm'),
    confirmText: 'Réinitialiser',
    cancelText: 'Annuler',
    onConfirm: () => {
      localStorage.removeItem('codelingo_state');
      location.reload();
    }
  });
}

function changeAvatar(avatar) {
  AppState.avatar = avatar;
  saveState();
  const display = document.getElementById('profile-avatar-display');
  if (display) {
    display.textContent = avatar;
    display.style.transform = 'scale(1.3)';
    setTimeout(() => { display.style.transform = 'scale(1)'; }, 200);
  }
  document.querySelectorAll('#avatar-picker-panel .avatar-pick-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.textContent.trim() === avatar);
  });
}

function toggleAvatarPicker() {
  const panel = document.getElementById('avatar-picker-panel');
  if (!panel) return;
  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
}

function setDailyGoal(goalId) {
  AppState.dailyGoal = goalId;
  saveState();
  renderProfile();
  
  // Show encouraging modal
  const goal = [
    {id:'relaxed',xp:5,label:t('goal_relaxed')},
    {id:'regular',xp:15,label:t('goal_regular')},
    {id:'serious',xp:30,label:t('goal_serious')},
    {id:'insane',xp:50,label:t('goal_insane')}
  ].find(g => g.id === goalId);
  
  showModal({
    icon: '🎯',
    title: 'Objectif mis à jour',
    message: `Ton nouvel objectif est "${goal.label}" (${goal.xp} XP par jour). Tu peux le faire !`
  });
}

function exportStateToken() {
  const stateStr = JSON.stringify(AppState);
  const token = btoa(unescape(encodeURIComponent(stateStr)));
  
  showModal({
    icon: '🔑',
    title: 'Ton Jeton de Sauvegarde',
    message: 'Copie ce jeton et garde-le en lieu sûr. Tu pourras l\'utiliser pour te reconnecter ou transférer ton compte.',
    confirmText: 'Copier',
    onConfirm: () => {
      navigator.clipboard.writeText(token);
      addNotification({ icon: '✅', title: 'Copié !', message: 'Ton jeton est dans le presse-papier.' });
    }
  });
}

window.renderProfile    = renderProfile;
window.changeUsername   = changeUsername;
window.confirmReset     = confirmReset;
window.changeAvatar     = changeAvatar;
window.toggleAvatarPicker = toggleAvatarPicker;
window.exportStateToken = exportStateToken;
window.setDailyGoal     = setDailyGoal;
