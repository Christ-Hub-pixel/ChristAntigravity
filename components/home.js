// ============================================================
// CodeLingo — Home Page Component (Duolingo-accurate layout)
// ============================================================

function renderHome() {
  const state = AppState;

  // Find active course or default to python
  const activeCid = state.currentCourse || 'python';
  const course = COURSES[activeCid];
  if (!course) { navigate('#courses'); return; }

  // Find current unit (first one not 100% complete)
  let activeUnitIdx = 0;
  for (let i = 0; i < course.units.length; i++) {
    const unit = course.units[i];
    const unitDone = unit.lessons.filter(l => state.completedLessons.includes(l.id)).length;
    if (unitDone < unit.lessons.length) { activeUnitIdx = i; break; }
    activeUnitIdx = i;
  }

  const activeUnit = course.units[activeUnitIdx];
  const unitDoneCount = activeUnit.lessons.filter(l => state.completedLessons.includes(l.id)).length;
  const unitTotalCount = activeUnit.lessons.length;
  const unitPct = Math.round((unitDoneCount / unitTotalCount) * 100);

  // Level info
  const lvlRaw   = getLevel(state.totalXP);
  const lvlXPInLevel = state.totalXP - lvlRaw.minXP;
  const lvlXPRange   = Math.max(1, lvlRaw.maxXP - lvlRaw.minXP);
  const lvlInfo = {
    level:     lvlRaw.level,
    pct:       Math.min(100, Math.round((lvlXPInLevel / lvlXPRange) * 100)),
    remaining: Math.max(0, lvlRaw.maxXP - state.totalXP),
  };

  // Build the path nodes HTML
  const pathNodesHtml = activeUnit.lessons.map((lesson, idx) => {
    const isCompleted = state.completedLessons.includes(lesson.id);
    const prevDone = idx === 0 || state.completedLessons.includes(activeUnit.lessons[idx - 1]?.id);
    const isNext = !isCompleted && prevDone;
    const isLocked = !isCompleted && !isNext;

    // Zig-zag: Duolingo style offsets
    const offsets = [0, 50, 70, 50, 0, -50, -70, -50];
    const offset = offsets[idx % offsets.length];

    const nodeClass = isCompleted ? 'completed' : isNext ? 'current' : 'locked';
    const nodeIcon   = isCompleted ? '✓' : isLocked ? '🔒' : lesson.icon;
    const clickFn   = isLocked ? '' : `startLesson('${activeCid}', '${lesson.id}')`;

    return `
      <div class="path-node-container" style="transform:translateX(${offset}px)">
        <div class="path-node ${nodeClass}" onclick="${clickFn}" title="${escHtml(lesson.title)}">
          <span class="path-node-icon">${nodeIcon}</span>
        </div>
        ${isNext ? `<div class="path-node-tooltip">▶ ${t('start_label')}</div>` : ''}
        <div class="path-node-label">${escHtml(lesson.title)}</div>
      </div>
    `;
  }).join('');

  document.getElementById('app-main').innerHTML = `
    <div class="duo-home-layout">

      <!-- ── CENTER: Learning Path ─────────────────────────── -->
      <div class="duo-path-col">

        <!-- Unit Header Banner -->
        <div class="path-unit-header" style="background:${activeUnit.color ?? 'var(--accent-green)'}">
          <div class="path-unit-info">
            <div class="path-unit-num">${t('unit_label')} ${activeUnitIdx + 1}</div>
            <div class="path-unit-title">${escHtml(activeUnit.title)}</div>
            <div class="path-unit-progress-row">
              <div class="path-unit-progress-bar">
                <div class="path-unit-progress-fill" style="width:${unitPct}%"></div>
              </div>
              <span class="path-unit-progress-label">${unitDoneCount}/${unitTotalCount}</span>
            </div>
          </div>
          <div class="path-unit-badge">${activeUnit.icon}</div>
        </div>

        <!-- Lesson Nodes -->
        <div class="learning-path" id="learning-path">
          ${pathNodesHtml}
        </div>

      </div>

      <!-- ── RIGHT: Stats Panel (desktop only) ─────────────── -->
      <aside class="duo-stats-panel">

        <!-- Daily Streak -->
        <div class="duo-widget">
          <div class="duo-widget-header">
            <span class="duo-widget-icon">🔥</span>
            <span class="duo-widget-title">${t('stat_streak')}</span>
          </div>
          <div class="duo-widget-value">${state.streakDays}</div>
          <div class="duo-widget-sub">jour${state.streakDays > 1 ? 's' : ''} de suite</div>
        </div>

        <!-- XP Level -->
        <div class="duo-widget">
          <div class="duo-widget-header">
            <span class="duo-widget-icon">⚡</span>
            <span class="duo-widget-title">Niveau ${lvlInfo.level}</span>
          </div>
          <div class="duo-level-bar-track">
            <div class="duo-level-bar-fill" style="width:${lvlInfo.pct}%"></div>
          </div>
          <div class="duo-widget-sub">${state.totalXP.toLocaleString()} XP · ${lvlInfo.remaining} pour niveau ${lvlInfo.level + 1}</div>
        </div>

        <!-- Hearts -->
        <div class="duo-widget">
          <div class="duo-widget-header">
            <span class="duo-widget-icon">❤️</span>
            <span class="duo-widget-title">Vies</span>
          </div>
          <div class="duo-hearts-row">
            ${Array.from({length: AppState.maxHearts}, (_, i) =>
              `<span class="duo-heart ${i < AppState.hearts ? 'full' : 'empty'}">❤️</span>`
            ).join('')}
          </div>
          <div class="duo-widget-sub">${AppState.hearts}/${AppState.maxHearts} vies restantes</div>
        </div>

        <!-- Gems -->
        <div class="duo-widget">
          <div class="duo-widget-header">
            <span class="duo-widget-icon">💎</span>
            <span class="duo-widget-title">Gemmes</span>
          </div>
          <div class="duo-widget-value" style="color:var(--accent-blue)">${AppState.gems}</div>
          <div class="duo-widget-sub">Recharge les vies (10 💎)</div>
        </div>

        <!-- Daily Challenge -->
        <div class="duo-widget duo-widget-daily" onclick="navigate('#courses')">
          <div class="duo-widget-header">
            <span class="duo-widget-icon">🎯</span>
            <span class="duo-widget-title">${t('daily_label')}</span>
          </div>
          <div class="duo-widget-sub">${t('daily_title')}</div>
          <div class="duo-daily-xp">+${20 + state.streakDays * 2} XP</div>
        </div>

      </aside>
    </div>
  `;

  updateTopbar();
  setTimeout(renderPathSVG, 80);
  
  // Auto-tutorial for first login
  if (!state.tutorialDone && typeof startTutorial === 'function') {
    setTimeout(startTutorial, 1000);
  }
}

