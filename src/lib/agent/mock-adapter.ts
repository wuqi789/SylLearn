import type { ModelAdapter } from "@/types/agent";

interface TopicContext {
  topic: string;
  domain: string;
  concepts: string[];
  examples: { title: string; detail: string }[];
  exercises: { question: string; type: string; options?: string[]; answer: string }[];
  reviewCards: { front: string; back: string }[];
  misconceptions: string[];
  prerequisites: string[];
}

const TOPIC_DATABASE: Record<string, TopicContext> = {
  纳什均衡: {
    topic: "纳什均衡",
    domain: "博弈论",
    concepts: [
      "纳什均衡是指在一个博弈中，每个参与者在给定其他参与者策略的情况下，都没有动机单方面改变自己策略的状态",
      "纯策略纳什均衡要求每个参与者选择一个确定性的策略",
      "混合策略纳什均衡允许参与者以概率分布随机选择策略",
      "纳什均衡不一定是最优的，囚徒困境就是一个典型的例子",
    ],
    examples: [
      { title: "囚徒困境", detail: "两个嫌疑犯被分开审讯。如果两人都保持沉默，各判1年；如果一人招供另一人沉默，招供者释放，沉默者判10年；如果两人都招供，各判5年。纳什均衡是双方都招供，尽管双方都沉默对整体更有利。" },
      { title: "价格战", detail: "两家竞争企业决定定价策略。如果都定高价，各获利润100万；如果一家降价另一家不降，降价者获得150万，不降者获得20万；如果都降价，各获50万。纳什均衡是双方都降价。" },
      { title: "公共资源博弈", detail: "多个牧民共享一片草地。每个牧民都想多放牧一些牲畜来增加自己的收益，但如果所有人都过度放牧，草地退化，所有人都受损。纳什均衡往往导致'公地悲剧'。" },
    ],
    exercises: [
      { question: "在囚徒困境中，纳什均衡是什么？", type: "open_ended", answer: "双方都选择招供（背叛）。因为无论对方如何选择，招供都是每个参与者的占优策略。" },
      { question: "以下哪项正确描述了纳什均衡的特征？", type: "multiple_choice", options: ["每个参与者都在给定他人策略下做出了最优选择", "纳什均衡总是帕累托最优的", "每个博弈只有一个纳什均衡", "纳什均衡要求参与者之间可以沟通"], answer: "每个参与者都在给定他人策略下做出了最优选择" },
      { question: "纳什均衡一定是社会最优的结果。", type: "true_false", answer: "错误。囚徒困境表明纳什均衡可能不是帕累托最优的。" },
    ],
    reviewCards: [
      { front: "什么是纳什均衡？", back: "在一个博弈中，没有任何一个参与者能通过单方面改变策略来增加自己收益的状态。" },
      { front: "纯策略 vs 混合策略纳什均衡？", back: "纯策略：选择确定性行动。混合策略：按概率分布随机选择行动。混合策略纳什均衡总是存在的（纳什定理）。" },
      { front: "囚徒困境的纳什均衡是什么？", back: "双方都选择背叛（招供），尽管合作（沉默）对双方整体更有利。这说明了个体理性可能导致集体非理性。" },
    ],
    misconceptions: [
      "纳什均衡总是最优的结果——实际上它可能对所有人都不利",
      "纳什均衡意味着参与者之间有合作——实际上每个参与者都是独立决策的",
      "每个博弈只有一个纳什均衡——许多博弈有多个纳什均衡",
    ],
    prerequisites: ["基本的概率论概念", "效用函数与偏好", "策略型博弈的形式化表示"],
  },
  "机器学习": {
    topic: "机器学习",
    domain: "人工智能",
    concepts: [
      "机器学习是让计算机从数据中自动学习规律和模式的方法",
      "监督学习通过标注数据学习输入到输出的映射关系",
      "无监督学习从无标注数据中发现隐藏的结构和模式",
      "过拟合是指模型在训练数据上表现好但在新数据上泛化能力差",
    ],
    examples: [
      { title: "垃圾邮件分类", detail: "将大量已标注的邮件（垃圾/正常）作为训练数据，让模型学习区分特征。新邮件到来时，模型根据学到的特征判断是否为垃圾邮件。这是典型的监督学习分类任务。" },
      { title: "客户分群", detail: "电商平台收集了用户的购买行为数据，没有预先定义的分组。通过聚类算法（如K-Means），自动将用户分成不同群体，发现'高消费忠实用户'、'价格敏感型用户'等模式。" },
      { title: "推荐系统", detail: "Netflix使用协同过滤算法，分析用户的历史观影记录，找到与你口味相似的用户群体，然后推荐他们喜欢但你还没看过的电影。" },
    ],
    exercises: [
      { question: "监督学习和无监督学习的主要区别是什么？", type: "open_ended", answer: "监督学习使用有标注的训练数据（输入-输出对），目标是学习映射关系；无监督学习使用无标注数据，目标是发现数据内在的结构和模式。" },
      { question: "以下哪个是防止过拟合的常用方法？", type: "multiple_choice", options: ["增加模型复杂度", "正则化", "减少训练数据", "增加特征数量"], answer: "正则化" },
      { question: "交叉验证用于评估模型的泛化能力。", type: "true_false", answer: "正确。交叉验证通过将数据分成多份进行训练和验证，更可靠地估计模型在未见数据上的表现。" },
    ],
    reviewCards: [
      { front: "什么是过拟合？如何避免？", back: "模型在训练集上表现好但在测试集上表现差。避免方法：正则化、交叉验证、早停、增加数据量、Dropout等。" },
      { front: "偏差-方差权衡是什么？", back: "偏差衡量模型预测与真实值的系统偏离（欠拟合），方差衡量模型对数据变化的敏感度（过拟合）。好的模型需要在两者之间平衡。" },
      { front: "什么是特征工程？", back: "从原始数据中提取、转换和选择对模型最有用的特征的过程。好的特征工程往往比选择复杂模型更重要。" },
    ],
    misconceptions: [
      "更多的数据总是更好的——质量比数量重要，噪声数据可能有害",
      "深度学习总是优于传统机器学习——在小数据集或结构化数据上未必如此",
      "模型越复杂越好——简单的模型往往更可解释且泛化能力更强",
    ],
    prerequisites: ["线性代数基础", "概率与统计", "微积分基础", "Python编程"],
  },
  "递归": {
    topic: "递归",
    domain: "计算机科学",
    concepts: [
      "递归是一种函数调用自身的编程技术",
      "递归必须有基本情况（base case）来终止递归",
      "递推关系定义了问题如何分解为更小的子问题",
      "尾递归是递归调用是函数最后一步操作的特殊形式",
    ],
    examples: [
      { title: "阶乘计算", detail: "n! = n × (n-1)!，基本情况是 0! = 1。例如 5! = 5 × 4! = 5 × 4 × 3! = ... = 5 × 4 × 3 × 2 × 1 = 120。每次递归将问题规模减1，直到达到基本情况。" },
      { title: "斐波那契数列", detail: "F(n) = F(n-1) + F(n-2)，基本情况 F(0)=0, F(1)=1。这是经典的递归例子，但朴素递归效率很低（指数时间复杂度），可以通过记忆化或动态规划优化。" },
      { title: "二叉树遍历", detail: "遍历二叉树天然适合递归。前序遍历：先访问根节点，再递归遍历左子树，最后递归遍历右子树。树的结构本身就是递归定义的。" },
    ],
    exercises: [
      { question: "什么是递归的两个必要组成部分？", type: "open_ended", answer: "基本情况（base case）和递归步骤（recursive step）。基本情况提供终止条件，递归步骤将问题分解为更小的子问题。" },
      { question: "递归函数如果没有基本情况会怎样？", type: "multiple_choice", options: ["正常运行", "返回默认值", "无限递归导致栈溢出", "自动停止"], answer: "无限递归导致栈溢出" },
      { question: "所有递归算法都可以用迭代方式重写。", type: "true_false", answer: "正确。虽然有些递归（如树遍历）用迭代实现更复杂，但理论上所有递归都可以转化为迭代。" },
    ],
    reviewCards: [
      { front: "递归 vs 迭代？", back: "递归：函数调用自身，代码简洁但可能栈溢出。迭代：使用循环，效率更高但代码可能更复杂。两者可以互相转换。" },
      { front: "什么是记忆化？", back: "缓存已计算的递归结果以避免重复计算。将指数时间复杂度降低到线性，是动态规划的核心思想之一。" },
      { front: "主定理是什么？", back: "用于分析分治递归算法时间复杂度的工具。对于 T(n) = aT(n/b) + O(n^d)，根据 a 与 b^d 的关系确定复杂度。" },
    ],
    misconceptions: [
      "递归总是比迭代慢——某些问题用递归表达更自然且经过优化后效率相当",
      "递归就是循环——递归是通过函数调用栈实现的，涉及状态保存和恢复",
      "尾递归等于循环——虽然在某些语言中编译器会优化，但并非所有语言都支持",
    ],
    prerequisites: ["函数与调用栈的概念", "基本的数据结构（数组、链表）", "时间复杂度分析"],
  },
};

