import { cn } from "@/lib/cn";

/**
 * Cabeçalho editorial reutilizável: kicker numerado (mono, rosa) +
 * título display + subtítulo opcional. Padroniza o ritmo de todas as telas.
 */
export function ScreenHeader({
  index,
  kicker,
  title,
  subtitle,
  className,
  align = "left",
}: {
  index?: string;
  kicker: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {index && (
          <span className="hw-kicker tabular text-rosa">{index}</span>
        )}
        {index && <span className="h-px w-8 bg-rosa/50" aria-hidden />}
        <span className="hw-kicker text-claro/50">{kicker}</span>
      </div>
      <h1
        className="hw-title text-claro"
        style={{ fontSize: "var(--text-h2)" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={cn(
            "mt-1 max-w-[52ch] font-mono leading-relaxed text-claro/55",
            align === "center" && "mx-auto"
          )}
          style={{ fontSize: "var(--text-meta)" }}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
