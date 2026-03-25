// ============================================================
// CodeLingo — Sandbox Component (Try it Yourself)
// ============================================================

let currentSandboxLang = 'javascript';

function renderSandbox(initialCode = '', lang = 'javascript') {
  currentSandboxLang = lang;
  
  const main = document.getElementById('app-main');
  main.innerHTML = `
    <div class="sandbox-container">
      <div class="sandbox-header">
        <div class="sandbox-title-wrap">
          <span class="sandbox-lang-icon">${lang === 'python' ? '🐍' : '🟨'}</span>
          <h2>Code Playground — ${lang.toUpperCase()}</h2>
        </div>
        <div class="sandbox-actions">
          <button class="sandbox-btn sandbox-run-btn" onclick="runSandboxCode()">
             <span>▶</span> EXÉCUTER
          </button>
          <button class="sandbox-close-btn" onclick="navigate('#home')">✕</button>
        </div>
      </div>

      <div class="sandbox-split">
        <div class="sandbox-editor-side">
          <div class="editor-header">ÉDITEUR</div>
          <textarea id="sandbox-editor" spellcheck="false" 
                    oninput="updateSandboxLineNumbers()">${initialCode}</textarea>
          <div id="sandbox-line-numbers">1</div>
        </div>
        
        <div class="sandbox-console-side">
          <div class="console-header">SORTIE</div>
          <div id="sandbox-output" class="console-content">
            <span class="console-placeholder">// Le résultat s'affichera ici...</span>
          </div>
          <div id="sandbox-canvas-container" style="display: none;"></div>
        </div>
      </div>
    </div>
  `;
  
  updateSandboxLineNumbers();
}

function updateSandboxLineNumbers() {
  const textarea = document.getElementById('sandbox-editor');
  const lineNumbers = document.getElementById('sandbox-line-numbers');
  const lines = textarea.value.split('\n').length;
  lineNumbers.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('<br>');
}

async function runSandboxCode() {
  const code = document.getElementById('sandbox-editor').value;
  const output = document.getElementById('sandbox-output');
  output.innerHTML = '';
  output.style.color = 'inherit';

  const logToOutput = (msg, color = null) => {
    const div = document.createElement('div');
    div.className = 'console-log-line';
    div.textContent = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2);
    if (color) div.style.color = color;
    output.appendChild(div);
  };

  if (currentSandboxLang === 'javascript') {
    try {
      const originalLog = console.log;
      console.log = (...args) => {
        args.forEach(arg => logToOutput(arg));
      };
      
      const session = new Function(code);
      session();
      
      console.log = originalLog;
    } catch (err) {
      logToOutput('❌ ERREUR JS: ' + err.message, '#ef4444');
    }
  } else if (currentSandboxLang === 'python') {
    if (typeof Sk === 'undefined') {
      logToOutput('Chargement de Python...', '#f59e0b');
      // Dynamic load fallback if not in head (though we should put it in index.html)
      await loadSkulpt();
    }
    
    Sk.configure({
      output: (text) => logToOutput(text.trimEnd()),
      read: (x) => {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
          throw "File not found: '" + x + "'";
        return Sk.builtinFiles["files"][x];
      }
    });

    try {
      await Sk.misceval.asyncToPromise(() => 
        Sk.importMainWithBody("<stdin>", false, code, true)
      );
    } catch (err) {
      logToOutput('❌ ERREUR PYTHON: ' + err.toString(), '#ef4444');
    }
  }
}

function loadSkulpt() {
  return new Promise((resolve) => {
    const s1 = document.createElement('script');
    s1.src = "https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js";
    const s2 = document.createElement('script');
    s2.src = "https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js";
    document.head.appendChild(s1);
    document.head.appendChild(s2);
    s2.onload = resolve;
  });
}

window.renderSandbox = renderSandbox;
window.runSandboxCode = runSandboxCode;
window.updateSandboxLineNumbers = updateSandboxLineNumbers;
