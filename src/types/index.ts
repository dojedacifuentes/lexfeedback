export type Scale = "51" | "60" | "65";          // conservado para compatibilidad
export type RoundingMode = "escalaNotas" | "standard";

// Configuración dinámica de escala
export interface ScaleConfig {
  maxScore:           string;   // puntaje máximo (ej. "100", "40", "25")
  requirementPercent: string;   // exigencia en % (ej. "51", "60", "65")
  minGrade:           string;   // nota mínima (ej. "1.0")
  passingGrade:       string;   // nota de aprobación (ej. "4.0")
  maxGrade:           string;   // nota máxima (ej. "7.0")
  roundingMode:       RoundingMode;
}

export const DEFAULT_SCALE_CONFIG: ScaleConfig = {
  maxScore:           "100",
  requirementPercent: "51",
  minGrade:           "1.0",
  passingGrade:       "4.0",
  maxGrade:           "7.0",
  roundingMode:       "escalaNotas",
};

export interface AppConfig {
  subject:      string;
  professor:    string;
  createdBy:    string;
  createdByRole:string;
}

export interface EvaluationData {
  studentName:   string;
  testNumber:    string;
  totalScore:    string;
  scaleConfig:   ScaleConfig;   // reemplaza el antiguo 'scale'
  finalGrade:    string;
  isManualGrade: boolean;
  feedback:      string;
  date:          string;
}
