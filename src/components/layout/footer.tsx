import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const links = [
  { label: "关于我们", href: "#" },
  { label: "文档", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "社区", href: "#" },
  { label: "隐私政策", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GraduationCap className="size-4 text-primary" />
          <span>© 2026 SylLearn. All rights reserved.</span>
        </div>
        <Separator orientation="vertical" className="hidden h-4 sm:block" />
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Separator orientation="vertical" className="hidden h-4 sm:block" />
        <div className="text-sm text-muted-foreground">
          开发者：吴棋 · <a href="mailto:wuqi173@outlook.com" className="transition-colors hover:text-foreground">wuqi173@outlook.com</a>
        </div>
      </div>
    </footer>
  );
}
