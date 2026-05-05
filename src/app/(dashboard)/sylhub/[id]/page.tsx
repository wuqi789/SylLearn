"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Download,
  Calendar,
  User,
  BookOpen,
  GraduationCap,
  Target,
  AlertCircle,
  Play,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  author: string;
  domain: string;
  difficulty: number;
  tags: string[];
  prerequisites: string[];
  objectives: string[];
  downloads: number;
  rating: number;
  createdAt: string;
}

const MOCK_PACKAGES: Record<string, MarketplaceItem> = {
  "pkg-001": {
    id: "pkg-001",
    title: "博弈论入门",
    description:
      "从囚徒困境到纳什均衡，系统学习博弈论的核心概念。涵盖完全信息博弈、混合策略、子博弈完美均衡等关键主题，通过大量现实案例帮助理解抽象理论。博弈论是研究理性决策者之间策略互动的数学模型，广泛应用于经济学、政治学、生物学和计算机科学等领域。本课程将从最基本的二人零和博弈开始，逐步引入更复杂的多方博弈模型。",
    author: "张教授",
    domain: "economics",
    difficulty: 3,
    tags: ["经济学", "博弈论", "策略思维"],
    prerequisites: ["概率论基础", "微观经济学入门"],
    objectives: [
      "理解纳什均衡的概念与求解方法",
      "掌握完全信息博弈与不完全信息博弈的区别",
      "能够运用博弈论分析现实问题",
      "了解混合策略均衡与子博弈完美均衡",
    ],
    downloads: 1280,
    rating: 4.7,
    createdAt: "2026-03-15",
  },
  "pkg-002": {
    id: "pkg-002",
    title: "Python 编程基础",
    description:
      "零基础入门 Python 编程，从变量类型到面向对象，循序渐进。包含数据结构、函数式编程、文件处理等实用技能，配合丰富的编程练习。Python 是当今最流行的编程语言之一，以其简洁优雅的语法和强大的生态系统著称。无论你是想进入数据科学、Web 开发还是自动化领域，Python 都是最佳起点。",
    author: "李老师",
    domain: "computer_science",
    difficulty: 2,
    tags: ["计算机", "Python", "编程入门"],
    prerequisites: [],
    objectives: [
      "掌握 Python 基本语法和数据类型",
      "理解函数、类和模块的使用",
      "能够独立完成基础编程项目",
    ],
    downloads: 3560,
    rating: 4.9,
    createdAt: "2026-02-20",
  },
  "pkg-003": {
    id: "pkg-003",
    title: "线性代数精讲",
    description:
      "深度讲解线性代数核心概念：向量空间、线性变换、特征值与特征向量。结合几何直觉与代数推导，适合计算机科学和工程学方向的学习者。线性代数是现代科学与工程的数学基石，从机器学习到计算机图形学，从量子力学到信号处理，无处不在。",
    author: "王教授",
    domain: "mathematics",
    difficulty: 4,
    tags: ["数学", "线性代数", "矩阵"],
    prerequisites: ["高中数学", "基础微积分"],
    objectives: [
      "理解向量空间和线性变换的本质",
      "掌握特征值分解和 SVD 分解",
      "能够将线性代数应用于机器学习场景",
    ],
    downloads: 2100,
    rating: 4.8,
    createdAt: "2026-01-10",
  },
  "pkg-004": {
    id: "pkg-004",
    title: "世界近代史",
    description:
      "从大航海时代到冷战结束，梳理世界近代史的关键脉络。聚焦工业革命、两次世界大战、殖民体系瓦解等重大事件，培养历史思维能力。学习历史不仅是了解过去，更是理解现在和预见未来的钥匙。",
    author: "陈教授",
    domain: "history",
    difficulty: 2,
    tags: ["历史", "世界史", "近代史"],
    prerequisites: [],
    objectives: [
      "掌握世界近代史的主要时间线和事件",
      "理解不同历史事件之间的因果关系",
      "培养多角度分析历史问题的能力",
    ],
    downloads: 890,
    rating: 4.5,
    createdAt: "2026-04-05",
  },
  "pkg-005": {
    id: "pkg-005",
    title: "物理学思维",
    description:
      "不只是公式推导，更是思维方式的训练。从经典力学到量子物理，学习物理学家如何建模、简化和解决问题。适合所有想培养科学思维的学习者。物理学教会我们用简洁的数学语言描述复杂的自然现象，这种思维方式可以迁移到任何领域。",
    author: "赵教授",
    domain: "physics",
    difficulty: 3,
    tags: ["物理", "科学思维", "建模"],
    prerequisites: ["高中物理", "基础微积分"],
    objectives: [
      "理解物理学中的建模与近似方法",
      "掌握从经典到现代物理的核心概念",
      "培养用物理学思维解决跨学科问题的能力",
    ],
    downloads: 1650,
    rating: 4.6,
    createdAt: "2026-03-01",
  },
  "pkg-006": {
    id: "pkg-006",
    title: "哲学导论",
    description:
      "从苏格拉底到存在主义，一次穿越两千年的思想之旅。探讨知识论、伦理学、美学等核心分支，通过哲学对话训练批判性思维。哲学不是象牙塔中的学问，而是每个人日常生活中都在使用的思考工具。",
    author: "刘教授",
    domain: "philosophy",
    difficulty: 2,
    tags: ["哲学", "批判性思维", "伦理学"],
    prerequisites: [],
    objectives: [
      "了解西方哲学的主要流派与核心观点",
      "掌握基本的逻辑推理与论证方法",
      "能够运用哲学思维分析当代问题",
    ],
    downloads: 720,
    rating: 4.4,
    createdAt: "2026-04-12",
  },
  "pkg-007": {
    id: "pkg-007",
    title: "机器学习基础",
    description:
      "从线性回归到深度学习，系统掌握机器学习核心算法。理论与实践并重，每个算法都配有数学推导和代码实现，适合有一定编程基础的学习者。机器学习正在改变每一个行业，理解其背后的原理将让你在 AI 时代保持竞争力。",
    author: "周博士",
    domain: "computer_science",
    difficulty: 4,
    tags: ["计算机", "机器学习", "人工智能"],
    prerequisites: ["Python 编程基础", "线性代数", "概率论"],
    objectives: [
      "理解监督学习与无监督学习的核心算法",
      "掌握模型评估与调参的基本方法",
      "能够独立完成机器学习项目",
    ],
    downloads: 4200,
    rating: 4.9,
    createdAt: "2026-02-01",
  },
  "pkg-008": {
    id: "pkg-008",
    title: "概率论与数理统计",
    description:
      "扎实的概率统计基础是数据科学的基石。涵盖随机变量、概率分布、假设检验、回归分析等核心内容，注重直觉培养与实际应用。本课程用丰富的案例和可视化帮助你建立概率思维。",
    author: "孙教授",
    domain: "mathematics",
    difficulty: 3,
    tags: ["数学", "概率论", "统计学"],
    prerequisites: ["微积分基础"],
    objectives: [
      "理解概率论的核心概念与定理",
      "掌握常见概率分布及其应用场景",
      "能够进行基本的统计推断和假设检验",
    ],
    downloads: 1890,
    rating: 4.7,
    createdAt: "2026-03-20",
  },
};

