export interface BipolarSliderDef {
  id: number;
  /** polo esquerdo = humano */
  left: string;
  /** polo direito = máquina */
  right: string;
}

export const SLIDERS: BipolarSliderDef[] = [
  { id: 1, left: "Presença", right: "Produtividade" },
  { id: 2, left: "Afeto", right: "Eficiência" },
  { id: 3, left: "Intuição", right: "Dados" },
  { id: 4, left: "Ritual", right: "Processo" },
  { id: 5, left: "Vínculo", right: "Métrica" },
  { id: 6, left: "Sentido", right: "Performance" },
  { id: 7, left: "Originalidade", right: "Padronização" },
  { id: 8, left: "Confiança", right: "Controle" },
];
