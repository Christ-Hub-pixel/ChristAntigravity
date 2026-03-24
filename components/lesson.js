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

  const main = document.getElementById('app-main');
  main.innerHTML = `
    <!-- Top Bar -->
    <div class="exercise-topbar">
      <div class="exercise-close" onclick="quitLesson()">✕</div>
      <div class="exercise-progress-wrap">
        <div class="exercise-progress-label">${exerciseIdx + 1} ${t('of_label')} ${total}</div>
        <div class="progress-bar-track" style="height:8px;">
          <div class="progress-bar-fill" id="ex-progress" style="width:${progress}%;transition:width 0.5s ease;"></div>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <div class="exercise-xp-badge" style="color:#ef4444;border-color:rgba(239,68,68,0.3);background:rgba(239,68,68,0.1)">❤️ <span id="lesson-hearts">${AppState.hearts}</span></div>
        <div class="exercise-xp-badge">⚡ ${lesson.xpReward} XP</div>
      </div>
    </div>

    <!-- Question Card -->
    <div class="question-card">
      ${typeBadge}
      <div class="question-text">${escHtml(exercise.question)}</div>
      ${exercise.code ? renderCodeBlock(exercise.code, exercise.type) : ''}
    </div>

    <!-- Answer Area -->
    <div id="answer-area">
      ${exerciseHTML}
    </div>

    <!-- Feedback panel (hidden initially) -->
    <div id="feedback-area"></div>

    <!-- Next Button -->
    <div class="next-btn-wrap" id="next-wrap" style="display:none;">
      <button class="btn btn-primary btn-full btn-lg" onclick="nextExercise()">
        ${exerciseIdx + 1 < total ? t('continue_btn') : t('finish_btn')}
      </button>
    </div>
  `;

  if (exercise.type === 'fill') {
    const input = document.getElementById('fill-answer');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitFill();
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
    return `<div class="code-snippet">${highlighted}</div>`;
  }
  return `<div class="code-snippet">${highlightCode(code)}</div>`;
}

function highlightCode(code) {
  // Basic syntax highlighting
  return escHtml(code)
    .replace(/\b(def|return|for|in|if|else|elif|while|import|from|class|print|True|False|None|and|or|not|const|let|var|function|async|await|new|this|typeof|console|document)\b/g,
      '<span class="code-keyword">$1</span>')
    .replace(/"([^"]*)"|'([^']*)'/g, (m) => `<span class="code-string">${m}</span>`)
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="code-number">$1</span>')
    .replace(/(#[^\n]*)/g, '<span class="code-comment">$1</span>')
    .replace(/\/\/[^\n]*/g, (m) => `<span class="code-comment">${m}</span>`);
}

function renderMCQ(exercise) {
  const letters = ['A', 'B', 'C', 'D'];
  return `
    <div class="options-grid">
      ${exercise.options.map((opt, i) => `
        <button class="option-btn" id="opt-${i}" onclick="selectOption(${i})">
          <span class="option-letter">${letters[i]}</span>
          <span>${escHtml(opt)}</span>
        </button>
      `).join('')}
    </div>
  `;
}

function renderFill(exercise) {
  return `
    <div class="fill-input-wrap">
      <input type="text" class="fill-input" id="fill-answer" 
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
  lessonState.answered = true;
  lessonState.selectedOption = idx;

  const exercise = lessonState.lesson.exercises[lessonState.exerciseIdx];
  const isCorrect = idx === exercise.correct;

  // Disable all options
  document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);

  // Mark correct and wrong
  const selectedBtn = document.getElementById(`opt-${idx}`);
  const correctBtn = document.getElementById(`opt-${exercise.correct}`);
  selectedBtn?.classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect) correctBtn?.classList.add('correct');

  if (!isCorrect) {
    lessonState.mistakes++;
    if (AppState.hearts > 0) {
      AppState.hearts--;
      saveState();
      updateTopbar();
      const lh = document.getElementById('lesson-hearts');
      if (lh) lh.textContent = AppState.hearts;
    }
    SoundManager.play('wrong');
  } else {
    SoundManager.play('correct');
  }

  showFeedback(isCorrect, exercise.explanation);
  if (isCorrect) showXPPopup(t('xp_popup', {xp: 2}));
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

  // Hide submit button
  const submitBtns = document.querySelectorAll('#answer-area .btn');
  submitBtns.forEach(b => b.style.display = 'none');

  if (!isCorrect) {
    lessonState.mistakes++;
    if (AppState.hearts > 0) {
      AppState.hearts--;
      saveState();
      updateTopbar();
      const lh = document.getElementById('lesson-hearts');
      if (lh) lh.textContent = AppState.hearts;
    }
    SoundManager.play('wrong');
  } else {
    SoundManager.play('correct');
  }

  showFeedback(isCorrect, exercise.explanation, isCorrect ? null : `${t('correct_answer')} <strong>${exercise.answer}</strong>`);
  if (isCorrect) showXPPopup(t('xp_popup', {xp: 2}));
}

function showFeedback(isCorrect, explanation, extra = null) {
  const { lesson, exerciseIdx } = lessonState;
  const ex = lesson.exercises[exerciseIdx];
  const isLast = exerciseIdx + 1 >= lesson.exercises.length;

  // Character reactions
  const correctReactions = ['🥳', '✨', '🔥', '🎯', '🙌', '🚀'];
  const wrongReactions   = ['🤔', '😅', '💡', '⚠️', '👀', '🥊'];
  const react = isCorrect ? correctReactions[Math.floor(Math.random() * correctReactions.length)] :
                           wrongReactions[Math.floor(Math.random() * wrongReactions.length)];

  const isOutOfHearts = AppState.hearts <= 0;

  document.getElementById('feedback-area').innerHTML = `
    <div class="feedback-sheet ${isCorrect ? 'correct' : 'wrong'}">
      <div class="feedback-sheet-content">
        <div class="feedback-char">${react}</div>
        <div class="feedback-text">
          <div class="feedback-title">${isCorrect ? t('correct_label') : t('wrong_label')}</div>
          <div class="feedback-desc">${extra ? extra + '<br>' : ''}${escHtml(explanation)}</div>
        </div>
      </div>
      <button class="btn btn-primary btn-full shadow-none" onclick="${isOutOfHearts ? 'showOutOfHeartsModal()' : 'nextExercise()'}">
        ${isOutOfHearts ? '💔 Plus de vies' : isLast ? t('finish_btn') : t('continue_btn')}
      </button>
    </div>
  `;

  // Ensure the next-wrap is hidden as the feedback sheet now contains the button
  const nextWrap = document.getElementById('next-wrap');
  if (nextWrap) nextWrap.style.display = 'none';
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

function showLessonComplete() {
  const { courseId, lessonId, lesson, mistakes } = lessonState;
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
window.selectOption = selectOption;
window.submitFill = submitFill;
window.nextExercise = nextExercise;
window.quitLesson = quitLesson;
window.triggerConfetti = triggerConfetti;
window.showOutOfHeartsModal = showOutOfHeartsModal;
window.buyHeartRefill = buyHeartRefill;
