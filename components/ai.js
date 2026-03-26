/**
 * CodeLingo — Lingo AI Tutor (v3 Universal)
 * Context-aware on ALL pages: Home, Courses, Lesson, Profile, Playground, Reference, Leaderboard
 */

// ── Context Detection ──────────────────────────────────────
function getCurrentPageContext() {
  const hash = window.location.hash || '#home';
  const contexts = {
    '#home':        { page: 'home',        label: 'Accueil / Parcours' },
    '#courses':     { page: 'courses',     label: 'Catalogue des Cours' },
    '#lesson':      { page: 'lesson',      label: 'Leçon en cours' },
    '#leaderboard': { page: 'leaderboard', label: 'Classement' },
    '#playground':  { page: 'playground',  label: 'Playground (Éditeur)' },
    '#reference':   { page: 'reference',   label: 'Référence W3Schools' },
    '#profile':     { page: 'profile',     label: 'Mon Profil' },
  };
  return contexts[hash] || { page: 'general', label: 'CodeLingo' };
}

function getContextualWelcome() {
  const ctx = getCurrentPageContext();
  const name = AppState.username ? `, ${AppState.username}` : '';
  const welcomes = {
    home:        `Salut${name} ! 👋 Prêt à continuer le parcours ? Clique sur "C'est parti" pour ta prochaine leçon, ou pose-moi n'importe quelle question sur le code !`,
    courses:     `Bonjour${name} ! 📚 Tu choisis un cours ? Je peux t'expliquer les différences entre Python, JavaScript et HTML/CSS pour t'aider à choisir !`,
    lesson:      `Allons-y${name} ! 🎯 Je suis là pour t'aider avec cet exercice. Si tu bloques, dis-moi ce qui ne va pas !`,
    leaderboard: `Salut${name} ! 🏆 Tu consultes le classement ? Pour gagner plus d'XP, complète des leçons sans erreur et maintiens ta série quotidienne !`,
    playground:  `Hello${name} ! 🧪 Tu codes dans le Playground ? Montre-moi ton code si tu veux que je le révise ou t'aide à déboguer !`,
    reference:   `Bonjour${name} ! 📖 Tu consultes la référence ? Pose-moi des questions sur n'importe quelle syntaxe ou concept, je t'explique avec des exemples !`,
    profile:     `Salut${name} ! 💪 Tu consultes ton profil. Tu as ${AppState.streakDays || 0} jours de série et ${AppState.totalXP || 0} XP. Continue comme ça !`,
    general:     `Bonjour${name} ! 🤖 Je suis Lingo, ton tuteur IA. Pose-moi n'importe quelle question sur Python, JavaScript, HTML/CSS, ou le fonctionnement de l'app !`,
  };
  return welcomes[ctx.page] || welcomes.general;
}

function getContextualSuggestions() {
  const ctx = getCurrentPageContext();
  const suggestions = {
    home:        ['Comment gagner plus d\'XP ?', 'Explique-moi les variables', 'Qu\'est-ce qu\'une boucle ?'],
    courses:     ['Différence Python vs JavaScript ?', 'Par quel cours commencer ?', 'C\'est quoi HTML ?'],
    lesson:      ['J\'ai une erreur', 'Explique l\'exercice', 'Comment fonctionne `print` ?'],
    leaderboard: ['Comment monter dans le classement ?', 'À quelle fréquence les XP se calculent-ils ?', 'C\'est quoi une série ?'],
    playground:  ['Comment déboguer mon code ?', 'Révise mon code', 'Qu\'est-ce que les fonctions ?'],
    reference:   ['Explique `for` en Python', 'Différence `let` et `const` ?', 'C\'est quoi une liste ?'],
    profile:     ['Comment gagner des badges ?', 'Comment recharger mes vies ?', 'À quoi servent les gemmes ?'],
    general:     ['Aide-moi avec Python', 'Explique JavaScript', 'Comment fonctionne CodeLingo ?'],
  };
  return suggestions[ctx.page] || suggestions.general;
}

