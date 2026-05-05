# SylLearn MVP - Agent-Native 教育平台

## Why
构建一个开源、永久免费、可自部署的 Agent-Native 教育平台。学习者不是简单地"看课程"，而是在与 AI 智能体协作、训练、辩论、复习的过程中完成知识学习和内化。MVP 版本聚焦核心学习流程，让产品可演示、可开源。

## What Changes
- 从零搭建 Next.js 14+ 项目骨架，使用 App Router + TypeScript + Tailwind CSS + shadcn/ui
- 实现商业化 SaaS 质感的完整 UI（首页、Dashboard、教学页、辩论页、复习页、SylHub、管理后台）
- 实现 Agent 编排系统（Planner、Compiler、Tutor、Exam、Debate、Memory 六大 Agent）
- 实现知识编译引擎：用户输入知识点 → 系统自动拆解为结构化 Skill
- 实现长期记忆与间隔重复复习系统
- 实现数据库层（Prisma + SQLite/PostgreSQL）
- 实现认证系统（JWT + 匿名试用）
- 实现 API Routes 后端
- 提供 Docker 配置、README、.env.example

## Impact
- Affected specs: 全新项目，无已有 spec
- Affected code: 全部代码为新建

## 技术栈

### 前端
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui 组件库
- Framer Motion 动画
- Recharts 图表

### 后端
- Next.js API Routes
- Prisma ORM（MVP 阶段使用 SQLite，架构支持切换 PostgreSQL）
- JWT 认证
- bcryptjs 密码加密

### Agent 系统
- 自定义轻量 Agent 编排框架
- 可插拔模型适配器（默认支持 mock/本地模型，可扩展接入 OpenAI/Anthropic/本地 LLM）
- 六大角色 Agent：Planner、Compiler、Tutor、Exam、Debate、Memory

### 免费原则
- 产品永久免费，所有核心功能开源可自部署
- 不做付费墙、不限制学习次数、不限制知识点数量
- 不依赖收费 SaaS 作为核心能力
- 模型层设计为可插拔适配器，默认支持本地/开源模型

## ADDED Requirements

### Requirement: 用户认证与匿名试用
系统 SHALL 支持用户注册、登录及匿名试用三种方式访问平台。

#### Scenario: 匿名试用
- **WHEN** 用户首次访问平台，不进行注册/登录
- **THEN** 系统分配临时身份，用户可体验完整功能，学习记录在本地保留

#### Scenario: 用户注册
- **WHEN** 用户填写邮箱和密码进行注册
- **THEN** 系统创建账户，返回 JWT token，用户可持久化保存学习记录

#### Scenario: 用户登录
- **WHEN** 用户输入已注册的邮箱和密码
- **THEN** 系统验证凭据，返回 JWT token

### Requirement: 学习会话管理
系统 SHALL 支持用户创建、管理和回顾学习会话。

#### Scenario: 创建学习会话
- **WHEN** 用户输入一个知识点主题（如"纳什均衡"）
- **THEN** 系统自动创建会话，启动知识编译流程

#### Scenario: 查看历史会话
- **WHEN** 用户访问 Dashboard 或会话列表
- **THEN** 系统展示所有历史学习会话及其状态

### Requirement: 知识编译引擎（Skill Compiler）
系统 SHALL 将用户输入的知识点自动编译为结构化教学技能（Skill）。

#### Scenario: 知识编译
- **WHEN** 用户输入一个主题
- **THEN** 系统自动拆解为核心概念、前置知识、常见误区、典型例题、复习卡片、评估标准
- **AND** 生成可视化的 Skill Card

#### Scenario: 编译结果展示
- **WHEN** 编译完成
- **THEN** 用户可以看到结构化的知识图谱、概念解释、示例、练习题

### Requirement: 导师 Agent 教学
系统 SHALL 提供专属导师 Agent，以苏格拉底式提问引导学习。

#### Scenario: 互动教学
- **WHEN** 用户进入教学页，选择一个 Skill
- **THEN** 导师 Agent 以对话方式开始教学，包含概念讲解、提问、例题演示

#### Scenario: 自适应难度
- **WHEN** 用户回答错误或表示不理解
- **THEN** 系统自动降低难度，换一种方式解释，提供更多示例

