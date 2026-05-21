import type { Scale } from '../types';

interface GradeEntry {
  score: number;
  scale60: string;
  scale51: string;
  scale65: string;
}

// Matriz extraída directamente del archivo "matriz de conversion de puntaje a nota.xlsx"
// Hoja: "Escalas" — Columnas: A=Puntaje, B=Nota 60%, C=Nota 51%, D=Nota 65%
const GRADE_MATRIX: GradeEntry[] = [
  { score: 0,   scale60: "1.0", scale51: "1.0", scale65: "1.0" },
  { score: 1,   scale60: "1.1", scale51: "1.1", scale65: "1.0" },
  { score: 2,   scale60: "1.1", scale51: "1.1", scale65: "1.1" },
  { score: 3,   scale60: "1.2", scale51: "1.2", scale65: "1.1" },
  { score: 4,   scale60: "1.2", scale51: "1.2", scale65: "1.2" },
  { score: 5,   scale60: "1.3", scale51: "1.3", scale65: "1.2" },
  { score: 6,   scale60: "1.3", scale51: "1.4", scale65: "1.3" },
  { score: 7,   scale60: "1.4", scale51: "1.4", scale65: "1.3" },
  { score: 8,   scale60: "1.4", scale51: "1.5", scale65: "1.4" },
  { score: 9,   scale60: "1.5", scale51: "1.5", scale65: "1.4" },
  { score: 10,  scale60: "1.5", scale51: "1.6", scale65: "1.5" },
  { score: 11,  scale60: "1.6", scale51: "1.6", scale65: "1.5" },
  { score: 12,  scale60: "1.6", scale51: "1.7", scale65: "1.6" },
  { score: 13,  scale60: "1.7", scale51: "1.8", scale65: "1.6" },
  { score: 14,  scale60: "1.7", scale51: "1.8", scale65: "1.6" },
  { score: 15,  scale60: "1.8", scale51: "1.9", scale65: "1.7" },
  { score: 16,  scale60: "1.8", scale51: "1.9", scale65: "1.7" },
  { score: 17,  scale60: "1.9", scale51: "2.0", scale65: "1.8" },
  { score: 18,  scale60: "1.9", scale51: "2.1", scale65: "1.8" },
  { score: 19,  scale60: "2.0", scale51: "2.1", scale65: "1.9" },
  { score: 20,  scale60: "2.0", scale51: "2.2", scale65: "1.9" },
  { score: 21,  scale60: "2.1", scale51: "2.2", scale65: "2.0" },
  { score: 22,  scale60: "2.1", scale51: "2.3", scale65: "2.0" },
  { score: 23,  scale60: "2.2", scale51: "2.4", scale65: "2.1" },
  { score: 24,  scale60: "2.2", scale51: "2.4", scale65: "2.1" },
  { score: 25,  scale60: "2.3", scale51: "2.5", scale65: "2.2" },
  { score: 26,  scale60: "2.3", scale51: "2.5", scale65: "2.2" },
  { score: 27,  scale60: "2.4", scale51: "2.6", scale65: "2.2" },
  { score: 28,  scale60: "2.4", scale51: "2.6", scale65: "2.3" },
  { score: 29,  scale60: "2.5", scale51: "2.7", scale65: "2.3" },
  { score: 30,  scale60: "2.5", scale51: "2.8", scale65: "2.4" },
  { score: 31,  scale60: "2.6", scale51: "2.8", scale65: "2.4" },
  { score: 32,  scale60: "2.6", scale51: "2.9", scale65: "2.5" },
  { score: 33,  scale60: "2.7", scale51: "2.9", scale65: "2.5" },
  { score: 34,  scale60: "2.7", scale51: "3.0", scale65: "2.6" },
  { score: 35,  scale60: "2.8", scale51: "3.1", scale65: "2.6" },
  { score: 36,  scale60: "2.8", scale51: "3.1", scale65: "2.7" },
  { score: 37,  scale60: "2.9", scale51: "3.2", scale65: "2.7" },
  { score: 38,  scale60: "2.9", scale51: "3.2", scale65: "2.8" },
  { score: 39,  scale60: "3.0", scale51: "3.3", scale65: "2.8" },
  { score: 40,  scale60: "3.0", scale51: "3.4", scale65: "2.8" },
  { score: 41,  scale60: "3.1", scale51: "3.4", scale65: "2.9" },
  { score: 42,  scale60: "3.1", scale51: "3.5", scale65: "2.9" },
  { score: 43,  scale60: "3.2", scale51: "3.5", scale65: "3.0" },
  { score: 44,  scale60: "3.2", scale51: "3.6", scale65: "3.0" },
  { score: 45,  scale60: "3.3", scale51: "3.6", scale65: "3.1" },
  { score: 46,  scale60: "3.3", scale51: "3.7", scale65: "3.1" },
  { score: 47,  scale60: "3.4", scale51: "3.8", scale65: "3.2" },
  { score: 48,  scale60: "3.4", scale51: "3.8", scale65: "3.2" },
  { score: 49,  scale60: "3.5", scale51: "3.9", scale65: "3.3" },
  { score: 50,  scale60: "3.5", scale51: "3.9", scale65: "3.3" },
  { score: 51,  scale60: "3.6", scale51: "4.0", scale65: "3.4" },
  { score: 52,  scale60: "3.6", scale51: "4.1", scale65: "3.4" },
  { score: 53,  scale60: "3.7", scale51: "4.1", scale65: "3.4" },
  { score: 54,  scale60: "3.7", scale51: "4.2", scale65: "3.5" },
  { score: 55,  scale60: "3.8", scale51: "4.2", scale65: "3.5" },
  { score: 56,  scale60: "3.8", scale51: "4.3", scale65: "3.6" },
  { score: 57,  scale60: "3.9", scale51: "4.4", scale65: "3.6" },
  { score: 58,  scale60: "3.9", scale51: "4.4", scale65: "3.7" },
  { score: 59,  scale60: "4.0", scale51: "4.5", scale65: "3.7" },
  { score: 60,  scale60: "4.0", scale51: "4.6", scale65: "3.8" },
  { score: 61,  scale60: "4.1", scale51: "4.6", scale65: "3.8" },
  { score: 62,  scale60: "4.2", scale51: "4.7", scale65: "3.9" },
  { score: 63,  scale60: "4.2", scale51: "4.7", scale65: "3.9" },
  { score: 64,  scale60: "4.3", scale51: "4.8", scale65: "4.0" },
  { score: 65,  scale60: "4.4", scale51: "4.9", scale65: "4.0" },
  { score: 66,  scale60: "4.5", scale51: "4.9", scale65: "4.1" },
  { score: 67,  scale60: "4.5", scale51: "5.0", scale65: "4.2" },
  { score: 68,  scale60: "4.6", scale51: "5.0", scale65: "4.3" },
  { score: 69,  scale60: "4.7", scale51: "5.1", scale65: "4.3" },
  { score: 70,  scale60: "4.8", scale51: "5.2", scale65: "4.4" },
  { score: 71,  scale60: "4.8", scale51: "5.2", scale65: "4.5" },
  { score: 72,  scale60: "4.9", scale51: "5.3", scale65: "4.6" },
  { score: 73,  scale60: "5.0", scale51: "5.3", scale65: "4.7" },
  { score: 74,  scale60: "5.1", scale51: "5.4", scale65: "4.8" },
  { score: 75,  scale60: "5.1", scale51: "5.5", scale65: "4.9" },
  { score: 76,  scale60: "5.2", scale51: "5.5", scale65: "4.9" },
  { score: 77,  scale60: "5.3", scale51: "5.6", scale65: "5.0" },
  { score: 78,  scale60: "5.4", scale51: "5.7", scale65: "5.1" },
  { score: 79,  scale60: "5.4", scale51: "5.7", scale65: "5.2" },
  { score: 80,  scale60: "5.5", scale51: "5.8", scale65: "5.3" },
  { score: 81,  scale60: "5.6", scale51: "5.8", scale65: "5.4" },
  { score: 82,  scale60: "5.7", scale51: "5.9", scale65: "5.5" },
  { score: 83,  scale60: "5.7", scale51: "6.0", scale65: "5.5" },
  { score: 84,  scale60: "5.8", scale51: "6.0", scale65: "5.6" },
  { score: 85,  scale60: "5.9", scale51: "6.1", scale65: "5.7" },
  { score: 86,  scale60: "6.0", scale51: "6.1", scale65: "5.8" },
  { score: 87,  scale60: "6.0", scale51: "6.2", scale65: "5.9" },
  { score: 88,  scale60: "6.1", scale51: "6.3", scale65: "6.0" },
  { score: 89,  scale60: "6.2", scale51: "6.3", scale65: "6.1" },
  { score: 90,  scale60: "6.3", scale51: "6.4", scale65: "6.1" },
  { score: 91,  scale60: "6.3", scale51: "6.4", scale65: "6.2" },
  { score: 92,  scale60: "6.4", scale51: "6.5", scale65: "6.3" },
  { score: 93,  scale60: "6.5", scale51: "6.6", scale65: "6.4" },
  { score: 94,  scale60: "6.6", scale51: "6.6", scale65: "6.5" },
  { score: 95,  scale60: "6.6", scale51: "6.7", scale65: "6.6" },
  { score: 96,  scale60: "6.7", scale51: "6.8", scale65: "6.7" },
  { score: 97,  scale60: "6.8", scale51: "6.8", scale65: "6.7" },
  { score: 98,  scale60: "6.9", scale51: "6.9", scale65: "6.8" },
  { score: 99,  scale60: "6.9", scale51: "6.9", scale65: "6.9" },
  { score: 100, scale60: "7.0", scale51: "7.0", scale65: "7.0" },
];

export function getGrade(score: number, scale: Scale): string {
  if (score < 0 || score > 100) return "";
  const rounded = Math.round(score);
  const entry = GRADE_MATRIX.find(e => e.score === rounded);
  if (!entry) return "";
  if (scale === "60") return entry.scale60;
  if (scale === "51") return entry.scale51;
  return entry.scale65;
}

/** Formatea nota para mostrar con coma (convención chilena) */
export function formatGrade(grade: string): string {
  if (!grade) return "—";
  return grade.replace(".", ",");
}

/** Devuelve el color semántico según aprobación */
export function getGradeStatus(grade: string): "approved" | "failed" | "none" {
  if (!grade) return "none";
  const num = parseFloat(grade);
  if (isNaN(num)) return "none";
  return num >= 4.0 ? "approved" : "failed";
}
