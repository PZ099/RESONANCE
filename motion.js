(() => {
  'use strict';
  const body = document.body;
  const control = document.getElementById('motion-toggle');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pausedByUser = false;
  try { pausedByUser = sessionStorage.getItem('resonance-motion-paused') === 'true'; } catch { /* Storage is optional. */ }
  let sceneVisible = false;
  let sceneTimer = null;
  const scene = document.querySelector('.listening-scene');
  const lines = [...document.querySelectorAll('.scene-lyrics > p')];
  let currentLine = 0;
  const motionAllowed = () => !pausedByUser && !preference.matches && !document.hidden;

  function stopScene() {
    if (sceneTimer !== null) window.clearTimeout(sceneTimer);
    sceneTimer = null;
  }
  function startScene() {
    stopScene();
    if (!motionAllowed() || !sceneVisible || lines.length < 2) return;
    sceneTimer = window.setTimeout(() => {
      lines[currentLine].classList.remove('is-current');
      currentLine = (currentLine + 1) % lines.length;
      lines[currentLine].classList.add('is-current');
      startScene();
    }, 3000);
  }
  function applyMotion() {
    const paused = pausedByUser || preference.matches;
    body.classList.toggle('motion-paused', paused);
    document.documentElement.classList.toggle('motion-static', paused);
    body.classList.toggle('page-hidden', document.hidden);
    control.setAttribute('aria-pressed', String(paused));
    control.querySelector('.motion-label').textContent = preference.matches ? '静态预览' : paused ? '开启动效' : '暂停动效';
    control.querySelector('.motion-icon').textContent = paused ? '▷' : 'Ⅱ';
    control.setAttribute('aria-label', preference.matches ? '系统已启用减少动态效果' : paused ? '开启页面动效' : '暂停页面动效');
    control.disabled = preference.matches;
    control.title = preference.matches ? '遵循系统的减少动态效果设置' : paused ? '开启页面动效' : '暂停页面动效';
    startScene();
  }
  control.hidden = false;
  control.addEventListener('click', () => {
    pausedByUser = !pausedByUser;
    try { sessionStorage.setItem('resonance-motion-paused', String(pausedByUser)); } catch { /* Continue without storage. */ }
    applyMotion();
  });
  preference.addEventListener('change', applyMotion);
  document.addEventListener('visibilitychange', applyMotion);

  for (const button of document.querySelectorAll('.palette-choice')) {
    button.addEventListener('click', () => {
      const value = button.dataset.palette;
      if (!['prism','dusk','ice'].includes(value)) return;
      scene.dataset.palette = value;
      for (const choice of document.querySelectorAll('.palette-choice')) {
        const selected = choice === button;
        choice.classList.toggle('active', selected);
        choice.setAttribute('aria-pressed', String(selected));
      }
    });
  }
  document.querySelector('.palette-picker').hidden = false;

  if ('IntersectionObserver' in window) {
    const sceneObserver = new IntersectionObserver(entries => {
      sceneVisible = entries[0].isIntersecting;
      scene.classList.toggle('motion-offscreen', !sceneVisible);
      startScene();
    }, { threshold: .2 });
    sceneObserver.observe(scene);
    const decorativeObserver = new IntersectionObserver(entries => {
      for (const entry of entries) entry.target.classList.toggle('motion-offscreen', !entry.isIntersecting);
    });
    document.querySelectorAll('.sound-art').forEach(element => decorativeObserver.observe(element));

    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (motionAllowed()) entry.target.classList.add('section-enter');
        revealObserver.unobserve(entry.target);
      }
    }, { threshold: .08 });
    document.querySelectorAll('.section-heading,.preview-stage,.feature-row,.flow-steps,.core-grid,.download-heading,.download-layout,.guide-steps,.update-row,.faq-heading').forEach(element => revealObserver.observe(element));
  } else {
    sceneVisible = true;
  }

  const progress = document.querySelector('.reading-progress > span');
  const navLinks = [...document.querySelectorAll('#site-nav a[href^="#"]')];
  const sections = navLinks.map(link => document.querySelector(link.hash)).filter(Boolean);
  let scrollPending = false;
  function paintScroll() {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${available > 0 ? Math.min(1,Math.max(0,window.scrollY / available)) : 0})`;
    let active = null;
    let closestTop = -Infinity;
    for (const section of sections) {
      const top = section.getBoundingClientRect().top;
      if (top <= 180 && top > closestTop) { active = section.id; closestTop = top; }
    }
    for (const link of navLinks) {
      if (link.hash === '#' + active) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    }
    scrollPending = false;
  }
  function queueScroll() {
    if (!scrollPending) { scrollPending = true; window.requestAnimationFrame(paintScroll); }
  }
  window.addEventListener('scroll', queueScroll, { passive: true });
  window.addEventListener('resize', queueScroll, { passive: true });
  window.addEventListener('pagehide', stopScene);
  window.addEventListener('pageshow', () => { applyMotion(); queueScroll(); });
  applyMotion();
  paintScroll();
})();
