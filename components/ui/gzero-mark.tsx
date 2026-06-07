import { cn } from "@/lib/cn";

const MASK = {
  WebkitMaskImage: "url(/gzero.svg)",
  maskImage: "url(/gzero.svg)",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  aspectRatio: "778 / 378",
} as const;

/**
 * Marca gzero — assinatura discreta da casa.
 * Usa o SVG como máscara, então herda a cor atual (`bg-current`):
 * basta aplicar `text-claro/40`, `text-rosa`, etc. via className.
 * A altura controla o tamanho; a largura sai do aspect-ratio.
 */
export function GZeroMark({
  className,
  label = "gzero",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn("inline-block h-3 bg-current", className)}
      style={MASK}
    />
  );
}
