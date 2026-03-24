// ============================================================
// CodeLingo — Leaderboard Component
// ============================================================

let lbMode = 'weekly';

function renderLeaderboard() {
  updateTopbar();

  // Insert player into leaderboard
  const state = AppState;
  const playerEntry = {
    name: state.username,
    avatar: state.avatar,
    xp: state.totalXP,
    streak: state.streakDays,
    level: getLevel(state.totalXP).level,
    isUser: true,
  };

  let board = [...LEADERBOARD_USERS.map(u => ({ ...u })), playerEntry];
  board.sort((a, b) => b.xp - a.xp);

  if (lbMode === 'weekly') {
    board = board.map(u => ({ ...u, xp: Math.round(u.xp * 0.18 + Math.random() * 20) }));
    board.sort((a, b) => b.xp - a.xp);
  }

  const userRank = board.findIndex(u => u.isUser) + 1;
  const top3 = board.slice(0, 3);
  const rest = board.slice(3);

  const medals = ['🥇', '🥈', '🥉'];
  const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd for visual podium

  document.getElementById('app-main').innerHTML = `
    <div style="margin-bottom:20px;">
      <div style="font-size:1.4rem;font-weight:900;margin-bottom:4px;">🏆 ${t('lb_title')}</div>
      <div style="font-size:0.85rem;color:var(--text-secondary);">${t('lb_rank')} <span style="color:var(--accent-green);font-weight:700;">#${userRank}</span></div>
    </div>

    <!-- Toggle -->
    <div class="leaderboard-toggle">
      <div class="lb-toggle-btn ${lbMode === 'weekly' ? 'active' : ''}" onclick="switchLbMode('weekly')">${t('lb_weekly')}</div>
    <!-- Leaderboard Toggle -->
    <div class="leaderboard-toggle-premium mb-20">
      <div class="lb-toggle-item ${lbMode === 'weekly' ? 'active' : ''}" onclick="switchLbMode('weekly')">${t('lb_weekly')}</div>
      <div class="lb-toggle-item ${lbMode === 'alltime' ? 'active' : ''}" onclick="switchLbMode('alltime')">${t('lb_alltime')}</div>
    </div>

    <!-- Podium -->
    <div class="premium-podium">
      <div class="podium-place second" title="${escHtml(top3[1]?.name || '???')}">
        <div class="podium-avatar">${top3[1]?.avatar || '👤'}</div>
        <div class="podium-rank-badge">2</div>
        <div class="podium-name">${escHtml(top3[1]?.name || '???')}</div>
        <div class="podium-xp">${(top3[1]?.xp || 0).toLocaleString()} XP</div>
      </div>
      <div class="podium-place first" title="${escHtml(top3[0]?.name || '???')}">
        <div class="podium-crown">👑</div>
        <div class="podium-avatar">${top3[0]?.avatar || '👤'}</div>
        <div class="podium-rank-badge">1</div>
        <div class="podium-name">${escHtml(top3[0]?.name || '???')}</div>
        <div class="podium-xp">${(top3[0]?.xp || 0).toLocaleString()} XP</div>
      </div>
      <div class="podium-place third" title="${escHtml(top3[2]?.name || '???')}">
        <div class="podium-avatar">${top3[2]?.avatar || '👤'}</div>
        <div class="podium-rank-badge">3</div>
        <div class="podium-name">${escHtml(top3[2]?.name || '???')}</div>
        <div class="podium-xp">${(top3[2]?.xp || 0).toLocaleString()} XP</div>
      </div>
    </div>

    <!-- List -->
    <div class="premium-lb-list">
      ${others.map((u, i) => {
        const isUser = u.name === state.username;
        return `
          <div class="premium-lb-item ${isUser ? 'is-user' : ''}">
            <div class="lb-rank-num">${i + 4}</div>
            <div class="lb-avatar-circle">${u.avatar}</div>
            <div class="lb-user-info">
              <div class="lb-user-name">${escHtml(u.name)}</div>
              <div class="lb-user-meta">🔥 ${u.streak} ${t('lb_streak')} · ${t('lb_level')} ${u.level}</div>
            </div>
            <div class="lb-user-xp">${u.xp.toLocaleString()} XP</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function switchLbMode(mode) {
  lbMode = mode;
  renderLeaderboard();
}

window.renderLeaderboard = renderLeaderboard;
window.switchLbMode = switchLbMode;
