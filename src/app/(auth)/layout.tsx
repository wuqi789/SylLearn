import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 h-[500px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[300px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-primary/3 blur-3xl" />
        <div className="absolute left-0 bottom-1/3 h-[250px] w-[250px] -translate-x-1/2 rounded-full bg-primary/4 blur-3xl" />
      </div>

      <Link
        href="/"
        className="mb-8 flex items-center gap-2.5 text-2xl font-bold"
      >
        <GraduationCap className="size-8 text-primary" />
        SylLearn
      </Link>

      {children}
    </div>
  );
}
