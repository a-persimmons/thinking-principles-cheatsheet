// v0.6 detail UI: prerequisites, failure conditions, and balancing principles
match = function(p){
  if(state.favOnly && !favs.has(p.id)) return false;
  if(state.category!=="全部" && p.category!==state.category) return false;
  if(state.layer!=="全部" && !p.layers.includes(state.layer)) return false;
  if(state.scenarioIds && !state.scenarioIds.includes(p.id)) return false;
  const q=state.q.trim().toLowerCase();
  if(!q) return true;
  const e=principleEN[p.id]||{};
  return [p.name,p.en,p.category,p.core,p.map,p.misuse,p.premise,p.failure,...p.layers,...p.use,e.name,e.core,e.map,e.misuse,e.premise,e.failure,...(e.use||[])].filter(Boolean).join(" ").toLowerCase().includes(q);
};

openDetail = function(id){
  const p=principles.find(x=>x.id===id);
  const e=lang==="en"?(principleEN[p.id]||{}):{};
  const t=uiText[lang];
  const name=lang==="en"?(e.name||p.en):p.name;
  const sub=lang==="en"?p.name:p.en;
  const core=lang==="en"?(e.core||p.core):p.core;
  const map=lang==="en"?(e.map||p.map):p.map;
  const misuse=lang==="en"?(e.misuse||p.misuse):p.misuse;
  const prompt=lang==="en"?(e.prompt||p.prompt):p.prompt;
  const uses=lang==="en"?(e.use||p.use.map(x=>translateUse(x))):p.use;
  const premise=lang==="en"?(e.premise||p.premise):p.premise;
  const failure=lang==="en"?(e.failure||p.failure):p.failure;
  const related=(p.combine||[]).map(rid=>principles.find(x=>x.id===rid)).filter(Boolean);
  const relationButtons=related.map(r=>{
    const re=lang==="en"?(principleEN[r.id]||{}):{};
    const label=lang==="en"?(re.name||r.en):r.name;
    return `<button class="principle-link" data-related="${r.id}">${label}</button>`;
  }).join("");
  const extra=(premise||failure)?`<div class="detail-grid" style="margin-top:14px">
    ${premise?`<div class="detail-block"><h4>${lang==="en"?"When it applies":"适用前提"}</h4><p>${premise}</p></div>`:""}
    ${failure?`<div class="detail-block"><h4>${lang==="en"?"When it breaks":"何时失效 / 需要制衡"}</h4><p>${failure}</p></div>`:""}
  </div>`:"";
  const relations=relationButtons?`<div class="detail-block" style="margin-top:14px"><h4>${lang==="en"?"Balance / combine with":"制衡 / 组合原则"}</h4><div class="principle-links">${relationButtons}</div></div>`:"";
  $("#modal").innerHTML=`
    <div class="modal-head"><div><div class="en">${sub}</div><h3>${name}</h3></div><button class="close" id="close">×</button></div>
    <div class="quote">${core}</div>
    <div class="mapping">${map}</div>
    <div class="detail-grid">
      <div class="detail-block"><h4>${t.use}</h4><ul>${uses.map(x=>`<li>${x}</li>`).join("")}</ul></div>
      <div class="detail-block"><h4>${t.misuse}</h4><p>${misuse}</p></div>
    </div>
    ${extra}${relations}
    <div class="detail-block" style="margin-top:14px"><h4>${t.prompt}</h4><pre>${escapeHtml(prompt)}</pre></div>`;
  $("#dialog").showModal();
  $("#close").onclick=()=>$("#dialog").close();
  document.querySelectorAll("[data-related]").forEach(btn=>btn.onclick=()=>openDetail(btn.dataset.related));
};

render();