// ── Knowledge Base (Universal) ────────────────────────────
const UNIVERSAL_KB = [
  // Salutations
  { keys: ['salut', 'bonjour', 'coucou', 'hello', 'hi'], resp: () => `Bonjour ! Comment puis-je t'aider aujourd'hui ? 😊 Je suis ton tuteur IA universel — pose-moi n'importe quelle question sur le code, la progression ou l'app CodeLingo !` },

  // Python — bases
  { keys: ['print', 'afficher', 'affiche'], resp: () => `En Python, \`print()\` affiche du texte dans la console.\n\n**Exemple :**\n\`print("Bonjour le monde !")\`\nAffiche : Bonjour le monde !` },
  { keys: ['variable', 'stocker', 'valeur'], resp: () => `Une **variable** est une boîte nommée qui stocke une valeur.\n\n**Python :** \`age = 25\`\n**JavaScript :** \`let age = 25;\`` },
  { keys: ['boucle', 'for', 'while', 'répéter', 'repeter'], resp: () => `Les **boucles** répètent un bloc de code.\n\n**for (Python) :**\n\`for i in range(5):\n    print(i)\`\n\n**while (Python) :**\n\`while x < 10:\n    x += 1\`` },
  { keys: ['liste', 'tableau', 'array'], resp: () => `Une **liste** (ou tableau) stocke plusieurs valeurs.\n\n**Python :** \`ma_liste = [1, 2, 3]\`\n**JavaScript :** \`let arr = [1, 2, 3];\`` },
  { keys: ['fonction', 'def', 'function'], resp: () => `Une **fonction** est un bloc de code réutilisable.\n\n**Python :**\n\`def saluer(nom):\n    print("Bonjour", nom)\`\n\n**JavaScript :**\n\`function saluer(nom) { console.log("Bonjour", nom); }\`` },
  { keys: ['if', 'else', 'elif', 'condition', 'sinon'], resp: () => `Les **conditions** contrôlent le flux du programme.\n\n**Python :**\n\`if score >= 10:\n    print("Bravo !")\nelse:\n    print("Réessaie")\`` },
  { keys: ['string', 'chaine', 'chaîne', 'texte'], resp: () => `Une **chaîne de caractères** (string) est du texte entre guillemets.\n\n**Python :** \`prenom = "Alice"\`\n**Longueur :** \`len(prenom)\` → 5` },
  { keys: ['int', 'float', 'nombre', 'entier'], resp: () => `**int** = entier (1, 2, 42), **float** = décimal (3.14).\n\n**Python :**\n\`age = 20      # int\ntaille = 1.75  # float\`` },
  { keys: ['import', 'module', 'bibliothèque'], resp: () => `**import** inclut des bibliothèques externes.\n\n**Python :**\n\`import math\nprint(math.sqrt(16))  # → 4.0\`\n\nLes modules populaires : \`math\`, \`random\`, \`os\`, \`json\`.` },
  { keys: ['class', 'objet', 'oop', 'programmation orientée'], resp: () => `La **POO** (Programmation Orientée Objet) organise le code en "classes".\n\n**Python :**\n\`class Chien:\n    def __init__(self, nom):\n        self.nom = nom\n    def aboyer(self):\n        print(self.nom, "fait Wouf !")\`` },

  // JavaScript
  { keys: ['javascript', 'js', 'console.log'], resp: () => `JavaScript est le langage du web !\n\n**Afficher :** \`console.log("Bonjour")\`\n**Variable :** \`let nom = "Alice"\` ou \`const AGE = 25\`\n**Différence avec Python :** JS utilise \`{}\` et \`;`, chaque instruction se termine par un \`;`.` },
  { keys: ['let', 'const', 'var', 'declaration'], resp: () => `En JavaScript, 3 façons de déclarer une variable :\n- \`var\` — ancienne façon (à éviter)\n- \`let\` — variable modifiable ✅\n- \`const\` — constante (ne change pas) ✅\n\n**Règle :** préfère \`const\` par défaut, \`let\` si tu dois modifier.` },
  { keys: ['dom', 'html', 'getelementbyid', 'queryselector'], resp: () => `Le **DOM** (Document Object Model) permet à JavaScript de modifier le HTML.\n\n\`const btn = document.getElementById("monBtn");\nbtn.addEventListener("click", () => {\n    document.body.style.background = "blue";\n});\`` },
  { keys: ['promise', 'async', 'await', 'fetch'], resp: () => `**async/await** simplifie le code asynchrone.\n\n\`async function getData() {\n    const res = await fetch("https://api.example.com");\n    const data = await res.json();\n    console.log(data);\n}\`` },

  // HTML / CSS
  { keys: ['html', 'balise', 'tag'], resp: () => `**HTML** structure le contenu avec des **balises**.\n\n\`<h1>Titre</h1>    ← Titre principal\n<p>Texte</p>       ← Paragraphe\n<button>Clic</button> ← Bouton\`\n\nChaque balise ouvrante \`<tag>\` doit avoir une fermante \`</tag>\`.` },
  { keys: ['css', 'style', 'couleur', 'police', 'mise en page'], resp: () => `**CSS** contrôle l'apparence.\n\n\`h1 {\n    color: #4CAF50;     /* Couleur verte */\n    font-size: 2rem;    /* Taille */\n    margin: 20px 0;     /* Espacement */\n}\`` },
  { keys: ['flexbox', 'grid', 'disposition', 'alignement'], resp: () => `**Flexbox** aligne des éléments en ligne ou colonne.\n\n\`.conteneur {\n    display: flex;\n    justify-content: center;  /* Axe horizontal */\n    align-items: center;      /* Axe vertical */\n    gap: 16px;\n}\`` },

  // Débogage
  { keys: ['erreur', 'bug', 'marche pas', 'problème', 'error', 'syntaxerror'], resp: () => `**Checklist de débogage :**\n1. Vérifie les parenthèses fermées \`()\`\n2. Vérifie l'**indentation** (espaces en Python)\n3. Les guillemets ouverts/fermés \`"\`\n4. Regarde le **message d'erreur** : il pointe la ligne exacte !\n5. Essaie d'afficher les variables avec \`print()\``},
  { keys: ['indentation', 'indent', 'espace', 'tabulation'], resp: () => `L'**indentation** en Python est OBLIGATOIRE. Elle définit les blocs.\n\n✅ Correct :\n\`if x > 0:\n    print("positif")\`\n\n❌ Erreur :\n\`if x > 0:\nprint("positif")  ← manque les espaces!\`` },

  // CodeLingo — Application
  { keys: ['xp', 'expérience', 'gagner', 'progresser'], resp: () => `Pour gagner plus d'**XP** dans CodeLingo :\n- Complète les leçons sans erreur (+10 à 20 XP)\n- Maintiens ta **série quotidienne** (bonus de streak)\n- Atteins l'objectif journalier dans les paramètres\n- Les leçons bonus donnent plus d'XP !` },
  { keys: ['vies', 'coeurs', 'cœurs', 'hearts'], resp: () => `Tu as **5 vies** (❤️). Tu en perds une à chaque mauvaise réponse.\n\nPour les récupérer :\n- Attends (régénération automatique par heure)\n- Utilise **10 💎 Gemmes** pour une recharge instantanée !` },
  { keys: ['gemme', 'diamant', 'diamants', '💎'], resp: () => `Les **gemmes** 💎 sont la monnaie premium de CodeLingo.\n\nUtilisation :\n- 💡 **Indice dans un quiz** = 10 gemmes\n- ❤️ **Recharger les vies** = 10 gemmes\n\nTu démarres avec 500 gemmes. Reste attentif aux futurs bonus !` },
  { keys: ['série', 'streak'], resp: () => `Ta **série** 🔥 compte le nombre de jours consécutifs où tu as pratiqué.\n\nPour la maintenir :\n- Complète au moins une leçon chaque jour\n- Tu recevras des rappels par notification 🔔\n\nPerdre sa série réinitialise le compteur à 0 !` },
  { keys: ['badge', 'médaille', 'trophée'], resp: () => `Les **badges** 🏅 récompensent tes accomplissements :\n- Première leçon terminée\n- Série de 7 jours\n- Score parfait\n- Premier cours complété\n\nConsulte ton **Profil** pour voir tes badges gagnés !` },
  { keys: ['pwa', 'installer', 'application', 'mobile'], resp: () => `CodeLingo est une **Progressive Web App (PWA)** !\n\nPour l'installer sur ton téléphone :\n**Android (Chrome) :** Clique sur "Installer" dans le menu de navigation\n**iPhone (Safari) :** Partager → "Sur l'écran d'accueil"\n\nUne fois installée, elle fonctionne même **hors ligne** ! 📱` },

  // Encouragement
  { keys: ['difficile', 'facile', 'comprends pas', 'comprend pas', 'nul', 'zéro'], resp: () => `Ne te décourage pas ! 💪 Tout le monde trouve ça difficile au début.\n\nMes conseils :\n1. Relis lentement, ligne par ligne\n2. Essaie le code dans le **Playground**\n3. Consulte la **Référence** pour des exemples\n4. Reviens plus tard avec un esprit frais\n\nTu es plus capable que tu ne le crois !` },
  { keys: ['merci', 'super', 'génial', 'parfait', 'cool'], resp: () => `Avec plaisir ! 🎉 Tu fais du super travail. Continue comme ça, la pratique régulière est la clé du succès en programmation !` },
];

