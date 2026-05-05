# Tasks

- [x] Task 1: 新增 ApiConfig Prisma 模型并执行数据库迁移
  - [x] 在 `prisma/schema.prisma` 中添加 `ApiConfig` 模型（字段：id, provider, apiKey, modelId, endpoint, maxTokens, temperature, extraParams, isActive, createdAt, updatedAt）
  - [x] 运行 `npx prisma migrate dev` 生成迁移并验证数据库表结构
- [x] Task 2: 实现 `/api/admin/api-config` API 路由
  - [x] 创建 `src/app/api/admin/api-config/route.ts`
  - [x] 实现 GET 方法：查询所有配置列表，支持按 provider 筛选
  - [x] 实现 POST 方法：创建新配置，包含字段验证（apiKey 非空、endpoint 合法 URL、temperature 范围 0-2、maxTokens 正整数）
  - [x] 实现 PUT 方法：更新配置，设置 active 时自动将同 provider 其他配置设为 inactive
  - [x] 实现 DELETE 方法：按 id 删除配置
- [x] Task 3: 实现 `/api/admin/api-config/test` 连通性测试路由
  - [x] 创建 `src/app/api/admin/api-config/test/route.ts`
  - [x] 实现 POST 方法：接收配置 id，向对应 AI 服务发送轻量级测试请求
  - [x] 返回连接成功/失败状态和错误信息
- [x] Task 4: 扩展模型适配器工厂
  - [x] 修改 `src/lib/agent/model-adapter.ts`，新增 `getModelAdapter()` 工厂函数
  - [x] 实现从数据库读取 active ApiConfig 的逻辑
  - [x] 根据 provider 类型创建对应适配器实例
  - [x] 无有效配置时回退到 MockAdapter
- [x] Task 5: 实现管理后台 API 配置 UI
  - [x] 在 `src/app/(dashboard)/admin/page.tsx` 中添加 API 配置管理区域
  - [x] 实现预设模型选择卡片（OpenAI、DeepSeek、Xiaomi mimo）
  - [x] 实现配置编辑表单（apiKey 密码输入框含显示/隐藏、modelId、endpoint、maxTokens、temperature 滑块）
  - [x] 实现已保存配置列表展示（卡片形式，显示服务商、模型 ID、状态）
  - [x] 实现编辑、删除、启停操作按钮
  - [x] 实现保存按钮，调用 API 持久化配置
  - [x] 实现测试连接按钮，调用 test API 并显示结果
  - [x] 实现输入验证和错误提示
- [x] Task 6: 构建验证
  - [x] 运行 `npm run build` 确保无编译错误
  - [x] 验证所有新增 API 路由可正常访问
  - [x] 验证管理后台页面 UI 渲染正常

# Task Dependencies
- Task 2 依赖 Task 1（API 路由需要 ApiConfig 模型）
- Task 3 依赖 Task 2（测试路由复用 API 路由的查询逻辑）
- Task 4 依赖 Task 1（适配器工厂需要读取 ApiConfig 数据）
- Task 5 依赖 Task 2 和 Task 3（UI 需要调用 API 路由）
- Task 6 依赖 Task 1-5（构建验证需要所有代码完成）