#### Scenario: 学习交互按钮
- **WHEN** 用户在教学过程中
- **THEN** 可以使用"我不懂"、"再举一个例子"、"换个角度解释"、"生成测验"等交互按钮

### Requirement: 辩论式学习
系统 SHALL 支持多 Agent 围绕争议话题进行辩论，让学习者在冲突中加深理解。

#### Scenario: 启动辩论
- **WHEN** 用户对某个话题选择"开始辩论"
- **THEN** 系统生成多个不同观点的 Agent 角色，左右对照展示观点

#### Scenario: 用户参与辩论
- **WHEN** 辩论进行中
- **THEN** 用户可以提问、投票、追问，系统生成辩论总结

### Requirement: 复习与记忆系统
系统 SHALL 实现长期记忆和间隔重复复习功能。

#### Scenario: 记录学习状态
- **WHEN** 用户完成一次学习或答题
- **THEN** 系统记录掌握度（掌握/模糊/错误/需要复习），写入长期记忆

#### Scenario: 间隔重复复习
- **WHEN** 复习时间到达
- **THEN** 系统展示待复习卡片，用户完成复习后更新掌握度曲线

#### Scenario: 一键复习
- **WHEN** 用户点击"开始 10 分钟复习"
- **THEN** 系统自动筛选需要复习的知识点，进入复习流程

### Requirement: 学习进度分析
系统 SHALL 提供学习进度与掌握度的可视化分析面板。

#### Scenario: Dashboard 展示
- **WHEN** 用户访问 Dashboard
- **THEN** 展示今日学习任务、当前掌握度、需要复习的知识、推荐学习路径

#### Scenario: 掌握度曲线
- **WHEN** 用户查看学习分析
- **THEN** 系统展示知识点掌握度变化曲线、学习时间分布

### Requirement: SylHub 教纲市场
系统 SHALL 提供教纲市场，展示社区贡献的教学资源。

#### Scenario: 浏览教纲
- **WHEN** 用户访问 SylHub 页面
- **THEN** 展示教纲卡片列表，支持搜索、标签筛选、热门/最新排序

#### Scenario: 教纲详情
- **WHEN** 用户点击某个教纲
- **THEN** 展示详情包括适用人群、学习目标、前置知识、难度、课件预览

### Requirement: 管理后台
系统 SHALL 提供简洁的管理后台页面。

#### Scenario: 管理面板
- **WHEN** 管理员访问后台
- **THEN** 展示用户统计、学习数据、系统状态等信息

### Requirement: 商业化 UI 质感
系统 SHALL 提供商业级 SaaS 风格的界面设计。

#### Scenario: 首页展示
- **WHEN** 用户首次访问
- **THEN** 看到高级感的 Landing Page，包含 Hero 区、核心价值、CTA 按钮

#### Scenario: 统一设计语言
- **WHEN** 用户浏览任何页面
- **THEN** 体验一致的设计风格：卡片化布局、统一圆角、柔和阴影、明确层级

## 页面清单（MVP）

1. **首页 Landing Page** - Hero 区 + 核心价值 + 工作流动画 + CTA
2. **Dashboard** - 今日任务 + 掌握度 + 复习提醒 + 最近会话
3. **Tutor 教学页** - Skill 树 + 导师对话 + 知识卡片 + 侧边栏
4. **Debate 辩论页** - 多观点对照 + 证据卡片 + 用户追问
5. **Review 复习页** - 间隔重复卡片 + 掌握度曲线 + 复习列表
6. **SylHub 市场页** - 教纲卡片列表 + 搜索筛选 + 详情预览
7. **Admin 管理页** - 统计面板 + 用户管理 + 系统状态
8. **登录/注册页** - 表单 + 匿名试用入口

## Agent 架构

### 六大 Agent 角色
1. **Planner Agent** - 规划学习路径，分析前置知识依赖
2. **Compiler Agent** - 将知识点编译为结构化 Skill
3. **Tutor Agent** - 苏格拉底式教学引导
4. **Exam Agent** - 自动出题、判分、生成反馈
5. **Debate Agent** - 多观点辩论生成
6. **Memory Agent** - 长期记忆管理、复习调度、个性化偏好记录

### Agent 工作流
Plan → Act → Observe → Reflect 循环