const DEFAULT_CONTEXT: TopicContext = {
  topic: "",
  domain: "通用",
  concepts: [
    "核心概念一：理解该主题的基本定义和关键术语",
    "核心概念二：掌握该领域的基本原理和运作机制",
    "核心概念三：了解该知识在实际中的应用场景",
    "核心概念四：认识该领域的常见误区和边界条件",
  ],
  examples: [
    { title: "入门示例", detail: "从最简单的情景开始，展示该知识点的基本用法。通过具体的操作步骤和预期结果，帮助建立直觉。" },
    { title: "进阶示例", detail: "引入更复杂的情景，展示知识点在实际应用中的处理方式。包含边界情况和常见陷阱的处理。" },
    { title: "综合应用", detail: "将多个知识点结合，解决一个真实世界的问题。展示如何将理论知识转化为实际能力。" },
  ],
  exercises: [
    { question: "请用自己的话解释这个概念的核心含义。", type: "open_ended", answer: "正确答案需要包含核心定义、关键特征和实际意义。" },
    { question: "以下哪项最能准确描述该概念？", type: "multiple_choice", options: ["选项A", "选项B", "选项C", "选项D"], answer: "选项A" },
    { question: "该概念的一个常见误解是它在所有情况下都适用。", type: "true_false", answer: "错误。任何概念都有其适用范围和边界条件。" },
  ],
  reviewCards: [
    { front: "这个概念的核心定义是什么？", back: "核心定义包含三个要素：本质特征、适用范围和关键区别。" },
    { front: "最常见的应用场景是什么？", back: "应用场景包括理论分析、实际问题解决和跨领域迁移。" },
    { front: "与相关概念的关键区别是什么？", back: "关键区别在于适用条件、处理方式和结果特征三个方面。" },
  ],
  misconceptions: [
    "只关注表面定义而忽视深层原理",
    "认为理论和实践是分离的",
    "忽视知识之间的关联性和系统性",
  ],
  prerequisites: ["基础知识", "学习兴趣", "主动思考能力"],
};

