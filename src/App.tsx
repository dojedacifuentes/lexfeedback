import { useState, useEffect } from 'react';
import { getGrade } from './data/gradeScale';
import { generatePDF } from './utils/pdfExport';
import { generateWord } from './utils/wordExport';
import Header from './components/Header';
import EvaluationForm from './components/EvaluationForm';
import FeedbackPanel from './components/FeedbackPanel';
import DocumentPreview from './components/DocumentPreview';
import ActionButtons from './components/ActionButtons';
import Footer from './components/Footer';
import EmailPanel from './components/EmailPanel';
import type { Scale, AppConfig, EvaluationData } from './types';

const BASE_CONFIG = {
  professor:     'Profesor Quintero Fuentes',
  createdBy:     'Diego Ojeda',
  createdByRole: 'Ayudante de Filosofía del Derecho PUCV',
};

function getTodayISO(): string {
  return new Date().toISOString().split('T')[0] ?? '';
}

export default function App() {
  const [subject,      setSubject]      = useState('');
  const [studentName,  setStudentName]  = useState('');
  const [testNumber,   setTestNumber]   = useState('');
  const [totalScore,   setTotalScore]   = useState('');
  const [scale,        setScale]        = useState<Scale>('51');
  const [finalGrade,   setFinalGrade]   = useState('');
  const [isManual,     setIsManual]     = useState(false);
  const [feedback,     setFeedback]     = useState('');
  const [date,         setDate]         = useState(getTodayISO);
  const [warnings,     setWarnings]     = useState<string[]>([]);
  const [copied,       setCopied]       = useState(false);

  const config: AppConfig = { ...BASE_CONFIG, subject };

  // Recalcula nota automáticamente cuando cambia puntaje o escala
  useEffect(() => {
    if (isManual) return;
    if (totalScore === '') { setFinalGrade(''); return; }
    const num = parseFloat(totalScore);
    if (isNaN(num) || num < 0 || num > 100) { setFinalGrade(''); return; }
    setFinalGrade(getGrade(num, scale));
  }, [totalScore, scale, isManual]);

  function handleScoreChange(v: string) {
    setTotalScore(v);
    setIsManual(false);
  }

  function handleScaleChange(v: Scale) {
    setScale(v);
    setIsManual(false);
  }

  function handleGradeManualEdit(v: string) {
    setFinalGrade(v);
    setIsManual(true);
  }

  function handleRestoreAutoGrade() {
    setIsManual(false);
    if (totalScore !== '') {
      const num = parseFloat(totalScore);
      if (!isNaN(num) && num >= 0 && num <= 100) {
        setFinalGrade(getGrade(num, scale));
      }
    }
  }

  function handleClear() {
    setStudentName('');
    setTestNumber('');
    setTotalScore('');
    setFinalGrade('');
    setFeedback('');
    setIsManual(false);
    setWarnings([]);
    // Conserva: scale, date, config
  }

  function buildWarnings(): { blocking: string[]; all: string[] } {
    const all: string[] = [];
    if (!studentName.trim())     all.push('Falta el nombre del estudiante.');
    if (!totalScore.trim())      all.push('Falta el puntaje total.');
    else {
      const n = parseFloat(totalScore);
      if (isNaN(n) || n < 0 || n > 100)
        all.push('El puntaje debe ser un número entre 0 y 100.');
    }
    if (!feedback.trim())        all.push('Falta el texto de retroalimentación.');
    if (!testNumber.trim())      all.push('No se ingresó número de prueba (aparecerá "—" en el PDF).');
    const blocking = all.filter(w => !w.includes('número de prueba'));
    return { blocking, all };
  }

  function buildEvaluation(): EvaluationData {
    return {
      studentName:   studentName.trim(),
      testNumber:    testNumber.trim(),
      totalScore,
      scale,
      finalGrade:    finalGrade || '—',
      isManualGrade: isManual,
      feedback:      feedback.trim(),
      date,
    };
  }

  function handleDownloadPDF() {
    const { blocking, all } = buildWarnings();
    if (blocking.length > 0) { setWarnings(all); return; }
    setWarnings(all);
    generatePDF(buildEvaluation(), config);
  }

  function handleDownloadWord() {
    const { blocking, all } = buildWarnings();
    if (blocking.length > 0) { setWarnings(all); return; }
    setWarnings(all);
    void generateWord(buildEvaluation(), config);
  }

  async function handleCopyText() {
    const lines = [
      'RETROALIMENTACIÓN DE EVALUACIÓN',
      `Asignatura: ${config.subject}`,
      `Profesor titular: ${config.professor}`,
      `Estudiante: ${studentName || '—'}`,
      `Prueba N°: ${testNumber || '—'}`,
      `Puntaje total: ${totalScore || '—'}/100`,
      `Escala aplicada: ${scale}%`,
      `Nota final: ${finalGrade ? finalGrade.replace('.', ',') : '—'}`,
      `Fecha: ${date}`,
      '',
      'RETROALIMENTACIÓN',
      feedback || '—',
      '',
      '---',
      `Documento generado mediante LexFeedback · Demo creada por ${config.createdBy}, ${config.createdByRole}.`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch { /* navegador sin clipboard API */ }
  }

  const evaluationData: EvaluationData = {
    studentName, testNumber, totalScore, scale,
    finalGrade, isManualGrade: isManual, feedback, date,
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header config={config} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Dos columnas: formulario + textarea */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EvaluationForm
            subject={subject}
            studentName={studentName}
            testNumber={testNumber}
            totalScore={totalScore}
            scale={scale}
            finalGrade={finalGrade}
            isManualGrade={isManual}
            date={date}
            onSubjectChange={setSubject}
            onStudentNameChange={setStudentName}
            onTestNumberChange={setTestNumber}
            onTotalScoreChange={handleScoreChange}
            onScaleChange={handleScaleChange}
            onFinalGradeChange={handleGradeManualEdit}
            onDateChange={setDate}
            onRestoreAutoGrade={handleRestoreAutoGrade}
          />
          <FeedbackPanel
            feedback={feedback}
            onFeedbackChange={setFeedback}
          />
        </div>

        {/* Vista previa del documento */}
        <DocumentPreview evaluation={evaluationData} config={config} />

        {/* Botones de acción */}
        <ActionButtons
          onDownloadPDF={handleDownloadPDF}
          onDownloadWord={handleDownloadWord}
          onClear={handleClear}
          onCopyText={handleCopyText}
          onRestoreAutoGrade={handleRestoreAutoGrade}
          isManualGrade={isManual}
          copied={copied}
          warnings={warnings}
          onDismissWarnings={() => setWarnings([])}
        />

        <EmailPanel
          studentName={studentName}
          subject={subject}
          professor={config.professor}
        />
      </main>

      <Footer config={config} />
    </div>
  );
}
