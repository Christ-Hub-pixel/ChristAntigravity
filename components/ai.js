/**
 * CodeLingo — Lingo AI Tutor Component
 * 
 * Provides a gamified AI chat interface for coding help.
 * In a real-world app, this would connect to an LLM API (Gemini/OpenAI).
 * For this demo, it uses a powerful rule-based "Smart Assistant" logic.
 */

const AI_MESSAGES = [
  { role: 'assistant', text: "Salut ! Je suis **Lingo AI**, ton tuteur personnel. Pose-moi n'importe quelle question sur le code !" }
];

function renderAIChat() {
  const chatContainer = document.getElementById('ai-chat-container');
  if (!chatContainer) return;

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
      ${AI_MESSAGES.map(msg => `
        <div class="ai-msg-row ${msg.role}">
          <div class="ai-bubble">${formatAIMessage(msg.text)}</div>
        </div>
      `).join('')}
    </div>

    <div class="ai-input-area">
      <input type="text" id="ai-user-input" placeholder="Pose une question..." onkeyup="handleAIKey(event)">
      <button class="ai-send-btn" onclick="sendAIMessage()">➔</button>
    </div>
  `;
  
  scrollToBottom();
}

function formatAIMessage(text) {
  // Simple markdown-ish bolding
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
             .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>');
}

function handleAIKey(e) {
  if (e.key === 'Enter') sendAIMessage();
}

function sendAIMessage() {
  const input = document.getElementById('ai-user-input');
  const text = input.value.trim();
  if (!text) return;

  AI_MESSAGES.push({ role: 'user', text });
  input.value = '';
  renderAIChat();

  // Simulate AI thinking
  setTimeout(() => {
    const response = getSmartResponse(text);
    AI_MESSAGES.push({ role: 'assistant', text: response });
    renderAIChat();
  }, 1000);
}

function getSmartResponse(userText) {
  const query = userText.toLowerCase();
  
  if (query.includes('print')) {
    return "En Python, `print()` sert à afficher du texte. N'oublie pas les parenthèses ! Exemple : `print(\"Bonjour\")`.";
  }
  if (query.includes('variable')) {
    return "Une **variable** est comme une boîte qui stocke une valeur. En Python, on écrit `nom = valeur`.";
  }
  if (query.includes('erreur') || query.includes('aide')) {
    return "Ne t'inquiète pas, les erreurs font partie de l'apprentissage ! Vérifie bien la ponctuation comme les `:` ou les `\"`.";
  }
  if (query.includes('salut') || query.includes('bonjour')) {
    return "Bonjour ! Prêt à progresser en code aujourd'hui ? 🚀";
  }
  
  return "C'est une excellente question ! Dans cette leçon, nous apprenons les bases. Essaie de pratiquer avec les exercices pour voir comment ça fonctionne en temps réel !";
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
  
  // Open the window if closed
  const container = document.getElementById('ai-chat-container');
  if (container && container.style.display === 'none') {
    toggleAIChat();
  }

  const prompt = `Peux-tu m'expliquer cet exercice ? \n\n**Question :** ${context.question}\n${context.code ? `**Code :** \`${context.code}\`` : ''}`;
  AI_MESSAGES.push({ role: 'user', text: prompt });
  renderAIChat();

  // Smart response based on context
  setTimeout(() => {
    let response = `Bien sûr ! Dans cet exercice, on te demande de comprendre comment fonctionne **${context.type === 'fill' ? 'la syntaxe' : 'la sortie'}** du code.\n\n`;
    response += `L'explication clé est : ${context.explanation}\n\n`;
    response += `Est-ce que tu veux que je te donne un autre exemple similaire pour t'entraîner ?`;
    
    AI_MESSAGES.push({ role: 'assistant', text: response });
    renderAIChat();
  }, 800);
}

window.toggleAIChat = toggleAIChat;
window.sendAIMessage = sendAIMessage;
window.handleAIKey = handleAIKey;
window.openAIHelp = openAIHelp;