function detectDomain(prompt: string): string {
  const domainKeywords: Record<string, string[]> = {
    博弈论: ["博弈", "均衡", "策略", "纳什", "囚徒", "博弈论"],
    人工智能: ["机器学习", "深度学习", "神经网络", "AI", "模型训练", "分类", "聚类"],
    计算机科学: ["算法", "数据结构", "递归", "排序", "复杂度", "编程", "函数"],
    数学: ["微积分", "线性代数", "概率", "统计", "方程", "矩阵"],
    物理: ["力学", "电磁", "量子", "热力学", "光学", "相对论"],
    经济学: ["供需", "市场", "GDP", "通胀", "利率", "货币政策"],
  };
  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    if (keywords.some((k) => prompt.includes(k))) return domain;
  }
  return "通用";
}

function getTopicContext(prompt: string): TopicContext {
  for (const [key, ctx] of Object.entries(TOPIC_DATABASE)) {
    if (prompt.includes(key)) return ctx;
  }
  const domain = detectDomain(prompt);
  return { ...DEFAULT_CONTEXT, domain };
}

function generateCompilerText(topic: string): string {
  const ctx = getTopicContext(topic);
  return `关于"${topic || ctx.domain}"的教学内容编译完成。

核心概念涵盖以下要点：
${ctx.concepts.map((c, i) => `${i + 1}. ${c}`).join("\n")}

实际案例包括：
${ctx.examples.map((e) => `- ${e.title}：${e.detail.substring(0, 60)}...`).join("\n")}

已生成配套练习题${ctx.exercises.length}道、复习卡片${ctx.reviewCards.length}张。
评估标准：能准确阐述核心概念，正确运用实例分析，识别并纠正常见误解。`;
}

