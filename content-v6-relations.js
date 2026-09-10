// v0.6 relation metadata for existing principles
const relationPatches = {
  "occam":{premise:"存在多个能完成任务的解释、Prompt 结构或架构方案，需要减少不必要复杂度。",failure:"当真实问题本身包含多个独立原因或硬约束时，过度简化会丢失关键事实。",combine:["hickam","chesterton","via-negativa"]},
  "hickam":{premise:"复杂系统中存在多个异常现象，而且单一根因无法解释全部证据。",failure:"如果没有独立证据就不断增加根因，会把不确定性伪装成复杂性。",combine:["occam","popper","correlation-causation"]},
  "popper":{premise:"当前结论属于可被新证据推翻的假设，而不是定义或硬规则。",failure:"如果所谓‘反证’无法真正改变结论，证伪步骤会退化成形式化唱反调。",combine:["confirmation-bias","bayes","correlation-causation"]},
  "bayes":{premise:"任务会持续获得新证据，而且候选假设的可信度需要动态变化。",failure:"模型自报概率没有校准时，不应把数值当精确统计概率。",combine:["value-of-information","base-rate","popper"]},
  "wuwei":{premise:"模型或 Agent 有足够能力自主选择路径，且任务步骤并非业务硬约束。",failure:"安全、合规、事务一致性等硬步骤不能为了‘自主性’省略。",combine:["least-privilege","know-stop","guoyoubuji"]},
  "goodhart":{premise:"系统通过可量化指标进行优化、比较或奖励。",failure:"如果指标本身就是最终目标且不可被投机，Goodhart 风险较低。",combine:["campbell","principal-agent","simpsons-paradox"]},
  "map-territory":{premise:"模型接触的是摘要、chunk、embedding、Memory 或工具返回等现实表示。",failure:"如果输入本身就是权威原始事实源，则表示损失问题相对较弱。",combine:["ssot","gigo","evidence-absence"]},
  "least-privilege":{premise:"Agent 能调用具有外部副作用或敏感数据访问的工具。",failure:"权限切得过细会造成频繁升级和任务无法完成，需要与任务能力匹配。",combine:["fail-safe-defaults","proportionality","defense-depth"]},
  "fail-fast":{premise:"存在明确不可恢复的前置条件，继续执行只会浪费资源或生成伪结果。",failure:"可恢复的临时错误若直接终止，会降低系统韧性。",combine:["postel","murphy","defense-depth"]},
  "galls-law":{premise:"正在从零构建复杂 Agent 系统，尚未证明复杂组件确实必要。",failure:"过于简单的原型如果没有演化边界，也可能形成不可扩展结构。",combine:["no-free-lunch","ashby","first-principles"]},
  "know-stop":{premise:"任务允许用成功条件、预算或边际收益定义终止。",failure:"如果遗漏关键信息会产生重大风险，过早停止比成本超支更严重。",combine:["satisficing","value-of-information","end-to-end"]},
  "via-negativa":{premise:"系统复杂度已持续上升，且大量新增规则缺少明确增益证据。",failure:"如果真正缺少必要能力，单纯做减法无法解决能力缺口。",combine:["occam","sharpen-tools","double-loop"]},
  "end-to-end":{premise:"任务结果可以通过最终业务状态或外部环境重新验证。",failure:"最终状态不可观察时，需要使用代理指标，但要明确代理风险。",combine:["principal-agent","guanyanxing","goodhart"]},
  "ashby":{premise:"真实环境具有多种状态和长尾失败，单一路径覆盖不足。",failure:"为极少出现且低影响状态增加大量能力，会造成不必要复杂度。",combine:["galls-law","bounded-rationality","pareto"]},
  "gigo":{premise:"模型依赖外部数据、RAG、Memory、OCR 或 Tool output。",failure:"输入质量足够好后，继续数据清洗的边际收益可能低于模型或流程优化。",combine:["map-territory","ssot","practice-truth"]}
};
Object.entries(relationPatches).forEach(([id,patch])=>{const p=principles.find(x=>x.id===id);if(p)Object.assign(p,patch);});
Object.assign(principleEN,{
  "occam":{...principleEN["occam"],premise:"Several explanations or architectures can solve the task and unnecessary complexity should be removed.",failure:"Oversimplification loses truth when the real problem has multiple independent causes or hard constraints."},
  "hickam":{...principleEN["hickam"],premise:"Several symptoms in a complex system are not explained by one cause.",failure:"Adding causes without independent evidence only disguises uncertainty as complexity."},
  "popper":{...principleEN["popper"],premise:"The conclusion is a hypothesis that new evidence could actually overturn.",failure:"If counter-evidence cannot change the conclusion, falsification becomes performative disagreement."},
  "bayes":{...principleEN["bayes"],premise:"New evidence arrives over time and hypothesis confidence must update.",failure:"Uncalibrated model percentages should not be treated as exact probabilities."},
  "wuwei":{...principleEN["wuwei"],premise:"The agent can choose its own path and step order is not a hard business invariant.",failure:"Safety, compliance, and transactional invariants cannot be removed in the name of autonomy."},
  "goodhart":{...principleEN["goodhart"],premise:"The system is optimized, compared, or rewarded through measurable indicators.",failure:"Risk is lower when the metric is the actual final objective and is difficult to game."},
  "map-territory":{...principleEN["map-territory"],premise:"The model sees representations such as summaries, chunks, memory, embeddings, or tool output.",failure:"Representation loss matters less when the input itself is the authoritative primary source."},
  "least-privilege":{...principleEN["least-privilege"],premise:"The agent can invoke tools with side effects or sensitive access.",failure:"Overly narrow permissions can create constant escalation and task failure."},
  "fail-fast":{...principleEN["fail-fast"],premise:"A non-recoverable prerequisite is missing and continuing would waste resources or fabricate output.",failure:"Recoverable transient errors should often retry or fall back instead of terminating."},
  "galls-law":{...principleEN["galls-law"],premise:"A complex agent is being built before its complex components have demonstrated necessity.",failure:"A simple prototype still needs a credible path for evolution."},
  "know-stop":{...principleEN["know-stop"],premise:"Completion, budget, or marginal-gain criteria can meaningfully define termination.",failure:"When missing evidence has severe consequences, stopping early may be worse than extra cost."},
  "via-negativa":{...principleEN["via-negativa"],premise:"Complexity keeps growing and many added rules lack evidence of value.",failure:"Subtraction cannot solve a genuine missing-capability problem."},
  "end-to-end":{...principleEN["end-to-end"],premise:"The final business state or external result can be re-observed.",failure:"When final state is unobservable, proxy metrics are necessary but should be treated as proxies."},
  "ashby":{...principleEN["ashby"],premise:"The environment has many states and long-tail failures that one response path cannot cover.",failure:"Adding capability for rare low-impact states can create more complexity than value."},
  "gigo":{...principleEN["gigo"],premise:"The model depends on RAG, memory, OCR, external data, or tool outputs.",failure:"Once inputs are good enough, further cleanup may have less value than model or workflow improvements."}
});