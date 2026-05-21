interface FeedbackPanelProps {
  feedback: string;
  onFeedbackChange: (v: string) => void;
}

export default function FeedbackPanel({ feedback, onFeedbackChange }: FeedbackPanelProps) {
  const wordCount = feedback.trim() === '' ? 0 : feedback.trim().split(/\s+/).length;
  const charCount = feedback.length;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-graphite-100 p-6 flex flex-col gap-5">
      {/* Encabezado de tarjeta */}
      <div className="flex items-center gap-2 pb-4 border-b border-graphite-100">
        <div className="w-7 h-7 rounded-lg bg-academic-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-academic-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-graphite-800">Retroalimentación</h2>
          <p className="text-xs text-graphite-400">Pegue el texto completo ya corregido</p>
        </div>
      </div>

      {/* Aviso */}
      <div className="flex items-start gap-2 px-3 py-2.5 bg-academic-50 border border-academic-100 rounded-lg">
        <svg className="w-4 h-4 text-academic-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-academic-700 leading-relaxed">
          El texto será incorporado íntegramente al PDF, <strong>sin modificaciones, correcciones ni interpretaciones</strong>.
          La app no analiza ni procesa el contenido.
        </p>
      </div>

      {/* Textarea */}
      <div className="flex flex-col flex-1">
        <textarea
          value={feedback}
          onChange={e => onFeedbackChange(e.target.value)}
          placeholder="Pegue aquí la retroalimentación completa del estudiante tal como aparece en su documento corregido...

Puede incluir saltos de línea, párrafos y puntuación. El PDF respetará el formato del texto."
          rows={18}
          className="w-full px-3.5 py-3 text-sm text-graphite-800 bg-graphite-50/40 border border-graphite-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-400/40 focus:border-academic-500 transition placeholder-graphite-300 resize-none leading-relaxed font-[inherit]"
          spellCheck={false}
        />
      </div>

      {/* Contador */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-graphite-400">
          {feedback.trim() === '' ? (
            'Sin contenido'
          ) : (
            <>
              <span className="font-medium text-graphite-600">{wordCount}</span>
              {' '}palabras · <span className="font-medium text-graphite-600">{charCount}</span>
              {' '}caracteres
            </>
          )}
        </p>
        {feedback.trim() !== '' && (
          <button
            type="button"
            onClick={() => onFeedbackChange('')}
            className="text-xs text-graphite-400 hover:text-burgundy-500 transition"
          >
            Limpiar texto
          </button>
        )}
      </div>

      {/* Nota de privacidad */}
      <div className="flex items-start gap-1.5 pt-1 border-t border-graphite-100">
        <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-[11px] text-graphite-400 leading-relaxed">
          Los datos no se envían a servidores externos. La generación del documento ocurre localmente en el navegador.
        </p>
      </div>
    </div>
  );
}
