// v0.6 scenarios and decision cards
scenarioData.push(...[
  ["下一次 Tool Call 到底值不值得做","信息可能有用，但每次检索都有成本",["value-of-information","expected-value","know-stop"]],
  ["Agent 搜索太少或太多","太早锁定答案，或一直探索不行动",["explore-exploit","satisficing","bounded-rationality"]],
  ["分类阈值怎么设都不满意","降低误报会增加漏报，反过来也一样",["signal-detection","proportionality","sorites"]],
  ["总体 Eval 变好，部分场景却变差","聚合指标可能掩盖子群退化",["simpsons-paradox","goodhart","survivorship"]],
  ["日志指标一起上涨，就被当成根因","相关性被误当成因果关系",["correlation-causation","popper","base-rate"]],
  ["RAG 没搜到就说不存在","空检索结果被误当成否定证据",["evidence-absence","map-territory","gigo"]],
  ["Agent 指标很好但用户目标没完成","代理指标和真实目标发生偏离",["principal-agent","goodhart","end-to-end"]],
  ["不同场景都套同一个 Agent 架构","问题类型不同，流程却完全一样",["cynefin","no-free-lunch","yindizhiyi"]],
  ["系统一直追求最优，迟迟不结束","有限资源下缺少‘足够好’标准",["satisficing","bounded-rationality","know-stop"]],
  ["高风险动作和普通动作同样处理","审批和验证强度没有按风险分级",["proportionality","sansi","defense-depth"]],
  ["Prompt、Context、Tool 越加越多","每个环节都存在过量反噬",["guoyoubuji","occam","wuwei"]],
  ["文档和 Demo 很漂亮，上线却不稳","纸面理解没有经过真实环境验证",["practice-truth","galls-law","survivorship"]]
]);
scenarioEN.push(...[
  ["Is the next tool call worth it?","Information may help, but every search has a cost"],
  ["The agent explores too little or too much","It locks in too early or keeps searching forever"],
  ["No classification threshold feels right","Reducing false positives increases false negatives, and vice versa"],
  ["Overall eval improves while some scenarios regress","Aggregate metrics may hide subgroup failures"],
  ["Two metrics move together and one is called the root cause","Correlation is being promoted to causation"],
  ["RAG found nothing, so the answer says it does not exist","An empty search is treated as negative proof"],
  ["Agent metrics look good but the user goal is unmet","Proxy metrics diverge from the real objective"],
  ["Every problem uses the same agent architecture","Different problem domains receive identical orchestration"],
  ["The system keeps optimizing and never finishes","There is no good-enough threshold under bounded resources"],
  ["High-risk and routine actions receive the same controls","Approval and validation are not risk-proportional"],
  ["Prompt, context, and tools keep accumulating","Every layer can suffer from too much of a good thing"],
  ["Docs and demos look great but production is unstable","Theory has not been validated in real conditions"]
]);