function generateTutorText(prompt: string): string {
  const ctx = getTopicContext(prompt);
  const actions = [
    {
      action: "question",
      content: `让我用一个苏格拉底式的问题来引导你思考：\n\n关于${ctx.topic || "这个主题"}，你觉得为什么${ctx.misconceptions[0] || "人们经常对它有误解"}？试着从${ctx.examples[0]?.title || "一个具体的例子"}出发来思考。\n\n💡 提示：关注事物的本质特征，而不仅仅是表面现象。`,
      followUp: "你能用自己的话解释一下你的理解吗？",
    },
    {
      action: "explain",
      content: `让我从基础开始为你解释${ctx.topic || "这个概念"}：\n\n${ctx.concepts[0]}\n\n简单来说，你可以这样理解：${ctx.examples[0]?.detail || "通过具体的例子来帮助理解"}\n\n关键点在于：${ctx.concepts[1] || "理解核心原理"}`,
      followUp: "你觉得哪个部分最需要进一步解释？",
    },
    {
      action: "example",
      content: `让我给你一个具体的例子来说明：\n\n📌 ${ctx.examples[0]?.title || "示例"}\n${ctx.examples[0]?.detail || "这里展示一个具体的应用场景"}\n\n📌 ${ctx.examples[1]?.title || "进阶示例"}\n${ctx.examples[1]?.detail || "更复杂的应用场景"}`,
      followUp: "你能举一个类似的例子吗？",
    },
    {
      action: "simplify",
      content: `让我用更简单的方式来解释：\n\n想象一下，${ctx.examples[0]?.title || "一个日常场景"}——${(ctx.examples[0]?.detail || "").substring(0, 80)}\n\n最核心的一句话就是：${ctx.concepts[0]?.substring(0, 50) || "理解本质"}\n\n不要被复杂的术语吓到，本质上就是这么简单。`,
      followUp: "现在感觉清楚一些了吗？还有什么地方觉得困惑？",
    },
    {
      action: "challenge",
      content: `很好，既然你已经有了基本理解，让我给你一个挑战性的问题：\n\n🤔 思考题：${ctx.exercises[0]?.question || "请深入思考这个概念的边界条件"}\n\n这个问题需要你将${ctx.concepts[0]?.substring(0, 30) || "核心概念"}和${ctx.concepts[1]?.substring(0, 30) || "进阶知识"}结合起来思考。\n\n提示：注意${ctx.misconceptions[0] || "常见的思维陷阱"}。`,
      followUp: "你的答案是什么？为什么这样认为？",
    },
  ];
  const chosen = actions[Math.floor(Math.random() * actions.length)];
  return JSON.stringify(chosen);
}

function generateExamText(prompt: string): string {
  const ctx = getTopicContext(prompt);
  return JSON.stringify({
    questions: ctx.exercises.map((ex) => ({
      question: ex.question,
      type: ex.type,
      options: ex.options,
      answer: ex.answer,
      explanation: `本题考查对${ctx.topic || "核心概念"}的理解。${ex.answer}`,
    })),
  });
}