// ── Core Functions ────────────────────────────────────────
function getChatHistory() {
  if (!AppState.aiChatHistory) AppState.aiChatHistory = [];
  return AppState.aiChatHistory;
}

function renderAIChat() {
  const chatContainer = document.getElementById('ai-chat-container');
  if (!chatContainer) return;

  const history = getChatHistory();
  const suggestions = getContextualSuggestions();
  const ctx = getCurrentPageContext();

  chatContainer.innerHTML = `
    <div class="ai-window-header">
      <div class="ai-header-info">
        <span class="ai-header-robot">🤖</span>
        <div>
          <div class="ai-header-name">Lingo AI</div>
          <div class="ai-header-status">● En ligne · ${ctx.label}</div>
        </div>
      </div>
      <button class="ai-close-btn" onclick="toggleAIChat()">✕</button>
    </div>
    
    <div class="ai-messages" id="ai-messages-list">
      ${history.length === 0 ? `
        <div class="ai-msg-row assistant">
          <div class="ai-bubble">${formatAIMessage(getContextualWelcome())}</div>
        </div>
      ` : history.map(msg => `
        <div class="ai-msg-row ${msg.role}">
          <div class="ai-bubble">${formatAIMessage(msg.isTranslated ? t(msg.text) : msg.text)}</div>
        </div>
      `).join('')}
      <div id="ai-typing" class="ai-msg-row assistant" style="display:none;">
        <div class="ai-bubble typing-dots"><span>.</span><span>.</span><span>.</span></div>
      </div>
    </div>

    <!-- Quick suggestions -->
    <div class="ai-suggestions" id="ai-suggestions">
      ${suggestions.map(s => `<button class="ai-suggestion-chip" onclick="quickAsk('${s.replace(/'/g, "\\'")}')">${s}</button>`).join('')}
    </div>

    <div class="ai-input-area">
      <input type="text" id="ai-user-input" placeholder="Pose une question..." onkeyup="handleAIKey(event)">
      <button class="ai-send-btn" onclick="sendAIMessage()">➔</button>
    </div>
  `;
  
  scrollToBottom();
}

function formatAIMessage(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\n/g, '<br>');
}

function quickAsk(question) {
  const input = document.getElementById('ai-user-input');
  if (input) {
    input.value = question;
    sendAIMessage();
  }
  // Hide suggestions after click
  const sugg = document.getElementById('ai-suggestions');
  if (sugg) sugg.style.display = 'none';
}

function handleAIKey(e) {
  if (e.key === 'Enter') sendAIMessage();
}

function sendAIMessage() {
  const input = document.getElementById('ai-user-input');
  const text = input?.value.trim();
  if (!text) return;

  const history = getChatHistory();
  history.push({ role: 'user', text });
  if (input) input.value = '';
  saveState();
  renderAIChat();

  const typing = document.getElementById('ai-typing');
  if (typing) typing.style.display = 'flex';
  scrollToBottom();

  // Simulate thinking time (more human-like)
  const delay = 800 + Math.random() * 800;
  setTimeout(() => {
    const response = getSmartResponse(text);
    history.push({ role: 'assistant', text: response });
    saveState();
    if (typing) typing.style.display = 'none';
    renderAIChat();
  }, delay);
}

function getSmartResponse(userText) {
  const query = userText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  for (const entry of UNIVERSAL_KB) {
    if (entry.keys.some(k => query.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
      return typeof entry.resp === 'function' ? entry.resp() : entry.resp;
    }
  }

  // Context-aware fallback
  const ctx = getCurrentPageContext();
  if (ctx.page === 'playground') {
    return `Je ne suis pas sûr de comprendre, mais dans le **Playground**, tu peux tester n'importe quel code directement ! Essaie d'écrire \`print("Bonjour")\` ou demande-moi d'expliquer une notion spécifique. 🧪`;
  }
  if (ctx.page === 'lesson') {
    return `Di moi ce qui te bloque exactement dans la leçon ! Tu peux me coller ta réponse ou m'expliquer ce que tu ne comprends pas. 🎯`;
  }
  return `C'est une super question ! Essaie d'utiliser des mots-clés comme **print**, **variable**, **boucle**, **liste**, **fonction** ou **erreur** pour que je t'aide mieux. Ou pose une question plus précise ! ✨`;
}

