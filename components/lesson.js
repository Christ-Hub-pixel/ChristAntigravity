// ============================================================
// CodeLingo — Lesson Exercise Engine
// ============================================================

let lessonState = {
  courseId: null,
  lessonId: null,
  lesson: null,
  exerciseIdx: 0,
  mistakes: 0,
  answered: false,
  selectedOption: null,
};

function startLesson(courseId, lessonId) {
  if (AppState.hearts <= 0) {
    showOutOfHeartsModal();
    return;
  }

  const course = COURSES[courseId];
  const lesson = course?.units.flatMap(u => u.lessons).find(l => l.id === lessonId);
  if (!lesson) return;

  lessonState = { courseId, lessonId, lesson, exerciseIdx: 0, mistakes: 0, answered: false, selectedOption: null };
  renderExercise();
  window.location.hash = '#lesson';
}

function renderExercise() {
  const { lesson, exerciseIdx } = lessonState;
  const exercise = lesson.exercises[exerciseIdx];
  const total = lesson.exercises.length;
  const progress = ((exerciseIdx) / total) * 100;

  let exerciseHTML = '';
  if (exercise.type === 'mcq' || exercise.type === 'output') {
    exerciseHTML = renderMCQ(exercise);
  } else if (exercise.type === 'fill') {
    exerciseHTML = renderFill(exercise);
  }

  const typeBadge = {
    mcq: `<span class="question-type-badge qtb-mcq">${t('mcq_badge')}</span>`,
    output: `<span class="question-type-badge qtb-output">${t('output_badge')}</span>`,
    fill: `<span class="question-type-badge qtb-fill">${t('fill_badge')}</span>`,
  }[exercise.type] || '';

  // Heart pips display
  const heartPips = Array.from({length: 5}, (_, i) =>
    `<span style="opacity:${i < AppState.hearts ? 1 : 0.2}">❤️</span>`
  ).join('');

  const main = document.getElementById('app-main');
  main.style.paddingBottom = '120px';
  main.innerHTML = `
    <!-- Top Bar -->
    <div class="exercise-topbar">
      <div class="exercise-close" onclick="quitLesson()">✕</div>
      <div class="exercise-progress-wrap">
        <div class="progress-bar-track">
          <div class="progress-bar-fill" id="ex-progress" style="width:${progress}%;"></div>
        </div>
      </div>
      <div class="exercise-lives" id="exercise-hearts">${heartPips}</div>
    </div>

    <!-- Question Card -->
    <div class="question-card">
      ${typeBadge}
      <div class="question-text">${escHtml(exercise.question)}</div>
      ${exercise.code ? renderCodeBlock(exercise.code, exercise.type) : ''}
    </div>

    <!-- Answer Area -->
    <div id="answer-area">${exerciseHTML}</div>
  `;

  // Inject the sticky lesson footer (bottom sheet)
  let footer = document.getElementById('lesson-footer');
  if (!footer) {
    footer = document.createElement('div');
    footer.id = 'lesson-footer';
    footer.className = 'lesson-footer';
    document.body.appendChild(footer);
  }
  const isLast = exerciseIdx + 1 >= total;
  footer.className = 'lesson-footer';
  footer.innerHTML = `
    <button class="btn btn-primary btn-full btn-lg" id="check-btn" onclick="checkAnswer()" disabled>
      ${t('check_btn')}
    </button>
  `;

  if (exercise.type === 'fill') {
    const input = document.getElementById('fill-answer');
    if (input) {
      input.addEventListener('input', () => {
        document.getElementById('check-btn').disabled = input.value.trim() === '';
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkAnswer();
      });
    }
  }

  // Animate progress bar
  requestAnimationFrame(() => {
    setTimeout(() => {
      const bar = document.getElementById('ex-progress');
      if (bar) bar.style.width = ((exerciseIdx + 1) / total * 100) + '%';
    }, 50);
  });
}

function renderCodeBlock(code, type) {
  if (type === 'fill') {
    // Replace ___ with a highlighted blank span
    const highlighted = highlightCode(code).replace('___', '<span class="code-blank">___</span>');
    return `<div class="code-snippet notranslate" translate="no">${highlighted}</div>`;
  }
  return `<div class="code-snippet notranslate" translate="no">${highlightCode(code)}</div>`;
}

