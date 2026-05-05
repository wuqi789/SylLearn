import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  await prisma.debatePosition.deleteMany();
  await prisma.debateThread.deleteMany();
  await prisma.reviewPlan.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.memoryItem.deleteMany();
  await prisma.message.deleteMany();
  await prisma.skillNode.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.session.deleteMany();
  await prisma.marketplacePackage.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.user.deleteMany();

  const regularPassword = await bcrypt.hash("password123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);
  const anonPassword = await bcrypt.hash("anonymous", 10);

  const regularUser = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: "student@syllearn.com",
      password: regularPassword,
      name: "学生小明",
      isAnonymous: false,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: "admin@syllearn.com",
      password: adminPassword,
      name: "管理员",
      isAnonymous: false,
    },
  });

  const anonUser = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: "anon-demo@syllearn.local",
      password: anonPassword,
      name: "Guest-Demo",
      isAnonymous: true,
    },
  });

  console.log(`Created users: ${regularUser.name}, ${adminUser.name}, ${anonUser.name}`);

  const topics = await Promise.all([
    prisma.topic.create({
      data: {
        id: uuidv4(),
        name: "纳什均衡",
        domain: "economics",
        difficulty: 3,
        prerequisites: JSON.stringify(["博弈论基础", "概率论入门"]),
        misconceptions: JSON.stringify([
          "纳什均衡一定是帕累托最优",
          "纳什均衡意味着双方合作",
        ]),
        learningObjectives: JSON.stringify([
          "理解纳什均衡的数学定义",
          "能够求解二人有限博弈的纯策略纳什均衡",
          "理解混合策略均衡的概念",
        ]),
      },
    }),
    prisma.topic.create({
      data: {
        id: uuidv4(),
        name: "机器学习基础",
        domain: "computer_science",
        difficulty: 4,
        prerequisites: JSON.stringify(["Python编程", "线性代数", "概率统计"]),
        misconceptions: JSON.stringify([
          "机器学习就是人工智能",
          "更多的数据总是更好",
          "深度学习总是优于传统方法",
        ]),
        learningObjectives: JSON.stringify([
          "理解监督学习与无监督学习的区别",
          "掌握线性回归和逻辑回归的原理",
          "了解过拟合与正则化",
        ]),
      },
    }),
    prisma.topic.create({
      data: {
        id: uuidv4(),
        name: "递归算法",
        domain: "computer_science",
        difficulty: 3,
        prerequisites: JSON.stringify(["基础数据结构", "函数概念"]),
        misconceptions: JSON.stringify([
          "递归总是比迭代慢",
          "递归深度没有限制",
          "所有问题都适合用递归解决",
        ]),
        learningObjectives: JSON.stringify([
          "理解递归的概念和执行过程",
          "掌握递归三要素：基准情况、递归情况、收敛性",
          "能够识别适合递归解决的问题模式",
        ]),
      },
    }),
    prisma.topic.create({
      data: {
        id: uuidv4(),
        name: "量子力学入门",
        domain: "physics",
        difficulty: 5,
        prerequisites: JSON.stringify(["线性代数", "经典力学", "电磁学"]),
        misconceptions: JSON.stringify([
          "量子力学只在微观尺度有效",
          "观测会改变粒子的状态",
          "薛定谔的猫同时是死的和活的",
        ]),
        learningObjectives: JSON.stringify([
          "理解波函数和概率诠释",
          "掌握薛定谔方程的基本形式",
          "理解量子叠加和测量问题",
        ]),
      },
    }),
    prisma.topic.create({
      data: {
        id: uuidv4(),
        name: "文艺复兴",
        domain: "history",
        difficulty: 2,
        prerequisites: JSON.stringify(["中世纪欧洲史基础"]),
        misconceptions: JSON.stringify([
          "文艺复兴只发生在意大利",
          "文艺复兴完全是反宗教的",
          "黑暗时代真的很黑暗",
        ]),
        learningObjectives: JSON.stringify([
          "了解文艺复兴的历史背景和时间线",
          "认识文艺复兴时期的重要人物和作品",
          "理解人文主义的核心思想",
        ]),
      },
    }),
  ]);

  console.log(`Created ${topics.length} topics`);

  const packages = await Promise.all([
    prisma.marketplacePackage.create({
      data: {
        id: uuidv4(),
        title: "博弈论入门",
        description:
          "从囚徒困境到纳什均衡，系统学习博弈论的核心概念。涵盖完全信息博弈、混合策略、子博弈完美均衡等关键主题，通过大量现实案例帮助理解抽象理论。",
        author: "张教授",
        domain: "economics",
        difficulty: 3,
        tags: JSON.stringify(["经济学", "博弈论", "策略思维"]),
        prerequisites: JSON.stringify(["概率论基础", "微观经济学入门"]),
        objectives: JSON.stringify([
          "理解纳什均衡的概念与求解方法",
          "掌握完全信息博弈与不完全信息博弈的区别",
          "能够运用博弈论分析现实问题",
        ]),
        downloads: 1280,
        rating: 4.7,
      },
    }),
    prisma.marketplacePackage.create({
      data: {
        id: uuidv4(),
        title: "Python 编程基础",
        description:
          "零基础入门 Python 编程，从变量类型到面向对象，循序渐进。包含数据结构、函数式编程、文件处理等实用技能，配合丰富的编程练习。",
        author: "李老师",
        domain: "computer_science",
        difficulty: 2,
        tags: JSON.stringify(["计算机", "Python", "编程入门"]),
        prerequisites: JSON.stringify([]),
        objectives: JSON.stringify([
          "掌握 Python 基本语法和数据类型",
          "理解函数、类和模块的使用",
          "能够独立完成基础编程项目",
        ]),
        downloads: 3560,
        rating: 4.9,
      },
    }),
    prisma.marketplacePackage.create({
      data: {
        id: uuidv4(),
        title: "线性代数精讲",
        description:
          "深度讲解线性代数核心概念：向量空间、线性变换、特征值与特征向量。结合几何直觉与代数推导，适合计算机科学和工程学方向的学习者。",
        author: "王教授",
        domain: "mathematics",
        difficulty: 4,
        tags: JSON.stringify(["数学", "线性代数", "矩阵"]),
        prerequisites: JSON.stringify(["高中数学", "基础微积分"]),
        objectives: JSON.stringify([
          "理解向量空间和线性变换的本质",
          "掌握特征值分解和 SVD 分解",
          "能够将线性代数应用于机器学习场景",
        ]),
        downloads: 2100,
        rating: 4.8,
      },
    }),
    prisma.marketplacePackage.create({
      data: {
        id: uuidv4(),
        title: "世界近代史",
        description:
          "从大航海时代到冷战结束，梳理世界近代史的关键脉络。聚焦工业革命、两次世界大战、殖民体系瓦解等重大事件，培养历史思维能力。",
        author: "陈教授",
        domain: "history",
        difficulty: 2,
        tags: JSON.stringify(["历史", "世界史", "近代史"]),
        prerequisites: JSON.stringify([]),
        objectives: JSON.stringify([
          "掌握世界近代史的主要时间线和事件",
          "理解不同历史事件之间的因果关系",
          "培养多角度分析历史问题的能力",
        ]),
        downloads: 890,
        rating: 4.5,
      },
    }),
    prisma.marketplacePackage.create({
      data: {
        id: uuidv4(),
        title: "物理学思维",
        description:
          "不只是公式推导，更是思维方式的训练。从经典力学到量子物理，学习物理学家如何建模、简化和解决问题。适合所有想培养科学思维的学习者。",
        author: "赵教授",
        domain: "physics",
        difficulty: 3,
        tags: JSON.stringify(["物理", "科学思维", "建模"]),
        prerequisites: JSON.stringify(["高中物理", "基础微积分"]),
        objectives: JSON.stringify([
          "理解物理学中的建模与近似方法",
          "掌握从经典到现代物理的核心概念",
          "培养用物理学思维解决跨学科问题的能力",
        ]),
        downloads: 1650,
        rating: 4.6,
      },
    }),
    prisma.marketplacePackage.create({
      data: {
        id: uuidv4(),
        title: "哲学导论",
        description:
          "从苏格拉底到存在主义，一次穿越两千年的思想之旅。探讨知识论、伦理学、美学等核心分支，通过哲学对话训练批判性思维。",
        author: "刘教授",
        domain: "philosophy",
        difficulty: 2,
        tags: JSON.stringify(["哲学", "批判性思维", "伦理学"]),
        prerequisites: JSON.stringify([]),
        objectives: JSON.stringify([
          "了解西方哲学的主要流派与核心观点",
          "掌握基本的逻辑推理与论证方法",
          "能够运用哲学思维分析当代问题",
        ]),
        downloads: 720,
        rating: 4.4,
      },
    }),
  ]);

  console.log(`Created ${packages.length} marketplace packages`);

  // Seed prompt templates
  const promptTemplates = [
    {
      id: "prompt-teach",
      action: "teach",
      scene: "tutor",
      systemPrompt: "你是一位专业的AI导师，擅长深入浅出地讲解复杂概念。请根据以下主题进行教学：\n\n教学要求：\n- 使用清晰、易懂的中文进行讲解\n- 结合实际案例帮助理解\n- 循序渐进，由浅入深\n- 鼓励学生思考，适时提出引导性问题\n- 在适当时候使用比喻和类比\n\n请围绕用户提出的问题进行详细讲解，确保内容准确、有条理。",
      description: "导师教学主提示词",
    },
    {
      id: "prompt-explain",
      action: "explain",
      scene: "tutor",
      systemPrompt: "你是一位善于解释复杂概念的AI导师。请用通俗易懂的语言解释以下概念：\n\n要求：\n1. 先给出简洁的定义\n2. 用日常生活中的例子来类比\n3. 说明该概念的实际应用场景\n4. 如果有相关的前置知识，简要提及\n\n请确保解释清晰准确，适合初学者理解。",
      description: "概念解释提示词",
    },
    {
      id: "prompt-example",
      action: "example",
      scene: "tutor",
      systemPrompt: "你是一位注重实践的AI导师。请为以下主题提供生动具体的示例：\n\n要求：\n1. 提供2-3个不同类型的实际例子\n2. 每个例子都要有详细的步骤说明\n3. 例子应该贴近实际生活或工作场景\n4. 指出例子中涉及的关键知识点\n5. 鼓励学生尝试自己动手实践\n\n请确保示例具有可操作性和教学价值。",
      description: "示例生成提示词",
    },
    {
      id: "prompt-simplify",
      action: "simplify",
      scene: "tutor",
      systemPrompt: "你是一位擅长化繁为简的AI导师。请将以下复杂内容简化为易于理解的形式：\n\n简化方法：\n1. 识别核心要点（不超过3-5个）\n2. 用简单的语言重新表述\n3. 使用类比或比喻帮助理解\n4. 如果适用，用列表或步骤形式呈现\n5. 提供一个简短的总结\n\n目标：让完全没有背景知识的人也能快速理解。",
      description: "简化讲解提示词",
    },
    {
      id: "prompt-quiz",
      action: "quiz",
      scene: "tutor",
      systemPrompt: "你是一位经验丰富的AI出题教师。请根据以下学习主题生成测验题目：\n\n要求：\n1. 生成3-5道选择题或简答题\n2. 题目难度由易到难递进\n3. 覆盖该主题的核心知识点\n4. 每道题提供标准答案和解析\n5. 题目表述清晰，无歧义\n\n出题目的：帮助学生巩固所学知识，发现薄弱环节。",
      description: "测验生成提示词",
    },
    {
      id: "prompt-review",
      action: "review",
      scene: "tutor",
      systemPrompt: "你是一位负责的AI学习助手。请对以下学习内容进行全面的复习总结：\n\n复习内容：\n1. 核心知识点回顾（要点列表）\n2. 重点和难点分析\n3. 常见错误和注意事项\n4. 知识点之间的关联\n5. 推荐的后续学习方向\n\n复习目标：帮助学生系统性地回顾已学内容，强化记忆，查漏补缺。",
      description: "复习总结提示词",
    },
    {
      id: "prompt-debate",
      action: "debate",
      scene: "debate",
      systemPrompt: "你是一位专业的AI辩论导师和裁判。请围绕以下辩题进行引导：\n\n辩论规则：\n1. 客观呈现正反双方的核心论点\n2. 每个论点需有事实或逻辑支撑\n3. 分析双方论证的强弱点\n4. 提供反驳思路和技巧指导\n5. 保持中立，不偏向任何一方\n\n辩论指导要素：\n- 论点构建：如何建立有说服力的论证链\n- 证据运用：如何选择和引用有力证据\n- 反驳技巧：如何识别对方论证漏洞并有效反驳\n- 逻辑分析：常见的逻辑谬误及其识别方法\n\n请以JSON格式返回辩论内容，包含正方论点(pro)、反方论点(con)和总结评价(summary)。",
      description: "辩论引导提示词",
    },
  ];

  for (const template of promptTemplates) {
    await prisma.promptTemplate.upsert({
      where: { id: template.id },
      update: template,
      create: template,
    });
  }
  console.log("Seeded prompt templates");

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
