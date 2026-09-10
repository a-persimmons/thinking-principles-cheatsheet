// v1.1 engineering scenarios and decision cards
scenarioData.push(...[
["复杂 Agent 故障不知道从哪查","现象很多、组件很多，容易把第一处异常当根因",["five-whys","fault-tree","differential-diagnosis","observability"]],
["长 Prompt 改坏了但定位不到","一次改动很多，无法判断是哪一段导致回归",["binary-search-debug","chesterton","occam"]],
["任务拆了很多块但答案整体矛盾","局部都对，组合起来却不一致",["divide-conquer","compositionality","invariants","end-to-end"]],
["Tool 参数总有歧义","自然语言意图到结构化调用之间经常丢语义",["semantic-gap","design-by-contract","explicit-over-implicit"]],
["Tool 超时后重复执行产生副作用","自动 retry 把一次操作变成了多次操作",["idempotency","retry-budget","exponential-backoff"]],
["一个依赖挂了拖垮整个 Agent","持续失败还在疯狂重试",["circuit-breaker","bulkhead","graceful-degradation"]],
["Agent 状态越来越乱","Planning、Waiting、Done、Failed 混在隐式变量里",["state-machine","invariants","make-invalid-unrepresentable"]],
["一个需求改动要改五六个地方","Prompt、Parser、Eval、Tool 都复制了同一规则",["locality-of-change","ssot","single-responsibility"]],
["为了未来可能需求提前做得很复杂","当前没用上的 Agent、Memory、Router 越来越多",["yagni","galls-law","kiss"]],
["Context 压缩后总丢关键事实","token 少了，但根因分析或事实判断变差",["lossy-compression","map-territory","gigo"]]
]);
scenarioEN.push(...[
["A complex agent failure is hard to debug","Many symptoms and components make the first visible error look like the root cause"],
["A long prompt regressed and the cause is unclear","Too many changes happened at once"],
["Subtasks are locally correct but globally inconsistent","Decomposition lost cross-part constraints"],
["Tool arguments are repeatedly ambiguous","Meaning is lost between natural language intent and structured calls"],
["Retries duplicate side effects","A timeout turns one intended action into several executions"],
["One dependency failure drags down the whole agent","The system keeps retrying a persistently failing dependency"],
["Agent state becomes chaotic","Planning, Waiting, Done, and Failed are implicit and inconsistent"],
["One requirement change touches many places","The same rule is duplicated across Prompt, Parser, Eval, and Tool layers"],
["The architecture is complex for hypothetical future needs","Unused agents, memory, and routing are built before evidence of need"],
["Context compression drops critical facts","Token count improves while diagnosis or factual accuracy worsens"]
]);