function highlightCode(code) {
  // Safe multi-pass regex highlighting using placeholders to avoid HTML injection conflicts
  let hl = escHtml(code);
  
  // 1. Comments
  hl = hl.replace(/(#[^\n]*)/g, 'XX_C_S_XX$1XX_END_XX')
         .replace(/\/\/[^\n]*/g, 'XX_C_S_XX$&XX_END_XX');
  // 2. Strings
  hl = hl.replace(/"([^"]*)"|'([^']*)'/g, 'XX_S_S_XX$&XX_END_XX');
  // 3. Keywords
  hl = hl.replace(/\b(def|return|for|in|if|else|elif|while|import|from|class|print|True|False|None|and|or|not|const|let|var|function|async|await|new|this|typeof|console|document)\b/g, 'XX_K_S_XX$1XX_END_XX');
  // 4. Numbers (avoiding inside strings/already matched stuff by relying on word boundaries)
  hl = hl.replace(/\b(\d+\.?\d*)\b/g, 'XX_N_S_XX$1XX_END_XX');

  // Replace placeholders with actual HTML spans
  return hl
    .replace(/XX_C_S_XX/g, '<span class="code-comment">')
    .replace(/XX_S_S_XX/g, '<span class="code-string">')
    .replace(/XX_K_S_XX/g, '<span class="code-keyword">')
    .replace(/XX_N_S_XX/g, '<span class="code-number">')
    .replace(/XX_END_XX/g, '</span>');
}

function renderMCQ(exercise) {
  return `
    <div class="options-grid">
      ${exercise.options.map((opt, i) => `
        <button class="option-card notranslate" translate="no" id="opt-${i}" onclick="selectOption(${i})">
          <span class="option-letter" translate="yes">${['A','B','C','D'][i]}</span>
          <span>${escHtml(opt)}</span>
        </button>
      `).join('')}
    </div>
  `;
}

function renderFill(exercise) {
  return `
    <div class="fill-input-wrap">
      <input type="text" class="fill-input notranslate" translate="no" id="fill-answer" 
             placeholder="Type your answer..." autocomplete="off" autocorrect="off" spellcheck="false" />
    </div>
    <div class="fill-hint">${t('hint_label')} ${escHtml(exercise.hint)}</div>
    <div style="margin-top:14px;">
      <button class="btn btn-primary btn-full" onclick="submitFill()">${t('check_btn')}</button>
    </div>
  `;
}

// ── Sound Manager (Web Audio API) ──────────────────────────
const SoundManager = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
  },
  play(type) {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    const now = this.ctx.currentTime;
    
    if (type === 'correct') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'wrong') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now); // A2
      osc.frequency.linearRampToValueAtTime(70, now + 0.2);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'success') {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.1, now + i * 0.08 + 0.04);
        gain.gain.linearRampToValueAtTime(0, now + i * 0.08 + 0.3);
        osc.start(now + i * 0.08); osc.stop(now + i * 0.08 + 0.4);
      });
    }
  }
};

function selectOption(idx) {
  if (lessonState.answered) return;

  const exercise = lessonState.lesson.exercises[lessonState.exerciseIdx];

  // Toggle selection
  document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  document.getElementById(`opt-${idx}`)?.classList.add('selected');
  lessonState.selectedOption = idx;

  // Activate check button
  const checkBtn = document.getElementById('check-btn');
  if (checkBtn) checkBtn.disabled = false;
}

function checkAnswer() {
  if (lessonState.answered) return;
  const exercise = lessonState.lesson.exercises[lessonState.exerciseIdx];

  if (exercise.type === 'fill') {
    submitFill();
    return;
  }

  const idx = lessonState.selectedOption;
  if (idx === null || idx === undefined) return;

  lessonState.answered = true;
  const isCorrect = idx === exercise.correct;

  document.querySelectorAll('.option-card').forEach(btn => btn.disabled = true);

  const selectedBtn = document.getElementById(`opt-${idx}`);
  const correctBtn  = document.getElementById(`opt-${exercise.correct}`);
  selectedBtn?.classList.remove('selected');
  selectedBtn?.classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect) correctBtn?.classList.add('correct');

  if (!isCorrect) {
    lessonState.mistakes++;
    if (AppState.hearts > 0) {
      AppState.hearts--;
      saveState();
      updateTopbar();
    }
    SoundManager.play('wrong');
  } else {
    SoundManager.play('correct');
    showXPPopup(t('xp_popup', {xp: 2}));
  }

  showFeedback(isCorrect, exercise.explanation);
}

