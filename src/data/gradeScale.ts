// gradeScale.ts — re-exporta el motor dinámico y provee wrappers de compatibilidad
import { calculateDynamicGrade, formatGrade as calcFormatGrade } from '../utils/gradeCalculator';
import type { Scale } from '../types';

// ── Wrapper de compatibilidad ─────────────────────────────────────────────────
// Mantiene la firma antigua getGrade(score, scale) usando el motor dinámico.
// Usado por componentes que aún referencian la API anterior.
export function getGrade(score: number, scale: Scale): string {
  return calculateDynamicGrade({
    score,
    maxScore:           100,
    requirementPercent: Number(scale),
    minGrade:           1.0,
    passingGrade:       4.0,
    maxGrade:           7.0,
    roundingMode:       "escalaNotas",
  });
}

// ── Formato y estado ──────────────────────────────────────────────────────────
/** Muestra nota con coma decimal (convención chilena): 4.1 → "4,1" */
export function formatGrade(grade: string): string {
  return calcFormatGrade(grade);
}

/** Color semántico según aprobación (umbral 4.0) */
export function getGradeStatus(grade: string): "approved" | "failed" | "none" {
  if (!grade) return "none";
  const num = parseFloat(grade);
  if (isNaN(num)) return "none";
  return num >= 4.0 ? "approved" : "failed";
}
