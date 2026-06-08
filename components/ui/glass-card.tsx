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
        // vidro de verdade: bem translúcido + blur forte (deixa o fundo
        // vivo atravessar borrado) + borda interna de luz (refração).
        "relative rounded-2xl border border-claro/20 bg-black/30 px-6 py-7 backdrop-blur-xl",
        "shadow-[0_10px_44px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(242,242,242,0.18),inset_0_0_0_1px_rgba(242,242,242,0.04)]",
        "supports-[backdrop-filter]:bg-black/20",
        className
      )}
    >
      {/* leve brilho diagonal de vidro */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-claro/[0.06] to-transparent"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