const SAMPLE_CONTENT: Record<string, { title: string; content: string }[]> = {
  "pkg-001": [
    {
      title: "什么是博弈论？",
      content:
        "博弈论（Game Theory）是研究具有冲突和合作特征的决策问题的数学理论。它为我们提供了一套分析工具，用来理解当多个决策者的利益相互影响时，每个人应该如何做出最优选择。",
    },
    {
      title: "囚徒困境",
      content:
        "两个嫌疑犯被分开审讯，每人可以选择「合作」（保持沉默）或「背叛」（告发对方）。虽然双方都合作是帕累托最优，但理性分析导致双方都选择背叛——这就是纳什均衡。",
    },
    {
      title: "纳什均衡",
      content:
        "纳什均衡是指在一个策略组合中，每个参与者的策略都是对其他参与者策略的最优反应。在纳什均衡状态下，没有任何参与者能够通过单方面改变策略来获得更好的结果。",
    },
  ],
  "pkg-002": [
    {
      title: "Python 简介与环境搭建",
      content:
        "Python 是一种解释型、面向对象的高级编程语言。它由 Guido van Rossum 于 1991 年创建，以简洁优雅的语法著称。安装 Python 后，你可以在终端中输入 python3 来启动交互式解释器。",
    },
    {
      title: "变量与数据类型",
      content:
        "Python 中不需要声明变量类型，解释器会自动推断。基本数据类型包括：int（整数）、float（浮点数）、str（字符串）、bool（布尔值）、list（列表）、dict（字典）、tuple（元组）。",
    },
    {
      title: "控制流语句",
      content:
        "Python 使用缩进来表示代码块，而不是花括号。if/elif/else 用于条件分支，for 和 while 用于循环。列表推导式是 Python 中一种优雅的创建列表的方式。",
    },
  ],
};

const SAMPLE_EXERCISES: Record<string, { question: string; options: string[]; answer: number }[]> = {
  "pkg-001": [
    {
      question: "在囚徒困境中，纳什均衡是什么？",
      options: ["双方都合作", "双方都背叛", "一方合作一方背叛", "不存在纳什均衡"],
      answer: 1,
    },
    {
      question: "纳什均衡的定义是？",
      options: [
        "所有参与者收益最大的策略组合",
        "每个参与者的策略都是对其他人策略的最优反应",
        "博弈的唯一解",
        "社会总福利最大的状态",
      ],
      answer: 1,
    },
  ],
  "pkg-002": [
    {
      question: "Python 中以下哪个不是合法的变量名？",
      options: ["my_var", "_count", "2nd_value", "__init__"],
      answer: 2,
    },
    {
      question: "type([1, 2, 3]) 的输出是什么？",
      options: ["<class 'tuple'>", "<class 'array'>", "<class 'list'>", "<class 'set'>"],
      answer: 2,
    },
  ],
};

