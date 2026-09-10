const App = (() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const storage = {
    get(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    set(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
  };

  let lang = localStorage.getItem("principle-lang") || "zh";
  let theme = localStorage.getItem("principle-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  let filters = { q:"", category:"全部", layer:"全部", favOnly:false };
  const favs = new Set(storage.get("principle-favs", []));
  let recent = storage.get("principle-recent", []);

  const t = {
    zh:{
      nav:["首页","原则库","决策手册","关系图"], homeKicker:"Thinking Principles × Agent Engineering",
      homeTitle:"思想原则<br>工程手册", homeCopy:"不是背哲学名词，而是在遇到 Prompt、Context、Tool、Harness、Loop、Eval 问题时，快速找到一个更好的判断框架。",
      homeAsideTitle:"怎么使用",homeAside:"先从工程问题进入；如果已经知道原则名称，就直接去原则库。原则不是答案，而是帮助你提出更好的判断问题。",
      search:"搜索原则或工程问题，例如：幻觉、RAG、权限、循环、指标……",searchHint:"按 Enter 进入原则库；也可以直接点击下面的常见问题。",
      entries:["原则库","决策手册","关系图"],entryDesc:["浏览全部思想原则，按类别和工程层筛选。","从工程问题反查判断问题、思想原则与可执行动作。","查看原则之间的制衡、组合与互补关系。"],
      common:"常见工程问题",recent:"最近查看",favorites:"我的收藏",viewAll:"查看全部 →",noRecent:"还没有最近查看记录。",noFav:"还没有收藏原则。",
      principlesTitle:"原则库",principlesSub:"快速扫描、筛选和查找适合当前问题的思考框架。",allCategories:"全部类别",allLayers:"全部工程层",favoritesOnly:"仅收藏",
      showing:"显示",items:"条原则",clear:"清空",decisionsTitle:"决策手册",decisionsSub:"工程问题 → 判断问题 → 思想原则 → 可执行动作",decisionSearch:"搜索工程问题、判断问题或动作……",
      relationsTitle:"关系图",relationsSub:"重点不是谁对谁错，而是什么时候一个原则需要另一个原则来制衡。",related:"制衡 / 组合原则",
      use:"适用场景",misuse:"常见误用",premise:"适用前提",failure:"何时失效 / 需要制衡",prompt:"Prompt 模式",relatedDecisions:"相关工程问题",back:"← 返回原则库",
      empty:"没有匹配结果。",footer:"v1.0 · 内容层保持独立，浏览层重构为 Home / Principles / Decisions / Relations / Detail。原则用于辅助判断，不替代 Eval、证据与工程验证。"
    },
    en:{
      nav:["Home","Principles","Decisions","Relations"],homeKicker:"Thinking Principles × Agent Engineering",
      homeTitle:"Thinking Principles<br>Engineering Handbook",homeCopy:"A practical way to find better judgment frameworks when Prompt, Context, Tool, Harness, Loop, or Eval problems appear.",
      homeAsideTitle:"How to use it",homeAside:"Start from an engineering problem. If you already know the principle, go straight to the library. A principle is not the answer—it helps you ask a better judgment question.",
      search:"Search principles or engineering problems: hallucination, RAG, permissions, loop, metrics…",searchHint:"Press Enter to open the principle library, or choose a common problem below.",
      entries:["Principles","Decision Handbook","Relations"],entryDesc:["Browse all principles by category and engineering layer.","Map engineering problems to judgment questions, principles, and executable actions.","Explore balancing and complementary relationships between principles."],
      common:"Common engineering problems",recent:"Recently viewed",favorites:"Favorites",viewAll:"View all →",noRecent:"No recently viewed principles yet.",noFav:"No favorites yet.",
      principlesTitle:"Principle Library",principlesSub:"Scan, filter, and find thinking frameworks for the current engineering problem.",allCategories:"All categories",allLayers:"All engineering layers",favoritesOnly:"Favorites only",
      showing:"Showing",items:"principles",clear:"Clear",decisionsTitle:"Decision Handbook",decisionsSub:"Engineering problem → Judgment question → Thinking principles → Executable actions",decisionSearch:"Search problems, judgment questions, or actions…",
      relationsTitle:"Relations",relationsSub:"The point is not which principle wins, but when one principle needs another to balance it.",related:"Balance / combine with",
      use:"Use cases",misuse:"Common misuse",premise:"When it applies",failure:"When it breaks / needs balance",prompt:"Prompt pattern",relatedDecisions:"Related engineering problems",back:"← Back to principles",
      empty:"No matching results.",footer:"v1.0 · Content remains modular while the browsing layer is organized into Home / Principles / Decisions / Relations / Detail. Principles support judgment; they do not replace evals, evidence, or engineering verification."
    }
  };

  function L(){ return t[lang]; }
  function pEN(p){ return principleEN[p.id] || {}; }
  function nameOf(p){ const e=pEN(p); return lang==="en" ? (e.name||p.en) : p.name; }
  function subNameOf(p){ return lang==="en" ? p.name : p.en; }
  function coreOf(p){ const e=pEN(p); return lang==="en" ? (e.core||p.core) : p.core; }
  function mapOf(p){ const e=pEN(p); return lang==="en" ? (e.map||p.map) : p.map; }
  function useOf(p){ const e=pEN(p); return lang==="en" ? (e.use||p.use) : p.use; }
  function misuseOf(p){ const e=pEN(p); return lang==="en" ? (e.misuse||p.misuse) : p.misuse; }
  function premiseOf(p){ const e=pEN(p); return lang==="en" ? (e.premise||p.premise) : p.premise; }
  function failureOf(p){ const e=pEN(p); return lang==="en" ? (e.failure||p.failure) : p.failure; }
  function promptOf(p){ const e=pEN(p); return lang==="en" ? (e.prompt||p.prompt) : p.prompt; }
  function categoryOf(cat){ return lang==="en" ? (categoryEN[cat]||cat) : cat; }
  function escapeHtml(s=""){ return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m])); }

  function currentPath(){ return (location.hash.replace(/^#/,"") || "/").split("?")[0]; }
  function queryFromHash(){
    const raw=location.hash.replace(/^#/,"");
    const i=raw.indexOf("?");
    return new URLSearchParams(i>=0?raw.slice(i+1):"");
  }
  function route(path, params={}){
    const qs=new URLSearchParams(params).toString();
    location.hash = path + (qs?`?${qs}`:"");
  }
  function nav(){
    const path=currentPath();
    const items=[["#/","home"],["#/principles","principles"],["#/decisions","decisions"],["#/relations","relations"]];
    $("#mainNav").innerHTML=items.map((x,i)=>{
      const active=x[1]==="home"?path==="/":path.startsWith("/"+x[1]);
      return `<a class="nav-link ${active?"active":""}" href="${x[0]}">${L().nav[i]}</a>`;
    }).join("");
    $("#langToggle").textContent=lang==="zh"?"EN":"中文";
    document.documentElement.dataset.theme=theme;
    document.documentElement.lang=lang==="en"?"en":"zh-CN";
  }

  function principleMatches(p,q){
    if(!q) return true;
    const e=pEN(p);
    return [p.name,p.en,p.category,p.core,p.map,p.misuse,p.premise,p.failure,...(p.use||[]),e.name,e.core,e.map,e.misuse,e.premise,e.failure,...(e.use||[])]
      .filter(Boolean).join(" ").toLowerCase().includes(q.toLowerCase());
  }
  function recentPrinciples(){ return recent.map(id=>principles.find(p=>p.id===id)).filter(Boolean).slice(0,6); }
  function saveRecent(id){ recent=[id,...recent.filter(x=>x!==id)].slice(0,10); storage.set("principle-recent",recent); }
  function favoritePrinciples(){ return principles.filter(p=>favs.has(p.id)).slice(0,6); }

  function miniPrinciple(p){
    return `<a class="mini-principle" href="#/principles/${p.id}">
      <div class="en">${escapeHtml(subNameOf(p))}</div><strong>${escapeHtml(nameOf(p))}</strong><p>${escapeHtml(coreOf(p))}</p>
    </a>`;
  }

  function renderHome(){
    const scenarios=scenarioData.slice(0,12);
    const scenarioViews=lang==="en"?scenarioEN:scenarioData;
    $("#app").innerHTML=`
      <section class="hero">
        <div>
          <div class="page-kicker">${L().homeKicker}</div>
          <h1>${L().homeTitle}</h1>
          <p class="hero-copy">${L().homeCopy}</p>
          <div class="search-box">
            <input id="homeSearch" placeholder="${L().search}" />
            <div class="search-hint">${L().searchHint}</div>
          </div>
        </div>
        <aside class="hero-aside"><strong>${L().homeAsideTitle}</strong><p>${L().homeAside}</p></aside>
      </section>
      <section class="entry-grid">
        ${["principles","decisions","relations"].map((r,i)=>`<a class="entry-card" href="#/${r}">
          <span class="num">0${i+1}</span><h3>${L().entries[i]}</h3><p>${L().entryDesc[i]}</p>
        </a>`).join("")}
      </section>
      <section class="stats">
        <div class="stat-card"><b>${principles.length}</b><span>${lang==="en"?"Principles":"思想原则"}</span></div>
        <div class="stat-card"><b>${decisionData.length}</b><span>${lang==="en"?"Decision cards":"工程决策卡"}</span></div>
        <div class="stat-card"><b>${new Set(principles.map(p=>p.category)).size}</b><span>${lang==="en"?"Categories":"知识类别"}</span></div>
        <div class="stat-card"><b>${principles.filter(p=>p.combine?.length).length}</b><span>${lang==="en"?"Related principles":"已建立关系"}</span></div>
      </section>
      <section class="section">
        <div class="section-head"><div><h2 class="section-title">${L().common}</h2></div><a class="text-link" href="#/decisions">${L().viewAll}</a></div>
        <div class="scenario-grid">${scenarios.map((s,i)=>{
          const v=scenarioViews[i]||s;
          return `<article class="scenario-card" data-scenario="${i}"><strong>${escapeHtml(v[0])}</strong><span>${escapeHtml(v[1])}</span></article>`;
        }).join("")}</div>
      </section>
      <section class="section">
        <div class="section-head"><div><h2 class="section-title">${L().recent}</h2></div><a class="text-link" href="#/principles">${L().viewAll}</a></div>
        <div class="mini-grid">${recentPrinciples().length?recentPrinciples().map(miniPrinciple).join(""):`<div class="empty">${L().noRecent}</div>`}</div>
      </section>
      <section class="section">
        <div class="section-head"><div><h2 class="section-title">${L().favorites}</h2></div><a class="text-link" href="#/principles">${L().viewAll}</a></div>
        <div class="mini-grid">${favoritePrinciples().length?favoritePrinciples().map(miniPrinciple).join(""):`<div class="empty">${L().noFav}</div>`}</div>
      </section>
      <div class="footer-note">${L().footer}</div>`;
    $("#homeSearch").addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.value.trim())route("/principles",{q:e.target.value.trim()});});
    $$(".scenario-card").forEach(el=>el.onclick=()=>{ const s=scenarioData[+el.dataset.scenario]; route("/principles",{ids:s[2].join(",")}); });
  }

  function principleRow(p){
    return `<article class="principle-row">
      <a href="#/principles/${p.id}"><div class="en">${escapeHtml(subNameOf(p))}</div><h3>${escapeHtml(nameOf(p))}</h3></a>
      <a href="#/principles/${p.id}"><p>${escapeHtml(mapOf(p))}</p></a>
      <div class="row-tags">
        <span class="tag">${escapeHtml(categoryOf(p.category))}</span>
        ${(p.layers||[]).slice(0,3).map(x=>`<span class="tag">${x}</span>`).join("")}
        <button class="star ${favs.has(p.id)?"on":""}" data-fav="${p.id}" title="${lang==="en"?"Favorite":"收藏"}">${favs.has(p.id)?"★":"☆"}</button>
      </div>
    </article>`;
  }

  function renderPrinciples(){
    const params=queryFromHash();
    if(params.has("q")) filters.q=params.get("q")||"";
    const ids=params.get("ids")?new Set(params.get("ids").split(",")):null;
    const categories=["全部",...new Set(principles.map(p=>p.category))];
    const layers=["全部","Prompt","Context","Tool","Harness","Loop","Eval"];
    const data=principles.filter(p=>{
      if(ids&&!ids.has(p.id))return false;
      if(filters.favOnly&&!favs.has(p.id))return false;
      if(filters.category!=="全部"&&p.category!==filters.category)return false;
      if(filters.layer!=="全部"&&!(p.layers||[]).includes(filters.layer))return false;
      return principleMatches(p,filters.q);
    });
    $("#app").innerHTML=`
      <div class="page-head"><div><div class="page-kicker">Library</div><h1 class="page-title">${L().principlesTitle}</h1><p class="page-subtitle">${L().principlesSub}</p></div></div>
      <div class="library-layout">
        <aside class="filter-panel">
          <div class="filter-group"><div class="filter-label">${lang==="en"?"Category":"类别"}</div><div class="filter-list">
            ${categories.map(c=>`<button class="chip ${filters.category===c?"active":""}" data-cat="${escapeHtml(c)}">${c==="全部"?L().allCategories:escapeHtml(categoryOf(c))}</button>`).join("")}
          </div></div>
          <div class="filter-group"><div class="filter-label">${lang==="en"?"Engineering layer":"工程层"}</div><div class="filter-list">
            ${layers.map(x=>`<button class="chip ${filters.layer===x?"active":""}" data-layer="${x}">${x==="全部"?L().allLayers:x}</button>`).join("")}
          </div></div>
        </aside>
        <section>
          <div class="library-toolbar">
            <input class="library-search" id="librarySearch" value="${escapeHtml(filters.q)}" placeholder="${L().search}" />
            <button class="btn ${filters.favOnly?"active":""}" id="favOnly">${L().favoritesOnly}</button>
            <button class="btn" id="clearFilters">${L().clear}</button>
          </div>
          <div class="result-meta">${L().showing} ${data.length} / ${principles.length} ${L().items}</div>
          <div class="principle-list">${data.length?data.map(principleRow).join(""):`<div class="empty">${L().empty}</div>`}</div>
        </section>
      </div>
      <div class="footer-note">${L().footer}</div>`;
    $("#librarySearch").addEventListener("input",e=>{filters.q=e.target.value;renderPrinciples();});
    $("#favOnly").onclick=()=>{filters.favOnly=!filters.favOnly;renderPrinciples();};
    $("#clearFilters").onclick=()=>{filters={q:"",category:"全部",layer:"全部",favOnly:false};route("/principles");renderPrinciples();};
    $$("[data-cat]").forEach(b=>b.onclick=()=>{filters.category=b.dataset.cat;renderPrinciples();});
    $$("[data-layer]").forEach(b=>b.onclick=()=>{filters.layer=b.dataset.layer;renderPrinciples();});
    $$("[data-fav]").forEach(b=>b.onclick=()=>{const id=b.dataset.fav;favs.has(id)?favs.delete(id):favs.add(id);storage.set("principle-favs",[...favs]);renderPrinciples();});
  }

  function decisionView(d,i){
    const en=decisionEN[i];
    return lang==="en"&&en?{problem:en[0],question:en[1],actions:en[2]}:{problem:d.problem,question:d.question,actions:d.actions};
  }
  function renderDecisions(){
    const params=queryFromHash(); const q=params.get("q")||"";
    const data=decisionData.map((d,i)=>({d,i,v:decisionView(d,i)})).filter(x=>{
      if(!q)return true;
      return [x.v.problem,x.v.question,...x.v.actions,...x.d.principles.map(id=>principles.find(p=>p.id===id)?.name||"")].join(" ").toLowerCase().includes(q.toLowerCase());
    });
    $("#app").innerHTML=`
      <div class="page-head"><div><div class="page-kicker">Decision Handbook</div><h1 class="page-title">${L().decisionsTitle}</h1><p class="page-subtitle">${L().decisionsSub}</p></div></div>
      <div class="library-toolbar"><input id="decisionSearch" class="library-search" value="${escapeHtml(q)}" placeholder="${L().decisionSearch}" /></div>
      <div class="result-meta">${L().showing} ${data.length} / ${decisionData.length}</div>
      <div class="decision-list">${data.length?data.map(({d,i,v})=>`
        <article class="decision-card">
          <div><div class="decision-label">${lang==="en"?"Engineering problem":"工程问题"}</div><div class="decision-problem">${escapeHtml(v.problem)}</div>
            <div class="principle-pills">${d.principles.map(id=>{const p=principles.find(x=>x.id===id);return p?`<a class="principle-pill" href="#/principles/${id}">${escapeHtml(nameOf(p))}</a>`:"";}).join("")}</div>
          </div>
          <div><div class="decision-label">${lang==="en"?"Judgment question":"判断问题"}</div><div class="decision-question">${escapeHtml(v.question)}</div></div>
          <div><div class="decision-label">${lang==="en"?"Executable actions":"可执行动作"}</div><ul class="action-list">${v.actions.map(a=>`<li>${escapeHtml(a)}</li>`).join("")}</ul></div>
        </article>`).join(""):`<div class="empty">${L().empty}</div>`}</div>
      <div class="footer-note">${L().footer}</div>`;
    $("#decisionSearch").addEventListener("keydown",e=>{if(e.key==="Enter")route("/decisions",{q:e.target.value.trim()});});
  }

  function renderRelations(){
    const related=principles.filter(p=>p.combine?.length);
    $("#app").innerHTML=`
      <div class="page-head"><div><div class="page-kicker">Knowledge Relations</div><h1 class="page-title">${L().relationsTitle}</h1><p class="page-subtitle">${L().relationsSub}</p></div></div>
      <div class="relation-grid">${related.map(p=>`
        <article class="relation-card">
          <div class="en">${escapeHtml(subNameOf(p))}</div><h3><a href="#/principles/${p.id}">${escapeHtml(nameOf(p))}</a></h3>
          <p>${escapeHtml(failureOf(p)||mapOf(p))}</p>
          <div class="relation-line"><span class="relation-arrow">${L().related} →</span>
            ${(p.combine||[]).map(id=>{const r=principles.find(x=>x.id===id);return r?`<a class="principle-pill" href="#/principles/${r.id}">${escapeHtml(nameOf(r))}</a>`:"";}).join("")}
          </div>
        </article>`).join("")}</div>
      <div class="footer-note">${L().footer}</div>`;
  }

  function renderDetail(id){
    const p=principles.find(x=>x.id===id);
    if(!p){$("#app").innerHTML=`<div class="empty">${L().empty}</div>`;return;}
    saveRecent(id);
    const related=(p.combine||[]).map(rid=>principles.find(x=>x.id===rid)).filter(Boolean);
    const relatedDecisions=decisionData.map((d,i)=>({d,i,v:decisionView(d,i)})).filter(x=>x.d.principles.includes(id)).slice(0,6);
    $("#app").innerHTML=`
      <div class="detail-shell">
        <a class="back-link" href="#/principles">${L().back}</a>
        <section class="detail-hero">
          <div class="en">${escapeHtml(subNameOf(p))}</div><h1>${escapeHtml(nameOf(p))}</h1>
          <div class="detail-quote">${escapeHtml(coreOf(p))}</div><p class="detail-map">${escapeHtml(mapOf(p))}</p>
          <div class="principle-pills"><span class="tag">${escapeHtml(categoryOf(p.category))}</span>${(p.layers||[]).map(x=>`<span class="tag">${x}</span>`).join("")}<button class="star ${favs.has(id)?"on":""}" id="detailFav">${favs.has(id)?"★":"☆"}</button></div>
        </section>
        <section class="detail-grid">
          <div class="detail-card"><h2>${L().use}</h2><ul>${useOf(p).map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul></div>
          <div class="detail-card"><h2>${L().misuse}</h2><p>${escapeHtml(misuseOf(p))}</p></div>
          ${premiseOf(p)?`<div class="detail-card"><h2>${L().premise}</h2><p>${escapeHtml(premiseOf(p))}</p></div>`:""}
          ${failureOf(p)?`<div class="detail-card"><h2>${L().failure}</h2><p>${escapeHtml(failureOf(p))}</p></div>`:""}
          ${related.length?`<div class="detail-card detail-full"><h2>${L().related}</h2><div class="principle-pills">${related.map(r=>`<a class="principle-pill" href="#/principles/${r.id}">${escapeHtml(nameOf(r))}</a>`).join("")}</div></div>`:""}
          <div class="detail-card detail-full"><h2>${L().prompt}</h2><pre>${escapeHtml(promptOf(p))}</pre></div>
          ${relatedDecisions.length?`<div class="detail-card detail-full"><h2>${L().relatedDecisions}</h2>${relatedDecisions.map(x=>`<a class="text-link" style="display:block;margin:7px 0" href="#/decisions?q=${encodeURIComponent(x.v.problem)}">→ ${escapeHtml(x.v.problem)}</a>`).join("")}</div>`:""}
        </section>
        <div class="footer-note">${L().footer}</div>
      </div>`;
    $("#detailFav").onclick=()=>{favs.has(id)?favs.delete(id):favs.add(id);storage.set("principle-favs",[...favs]);renderDetail(id);};
  }

  function render(){
    nav();
    const path=currentPath();
    window.scrollTo(0,0);
    if(path==="/") return renderHome();
    if(path==="/principles") return renderPrinciples();
    if(path.startsWith("/principles/")) return renderDetail(decodeURIComponent(path.split("/")[2]||""));
    if(path==="/decisions") return renderDecisions();
    if(path==="/relations") return renderRelations();
    route("/");
  }

  function init(){
    $("#themeToggle").onclick=()=>{theme=theme==="dark"?"light":"dark";localStorage.setItem("principle-theme",theme);document.documentElement.dataset.theme=theme;};
    $("#langToggle").onclick=()=>{lang=lang==="zh"?"en":"zh";localStorage.setItem("principle-lang",lang);render();};
    addEventListener("hashchange",render);
    render();
  }
  return {init};
})();
App.init();
