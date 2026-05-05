"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Workflow } from "@/components/landing/workflow";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import {
  CodeXml,
  Lock,
  Globe,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const badges = [
  { icon: Lock, label: "Free" },
  { icon: CodeXml, label: "Open Source" },
  { icon: Globe, label: "Self-hosted" },
  { icon: Heart, label: "Community-driven" },
];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("syllearn_token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <Workflow />

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {badges.map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium text-muted-foreground"
                >
                  <b.icon className="size-4 text-primary" />
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              准备好重新定义你的学习方式了吗？
            </h2>
            <p className="mt-4 text-muted-foreground">
              加入 SylLearn，让 AI 智能体为你编译知识、辅导学习。
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 px-8 text-base"
                )}
              >
                免费开始使用
              </Link>
              <Link
                href="#"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 px-8 text-base"
                )}
              >
                查看文档
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