### 模型适配层
- 统一 ModelAdapter 接口
- 默认 MockAdapter（生成结构化模拟响应，用于演示和开发）
- 可扩展接入 OpenAI / Anthropic / 本地 LLM

## 数据模型

### 核心表
- `users` - 用户信息
- `sessions` - 学习会话
- `topics` - 知识主题
- `skills` - 编译后的技能
- `skill_nodes` - 技能节点（概念、例题、练习等）
- `messages` - 对话消息
- `assessments` - 测评记录
- `memory_items` - 记忆项
- `review_plans` - 复习计划
- `debate_threads` - 辩论线程
- `debate_positions` - 辩论立场
- `marketplace_packages` - 教纲包

## 目录结构

```
src/
  app/
    page.tsx                    # 首页
    layout.tsx                  # 根布局
    globals.css                 # 全局样式
    (auth)/
      login/page.tsx            # 登录页
      register/page.tsx         # 注册页
    (dashboard)/
      layout.tsx                # Dashboard 布局（侧边栏）
      page.tsx                  # Dashboard 首页
      sessions/
        page.tsx                # 会话列表
        [id]/page.tsx           # 会话详情
      tutor/
        page.tsx                # 教学页
      debate/
        page.tsx                # 辩论页
        [id]/page.tsx           # 辩论详情
      review/
        page.tsx                # 复习页
      analytics/
        page.tsx                # 学习分析
      sylhub/
        page.tsx                # SylHub 市场
        [id]/page.tsx           # 教纲详情
      admin/
        page.tsx                # 管理后台
    api/
      auth/
        route.ts                # 认证 API
      sessions/
        route.ts                # 会话 API
      skills/
        route.ts                # 技能 API
      agents/
        route.ts                # Agent API
      memory/
        route.ts                # 记忆 API
      review/
        route.ts                # 复习 API
      marketplace/
        route.ts                # 市场 API
  components/
    layout/
      header.tsx                # 顶部导航
      sidebar.tsx               # 侧边栏
      footer.tsx                # 页脚
    ui/                         # shadcn/ui 组件
    learning/
      skill-card.tsx            # Skill 卡片
      knowledge-tree.tsx        # 知识树
      mastery-chart.tsx         # 掌握度图表
      review-card.tsx           # 复习卡片
      question-card.tsx         # 题目卡片
    agent/
      chat-bubble.tsx           # 对话气泡
      agent-avatar.tsx          # Agent 头像
      debate-panel.tsx          # 辩论面板
      thinking-indicator.tsx    # 思考指示器
    landing/
      hero.tsx                  # Hero 区
      features.tsx              # 功能展示
      workflow.tsx              # 工作流动画
  lib/
    db/
      prisma.ts                 # Prisma 客户端
      schema.prisma             # 数据库 Schema
    agent/
      orchestrator.ts           # Agent 编排器
      base-agent.ts             # Agent 基类
      planner.ts                # Planner Agent
      compiler.ts               # Compiler Agent
      tutor.ts                  # Tutor Agent
      exam.ts                   # Exam Agent
      debate.ts                 # Debate Agent
      memory.ts                 # Memory Agent
      model-adapter.ts          # 模型适配层
      mock-adapter.ts           # Mock 适配器
    memory/
      memory-store.ts           # 记忆存储
      spaced-repetition.ts      # 间隔重复算法
      review-scheduler.ts       # 复习调度器
    auth/
      jwt.ts                    # JWT 工具
      middleware.ts             # 认证中间件
    utils/
      cn.ts                     # 类名工具
      format.ts                 # 格式化工具
  types/
    index.ts                    # 类型定义
    agent.ts                    # Agent 类型
    learning.ts                 # 学习类型
  hooks/
    use-auth.ts                 # 认证 Hook
    use-session.ts              # 会话 Hook
    use-agent.ts                # Agent Hook
prisma/
  schema.prisma                 # 数据库 Schema
  seed.ts                       # 种子数据
public/
  favicon.ico
docker-compose.yml
.env.example
README.md
```

## 工程要求
- 代码模块化、易扩展、可维护
- 生成 .env.example
- 生成 Docker 配置
- 生成 README.md（含环境配置、安装步骤、运行方法、功能说明）
- 生成数据库 Schema 和种子数据
- 响应式设计，移动端可用
- 所有学习过程可追踪
