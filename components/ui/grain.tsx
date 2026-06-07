/**
 * Grão global — overlay fixo de ruído sutil que tira a planura do preto puro.
 * Não introduz cor nova (usa overlay/opacidade). pointer-events-none.
 */
export function Grain() {
  return <div className="hw-grain" aria-hidden />;
}
