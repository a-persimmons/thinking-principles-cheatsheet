const categories = ["全部",...new Set(principles.map(x=>x.category))];
const layers = ["全部","Prompt","Context","Tool","Harness","Loop","Eval"];
let state = {category:"全部", layer:"全部", q:"", favOnly:false, scenarioIds:null};
let lang = localStorage.getItem("principle-lang") || "zh";
let theme = localStorage.getItem("principle-theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
document.documentElement.dataset.theme = theme;
const favs = new Set(JSON.parse(localStorage.getItem("principle-favs") || "[]"));

const $ = s => document.querySelector(s);

function renderFilters(){
  $("#categoryFilters").innerHTML = categories.map(c=>`<button class="chip ${state.category===c?'active':''}" data-cat="${c}">${lang==="en"?(categoryEN[c]||c):c}</button>`).join("");
  $("#layerFilters").innerHTML = layers.map(c=>`<button class="chip ${state.layer===c?'active':''}" data-layer="${c}">${c==="全部"?(lang==="en"?uiText.en.allLayer:uiText.zh.allLayer):c}</button>`).join("");
  document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;state.scenarioIds=null;render()});
  document.querySelectorAll("[data-layer]").forEach(b=>b.onclick=()=>{state.layer=b.dataset.layer;state.scenarioIds=null;render()});
}

function renderScenarios(){
  $("#scenarios").innerHTML=scenarioData.map((s,i)=>{
    const view = lang==="en" ? scenarioEN[i] : s;
    return `<div class="scenario" data-scenario="${i}">
      <strong>${view[0]}</strong><span>${view[1]}</span>
    </div>`;
  }).join("");
  document.querySelectorAll("[data-scenario]").forEach(el=>el.onclick=()=>{
    const s=scenarioData[+el.dataset.scenario];
    state.scenarioIds=s[2]; state.q=""; state.category="全部"; state.layer="全部";
    $("#search").value="";
    render();
    window.scrollTo({top:document.querySelector(".meta-row").offsetTop-130,behavior:"smooth"});
  });
}

function match(p){
  if(state.favOnly && !favs.has(p.id)) return false;
  if(state.category!=="全部" && p.category!==state.category) return false;
  if(state.layer!=="全部" && !p.layers.includes(state.layer)) return false;
  if(state.scenarioIds && !state.scenarioIds.includes(p.id)) return false;
  const q=state.q.trim().toLowerCase();
  if(!q) return true;
  return [p.name,p.en,p.category,p.core,p.map,p.misuse,...p.layers,...p.use].join(" ").toLowerCase().includes(q);
}

function renderCards(){
  const t = uiText[lang];
  const data=principles.filter(match);
  $("#resultCount").textContent=`${t.showing} ${data.length} / ${principles.length} ${t.items}${state.scenarioIds?t.scenarioRec:""}`;
  $("#cards").innerHTML=data.length ? data.map(p=>{
    const e = lang==="en" ? (principleEN[p.id]||{}) : {};
    const name = lang==="en" ? (e.name||p.en) : p.name;
    const sub = lang==="en" ? p.name : p.en;
    const core = lang==="en" ? (e.core||p.core) : p.core;
    const map = lang==="en" ? (e.map||p.map) : p.map;
    return `
    <article class="card">
      <div class="card-top">
        <div><div class="en">${sub}</div><h3>${name}</h3></div>
        <button class="fav ${favs.has(p.id)?'on':''}" data-fav="${p.id}" title="${lang==="en"?"Favorite":"收藏"}">${favs.has(p.id)?"★":"☆"}</button>
      </div>
      <div class="quote">${core}</div>
      <div class="mapping">${map}</div>
      <div class="tags">
        <span class="tag">${lang==="en"?(categoryEN[p.category]||p.category):p.category}</span>${p.layers.map(x=>`<span class="tag">${x}</span>`).join("")}
      </div>
      <button class="more" data-open="${p.id}">${t.open}</button>
    </article>`;
  }).join("") : `<div class="empty">${t.empty}</div>`;
  document.querySelectorAll("[data-fav]").forEach(b=>b.onclick=()=>{
    const id=b.dataset.fav; favs.has(id)?favs.delete(id):favs.add(id);
    localStorage.setItem("principle-favs",JSON.stringify([...favs])); renderCards();
  });
  document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>openDetail(b.dataset.open));
}

