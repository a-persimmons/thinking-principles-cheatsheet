// v2.1 — ensure every principle has Trigger / Checklist / Bad Case / Engineering Pattern
(() => {
  const typeByCategory = {
    "简化原则":"Architecture / Simplification",
    "调试与归因":"RCA / Debugging",
    "诊断与归因":"RCA / Debugging",
    "认识论":"Reasoning / Evidence",
    "问题分解":"Planning / Decomposition",
    "表示与语义":"Context / Semantics",
    "语言与语义":"Prompt / Semantics",
    "系统演化":"Architecture / Evolution",
    "评估与指标":"Eval / Metrics",
    "可靠性":"Reliability / Runtime",
    "Agent 控制":"Harness / Control",
    "系统设计":"Architecture / Runtime",
    "中国思想":"Engineering Judgment",
    "决策与行动":"Planning / Decision",
    "系统思维":"Architecture / Systems",
    "接口与协议":"Tool / Interface",
    "Context Engineering":"Context / Data",
    "认知偏差":"Reasoning / Eval"
  };

  const patternByCategory = {
    "简化原则":"Baseline → Remove / simplify one element → Eval → Keep / restore",
    "调试与归因":"Symptom → Competing causes → Evidence → Isolate → Verify root cause",
    "诊断与归因":"Symptom → Competing causes → Evidence → Isolate → Verify root cause",
    "认识论":"Claim → Evidence → Counter-evidence → Confidence → Decision",
    "问题分解":"Goal → Sub-problems → Interfaces / invariants → Solve → Global check",
    "表示与语义":"Intent / reality → Representation → Loss / ambiguity check → Verify against source",
    "语言与语义":"Intent → Definition → Boundary cases → Output contract → Verify",
    "系统演化":"Observed failure → Small hypothesis → Minimal change → Re-eval → Institutionalize",
    "评估与指标":"Goal → Metric → Gaming / bias check → Outcome metric → Audit",
    "可靠性":"Failure mode → Detect → Contain → Recover / degrade → Verify",
    "Agent 控制":"Intent → Risk → Permission / boundary → Action → Verify state",
    "系统设计":"Responsibility → Boundary → Contract / state → Execute → End-to-end verify",
    "中国思想":"Trigger → Principle lens → Concrete engineering action → Counter-check → Eval",
    "决策与行动":"Options → Evidence / value → Risk / reversibility → Choose → Re-observe",
    "系统思维":"System state → Interactions → Constraint / feedback → Intervention → Observe effects",
    "接口与协议":"Precondition → Validate → Execute → Postcondition → Explicit error handling",
    "Context Engineering":"Source → Quality / provenance → Select / transform → Inject → Verify",
    "认知偏差":"Initial judgment → Bias check → Alternative explanation → Evidence → Updated decision"
  };

  const effectByCategory = {
    "简化原则":"复杂度下降了，但真实任务质量、可恢复性或必要能力也被一起删掉",
    "调试与归因":"团队修了最显眼的症状，却没有修复真正导致失败的系统原因",
    "诊断与归因":"团队过早锁定单一解释，后续证据被迫围绕既有结论解释",
    "认识论":"推断被包装成事实，最终结论看似完整但证据链并不成立",
    "问题分解":"局部子任务都完成了，但跨模块依赖和全局约束被遗漏",
    "表示与语义":"中间表示中的丢失或歧义被当成真实事实继续向下传播",
    "语言与语义":"模型表面遵循了文字，却因为概念边界不同而执行了错误意图",
    "系统演化":"系统不断加补丁，却没有降低同类失败再次出现的概率",
    "评估与指标":"指标变好了，但用户真实任务完成率或业务结果没有改善",
    "可靠性":"局部恢复策略放大了故障，最终形成重试风暴、级联失败或不可诊断状态",
    "Agent 控制":"Agent 完成了局部目标，却越权、产生副作用或超出用户合理预期",
    "系统设计":"模块各自返回成功，但最终业务状态仍然错误或不一致",
    "中国思想":"原则被当成格言记住，却没有转成可观察的工程约束和验证动作",
    "决策与行动":"Agent 做了看似合理的下一步，但信息价值、代价或可逆性并未被比较",
    "系统思维":"只优化局部组件，结果把复杂度、风险或负载转移到了系统其他位置",
    "接口与协议":"调用双方对输入、状态或失败语义理解不一致，错误在链路中继续扩散",
    "Context Engineering":"模型被要求修复本应由数据、检索或上下文治理解决的问题",
    "认知偏差":"第一印象或样本偏差主导后续判断，系统得到稳定但系统性错误的结论"
  };

  const actionByCategory = {
    "简化原则":"判断哪些复杂度真的必要",
    "调试与归因":"定位真正的故障原因而不是停在症状",
    "诊断与归因":"比较多个竞争根因并寻找区分证据",
    "认识论":"区分事实、推断、不确定性与反证",
    "问题分解":"把复杂目标拆成可验证且能重新组合的子问题",
    "表示与语义":"检查现实、上下文表示和模型理解之间的信息损失",
    "语言与语义":"减少概念歧义并建立可执行定义",
    "系统演化":"判断该修一个 case 还是改变系统规则",
    "评估与指标":"确认指标是否仍然代表用户真实目标",
    "可靠性":"为可预见失败设计检测、隔离、恢复和降级",
    "Agent 控制":"限制 Agent 的权限、副作用和自主边界",
    "系统设计":"把责任、状态、接口和最终验收放到正确层级",
    "中国思想":"把抽象判断转成工程动作并寻找制衡条件",
    "决策与行动":"在不确定性、收益、成本和可逆性之间做下一步选择",
    "系统思维":"从局部现象转向反馈、依赖和整体约束",
    "接口与协议":"让模块之间的前置条件、输出保证和错误语义一致",
    "Context Engineering":"判断问题来自模型还是来自输入、检索与上下文链路",
    "认知偏差":"检查当前判断是否被顺序、样本或先入结论系统性影响"
  };

  const actionByCategoryEN = {
    "简化原则":"decide which complexity is actually necessary",
    "调试与归因":"locate the real failure cause instead of stopping at the symptom",
    "诊断与归因":"compare competing root causes and seek discriminating evidence",
    "认识论":"separate facts, inference, uncertainty, and counter-evidence",
    "问题分解":"decompose a complex goal into verifiable parts that can be recombined",
    "表示与语义":"check information loss between reality, representation, and model interpretation",
    "语言与语义":"reduce ambiguity and create operational definitions",
    "系统演化":"decide whether to patch a case or change the governing system rule",
    "评估与指标":"verify that metrics still represent the real user outcome",
    "可靠性":"design detection, containment, recovery, and degradation for predictable failures",
    "Agent 控制":"bound agent permissions, side effects, and autonomy",
    "系统设计":"place responsibility, state, contracts, and verification in the right layer",
    "中国思想":"translate an abstract judgment into engineering action and a counter-check",
    "决策与行动":"choose the next action under uncertainty, value, cost, and reversibility",
    "系统思维":"reason about feedback, dependencies, and system-wide constraints",
    "接口与协议":"align preconditions, guarantees, and error semantics across modules",
    "Context Engineering":"separate model problems from data, retrieval, and context-pipeline problems",
    "认知偏差":"check whether order, sampling, or an early hypothesis is systematically biasing judgment"
  };

  const clean = s => String(s || "").replace(/[。.!！]+$/g, "");
  const usesZh = p => (p.use || []).filter(Boolean);
  const usesEn = p => ((principleEN[p.id] || {}).use || []).filter(Boolean);
  const relatedNamesZh = p => (p.combine || []).map(id => principles.find(x=>x.id===id)?.name).filter(Boolean);
  const relatedNamesEn = p => (p.combine || []).map(id => {
    const r=principles.find(x=>x.id===id); if(!r) return null;
    const e=principleEN[r.id]||{}; return e.name||r.en||r.name;
  }).filter(Boolean);

  function triggerZh(p){
    const us=usesZh(p).slice(0,2);
    const scene=us.length?`「${us.join(" / ")}」`:`${p.category}`;
    return `当你在${scene}中需要${actionByCategory[p.category] || "校正当前工程判断"}时，想起「${p.name}」。`;
  }
  function triggerEn(p){
    const e=principleEN[p.id]||{};
    const us=usesEn(p).slice(0,2);
    const scene=us.length?` in ${us.join(" / ")}`:"";
    return `Think of ${e.name||p.en||p.name}${scene} when you need to ${actionByCategoryEN[p.category] || "correct the current engineering judgment"}.`;
  }

  function checklistZh(p){
    const list=[];
    if(p.premise) list.push(`当前问题是否真的满足适用前提：${clean(p.premise)}？`);
    else list.push(`当前问题是否真的属于「${p.name}」能改善的场景，而不是只因为这个原则听起来合理？`);
    list.push(`应用这个原则后，具体要改变哪个工程对象：${(p.layers||[]).join(" / ") || "Prompt / Context / Tool / Harness / Loop / Eval"}？`);
    if(p.failure) list.push(`是否已经触发它的失效条件：${clean(p.failure)}？`);
    else list.push(`有没有一个反例能证明当前不应该继续套用「${p.name}」？`);
    const rel=relatedNamesZh(p).slice(0,3);
    if(rel.length) list.push(`是否需要用「${rel.join(" / ")}」来制衡或补足当前判断？`);
    else list.push(`用什么 Eval、日志、状态或业务结果验证应用这个原则后真的变好了？`);
    return list;
  }

  function checklistEn(p){
    const e=principleEN[p.id]||{};
    const list=[];
    if(e.premise || p.premise) list.push(`Does the current problem actually satisfy the principle's preconditions?`);
    else list.push(`Is this really a case where ${e.name||p.en||p.name} improves the decision, rather than merely sounding plausible?`);
    list.push(`Which engineering object should actually change: ${(p.layers||[]).join(" / ") || "Prompt / Context / Tool / Harness / Loop / Eval"}?`);
    if(e.failure || p.failure) list.push(`Have any known failure or balancing conditions already been triggered?`);
    else list.push(`What counterexample would show that this principle should not be applied further?`);
    const rel=relatedNamesEn(p).slice(0,3);
    if(rel.length) list.push(`Should the judgment be balanced with ${rel.join(" / ")}?`);
    else list.push(`Which eval, trace, state check, or business outcome will verify that the change actually helped?`);
    return list;
  }

  function badCaseZh(p){
    const us=usesZh(p); const scene=us[0] || p.category;
    const misuse=clean(p.misuse || "团队把原则机械套用，没有检查适用前提");
    const effect=effectByCategory[p.category] || "系统看似遵循原则，但真实结果没有改善";
    return `在「${scene}」场景中，团队把「${p.name}」直接当成规则套用。${misuse}。结果：${effect}。`;
  }
  function badCaseEn(p){
    const e=principleEN[p.id]||{}; const us=usesEn(p); const scene=us[0] || (categoryEN[p.category]||p.category);
    const misuse=clean(e.misuse || "the team applies the principle mechanically without checking its assumptions");
    return `In a ${scene} case, the team turns ${e.name||p.en||p.name} into a slogan or hard rule. ${misuse}. The system appears principled, but the real task outcome or failure rate does not improve.`;
  }

  principles.forEach(p => {
    p.trigger = p.trigger || triggerZh(p);
    p.checklist = Array.isArray(p.checklist) && p.checklist.length ? p.checklist : checklistZh(p);
    p.badCase = p.badCase || badCaseZh(p);
    p.engineeringType = p.engineeringType || typeByCategory[p.category] || ((p.layers||[]).join(" / ") || "Engineering");
    p.engineeringPattern = p.engineeringPattern || patternByCategory[p.category] || `Trigger → ${p.name} lens → Concrete action → Verify → Balance`;

    // English handbook metadata is separate so Chinese hand-curated content remains untouched.
    p.triggerEN = p.triggerEN || triggerEn(p);
    p.checklistEN = Array.isArray(p.checklistEN) && p.checklistEN.length ? p.checklistEN : checklistEn(p);
    p.badCaseEN = p.badCaseEN || badCaseEn(p);
    p.engineeringTypeEN = p.engineeringTypeEN || p.engineeringType;
    p.engineeringPatternEN = p.engineeringPatternEN || patternByCategory[p.category] || `Trigger → Principle lens → Concrete action → Verify → Balance`;
  });

  window.engineeringHandbookCoverage = {
    total: principles.length,
    enhanced: principles.filter(p => p.trigger && p.checklist?.length && p.badCase && p.engineeringPattern).length
  };
})();
