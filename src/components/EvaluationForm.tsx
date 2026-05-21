import { useId, useState } from 'react';
import type { ScaleConfig } from '../types';
import { getGradeStatus } from '../data/gradeScale';
import { scaleInfoText } from '../utils/gradeCalculator';

interface EvaluationFormProps {
  subject:       string;
  studentName:   string;
  testNumber:    string;
  totalScore:    string;
  scaleConfig:   ScaleConfig;
  finalGrade:    string;
  isManualGrade: boolean;
  date:          string;
  onSubjectChange:      (v: string) => void;
  onStudentNameChange:  (v: string) => void;
  onTestNumberChange:   (v: string) => void;
  onTotalScoreChange:   (v: string) => void;
  onScaleConfigChange:  (c: ScaleConfig) => void;
  onFinalGradeChange:   (v: string) => void;
  onDateChange:         (v: string) => void;
  onRestoreAutoGrade:   () => void;
}

const REQUIREMENT_PRESETS = ['51', '60', '65'] as const;

function InputField({ id, label, children, required }: {
  id: string; label: string; children: React.ReactNode; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-graphite-600 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-burgundy-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function EvaluationForm({
  subject, studentName, testNumber, totalScore, scaleConfig, finalGrade, isManualGrade, date,
  onSubjectChange, onStudentNameChange, onTestNumberChange, onTotalScoreChange,
  onScaleConfigChange, onFinalGradeChange, onDateChange, onRestoreAutoGrade,
}: EvaluationFormProps) {
  const uid         = useId();
  const [showAdv, setShowAdv] = useState(false);

  const gradeStatus = getGradeStatus(finalGrade);
  const maxS        = parseFloat(scaleConfig.maxScore) || 100;
  const scoreNum    = parseFloat(totalScore);
  const scoreInvalid   = totalScore !== '' && isNaN(scoreNum);
  const scoreOutOfRange = totalScore !== '' && !isNaN(scoreNum) && (scoreNum < 0 || scoreNum > maxS);

  // Info mini text
  const reqNum = parseFloat(scaleConfig.requirementPercent);
  const pgNum  = parseFloat(scaleConfig.passingGrade)  || 4.0;
  const infoText = (!isNaN(reqNum) && !isNaN(maxS))
    ? scaleInfoText(reqNum, maxS, pgNum)
    : '';

  // Determine active preset
  const activePreset = REQUIREMENT_PRESETS.includes(scaleConfig.requirementPercent as typeof REQUIREMENT_PRESETS[number])
    ? scaleConfig.requirementPercent
    : null;

  function updateScale(partial: Partial<ScaleConfig>) {
    onScaleConfigChange({ ...scaleConfig, ...partial });
  }

  const inputBase =
    'w-full px-3 py-2.5 text-sm text-graphite-800 bg-white border border-graphite-200 rounded-lg ' +
    'focus:outline-none focus:ring-2 focus:ring-academic-400/40 focus:border-academic-500 transition placeholder-graphite-300';

  const compactInput =
    'w-full px-2.5 py-2 text-sm text-graphite-800 bg-white border border-graphite-200 rounded-lg ' +
    'focus:outline-none focus:ring-2 focus:ring-academic-400/40 focus:border-academic-500 transition';

  return (
    <div className="bg-white rounded-2xl shadow-card border border-graphite-100 p-6 flex flex-col gap-5">

      {/* ── Encabezado ── */}
      <div className="flex items-center gap-2 pb-4 border-b border-graphite-100">
        <div className="w-7 h-7 rounded-lg bg-academic-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-academic-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-graphite-800">Datos de evaluación</h2>
          <p className="text-xs text-graphite-400">Ingrese los datos manualmente</p>
        </div>
      </div>

      {/* ── Asignatura ── */}
      <InputField id={`${uid}-subject`} label="Asignatura" required>
        <input id={`${uid}-subject`} type="text" value={subject}
          onChange={e => onSubjectChange(e.target.value)}
          placeholder="Ej. Filosofía del Derecho, Teoría de la Normatividad…"
          className={inputBase} autoComplete="off" />
      </InputField>

      {/* ── Nombre del estudiante ── */}
      <InputField id={`${uid}-name`} label="Nombre del estudiante" required>
        <input id={`${uid}-name`} type="text" value={studentName}
          onChange={e => onStudentNameChange(e.target.value)}
          placeholder="Ej. Juan Pérez Soto"
          className={inputBase} autoComplete="off" />
      </InputField>

      {/* ── Número de prueba ── */}
      <InputField id={`${uid}-test`} label="Número de prueba">
        <input id={`${uid}-test`} type="text" value={testNumber}
          onChange={e => onTestNumberChange(e.target.value)}
          placeholder="Ej. 1, 2, Solemne 1…"
          className={inputBase} autoComplete="off" />
      </InputField>

      {/* ── Puntaje obtenido ── */}
      <InputField id={`${uid}-score`} label={`Puntaje obtenido (0 – ${maxS})`} required>
        <input
          id={`${uid}-score`}
          type="number"
          min={0}
          max={maxS}
          step={0.5}
          value={totalScore}
          onChange={e => onTotalScoreChange(e.target.value)}
          placeholder="Ej. 74"
          className={`${inputBase} ${
            scoreOutOfRange || scoreInvalid
              ? 'border-burgundy-400 focus:border-burgundy-500 focus:ring-burgundy-300/40 bg-burgundy-50/30'
              : ''
          }`}
        />
        {(scoreOutOfRange || scoreInvalid) && (
          <p className="mt-1 text-xs text-burgundy-600 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" clipRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" />
            </svg>
            {scoreInvalid ? 'Ingrese un número válido.' : `El puntaje debe estar entre 0 y ${maxS}.`}
          </p>
        )}
      </InputField>

      {/* ══ Configuración de escala ══════════════════════════════════════════ */}
      <div className="rounded-xl border border-graphite-150 bg-graphite-50/40 p-4 flex flex-col gap-4">
        <p className="text-xs font-semibold text-graphite-600 uppercase tracking-wide">
          Configuración de escala
        </p>

        {/* Puntaje máximo + Exigencia en fila */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${uid}-maxscore`}
              className="block text-[11px] font-semibold text-graphite-500 uppercase tracking-wide mb-1">
              Puntaje máximo
            </label>
            <input
              id={`${uid}-maxscore`}
              type="number" min={1} step={1}
              value={scaleConfig.maxScore}
              onChange={e => updateScale({ maxScore: e.target.value })}
              placeholder="100"
              className={compactInput}
            />
          </div>
          <div>
            <label htmlFor={`${uid}-req`}
              className="block text-[11px] font-semibold text-graphite-500 uppercase tracking-wide mb-1">
              Exigencia (%)
            </label>
            <input
              id={`${uid}-req`}
              type="number" min={1} max={100} step={1}
              value={scaleConfig.requirementPercent}
              onChange={e => updateScale({ requirementPercent: e.target.value })}
              placeholder="51"
              className={compactInput}
            />
          </div>
        </div>

        {/* Presets de exigencia */}
        <div className="flex gap-2">
          {REQUIREMENT_PRESETS.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => updateScale({ requirementPercent: p })}
              className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition ${
                activePreset === p
                  ? 'bg-academic-600 border-academic-600 text-white shadow-sm'
                  : 'bg-white border-graphite-200 text-graphite-600 hover:border-academic-300 hover:bg-academic-50'
              }`}
            >
              {p}%
            </button>
          ))}
          <button
            type="button"
            onClick={() => updateScale({ requirementPercent: '' })}
            className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition ${
              !activePreset
                ? 'bg-graphite-700 border-graphite-700 text-white shadow-sm'
                : 'bg-white border-graphite-200 text-graphite-500 hover:border-graphite-400 hover:bg-graphite-50'
            }`}
          >
            Libre
          </button>
        </div>

        {/* Mini info */}
        {infoText && (
          <p className="text-[11px] text-academic-700 bg-academic-50 border border-academic-100 rounded-lg px-3 py-2 leading-relaxed">
            ℹ️ {infoText}
          </p>
        )}

        {/* ── Configuración avanzada (colapsable) ── */}
        <button
          type="button"
          onClick={() => setShowAdv(v => !v)}
          className="flex items-center gap-1.5 text-[11px] font-medium text-graphite-500 hover:text-graphite-700 transition self-start"
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform ${showAdv ? 'rotate-90' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Configuración avanzada
        </button>

        {showAdv && (
          <div className="flex flex-col gap-3 pt-1 border-t border-graphite-150">
            {/* Notas mín / aprob / máx */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'mingr',  label: 'Nota mín.',  key: 'minGrade'     as const },
                { id: 'aprgr',  label: 'Aprobación', key: 'passingGrade' as const },
                { id: 'maxgr',  label: 'Nota máx.',  key: 'maxGrade'     as const },
              ].map(({ id, label, key }) => (
                <div key={key}>
                  <label htmlFor={`${uid}-${id}`}
                    className="block text-[11px] font-semibold text-graphite-500 uppercase tracking-wide mb-1">
                    {label}
                  </label>
                  <input
                    id={`${uid}-${id}`}
                    type="number" min={1} max={10} step={0.1}
                    value={scaleConfig[key]}
                    onChange={e => updateScale({ [key]: e.target.value })}
                    className={compactInput}
                  />
                </div>
              ))}
            </div>

            {/* Validación de coherencia */}
            {(() => {
              const mn = parseFloat(scaleConfig.minGrade);
              const pa = parseFloat(scaleConfig.passingGrade);
              const mx = parseFloat(scaleConfig.maxGrade);
              if (!isNaN(mn) && !isNaN(pa) && !isNaN(mx) && !(mn < pa && pa < mx)) {
                return (
                  <p className="text-[11px] text-amber-700 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Las notas deben cumplir: mín &lt; aprobación &lt; máx.
                  </p>
                );
              }
              return null;
            })()}

            {/* Modo de redondeo */}
            <div>
              <p className="text-[11px] font-semibold text-graphite-500 uppercase tracking-wide mb-1.5">
                Redondeo
              </p>
              <div className="flex gap-2">
                {([
                  { v: 'escalaNotas' as const, label: 'escaladenotas.cl' },
                  { v: 'standard'   as const, label: 'Estándar' },
                ] as const).map(({ v, label }) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => updateScale({ roundingMode: v })}
                    className={`flex-1 py-1.5 rounded-lg border text-[11px] font-medium transition ${
                      scaleConfig.roundingMode === v
                        ? 'bg-academic-600 border-academic-600 text-white'
                        : 'bg-white border-graphite-200 text-graphite-600 hover:border-academic-300 hover:bg-academic-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-[10px] text-graphite-400">
                "escaladenotas.cl": trunca a 2 decimales, luego redondea al décimo.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Nota final ── */}
      <InputField id={`${uid}-grade`} label="Nota final">
        <div className="flex gap-2 items-start">
          <div className="relative flex-1">
            <input
              id={`${uid}-grade`}
              type="text"
              value={finalGrade ? finalGrade.replace('.', ',') : ''}
              onChange={e => onFinalGradeChange(e.target.value.replace(',', '.'))}
              placeholder="—"
              className={`${inputBase} font-semibold text-base pr-20 ${
                gradeStatus === 'approved'
                  ? 'text-emerald-700 border-emerald-300 focus:border-emerald-400 focus:ring-emerald-300/40 bg-emerald-50/40'
                  : gradeStatus === 'failed'
                  ? 'text-red-700 border-red-300 focus:border-red-400 focus:ring-red-300/40 bg-red-50/40'
                  : ''
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {isManualGrade ? (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700 border border-amber-200">
                  manual
                </span>
              ) : finalGrade ? (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-academic-50 text-academic-600 border border-academic-200">
                  auto
                </span>
              ) : null}
            </div>
          </div>
          {isManualGrade && (
            <button type="button" onClick={onRestoreAutoGrade}
              title="Restaurar nota automática"
              className="flex-shrink-0 mt-0.5 px-3 py-2.5 text-xs font-medium text-academic-600 bg-academic-50 border border-academic-200 rounded-lg hover:bg-academic-100 transition">
              ↺ Auto
            </button>
          )}
        </div>
        <p className="mt-1 text-[11px] text-graphite-400">
          {isManualGrade
            ? 'Nota editada manualmente. Puede restaurar el valor calculado.'
            : finalGrade
            ? `Calculada automáticamente (exigencia ${scaleConfig.requirementPercent}%, máx. ${scaleConfig.maxScore} pts.).`
            : 'Se calculará al ingresar el puntaje.'}
        </p>
      </InputField>

      {/* ── Fecha ── */}
      <InputField id={`${uid}-date`} label="Fecha del documento">
        <input id={`${uid}-date`} type="date" value={date}
          onChange={e => onDateChange(e.target.value)}
          className={`${inputBase} cursor-pointer`} />
      </InputField>
    </div>
  );
}
