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
    <!-- Profile Hero -->
    <div class="profile-hero">
      <div class="profile-avatar" onclick="toggleAvatarPicker()" title="Changer d'avatar" style="cursor:pointer;position:relative;">
        <span id="profile-avatar-display" style="font-size:3.5rem;transition:transform 0.2s ease;display:block;">${state.avatar}</span>
        <div style="position:absolute;bottom:-4px;right:-4px;background:var(--accent-blue);border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:0.65rem;border:2px solid var(--bg-primary);">✏️</div>
      </div>
      <div>
        <div class="profile-name">${escHtml(state.username)}</div>
        <div class="profile-level-name">${t('level_prefix')} ${level.level} · ${escHtml(level.name)}</div>
        <div class="profile-xp-section">
          <div class="profile-xp-label">
            <span>${state.totalXP} XP</span>
            <span>${nextLevel ? `${nextLevel.minXP - state.totalXP} ${t('xp_to_next')} ${t('level_prefix')} ${nextLevel.level}` : t('max_level')}</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" id="profile-xp-bar" style="width:0%;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Avatar Picker (hidden by default) -->
    <div id="avatar-picker-panel" class="avatar-picker-panel" style="display:none;">
      <div class="avatar-picker-header">Choisis ton avatar</div>
      <div class="auth-avatar-grid">
        ${(window.AVATARS || ['🧑‍💻','👨‍💻','👩‍💻','🐱','🐶','🦊','🐸','🐼','🦁','🐯','🚀','⚡','🎯','🔥','💎','🌟']).map(a => `
          <button class="avatar-pick-btn ${a === state.avatar ? 'selected' : ''}" onclick="changeAvatar('${a}')">${a}</button>
        `).join('')}
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-row mb-20">
      <div class="stat-card">
        <span class="s-icon">🔥</span>
        <span class="s-val">${state.streakDays}</span>
        <span class="s-lbl">${t('pr_streak')}</span>
      </div>
      <div class="stat-card">
        <span class="s-icon">🏅</span>
        <span class="s-val">${state.earnedBadges.length}</span>
        <span class="s-lbl">${t('pr_badges')}</span>
      </div>
      <div class="stat-card">
        <span class="s-icon">💎</span>
        <span class="s-val">${state.perfectLessons}</span>
        <span class="s-lbl">${t('pr_perfect')}</span>
      </div>
    </div>

    <!-- Language Progress -->
    <div class="section-header"><span class="section-title">${t('pr_lang_progress')}</span></div>
    <div class="card mb-20">
      <div style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:8px;font-weight:700;">
            <span>🐍</span> Python
          </div>
          <span style="font-size:0.82rem;color:var(--text-secondary);">${pyDone}/${pyTotal} ${t('lessons_label')}</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:${pyTotal ? Math.round(pyDone/pyTotal*100) : 0}%;background:#3776ab;"></div>
        </div>
      </div>
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:8px;font-weight:700;">
            <span>🟨</span> JavaScript
          </div>
          <span style="font-size:0.82rem;color:var(--text-secondary);">${jsDone}/${jsTotal} ${t('lessons_label')}</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:${jsTotal ? Math.round(jsDone/jsTotal*100) : 0}%;background:#f7df1e;"></div>
        </div>
      </div>
    </div>

    <!-- Streak Calendar -->
    <div class="section-header"><span class="section-title">${t('pr_activity')}</span></div>
    <div class="card mb-20">
      <div class="streak-calendar">
        ${calDays.map(d => `
          <div class="cal-day ${d.isToday ? 'today' : d.isActive ? 'active-day' : ''}" title="${d.isToday ? 'Today' : ''}">
            ${d.day}
          </div>
        `).join('')}
      </div>
      <div style="margin-top:12px;font-size:0.78rem;color:var(--text-muted);display:flex;gap:16px;">
        <span>${t('pr_cal_active')}</span>
        <span style="color:var(--accent-purple);">${t('pr_cal_today')}</span>
        <span>${t('pr_cal_inactive')}</span>
      </div>
    </div>

    <!-- Badges Grid -->
    <div class="section-header"><span class="section-title">${t('pr_badges_title')}</span></div>
    <div class="card mb-20">
      <div class="badges-grid">
        ${BADGES.map(badge => {
          const earned = state.earnedBadges.includes(badge.id);
          return `
            <div class="badge-item ${earned ? `earned ${badge.rarity}` : 'locked'}" title="${badge.description}">
              <span class="badge-emoji">${badge.icon}</span>
              <span class="badge-name">${escHtml(badge.name)}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Account -->
    <div class="section-header"><span class="section-title">${t('pr_account')}</span></div>
    <div class="card mb-20">
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="color:var(--text-secondary);font-size:0.875rem;">${t('pr_username')}</span>
          <span style="font-weight:700;">${escHtml(state.username)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="color:var(--text-secondary);font-size:0.875rem;">${t('pr_member')}</span>
          <span style="font-weight:700;">${joinDate.toLocaleDateString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="color:var(--text-secondary);font-size:0.875rem;">${t('pr_xp_total')}</span>
          <span style="font-weight:700;color:var(--accent-yellow);">${state.totalXP.toLocaleString()} XP</span>
        </div>
      </div>
    </div>
    
    <!-- QR Code / Share -->
    <div class="section-header"><span class="section-title">📱 ${t('pr_share')}</span></div>
    <div class="card mb-20" style="text-align:center;">
      ${window.location.protocol === 'file:' ? `
        <div style="background:rgba(255,150,0,0.1); border:1px solid rgba(255,150,0,0.3); border-radius:var(--radius-md); padding:16px; margin-bottom:16px; text-align:left;">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
            <span style="font-size:1.2rem;">⚠️</span>
            <span style="font-size:0.85rem; font-weight:800; color:var(--accent-orange);">${t('pr_qr_warn_title')}</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-secondary); line-height:1.4;">
            ${t('pr_qr_warn_desc')}
          </div>
        </div>
      ` : ''}
      <div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:12px;">${t('pr_qr_hint')}</div>
      <div style="background:white; padding:12px; display:inline-block; border-radius:var(--radius-md); box-shadow:0 4px 12px rgba(0,0,0,0.1);">
        <img id="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(window.location.href)}" 
             alt="QR Code" style="width:160px;height:160px;display:block;">
      </div>
      <div style="margin-top:12px;font-size:0.75rem;color:var(--text-muted);word-break:break-all; font-family:monospace; line-height:1.4;">
        ${window.location.href}
      </div>
    </div>

    <!-- Theme Settings -->
    <div class="section-header"><span class="section-title">${t('pr_appearance')}</span></div>
    <div class="card mb-20">
      <div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:12px;">${t('pr_theme_hint')}</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;" id="theme-picker">
        ${[{id:'dark',icon:'🌙',label:t('theme_dark')},{id:'light',icon:'☀️',label:t('theme_light')},{id:'auto',icon:'⚙️',label:t('theme_auto')}].map(thm => `
          <button onclick="setThemeFromProfile('${thm.id}')"
            style="padding:12px 8px;border-radius:var(--radius-md);border:1.5px solid var(--border);background:var(--bg-card);cursor:pointer;font-family:inherit;transition:all 0.2s ease;display:flex;flex-direction:column;align-items:center;gap:5px;"
            class="theme-pick-btn" data-theme-id="${thm.id}">
            <span style="font-size:1.4rem;">${thm.icon}</span>
            <span style="font-size:0.78rem;font-weight:700;color:var(--text-secondary);">${thm.label}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;">
      <button class="btn btn-secondary" onclick="changeUsername()">${t('pr_edit_name')}</button>
      <button class="btn btn-danger" onclick="confirmReset()">${t('pr_reset')}</button>
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
  if (confirm(t('pr_reset_confirm'))) {
    localStorage.removeItem('codelingo_state');
    location.reload();
  }
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

window.renderProfile    = renderProfile;
window.changeUsername   = changeUsername;
window.confirmReset     = confirmReset;
window.changeAvatar     = changeAvatar;
window.toggleAvatarPicker = toggleAvatarPicker;
