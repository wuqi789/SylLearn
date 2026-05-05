# 验证清单

## 数据模型
- [x] `PromptTemplate` 模型包含所有必需字段（id, action, scene, systemPrompt, description, isActive, createdAt, updatedAt）
- [x] 数据库迁移成功执行，`PromptTemplate` 表已创建
- [x] 种子数据包含 7 个默认提示词模板（teach, explain, example, simplify, quiz, review, debate）

## Agent API 路由
- [x] `/api/agents` POST 路由使用 `getModelAdapter()` 获取 AI 适配器
- [x] 从数据库读取对应 action 的 PromptTemplate 作为 systemPrompt
- [x] teach/explain/example/simplify/review action 调用 `adapter.generate()` 返回教学内容
- [x] quiz action 调用适配器生成测验内容
- [x] debate action 使用 `adapter.generateStructured()` 返回 JSON 结构化辩论数据
- [x] 有活跃 AI 配置时返回真实 AI 模型响应（非硬编码内容）
- [x] 无 AI 配置时回退到中文模拟响应
- [x] AI 调用超时（30秒）时返回错误信息
- [x] AI 调用失败时返回结构化错误信息

## 提示词管理 API
- [x] `GET /api/admin/prompts` 返回提示词模板列表
- [x] `GET /api/admin/prompts?scene=tutor` 按场景筛选
- [x] `POST /api/admin/prompts` 创建新模板
- [x] `PUT /api/admin/prompts` 更新模板
- [x] `DELETE /api/admin/prompts` 按 id 删除模板

## 提示词管理 UI
- [x] 管理后台显示"提示词管理"标签页
- [x] 按场景分组展示提示词模板（导师教学 / 辩论学习）
- [x] 支持新建提示词模板
- [x] 支持编辑现有模板（systemPrompt 多行文本编辑）
- [x] 支持删除模板
- [x] 保存后状态提示"已保存，立即生效"

## 前端错误处理
- [x] `use-agent.ts` hook 包含 error 状态
- [x] 导师教学页面显示错误提示信息
- [x] 导师教学页面提供重试按钮
- [x] 辩论学习页面显示错误提示信息
- [x] 辩论学习页面提供重试按钮
- [x] 超时（30秒）时显示"AI 响应超时，请重试"提示

## 构建验证
- [x] `npm run build` 无编译错误
- [x] 所有新增 API 路由可正常访问
- [x] 管理后台页面正常渲染

## 测试验证
- [x] 创建真实会话 ID 用于测试
- [x] `/api/agents` 路由在有效会话 ID 下返回正确响应
- [x] 错误处理机制在无效会话 ID 时正常工作
- [x] 前端页面在真实会话中正常显示 AI 响应
