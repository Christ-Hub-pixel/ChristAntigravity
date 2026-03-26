// ============================================================
// CodeLingo — Courses / Skill Tree Component
// ============================================================

let activeCourseTab = 'python';

function renderCourses() {
  const state = AppState;

  document.getElementById('app-main').innerHTML = `
    <div style="margin-bottom:20px;">
      <div style="font-size:1.4rem;font-weight:900;margin-bottom:4px;">📚 ${t('courses_title')}</div>
      <div style="font-size:0.85rem;color:var(--text-secondary);">${t('courses_sub')}</div>
    </div>

    <div class="course-tabs" id="course-tabs">
      ${Object.values(COURSES).map(c => `
        <div class="course-tab ${c.id === activeCourseTab ? 'active' : ''}" 
             onclick="switchCourseTab('${c.id}')"
             id="tab-${c.id}">
          <span class="tab-icon">${c.icon}</span>
          <div class="tab-info">
            <span class="tab-name">${c.name}</span>
            <span class="tab-level badge-${(c.level || 'Beginner').toLowerCase()}">${c.level || 'Beginner'}</span>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Skill Tree -->
    <div id="skill-tree-content">
      ${renderSkillTree(activeCourseTab)}
    </div>
  `;

  updateTopbar();
}

function switchCourseTab(courseId) {
  activeCourseTab = courseId;
  document.querySelectorAll('.course-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${courseId}`)?.classList.add('active');
  const content = document.getElementById('skill-tree-content');
  if (content) {
    content.style.opacity = '0';
    content.style.transform = 'translateY(10px)';
    setTimeout(() => {
      content.innerHTML = renderSkillTree(courseId);
      content.style.transition = 'all 0.3s ease';
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }, 150);
  }
}

function renderSkillTree(courseId) {
  const course = COURSES[courseId];
  const state = AppState;
  if (!course) return '';

  // Which lessons are done
  const done = state.completedLessons;

  // Calculate unlock logic: a unit is unlocked if previous unit is ≥50% done
  let html = '';

  course.units.forEach((unit, unitIdx) => {
    const unitLessons = unit.lessons;
    const unitDone = unitLessons.filter(l => done.includes(l.id)).length;
    const unitTotal = unitLessons.length;
    const unitPct = unitTotal ? Math.round((unitDone / unitTotal) * 100) : 0;

    // Unlock: first unit always open, subsequent need prev ≥ 50%
    let unitLocked = false;
    if (unitIdx > 0) {
      const prevUnit = course.units[unitIdx - 1];
      const prevDone = prevUnit.lessons.filter(l => done.includes(l.id)).length;
      unitLocked = prevDone < Math.ceil(prevUnit.lessons.length * 0.5);
    }

    html += `
    <div class="unit-block">
      <div class="premium-unit-card" style="background: ${unit.color}">
        <div class="p-unit-info">
          <div class="p-unit-num">${t('unit_label')} ${unitIdx + 1}</div>
          <div class="p-unit-title">${escHtml(unit.title)}</div>
        </div>
        <div class="p-unit-badge">${unit.icon}</div>
      </div>
      <div class="lessons-grid">
        ${unit.lessons.map(lesson => {
          const isCompleted = state.completedLessons.includes(lesson.id);
          const isLocked = !isCompleted && !isNextAvailable(course, lesson.id, state.completedLessons);
          
          return `
          <div class="lesson-card-premium ${isCompleted ? 'completed' : isLocked ? 'locked' : 'active'}" 
               onclick="${isLocked ? '' : `startLesson('${course.id}', '${lesson.id}')`}">
            <div class="l-icon-wrap">${isCompleted ? '✅' : lesson.icon}</div>
            <div class="l-info">
              <div class="l-title">${escHtml(lesson.title)}</div>
              <div class="l-meta">+${lesson.xpReward} XP</div>
            </div>
            ${isLocked ? '<div class="l-status">🔒</div>' : ''}
          </div>`;
        }).join('')}
      </div>
    </div>`;
  });

  return html;
}

window.renderCourses = renderCourses;
window.switchCourseTab = switchCourseTab;
