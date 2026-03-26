// ============================================================
// CodeLingo — Interactive Tutorial Component
// ============================================================

const TUTORIAL_STEPS = [
  {
    target: '.logo',
    title: 'Bienvenue sur CodeLingo ! 🚀',
    message: 'Apprends à coder gratuitement avec des exercices rapides et amusants.',
    pos: 'bottom'
  },
  {
    target: '.path-unit-header',
    title: 'Ton Parcours d\'Apprentissage',
    message: 'Chaque bloc représente une étape. Complète les leçons pour débloquer la suite !',
    pos: 'bottom'
  },
  {
    target: '.topbar-stats',
    title: 'Suis tes progrès',
    message: 'Gagne de l\'XP (⚡), garde ta série (🔥) et collecte des gemmes (💎). Ne perds pas tes vies (❤️) !',
    pos: 'bottom'
  },
  {
    target: '.ai-fab',
    title: 'Ton Tuteur IA 🤖',
    message: 'Bloqué sur un exercice ? Demande de l\'aide à ton tuteur personnel à tout moment.',
    pos: 'left'
  }
];

let currentTutorialStep = 0;

function startTutorial() {
  currentTutorialStep = 0;
  showTutorialStep();
}

function showTutorialStep() {
  const step = TUTORIAL_STEPS[currentTutorialStep];
  if (!step) { finishTutorial(); return; }

  const targetEl = document.querySelector(step.target);
  if (!targetEl) { nextTutorialStep(); return; }

  // Create overlay if not exists
  let overlay = document.getElementById('tutorial-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'tutorial-overlay';
    overlay.className = 'tutorial-overlay';
    document.body.appendChild(overlay);
  }

  // Position highlighting
  const rect = targetEl.getBoundingClientRect();
  overlay.innerHTML = `
    <div class="tutorial-highlight" style="top:${rect.top}px; left:${rect.left}px; width:${rect.width}px; height:${rect.height}px;"></div>
    <div class="tutorial-card ${step.pos}" style="top:${calculateCardTop(rect, step.pos)}px; left:${calculateCardLeft(rect, step.pos)}px;">
      <div class="tutorial-header">
        <span class="tutorial-title">${step.title}</span>
        <span class="tutorial-step">${currentTutorialStep + 1}/${TUTORIAL_STEPS.length}</span>
      </div>
      <div class="tutorial-body">${step.message}</div>
      <div class="tutorial-footer">
        <button class="tutorial-skip" onclick="finishTutorial()">Passer</button>
        <button class="tutorial-next" onclick="nextTutorialStep()">${currentTutorialStep === TUTORIAL_STEPS.length - 1 ? 'Terminer' : 'Suivant'}</button>
      </div>
    </div>
  `;
}

function calculateCardTop(rect, pos) {
  if (pos === 'bottom') return rect.bottom + 15;
  if (pos === 'top') return rect.top - 180;
  return rect.top;
}

function calculateCardLeft(rect, pos) {
  if (pos === 'left') return rect.left - 290;
  return Math.max(10, Math.min(window.innerWidth - 300, rect.left + rect.width/2 - 140));
}

function nextTutorialStep() {
  currentTutorialStep++;
  showTutorialStep();
}

function finishTutorial() {
  const overlay = document.getElementById('tutorial-overlay');
  if (overlay) overlay.remove();
  AppState.tutorialDone = true;
  saveState();
}

window.startTutorial = startTutorial;
