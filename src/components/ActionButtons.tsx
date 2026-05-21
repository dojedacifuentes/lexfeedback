interface ActionButtonsProps {
  onDownloadPDF: () => void;
  onClear: () => void;
  onCopyText: () => void;
  onRestoreAutoGrade: () => void;
  isManualGrade: boolean;
  copied: boolean;
  warnings: string[];
  onDismissWarnings: () => void;
}

export default function ActionButtons({
  onDownloadPDF, onClear, onCopyText, onRestoreAutoGrade,
  isManualGrade, copied, warnings, onDismissWarnings,
}: ActionButtonsProps) {
  return (
    <div className="mt-8 space-y-4">
      {/* Advertencias */}
      {warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800 mb-1">Revise antes de generar el PDF</p>
              <ul className="space-y-0.5">
                {warnings.map((w, i) => (
                  <li key={i} className="text-xs text-amber-700 flex items-start gap-1.5">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 flex-shrink-0"></span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={onDismissWarnings}
              className="text-amber-400 hover:text-amber-600 transition flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="bg-white rounded-2xl shadow-card border border-graphite-100 px-6 py-5">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Acción principal */}
          <button
            type="button"
            onClick={onDownloadPDF}
            className="inline-flex items-center gap-2 px-6 py-3 bg-academic-600 hover:bg-academic-700 text-white text-sm font-semibold rounded-xl shadow-sm transition focus:outline-none focus:ring-2 focus:ring-academic-400/50 focus:ring-offset-2 active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar PDF
          </button>

          {/* Acciones secundarias */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onCopyText}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-graphite-50 hover:bg-graphite-100 text-graphite-700 text-sm font-medium rounded-xl border border-graphite-200 transition focus:outline-none focus:ring-2 focus:ring-graphite-300/50 focus:ring-offset-1"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-emerald-600">Copiado</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar texto
                </>
              )}
            </button>

            {isManualGrade && (
              <button
                type="button"
                onClick={onRestoreAutoGrade}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-medium rounded-xl border border-amber-200 transition focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:ring-offset-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Restaurar nota automática
              </button>
            )}

            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-graphite-50 hover:bg-red-50 text-graphite-600 hover:text-red-600 text-sm font-medium rounded-xl border border-graphite-200 hover:border-red-200 transition focus:outline-none focus:ring-2 focus:ring-red-300/50 focus:ring-offset-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Limpiar para siguiente estudiante
            </button>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-graphite-400">
          "Limpiar" borra nombre, prueba, puntaje, nota y retroalimentación — conserva escala, fecha y configuración.
        </p>
      </div>
    </div>
  );
}