function generateDebateText(prompt: string): string {
  const ctx = getTopicContext(prompt);
  const topic = ctx.topic || ctx.domain;
  return JSON.stringify({
    positions: [
      {
        role: "支持者",
        stance: `${topic}是当前领域中最重要的发展方向之一`,
        arguments: [
          `${ctx.concepts[0] || "从理论基础来看"}，这一方向具有坚实的理论支撑`,
          `实际应用中已经证明了其价值，例如${ctx.examples[0]?.title || "多个成功案例"}`,
          `随着技术发展，${topic}的应用场景将更加广泛`,
        ],
        evidence: [
          `学术研究表明${topic}在多个评估指标上表现优异`,
          `${ctx.examples[0]?.detail?.substring(0, 40) || "行业实践"}已产生显著成果`,
        ],
      },
      {
        role: "质疑者",
        stance: `${topic}存在被过度炒作的风险，需要更审慎的评估`,
        arguments: [
          `${ctx.misconceptions[0] || "存在常见的误解和局限性"}，不能忽视`,
          `在某些特定场景下，传统方法可能更为适用`,
          `过度依赖单一方法论可能导致视野局限`,
        ],
        evidence: [
          `研究显示${topic}在某些基准测试中的优势并不明显`,
          `${ctx.misconceptions[1] || "实践中的挑战"}尚未得到充分解决`,
        ],
      },
      {
        role: "综合者",
        stance: `${topic}的价值需要在正确的语境下进行评估`,
        arguments: [
          `${ctx.concepts[1] || "关键在于理解适用条件"}，而非盲目应用`,
          `最佳实践是将${topic}与其他方法结合使用`,
          `需要建立更完善的评估框架来衡量实际效果`,
        ],
        evidence: [
          `混合方法在${ctx.examples[1]?.title || "多个实际案例"}中表现更优`,
          `领域专家建议根据具体需求选择合适的方法组合`,
        ],
      },
    ],
    controversy: `${topic}的核心争议在于：它是否是解决当前问题的最佳路径，还是需要与其他方法互补？`,
  });
}

function generateMemoryText(prompt: string): string {
  return JSON.stringify({
    masteryAssessment: {
      level: "fuzzy",
      confidence: 0.65,
      strengths: ["基本概念理解正确", "能够识别常见场景"],
      weaknesses: ["对边界条件理解不足", "缺少深层应用能力"],
    },
    reviewSuggestion: {
      priority: "medium",
      recommendedAction: "建议通过具体案例加强理解，并完成配套练习巩固记忆",
      nextReviewDays: 3,
    },
  });
}

function generatePlannerText(prompt: string): string {
  const ctx = getTopicContext(prompt);
  return JSON.stringify({
    learningPath: {
      name: `${ctx.topic || ctx.domain} 学习路径`,
      topics: [
        { topicId: "prereq-1", order: 1, completed: false, name: ctx.prerequisites[0] || "基础知识" },
        { topicId: "prereq-2", order: 2, completed: false, name: ctx.prerequisites[1] || "进阶知识" },
        { topicId: "main", order: 3, completed: false, name: ctx.topic || ctx.domain },
        { topicId: "advanced", order: 4, completed: false, name: `${ctx.topic || ctx.domain} 进阶应用` },
      ],
      estimatedHours: 20,
      difficulty: 3,
    },
    recommendations: [
      `首先掌握${ctx.prerequisites[0] || "基础概念"}，这是理解后续内容的关键`,
      `通过${ctx.examples[0]?.title || "实际案例"}来加深对核心概念的理解`,
      `定期复习${ctx.reviewCards.length}张卡片以巩固记忆`,
    ],
  });
}

export class MockAdapter implements ModelAdapter {
  async generate(prompt: string, context?: Record<string, unknown>): Promise<string> {
    await delay(50 + Math.random() * 100);

    const agentRole = (context?.agentRole as string) || "";
    const topic = (context?.topic as string) || this.extractTopic(prompt);

    if (agentRole === "compiler" || prompt.includes("compile") || prompt.includes("编译")) {
      return generateCompilerText(topic);
    }
    if (agentRole === "tutor" || prompt.includes("teach") || prompt.includes("tutor")) {
      return generateTutorText(topic || prompt);
    }
    if (agentRole === "exam" || prompt.includes("quiz") || prompt.includes("exam")) {
      return generateExamText(topic || prompt);
    }
    if (agentRole === "debate" || prompt.includes("debate") || prompt.includes("辩论")) {
      return generateDebateText(topic || prompt);
    }
    if (agentRole === "memory" || prompt.includes("memory") || prompt.includes("记忆")) {
      return generateMemoryText(topic || prompt);
    }
    if (agentRole === "planner" || prompt.includes("plan") || prompt.includes("规划")) {
      return generatePlannerText(topic || prompt);
    }

    const ctx = getTopicContext(topic || prompt);
    return `关于"${topic || "学习主题"}"的分析：\n\n${ctx.concepts.join("\n")}\n\n该主题属于${ctx.domain}领域，建议先掌握以下前置知识：${ctx.prerequisites.join("、")}。`;
  }

