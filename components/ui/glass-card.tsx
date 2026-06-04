import { cn } from "@/lib/cn";

/** Card glassmorphism (darkmode) — usado pra dar contraste a texto sobre fundos vivos. */
export function GlassCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-claro/15 bg-black/45 px-6 py-7 backdrop-blur-md",
        "shadow-[0_8px_40px_rgba(0,0,0,0.45)] supports-[backdrop-filter]:bg-black/35",
        className
      )}
    >
      {children}
    </div>
  );
}
