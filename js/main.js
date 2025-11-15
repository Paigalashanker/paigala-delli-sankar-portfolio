// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  // basics
  document.getElementById('year').textContent = new Date().getFullYear();
  bindNavLinks();
  bindFabs();
  restoreTheme();
  revealOnScroll();
  initSkillAnimations();
  initContactForm();
  initProjectReveal();
});

/* Navigation smooth behavior + active link */
function bindNavLinks() {
  const nav = document.querySelectorAll('a[href^="#"]');
  nav.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({behavior:'smooth', block:'start'});
        history.replaceState(null, '', href);
      }
    });
  });
}

/* Floating buttons */
function bindFabs(){
  const group = document.querySelector('.fab-group');
  if (!group) return;
  group.addEventListener('click', (e) => {
    const btn = e.target.closest('.fab');
    if (!btn) return;
    const target = btn.getAttribute('data-target');
    if (btn.id === 'backTop' || btn.classList.contains('back-top')) {
      window.scrollTo({top:0,behavior:'smooth'}); return;
    }
    if (target) {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
  // back-top visibility
  const back = document.getElementById('backTop');
  const onScroll = () => {
    if (!back) return;
    back.style.opacity = window.scrollY > 300 ? '1' : '0.18';
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});
}

/* Theme toggle */
const THEME_KEY = 'pds_theme';
function restoreTheme(){
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeButton();
  const tgl = document.getElementById('theme-toggle');
  if (tgl) tgl.addEventListener('click', toggleTheme);
}
function toggleTheme(){
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem(THEME_KEY, next); } catch(e){}
  updateThemeButton();
}
function updateThemeButton(){
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  btn.textContent = cur === 'dark' ? '🌙' : '☀️';
}

/* reveal animation on scroll for elements with .reveal or .animated-card */
function revealOnScroll(){
  const items = document.querySelectorAll('.reveal, .animated-card');
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        e.target.classList.add('visible-card');
        e.target.style.opacity = 1;
        e.target.style.transform = 'translateY(0)';
        o.unobserve(e.target);
      }
    });
  }, {threshold:0.12});
  items.forEach(i => obs.observe(i));
}

/* animated project reveal (adds class) */
function initProjectReveal(){
  const cards = document.querySelectorAll('.project-card.animated-card');
  cards.forEach((c, idx) => {
    setTimeout(()=> c.classList.add('reveal','visible'), 120*idx);
  });
}

/* Skill bar animation using IntersectionObserver */
function initSkillAnimations(){
  const cards = document.querySelectorAll('.skill-card');
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const level = parseInt(el.getAttribute('data-level')||'0',10);
      const fill = el.querySelector('.fill');
      if (fill) fill.style.width = level + '%';
      o.unobserve(el);
    });
  }, {threshold:0.25});
  cards.forEach(c => obs.observe(c));
}

/* Contact form handling (mailto fallback) */
function initContactForm(){
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name')||'').toString().trim();
    const email = (fd.get('email')||'').toString().trim();
    const message = (fd.get('message')||'').toString().trim();
    if (!name || !email || !message) {
      status.textContent = 'Please fill all fields.';
      status.style.color = 'crimson';
      return;
    }
    status.textContent = 'Preparing message...';
    status.style.color = 'var(--muted)';
    setTimeout(()=>{
      const subj = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(message + `\n\nFrom: ${name} <${email}>`);
      const mailto = `mailto:paigalashanker@gmail.com?subject=${subj}&body=${body}`;
      status.innerHTML = `Ready — <a href="${mailto}" target="_blank" rel="noopener">Open email client</a>`;
      status.style.color = 'lightgreen';
      form.reset();
    },700);
  });
}

/* small helpers */
window.addEventListener('load', () => {
  // reveal already-marked elements
  document.querySelectorAll('.slide-in, .fade-in').forEach(el=>{
    el.style.opacity = 1; el.style.transform = 'translateY(0)';
  });
});