  async generateStructured<T>(prompt: string, schema: string, context?: Record<string, unknown>): Promise<T> {
    await delay(50 + Math.random() * 100);

    const agentRole = (context?.agentRole as string) || "";
    const topic = (context?.topic as string) || this.extractTopic(prompt);

    if (schema.includes("CompilerOutput") || agentRole === "compiler") {
      return this.generateCompilerStructured(topic) as T;
    }
    if (schema.includes("TutorResponse") || agentRole === "tutor") {
      return this.generateTutorStructured(topic || prompt) as T;
    }
    if (schema.includes("ExamOutput") || agentRole === "exam") {
      return this.generateExamStructured(topic || prompt) as T;
    }
    if (schema.includes("DebateOutput") || agentRole === "debate") {
      return this.generateDebateStructured(topic || prompt) as T;
    }
    if (schema.includes("mastery") || agentRole === "memory") {
      return this.generateMemoryStructured(topic || prompt) as T;
    }
    if (schema.includes("LearningPath") || agentRole === "planner") {
      return this.generatePlannerStructured(topic || prompt) as T;
    }

    return JSON.parse(generateCompilerText(topic || prompt)) as T;
  }

  private extractTopic(prompt: string): string {
    for (const key of Object.keys(TOPIC_DATABASE)) {
      if (prompt.includes(key)) return key;
    }
    const match = prompt.match(/(?:topic|主题|学习|about)[：:]\s*(.+?)(?:\s|$|,|，)/i);
    return match?.[1] || prompt.substring(0, 20);
  }

  private generateCompilerStructured(topic: string): unknown {
    const ctx = getTopicContext(topic);
    return {
      topicName: topic || ctx.domain,
      domain: ctx.domain,
      difficulty: 3,
      concepts: ctx.concepts.map((content, i) => ({
        title: `核心概念 ${i + 1}`,
        content,
      })),
      prerequisites: ctx.prerequisites.map((content, i) => ({
        title: `前置知识 ${i + 1}`,
        content,
      })),
      misconceptions: ctx.misconceptions.map((content, i) => ({
        title: `常见误解 ${i + 1}`,
        content,
      })),
      examples: ctx.examples.map((e) => ({
        title: e.title,
        content: e.detail,
      })),
      exercises: ctx.exercises,
      reviewCards: ctx.reviewCards,
      assessmentCriteria: `评估标准：能准确阐述${topic || ctx.domain}的核心概念，正确运用实例分析，识别并纠正常见误解。评分维度包括概念准确性（40%）、实例运用（30%）和批判性思维（30%）。`,
    };
  }

  private generateTutorStructured(prompt: string): unknown {
    const raw = generateTutorText(prompt);
    return JSON.parse(raw);
  }

  private generateExamStructured(topic: string): unknown {
    const ctx = getTopicContext(topic);
    return {
      questions: ctx.exercises.map((ex) => ({
        question: ex.question,
        type: ex.type as "multiple_choice" | "true_false" | "open_ended",
        options: ex.options,
        answer: ex.answer,
        explanation: `本题考查对${topic || "核心概念"}的理解。正确答案：${ex.answer}`,
      })),
    };
  }

  private generateDebateStructured(topic: string): unknown {
    return JSON.parse(generateDebateText(topic));
  }

  private generateMemoryStructured(topic: string): unknown {
    return JSON.parse(generateMemoryText(topic));
  }

  private generatePlannerStructured(topic: string): unknown {
    return JSON.parse(generatePlannerText(topic));
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
