(() => {
  'use strict';
  const deck = window.CARE_DECK;
  const $ = id => document.getElementById(id);
  const stage = $('slide');
  const states = new Map();
  let current = 0;
  const stateFor = slide => states.get(slide.id) || {};
  function hydrateIcons(root = document) {
    root.querySelectorAll('[data-icon]').forEach(element => { element.innerHTML = window.CARE_ICONS[element.dataset.icon] || ''; });
  }
  function markup(slide, state = stateFor(slide)) {
    return `<div class="slide-composition">${slide.cover || slide.customHeading ? '' : `<h2 class="slide-heading" id="slide-title">${slide.title}</h2>`}<div class="slide-content">${slide.render(state)}</div></div>`;
  }
  function render(animate = false) {
    const slide = deck[current];
    stage.innerHTML = markup(slide);
    stage.dataset.slide = slide.id;
    stage.scrollTop = 0;
    stage.classList.remove('is-entering');
    if (animate) { void stage.offsetWidth; stage.classList.add('is-entering'); }
    $('chapter-label').textContent = slide.chapter;
    $('slide-label').textContent = slide.title;
    $('slide-counter').innerHTML = `<strong>${String(current + 1).padStart(2, '0')}</strong> / ${deck.length}`;
    $('deck-progress').max = deck.length;
    $('deck-progress').value = current + 1;
    $('previous').disabled = current === 0;
    $('next').disabled = current === deck.length - 1;
    document.title = `${slide.title} | CareRecord presentation`;
    $('announcement').textContent = `Slide ${current + 1} of ${deck.length}. ${slide.title}`;
  }
  function go(index, focus = false) {
    const next = Math.min(deck.length - 1, Math.max(0, index));
    if (current === next) return;
    current = next;
    const hash = `#/${deck[current].id}`;
    if (location.hash !== hash) history.pushState(null, '', hash);
    render(true);
    if (focus) stage.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function restoreFromURL() {
    const id = location.hash.replace(/^#\/?/, '');
    const found = deck.findIndex(slide => slide.id === id);
    current = found >= 0 ? found : 0;
    if (found < 0) history.replaceState(null, '', `#/${deck[0].id}`);
    render();
  }
  async function fullScreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (stage.requestFullscreen) await stage.requestFullscreen();
      else $('announcement').textContent = 'Full screen is not supported by this browser. Use your browser presentation or full-screen command.';
    } catch { $('announcement').textContent = 'Full screen was not available. You can still navigate the presentation normally.'; }
  }
  $('previous').addEventListener('click', () => go(current - 1));
  document.querySelector('.skip-link').addEventListener('click', event => {
    event.preventDefault();
    stage.focus({ preventScroll: true });
  });
  $('next').addEventListener('click', () => go(current + 1));
  $('fullscreen-toggle').addEventListener('click', fullScreen);
  $('keyboard-help').addEventListener('click', () => $('shortcut-dialog').showModal());
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => $(button.dataset.close).close()));
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }));
  stage.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'next') { go(current + 1, true); return; }
    if (action === 'restart') { go(0, true); return; }
    const state = { ...stateFor(deck[current]) };
    const changes = { pillar: 'pillar', lab: 'lab', match: 'match', etl: 'etl' };
    if (changes[action]) state[changes[action]] = button.dataset.value;
    else if (action === 'load') state.loaded = true;
    else if (action === 'reset-load') state.loaded = false;
    else return;
    states.set(deck[current].id, state);
    render();
    const nextAction = action === 'load' ? 'reset-load' : action === 'reset-load' ? 'load' : action;
    const selector = `[data-action="${nextAction}"]${button.dataset.value ? `[data-value="${button.dataset.value}"]` : ''}`;
    stage.querySelector(selector)?.focus({ preventScroll: true });
    if (action === 'load') $('announcement').textContent = 'Example reporting refreshed: four facts included and two drafts excluded.';
  });
  document.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (document.querySelector('dialog[open]')) return;
    if (event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    if ((event.key === ' ' || event.key === 'Enter') && event.target.closest('button,a')) return;
    const key = event.key.toLowerCase();
    if (['arrowright', 'pagedown', ' '].includes(key)) { event.preventDefault(); go(current + 1, true); }
    else if (['arrowleft', 'pageup'].includes(key)) { event.preventDefault(); go(current - 1, true); }
    else if (key === 'home') { event.preventDefault(); go(0, true); }
    else if (key === 'end') { event.preventDefault(); go(deck.length - 1, true); }
    else if (key === 'f') { event.preventDefault(); void fullScreen(); }
    else if (key === '?' && !document.fullscreenElement) $('shortcut-dialog').showModal();
  });
  document.addEventListener('fullscreenchange', () => {
    const active = !!document.fullscreenElement;
    document.querySelector('.toolbar').inert = active;
    document.querySelector('.navigation').inert = active;
    if (active) {
      document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
      stage.focus({ preventScroll: true });
    } else {
      $('fullscreen-toggle').focus({ preventScroll: true });
    }
    $('fullscreen-toggle').innerHTML = window.CARE_ICONS[active ? 'Minimize' : 'Maximize'];
    $('fullscreen-toggle').setAttribute('aria-label', active ? 'Exit full screen' : 'Enter full screen');
  });
  window.addEventListener('hashchange', restoreFromURL);
  window.addEventListener('popstate', restoreFromURL);
  hydrateIcons();
  restoreFromURL();
})();
