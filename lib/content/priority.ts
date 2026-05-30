export interface PriorityCategory {
  id: string;
  label: string;
}

export const PRIORITY_CATEGORIES: PriorityCategory[] = [
  { id: "eficiencia", label: "Eficiência e processos" },
  { id: "resultado", label: "Resultado, crescimento e mercado" },
  { id: "cuidado", label: "Cuidado com gente e relações" },
  { id: "autoria", label: "Autoria, inovação e experimentação" },
  { id: "diversidade", label: "Diversidade de verdade — de gente e de jeitos" },
  { id: "impacto", label: "O impacto que deixa no mundo" },
];

export const PRIORITY_TOTAL = 100;
