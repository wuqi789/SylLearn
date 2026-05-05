"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  Star,
  ArrowRight,
  PackageOpen,
  BookOpen,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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

const MOCK_PACKAGES: MarketplaceItem[] = [
  {
    id: "pkg-001",
    title: "博弈论入门",
    description:
      "从囚徒困境到纳什均衡，系统学习博弈论的核心概念。涵盖完全信息博弈、混合策略、子博弈完美均衡等关键主题，通过大量现实案例帮助理解抽象理论。",
    author: "张教授",
    domain: "economics",
    difficulty: 3,
    tags: ["经济学", "博弈论", "策略思维"],
    prerequisites: ["概率论基础", "微观经济学入门"],
    objectives: [
      "理解纳什均衡的概念与求解方法",
      "掌握完全信息博弈与不完全信息博弈的区别",
      "能够运用博弈论分析现实问题",
    ],
    downloads: 1280,
    rating: 4.7,
    createdAt: "2026-03-15",
  },
  {
    id: "pkg-002",
    title: "Python 编程基础",
    description:
      "零基础入门 Python 编程，从变量类型到面向对象，循序渐进。包含数据结构、函数式编程、文件处理等实用技能，配合丰富的编程练习。",
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
  {
    id: "pkg-003",
    title: "线性代数精讲",
    description:
      "深度讲解线性代数核心概念：向量空间、线性变换、特征值与特征向量。结合几何直觉与代数推导，适合计算机科学和工程学方向的学习者。",
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
  {
    id: "pkg-004",
    title: "世界近代史",
    description:
      "从大航海时代到冷战结束，梳理世界近代史的关键脉络。聚焦工业革命、两次世界大战、殖民体系瓦解等重大事件，培养历史思维能力。",
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
  {
    id: "pkg-005",
    title: "物理学思维",
    description:
      "不只是公式推导，更是思维方式的训练。从经典力学到量子物理，学习物理学家如何建模、简化和解决问题。适合所有想培养科学思维的学习者。",
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
  {
    id: "pkg-006",
    title: "哲学导论",
    description:
      "从苏格拉底到存在主义，一次穿越两千年的思想之旅。探讨知识论、伦理学、美学等核心分支，通过哲学对话训练批判性思维。",
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
  {
    id: "pkg-007",
    title: "机器学习基础",
    description:
      "从线性回归到深度学习，系统掌握机器学习核心算法。理论与实践并重，每个算法都配有数学推导和代码实现，适合有一定编程基础的学习者。",
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
  {
    id: "pkg-008",
    title: "概率论与数理统计",
    description:
      "扎实的概率统计基础是数据科学的基石。涵盖随机变量、概率分布、假设检验、回归分析等核心内容，注重直觉培养与实际应用。",
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
];

const FILTER_TABS = [
  { key: "hot", label: "热门" },
  { key: "new", label: "最新" },
  { key: "fav", label: "收藏" },
] as const;

const TAG_FILTERS = ["数学", "物理", "计算机", "经济学", "历史", "哲学"];

const DOMAIN_COLORS: Record<string, string> = {
  economics: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  computer_science: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  mathematics: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  history: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  physics: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  philosophy: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
};

function DifficultyStars({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < level
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

export default function SylHubPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"hot" | "new" | "fav">("hot");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [packages, setPackages] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch("/api/marketplace");
        const data = await res.json();
        if (data.packages && data.packages.length > 0) {
          setPackages(
            data.packages.map((pkg: MarketplaceItem & { tags: string | string[] }) => ({
              ...pkg,
              tags: typeof pkg.tags === "string" ? JSON.parse(pkg.tags) : pkg.tags,
              prerequisites:
                typeof pkg.prerequisites === "string"
                  ? JSON.parse(pkg.prerequisites)
                  : pkg.prerequisites,
              objectives:
                typeof pkg.objectives === "string"
                  ? JSON.parse(pkg.objectives)
                  : pkg.objectives,
            }))
          );
        } else {
          setPackages(MOCK_PACKAGES);
        }
      } catch {
        setPackages(MOCK_PACKAGES);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  const filtered = useMemo(() => {
    let result = [...packages];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(q) ||
          pkg.description.toLowerCase().includes(q) ||
          pkg.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (activeTag) {
      result = result.filter((pkg) => pkg.tags.includes(activeTag));
    }

    switch (activeTab) {
      case "hot":
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case "new":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "fav":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [packages, search, activeTab, activeTag]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SylHub</h1>
          <p className="text-muted-foreground">
            探索社区创建的学习包，发现新知识
          </p>
        </div>
        <Button className="gap-1.5">
          <BookOpen className="size-4" />
          发布学习包
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索学习包名称、描述或标签..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 pl-9"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-all",
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          {TAG_FILTERS.map((tag) => (
            <Badge
              key={tag}
              variant={activeTag === tag ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-2/3 rounded bg-muted" />
                <div className="mt-1 h-4 w-full rounded bg-muted" />
                <div className="mt-0.5 h-4 w-4/5 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="h-5 w-14 rounded-full bg-muted" />
                  <div className="h-5 w-16 rounded-full bg-muted" />
                </div>
              </CardContent>
              <CardFooter>
                <div className="h-8 w-full rounded bg-muted" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16"
        >
          <PackageOpen className="size-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-medium">未找到匹配的学习包</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            尝试调整搜索关键词或清除筛选条件
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearch("");
              setActiveTag(null);
              setActiveTab("hot");
            }}
          >
            清除筛选
          </Button>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${activeTag}-${search}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-1 text-base">
                        {pkg.title}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "shrink-0",
                          DOMAIN_COLORS[pkg.domain]
                        )}
                      >
                        {pkg.domain === "computer_science"
                          ? "计算机"
                          : pkg.domain === "economics"
                          ? "经济学"
                          : pkg.domain === "mathematics"
                          ? "数学"
                          : pkg.domain === "history"
                          ? "历史"
                          : pkg.domain === "physics"
                          ? "物理"
                          : "哲学"}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {pkg.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-3">
                    <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium">{pkg.author}</span>
                      <DifficultyStars level={pkg.difficulty} />
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Download className="size-3" />
                          {pkg.downloads >= 1000
                            ? `${(pkg.downloads / 1000).toFixed(1)}k`
                            : pkg.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          {pkg.rating.toFixed(1)}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        render={
                          <Link href={`/sylhub/${pkg.id}`} />
                        }
                      >
                        查看详情
                        <ArrowRight className="size-3" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