function openDetail(id){
  const p=principles.find(x=>x.id===id);
  const e = lang==="en" ? (principleEN[p.id]||{}) : {};
  const t = uiText[lang];
  const name = lang==="en" ? (e.name||p.en) : p.name;
  const sub = lang==="en" ? p.name : p.en;
  const core = lang==="en" ? (e.core||p.core) : p.core;
  const map = lang==="en" ? (e.map||p.map) : p.map;
  const misuse = lang==="en" ? (e.misuse||p.misuse) : p.misuse;
  const prompt = lang==="en" ? (e.prompt||p.prompt) : p.prompt;
  const uses = lang==="en" ? (e.use || p.use.map(x=>translateUse(x))) : p.use;
  $("#modal").innerHTML=`
    <div class="modal-head">
      <div><div class="en">${sub}</div><h3>${name}</h3></div>
      <button class="close" id="close">×</button>
    </div>
    <div class="quote">${core}</div>
    <div class="mapping">${map}</div>
    <div class="detail-grid">
      <div class="detail-block"><h4>${t.use}</h4><ul>${uses.map(x=>`<li>${x}</li>`).join("")}</ul></div>
      <div class="detail-block"><h4>${t.misuse}</h4><p>${misuse}</p></div>
    </div>
    <div class="detail-block" style="margin-top:14px"><h4>${t.prompt}</h4><pre>${escapeHtml(prompt)}</pre></div>`;
  $("#dialog").showModal();
  $("#close").onclick=()=>$("#dialog").close();
}
function translateUse(s){
  const m = {
    "Prompt 越写越长":"Growing prompts","Multi-Agent 过度设计":"Over-engineered multi-agent systems","上下文堆积":"Context bloat","工作流步骤过多":"Too many workflow steps",
    "模型不按要求输出":"Instruction-following failures","Tool Calling 失败":"Tool-calling failures","线上行为异常":"Production anomalies","Agent Debug":"Agent debugging",
    "模型幻觉":"Hallucination","事实问答":"Fact QA","根因分析":"Root-cause analysis","研究型 Agent":"Research agents","研究":"Research","复杂推理":"Complex reasoning","Self-Reflection":"Self-reflection",
    "诊断 Agent":"Diagnostic agents","搜索 Agent":"Search agents","不确定性管理":"Uncertainty management","多轮调查":"Multi-step investigation",
    "不知道 Prompt 怎么写":"Unclear prompt design","套模板无效":"Templates fail","复杂 Agent 需求":"Complex agent requirements","架构设计":"Architecture design",
    "RAG":"RAG","摘要链":"Summary pipelines","Memory":"Memory","长上下文":"Long context","数据抽取":"Data extraction",
    "回答冗长":"Verbose answers","跑题":"Off-topic output","表达含糊":"Ambiguous wording","RAG 噪音":"RAG noise",
    "意图识别":"Intent recognition","语音转写":"Speech transcription","模糊输入":"Ambiguous input","客服 Agent":"Support agents",
    "旧 Prompt 清理":"Legacy prompt cleanup","规则重构":"Rule refactoring","Guardrail 删除":"Guardrail removal","系统迁移":"System migration",
    "Eval 设计":"Eval design","奖励模型":"Reward models","自动优化 Prompt":"Automated prompt optimization","Agent KPI":"Agent KPIs",
    "Benchmark":"Benchmarks","自动回归测试":"Automated regression tests","Prompt 平台":"Prompt platforms","绩效指标":"Performance metrics",
    "生产 Agent":"Production agents","流式 JSON":"Streaming JSON","故障恢复":"Failure recovery",
    "执行型 Agent":"Action-taking agents","自动化":"Automation","文件修改":"File editing","代码 Agent":"Coding agents",
    "MCP":"MCP","Tool 权限":"Tool permissions","企业 Agent":"Enterprise agents",
    "事务操作":"Transactional operations","API Agent":"API agents",
    "Prompt 优化":"Prompt optimization","Bad case 分析":"Bad-case analysis","成本优化":"Cost optimization","学习路线":"Learning roadmap",
    "分类任务":"Classification","规则判断":"Rule-based judgment","抽象要求":"Abstract requirements","多人维护 Prompt":"Multi-owner prompts",
    "主观评价":"Subjective evaluation","分类标准":"Classification criteria","质量 Rubric":"Quality rubric","结构化输出":"Structured output",
    "事实核验":"Fact verification","决策支持":"Decision support",
    "Agent 规划":"Agent planning","Prompt 过度编排":"Over-orchestrated prompts","复杂工作流":"Complex workflows","自主 Tool Use":"Autonomous tool use",
    "Agent Runtime":"Agent runtime","规则系统":"Rule systems","多工具 Agent":"Multi-tool agents","工程架构":"Engineering architecture",
    "上下文污染":"Context contamination","复杂系统":"Complex systems",
    "知识缺失":"Knowledge gaps","RAG 无结果":"Empty RAG result","高风险回答":"High-risk answers",
    "Research Agent":"Research agents","网络搜索":"Web search","竞争情报":"Competitive intelligence",
    "知识库":"Knowledge bases","企业文档":"Enterprise documents","长期 Memory":"Long-term memory",
    "Agent 无限循环":"Infinite agent loops","过度搜索":"Over-searching","成本失控":"Cost runaway","自主任务":"Autonomous tasks"
  };
  return m[s] || s;
}

