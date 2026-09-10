# LLM / Agent Engineering 思想原则速查表

## 文件结构

- `index.html`：页面结构
- `styles.css`：主题、布局与组件样式
- `principles.js`：思想原则数据 + 英文翻译 + 类别映射
- `decisions.js`：场景、决策卡、中英文 UI 文案
- `app.js`：搜索、筛选、收藏、主题、语言切换、详情弹窗等交互逻辑

## 后续如何更新内容

### 新增 / 修改原则
主要编辑 `principles.js` 中的：
- `principles`
- `principleEN`

### 新增 / 修改工程问题决策卡
主要编辑 `decisions.js` 中的：
- `decisionData`
- `decisionEN`

### 新增 / 修改顶部场景入口
编辑：
- `scenarioData`
- `scenarioEN`

### 修改界面文案
编辑：
- `uiText`

页面不需要构建工具，直接打开 `index.html` 即可使用。
