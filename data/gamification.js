// ============================================================
// CodeLingo — Gamification Data & Logic
// ============================================================

const LEVELS = [
  { level: 1,  name: 'Novice Coder',    minXP: 0,    maxXP: 50,   color: '#6b7280' },
  { level: 2,  name: 'Code Apprentice', minXP: 50,   maxXP: 120,  color: '#22c55e' },
  { level: 3,  name: 'Script Kiddie',   minXP: 120,  maxXP: 220,  color: '#22c55e' },
  { level: 4,  name: 'Junior Dev',      minXP: 220,  maxXP: 360,  color: '#3b82f6' },
  { level: 5,  name: 'Dev Padawan',     minXP: 360,  maxXP: 540,  color: '#3b82f6' },
  { level: 6,  name: 'Code Warrior',    minXP: 540,  maxXP: 770,  color: '#8b5cf6' },
  { level: 7,  name: 'Syntax Master',   minXP: 770,  maxXP: 1050, color: '#8b5cf6' },
  { level: 8,  name: 'Loop Legend',     minXP: 1050, maxXP: 1400, color: '#f59e0b' },
  { level: 9,  name: 'Function Guru',   minXP: 1400, maxXP: 1820, color: '#f59e0b' },
  { level: 10, name: 'Code Ninja',      minXP: 1820, maxXP: 9999, color: '#ef4444' },
];

const BADGES = [
  {
    id: 'first-lesson',
    name: 'First Steps',
    icon: '👣',
    description: 'Complete your first lesson',
    condition: (state) => state.lessonsCompleted >= 1,
    rarity: 'common'
  },
  {
    id: 'five-lessons',
    name: 'Getting Started',
    icon: '🌱',
    description: 'Complete 5 lessons',
    condition: (state) => state.lessonsCompleted >= 5,
    rarity: 'common'
  },
  {
    id: 'ten-lessons',
    name: 'On a Roll',
    icon: '🔥',
    description: 'Complete 10 lessons',
    condition: (state) => state.lessonsCompleted >= 10,
    rarity: 'uncommon'
  },
  {
    id: 'streak-3',
    name: 'Hat Trick',
    icon: '🎩',
    description: '3 day streak',
    condition: (state) => state.streakDays >= 3,
    rarity: 'uncommon'
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    icon: '⚔️',
    description: '7 day streak',
    condition: (state) => state.streakDays >= 7,
    rarity: 'rare'
  },
  {
    id: 'streak-30',
    name: 'Legendary Streak',
    icon: '🏆',
    description: '30 day streak',
    condition: (state) => state.streakDays >= 30,
    rarity: 'legendary'
  },
  {
    id: 'xp-100',
    name: 'Century',
    icon: '💯',
    description: 'Earn 100 XP',
    condition: (state) => state.totalXP >= 100,
    rarity: 'common'
  },
  {
    id: 'xp-500',
    name: 'XP Machine',
    icon: '⚡',
    description: 'Earn 500 XP',
    condition: (state) => state.totalXP >= 500,
    rarity: 'rare'
  },
  {
    id: 'python-start',
    name: 'Pythonista',
    icon: '🐍',
    description: 'Complete a Python lesson',
    condition: (state) => (state.completedLessons || []).some(id => id.startsWith('py-')),
    rarity: 'common'
  },
  {
    id: 'js-start',
    name: 'JS Jockey',
    icon: '🟨',
    description: 'Complete a JavaScript lesson',
    condition: (state) => (state.completedLessons || []).some(id => id.startsWith('js-')),
    rarity: 'common'
  },
  {
    id: 'html-start',
    name: 'Web Weaver',
    icon: '🕸️',
    description: 'Complete an HTML/CSS lesson',
    condition: (state) => (state.completedLessons || []).some(id => id.startsWith('hc-')),
    rarity: 'common'
  },
  {
    id: 'polyglot',
    name: 'Polyglot',
    icon: '🌐',
    description: 'Learn multiple technologies',
    condition: (state) => {
      const done = state.completedLessons || [];
      const hasPy = done.some(id => id.startsWith('py-'));
      const hasJs = done.some(id => id.startsWith('js-'));
      const hasHc = done.some(id => id.startsWith('hc-'));
      // Count how many tech types they started
      return [hasPy, hasJs, hasHc].filter(Boolean).length >= 2;
    },
    rarity: 'rare'
  },
  {
    id: 'perfect-lesson',
    name: 'Perfectionist',
    icon: '💎',
    description: 'Complete a lesson with no mistakes',
    condition: (state) => state.perfectLessons >= 1,
    rarity: 'uncommon'
  },
  {
    id: 'level-5',
    name: 'Rising Star',
    icon: '⭐',
    description: 'Reach level 5',
    condition: (state) => getLevel(state.totalXP).level >= 5,
    rarity: 'uncommon'
  },
  {
    id: 'level-10',
    name: 'Code Ninja',
    icon: '🥷',
    description: 'Reach level 10',
    condition: (state) => getLevel(state.totalXP).level >= 10,
    rarity: 'legendary'
  }
];

