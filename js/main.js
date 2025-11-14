// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  // existing init (if present)
  bindFabs();
  restoreTheme();
});

function bindFabs(){
  const group = document.querySelector('.fab-group');
  if (!group) return;

  group.addEventListener('click', (e) => {
    const btn = e.target.closest('.fab');
    if (!btn) return;
    if (btn.id === 'theme-toggle') {
      toggleTheme();
      return;
    }
    if (btn.id === 'backTop') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = btn.getAttribute('data-target');
    if (target) {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // add floating wiggle to primary button
  const primary = group.querySelector('.fab.primary');
  if (primary) primary.classList.add('float-anim');

  // show/hide back-to-top on scroll
  const back = document.getElementById('backTop');
  const toggleBackVisibility = () => {
    if (!back) return;
    if (window.scrollY > 300) back.style.opacity = '1';
    else back.style.opacity = '0.16';
  };
  toggleBackVisibility();
  window.addEventListener('scroll', toggleBackVisibility, { passive:true });
}

/* theme toggle */
function toggleTheme(){
  const root = document.documentElement;
  const cur = root.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('pds_theme', next); } catch(e){}
  updateThemeButton(next);
}

function restoreTheme(){
  const saved = (localStorage.getItem('pds_theme')) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeButton(saved);
}

function updateThemeButton(theme){
  const tbtn = document.getElementById('theme-toggle');
  if (!tbtn) return;
  tbtn.textContent = theme === 'dark' ? 'Light' : 'Dark';
}
// ...existing code...document.addEventListener('DOMContentLoaded', () => {
    initProjects();
    initContactForm();
    setActiveNav();
});

async function initProjects() {
    const containers = document.querySelectorAll('.project-list');
    if (!containers.length) return;
    try {
        const res = await fetch('assets/data/projects.json');
        if (!res.ok) throw new Error('Could not load projects.json');
        const data = await res.json();
        const projects = data.projects || [];
        containers.forEach(container => {
            container.innerHTML = '';
            projects.forEach(p => {
                const art = document.createElement('article');
                art.className = 'project';
                art.innerHTML = `
                    <h3>${escapeHtml(p.title)}</h3>
                    <p>${escapeHtml(p.description)}</p>
                    ${p.link ? `<p><a href="${p.link}" target="_blank" rel="noopener">View project</a></p>` : ''}
                `;
                container.appendChild(art);
            });
        });
    } catch (err) {
        console.error('Projects load error:', err);
    }
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const status = document.createElement('div');
    status.id = 'contact-status';
    status.style.marginTop = '12px';
    form.appendChild(status);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = (form.name?.value || '').trim();
        const email = (form.email?.value || '').trim();
        const message = (form.message?.value || '').trim();

        if (!name || !email || !message) {
            status.textContent = 'Please fill in all fields.';
            status.style.color = 'crimson';
            return;
        }

        status.textContent = 'Sending...';
        status.style.color = '#666';

        // Simulate send then provide a mailto fallback
        setTimeout(() => {
            status.innerHTML = `Thanks, ${escapeHtml(name)} — your message is queued. <a href="mailto:paigalashanker@gmail.com?subject=${encodeURIComponent('Portfolio message from '+name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' <' + email + '>')}" target="_blank" rel="noopener">Open email client</a>`;
            status.style.color = 'green';
            form.reset();
        }, 700);
    });
}

function setActiveNav() {
    const links = document.querySelectorAll('nav a');
    const file = location.pathname.split('/').pop() || 'index.html';
    links.forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;
        if (href === file || (href === 'index.html' && file === '')) {
            a.classList.add('active');
            a.style.fontWeight = '700';
        } else {
            a.classList.remove('active');
        }
    });
}

function escapeHtml(s = '') {
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[c]));
}