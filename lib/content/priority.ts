export interface PriorityCategory {
  id: string;
  label: string;
}

export const PRIORITY_CATEGORIES: PriorityCategory[] = [
  { id: "eficiencia", label: "Eficiência e processos" },
  { id: "resultado", label: "Resultado, crescimento e mercado" },
  { id: "cuidado", label: "Cuidado com gente e relações" },
  { id: "autoria", label: "Autoria, inovação e experimentação" },
];

export const PRIORITY_TOTAL = 100;
