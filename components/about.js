// ============================================================
// CodeLingo — About Page Component
// ============================================================

function renderAbout() {
  document.getElementById('app-main').innerHTML = `
    <div class="about-page">

      <!-- Hero Section -->
      <div class="about-hero">
        <img src="assets/logo.png" alt="CodeLingo" class="about-logo" onerror="this.style.display='none'">
        <h1 class="about-title">CodeLingo</h1>
        <p class="about-subtitle">Apprendre à coder en s'amusant, étape par étape.</p>
        <div class="about-badges-row">
          <span class="about-badge green">🆓 Gratuit</span>
          <span class="about-badge blue">📱 PWA Mobile</span>
          <span class="about-badge purple">🎮 Gamifié</span>
          <span class="about-badge orange">🔒 Hors-ligne</span>
        </div>
      </div>

      <!-- Mission -->
      <div class="about-section card">
        <div class="about-section-icon">🎯</div>
        <h2 class="about-section-title">Notre Mission</h2>
        <p class="about-section-text">
          CodeLingo est né d'une conviction simple : <strong>tout le monde peut apprendre à coder</strong>
          dès lors qu'on lui offre la bonne méthode, au bon rythme.
          Inspiré de Duolingo et Mimo, CodeLingo rend la programmation accessible, 
          engageante et progressive — une leçon à la fois.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="about-features-grid">
        <div class="about-feature-card">
          <span class="about-feature-icon">🐍</span>
          <h3>Multi-langages</h3>
          <p>Python, JavaScript, HTML/CSS et SQL — tout en un seul endroit.</p>
        </div>
        <div class="about-feature-card">
          <span class="about-feature-icon">🏆</span>
          <h3>Gamification</h3>
          <p>XP, badges, séries de jours, classement — progresser devient addictif.</p>
        </div>
        <div class="about-feature-card">
          <span class="about-feature-icon">🤖</span>
          <h3>IA Intégrée</h3>
          <p>Lingo AI, ton tuteur intelligent, répond à n'importe quelle question de code.</p>
        </div>
        <div class="about-feature-card">
          <span class="about-feature-icon">📱</span>
          <h3>Mobile First</h3>
          <p>Application installable sur iOS et Android. Fonctionne hors-ligne.</p>
        </div>
        <div class="about-feature-card">
          <span class="about-feature-icon">🌐</span>
          <h3>Multilingue</h3>
          <p>Interface disponible en Français, Anglais, Espagnol, Allemand et Portugais.</p>
        </div>
        <div class="about-feature-card">
          <span class="about-feature-icon">🔓</span>
          <h3>Open & Gratuit</h3>
          <p>100% gratuit, sans publicité, sans données collectées.</p>
        </div>
      </div>

      <!-- Learning Path -->
      <div class="about-section card">
        <div class="about-section-icon">🗺️</div>
        <h2 class="about-section-title">Comment ça fonctionne ?</h2>
        <div class="about-steps">
          <div class="about-step">
            <div class="about-step-num">1</div>
            <div>
              <strong>Choisis un parcours</strong>
              <p>Python pour les débutants, JavaScript pour le web, SQL pour les données…</p>
            </div>
          </div>
          <div class="about-step">
            <div class="about-step-num">2</div>
            <div>
              <strong>Apprends par petites leçons</strong>
              <p>Chaque leçon prend 3 à 5 minutes. Théorie + exercices interactifs.</p>
            </div>
          </div>
          <div class="about-step">
            <div class="about-step-num">3</div>
            <div>
              <strong>Gagne de l'XP et des badges</strong>
              <p>Chaque bonne réponse t'apporte des points et fait progresser ton niveau.</p>
            </div>
          </div>
          <div class="about-step">
            <div class="about-step-num">4</div>
            <div>
              <strong>Pratique dans le Playground</strong>
              <p>Teste ton code, expérimente et construis tes propres mini-projets.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Creator -->
      <div class="about-creator card">
        <div class="about-creator-avatar">👨‍💻</div>
        <div>
          <div class="about-creator-name">Christ Emian</div>
          <div class="about-creator-role">Créateur & Développeur de CodeLingo</div>
          <p class="about-creator-bio">
            Passionné de programmation et d'éducation, j'ai créé CodeLingo pour rendre
            l'apprentissage du code accessible à tous — en particulier aux francophones qui
            trouvent que les ressources existantes sont souvent trop techniques ou en anglais.
          </p>
        </div>
      </div>

      <!-- Stats -->
      <div class="about-stats-row">
        <div class="about-stat">
          <div class="about-stat-val">4</div>
          <div class="about-stat-lab">Langages</div>
        </div>
        <div class="about-stat">
          <div class="about-stat-val">50+</div>
          <div class="about-stat-lab">Leçons</div>
        </div>
        <div class="about-stat">
          <div class="about-stat-val">15+</div>
          <div class="about-stat-lab">Badges</div>
        </div>
        <div class="about-stat">
          <div class="about-stat-val">∞</div>
          <div class="about-stat-lab">Curiosité</div>
        </div>
      </div>

      <!-- CTA -->
      <div class="about-cta">
        <button class="btn btn-primary btn-lg" onclick="navigate('#courses')">
          🚀 Commencer à apprendre
        </button>
        <button class="btn btn-secondary btn-sm" onclick="navigate('#home')">
          ← Retour à l'accueil
        </button>
      </div>

    </div>
  `;
}

window.renderAbout = renderAbout;
