// ============================================================
// CodeLingo — Auth Component (Login / Signup)
// ============================================================

function renderAuth() {
  document.getElementById('app-topbar').style.display = 'none';
  document.getElementById('app-nav').style.display = 'none';
  document.getElementById('app-main').style.paddingBottom = '0'; // Remove nav padding

  document.getElementById('app-main').innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;padding:20px;">
      
      <div style="text-align:center;margin-bottom:30px;">
        <img src="assets/logo.png" alt="CodeLingo" style="width:280px;max-width:90%;height:auto;animation:float 3s infinite ease-in-out;">
      </div>

      <div class="card" style="width:100%;max-width:360px;">
        <h2 style="font-size:1.4rem;font-weight:700;margin-bottom:24px;text-align:center;">${t('auth_login_title')}</h2>
        
        <form id="auth-form" onsubmit="handleAuthSubmit(event)">
          <div style="margin-bottom:16px;">
            <label style="display:block;font-size:0.85rem;color:var(--text-secondary);margin-bottom:6px;font-weight:600;">${t('auth_username')}</label>
            <input type="text" id="auth-username" class="fill-input" required placeholder="CodeLearner" maxlength="20" style="width:100%;">
          </div>
          
          <div style="margin-bottom:24px;">
            <label style="display:block;font-size:0.85rem;color:var(--text-secondary);margin-bottom:6px;font-weight:600;">${t('auth_password')}</label>
            <input type="password" id="auth-password" class="fill-input" required placeholder="••••••••" style="width:100%;">
          </div>
          
          <button type="submit" class="btn btn-primary btn-full">${t('auth_btn')} →</button>
        </form>
      </div>
      
    </div>
    <style>
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }
    </style>
  `;
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const username = document.getElementById('auth-username').value.trim();
  
  // Expert Validation: Alphanumeric and underscores only, 3-20 chars
  const nameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!nameRegex.test(username)) {
    alert('Invalid username. Use 3-20 alphanumeric characters or underscores.');
    return;
  }
  
  if (username) {
    AppState.username = username;
    AppState.isLoggedIn = true;
    saveState();
    
    // Restore nav visibility
    document.getElementById('app-topbar').style.display = 'flex';
    document.getElementById('app-nav').style.display = 'flex';
    document.getElementById('app-main').style.paddingBottom = 'calc(var(--nav-height) + 20px)';
    
    navigate('#home');
  }
}

window.renderAuth = renderAuth;
window.handleAuthSubmit = handleAuthSubmit;
