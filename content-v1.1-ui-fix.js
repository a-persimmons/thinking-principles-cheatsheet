// v1.1 browsing fix: scenario-scoped ids should not survive normal library exploration
(function(){
  function clearScenarioScope(){
    const raw=location.hash.replace(/^#/,"");
    if(!raw.startsWith("/principles?")) return;
    const [path,query=""]=raw.split("?");
    const params=new URLSearchParams(query);
    if(!params.has("ids")) return;
    params.delete("ids");
    const qs=params.toString();
    history.replaceState(null,"",location.pathname+location.search+"#"+path+(qs?"?"+qs:""));
  }
  document.addEventListener("click",e=>{
    if(e.target.closest("[data-cat],[data-layer],#favOnly,#clearFilters")) clearScenarioScope();
  },true);
  document.addEventListener("input",e=>{
    if(e.target && e.target.id==="librarySearch") clearScenarioScope();
  },true);
})();
