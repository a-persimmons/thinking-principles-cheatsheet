// v0.5 decision extension 1
scenarioData.push(...[
  ["看起来不止一个根因","多个异常可能同时存在，单一根因解释不够",["hickam","popper","dependent","base-rate"]],
  ["输入很乱，但输出必须稳定","人类输入可以模糊，下游协议不能模糊",["postel","fail-fast","rectification"]],
  ["Agent 太早做不可逆操作","信息还不够，却已经删除、发送或覆盖",["least-commitment","least-privilege","unintended"]],
  ["Agent 面对长尾异常没招","真实环境变化很多，但系统只有一个 fallback",["ashby","murphy","galls-law"]],
  ["Context 里多个版本互相冲突","Memory、RAG、Tool result 对同一事实说法不同",["ssot","map-territory","is-ought"]],
  ["评测集看起来太漂亮","几乎都是成功样本和人工精选案例",["survivorship","goodhart","campbell"]],
  ["总是在 Prompt 上打补丁","每次失败都加一句，系统越来越难维护",["via-negativa","double-loop","sunk-cost"]],
  ["不知道该继续推理还是去查资料","模型越想越多，但可能缺的是事实或工具",["learning-thinking","sharpen-tools","gigo"]]
]);
scenarioEN.push(...[
  ["There may be more than one root cause","Several failures may coexist; one-cause explanations are too simple"],
  ["Input is messy but output must be stable","Human input can be fuzzy; downstream protocols cannot"],
  ["The agent commits too early","It deletes, sends, or overwrites before enough evidence exists"],
  ["The agent cannot handle long-tail failures","The environment varies widely but the system has one fallback"],
  ["Context contains conflicting versions","Memory, RAG, and tool results disagree on the same fact"],
  ["The eval set looks suspiciously clean","Most examples are successful or manually curated"],
  ["Every failure adds another prompt patch","The system keeps growing harder to reason about"],
  ["It is unclear whether to reason more or fetch evidence","The real bottleneck may be missing data or tools"]
]);
decisionData.push(...[
  {"problem":"多个异常同时出现，但系统强迫输出唯一根因","question":"这些现象真的共享同一个原因，还是存在多个独立故障并发生相互作用？","principles":["hickam","occam","dependent","base-rate"],"actions":["允许输出多个候选根因，而不是强制唯一答案","分别为每个异常建立独立证据链","检查根因之间是否存在因果关系或只是并发","用基础率和当前证据共同排序"]},
  {"problem":"Agent 还没调查清楚就执行删除、发送、覆盖等动作","question":"现在必须承诺这个决定吗？有没有可逆且能增加信息的下一步？","principles":["least-commitment","unintended","least-privilege","sagan"],"actions":["给每个动作标记可逆性和 blast radius","优先执行读取、预览、dry-run、验证等信息增益动作","不可逆动作延后到证据和授权都充分时","高风险动作使用更高确认门槛"]},
  {"problem":"每次出现 bad case 都往 Prompt 后面再加一句","question":"这是局部输出错误，还是 Prompt 的基础规则、架构或数据链路本身有问题？","principles":["double-loop","via-negativa","sunk-cost","chesterton"],"actions":["区分 single-loop 修复和 double-loop 修复","先检查冲突规则和历史补丁","理解旧规则对应 bad case 后再删改","比较继续打补丁和重构/替换的未来成本"]},
  {"problem":"Agent 在真实环境里遇到一点变化就失效","question":"环境状态的多样性，是否超过了系统可识别和可响应的能力范围？","principles":["ashby","murphy","galls-law","fail-fast"],"actions":["建立真实环境状态与失败类型列表","为每类状态配置检测信号与响应路径","无法覆盖的状态要 fail-fast 或交给人工","从简单可工作闭环逐步增加路由和 fallback"]},
  {"problem":"Memory、RAG、System Prompt 和 Tool result 对同一事实说法不同","question":"哪个来源拥有最终权威？哪些是事实，哪些只是历史表示或规则？","principles":["ssot","map-territory","is-ought","separation"],"actions":["给关键事实定义 Source of Truth","给 Context 来源增加版本和时间信息","区分事实源与规范规则，避免 RAG 内容覆盖 Policy","去掉跨层重复维护的业务事实"]},
  {"problem":"评测数据几乎全是成功案例，离线效果很好","question":"我们是否只观察了幸存下来的案例，而漏掉失败、拒绝、长尾和未完成任务？","principles":["survivorship","goodhart","campbell","gigo"],"actions":["从线上收集真实失败和未完成任务","按流量分布保留常见、长尾和极端样本","检查数据质量和标注偏差","不要让单一离线指标决定上线"]}
]);
decisionEN.push(...[
  ["Several anomalies appear, but the system insists on one root cause","Do these symptoms truly share one cause, or are several independent failures interacting?",["Allow multiple candidate root causes","Build independent evidence chains for each symptom","Check whether causes interact or merely coexist","Rank with both base rates and current evidence"]],
  ["The agent deletes, sends, or overwrites before investigation is complete","Must this decision be committed now, or is there a reversible action that gains more information?",["Label action reversibility and blast radius","Prefer read/preview/dry-run/validation steps","Delay irreversible actions until evidence and authorization are sufficient","Use stronger confirmation for high-risk actions"]],
  ["Every bad case adds one more line to the prompt","Is this a local output mistake, or a flaw in the governing rules, architecture, or data path?",["Separate single-loop fixes from double-loop fixes","Look for conflicting rules and accumulated patches","Understand the historical failure before removing old rules","Compare future cost of patching versus refactoring"]],
  ["The agent breaks whenever the environment varies","Does environmental variety exceed the system's ability to recognize and respond?",["Map real environment states and failure classes","Give each class detection signals and response paths","Fail fast or escalate unsupported states","Grow routing and fallback from a simple working loop"]],
  ["Memory, RAG, system prompt, and tool output disagree on the same fact","Which source is authoritative, and which content is fact, representation, or policy?",["Define a Source of Truth for critical facts","Attach version and time to context sources","Separate descriptive facts from normative policy","Remove duplicated business facts across layers"]],
  ["The eval set is almost entirely successful cases","Are we observing only survivors while missing failures, refusals, long-tail inputs, and unfinished tasks?",["Collect real production failures and incomplete tasks","Preserve common, long-tail, and extreme cases","Audit data quality and labeling bias","Do not let one offline metric gate launch"]]
]);