function submitFill() {
  if (lessonState.answered) return;
  const input = document.getElementById('fill-answer');
  if (!input) return;

  const userAnswer = input.value.trim().toLowerCase();
  const exercise = lessonState.lesson.exercises[lessonState.exerciseIdx];
  const isCorrect = userAnswer === exercise.answer.toLowerCase();

  lessonState.answered = true;
  input.disabled = true;
  input.classList.add(isCorrect ? 'correct' : 'wrong');

  if (!isCorrect) {
    lessonState.mistakes++;
    if (AppState.hearts > 0) {
      AppState.hearts--;
      saveState();
      updateTopbar();
    }
    SoundManager.play('wrong');
  } else {
    SoundManager.play('correct');
    showXPPopup(t('xp_popup', {xp: 2}));
  }

  const extra = isCorrect ? null : `${t('correct_answer')} <strong>${exercise.answer}</strong>`;
  showFeedback(isCorrect, exercise.explanation, extra);
}

function showFeedback(isCorrect, explanation, extra = null) {
  const { lesson, exerciseIdx } = lessonState;
  const isLast = exerciseIdx + 1 >= lesson.exercises.length;
  const isOutOfHearts = AppState.hearts <= 0;

  const footer = document.getElementById('lesson-footer');
  if (!footer) return;

  const icon  = isCorrect ? '✅' : '❌';
  const title = isCorrect ? t('correct_label') : t('wrong_label');
  const nextAction = isOutOfHearts ? 'showOutOfHeartsModal()' : 'nextExercise()';
  const nextLabel  = isOutOfHearts ? '💔 Plus de vies' : isLast ? t('finish_btn') : t('continue_btn');
  const btnClass   = isCorrect ? 'btn-primary' : 'btn-danger';

  footer.className = `lesson-footer ${isCorrect ? 'correct' : 'wrong'}`;
  footer.innerHTML = `
    <div class="footer-feedback">
      <div class="footer-feedback-left">
        <div class="footer-feedback-icon">${icon}</div>
        <div>
          <div class="footer-feedback-msg ${isCorrect ? 'correct' : 'wrong'}">${title}</div>
          ${extra ? `<div class="footer-feedback-hint">${extra}</div>` : ''}
          ${explanation && !extra ? `<div class="footer-feedback-hint">${escHtml(explanation)}</div>` : ''}
        </div>
      </div>
      <button class="btn ${btnClass} btn-lg" onclick="${nextAction}" style="white-space:nowrap;min-width:160px;">
        ${nextLabel}
      </button>
    </div>
  `;
}


function nextExercise() {
  const { lesson } = lessonState;
  lessonState.exerciseIdx++;
  lessonState.answered = false;
  lessonState.selectedOption = null;

  if (lessonState.exerciseIdx >= lesson.exercises.length) {
    showLessonComplete();
  } else {
    renderExercise();
  }
}

function removeLessonFooter() {
  const footer = document.getElementById('lesson-footer');
  if (footer) footer.remove();
  const main = document.getElementById('app-main');
  if (main) main.style.paddingBottom = '';
}