const DAILY_MESSAGES = [
  "You're on fire today! 🔥",
  "Amazing progress! Keep it up! 🚀",
  "One step closer to mastery! 💪",
  "Your future self thanks you! 🙏",
  "Every line of code counts! 💻",
  "You're becoming a coding legend! 🏆",
  "Consistency is the key to mastery! 🔑",
  "Knowledge is growing every day! 🌱"
];

const CORRECT_MESSAGES = [
  "🎉 Brilliant! Keep going!",
  "🔥 You're on fire!",
  "⚡ Correct! Amazing!",
  "💪 Nailed it!",
  "🌟 That's the spirit!",
  "🚀 Outstanding!",
  "💎 Perfect answer!",
  "🏆 You're crushing it!"
];

const WRONG_MESSAGES = [
  "💪 Keep trying, you've got this!",
  "🧠 Learning from mistakes is how pros grow!",
  "🔄 Close! Try again!",
  "📚 No worries — check the explanation!",
  "🌱 Every mistake makes you stronger!"
];

const LEADERBOARD_USERS = [
  { name: 'CodeMaster_99',   avatar: '🧙', xp: 2840, streak: 45, level: 10 },
  { name: 'PyQueen',         avatar: '👑', xp: 2591, streak: 32, level: 9  },
  { name: 'JSWizard',        avatar: '🧝', xp: 2203, streak: 28, level: 9  },
  { name: 'NightCoder',      avatar: '🦇', xp: 1987, streak: 21, level: 8  },
  { name: 'AlgoAlice',       avatar: '🤖', xp: 1756, streak: 19, level: 8  },
  { name: 'FullStackFrank',  avatar: '🦊', xp: 1523, streak: 15, level: 7  },
  { name: 'ReactRita',       avatar: '⚛️',  xp: 1301, streak: 12, level: 7  },
  { name: 'DebugDave',       avatar: '🐛', xp: 1089, streak: 9,  level: 6  },
  { name: 'CodeNewbie_X',    avatar: '🐣', xp: 872,  streak: 7,  level: 5  },
  { name: 'BitFlipBob',      avatar: '🔧', xp: 634,  streak: 5,  level: 4  },
];

function getLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

function getXPProgress(xp) {
  const lvl = getLevel(xp);
  const progress = ((xp - lvl.minXP) / (lvl.maxXP - lvl.minXP)) * 100;
  return Math.min(progress, 100);
}

function checkNewBadges(state) {
  const earned = state.earnedBadges || [];
  const newBadges = [];
  for (const badge of BADGES) {
    if (!earned.includes(badge.id) && badge.condition(state)) {
      newBadges.push(badge);
    }
  }
  return newBadges;
}

/**
 * Determines if a lesson is the "next" logical step for the user.
 * A lesson is available if it's already completed, OR if it's the 
 * first uncompleted lesson in its unit, OR if its predecessor is done.
 */
function isNextAvailable(course, lessonId, completedLessons) {
  if (!course || !lessonId) return false;
  const allLessons = course.units.flatMap(u => u.lessons);
  const idx = allLessons.findIndex(l => l.id === lessonId);
  if (idx === -1) return false;
  if (idx === 0) return true; // First lesson always available
  return completedLessons.includes(allLessons[idx - 1].id);
}

function getDailyMessage() {
  const idx = new Date().getDate() % DAILY_MESSAGES.length;
  return DAILY_MESSAGES[idx];
}

function getCorrectMessage() {
  return CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
}

function getWrongMessage() {
  return WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)];
}

window.LEVELS = LEVELS;
window.BADGES = BADGES;
window.LEADERBOARD_USERS = LEADERBOARD_USERS;
window.getLevel = getLevel;
window.getXPProgress = getXPProgress;
window.checkNewBadges = checkNewBadges;
window.isNextAvailable = isNextAvailable;
window.getDailyMessage = getDailyMessage;
window.getCorrectMessage = getCorrectMessage;
window.getWrongMessage = getWrongMessage;
