const scenarioData = [
  ["Prompt 太长","删了怕出问题，留着又越来越臃肿",["occam","chesterton","pareto"]],
  ["模型经常幻觉","不知道、推断、事实混在一起",["know-unknown","hitchens","sagan"]],
  ["根因分析不可靠","模型只会找支持自己结论的证据",["popper","bayes","mohist"]],
  ["RAG 信息不可信","检索出来了，但不代表它就是真的",["map-territory","books","multi-source"]],
  ["Agent 不停循环","一直搜索、一直反思，不知道何时结束",["know-stop","occam","end-to-end"]],
  ["Eval 被刷分","指标越来越高，真实体验却没有变好",["goodhart","campbell","pareto"]],
  ["工具权限太大","一个小任务却拥有高风险操作能力",["least-privilege","least-surprise","sagan"]],
  ["Prompt 规定得太死","步骤很多，自主 Agent 反而变笨",["wuwei","first-principles","occam"]],
  ["线上失败难定位","大家最后都归结为“模型不稳定”",["hanlon","dependent","murphy"]],
  ["抽象要求不稳定","“专业”“严重”“相关”每次理解不同",["rectification","xunzi","grice"]],
  ["Tool 成功但任务失败","接口返回 200，却没有真正达到目标",["end-to-end","murphy","least-surprise"]],
  ["不知道该用什么架构","Single Call、Agent、Loop、Multi-Agent 乱选",["first-principles","occam","fashushi"]]
];

const scenarioEN = [
  ["Prompt is too long","Removing parts feels risky, but the prompt keeps growing"],
  ["The model hallucinates","Facts, inference, and unknowns are mixed together"],
  ["Root-cause analysis is weak","The model only looks for evidence supporting itself"],
  ["RAG context is unreliable","Retrieved does not automatically mean true"],
  ["The agent never stops","It keeps searching and reflecting without a clear end"],
  ["Eval is being gamed","Scores rise while real quality does not"],
  ["Tool permissions are too broad","A small task has high-impact capabilities"],
  ["The prompt over-scripts the agent","Too many prescribed steps reduce autonomy"],
  ["Production failures are hard to locate","Everything gets blamed on 'model instability'"],
  ["Abstract requirements drift","Words like 'professional' or 'severe' mean different things each run"],
  ["Tool succeeded, task failed","The API returned success but the business goal was not reached"],
  ["Architecture choice is unclear","Single Call, Agent, Loop, and Multi-Agent are chosen inconsistently"]
];

