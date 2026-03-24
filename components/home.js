// ============================================================
// CodeLingo — Home Page Component
// ============================================================

function renderHome() {
  const state = AppState;
  
  // Find active course or default to python
  const activeCid = state.currentCourse || 'python';
  const course = COURSES[activeCid];
  
  // Find current unit (first one not 100% complete)
  let activeUnitIdx = 0;
  for (let i = 0; i < course.units.length; i++) {
    const unit = course.units[i];
    const unitDone = unit.lessons.filter(l => state.completedLessons.includes(l.id)).length;
    if (unitDone < unit.lessons.length) {
      activeUnitIdx = i;
      break;
    }
    activeUnitIdx = i; // If all done, stay on last
  }
  
  const activeUnit = course.units[activeUnitIdx];
  const unitDoneCount = activeUnit.lessons.filter(l => state.completedLessons.includes(l.id)).length;
  const unitTotalCount = activeUnit.lessons.length;
  const unitPct = Math.round((unitDoneCount / unitTotalCount) * 100);

  document.getElementById('app-main').innerHTML = `
    <!-- Path Header -->
    <div class="path-unit-header" style="background:${activeUnit.color}">
      <div class="path-unit-info">
        <div class="path-unit-num">${t('unit_label')} ${activeUnitIdx + 1}</div>
        <div class="path-unit-title">${escHtml(activeUnit.title)}</div>
      </div>
      <div class="path-unit-badge">
        <span class="path-unit-icon">${activeUnit.icon}</span>
      </div>
    </div>

    <!-- The Learning Path -->
    <div class="learning-path">
      ${activeUnit.lessons.map((lesson, idx) => {
        const isCompleted = state.completedLessons.includes(lesson.id);
        const isNext = !isCompleted && (idx === 0 || state.completedLessons.includes(activeUnit.lessons[idx-1]?.id));
        const isLocked = !isCompleted && !isNext;
        
        // Zig-zag offset
        const offsets = [0, 40, 60, 40, 0, -40, -60, -40];
        const offset = offsets[idx % offsets.length];

        return `
          <div class="path-node-container" style="transform: translateX(${offset}px)">
            <div class="path-node ${isCompleted ? 'completed' : isNext ? 'current' : 'locked'}" 
                 onclick="${isLocked ? '' : `startLesson('${activeCid}', '${lesson.id}')`}"
                 title="${escHtml(lesson.title)}">
              <span class="path-node-icon">${isCompleted ? '✅' : isLocked ? '🔒' : lesson.icon}</span>
              ${isNext ? `<div class="path-node-tooltip">${t('start_label')}!</div>` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Stats & Challenge Row -->
    <div class="stats-row mb-20" style="margin-top:20px;">
      <div class="stat-card" onclick="navigate('#leaderboard')">
        <span class="s-icon">🏆</span>
        <span class="s-val">#${state.rank || 12}</span>
        <span class="s-lbl">${t('stat_rank')}</span>
      </div>
      <div class="stat-card" onclick="navigate('#profile')">
        <span class="s-icon">🔥</span>
        <span class="s-val">${state.streakDays}</span>
        <span class="s-lbl">${t('stat_streak')}</span>
      </div>
      <div class="stat-card" onclick="navigate('#profile')">
        <span class="s-icon">⚡</span>
        <span class="s-val">${state.totalXP.toLocaleString()}</span>
        <span class="s-lbl">${t('stat_xp')}</span>
      </div>
    </div>

    <!-- Daily Challenge -->
    <div class="daily-card mb-20" onclick="navigate('#courses')">
      <div class="daily-info">
        <div class="daily-label">${t('daily_label')}</div>
        <div class="daily-title">${t('daily_title')}</div>
        <div class="daily-xp">+${20 + state.streakDays * 2} XP ${t('daily_bonus_prefix')}</div>
      </div>
      <span class="daily-icon">🎯</span>
    </div>
  `;

  updateTopbar();
  setTimeout(renderPathSVG, 50);
}

function renderPathSVG() {
  const container = document.querySelector('.learning-path');
  if (!container) return;
  
  // Remove existing SVG if any
  const existing = container.querySelector('.path-svg');
  if (existing) existing.remove();
  
  const nodes = container.querySelectorAll('.path-node-container');
  if (nodes.length < 2) return;
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'path-svg');
  
  const containerRect = container.getBoundingClientRect();
  const points = [];
  
  nodes.forEach((node, i) => {
    const nodeEl = node.querySelector('.path-node');
    const nodeRect = nodeEl.getBoundingClientRect();
    const x = nodeRect.left + nodeRect.width / 2 - containerRect.left;
    const y = nodeRect.top + nodeRect.height / 2 - containerRect.top;
    points.push({ 
      x, y, 
      completed: nodeEl.classList.contains('completed'),
      isCurrent: nodeEl.classList.contains('current')
    });
  });
  
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i+1];
    
    // Bezier curve control points for a smooth S-curve
    const cp1x = p1.x;
    const cp1y = p1.y + (p2.y - p1.y) / 2;
    const cp2x = p2.x;
    const cp2y = p1.y + (p2.y - p1.y) / 2;
    
    const d = `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    // Path is completed if both nodes are completed OR if p1 is completed and p2 is current
    const isCompletedPath = p1.completed && (p2.completed || p2.isCurrent);
    path.setAttribute('class', `path-curve ${isCompletedPath ? 'completed' : ''}`);
    svg.appendChild(path);
  }
  
  container.prepend(svg);
}

function updateTopbar() {
  const st = AppState.streakDays;
  const xp = AppState.totalXP;
  const elStreak = document.getElementById('topbar-streak');
  const elXP = document.getElementById('topbar-xp');
  const sideStreak = document.getElementById('sidebar-streak');
  const sideXP = document.getElementById('sidebar-xp');
  
  if (elStreak) elStreak.textContent = `${st}`;
  if (elXP) elXP.textContent = `${xp.toLocaleString()}`;
  if (sideStreak) sideStreak.textContent = `${st}`;
  if (sideXP) sideXP.textContent = `${xp.toLocaleString()}`;
}

window.renderHome = renderHome;
window.renderPathSVG = renderPathSVG;
window.updateTopbar = updateTopbar;