function showLessonComplete() {
  const { courseId, lessonId, lesson, mistakes } = lessonState;
  removeLessonFooter();
  const isPerfect = mistakes === 0;
  const result = completeLesson(lessonId, lesson.xpReward, isPerfect);

  const main = document.getElementById('app-main');
  main.innerHTML = `
    <div class="lesson-complete">
      <div class="complete-vibe">
        <span class="complete-icon">${isPerfect ? '🌟' : '🎉'}</span>
        <div class="complete-sparkles">✨✨✨</div>
      </div>
      <h2 class="complete-title">
        <span>${isPerfect ? t('perfect_title') : t('complete_title')}</span>
      </h2>
      <p class="complete-sub">
        ${isPerfect ? t('perfect_sub') : `${t('mistake_sub')} ${mistakes} ${mistakes !== 1 ? t('mistakes_plural') : t('mistakes_word')}!`}
      </p>

      <div class="xp-earned-premium">
        <span class="xp-icon">⚡</span>
        <span class="xp-val">+${lesson.xpReward} XP</span>
      </div>
      <div class="xp-earned-premium" style="background:rgba(59, 130, 246, 0.1);color:#3b82f6;border-color:rgba(59, 130, 246, 0.2);margin-top:8px;">
        <span class="xp-icon">💎</span>
        <span class="xp-val">+${isPerfect ? 20 : 10} Gemmes</span>
      </div>

      ${result.leveledUp ? `
        <div class="levelup-premium-card">
          <div class="lup-icon">🚀</div>
          <div class="lup-info">
            <div class="lup-title">${t('levelup_label')}</div>
            <div class="lup-desc">${t('levelup_sub', {level: result.newLevel})}</div>
          </div>
        </div>
      ` : ''}

      ${result.newBadges.length > 0 ? `
        <div class="new-badges-section">
          <div class="section-title-sm">${result.newBadges.length > 1 ? t('new_badges') : t('new_badge')}</div>
          <div class="new-badges-row-premium">
            ${result.newBadges.map((b, i) => `
              <div class="new-badge-card" style="animation-delay:${i * 0.1}s">
                <span class="nb-icon">${b.icon}</span>
                <span class="nb-name">${escHtml(b.name)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="complete-actions">
        <button class="btn btn-primary btn-lg btn-full" onclick="navigate('#home')">
          ${t('continue_btn')}
        </button>
        <button class="btn btn-secondary btn-full" onclick="navigate('#courses')">
          ${t('back_home')}
        </button>
      </div>
    </div>
  `;

  if (result.leveledUp || isPerfect) {
    setTimeout(() => {
      triggerConfetti();
      SoundManager.play('success');
    }, 300);
  }

  updateTopbar();
}

function quitLesson() {
  navigate('#courses');
}

function showXPPopup(text) {
  const popup = document.createElement('div');
  popup.className = 'xp-popup';
  popup.textContent = text;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1600);
}

function showOutOfHeartsModal() {
  const main = document.getElementById('app-main');
  main.innerHTML = `
    <div class="lesson-complete" style="text-align:center;">
      <div style="font-size: 4rem; margin-bottom: 20px;">💔</div>
      <h2 style="margin-bottom:10px;">Plus de Vies !</h2>
      <p style="color:var(--text-secondary); margin-bottom: 30px;">
        Vous n'avez plus de cœurs. Attendez qu'ils se rechargent ou achetez une recharge pour 100 Gemmes.
      </p>
      <button class="btn btn-primary btn-full btn-lg mb-10" onclick="buyHeartRefill()" style="margin-bottom:12px;">
        Recharger (100 💎)
      </button>
      <button class="btn btn-secondary btn-full btn-lg" onclick="quitLesson()">
        Quitter la leçon
      </button>
    </div>
  `;
}

function buyHeartRefill() {
  if (AppState.gems >= 100) {
    AppState.gems -= 100;
    AppState.hearts = AppState.maxHearts;
    AppState.lastHeartRefill = Date.now();
    saveState();
    updateTopbar();
    if (lessonState.lesson) {
      renderExercise(); // Resume where they left off
    } else {
      quitLesson();
    }
  } else {
    alert("Vous n'avez pas assez de gemmes !");
  }
}

function triggerConfetti() {
  const colors = ['#00e676', '#a855f7', '#fbbf24', '#3b82f6', '#ef4444', '#ec4899'];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}vw;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 0.8}s;
      animation-duration: ${1.5 + Math.random() * 1}s;
      width: ${6 + Math.random() * 6}px;
      height: ${6 + Math.random() * 6}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3000);
  }
}

// Register route
routes['#lesson'] = () => {
  if (!lessonState.lesson) navigate('#courses');
};

window.startLesson = startLesson;
window.checkAnswer = checkAnswer;
window.selectOption = selectOption;
window.submitFill = submitFill;
window.nextExercise = nextExercise;
window.quitLesson = quitLesson;
window.triggerConfetti = triggerConfetti;
window.showOutOfHeartsModal = showOutOfHeartsModal;
window.buyHeartRefill = buyHeartRefill;
window.showXPPopup = showXPPopup;