const decisionData = [
  {problem:"Prompt 越来越长，谁都不敢删",question:"哪些内容一旦删除，会让可观测指标变差？哪些只是历史遗留或心理安慰？",principles:["occam","chesterton","pareto"],actions:["给每一段 Prompt 标注功能与目标指标","对可疑段落做 ablation test","先查历史 bad case，再删除旧规则","保留最小充分信息，而不是追求最短"]},
  {problem:"模型幻觉，但团队只会说“模型不稳定”",question:"这是知识缺失、证据不足、上下文污染、工具结果错误，还是模型能力本身的问题？",principles:["know-unknown","hanlon","dependent","hitchens"],actions:["把输出拆成 Known / Inferred / Unknown","按 Input → Context → Prompt → Model → Tool → Runtime 分层归因","关键结论强制绑定 evidence","没有证据时允许输出 Unknown，而不是补全"]},
  {problem:"根因分析总能讲通，但经常讲错",question:"这个假设如何被推翻？有没有同样能解释现象的替代原因？",principles:["popper","bayes","mohist","sagan"],actions:["先提出 2–3 个候选假设，而不是单一结论","为每个假设写出 falsifier","主动寻找反证与替代解释","新证据到来时更新置信度与排序"]},
  {problem:"RAG 检索到了内容，但答案依旧不可信",question:"检索结果是原始事实，还是对现实的某种表示？来源是否过期、冲突或被污染？",principles:["map-territory","books","multi-source"],actions:["区分原始来源、摘要、chunk、embedding 与模型推断","检查来源、时间、版本和权威性","关键事实做多源交叉验证","Context 中出现的信息不得自动视为真"]},
  {problem:"Agent 一直搜索、一直反思，停不下来",question:"继续执行还能带来多少新增价值？什么时候算真正完成？",principles:["know-stop","occam","end-to-end"],actions:["定义 Done Criteria","设置最大迭代次数与成本预算","定义继续搜索的最小边际收益","结束前验证最终业务状态，而不是仅看 tool success"]},
  {problem:"Agent 步骤写得非常细，自主性却越来越差",question:"哪些步骤是业务硬约束，哪些只是我们替模型做了不必要的微观决策？",principles:["wuwei","first-principles","occam"],actions:["只固定目标、边界、工具和完成条件","去掉非必要的固定步骤顺序","用 Eval 比较固定流程与自主规划的成功率","业务硬约束才保留成不可违反步骤"]},
  {problem:"Eval 分数不断提高，但真实体验没变好",question:"模型是不是学会了优化指标，而不是优化任务本身？",principles:["goodhart","campbell","pareto"],actions:["加入真实 task success 指标","增加人工抽检与反作弊样本","避免单一 KPI 决定上线","按失败贡献度优先修主要 bad cases"]},
  {problem:"工具很多、权限很大，Agent 看起来很强但风险高",question:"完成当前任务真正需要哪些能力？哪些权限只是因为“以后可能用到”才被开放？",principles:["least-privilege","least-surprise","sagan"],actions:["按任务生成最小 tool / scope 集合","高影响操作要求更高确认门槛","超出用户合理预期的动作不自动执行","敏感权限按需临时提升，而不是默认开放"]},
  {problem:"Tool 返回成功，但最终任务还是失败",question:"我们验证的是“接口成功”，还是用户真正想要的最终状态？",principles:["end-to-end","murphy","least-surprise"],actions:["明确最终业务成功条件","执行后重新读取目标状态","把工具成功与任务成功分开记录","为状态不一致设计补偿或回滚路径"]},
  {problem:"抽象要求每次都被模型理解成不同意思",question:"“专业、严重、相关、完整”这些词能不能被观察和判定？",principles:["rectification","xunzi","grice"],actions:["给关键术语建立 operational definition","补充包含条件、排除条件与边界案例","把主观词映射到可观察指标","用 few-shot 展示这些概念在真实样例中的用法"]},
  {problem:"不知道该用 Single Call、Agent、Loop 还是 Multi-Agent",question:"当前任务最少需要哪些能力，才可以稳定完成？",principles:["first-principles","occam","fashushi"],actions:["先从 Single Call 设计","只有需要外部行动时再引入 Tool","只有需要多轮观察—行动时再引入 Loop","只有角色分工确实产生增益时再引入 Multi-Agent"]},
  {problem:"线上出现新失败，系统却只有 Happy Path",question:"哪些失败是可预见的？每个失败能否被检测、恢复、降级或终止？",principles:["murphy","hanlon","end-to-end"],actions:["建立 Failure Matrix","为 timeout、malformed JSON、空检索、超窗、循环不收敛分别设计处理","区分 retry、fallback、fail-fast、human escalation","把失败路径纳入回归 Eval"]}
];

const decisionEN = [
  ["The prompt keeps growing and nobody dares remove anything","Which sections measurably affect quality when removed, and which are legacy baggage or psychological comfort?",["Label every prompt section with its function and target metric","Run ablation tests on suspicious sections","Check the historical bad case before removing old rules","Keep the minimum sufficient prompt, not the shortest prompt"]],
  ["The model hallucinates and the team only says 'model instability'","Is the cause missing knowledge, weak evidence, contaminated context, bad tool output, or the model capability itself?",["Separate output into Known / Inferred / Unknown","Debug by layer: Input → Context → Prompt → Model → Tool → Runtime","Bind key claims to evidence","Allow Unknown instead of forcing completion"]],
  ["Root-cause analysis always sounds plausible but is often wrong","What observation would falsify this hypothesis, and what alternative explanation fits the same evidence?",["Start with 2–3 candidate hypotheses","Write a falsifier for each hypothesis","Actively search for counter-evidence and alternatives","Update confidence and ranking as evidence changes"]],
  ["RAG retrieved content, but the answer is still unreliable","Is the retrieved passage a source fact or only a representation of reality? Is it stale, conflicting, or poisoned?",["Separate source facts from summaries, chunks, embeddings, and inferences","Check source, date, version, and authority","Cross-check key facts with independent sources","Never treat Context presence as proof of truth"]],
  ["The agent keeps searching and reflecting without stopping","How much marginal value can another step add, and what exactly counts as done?",["Define Done Criteria","Set iteration and cost budgets","Define a minimum expected gain for further search","Verify final business state before termination"]],
  ["The agent is over-scripted and becomes less autonomous","Which steps are true business constraints, and which are unnecessary micro-management?",["Fix only goals, boundaries, tools, and completion criteria","Remove unnecessary step ordering","Compare fixed workflow vs autonomous planning with evals","Keep only real business invariants as mandatory steps"]],
  ["Eval scores rise but real user experience does not","Is the model optimizing the metric instead of the task?",["Add real task-success metrics","Add human spot checks and anti-gaming cases","Avoid a single KPI as the launch gate","Prioritize the bad cases causing most failures"]],
  ["The agent has many tools and broad permissions","Which capabilities are truly required for this task, and which are enabled only because they might be useful someday?",["Generate a minimum tool/scope set per task","Raise confirmation thresholds for high-impact actions","Do not auto-execute actions beyond reasonable user expectation","Escalate sensitive permissions only when needed"]],
  ["The tool returned success, but the task still failed","Are we validating API success or the final state the user actually wanted?",["Define final business success","Re-read target state after execution","Track tool success separately from task success","Design compensation or rollback for inconsistent state"]],
  ["Abstract requirements mean something different every run","Can words like professional, severe, relevant, and complete be observed and judged consistently?",["Create operational definitions for key terms","Add inclusion, exclusion, and boundary cases","Map subjective words to observable criteria","Use few-shot examples to demonstrate the intended meaning"]],
  ["It is unclear whether to use Single Call, Agent, Loop, or Multi-Agent","What is the least amount of capability needed to solve this task reliably?",["Start from Single Call","Add tools only when external action is needed","Add a loop only when repeated observe–act cycles are needed","Add Multi-Agent only when real role specialization creates value"]],
  ["New production failures appear, but the system only has a happy path","Which failures are foreseeable, and can each be detected, recovered, degraded, or terminated safely?",["Build a Failure Matrix","Handle timeout, malformed JSON, empty retrieval, overflow, and non-convergence separately","Choose retry / fallback / fail-fast / human escalation explicitly","Include failure paths in regression evals"]]
];

