# SylLearn MVP 验收清单

## 项目基础
- [x] Next.js 14 项目可正常启动（`npm run dev`）
- [x] TypeScript 编译无错误
- [x] Tailwind CSS 样式正常加载
- [x] shadcn/ui 组件可正常使用
- [x] 目录结构符合 spec 设计
- [x] .env.example 文件存在且包含所有必要环境变量

## 数据库
- [x] Prisma Schema 定义完整（所有核心表）
- [x] `prisma migrate dev` 可正常执行
- [x] 种子数据可正常导入
- [x] Prisma 客户端可正常连接

## 认证系统
- [x] 注册 API 正常工作
- [x] 登录 API 正常工作，返回 JWT token
- [x] 匿名试用可正常访问
- [x] 认证中间件正确保护需登录的 API
- [x] 登录/注册页面 UI 完整、交互正常

## 页面完整性
- [x] 首页 Landing Page 包含 Hero 区、核心价值、CTA 按钮
- [x] Dashboard 展示今日任务、掌握度、复习提醒、最近会话
- [x] Tutor 教学页包含 Skill 树、对话区、知识卡片、交互按钮
- [x] Debate 辩论页包含多观点对照、证据卡片、用户追问区
- [x] Review 复习页包含间隔重复卡片、掌握度曲线、复习列表
- [x] SylHub 市场页包含教纲卡片列表、搜索筛选
- [x] Admin 管理页包含统计面板
- [x] 登录/注册页包含表单和匿名试用入口

## Agent 系统
- [x] MockAdapter 可生成结构化响应
- [x] Compiler Agent 可将知识点编译为结构化 Skill
- [x] Tutor Agent 可进行苏格拉底式对话
- [x] Exam Agent 可自动出题和判分
- [x] Debate Agent 可生成多观点辩论
- [x] Memory Agent 可记录学习状态
- [x] Planner Agent 可推荐学习路径
- [x] Agent 编排器可正确调度 Agent

## 学习流程
- [x] 用户输入主题 → 系统自动创建会话
- [x] 知识编译 → 生成 Skill Card（核心概念、前置知识、例题、复习卡片）
- [x] 导师 Agent 对话 → 苏格拉底式教学
- [x] 用户答题 → 即时反馈（掌握/模糊/错误）
- [x] "我不懂"按钮 → 降低难度重新解释
- [x] "再举一个例子"按钮 → 提供新示例
- [x] "换个角度解释"按钮 → 换一种讲解方式
- [x] "生成测验"按钮 → 触发 Exam Agent 出题
- [x] "加入复习计划"按钮 → 写入复习系统

## 记忆与复习
- [x] 学习状态自动记录到记忆系统
- [x] 间隔重复算法正确计算下次复习时间
- [x] 复习卡片正确展示待复习内容
- [x] 掌握度曲线正确反映学习进度

## UI 质量
- [x] 整体风格统一（卡片化布局、圆角、阴影、颜色）
- [x] 响应式设计，移动端可用
- [x] 空状态有明确引导
- [x] 加载状态有指示器
- [x] 错误状态有友好提示
- [x] 按钮有 hover/active/disabled 状态
- [x] 页面切换有过渡动画

## 部署与文档
- [x] Dockerfile 可正常构建镜像
- [x] docker-compose.yml 可正常启动服务
- [x] README.md 包含项目概述、环境配置、安装步骤、运行方法、功能说明
- [x] README.md 包含常见问题解决方案

## 代码质量
- [x] 无 TypeScript 类型错误
- [x] 无 ESLint 警告
- [x] 代码模块化、可维护
- [x] 不包含硬编码的密钥或敏感信息
- [x] 无无用的 import 和变量
