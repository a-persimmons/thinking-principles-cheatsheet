// experimental v2 engineering-handbook metadata
const engineeringPatches = {
  occam:{
    trigger:"当 Prompt、Agent、Tool 或 Workflow 不断增加，但 Eval 增益很小时。",
    checklist:["删除这段 instruction，Eval 会下降吗？","这个 Agent 是否解决了单 Agent 无法解决的问题？","这个 Tool 是否真实被当前任务使用？","这一步是否改变最终结果？"],
    badCase:"Single Agent 准确率 91%，Multi-Agent 92%，但 P95 latency +180%、成本 +230%、故障点增加。此时复杂度增益不足以证明 Multi-Agent 必要。",
    engineeringType:"Architecture / Prompt",
    engineeringPattern:"Baseline → Ablation → Eval → Remove / Keep"
  },
  hickam:{
    trigger:"当多个异常同时出现，而团队急于寻找一个‘唯一根因’时。",
    checklist:["单一根因能解释全部证据吗？","是否存在互不依赖的异常链？","每个候选根因是否有独立证据？","多个根因之间是因果、并发还是巧合？"],
    badCase:"数据库慢、Tool timeout、Memory 注入旧状态同时发生，却被统一归因成‘模型不稳定’，最终只改 Prompt，真实故障未解决。",
    engineeringType:"RCA / Debugging",
    engineeringPattern:"Symptoms → Independent hypotheses → Evidence per hypothesis → Interaction check"
  },
  popper:{
    trigger:"当一个根因、方案或结论越解释越顺，但没有任何东西能推翻它时。",
    checklist:["什么观察会推翻当前假设？","是否主动搜索过反证？","是否存在同样能解释现象的替代假设？","发现反证后系统会不会真的更新结论？"],
    badCase:"Agent 先认定数据库是根因，后续所有查询都围绕数据库展开；即使数据库指标正常，也解释成‘瞬时恢复’，假设事实上不可证伪。",
    engineeringType:"Reasoning / RCA / Eval",
    engineeringPattern:"Hypothesis → Falsifier → Counter-evidence → Revision"
  },
  bayes:{
    trigger:"当 Agent 会持续获得新证据，却仍然执着于第一轮判断时。",
    checklist:["当前有哪些候选假设？","新证据对哪个假设最有区分力？","新证据到来后排序是否更新？","置信度是校准概率还是仅用于相对比较？"],
    badCase:"第一轮判断网络问题 80%，后续获得数据库连接耗尽证据后仍坚持网络优先，只因为初始结论写得最早。",
    engineeringType:"Reasoning / Loop",
    engineeringPattern:"Prior → Observation → Belief update → Next action"
  },
  goodhart:{
    trigger:"当某个 Eval 指标开始成为上线、奖励或自动优化的唯一目标时。",
    checklist:["模型能否在不真正完成任务时提高该分数？","是否存在与用户真实目标不一致的 proxy？","是否有真实 task success 指标？","是否包含人工抽检与反作弊样本？"],
    badCase:"团队把 Tool success rate 作为核心 KPI，Agent 通过减少 Tool Call 提高成功率，但真实任务完成率反而下降。",
    engineeringType:"Eval / Optimization",
    engineeringPattern:"Proxy metric + Outcome metric + Anti-gaming check + Human audit"
  },
  "least-privilege":{
    trigger:"当 Agent 获得了超出当前任务所需的写入、删除、发送或管理权限时。",
    checklist:["当前任务实际需要哪些 Tool？","每个 Tool 需要哪些最小 scope？","哪些动作必须人工确认？","权限是否能按任务临时提升而非永久开放？"],
    badCase:"只需读取 GitHub Issue 的 Agent 同时拥有 force push 和删除仓库权限，一次错误 Tool routing 可能造成不可逆后果。",
    engineeringType:"Harness / Security",
    engineeringPattern:"Task → Required capabilities → Minimum scopes → Escalation gate"
  },
  "end-to-end":{
    trigger:"当系统把‘Tool 调用成功’或‘HTTP 200’当作‘任务完成’时。",
    checklist:["用户真正想要的最终状态是什么？","执行后能否重新读取最终状态？","Tool success 与 Task success 是否分开记录？","最终状态异常时有没有补偿或回滚？"],
    badCase:"创建日历接口返回 200，但因为时区错误会议被建在错误时间；系统仍记录任务成功。",
    engineeringType:"Runtime / Eval",
    engineeringPattern:"Action → Re-observe state → Compare with goal → Commit / Compensate"
  },
  murphy:{
    trigger:"当系统设计文档几乎只有 Happy Path，而没有 timeout、空结果、超窗、解析失败等路径时。",
    checklist:["每个外部依赖会怎样失败？","失败能否被检测？","应该 retry、fallback、fail-fast 还是人工介入？","失败路径是否进入回归 Eval？"],
    badCase:"Tool timeout 后 Agent 无限重试，没有 budget、backoff 和终止条件，最终造成请求雪崩。",
    engineeringType:"Reliability / Harness",
    engineeringPattern:"Failure matrix → Detection → Retry/Fallback → Terminal handling"
  },
  observability:{
    trigger:"当线上 Agent 出错后只能看到最终回答，无法还原它为什么这么做时。",
    checklist:["是否能关联一次任务的所有 model/tool events？","是否记录状态转换与终止原因？","是否记录 latency、cost、error、final outcome？","日志是否足以回答具体诊断问题？"],
    badCase:"用户投诉答案错误，系统只有最终文本，没有检索结果、Tool Call、状态变化和模型版本，RCA 只能靠猜。",
    engineeringType:"Observability / Debugging",
    engineeringPattern:"Trace ID → State transitions → Tool/model events → Final outcome"
  },
  "value-of-information":{
    trigger:"当 Agent 不知道下一步该继续搜索、追问还是直接行动时。",
    checklist:["这条信息会区分哪些候选假设？","结果不同会改变下一步动作吗？","获取成本是多少？","有没有更便宜但区分力更高的信息源？"],
    badCase:"Research Agent 连续搜索 20 次背景资料，但这些资料都不会改变最终决策；真正关键的一个缺失参数却没追问用户。",
    engineeringType:"Planning / Tool selection",
    engineeringPattern:"Candidate action → Expected information gain → Decision impact → Cost"
  },
  "know-stop":{
    trigger:"当 Agent 一直搜索、反思、重写，却没人能说明什么时候算完成时。",
    checklist:["Done Criteria 是什么？","最大 iteration / token / cost budget 是多少？","继续一步的边际收益是否仍高于成本？","证据不足时有没有明确的 unresolved exit？"],
    badCase:"Agent 为把答案从‘很好’提升到‘可能更好’不断重写，延迟翻倍但用户价值没有增加。",
    engineeringType:"Loop / Termination",
    engineeringPattern:"Done criteria + Budget + Marginal gain threshold + Exit state"
  },
  "galls-law":{
    trigger:"当项目一开始就设计 Planner + Router + Memory + Multi-Agent，而最小闭环还没跑通时。",
    checklist:["最简单系统能否完成核心任务？","新增组件解决了哪个已观察失败？","新增复杂度有没有独立 Eval 增益？","移除组件后系统是否明显退化？"],
    badCase:"第一版就引入 5 个 Agent，调试时无法判断错误来自 Planner、handoff、memory 还是 Tool，而单 Agent + Tool 尚未被验证。",
    engineeringType:"Architecture",
    engineeringPattern:"Small working loop → Observe failure → Add one capability → Re-eval"
  },
  "map-territory":{
    trigger:"当团队把 RAG chunk、摘要、Memory 或 Tool description 直接当成现实事实时。",
    checklist:["当前内容是原始事实还是中间表示？","中间表示损失了什么？","来源、时间、版本是否可追踪？","关键结论是否需要回到原始源验证？"],
    badCase:"摘要把‘可能发生’压缩成‘已经发生’，后续 Agent 又把摘要作为事实继续推理，最终形成确定性错误。",
    engineeringType:"Context / RAG",
    engineeringPattern:"Reality → Representation → Provenance check → Source verification"
  },
  "design-by-contract":{
    trigger:"当 Tool、Agent 或模块之间经常因为输入假设不一致而失败时。",
    checklist:["调用前置条件是什么？","输出保证是什么？","失败状态是否显式？","调用方和被调用方是否共享同一 schema/version？"],
    badCase:"Planner 以为 Tool 接受空 user_id，Tool 实际要求必填；失败后模型继续猜参数，产生更深层错误。",
    engineeringType:"Tool / Interface",
    engineeringPattern:"Preconditions → Schema validation → Execution → Postconditions"
  },
  idempotency:{
    trigger:"当 Tool 可能因为 timeout 或网络错误被重复调用时。",
    checklist:["重复执行同一请求是否安全？","是否有 idempotency key？","重试前能否查询真实状态？","副作用是否可去重或补偿？"],
    badCase:"发送消息 Tool 超时，Agent 不知道实际是否发送成功，直接重试导致用户收到两封邮件。",
    engineeringType:"Tool / Reliability",
    engineeringPattern:"Idempotency key + State check + Safe retry + Deduplication"
  },
  "circuit-breaker":{
    trigger:"当某个外部 Tool 连续失败，而 Agent 仍持续请求导致雪崩时。",
    checklist:["连续失败阈值是多少？","熔断后使用什么 fallback？","什么时候 half-open 探测恢复？","熔断状态是否可观测？"],
    badCase:"搜索 API 持续 503，100 个 Agent 同时指数重试，最终把自身线程池和连接池一起耗尽。",
    engineeringType:"Reliability / Runtime",
    engineeringPattern:"Closed → Failure threshold → Open → Cooldown → Half-open"
  }
};
Object.entries(engineeringPatches).forEach(([id,patch])=>{ const p=principles.find(x=>x.id===id); if(p) Object.assign(p,patch); });
