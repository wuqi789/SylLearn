# Tasks

- [x] Task 1: 项目脚手架搭建 - 初始化 Next.js + TypeScript + Tailwind CSS + shadcn/ui 项目
  - [x] SubTask 1.1: 创建 Next.js 14 项目，配置 TypeScript、Tailwind CSS、ESLint
  - [x] SubTask 1.2: 安装并配置 shadcn/ui，初始化组件库
  - [x] SubTask 1.3: 安装 Framer Motion、Recharts、Prisma、bcryptjs、jsonwebtoken 等依赖
  - [x] SubTask 1.4: 创建目录结构（app、components、lib、types、hooks）
  - [x] SubTask 1.5: 配置 tsconfig、tailwind.config、全局样式、主题色
  - [x] SubTask 1.6: 创建 .env.example 和基础配置文件

- [x] Task 2: 数据库设计与 Prisma 配置
  - [x] SubTask 2.1: 编写 Prisma Schema（users、sessions、topics、skills、skill_nodes、messages、assessments、memory_items、review_plans、debate_threads、debate_positions、marketplace_packages 表）
  - [x] SubTask 2.2: 运行 Prisma migrate 初始化数据库
  - [x] SubTask 2.3: 编写种子数据脚本（示例用户、示例教纲包）
  - [x] SubTask 2.4: 创建 Prisma 客户端工具函数

- [x] Task 3: 认证系统实现
  - [x] SubTask 3.1: 实现 JWT 工具函数（生成、验证 token）
  - [x] SubTask 3.2: 实现注册/登录 API Routes
  - [x] SubTask 3.3: 实现匿名试用逻辑（自动分配临时身份）
  - [x] SubTask 3.4: 实现认证中间件
  - [x] SubTask 3.5: 创建 useAuth Hook
  - [x] SubTask 3.6: 创建登录/注册页面 UI

- [x] Task 4: 全局布局组件
  - [x] SubTask 4.1: 实现顶部导航栏（Header）- 品牌、搜索、创建学习会话、头像菜单
  - [x] SubTask 4.2: 实现侧边栏（Sidebar）- Dashboard/Sessions/Tutor/Debate/Review/SylHub/Analytics/Admin 导航
  - [x] SubTask 4.3: 实现 Dashboard 布局（侧边栏 + 主内容区）
  - [x] SubTask 4.4: 实现根布局（全局 Provider、主题、字体）
  - [x] SubTask 4.5: 实现页脚组件

- [x] Task 5: 首页 Landing Page
  - [x] SubTask 5.1: 实现 Hero 区（大标题、副标题、CTA 按钮、动态背景）
  - [x] SubTask 5.2: 实现核心价值三栏展示
  - [x] SubTask 5.3: 实现工作流动画（Plan → Act → Observe → Reflect）
  - [x] SubTask 5.4: 实现示例学习路径展示
  - [x] SubTask 5.5: 实现开源与免费说明 + 社区生态展示
  - [x] SubTask 5.6: 实现响应式适配

- [x] Task 6: Agent 系统基础架构
  - [x] SubTask 6.1: 定义 Agent 类型接口（AgentRole、AgentMessage、AgentState）
  - [x] SubTask 6.2: 实现 ModelAdapter 接口和 MockAdapter（生成结构化模拟响应）
  - [x] SubTask 6.3: 实现 Agent 基类（BaseAgent）- 状态机、消息处理、上下文管理
  - [x] SubTask 6.4: 实现 Agent 编排器（Orchestrator）- Agent 调度、消息路由
  - [x] SubTask 6.5: 创建 Agent API Routes

- [x] Task 7: 知识编译引擎（Compiler Agent）+ Skill 系统
  - [x] SubTask 7.1: 实现 Compiler Agent - 知识点拆解（核心概念、前置知识、常见误区、学习目标）
  - [x] SubTask 7.2: 实现 Skill 数据结构（概念解释、示例、类比、练习题、复习卡片、评估标准）
  - [x] SubTask 7.3: 实现 Skill Card UI 组件
  - [x] SubTask 7.4: 实现知识树可视化组件（KnowledgeTree）
  - [x] SubTask 7.5: 创建 Skill 相关 API Routes
  - [x] SubTask 7.6: 实现会话创建流程（用户输入主题 → 触发编译 → 展示 Skill Card）

- [x] Task 8: 导师 Agent 教学页（Tutor Agent）
  - [x] SubTask 8.1: 实现 Tutor Agent - 苏格拉底式提问、自适应难度、多种解释方式
  - [x] SubTask 8.2: 实现对话界面（聊天气泡、输入框、发送按钮）
  - [x] SubTask 8.3: 实现教学交互按钮（我不懂、再举一个例子、换个角度解释、生成测验、加入复习计划）
  - [x] SubTask 8.4: 实现 Skill 树侧边栏（左侧主题树）
  - [x] SubTask 8.5: 实现知识卡片、前置知识、错题、复习建议（右侧上下文面板）
  - [x] SubTask 8.6: 实现会话 API（消息收发、历史记录）