const uiText = {
  zh:{eyebrow:"Thinking Principles × Agent Engineering",title:"思想原则<br>工程速查表",subtitle:"不是背哲学名词，而是在设计 Prompt、Context、Tool、Harness、Loop、Eval 时，快速找到一个合适的“思考框架”。",hero:"使用方式：优先从“我现在遇到什么问题？”进入；也可以直接搜索原则、场景或关键词。卡片中的工程映射是现代工程类比，不等同于原思想的完整哲学含义。",search:"搜索：幻觉 / Prompt 太长 / 根因分析 / RAG / 权限 / 证据 / 循环……",fav:"☆ 收藏",favOn:"★ 仅收藏",reset:"清空筛选",scenarioTitle:"我现在遇到什么问题？",scenarioDesc:"从工程症状反查思想原则",decisionTitle:"从问题走到动作",decisionDesc:"工程问题 → 判断问题 → 思想原则 → 可执行动作",problemLabel:"工程问题",questionLabel:"判断问题",principlesLabel:"思想原则",actionsLabel:"可执行动作",viewPrinciples:"只看这些原则 →",allLayer:"全部工程层",showing:"显示",items:"条原则",scenarioRec:" · 当前为场景推荐",open:"查看适用场景、误用与 Prompt 示例 →",use:"适用场景",misuse:"常见误用",prompt:"可直接借鉴的 Prompt 模式",empty:"没有匹配结果。换一个关键词或清空筛选。",theme:"◐ 主题",lang:"EN",footer:"v0.3 · 目标：把哲学、逻辑学、方法论与 LLM / Agent Engineering 建立可检索映射。<br>原则应通过实际 Eval、失败案例和工程实验验证，而不是把哲学名言当作新的“Prompt 咒语”。"},
  en:{eyebrow:"Thinking Principles × Agent Engineering",title:"Thinking Principles<br>Engineering Cheat Sheet",subtitle:"Not a list of philosophy terms, but a way to quickly find useful thinking frameworks while designing Prompts, Context, Tools, Harnesses, Loops, and Evals.",hero:"Start from “What problem am I facing?” or search directly by principle, scenario, or keyword. Engineering mappings are modern analogies and do not claim to reproduce the full original philosophy.",search:"Search: hallucination / long prompt / RCA / RAG / permissions / evidence / loop…",fav:"☆ Favorites",favOn:"★ Favorites only",reset:"Clear filters",scenarioTitle:"What problem am I facing?",scenarioDesc:"Reverse-map engineering symptoms to thinking principles",decisionTitle:"From Problem to Action",decisionDesc:"Engineering problem → Judgment question → Thinking principles → Executable actions",problemLabel:"Engineering problem",questionLabel:"Judgment question",principlesLabel:"Thinking principles",actionsLabel:"Executable actions",viewPrinciples:"Show only these principles →",allLayer:"All engineering layers",showing:"Showing",items:"principles",scenarioRec:" · scenario recommendations",open:"View use cases, misuse, and prompt pattern →",use:"Use cases",misuse:"Common misuse",prompt:"Reusable prompt pattern",empty:"No matching results. Try another keyword or clear filters.",theme:"◐ Theme",lang:"中文",footer:"v0.3 · Goal: build a searchable mapping from philosophy, logic, and methodology to LLM / Agent Engineering.<br>Principles should be validated through evals, failure cases, and engineering experiments—not treated as new prompt incantations."}
};
