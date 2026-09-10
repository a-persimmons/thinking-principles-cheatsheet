// v0.5 principle extension 1
principles.push(...[
  {
    "id": "hickam",
    "name": "Hickam 箴言",
    "en": "Hickam's Dictum",
    "category": "诊断与归因",
    "core": "不要假设所有现象都必须由一个原因解释；多个问题可以同时存在。",
    "map": "作为奥卡姆剃刀的制衡：复杂系统的一次故障可能同时包含数据、网络、模型、工具和状态等多个独立根因。",
    "layers": ["Context","Tool","Harness","Loop","Eval"],
    "use": ["复杂根因分析","多故障并发","分布式系统","Agent Debug"],
    "misuse": "不是鼓励无限增加根因；每个候选原因仍需要独立证据。",
    "prompt": "不要强制寻找“唯一根因”。\n分别判断每个异常是否可能拥有独立原因，并建立：现象 → 候选原因 → 独立证据 → 相互作用。"
  },
  {
    "id": "inversion",
    "name": "反演思维",
    "en": "Inversion",
    "category": "决策与行动",
    "core": "当正向求解困难时，先问怎样一定会失败，再反向避免。",
    "map": "设计 Agent 时不仅问“怎样成功”，还系统枚举“怎样会失败”，再把失败转成 Guardrail、Eval 与 fallback。",
    "layers": ["Prompt","Harness","Loop","Eval"],
    "use": ["Failure-first 设计","Prompt 评审","Agent 规划","上线前检查"],
    "misuse": "反演只能发现一部分失败模式，不能替代正向目标和成功标准。",
    "prompt": "先不要设计成功路径。\n先回答：如果我要让这个 Agent 必然失败，最有效的 10 种方式是什么？\n然后把每一项转成可检测信号、预防措施和回归测试。"
  },
  {
    "id": "via-negativa",
    "name": "否定之路",
    "en": "Via Negativa",
    "category": "简化原则",
    "core": "有时通过删除有害因素，比增加新机制更容易改善系统。",
    "map": "Prompt 优化优先考虑去掉冲突指令、噪声 Context、无效 Tool 和脆弱步骤，而不是继续叠加补丁。",
    "layers": ["Prompt","Context","Tool","Loop","Eval"],
    "use": ["Prompt 补丁越来越多","Context 噪音","Tool 过载","系统复杂度上升"],
    "misuse": "删除不是目的；必须通过 Eval 证明删除后更稳或至少不退化。",
    "prompt": "先禁止新增规则。\n从现有系统中寻找可删除项：冲突 instruction、重复 context、低价值 tool、无效步骤。\n逐项做消融实验，优先通过“减法”改善结果。"
  },
  {
    "id": "least-commitment",
    "name": "最小承诺原则",
    "en": "Principle of Least Commitment",
    "category": "决策与行动",
    "core": "在信息不足时，尽量延迟不可逆决定，保留后续选择空间。",
    "map": "Agent 规划中先做可逆、信息增益高的动作，把删除、发送、支付、覆盖等不可逆动作推迟到证据充分时。",
    "layers": ["Tool","Harness","Loop"],
    "use": ["自主 Agent","高影响 Tool","计划生成","不可逆操作"],
    "misuse": "不是拖延所有决策；低风险且时间敏感的任务仍需及时行动。",
    "prompt": "对候选动作标记：可逆性 / 信息增益 / 成本 / 风险。\n在信息不足时优先执行“可逆且能获得更多信息”的动作，把不可逆动作延后。"
  },
  {
    "id": "ashby",
    "name": "必要多样性定律",
    "en": "Ashby's Law of Requisite Variety",
    "category": "系统思维",
    "core": "要稳定控制具有多种状态的系统，控制器必须拥有足够的应对多样性。",
    "map": "如果 Agent 面对很多异常类型，却只有一种模型、一个 Tool、一条 fallback，它无法覆盖真实环境的变化。",
    "layers": ["Tool","Harness","Loop"],
    "use": ["模型路由","Fallback 设计","企业 Agent","长尾异常"],
    "misuse": "不是能力越多越好；多样性应覆盖真实状态空间，否则只是增加复杂度。",
    "prompt": "列出环境可能出现的主要状态与失败类型。\n对每类状态检查 Agent 是否拥有对应的识别信号、工具、模型路由或降级路径。"
  },
  {
    "id": "unintended",
    "name": "非预期后果原则",
    "en": "Law of Unintended Consequences",
    "category": "Agent 控制",
    "core": "一次行动可能产生超出直接目标之外的二阶、三阶影响。",
    "map": "Agent 调 Tool 前不仅判断“能否完成目标”，还要检查副作用、传播范围、后续状态变化和可恢复性。",
    "layers": ["Tool","Harness","Loop","Eval"],
    "use": ["执行型 Agent","自动化","批量操作","外部系统写入"],
    "misuse": "不能因为可能有副作用就禁止自动化；应按影响范围设计验证和权限。",
    "prompt": "执行动作前预测：直接结果 / 二阶影响 / 影响对象 / 是否可回滚 / 最坏后果。\n若副作用超过任务授权范围，不自动执行。"
  },
  {
    "id": "postel",
    "name": "鲁棒性原则",
    "en": "Postel's Law / Robustness Principle",
    "category": "接口与协议",
    "core": "输入可以适度容错，输出应尽量严格、可预测。",
    "map": "面向用户输入可处理口语、缺字段和轻微格式错误；面向下游系统则使用 Schema、类型和稳定协议。",
    "layers": ["Prompt","Tool","Harness"],
    "use": ["结构化输出","Tool Calling","用户输入清洗","API Agent"],
    "misuse": "“宽容输入”在安全边界和协议标准中可能掩盖错误；安全相关输入应严格校验。",
    "prompt": "输入侧：识别可安全修复的轻微格式问题，并记录修复。\n输出侧：严格遵循给定 Schema，不添加未定义字段；无法满足时显式失败。"
  }
]);
Object.assign(principleEN,{
  "hickam":{"name":"Hickam's Dictum","core":"Multiple observed problems may have multiple simultaneous causes.","map":"Counterbalances Occam in complex incidents: data, network, model, tool, and state failures can coexist.","misuse":"Do not multiply causes without evidence.","use":["Complex RCA","Concurrent failures","Distributed systems","Agent debugging"],"prompt":"Do not force a single root cause. Map symptoms to candidate causes, independent evidence, and possible interactions."},
  "inversion":{"name":"Inversion","core":"When forward solving is hard, ask how the system would certainly fail and work backward.","map":"Convert failure modes into guardrails, eval cases, detection signals, and fallbacks.","misuse":"Inversion does not replace a positive objective and success criteria.","use":["Failure-first design","Prompt review","Agent planning","Pre-launch review"],"prompt":"List 10 effective ways this agent could fail. Convert each into a signal, prevention, and regression test."},
  "via-negativa":{"name":"Via Negativa","core":"Removing harmful factors can improve a system more reliably than adding mechanisms.","map":"Before adding prompt patches, remove conflicting instructions, noisy context, low-value tools, and fragile steps.","misuse":"Validate removals with evals.","use":["Prompt patch accumulation","Context noise","Tool overload","Rising complexity"],"prompt":"Temporarily forbid new rules. Use ablation tests to identify what can be safely removed."},
  "least-commitment":{"name":"Principle of Least Commitment","core":"Delay irreversible choices while information is incomplete and preserve optionality.","map":"Prefer reversible, information-gaining actions before delete, send, pay, or overwrite.","misuse":"Do not delay every decision.","use":["Autonomous agents","High-impact tools","Planning","Irreversible actions"],"prompt":"Label actions by reversibility, information gain, cost, and risk. Prefer reversible information-gaining actions first."},
  "ashby":{"name":"Ashby's Law of Requisite Variety","core":"A controller needs enough response variety to regulate environmental variety.","map":"Many failure modes cannot be handled by one model, one tool, and one fallback.","misuse":"More capability is not automatically better.","use":["Model routing","Fallback design","Enterprise agents","Long-tail failures"],"prompt":"Map major environment states and verify a matching signal, tool, route, or degradation path for each."},
  "unintended":{"name":"Law of Unintended Consequences","core":"Actions can produce second- and third-order effects beyond the immediate goal.","map":"Inspect side effects, blast radius, propagation, and recoverability before tool execution.","misuse":"Possible side effects are not an argument against automation.","use":["Action-taking agents","Automation","Batch actions","External writes"],"prompt":"Predict direct result, second-order effects, affected objects, rollback ability, and worst case before acting."},
  "postel":{"name":"Postel's Law / Robustness Principle","core":"Inputs may be handled with controlled tolerance while outputs remain strict and predictable.","map":"Safely normalize human input; produce schema-valid downstream output.","misuse":"Security and protocol boundaries may require strict input validation.","use":["Structured output","Tool calling","Input cleanup","API agents"],"prompt":"Normalize only safely repairable input variation. Follow output schema exactly or fail explicitly."}
});
Object.assign(categoryEN,{"诊断与归因":"Diagnosis & Attribution","决策与行动":"Decision & Action","系统思维":"Systems Thinking","接口与协议":"Interfaces & Protocols","Context Engineering":"Context Engineering","认知偏差":"Cognitive Biases"});
