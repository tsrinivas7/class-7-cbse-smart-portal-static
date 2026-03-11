
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

// ── MathJax (lazy-load for Maths chapters) ─────────────────────────────────
if (document.querySelector('.markdown-body') &&
    document.querySelector('.markdown-body').textContent.includes('$')) {
  window.MathJax = {
    tex: { inlineMath: [['$','$'],['\\(','\\)']], displayMath: [['$$','$$']] },
    svg: { fontCache: 'global' }
  };
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
  s.async = true;
  document.head.appendChild(s);
}

// ── Download all tabs as a standalone HTML file ──────────────────────────────
function downloadAsHtml() {
  try {
    const chapterTitle = document.querySelector('.chapter-title')?.textContent?.trim() || 'Chapter';
    const subTitleEl = document.querySelector('.chapter-title')?.nextElementSibling;
    const subTitle = (subTitleEl && subTitleEl.tagName === 'P') ? subTitleEl.textContent.trim() : '';
    const fullTitle = subTitle ? (chapterTitle + ' — ' + subTitle) : chapterTitle;
    const timestamp = new Date().toLocaleString('en-IN', {day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'});

    const TAB_LABELS = {
      'summary':        '📋 Chapter Summary',
      'short_notes':    '📌 Short Revision Notes',
      'keywords':       '🔑 Key Terms',
      'exercises':      '✍️ Exercises Solved',
      'question_paper': '❓ Practice Questions',
      'fulltext':       '📖 Full Chapter Text',
    };

    let bodyParts = [];
    document.querySelectorAll('.tab-panel').forEach(function(panel) {
      const key = panel.id.replace('tab-', '');
      const label = TAB_LABELS[key] || key;
      const contentDiv = panel.querySelector('.content-body');
      const inner = contentDiv ? contentDiv.innerHTML : '';
      if (!inner.trim() || inner.indexOf('No content available') !== -1) return;
      bodyParts.push('<h2 class="section-title">' + label + '</h2>' +
        '<div class="section-body">' + inner + '</div>' +
        '<hr class="section-sep">');
    });

    if (bodyParts.length === 0) {
      alert('No content found. Make sure chapter content has loaded.');
      return;
    }

    const html = '<!DOCTYPE html>
<html lang="en">
<head>
' +
      '<meta charset="UTF-8">
' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">
' +
      '<title>' + fullTitle + '</title>
' +
      '<style>
' +
      '@media print{.section-sep{page-break-after:always}body{font-size:11pt}}
' +
      'body{font-family:"Segoe UI",Tahoma,sans-serif;max-width:820px;margin:0 auto;padding:24px 40px;color:#222;line-height:1.65}
' +
      '.doc-header{text-align:center;border-bottom:2px solid #1a1a2e;padding-bottom:14px;margin-bottom:28px}
' +
      '.doc-header h1{margin:0;font-size:20pt;color:#1a1a2e}
' +
      '.doc-header p{margin:4px 0 0;color:#666;font-size:9.5pt}
' +
      '.section-title{color:#16213e;font-size:14pt;margin:28px 0 8px;border-left:4px solid #ff4b4b;padding-left:10px}
' +
      '.section-body{margin-bottom:12px}
' +
      '.section-sep{border:none;border-top:1px solid #ddd;margin:20px 0}
' +
      'table{border-collapse:collapse;width:100%;margin:10px 0}
' +
      'th,td{border:1px solid #ccc;padding:7px 11px;text-align:left}
' +
      'th{background:#f0f0f0}
' +
      'pre,code{background:#f5f5f5;padding:2px 6px;border-radius:3px;font-size:10pt}
' +
      'pre{padding:12px;overflow-x:auto;white-space:pre-wrap}
' +
      'ol,ul{padding-left:22px}li{margin-bottom:4px}
' +
      'details summary{cursor:pointer}
' +
      'button{display:none!important}
' +
      '</style>
</head>
<body>
' +
      '<div class="doc-header"><h1>&#55357;&#56538; ' + fullTitle + '</h1>' +
      '<p>Generated on ' + timestamp + ' | CBSE Class 7 Smart Portal</p></div>
' +
      bodyParts.join('
') +
      '
</body>
</html>';

    // Use data: URI — works on all browsers including GitHub Pages (no Blob URL restriction)
    const filename = fullTitle.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_') + '.html';
    const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
    const a = document.createElement('a');
    a.setAttribute('href', dataUri);
    a.setAttribute('download', filename);
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch(err) {
    alert('Download failed: ' + err.message);
  }
}
