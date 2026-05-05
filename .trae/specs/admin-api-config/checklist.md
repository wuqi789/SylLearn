# 验证清单

## 数据模型
- [x] `ApiConfig` 模型包含所有必需字段（id, provider, apiKey, modelId, endpoint, maxTokens, temperature, extraParams, isActive, createdAt, updatedAt）
- [x] 数据库迁移成功执行，`ApiConfig` 表已创建
- [x] `isActive` 字段默认为 `false`

## API 路由
- [x] `GET /api/admin/api-config` 返回配置列表
- [x] `POST /api/admin/api-config` 创建新配置，字段验证生效
- [x] `PUT /api/admin/api-config` 更新配置，设置 active 时同 provider 其他配置自动 inactive
- [x] `DELETE /api/admin/api-config` 按 id 删除配置
- [x] `POST /api/admin/api-config/test` 连通性测试正常工作
- [x] API 密钥为空时返回验证错误
- [x] endpoint 非法 URL 时返回验证错误
- [x] temperature 超出 0-2 范围时返回验证错误
- [x] maxTokens 非正整数时返回验证错误

## 适配器工厂
- [x] `getModelAdapter()` 从数据库读取 active 配置
- [x] 根据 provider 创建对应适配器实例
- [x] 无有效配置时回退到 MockAdapter

## 管理后台 UI
- [x] 管理后台页面显示 API 配置管理区域
- [x] 预设模型选项显示 OpenAI、DeepSeek、Xiaomi mimo
- [x] 选择预设模型后自动填充默认 endpoint
- [x] API 密钥输入框支持密码显示/隐藏切换
- [x] temperature 滑块范围 0-2，默认 0.7
- [x] maxTokens 默认值 4096
- [x] 保存按钮点击后配置持久化到数据库
- [x] 测试连接按钮调用 test API 并显示结果
- [x] 已保存配置以卡片列表形式展示
- [x] 配置卡片显示服务商名称、模型 ID、启用/禁用状态
- [x] 提供编辑、删除、启停操作
- [x] 输入验证错误时显示提示信息
- [x] UI 风格与现有管理后台一致（Card、Badge、framer-motion）

## 构建验证
- [x] `npm run build` 无编译错误
- [x] 所有新增 API 路由可正常访问
- [x] 管理后台页面正常渲染