- [x] Task 9: 测评系统（Exam Agent）
  - [x] SubTask 9.1: 实现 Exam Agent - 自动出题、判分、反馈生成
  - [x] SubTask 9.2: 实现题目卡片 UI 组件（选择题、判断题、开放问答）
  - [x] SubTask 9.3: 实现答题交互流程（作答 → 即时反馈 → 掌握度更新）
  - [x] SubTask 9.4: 实现测评记录存储

- [x] Task 10: 辩论式学习页（Debate Agent）
  - [x] SubTask 10.1: 实现 Debate Agent - 多观点角色生成、证据提供、辩论推进
  - [x] SubTask 10.2: 实现辩论面板 UI（左右观点对照、证据卡片、争议点）
  - [x] SubTask 10.3: 实现用户参与功能（提问、投票、追问）
  - [x] SubTask 10.4: 实现辩论总结生成
  - [x] SubTask 10.5: 创建辩论相关 API Routes

- [x] Task 11: 记忆与复习系统（Memory Agent）
  - [x] SubTask 11.1: 实现 Memory Agent - 长期记忆存储、偏好记录、错误模式识别
  - [x] SubTask 11.2: 实现间隔重复算法（SM-2 或类似算法）
  - [x] SubTask 11.3: 实现复习调度器（自动生成复习计划）
  - [x] SubTask 11.4: 实现记忆存储 API
  - [x] SubTask 11.5: 实现复习页面 UI（间隔重复卡片、掌握度曲线、今日待复习列表）
  - [x] SubTask 11.6: 实现一键复习流程
  - [x] SubTask 11.7: 实现掌握度追踪（掌握/模糊/错误/需要复习状态管理）

- [x] Task 12: 学习进度分析页（Dashboard + Analytics）
  - [x] SubTask 12.1: 实现 Dashboard 页面（今日学习任务、当前掌握度、需要复习的知识、最近会话、推荐学习路径）
  - [x] SubTask 12.2: 实现掌握度雷达图（Recharts）
  - [x] SubTask 12.3: 实现学习进度图表（Recharts）
  - [x] SubTask 12.4: 实现学习提醒组件
  - [x] SubTask 12.5: 创建分析数据 API

- [x] Task 13: SylHub 教纲市场
  - [x] SubTask 13.1: 实现教纲卡片列表页面（网格布局）
  - [x] SubTask 13.2: 实现搜索和标签筛选功能
  - [x] SubTask 13.3: 实现热门/最新/收藏排序
  - [x] SubTask 13.4: 实现教纲详情页（适用人群、学习目标、前置知识、难度、课件预览）
  - [x] SubTask 13.5: 创建市场 API Routes

- [x] Task 14: 管理后台页
  - [x] SubTask 14.1: 实现管理后台布局
  - [x] SubTask 14.2: 实现用户统计面板
  - [x] SubTask 14.3: 实现学习数据概览
  - [x] SubTask 14.4: 实现系统状态展示

- [x] Task 15: Planner Agent 学习路径规划
  - [x] SubTask 15.1: 实现 Planner Agent - 学习路径规划、前置知识分析
  - [x] SubTask 15.2: 实现学习路径推荐 UI

- [x] Task 16: 基础 API 完善与会话管理
  - [x] SubTask 16.1: 实现会话 CRUD API（创建、列表、详情、更新、删除）
  - [x] SubTask 16.2: 实现消息历史 API
  - [x] SubTask 16.3: 实现会话列表页面
  - [x] SubTask 16.4: 实现会话详情页面

- [x] Task 17: Docker 配置与部署
  - [x] SubTask 17.1: 创建 Dockerfile
  - [x] SubTask 17.2: 创建 docker-compose.yml
  - [x] SubTask 17.3: 创建 .dockerignore

- [x] Task 18: README 文档与工程收尾
  - [x] SubTask 18.1: 编写 README.md（项目概述、环境配置、安装步骤、运行方法、功能说明、常见问题）
  - [x] SubTask 18.2: 代码质量自审（TypeScript 类型检查、ESLint 检查）
  - [x] SubTask 18.3: 功能完整性验证
  - [x] SubTask 18.4: 响应式设计验证

# Task Dependencies
- Task 1 (项目脚手架) 是所有任务的前置依赖
- Task 2 (数据库) 依赖 Task 1
- Task 3 (认证) 依赖 Task 1, Task 2
- Task 4 (布局) 依赖 Task 1
- Task 5 (首页) 依赖 Task 1, Task 4
- Task 6 (Agent 基础) 依赖 Task 1, Task 2
- Task 7 (编译引擎) 依赖 Task 6
- Task 8 (导师页) 依赖 Task 6, Task 7
- Task 9 (测评) 依赖 Task 6, Task 7
- Task 10 (辩论) 依赖 Task 6
- Task 11 (记忆复习) 依赖 Task 6, Task 7
- Task 12 (分析) 依赖 Task 7, Task 8, Task 11
- Task 13 (SylHub) 依赖 Task 2
- Task 14 (管理后台) 依赖 Task 2, Task 4
- Task 15 (Planner) 依赖 Task 6, Task 7
- Task 16 (会话管理) 依赖 Task 2, Task 6
- Task 17 (Docker) 依赖 Task 1
- Task 18 (文档) 依赖所有任务完成