function toggleAIChat() {
  const container = document.getElementById('ai-chat-container');
  if (!container) return;
  const isHidden = container.style.display === 'none' || !container.style.display;
  if (isHidden) {
    container.style.display = 'flex';
    renderAIChat();
    setTimeout(() => document.getElementById('ai-user-input')?.focus(), 100);
    // Update context badge in header when opened
    renderAIChat();
  } else {
    container.style.display = 'none';
  }
}

function scrollToBottom() {
  const list = document.getElementById('ai-messages-list');
  if (list) setTimeout(() => { list.scrollTop = list.scrollHeight; }, 50);
}

// Called from lesson component with exercise context
function openAIHelp(context) {
  if (!context) return;
  const container = document.getElementById('ai-chat-container');
  if (container && (container.style.display === 'none' || !container.style.display)) {
    toggleAIChat();
  }

  const history = getChatHistory();
  const prompt = `Peux-tu m'aider avec cet exercice ?\n\n**Question :** ${context.question}${context.code ? `\n**Mon code :** \`${context.code}\`` : ''}`;
  history.push({ role: 'user', text: prompt });
  saveState();
  renderAIChat();

  const typing = document.getElementById('ai-typing');
  if (typing) typing.style.display = 'flex';
  scrollToBottom();

  setTimeout(() => {
    let response = `Bien sûr ! Voici ce que je peux te dire sur cet exercice.\n\n`;
    response += `**Type :** ${context.type === 'fill' ? 'Compléter la syntaxe' : 'Analyser la sortie'}\n\n`;
    response += `**Explication :** ${context.explanation}\n\n`;
    response += `Essaie de relire le code ligne par ligne et imagine ce qui se passe étape par étape. Tu peux le tester dans le **Playground** ! 💡`;
    
    history.push({ role: 'assistant', text: response });
    saveState();
    if (typing) typing.style.display = 'none';
    renderAIChat();
  }, 1000);
}

// Re-render AI header context if user navigates while chat is open
window.addEventListener('hashchange', () => {
  const container = document.getElementById('ai-chat-container');
  if (container && container.style.display === 'flex') {
    renderAIChat();
  }
});

window.toggleAIChat   = toggleAIChat;
window.sendAIMessage  = sendAIMessage;
window.handleAIKey    = handleAIKey;
window.openAIHelp     = openAIHelp;
window.quickAsk       = quickAsk;
