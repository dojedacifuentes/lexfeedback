import type { EvaluationData, AppConfig } from '../types';
import { formatGrade, getGradeStatus } from '../data/gradeScale';

interface DocumentPreviewProps {
  evaluation: EvaluationData;
  config: AppConfig;
}

function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return '—';
  const [year, month, day] = isoDate.split('-');
  const months = [
    'enero','febrero','marzo','abril','mayo','junio',
    'julio','agosto','septiembre','octubre','noviembre','diciembre'
  ];
  return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
}

export default function DocumentPreview({ evaluation, config }: DocumentPreviewProps) {
  const isEmpty = !evaluation.studentName && !evaluation.feedback && !evaluation.totalScore;
  const gradeStatus = getGradeStatus(evaluation.finalGrade);

  return (
    <div className="bg-white rounded-2xl shadow-card border border-graphite-100 overflow-hidden">
      {/* Barra superior de la tarjeta */}
      <div className="px-6 py-4 bg-graphite-50 border-b border-graphite-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white border border-graphite-200 flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-academic-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-graphite-800">Vista previa del documento</h2>
            <p className="text-xs text-graphite-400">Aproximación al PDF que se generará</p>
          </div>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-graphite-100 text-graphite-500 border border-graphite-200">
          Solo lectura
        </span>
      </div>

      {/* Documento simulado */}
      <div className="p-6 lg:p-10 bg-graphite-50/30">
        <div
          className="bg-white shadow-[0_2px_16px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)] rounded-sm mx-auto max-w-2xl"
          style={{ minHeight: isEmpty ? 'auto' : '580px' }}
        >
          {/* Papel simulado con márgenes */}
          <div className="px-10 py-10">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-graphite-100 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-graphite-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm text-graphite-400 font-medium">La vista previa aparecerá aquí</p>
                <p className="text-xs text-graphite-300 mt-1">Complete los datos del panel izquierdo para ver el documento</p>
              </div>
            ) : (
              <>
                {/* Título del documento */}
                <div className="mb-5 pb-4 border-b-2 border-academic-600">
                  <h3
                    className="text-lg font-bold text-academic-700 font-serif leading-tight"
                    style={{ fontFamily: 'Georgia, Cambria, serif' }}
                  >
                    Retroalimentación de Evaluación
                  </h3>
                  <p className="text-xs text-graphite-400 mt-1">
                    {config.subject} · Pontificia Universidad Católica de Valparaíso
                  </p>
                </div>

                {/* Tabla de datos */}
                <div className="mb-5">
                  {[
                    ['Asignatura',       config.subject || <em className="text-graphite-300">—</em>],
                    ['Profesor titular', config.professor],
                    ['Estudiante',       evaluation.studentName || <em className="text-graphite-300">sin nombre</em>],
                    ['Prueba N°',        evaluation.testNumber || <em className="text-graphite-300">—</em>],
                    ['Puntaje obtenido', evaluation.totalScore
                      ? `${evaluation.totalScore} / ${evaluation.scaleConfig.maxScore}`
                      : <em className="text-graphite-300">—</em>],
                    ['Exigencia aplicada', `${evaluation.scaleConfig.requirementPercent}%`],
                    ['Nota final',       evaluation.finalGrade
                      ? <span className={`font-bold text-sm ${gradeStatus === 'approved' ? 'text-emerald-700' : gradeStatus === 'failed' ? 'text-red-700' : ''}`}>
                          {formatGrade(evaluation.finalGrade)}
                        </span>
                      : <em className="text-graphite-300">—</em>],
                    ['Fecha',            formatDisplayDate(evaluation.date)],
                  ].map(([label, value], i) => (
                    <div
                      key={i}
                      className={`flex text-xs py-1.5 ${i % 2 === 0 ? 'bg-graphite-50/60' : ''}`}
                    >
                      <span className="w-36 font-semibold text-graphite-500 pl-2 flex-shrink-0">
                        {label}
                      </span>
                      <span className="text-graphite-800 pr-2">{value as React.ReactNode}</span>
                    </div>
                  ))}
                </div>

                {/* Separador */}
                <div className="border-t border-graphite-200 mb-5 pt-5">
                  <h4
                    className="text-sm font-bold text-academic-700 mb-3"
                    style={{ fontFamily: 'Georgia, Cambria, serif' }}
                  >
                    Retroalimentación
                  </h4>
                  {evaluation.feedback ? (
                    <div className="text-xs text-graphite-700 leading-relaxed whitespace-pre-wrap font-sans">
                      {evaluation.feedback}
                    </div>
                  ) : (
                    <p className="text-xs text-graphite-300 italic">
                      El texto de retroalimentación aparecerá aquí…
                    </p>
                  )}
                </div>

                {/* Pie de página del documento */}
                <div className="border-t border-graphite-100 mt-8 pt-3">
                  <p className="text-[10px] text-graphite-300 leading-relaxed">
                    Documento generado mediante LexFeedback · Demo creada por {config.createdBy},{' '}
                    {config.createdByRole}.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