// ── SVG Path Connector ─────────────────────────────────────
function renderPathSVG() {
  const container = document.querySelector('.learning-path');
  if (!container) return;

  // Remove existing SVG
  const existing = container.querySelector('.path-svg');
  if (existing) existing.remove();

  const nodes = container.querySelectorAll('.path-node-container');
  if (nodes.length < 2) return;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'path-svg');

  const containerRect = container.getBoundingClientRect();
  const points = [];

  nodes.forEach(node => {
    const nodeEl = node.querySelector('.path-node');
    if (!nodeEl) return;
    const r = nodeEl.getBoundingClientRect();
    points.push({
      x: r.left + r.width / 2 - containerRect.left,
      y: r.top + r.height / 2 - containerRect.top,
      completed: nodeEl.classList.contains('completed'),
      isCurrent: nodeEl.classList.contains('current'),
    });
  });

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const midY = (p1.y + p2.y) / 2;
    const d = `M ${p1.x} ${p1.y} C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    const done = p1.completed && (p2.completed || p2.isCurrent);
    path.setAttribute('class', `path-curve${done ? ' completed' : ''}`);
    svg.appendChild(path);
  }

  container.prepend(svg);
}

// ── Topbar Updater ─────────────────────────────────────────
function updateTopbar() {
  const updates = {
    'topbar-streak':  AppState.streakDays,
    'topbar-xp':      AppState.totalXP.toLocaleString(),
    'topbar-hearts':  AppState.hearts,
    'topbar-gems':    AppState.gems.toLocaleString(),
    'sidebar-streak': AppState.streakDays,
    'sidebar-xp':     AppState.totalXP.toLocaleString(),
    'sidebar-hearts': AppState.hearts,
    'sidebar-gems':   AppState.gems.toLocaleString(),
  };
  for (const [id, val] of Object.entries(updates)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
}

window.renderHome    = renderHome;
window.renderPathSVG = renderPathSVG;
window.updateTopbar  = updateTopbar;
