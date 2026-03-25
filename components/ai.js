/**
 * CodeLingo — Lingo AI Tutor Component (v2 - Smarter & Persistent)
 */

function getChatHistory() {
  if (!AppState.aiChatHistory || AppState.aiChatHistory.length === 0) {
    AppState.aiChatHistory = [
      { role: 'assistant', text: 'ai_welcome', time: new Date().toISOString(), isTranslated: true }
    ];
  }
  return AppState.aiChatHistory;
}

function renderAIChat() {
  const chatContainer = document.getElementById('ai-chat-container');
  if (!chatContainer) return;

  const history = getChatHistory();

  chatContainer.innerHTML = `
    <div class="ai-window-header">
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:1.5rem;">🤖</span>
        <div>
          <div style="font-weight:900; font-size:0.9rem; line-height:1;">Lingo AI</div>
          <div style="font-size:0.65rem; color:var(--accent-green); font-weight:700;">● En ligne</div>
        </div>
      </div>
      <button class="ai-close-btn" onclick="toggleAIChat()">✕</button>
    </div>
    
    <div class="ai-messages" id="ai-messages-list">
      ${history.map(msg => `
        <div class="ai-msg-row ${msg.role}">
          <div class="ai-bubble">${formatAIMessage(msg.isTranslated ? t(msg.text) : msg.text)}</div>
        </div>
      `).join('')}
      <div id="ai-typing" class="ai-msg-row assistant" style="display:none;">
        <div class="ai-bubble typing-dots"><span>.</span><span>.</span><span>.</span></div>
      </div>
    </div>

    <div class="ai-input-area">
      <input type="text" id="ai-user-input" placeholder="${t('ai_input_placeholder', 'Pose une question...')}" onkeyup="handleAIKey(event)">
      <button class="ai-send-btn" onclick="sendAIMessage()">➔</button>
    </div>
  `;
  
  scrollToBottom();
}

function formatAIMessage(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
             .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
             .replace(/\n/g, '<br>');
}

function handleAIKey(e) {
  if (e.key === 'Enter') sendAIMessage();
}

function sendAIMessage() {
  const input = document.getElementById('ai-user-input');
  const text = input.value.trim();
  if (!text) return;

  const history = getChatHistory();
  history.push({ role: 'user', text });
  input.value = '';
  saveState();
  renderAIChat();

  // Show typing animation
  const typing = document.getElementById('ai-typing');
  if (typing) typing.style.display = 'flex';
  scrollToBottom();

  setTimeout(() => {
    const response = getSmartResponse(text);
    history.push({ role: 'assistant', text: response });
    saveState();
    if (typing) typing.style.display = 'none';
    renderAIChat();
  }, 1200);
}

function getSmartResponse(userText) {
  const query = userText.toLowerCase();
  
  // Knowledge Base
  const kb = [
    { keys: ['print', 'afficher'], resp: "En Python, `print()` sert à afficher du texte. N'oublie pas les parenthèses ! Exemple : `print(\"Bonjour\")`." },
    { keys: ['variable', 'stocker'], resp: "Une **variable** est comme une boîte qui stocke une valeur. En Python, on écrit `nom_variable = valeur`." },
    { keys: ['boucle', 'for', 'while'], resp: "Les **boucles** (`for` et `while`) permettent de répéter du code. `for i in range(5):` répétera 5 fois." },
    { keys: ['liste', 'tableau', 'array'], resp: "Une **liste** permet de stocker plusieurs éléments. On utilise des crochets : `ma_liste = [1, 2, 3]`." },
    { keys: ['fonction', 'def'], resp: "Une **fonction** est un bloc de code réutilisable. On la définit avec `def ma_fonction():`." },
    { keys: ['if', 'else', 'condition'], resp: "Les **conditions** permettent de prendre des décisions. `if x > 10:` s'exécutera si x est supérieur à 10." },
    { keys: ['javascript', 'js'], resp: "JavaScript est le langage du web ! Contrairement à Python, il utilise souvent des accolades `{}` et des `;`." },
    { keys: ['html', 'css'], resp: "HTML structure le contenu, et CSS s'occupe du style (couleurs, polices, mises en page)." },
    { keys: ['erreur', 'marche pas', 'bug'], resp: "Ne panique pas ! Vérifie l'indentation (les espaces) et assure-toi d'avoir fermé toutes les parenthèses `()`." },
    { keys: ['salut', 'bonjour', 'coucou'], resp: "Bonjour ! Comment puis-je t'aider dans ton apprentissage aujourd'hui ? 🚀" },
    { keys: ['merci', 'thanks'], resp: "Avec plaisir ! Continue comme ça, tu progresses vite ! 💪" }
  ];

  for (const entry of kb) {
    if (entry.keys.some(k => query.includes(k))) return entry.resp;
  }
  
  return "C'est une question intéressante ! Pour t'aider au mieux, essaie de me donner plus de détails ou regarde l'exercice en cours. La pratique est la clé ! ✨";
}

function toggleAIChat() {
  const container = document.getElementById('ai-chat-container');
  if (!container) return;
  const isHidden = container.style.display === 'none' || !container.style.display;
  container.style.display = isHidden ? 'flex' : 'none';
  if (isHidden) {
      setTimeout(() => document.getElementById('ai-user-input')?.focus(), 100);
      renderAIChat();
  }
}

function scrollToBottom() {
  const list = document.getElementById('ai-messages-list');
  if (list) list.scrollTop = list.scrollHeight;
}

function openAIHelp(context) {
  if (!context) return;
  const container = document.getElementById('ai-chat-container');
  if (container && container.style.display === 'none') {
    toggleAIChat();
  }

  const history = getChatHistory();
  const prompt = `Peux-tu m'expliquer cet exercice ? \n\n**Question :** ${context.question}\n${context.code ? `**Code :** \`${context.code}\`` : ''}`;
  history.push({ role: 'user', text: prompt });
  saveState();
  renderAIChat();

  const typing = document.getElementById('ai-typing');
  if (typing) typing.style.display = 'flex';
  scrollToBottom();

  setTimeout(() => {
    let response = `Bien sûr ! Cet exercice porte sur **${context.type === 'fill' ? 'la syntaxe' : 'la logique de sortie'}**.\n\n`;
    response += `**L'explication :** ${context.explanation}\n\n`;
    response += `Astuce : Essaie de visualiser le chemin du code étape par étape ! 💡`;
    
    history.push({ role: 'assistant', text: response });
    saveState();
    if (typing) typing.style.display = 'none';
    renderAIChat();
  }, 1000);
}

window.toggleAIChat = toggleAIChat;
window.sendAIMessage = sendAIMessage;
window.handleAIKey = handleAIKey;
window.openAIHelp = openAIHelp;
