# 管理后台 API 配置管理模块 Spec

## Why
当前系统使用 MockAdapter 作为 AI 模型适配器，缺乏真实 AI 模型的配置和管理能力。管理员需要一个直观的界面来配置和管理不同 AI 服务提供商（OpenAI、DeepSeek、Xiaomi mimo）的 API 参数，使系统能够无缝切换和使用真实 AI 服务，且配置变更无需重启即可生效。

## What Changes
- 新增 `ApiConfig` Prisma 模型，用于持久化存储 AI 模型配置信息
- 新增 `/api/admin/api-config` API 路由，支持配置的 CRUD 操作
- 在管理后台新增 API 配置管理 UI 区域，包含模型选择、参数配置表单
- 修改模型适配器系统，支持根据持久化配置动态选择和创建适配器
- 添加配置输入验证和错误提示机制

## Impact
- Affected specs: Agent 系统、管理后台
- Affected code:
  - `prisma/schema.prisma` — 新增 ApiConfig 模型
  - `src/app/(dashboard)/admin/page.tsx` — 扩展管理后台页面
  - `src/app/api/admin/api-config/route.ts` — 新增 API 路由
  - `src/lib/agent/model-adapter.ts` — 扩展适配器工厂逻辑
  - `src/lib/db/prisma.ts` — 数据库连接（已有）

## ADDED Requirements

### Requirement: AI 模型配置数据模型
系统 SHALL 提供 `ApiConfig` 数据模型，用于持久化存储 AI 模型配置。

#### Scenario: 配置字段完整性
- **WHEN** 创建新的 API 配置
- **THEN** 必须包含以下字段：provider（服务商）、apiKey（API 密钥）、modelId（模型 ID）、endpoint（请求地址）、isActive（是否启用）
- **AND** 可选字段：maxTokens、temperature、extraParams（JSON 格式的额外参数）

#### Scenario: 唯一活跃配置约束
- **WHEN** 将某条配置设为 active
- **THEN** 同一 provider 下的其他配置自动设为 inactive

### Requirement: 模型选择功能
系统 SHALL 提供预设的 AI 模型服务商选项。

#### Scenario: 预设模型列表
- **WHEN** 管理员打开 API 配置页面
- **THEN** 显示以下预设选项：OpenAI、DeepSeek、Xiaomi mimo
- **AND** 每个选项显示对应的默认端点地址和推荐参数

#### Scenario: 选择模型后自动填充
- **WHEN** 管理员选择一个预设模型
- **THEN** 自动填充该模型的默认 endpoint 地址
- **AND** 显示该模型特有的配置项

### Requirement: 自定义配置界面
系统 SHALL 提供直观的配置表单，允许管理员为选定模型填写详细参数。

#### Scenario: 表单字段
- **WHEN** 管理员选择或编辑一个模型配置
- **THEN** 显示以下输入字段：
  - API 密钥（密码输入框，支持显示/隐藏切换）
  - 模型 ID（文本输入）
  - 请求地址（URL 输入，带默认值）
  - Max Tokens（数字输入，默认 4096）
  - Temperature（滑块，范围 0-2，默认 0.7）

#### Scenario: 输入验证
- **WHEN** 管理员提交表单
- **THEN** API 密钥不得为空
- **AND** 请求地址必须为合法 URL 格式
- **AND** Temperature 必须在 0-2 范围内
- **AND** Max Tokens 必须为正整数

### Requirement: 实时保存与应用
系统 SHALL 实现保存后立即生效的机制。

#### Scenario: 保存配置
- **WHEN** 管理员点击保存按钮
- **THEN** 配置信息持久化到数据库
- **AND** Agent 系统在下次请求时使用新配置
- **AND** 无需系统重启

#### Scenario: 连通性测试
- **WHEN** 管理员点击测试连接按钮
- **THEN** 系统使用保存的配置向 AI 服务发送测试请求
- **AND** 显示连接成功或失败的结果和错误信息

### Requirement: 界面集成
系统 SHALL 将 API 配置管理区域整合到现有管理后台布局中。

#### Scenario: 页面布局
- **WHEN** 管理员访问管理后台
- **THEN** 在现有管理后台页面中展示 API 配置管理区域
- **AND** 使用与现有 UI 一致的 Card、Badge 等组件风格
- **AND** 保持 framer-motion 动画一致性

#### Scenario: 配置列表与编辑
- **WHEN** 管理员查看 API 配置区域
- **THEN** 显示已配置的服务商列表（卡片形式）
- **AND** 每个卡片显示服务商名称、模型 ID、状态（启用/禁用）
- **AND** 提供编辑和删除操作

## MODIFIED Requirements

### Requirement: 模型适配器系统
现有 MockAdapter 系统需扩展支持根据数据库配置动态创建适配器。

#### 变更说明
- `model-adapter.ts` 中新增工厂函数 `getModelAdapter()`
- 优先从数据库读取 active 配置，创建对应适配器
- 若无配置或配置无效，回退到 MockAdapter

## REMOVED Requirements
无
