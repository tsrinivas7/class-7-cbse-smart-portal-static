
// ── Tab switching ──────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + target)?.classList.add('active');
  });
});

// ── Subject accordion (index page) ─────────────────────────────────────────
document.querySelectorAll('.subject-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    btn.nextElementSibling.classList.toggle('hidden');
  });
  // Auto-expand first subject
  if (btn === document.querySelector('.subject-toggle')) {
    btn.click();
  }
});

// ── Chapter search ──────────────────────────────────────────────────────────
const searchBox = document.getElementById('chapterSearch');
if (searchBox) {
  searchBox.addEventListener('input', () => {
    const q = searchBox.value.toLowerCase();
    document.querySelectorAll('.chapter-link').forEach(link => {
      const match = link.textContent.toLowerCase().includes(q);
      link.style.display = match ? '' : 'none';
    });
    // Keep subject card visible if any child matches
    document.querySelectorAll('.subject-card').forEach(card => {
      const visibleLinks = [...card.querySelectorAll('.chapter-link')]
        .some(l => l.style.display !== 'none');
      card.style.display = (q && !visibleLinks) ? 'none' : '';
      if (q && visibleLinks) {
        const btn = card.querySelector('.subject-toggle');
        btn.setAttribute('aria-expanded', 'true');
        card.querySelector('.chapter-list').classList.remove('hidden');
      }
    });
  });
}

// ── Mobile sidebar toggle ───────────────────────────────────────────────────
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
if (sidebarToggle && sidebar) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
  });
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });
}

// ── MathJax (always load for LaTeX math) ─────────────────────────────────
window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\(', '\)']],
    displayMath: [['$$', '$$'], ['\[', '\]']],
    processEscapes: true,
  },
  svg: { fontCache: 'global' }
};
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
script.async = true;
document.head.appendChild(script);

// ── Print all tabs as PDF ──────────────────────────────────────────────────
function printAllTabs() {
  window.print();
}
