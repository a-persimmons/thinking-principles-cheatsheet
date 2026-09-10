// experimental v2 engineering detail augmentation
(() => {
  const esc = (s='') => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const isEN = () => document.documentElement.lang === 'en';

  function enrichDetail(){
    const m = location.hash.match(/^#\/principles\/([^?]+)/);
    if(!m) return;
    const id = decodeURIComponent(m[1]);
    const p = principles.find(x=>x.id===id);
    if(!p || !p.trigger) return;
    const grid = document.querySelector('.detail-grid');
    if(!grid || grid.querySelector('[data-engineering-augmentation]')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'engineering-augmentation detail-full';
    wrapper.dataset.engineeringAugmentation = '1';
    wrapper.innerHTML = `
      <div class="engineering-trigger">
        <div class="engineering-kicker">${isEN()?'Trigger':'什么时候想起它'}</div>
        <div class="engineering-trigger-copy">${esc(p.trigger)}</div>
      </div>
      <div class="engineering-grid">
        <section class="detail-card engineering-checklist-card">
          <h2>${isEN()?'Engineering checklist':'工程检查清单'}</h2>
          <ul class="engineering-checklist">${(p.checklist||[]).map(x=>`<li><span class="check-box">□</span><span>${esc(x)}</span></li>`).join('')}</ul>
        </section>
        <section class="detail-card engineering-badcase-card">
          <h2>${isEN()?'Bad case':'工程反例 / Bad Case'}</h2>
          <p>${esc(p.badCase||'—')}</p>
        </section>
      </div>
      <section class="detail-card engineering-pattern-card">
        <div class="engineering-pattern-head"><h2>${isEN()?'Engineering pattern':'工程模式'}</h2><span>${esc(p.engineeringType||'Engineering')}</span></div>
        <code>${esc(p.engineeringPattern||'—')}</code>
      </section>`;
    grid.prepend(wrapper);
  }

  const observer = new MutationObserver(()=>requestAnimationFrame(enrichDetail));
  observer.observe(document.getElementById('app'), {childList:true,subtree:true});
  addEventListener('hashchange', ()=>requestAnimationFrame(enrichDetail));
  requestAnimationFrame(enrichDetail);
})();