decisionData.push(...[
{problem:"复杂 Agent 故障发生后，团队只盯着最先报错的组件",question:"这是根因、症状，还是多个原因共同作用？我们有哪些信号可以真正区分它们？",principles:["five-whys","fault-tree","differential-diagnosis","observability"],actions:["先画顶层失败事件和主要因果分支","为每个候选原因绑定可观察证据","用最有区分力的检查排除候选","补齐无法回答诊断问题的日志和 trace"]},
{problem:"一个 3000 行 Prompt 改完效果下降，但不知道哪里出了问题",question:"能否固定其他变量，通过消融和二分把回归缩小到最小变化区间？",principles:["binary-search-debug","chesterton","occam","rule-of-three"],actions:["固定模型、温度和评测集","按模块做二分消融而不是凭感觉改词","找到历史规则对应的 bad case 后再删除","对偶发样本避免立即抽象成全局规则"]},
{problem:"把长上下文拆成多个子任务后，每个局部答案都对，最终结论却错",question:"哪些全局关系和不变量在拆分时被切断了？",principles:["divide-conquer","compositionality","invariants","lossy-compression"],actions:["拆分前定义必须跨块保留的全局事实和关系","局部结果使用统一输出契约","组合阶段做跨块一致性验证","对关键数字、否定、时间和因果关系做保真检查"]},
{problem:"用户一句自然语言最终映射成 Tool Call 时经常参数错位",question:"用户意图到结构化协议之间有哪些隐式默认和语义鸿沟？",principles:["semantic-gap","design-by-contract","explicit-over-implicit","rectification"],actions:["拆出 Intent / Object / Constraint / Expected result / Side effect","定义 Tool 的前置和后置条件","显式处理时区、单位、默认值和权限","缺失会改变结果的字段时不要猜"]},
{problem:"Tool 超时后 Agent 自动重试，结果重复发消息或重复创建数据",question:"这个动作是否幂等？整个链路允许付出多少重试成本？",principles:["idempotency","exponential-backoff","retry-budget","end-to-end"],actions:["写操作增加 idempotency key 或前置状态检查","只对瞬态错误自动重试","设置跨层共享 retry budget","重试后重新读取最终业务状态确认只执行一次"]},
{problem:"外部模型或 MCP 服务故障时，整个 Agent 卡死甚至把资源打满",question:"什么时候应该继续重试，什么时候应该熔断、隔离或降级？",principles:["circuit-breaker","bulkhead","graceful-degradation","fail-fast"],actions:["连续失败达到阈值后熔断","不同依赖设置独立并发和资源上限","定义可接受的低能力降级模式","不可恢复错误立即 fail-fast"]},
{problem:"Agent 运行久了以后，状态和流程判断越来越难维护",question:"哪些状态是真实存在的？哪些转换是合法的？哪些状态应该根本无法出现？",principles:["state-machine","make-invalid-unrepresentable","invariants","design-by-contract"],actions:["把 Planning / Acting / Waiting / NeedsHuman / Done / Failed 显式建模","定义每个状态允许动作和退出条件","把非法组合下沉到 schema/type/permission 层禁止构造","每轮动作后校验系统不变量"]},
{problem:"同一条业务规则散落在多个 Prompt、Tool、Parser 和 Eval 中",question:"为什么一次规则变化需要修改这么多地方？哪个位置应该成为权威来源？",principles:["locality-of-change","ssot","single-responsibility","high-cohesion-low-coupling"],actions:["找出重复定义的同一事实或规则","指定唯一 Source of Truth","不同层只引用而不复制语义","用典型变更测试修改影响范围是否缩小"]},
{problem:"项目刚开始就规划长期 Memory、多 Agent、Router、Planner 全套",question:"这些组件解决了哪个已经真实出现的问题？",principles:["yagni","kiss","galls-law","occam"],actions:["先实现可闭环的最小系统","记录最小系统真实失败类型","只有已有失败证明需要时才增加组件","每增加复杂度都要求对应 Eval 增益"]},
{problem:"为了省 token 做摘要和压缩后，模型开始漏掉关键限定条件",question:"压缩时到底允许损失什么，哪些信息必须无损保留？",principles:["lossy-compression","map-territory","gigo","invariants"],actions:["列出不可丢失的信息类型：数值、否定、时间、因果、身份、约束","为压缩结果建立保真 Eval","关键证据保留原文引用或可回溯指针","不要把摘要误当作原始事实"]}
]);

decisionEN.push(...[
["The team focuses on the first failing component in a complex agent incident","Is it the root cause, a symptom, or one of several interacting causes?",["Build a top-level fault tree","Bind observable evidence to each cause","Use discriminating checks to eliminate candidates","Add missing traces and diagnostic signals"]],
["A very long prompt regressed after editing and nobody knows where","Can we hold other variables fixed and shrink the regression to the smallest changed region?",["Freeze model settings and eval set","Use binary ablation by module","Understand old bad cases before deleting rules","Do not generalize from one accidental failure"]],
["Subtasks are correct but the combined answer is wrong","Which global relations or invariants were severed by decomposition?",["Define cross-chunk invariants before splitting","Use a common output contract","Run global consistency checks after merge","Verify preservation of numbers, negations, time, and causal links"]],
["Natural-language requests repeatedly map to wrong tool arguments","Which hidden assumptions and semantic gaps exist between intent and protocol?",["Extract intent/object/constraints/result/side effects","Define preconditions and postconditions","Make timezone, units, defaults, and permissions explicit","Do not guess missing fields that change the result"]],
["A timeout causes duplicate messages or duplicate writes after retry","Is the operation idempotent and what retry cost can the whole chain afford?",["Use idempotency keys or state checks","Retry only transient failures","Share one retry budget across layers","Re-read the final state after retry"]],
["A failing model or MCP dependency stalls the whole agent","When should the system retry, trip a circuit breaker, isolate, or degrade?",["Trip after repeated failures","Isolate resource budgets by dependency","Define an explicit degraded mode","Fail fast on non-recoverable errors"]],
["Long-running agent state becomes difficult to reason about","What states truly exist, which transitions are legal, and which states should be impossible?",["Model explicit states","Define allowed actions and exits","Prevent invalid combinations structurally","Check invariants after every transition"]],
["One business rule is duplicated across prompts, tools, parsers, and evals","Why does one change touch so many places, and which layer owns the truth?",["Find duplicated definitions","Choose a single source of truth","Reference instead of copying semantics","Measure change locality with a representative update"]],
["The project starts with memory, multi-agent, router, and planner before users need them","Which observed failure does each component solve?",["Build the smallest closed loop","Record real failure modes","Add components only for observed needs","Require measurable eval gain for added complexity"]],
["Token-saving compression starts dropping critical qualifiers","What may be lost, and what must remain lossless?",["Define must-preserve information types","Build compression fidelity evals","Keep raw references for critical evidence","Never confuse summaries with source facts"]]
]);
