import jsPDF from 'jspdf';
import type { EvaluationData, AppConfig } from '../types';
import { formatGrade } from '../data/gradeScale';

function formatDateForPDF(isoDate: string): string {
  if (!isoDate) return '—';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export function generatePDF(evaluation: EvaluationData, config: AppConfig): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const PW = 210;
  const PH = 297;
  const ML = 22;
  const MR = 22;
  const MT = 28;
  const MB = 28;
  const CW = PW - ML - MR;

  let y = MT;

  const checkBreak = (needed: number) => {
    if (y + needed > PH - MB) {
      doc.addPage();
      y = MT;
    }
  };

  // ── HEADER ──────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(30, 58, 95);
  doc.text('Retroalimentación de Evaluación', ML, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(110, 115, 130);
  doc.text(
    `${config.subject}  ·  Pontificia Universidad Católica de Valparaíso`,
    ML,
    y
  );
  y += 5;

  // Línea divisora principal
  doc.setDrawColor(30, 58, 95);
  doc.setLineWidth(0.7);
  doc.line(ML, y, PW - MR, y);
  y += 9;

  // ── TABLA DE DATOS ──────────────────────────────────────
  const infoRows: [string, string][] = [
    ['Asignatura',       config.subject],
    ['Profesor titular', config.professor],
    ['Estudiante',       evaluation.studentName || '—'],
    ['Prueba N°',        evaluation.testNumber  || '—'],
    ['Puntaje total',    `${evaluation.totalScore || '—'} / 100`],
    ['Escala aplicada',  `${evaluation.scale}%`],
    ['Nota final',       formatGrade(evaluation.finalGrade)],
    ['Fecha',            formatDateForPDF(evaluation.date)],
  ];

  const LABEL_W = 52;
  const ROW_H   = 7;
  const CELL_PAD = 3;

  doc.setFontSize(9.5);

  infoRows.forEach(([label, value], i) => {
    // Fondo alternado
    if (i % 2 === 0) {
      doc.setFillColor(245, 247, 251);
      doc.rect(ML, y - ROW_H + 1.5, CW, ROW_H, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 62, 88);
    doc.text(label, ML + CELL_PAD, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(22, 22, 35);

    // Nota final en negrita y color destacado
    if (label === 'Nota final') {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      const grade = formatGrade(evaluation.finalGrade);
      const gradeNum = parseFloat(evaluation.finalGrade);
      doc.setTextColor(gradeNum >= 4.0 ? 22 : 139, gradeNum >= 4.0 ? 101 : 25, gradeNum >= 4.0 ? 52 : 47);
      doc.text(grade, ML + LABEL_W, y);
      doc.setFontSize(9.5);
      doc.setTextColor(22, 22, 35);
    } else {
      doc.text(value, ML + LABEL_W, y);
    }
    y += ROW_H;
  });

  y += 6;

  // Línea divisora secundaria
  doc.setDrawColor(195, 200, 212);
  doc.setLineWidth(0.3);
  doc.line(ML, y, PW - MR, y);
  y += 9;

  // ── SECCIÓN RETROALIMENTACIÓN ────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 95);
  doc.text('Retroalimentación', ML, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(28, 28, 38);

  const LH = 5.8;

  const paragraphs = evaluation.feedback.split('\n');
  paragraphs.forEach((para) => {
    if (para.trim() === '') {
      y += LH * 0.55;
      return;
    }
    const lines: string[] = doc.splitTextToSize(para, CW) as string[];
    lines.forEach((line: string) => {
      checkBreak(LH + 2);
      doc.text(line, ML, y);
      y += LH;
    });
  });

  // ── PIE DE PÁGINA EN TODAS LAS PÁGINAS ──────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalPages = (doc.internal as any).getNumberOfPages() as number;
  const footerText = [
    config.subject || 'Asignatura',
    config.professor,
    `Estudiante: ${evaluation.studentName || '—'}`,
  ].join('  ·  ');

  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    doc.setDrawColor(195, 200, 212);
    doc.setLineWidth(0.25);
    doc.line(ML, PH - 16, PW - MR, PH - 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(144, 153, 168);
    doc.text(footerText, ML, PH - 10);

    if (totalPages > 1) {
      doc.text(`Página ${p} de ${totalPages}`, PW - MR, PH - 10, { align: 'right' });
    }
  }

  // ── GUARDAR ──────────────────────────────────────────────
  const slug = evaluation.studentName
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase();

  const filename = `retroalimentacion_${slug || 'estudiante'}_prueba${
    evaluation.testNumber || '1'
  }.pdf`;

  doc.save(filename);
}