function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}

function renderDecision(){
  const t = uiText[lang];
  $("#decisionGrid").innerHTML = decisionData.map((d,i)=>{
    const view = lang==="en" ? {problem:decisionEN[i][0],question:decisionEN[i][1],actions:decisionEN[i][2]} : {problem:d.problem,question:d.question,actions:d.actions};
    const principleButtons = d.principles.map(id=>{
      const p = principles.find(x=>x.id===id);
      const e = lang==="en" ? (principleEN[id]||{}) : {};
      const label = lang==="en" ? (e.name||p.en) : p.name;
      return `<button class="principle-link" data-principle="${id}">${label}</button>`;
    }).join("");
    return `<article class="decision-card">
      <div><div class="decision-label">${t.problemLabel}</div><div class="decision-problem">${view.problem}</div></div>
      <div><div class="decision-label">${t.questionLabel}</div><div class="decision-question">${view.question}</div></div>
      <div><div class="decision-label">${t.principlesLabel}</div><div class="principle-links">${principleButtons}</div></div>
      <div><div class="decision-label">${t.actionsLabel}</div><ul class="action-list">${view.actions.map(x=>`<li>${x}</li>`).join("")}</ul></div>
      <button class="decision-cta" data-decision="${i}">${t.viewPrinciples}</button>
    </article>`;
  }).join("");

  document.querySelectorAll("[data-principle]").forEach(btn=>{btn.onclick=()=>openDetail(btn.dataset.principle);});
  document.querySelectorAll("[data-decision]").forEach(btn=>{
    btn.onclick=()=>{
      const d = decisionData[+btn.dataset.decision];
      state.scenarioIds = d.principles; state.q=""; state.category="全部"; state.layer="全部";
      $("#search").value=""; render();
      window.scrollTo({top:document.querySelector(".meta-row").offsetTop-130,behavior:"smooth"});
    };
  });
}

function render(){
  const t = uiText[lang];
  document.documentElement.lang = lang==="en" ? "en" : "zh-CN";
  $("#eyebrow").textContent = t.eyebrow; $("#mainTitle").innerHTML = t.title; $("#subtitle").textContent = t.subtitle;
  $("#heroNote").textContent = t.hero; $("#search").placeholder = t.search; $("#scenarioTitle").textContent = t.scenarioTitle;
  $("#scenarioDesc").textContent = t.scenarioDesc; $("#decisionTitle").textContent = t.decisionTitle; $("#decisionDesc").textContent = t.decisionDesc;
  $("#reset").textContent = t.reset; $("#themeToggle").textContent = t.theme; $("#langToggle").textContent = t.lang;
  $("#footerText").innerHTML = t.footer; $("#favOnly").textContent=state.favOnly?t.favOn:t.fav;
  renderScenarios(); renderDecision(); renderFilters(); renderCards();
}

$("#search").addEventListener("input",e=>{state.q=e.target.value;state.scenarioIds=null;renderCards()});
$("#favOnly").onclick=()=>{state.favOnly=!state.favOnly;render()};
$("#reset").onclick=()=>{state={category:"全部",layer:"全部",q:"",favOnly:false,scenarioIds:null};$("#search").value="";render();};
$("#dialog").addEventListener("click",e=>{ if(e.target===$("#dialog")) $("#dialog").close(); });
$("#themeToggle").onclick=()=>{theme = theme==="dark" ? "light" : "dark";document.documentElement.dataset.theme = theme;localStorage.setItem("principle-theme", theme);};
$("#langToggle").onclick=()=>{lang = lang==="zh" ? "en" : "zh";localStorage.setItem("principle-lang", lang);render();};
render();
