// experimental v2: enrich contextual drawer without changing its navigation behavior
(() => {
  const esc = (s='') => String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const isEN = () => document.documentElement.lang === 'en';
  function enhance(){
    const drawer=document.querySelector('.principle-drawer');
    if(!drawer || drawer.querySelector('[data-drawer-engineering]')) return;
    const link=drawer.querySelector('.drawer-detail-link');
    const m=(link?.getAttribute('href')||'').match(/#\/principles\/([^?]+)/);
    if(!m) return;
    const p=principles.find(x=>x.id===decodeURIComponent(m[1]));
    if(!p?.trigger) return;
    const body=drawer.querySelector('.drawer-body');
    if(!body) return;
    const node=document.createElement('section');
    node.className='drawer-section';
    node.dataset.drawerEngineering='1';
    node.innerHTML=`
      <div class="drawer-engineering-trigger">
        <div class="drawer-label">${isEN()?'Trigger':'什么时候想起它'}</div>
        <strong>${esc(p.trigger)}</strong>
      </div>
      <div class="drawer-grid" style="margin-top:12px">
        <div class="drawer-box"><div class="drawer-label">${isEN()?'Engineering checklist':'工程检查清单'}</div><ul class="drawer-checklist">${(p.checklist||[]).map(x=>`<li><span>□</span><span>${esc(x)}</span></li>`).join('')}</ul></div>
        <div class="drawer-box"><div class="drawer-label">${isEN()?'Bad case':'工程反例 / Bad Case'}</div><p class="drawer-badcase">${esc(p.badCase||'—')}</p></div>
      </div>
      <div style="margin-top:12px"><div class="drawer-label">${isEN()?'Engineering pattern':'工程模式'}</div><div class="drawer-pattern">${esc(p.engineeringPattern||'—')}</div></div>`;
    const first=body.firstElementChild;
    first ? first.after(node) : body.appendChild(node);
  }
  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));
  observer.observe(document.body,{childList:true,subtree:true});
})();
