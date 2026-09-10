// v1.3 contextual principle drawer for Decisions and Relations
(() => {
  let lastFocus = null;

  const isEN = () => document.documentElement.lang === 'en';
  const esc = (s='') => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const getEN = p => (window.principleEN && principleEN[p.id]) || {};
  const nameOf = p => isEN() ? (getEN(p).name || p.en) : p.name;
  const subNameOf = p => isEN() ? p.name : p.en;
  const coreOf = p => isEN() ? (getEN(p).core || p.core) : p.core;
  const mapOf = p => isEN() ? (getEN(p).map || p.map) : p.map;
  const useOf = p => isEN() ? (getEN(p).use || p.use || []) : (p.use || []);
  const misuseOf = p => isEN() ? (getEN(p).misuse || p.misuse) : p.misuse;
  const premiseOf = p => isEN() ? (getEN(p).premise || p.premise) : p.premise;
  const failureOf = p => isEN() ? (getEN(p).failure || p.failure) : p.failure;
  const promptOf = p => isEN() ? (getEN(p).prompt || p.prompt) : p.prompt;

  function recordRecent(id){
    try{
      const current = JSON.parse(localStorage.getItem('principle-recent') || '[]');
      const next = [id, ...current.filter(x => x !== id)].slice(0, 10);
      localStorage.setItem('principle-recent', JSON.stringify(next));
    }catch{}
  }

  function ensureDrawer(){
    let backdrop = document.querySelector('.principle-drawer-backdrop');
    if(backdrop) return backdrop;
    backdrop = document.createElement('div');
    backdrop.className = 'principle-drawer-backdrop';
    backdrop.innerHTML = '<aside class="principle-drawer" role="dialog" aria-modal="true" aria-labelledby="drawerTitle"></aside>';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', e => {
      if(e.target === backdrop) closeDrawer();
    });
    return backdrop;
  }

  function relatedButtons(p){
    const ids = p.combine || [];
    if(!ids.length) return '';
    const label = isEN() ? 'Balance / combine with' : '制衡 / 组合原则';
    return `<section class="drawer-section"><div class="drawer-label">${label}</div><div class="drawer-relations">${ids.map(id=>{
      const r = principles.find(x=>x.id===id);
      return r ? `<button class="drawer-related" data-drawer-id="${esc(r.id)}">${esc(nameOf(r))}</button>` : '';
    }).join('')}</div></section>`;
  }

  function renderDrawer(p){
    const backdrop = ensureDrawer();
    const drawer = backdrop.querySelector('.principle-drawer');
    const premise = premiseOf(p);
    const failure = failureOf(p);
    const use = useOf(p);
    const openText = isEN() ? 'Open full principle page →' : '打开完整详情页 →';
    const useLabel = isEN() ? 'Use cases' : '适用场景';
    const misuseLabel = isEN() ? 'Common misuse' : '常见误用';
    const premiseLabel = isEN() ? 'When it applies' : '适用前提';
    const failureLabel = isEN() ? 'When it breaks / needs balance' : '何时失效 / 需要制衡';
    const mapLabel = isEN() ? 'Engineering mapping' : '工程映射';
    const promptLabel = isEN() ? 'Prompt pattern' : 'Prompt 模式';

    drawer.innerHTML = `
      <div class="drawer-head">
        <div class="drawer-head-copy"><div class="drawer-eyebrow">${esc(subNameOf(p))}</div><h2 id="drawerTitle">${esc(nameOf(p))}</h2></div>
        <button class="drawer-close" type="button" aria-label="${isEN()?'Close':'关闭'}">×</button>
      </div>
      <div class="drawer-body">
        <section class="drawer-section"><div class="drawer-core">${esc(coreOf(p))}</div></section>
        <section class="drawer-section"><div class="drawer-label">${mapLabel}</div><p class="drawer-copy">${esc(mapOf(p))}</p></section>
        <div class="drawer-grid drawer-section">
          <div class="drawer-box"><div class="drawer-label">${useLabel}</div>${use.length?`<ul class="drawer-list">${use.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p>—</p>'}</div>
          <div class="drawer-box"><div class="drawer-label">${misuseLabel}</div><p>${esc(misuseOf(p)||'—')}</p></div>
        </div>
        ${(premise||failure)?`<div class="drawer-grid drawer-section">
          ${premise?`<div class="drawer-box"><div class="drawer-label">${premiseLabel}</div><p>${esc(premise)}</p></div>`:''}
          ${failure?`<div class="drawer-box"><div class="drawer-label">${failureLabel}</div><p>${esc(failure)}</p></div>`:''}
        </div>`:''}
        ${relatedButtons(p)}
        ${promptOf(p)?`<section class="drawer-section"><div class="drawer-label">${promptLabel}</div><pre class="drawer-code">${esc(promptOf(p))}</pre></section>`:''}
      </div>
      <div class="drawer-footer"><a class="drawer-detail-link" href="#/principles/${esc(p.id)}">${openText}</a></div>`;

    drawer.querySelector('.drawer-close').onclick = closeDrawer;
    drawer.querySelectorAll('[data-drawer-id]').forEach(btn => btn.onclick = () => {
      const next = principles.find(x => x.id === btn.dataset.drawerId);
      if(next){ recordRecent(next.id); renderDrawer(next); }
    });
    drawer.querySelector('.drawer-detail-link').addEventListener('click', closeDrawer);
  }

  function openDrawer(id, source){
    const p = principles.find(x => x.id === id);
    if(!p) return;
    lastFocus = source || document.activeElement;
    recordRecent(id);
    renderDrawer(p);
    const backdrop = ensureDrawer();
    const drawer = backdrop.querySelector('.principle-drawer');
    document.body.classList.add('drawer-open');
    requestAnimationFrame(() => {
      backdrop.classList.add('open');
      drawer.classList.add('open');
      drawer.querySelector('.drawer-close')?.focus({preventScroll:true});
    });
  }

  function closeDrawer(){
    const backdrop = document.querySelector('.principle-drawer-backdrop');
    if(!backdrop) return;
    const drawer = backdrop.querySelector('.principle-drawer');
    backdrop.classList.remove('open');
    drawer.classList.remove('open');
    document.body.classList.remove('drawer-open');
    setTimeout(() => {
      backdrop.remove();
      if(lastFocus && document.contains(lastFocus)) lastFocus.focus({preventScroll:true});
      lastFocus = null;
    }, 240);
  }

  document.addEventListener('click', e => {
    const link = e.target.closest('.decision-list .principle-pill, .relation-line .principle-pill');
    if(!link) return;
    const href = link.getAttribute('href') || '';
    const m = href.match(/#\/principles\/([^?]+)/);
    if(!m) return;
    e.preventDefault();
    e.stopPropagation();
    openDrawer(decodeURIComponent(m[1]), link);
  });

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && document.querySelector('.principle-drawer-backdrop')) closeDrawer();
  });

  window.addEventListener('hashchange', () => {
    if(document.querySelector('.principle-drawer-backdrop')) closeDrawer();
  });
})();