const DOMAIN_LABELS: Record<string, string> = {
  economics: "经济学",
  computer_science: "计算机科学",
  mathematics: "数学",
  history: "历史学",
  physics: "物理学",
  philosophy: "哲学",
};

function DifficultyStars({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < level
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [pkg, setPkg] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackage() {
      try {
        const res = await fetch(`/api/marketplace?search=${id}`);
        const data = await res.json();
        if (data.packages && data.packages.length > 0) {
          const found = data.packages.find(
            (p: MarketplaceItem & { tags: string | string[] }) => p.id === id
          );
          if (found) {
            setPkg({
              ...found,
              tags: typeof found.tags === "string" ? JSON.parse(found.tags) : found.tags,
              prerequisites:
                typeof found.prerequisites === "string"
                  ? JSON.parse(found.prerequisites)
                  : found.prerequisites,
              objectives:
                typeof found.objectives === "string"
                  ? JSON.parse(found.objectives)
                  : found.objectives,
            });
            return;
          }
        }
        setPkg(MOCK_PACKAGES[id] || null);
      } catch {
        setPkg(MOCK_PACKAGES[id] || null);
      } finally {
        setLoading(false);
      }
    }
    fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        <div className="h-10 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-32 w-full animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <AlertCircle className="size-12 text-muted-foreground/40" />
        <h2 className="mt-4 text-lg font-medium">学习包未找到</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          请检查链接是否正确
        </p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/sylhub")}>
          返回市场
        </Button>
      </div>
    );
  }

  const sampleContent = SAMPLE_CONTENT[id] || SAMPLE_CONTENT["pkg-001"];
  const sampleExercises = SAMPLE_EXERCISES[id] || SAMPLE_EXERCISES["pkg-001"];

  return (
    <div className="space-y-8">
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5"
        onClick={() => router.push("/sylhub")}
      >
        <ArrowLeft className="size-4" />
        返回市场
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                  {pkg.title}
                </h1>
                <Badge variant="secondary">
                  {DOMAIN_LABELS[pkg.domain] || pkg.domain}
                </Badge>
              </div>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {pkg.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="size-4" />
                {pkg.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Download className="size-4" />
                {pkg.downloads.toLocaleString()} 次下载
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                {pkg.rating.toFixed(1)} 评分
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {pkg.createdAt}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">难度</span>
              <DifficultyStars level={pkg.difficulty} />
              <span className="text-sm text-muted-foreground">
                {pkg.difficulty}/5
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {pkg.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="w-full shrink-0 space-y-3 lg:w-64">
            <Button size="lg" className="w-full gap-2" render={<Link href="/sessions" />}>
              <Play className="size-4" />
              开始学习
            </Button>
            <Button variant="outline" size="lg" className="w-full gap-2">
              <Download className="size-4" />
              下载学习包
            </Button>
          </div>
        </div>
      </motion.div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="size-4 text-primary" />
              领域
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{DOMAIN_LABELS[pkg.domain]}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="size-4 text-primary" />
              前置知识
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pkg.prerequisites.length > 0 ? (
              <ul className="space-y-1.5">
                {pkg.prerequisites.map((prereq) => (
                  <li key={prereq} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="size-3.5 text-muted-foreground" />
                    {prereq}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">无需前置知识</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="size-4 text-primary" />
              学习目标
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {pkg.objectives.map((obj) => (
                <li key={obj} className="flex items-start gap-2 text-sm">
                  <GraduationCap className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  {obj}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            课件预览
          </CardTitle>
          <CardDescription>以下是部分课件内容预览</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sampleContent.map((item, i) => (
            <div key={i} className="rounded-lg border p-4">
              <h4 className="font-medium">{item.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="size-5 text-primary" />
            题库样例
          </CardTitle>
          <CardDescription>试做以下练习题感受难度</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sampleExercises.map((exercise, i) => (
            <div key={i} className="rounded-lg border p-4">
              <h4 className="font-medium">
                {i + 1}. {exercise.question}
              </h4>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {exercise.options.map((opt, j) => (
                  <div
                    key={j}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors",
                      j === exercise.answer
                        ? "border-primary/30 bg-primary/5"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                        j === exercise.answer
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {String.fromCharCode(65 + j)}
                    </span>
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center justify-center rounded-xl border border-dashed py-8">
        <div className="text-center">
          <GraduationCap className="mx-auto size-8 text-muted-foreground/40" />
          <p className="mt-2 text-sm text-muted-foreground">
            想要查看完整内容？
          </p>
          <Button className="mt-3 gap-2" render={<Link href="/sessions" />}>
            <Play className="size-4" />
            开始学习此主题
          </Button>
        </div>
      </div>
    </div>
  );
}
