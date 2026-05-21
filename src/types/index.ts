export type Scale = "51" | "60" | "65";

export interface AppConfig {
  subject: string;
  professor: string;
  createdBy: string;
  createdByRole: string;
}

export interface EvaluationData {
  studentName: string;
  testNumber: string;
  totalScore: string;
  scale: Scale;
  finalGrade: string;
  isManualGrade: boolean;
  feedback: string;
  date: string;
}
