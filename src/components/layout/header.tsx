"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Search,
  Plus,
  LogOut,
  Settings,
  User,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Header({ className }: { className?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-lg sm:px-6",
        className
      )}
    >
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
          <Menu className="size-5" />
          <span className="sr-only">打开菜单</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="size-5 text-primary" />
              SylLearn
            </SheetTitle>
          </SheetHeader>
          <MobileNav onNavigate={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <Link href="/" className="flex items-center gap-2">
        <GraduationCap className="size-6 text-primary" />
        <span className="hidden text-lg font-semibold sm:inline-block">
          SylLearn
        </span>
      </Link>

      <div className="relative ml-auto hidden max-w-sm flex-1 md:ml-8 md:block">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索知识点、会话..."
          className="h-9 pl-8"
          readOnly
        />
      </div>

      <div className="ml-auto flex items-center gap-2 md:ml-0">
        <Button size="sm" className="hidden gap-1.5 sm:flex">
          <Plus className="size-4" />
          新建学习
        </Button>
        <Button size="icon-sm" className="sm:hidden">
          <Plus className="size-4" />
          <span className="sr-only">新建学习</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="rounded-full" />
            }
          >
            <Avatar>
              <AvatarFallback>用</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuItem>
                <User className="size-4" />
                个人资料
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4" />
                设置
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut className="size-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "学习会话", href: "/sessions", icon: "💬" },
  { label: "导师教学", href: "/tutor", icon: "🎓" },
  { label: "辩论学习", href: "/debate", icon: "⚡" },
  { label: "复习计划", href: "/review", icon: "🔄" },
  { label: "学习分析", href: "/analytics", icon: "📈" },
  { label: "SylHub", href: "/sylhub", icon: "🌐" },
  { label: "管理后台", href: "/admin", icon: "⚙️" },
];

function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <span className="text-base">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
