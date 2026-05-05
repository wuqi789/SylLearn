# 导师教学与辩论学习 AI 模型集成 Spec

## Why
当前 `/api/agents` 路由使用 `generateAgentResponse()` 返回硬编码的英文模拟响应，完全未接入已在管理后台配置好的 AI 模型。导师教学和辩论学习页面的 UI 已完善，但背后调用的是 Mock 数据而非真实 AI 服务。需要将 API 路由对接到 `getModelAdapter()`，并通过提示词模板系统为不同教学场景提供专业的中文提示词。

## What Changes
- 修改 `/api/agents` 路由，使用 `getModelAdapter()` + `AgentOrchestrator` 替代 `generateAgentResponse()` 模拟函数
- 新增 `PromptTemplate` Prisma 模型，用于持久化存储各教学场景的系统提示词
- 新增 `/api/admin/prompts` API 路由，支持提示词的 CRUD 操作
- 在管理后台新增提示词管理 UI 区域
- 添加 AI 调用超时控制和错误处理机制（含重试选项）
- 为导师教学（teach/explain/example/simplify/quiz/review）和辩论学习（debate）预设中文提示词模板

## Impact
- Affected specs: Agent 系统、管理后台
- Affected code:
  - `src/app/api/agents/route.ts` — 核心变更：接入真实 AI 适配器
  - `prisma/schema.prisma` — 新增 PromptTemplate 模型
  - `src/app/api/admin/prompts/route.ts` — 新增提示词管理 API
  - `src/app/(dashboard)/admin/page.tsx` — 扩展管理后台 UI
  - `prisma/seed.ts` — 添加默认提示词种子数据

## ADDED Requirements

### Requirement: AI 模型真实接入
系统 SHALL 将 Agent API 路由对接到已配置的真实 AI 模型服务。

#### Scenario: 导师教学提问
- **WHEN** 用户在导师教学页面提交问题
- **THEN** 系统调用 `getModelAdapter()` 获取当前活跃的 AI 适配器
- **AND** 使用对应场景的提示词模板构造请求
- **AND** 返回中文的教学回答内容

#### Scenario: 辩论学习提问
- **WHEN** 用户在辩论页面提交辩论主题或追问
- **THEN** 系统使用辩论场景的提示词模板
- **AND** AI 以结构化 JSON 格式返回正反方论点和证据
- **AND** 返回中文的辩论内容

#### Scenario: 无 AI 配置时回退
- **WHEN** 管理后台未配置任何 AI 模型
- **THEN** 系统回退到 MockAdapter 模拟响应
- **AND** 返回中文的模拟教学内容（非英文）

### Requirement: 提示词模板管理
系统 SHALL 提供提示词模板的持久化存储和管理能力。

#### Scenario: 提示词数据模型
- **WHEN** 创建提示词模板
- **THEN** 包含字段：action（动作类型）、scene（场景：tutor/debate）、systemPrompt（系统提示词）、description（描述）、isActive（是否启用）

#### Scenario: 预设提示词模板
- **WHEN** 系统初始化时
- **THEN** 自动创建以下默认模板：
  - teach: 导师教学主提示词（含教学目标、学科领域、学生水平参数）
  - explain: 概念解释提示词
  - example: 示例生成提示词
  - simplify: 简化讲解提示词
  - quiz: 测验生成提示词
  - review: 复习总结提示词
  - debate: 辩论引导提示词（含辩论规则、论点构建、反驳技巧）

#### Scenario: 提示词模板 CRUD
- **WHEN** 管理员操作提示词模板
- **THEN** 支持创建、读取、更新、删除操作
- **AND** 更新后立即生效，无需重启

### Requirement: 错误处理与重试
系统 SHALL 提供完善的 AI 调用错误处理机制。

#### Scenario: 超时处理
- **WHEN** AI 模型响应超过 30 秒
- **THEN** 返回超时错误信息给前端
- **AND** 前端显示"AI 响应超时，请重试"提示

#### Scenario: 调用失败重试
- **WHEN** AI 模型调用失败（网络错误、API 错误等）
- **THEN** 前端显示错误信息和"重试"按钮
- **AND** 点击重试按钮重新发送上次请求

### Requirement: 提问历史记录
系统 SHALL 保留完整的提问和回答历史。

#### Scenario: 历史加载
- **WHEN** 用户进入已有会话
- **THEN** 自动加载该会话的所有历史消息
- **AND** 按时间顺序展示

## MODIFIED Requirements

### Requirement: Agent API 路由
现有 `/api/agents` 路由需从模拟响应改为真实 AI 调用。

#### 变更说明
- 移除 `generateAgentResponse()` 硬编码函数
- 引入 `getModelAdapter()` 获取 AI 适配器
- 引入 `AgentOrchestrator` 处理不同 action 的业务逻辑
- 从数据库读取对应 action 的提示词模板
- 添加超时控制（AbortSignal.timeout）
- 返回结构化错误信息

## REMOVED Requirements
无
