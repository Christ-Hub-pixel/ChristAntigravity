// ============================================================
// CodeLingo — Reference Handbook Component
// ============================================================

function renderReference(courseId = 'python') {
  const data = REFERENCE_DATA[courseId];
  if (!data) return navigate('#home');

  const main = document.getElementById('app-main');
  main.innerHTML = `
    <div class="ref-header">
      <div class="ref-tabs">
        <button class="ref-tab ${courseId === 'python' ? 'active' : ''}" onclick="renderReference('python')">🐍 Python</button>
        <button class="ref-tab ${courseId === 'javascript' ? 'active' : ''}" onclick="renderReference('javascript')">🟨 JavaScript</button>
      </div>
      <div class="ref-search-wrap">
        <input type="text" class="ref-search" placeholder="Rechercher une fonction..." oninput="filterReference(this.value)">
      </div>
    </div>
    <div class="ref-container">
      <div class="ref-sidebar">
        <div class="ref-nav" id="ref-nav-list">
          ${renderRefNav(data)}
        </div>
      </div>
      
      <div class="ref-content" id="ref-content-area">
        ${data.categories[0] && data.categories[0].items[0] ? renderRefItem(data.categories[0].items[0]) : '<div class="ref-empty">Sélectionnez un élément</div>'}
      </div>
    </div>
  `;
}

function renderRefNav(data) {
  let html = '';
  data.categories.forEach(cat => {
    html += `<div class="ref-cat-title">${cat.name}</div>`;
    cat.items.forEach(item => {
      html += `
        <div class="ref-nav-item" onclick="showRefItem('${item.id}', this)">
          ${item.name}
        </div>
      `;
    });
  });
  return html;
}

function showRefItem(id, el) {
  // Update active state in nav
  document.querySelectorAll('.ref-nav-item').forEach(item => item.classList.remove('active'));
  if (el) el.classList.add('active');

  // Find item
  let found = null;
  Object.values(REFERENCE_DATA).forEach(course => {
    course.categories.forEach(cat => {
      cat.items.forEach(item => {
        if (item.id === id) found = item;
      });
    });
  });

  if (found) {
    document.getElementById('ref-content-area').innerHTML = renderRefItem(found);
    document.getElementById('ref-content-area').scrollTop = 0;
  }
}

function renderRefItem(item) {
  // Determine language based on item ID prefix (py- or js-)
  const lang = item.id.startsWith('py') ? 'python' : 'javascript';
  
  return `
    <div class="ref-item-card">
      <h1 class="ref-item-title">${item.name}</h1>
      <p class="ref-item-desc">${item.desc}</p>
      
      <div class="ref-snippet-box">
        <div class="ref-snippet-header">Syntaxe</div>
        <div class="ref-code">${item.syntax}</div>
      </div>

      <div class="ref-snippet-box">
        <div class="ref-snippet-header">Exemple</div>
        <div class="ref-code">${item.example}</div>
      </div>

      <button class="ref-try-btn" onclick="openSandboxWithCode('${btoa(item.tryIt)}', '${lang}')">
        <span>🧪</span> ESSAYER SOI-MÊME
      </button>
    </div>
  `;
}

function openSandboxWithCode(base64Code, lang) {
  const code = atob(base64Code);
  renderSandbox(code, lang);
}

function filterReference(query) {
  const items = document.querySelectorAll('.ref-nav-item');
  const q = query.toLowerCase();
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(q) ? 'block' : 'none';
  });
}

window.renderReference = renderReference;
window.showRefItem = showRefItem;
window.openSandboxWithCode = openSandboxWithCode;
window.filterReference = filterReference;
