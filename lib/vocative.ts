import type { Pronoun } from "@/lib/types";

/**
 * Pronoun → how the Bobo addresses the person.
 * ele/dele → "Irmão", ela/dela → "Amiga", outro/prefiro-não → neutral.
 */
export function vocative(pronome: Pronoun | null): string | null {
  switch (pronome) {
    case "ele":
      return "Irmão";
    case "ela":
      return "Amiga";
    default:
      return null; // neutral: use "ó", "escuta", "presta atenção"
  }
}

/**
 * Replace the {voc} slot in a Bobo line. When neutral, drop the slot and any
 * trailing comma/space it left behind, so lines stay natural.
 */
export function applyVocative(text: string, pronome: Pronoun | null): string {
  const voc = vocative(pronome);
  if (voc) return text.replace(/\{voc\}/g, voc);
  return text
    .replace(/,?\s*\{voc\}/g, "")
    .replace(/\{voc\}\s*,?\s*/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}