decisionData.push(...[
  {problem:"每次搜索、Tool Call 都‘可能有用’，Agent 不知道下一步先查什么",question:"哪一条新信息最可能改变当前判断或下一步行动？",principles:["value-of-information","expected-value","bayes","know-stop"],actions:["列出当前关键不确定性，而不是列所有可查信息","给候选查询标注它能区分哪些假设","优先执行可能改变决策且成本较低的查询","如果新信息不会改变行动，则停止继续查"]},
  {problem:"Agent 有时过早下结论，有时又无限搜索",question:"现在应该继续探索新方案，还是利用当前最佳方案执行？",principles:["explore-exploit","satisficing","bounded-rationality","know-stop"],actions:["检查当前最佳方案的证据强度","只探索会显著减少关键不确定性的方向","定义 acceptable threshold 与最大预算","达到阈值后转入执行，不再为微小增益继续探索"]},
  {problem:"意图识别、审核或 RAG relevance 的阈值一直调不对",question:"False Positive 和 False Negative 哪一种对业务更贵？",principles:["signal-detection","proportionality","sorites","sagan"],actions:["分别统计 FP 与 FN，而不是只看 accuracy","给两类错误定义真实业务成本","按风险等级设置不同阈值","为边界区域增加 uncertain / review 状态"]},
  {problem:"整体成功率提高了，但中文、长输入或 Tool 场景明显退化",question:"总体指标是否正在掩盖重要子群体中的反向趋势？",principles:["simpsons-paradox","goodhart","survivorship","pareto"],actions:["按语言、任务类型、长度、Tool 使用、风险等级切片","同时报告总体与关键子群指标","检查样本占比变化是否制造了总体提升","把重要退化子群加入固定回归集"]},
  {problem:"数据库 CPU 和错误率同时升高，于是模型直接判断 CPU 是根因",question:"当前证据证明的是相关关系，还是存在可验证的因果机制？",principles:["correlation-causation","popper","base-rate","mohist"],actions:["检查时间先后关系","寻找共同原因和替代解释","定义能够推翻该根因的反事实或观察","只有机制与证据链成立时才升级为根因"]},
  {problem:"RAG 没搜到某条规则，Agent 就回答‘没有这个规则’",question:"如果规则真实存在，当前检索系统有多大概率能搜到它？",principles:["evidence-absence","map-territory","gigo","multi-source"],actions:["先检查索引覆盖、chunk、过滤条件和权限","估计该类型文档的检索召回能力","必要时更换查询方式或直接查 Source of Truth","只有高可观测性下持续缺失，才把空结果当反证"]},
  {problem:"Agent 的 Tool success、任务完成次数都很好，但用户实际结果经常没达成",question:"系统优化的是用户真实目标，还是一个容易测量的代理指标？",principles:["principal-agent","goodhart","end-to-end","guanyanxing"],actions:["明确用户最终想得到的真实状态","列出当前所有 proxy metrics","设计‘刷指标但没完成任务’的反例","上线验收回到最终业务状态而不是中间成功信号"]},
  {problem:"团队纠结到底应该 Single Call、固定 Workflow、Agent Loop 还是 Multi-Agent",question:"这个问题属于清晰、复杂可分析、复杂涌现还是混乱状态？",principles:["cynefin","no-free-lunch","first-principles","yindizhiyi"],actions:["先判断因果关系是否清晰且稳定","清晰任务优先规则和 Single Call","复杂但可分析任务使用工具化流程","只有需要试探—反馈或真实角色分工时再增加 Agent 复杂度"]},
  {problem:"任务有 256K Context、有限 token 和时间，却仍要求 Agent 把所有路径都研究完",question:"有限资源下，达到什么质量就足以做决定？",principles:["bounded-rationality","satisficing","value-of-information","pareto"],actions:["显式声明 Context、token、Tool Call 和时间预算","定义不可妥协的硬条件","优先读取最可能改变结论的信息","达到最低可接受质量后停止低收益优化"]},
  {problem:"读文件、发邮件、删数据、改生产配置都走同一套 Agent 授权",question:"这些动作的影响范围、可逆性和失败代价真的一样吗？",principles:["proportionality","sansi","least-privilege","defense-depth"],actions:["按影响范围与可逆性给 Tool 分级","低风险只读允许自动执行","中风险增加结果验证","高风险不可逆动作增加确认、权限隔离与多层防护"]},
  {problem:"为了提升效果，不断增加 Prompt、Context、Tool 和 Reflection 次数",question:"当前问题真的是‘不够多’，还是已经进入边际收益递减甚至过载区？",principles:["guoyoubuji","occam","via-negativa","wuwei"],actions:["分别测试太少和太多两端的失败表现","对 Prompt/Context/Tool 数量做消融实验","优先删除冲突和低价值元素","用 Eval 找到‘足够但不过量’的工作区间"]},
  {problem:"框架文档、Benchmark、Demo 都证明方案很强，但真实项目上线后问题很多",question:"哪些结论只在纸面或模拟环境成立，哪些经过真实任务验证？",principles:["practice-truth","galls-law","survivorship","end-to-end"],actions:["把关键结论转成生产式实验","使用真实输入、真实 Tool、真实权限和失败场景","保留失败样本而不是只展示成功 Demo","只有真实环境稳定达标后才提升方案置信度"]}
]);
decisionEN.push(...[
  ["Every search or tool call might help, so the agent cannot prioritize","Which new piece of information is most likely to change the current judgment or next action?",["List the key uncertainties rather than all available information","Mark which hypotheses each query can distinguish","Prefer high-decision-impact and low-cost queries","Stop when more information would not change the action"]],
  ["The agent sometimes concludes too early and sometimes searches forever","Should it explore alternatives or exploit the current best path?",["Check evidence strength for the best current option","Explore only uncertainty with meaningful information value","Set an acceptable threshold and hard budget","Once the threshold is met, execute instead of chasing tiny gains"]],
  ["Intent, moderation, or RAG thresholds never feel right","Which costs more: false positives or false negatives?",["Track FP and FN separately","Assign real business cost to each error type","Use risk-specific thresholds","Add uncertain / review states around the boundary"]],
  ["Overall success rises while Chinese, long-input, or tool scenarios regress","Is the aggregate hiding a reverse trend in an important subgroup?",["Slice by language, task type, length, tool use, and risk","Report aggregate and subgroup metrics together","Check whether traffic mix caused the apparent gain","Add important regressed slices to the permanent regression set"]],
  ["Database CPU and errors rise together, so CPU is called the root cause","Does the evidence show causation or only correlation?",["Check temporal ordering","Search for common causes and alternatives","Define observations that would falsify the hypothesis","Promote to root cause only when mechanism and evidence align"]],
  ["RAG did not find a policy, so the agent says the policy does not exist","If the policy existed, how likely is this retrieval system to find it?",["Audit index coverage, chunking, filters, and permissions","Estimate retrieval recall for that document type","Use alternative retrieval or the Source of Truth","Treat absence as counter-evidence only when observability is high"]],
  ["Tool success and completion metrics are strong but user outcomes are poor","Is the system optimizing the real user goal or an easy proxy?",["Define the final real-world user state","List all current proxy metrics","Create cases that game the metric without completing the task","Validate on final business state"]],
  ["The team cannot choose between Single Call, workflow, agent loop, or multi-agent","Is this problem clear, complicated, complex, or chaotic?",["Assess causal clarity and stability first","Prefer rules and single calls for clear tasks","Use toolized analysis for complicated tasks","Add agent complexity only for probe-feedback or real specialization needs"]],
  ["The task has limited context, tokens, and time but asks the agent to investigate everything","What quality level is sufficient to make the decision under bounded resources?",["Declare context, token, tool-call, and time budgets","Define non-negotiable hard conditions","Prioritize information most likely to change the conclusion","Stop low-value optimization once minimum quality is reached"]],
  ["Reading files, sending mail, deleting data, and production changes use the same authorization","Do these actions really have the same impact, reversibility, and failure cost?",["Tier tools by impact and reversibility","Auto-run low-risk read operations","Add result verification for medium risk","Use confirmation, isolation, and layered controls for irreversible high-risk actions"]],
  ["The team keeps adding prompt text, context, tools, and reflection to improve quality","Is the system actually underpowered, or already beyond the useful range?",["Test failure at both too-little and too-much extremes","Run ablation across prompt/context/tool counts","Remove conflicting and low-value elements first","Use evals to locate the sufficient range"]],
  ["Framework docs, benchmarks, and demos look strong but production is unstable","Which conclusions are only theoretical, and which survived realistic execution?",["Convert claims into production-style experiments","Use real inputs, tools, permissions, and failure conditions","Keep failed cases instead of presenting only successful demos","Raise confidence only after stable real-world performance"]]
]);
uiText.zh.footer="v0.6 · 目标：把哲学、逻辑学、方法论与 LLM / Agent Engineering 建立可检索映射，并通过适用前提、失效条件和制衡关系形成工程判断系统。<br>原则应通过实际 Eval、失败案例和工程实验验证，而不是把哲学名言当作新的“Prompt 咒语”。";
uiText.en.footer="v0.6 · Goal: build a searchable mapping from philosophy, logic, and methodology to LLM / Agent Engineering, including prerequisites, failure conditions, and balancing principles.<br>Principles should be validated through evals, failure cases, and engineering experiments—not treated as prompt incantations.";