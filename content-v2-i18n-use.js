// v2.2 — complete English use-case coverage and prevent Chinese fallback in English mode
(() => {
  const hasCJK = value => /[\u3400-\u9fff]/.test(String(value || ''));

  const exact = {
    'Prompt 越写越长':'Prompts growing too long','Multi-Agent 过度设计':'Over-engineered multi-agent systems','上下文堆积':'Context accumulation','工作流步骤过多':'Excessive workflow steps',
    '模型不按要求输出':'Model not following output requirements','Tool Calling 失败':'Tool-calling failures','线上行为异常':'Production behavior anomalies','Agent Debug':'Agent debugging',
    '模型幻觉':'Model hallucination','事实问答':'Factual question answering','根因分析':'Root-cause analysis','研究型 Agent':'Research agents','异常根因':'Anomalous root causes',
    '安全操作':'Safety-sensitive actions','自动执行':'Autonomous execution','高风险决策':'High-risk decisions','研究':'Research','复杂推理':'Complex reasoning','诊断 Agent':'Diagnostic agents','搜索 Agent':'Search agents','不确定性管理':'Uncertainty management','多轮调查':'Multi-turn investigation',
    '不知道 Prompt 怎么写':'Prompt design from first principles','套模板无效':'When prompt templates fail','复杂 Agent 需求':'Complex agent requirements','架构设计':'Architecture design','摘要链':'Summarization pipelines','长上下文':'Long-context tasks','数据抽取':'Data extraction','回答冗长':'Overly verbose answers','跑题':'Off-topic responses','表达含糊':'Ambiguous expression','RAG 噪音':'RAG noise',
    '意图识别':'Intent classification','语音转写':'Speech transcription','模糊输入':'Ambiguous input','客服 Agent':'Customer-service agents','旧 Prompt 清理':'Legacy prompt cleanup','规则重构':'Rule refactoring','Guardrail 删除':'Guardrail removal','系统迁移':'System migration',
    'Eval 设计':'Eval design','奖励模型':'Reward-model design','自动优化 Prompt':'Automated prompt optimization','Agent KPI':'Agent KPIs','自动回归测试':'Automated regression testing','Prompt 平台':'Prompt platforms','绩效指标':'Performance metrics','生产 Agent':'Production agents','流式 JSON':'Streaming JSON','故障恢复':'Failure recovery',
    '执行型 Agent':'Action-taking agents','文件修改':'File operations','代码 Agent':'Coding agents','Tool 权限':'Tool permissions','Coding Agent':'Coding agents','企业 Agent':'Enterprise agents','事务操作':'Transactional operations','API Agent':'API agents','Prompt 优化':'Prompt optimization','Bad case 分析':'Bad-case analysis','成本优化':'Cost optimization','学习路线':'Learning prioritization',
    '复杂根因分析':'Complex RCA','多故障并发':'Concurrent failures','分布式系统':'Distributed systems','Failure-first 设计':'Failure-first design','Prompt 评审':'Prompt review','Agent 规划':'Agent planning','上线前检查':'Pre-launch review','Prompt 补丁越来越多':'Prompt patch accumulation','Context 噪音':'Context noise','Tool 过载':'Tool overload','系统复杂度上升':'Rising system complexity',
    '自主 Agent':'Autonomous agents','高影响 Tool':'High-impact tools','计划生成':'Plan generation','不可逆操作':'Irreversible actions','模型路由':'Model routing','Fallback 设计':'Fallback design','长尾异常':'Long-tail failures','批量操作':'Batch operations','外部系统写入':'External-system writes','结构化输出':'Structured output','用户输入清洗':'User-input normalization',
    '参数校验':'Parameter validation','工作流编排':'Workflow orchestration','大型 Prompt':'Large prompts','Agent 架构':'Agent architecture','多人协作':'Team collaboration','企业知识库':'Enterprise knowledge bases','多源上下文':'Multi-source context','Agent Loop':'Agent loops','实时决策':'Real-time decisions','故障处置':'Incident response','动态环境':'Dynamic environments','Bad case 迭代':'Bad-case iteration','持续优化':'Continuous improvement','复盘':'Retrospectives','自我反思':'Self-reflection','Few-shot':'Few-shot prompting','RAG 排序':'RAG ranking','候选答案比较':'Candidate comparison','评测':'Evaluation',
    'Eval 数据集':'Eval datasets','Bad case 收集':'Bad-case collection','上线评估':'Launch evaluation','旧架构重构':'Legacy-architecture refactoring','Prompt 补丁':'Prompt patching','框架选型':'Framework selection','技术债':'Technical debt','异常检测':'Anomaly detection','分类':'Classification','风险判断':'Risk judgment','Policy':'Policy design','企业规则':'Enterprise rules','分类任务':'Classification tasks','内容审核':'Content moderation','相关性判断':'Relevance judgment','质量评分':'Quality scoring','Multi-Agent':'Multi-agent systems','系统演化':'System evolution','项目启动':'Project bootstrap','架构取舍':'Architecture tradeoffs','Prompt 简化':'Prompt simplification','Tool 设计':'Tool design','产品体验':'Product UX',
    'RAG 数据工程':'RAG data engineering','Memory':'Memory','Tool 输出':'Tool output','长 Prompt':'Long prompts','复杂任务说明':'Complex task instructions','多规则冲突':'Conflicting rules','优先级设计':'Priority design','延迟优化':'Latency optimization','Agent 终止':'Agent termination','流式响应':'Streaming responses','Agent 能力边界':'Agent capability boundaries','工具选择':'Tool selection','复杂推理':'Complex reasoning','事实密集任务':'Fact-heavy tasks',
    '方案选择':'Option selection','降级策略':'Degradation strategies','生成迭代':'Generation iteration','Agent 预算':'Agent budgets','规划':'Planning','模型选择':'Model selection','推荐 Agent':'Recommendation agents','Tool 路由':'Tool routing','根因调查':'Root-cause investigation','技术选型':'Technology selection','Prompt 模板':'Prompt templates','模型比较':'Model comparison','RAG 方案':'RAG design','Reward 设计':'Reward design','风险检测':'Risk detection','RAG 阈值':'RAG thresholds','RAG 无结果':'Empty RAG results','日志分析':'Log analysis','事实核验':'Fact verification','指标分析':'Metric analysis','实验':'Experiments','日志关联':'Log correlation',
    'A/B Test':'A/B testing','Bad case 复测':'Bad-case retesting','高风险 Agent':'High-risk agents','权限控制':'Permission control','企业安全':'Enterprise security','权限设计':'Permission design','Human-in-the-loop':'Human-in-the-loop','高风险操作':'High-risk operations','模块化':'Modular design','模型迁移':'Model migration','Prompt 迁移':'Prompt migration','场景化设计':'Scenario-specific design','Prompt 长度':'Prompt length','Context 选择':'Context selection','工具数量':'Tool count','反思次数':'Reflection iterations','高风险 Tool':'High-risk tools','生产变更':'Production changes','外部副作用':'External side effects','Agent Eval':'Agent evaluation','Self-Reflection':'Self-reflection','任务验收':'Task acceptance','日志回放':'Trace replay','能力边界':'Capability boundaries','任务规划':'Task planning','局部优化':'Local optimization','Prompt 上线':'Prompt launch','Agent Demo':'Agent demos','数据漂移':'Data drift','线上监控':'Production monitoring',
    '事故复盘':'Incident retrospectives','Prompt bad case':'Prompt bad cases','复杂故障':'Complex failures','多组件 Agent':'Multi-component agents','可靠性分析':'Reliability analysis','Prompt 回归':'Prompt regressions','上下文污染':'Context contamination','版本回归':'Version regressions','长工作流':'Long workflows','异常诊断':'Anomaly diagnosis','故障排查':'Troubleshooting','线上 Agent':'Production agents','日志设计':'Logging design','回放系统':'Replay systems','性能诊断':'Performance diagnosis',
    '任务分解':'Task decomposition','分类体系':'Taxonomy design','Eval Rubric':'Eval rubrics','根因枚举':'Root-cause enumeration','批处理':'Batch processing','代码分析':'Code analysis','复杂任务':'Complex tasks','研究任务':'Research tasks','复杂分析':'Complex analysis','需求澄清':'Requirements clarification','Prompt 定义':'Prompt definition','产品目标':'Product goals','Eval 指标':'Eval metrics','状态机':'State machines','安全约束':'Safety constraints','事务流程':'Transactional workflows','Tool 封装':'Tool abstraction','自然语言接口':'Natural-language interfaces','模块化 Prompt':'Modular prompts','多段 Context':'Multi-part context','复杂指令':'Complex instructions',
    '网络搜索':'Web search','竞争情报':'Competitive intelligence','知识库':'Knowledge bases','企业文档':'Enterprise documents','长期 Memory':'Long-term memory','Agent 无限循环':'Agent infinite loops','过度搜索':'Over-searching','成本失控':'Cost overruns','自主任务':'Autonomous tasks'
  };

  const rules = [
    [/Prompt/i,'Prompt engineering'],[/RAG/i,'RAG'],[/Memory/i,'Memory design'],[/Tool/i,'Tool integration'],[/Agent/i,'Agent engineering'],[/Eval|评估|评测/i,'Evaluation'],[/根因|RCA/i,'Root-cause analysis'],[/故障|异常/i,'Failure diagnosis'],[/权限/i,'Permission design'],[/安全|风险/i,'Risk and safety review'],[/模型/i,'Model selection and behavior'],[/上下文|Context/i,'Context engineering'],[/数据/i,'Data quality and processing'],[/架构/i,'Architecture design'],[/成本/i,'Cost optimization'],[/检索|搜索/i,'Retrieval and search'],[/分类/i,'Classification'],[/指标/i,'Metrics and evaluation'],[/日志/i,'Observability and logs'],[/流程|工作流/i,'Workflow design'],[/迁移/i,'Migration'],[/自动/i,'Automation'],[/接口|协议|API/i,'Interface and API design'],[/状态/i,'State management'],[/规划|计划/i,'Planning'],[/研究/i,'Research workflows'],[/复杂/i,'Complex-task handling'],[/长尾/i,'Long-tail handling'],[/学习/i,'Learning and prioritization']
  ];

  function translateUseCase(text,p){
    const raw=String(text||'').trim();
    if(!raw) return '';
    if(!hasCJK(raw)) return raw;
    if(exact[raw]) return exact[raw];
    for(const [re,label] of rules) if(re.test(raw)) return label;
    const name=(principleEN[p.id]||{}).name || p.en || p.id;
    return `${name} — engineering use case`;
  }

  let patched=0, alreadyEnglish=0, fallbackItems=0;
  principles.forEach(p=>{
    const en=principleEN[p.id] || (principleEN[p.id]={name:p.en||p.id});
    const current=Array.isArray(en.use)?en.use.filter(Boolean):[];
    const currentIsClean=current.length && current.every(x=>!hasCJK(x));
    if(currentIsClean){ alreadyEnglish++; return; }
    const translated=(p.use||[]).map(x=>translateUseCase(x,p)).filter(Boolean);
    en.use=translated.length?translated:[`${en.name||p.en||p.id} — engineering use case`];
    patched++;
    fallbackItems += en.use.filter(x=>/engineering use case$/.test(x)).length;
  });

  window.useCaseI18nAudit={
    total:principles.length,
    patched,
    alreadyEnglish,
    fallbackItems,
    mixedChinese:principles.filter(p=>((principleEN[p.id]||{}).use||[]).some(hasCJK)).map(p=>p.id)
  };
})();
