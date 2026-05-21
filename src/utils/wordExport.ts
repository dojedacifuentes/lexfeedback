import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, Footer, ShadingType, VerticalAlign,
} from 'docx';
import type { EvaluationData, AppConfig } from '../types';
import { formatGrade } from '../data/gradeScale';

function formatDateForWord(isoDate: string): string {
  if (!isoDate) return '—';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase();
}

const DARK_BLUE  = '1E3A5F';
const GRAPHITE   = '3E4657';
const LIGHT_GRAY = 'F5F7FB';
const MID_GRAY   = 'C3C8D4';
const FOOTER_GRAY = '9099A8';
const BODY_COLOR  = '1C1C26';

const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: 'auto' } as const;

export async function generateWord(evaluation: EvaluationData, config: AppConfig): Promise<void> {
  // ── PIE DE PÁGINA ──────────────────────────────────────
  const footerText = [
    config.subject || 'Asignatura',
    config.professor,
    `Estudiante: ${evaluation.studentName || '—'}`,
  ].join('  ·  ');

  const footer = new Footer({
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: footerText, size: 16, color: FOOTER_GRAY, font: 'Calibri' }),
        ],
        border: {
          top: { style: BorderStyle.SINGLE, size: 4, color: MID_GRAY, space: 4 },
        },
        alignment: AlignmentType.LEFT,
      }),
    ],
  });

  // ── TABLA DE DATOS ──────────────────────────────────────
  const infoRows: [string, string][] = [
    ['Asignatura',       config.subject || '—'],
    ['Profesor titular', config.professor],
    ['Estudiante',       evaluation.studentName || '—'],
    ['Prueba N°',        evaluation.testNumber  || '—'],
    ['Puntaje total',    `${evaluation.totalScore || '—'} / 100`],
    ['Escala aplicada',  `${evaluation.scale}%`],
    ['Nota final',       formatGrade(evaluation.finalGrade)],
    ['Fecha',            formatDateForWord(evaluation.date)],
  ];

  const gradeNum = parseFloat(evaluation.finalGrade);
  const gradeColor = gradeNum >= 4.0 ? '166534' : '8B1A1A';

  const infoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top:            NO_BORDER,
      bottom:         NO_BORDER,
      left:           NO_BORDER,
      right:          NO_BORDER,
      insideHorizontal: NO_BORDER,
      insideVertical:   NO_BORDER,
    },
    rows: infoRows.map(([label, value], i) => {
      const bg = i % 2 === 0
        ? { type: ShadingType.CLEAR, color: 'auto', fill: LIGHT_GRAY }
        : undefined;
      const isGrade = label === 'Nota final';

      return new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: bg,
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 40, bottom: 40, left: 80, right: 40 },
            borders: { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER },
            children: [new Paragraph({
              children: [new TextRun({ text: label, bold: true, size: 19, color: GRAPHITE, font: 'Calibri' })],
              spacing: { before: 20, after: 20 },
            })],
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            shading: bg,
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 40, bottom: 40, left: 80, right: 40 },
            borders: { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER },
            children: [new Paragraph({
              children: [new TextRun({
                text: value,
                bold: isGrade,
                size: isGrade ? 22 : 19,
                color: isGrade ? gradeColor : BODY_COLOR,
                font: 'Calibri',
              })],
              spacing: { before: 20, after: 20 },
            })],
          }),
        ],
      });
    }),
  });

  // ── CUERPO: RETROALIMENTACIÓN ────────────────────────────
  const feedbackParagraphs = evaluation.feedback.split('\n').map(line =>
    new Paragraph({
      children: [new TextRun({ text: line, size: 21, font: 'Calibri', color: BODY_COLOR })],
      spacing: { before: line.trim() === '' ? 0 : 80, after: 0, line: 320, lineRule: 'auto' },
    })
  );

  // ── DOCUMENTO ───────────────────────────────────────────
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1134, bottom: 1417, left: 1247, right: 1247 },
        },
      },
      footers: { default: footer },
      children: [
        // Título principal
        new Paragraph({
          children: [new TextRun({
            text: 'Retroalimentación de Evaluación',
            bold: true, size: 34, color: DARK_BLUE, font: 'Calibri',
          })],
          spacing: { after: 100 },
        }),
        // Subtítulo + línea inferior azul
        new Paragraph({
          children: [new TextRun({
            text: `${config.subject || 'Asignatura'}  ·  Pontificia Universidad Católica de Valparaíso`,
            size: 18, color: '6E7488', font: 'Calibri',
          })],
          spacing: { after: 200 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 12, color: DARK_BLUE, space: 6 },
          },
        }),
        // Tabla de datos
        infoTable,
        // Separador
        new Paragraph({
          children: [],
          spacing: { before: 200, after: 0 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 4, color: MID_GRAY, space: 6 },
          },
        }),
        // Espacio
        new Paragraph({ children: [], spacing: { before: 80, after: 0 } }),
        // Título sección
        new Paragraph({
          children: [new TextRun({
            text: 'Retroalimentación',
            bold: true, size: 26, color: DARK_BLUE, font: 'Calibri',
          })],
          spacing: { before: 80, after: 160 },
        }),
        // Cuerpo
        ...feedbackParagraphs,
      ],
    }],
  });

  // ── DESCARGA ─────────────────────────────────────────────
  const blob = await Packer.toBlob(doc);
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = `retroalimentacion_${slugify(evaluation.studentName || 'estudiante')}_prueba${evaluation.testNumber || '1'}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
