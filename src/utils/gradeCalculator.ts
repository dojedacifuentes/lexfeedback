// ── Motor de cálculo de notas ────────────────────────────────────────────────
// Implementa la escala lineal por dos tramos, compatible con escaladenotas.cl
// No realiza llamadas externas — todo corre localmente en el navegador.

export type RoundingMode = "escalaNotas" | "standard";

export interface GradeConfig {
  score:              number;   // puntaje obtenido
  maxScore:           number;   // puntaje máximo
  requirementPercent: number;   // exigencia 1-100 (e.g. 60 para 60 %)
  minGrade:           number;   // nota mínima  (e.g. 1.0)
  passingGrade:       number;   // nota de aprobación (e.g. 4.0)
  maxGrade:           number;   // nota máxima (e.g. 7.0)
  roundingMode?:      RoundingMode;
}

// ── Redondeo "escalaNotas" ────────────────────────────────────────────────────
// 1. Truncar a 2 decimales (aritmética entera para evitar errores de punto flotante)
// 2. Si la centésima >= 5 → subir la décima; si < 5 → mantener la décima
function roundEscalaNotas(value: number): number {
  const cents    = Math.trunc(value * 100 + 1e-9);   // truncar a centésimas
  const tenths   = Math.trunc(cents / 10);            // parte de las décimas
  const hundredths = cents - tenths * 10;             // centésima
  return (hundredths >= 5 ? tenths + 1 : tenths) / 10;
}

// ── Fórmula principal ─────────────────────────────────────────────────────────
// Tramo reprobatorio: n = (napr - nmin) * p / passingScore + nmin
// Tramo aprobatorio:  n = (nmax - napr) * (p - passingScore) / (pmax - passingScore) + napr
export function calculateDynamicGrade(config: GradeConfig): string {
  const {
    score, maxScore, requirementPercent,
    minGrade, passingGrade, maxGrade,
    roundingMode = "escalaNotas",
  } = config;

  // ── Validaciones ────────────────────────────────────────────────────────────
  if (
    isNaN(score)              || isNaN(maxScore)          ||
    isNaN(requirementPercent) || isNaN(minGrade)          ||
    isNaN(passingGrade)       || isNaN(maxGrade)          ||
    maxScore <= 0             ||
    requirementPercent < 1    || requirementPercent > 100 ||
    minGrade >= passingGrade  || passingGrade >= maxGrade ||
    score < 0                 || score > maxScore
  ) return "";

  const e            = requirementPercent / 100;
  const passingScore = e * maxScore;
  const denom        = maxScore - passingScore; // span del tramo aprobatorio

  let grade: number;

  if (score < passingScore || denom < 1e-9) {
    // Tramo reprobatorio (también cubre el caso límite exigencia = 100 %)
    grade = passingScore > 0
      ? (passingGrade - minGrade) * score / passingScore + minGrade
      : minGrade;
  } else {
    // Tramo aprobatorio
    grade = (maxGrade - passingGrade) * (score - passingScore) / denom + passingGrade;
  }

  // Redondeo
  const rounded =
    roundingMode === "escalaNotas"
      ? roundEscalaNotas(grade)
      : Math.round(grade * 10) / 10;

  // Clamp al rango válido y formatear con un decimal
  const clamped = Math.max(minGrade, Math.min(maxGrade, rounded));
  return clamped.toFixed(1);
}

// ── Formato de nota para la interfaz (coma decimal, convención chilena) ────────
export function formatGrade(value: string | number): string {
  if (value === "" || value === null || value === undefined) return "—";
  const str = typeof value === "number" ? value.toFixed(1) : String(value);
  if (!str || str === "—") return "—";
  return str.replace(".", ",");
}

// ── Información de la escala (texto descriptivo para la UI) ──────────────────
export function scaleInfoText(
  requirementPercent: number,
  maxScore: number,
  passingGrade: number
): string {
  if (isNaN(requirementPercent) || isNaN(maxScore) || maxScore <= 0) return "";
  const ps = (requirementPercent / 100) * maxScore;
  const psStr = ps % 1 === 0 ? ps.toFixed(0) : ps.toFixed(2).replace(".", ",");
  const pg    = formatGrade(passingGrade);
  return `Con exigencia ${requirementPercent}%, la nota ${pg} se alcanza desde ${psStr} pts. de ${maxScore}.`;
}
