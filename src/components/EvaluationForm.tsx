import { useId } from 'react';
import type { Scale } from '../types';
import { getGradeStatus } from '../data/gradeScale';

interface EvaluationFormProps {
  studentName: string;
  testNumber: string;
  totalScore: string;
  scale: Scale;
  finalGrade: string;
  isManualGrade: boolean;
  date: string;
  onStudentNameChange: (v: string) => void;
  onTestNumberChange: (v: string) => void;
  onTotalScoreChange: (v: string) => void;
  onScaleChange: (v: Scale) => void;
  onFinalGradeChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onRestoreAutoGrade: () => void;
}

const SCALE_OPTIONS: { value: Scale; label: string; desc: string }[] = [
  { value: '51', label: 'Escala 51%', desc: 'Nota 4,0 desde 51 pts.' },
  { value: '60', label: 'Escala 60%', desc: 'Nota 4,0 desde 60 pts.' },
  { value: '65', label: 'Escala 65%', desc: 'Nota 4,0 desde 65 pts.' },
];

function InputField({
  id, label, children, required
}: {
  id: string; label: string; children: React.ReactNode; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-graphite-600 uppercase tracking-wide mb-1.5">
        {label}
        {required && <span className="text-burgundy-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function EvaluationForm({
  studentName, testNumber, totalScore, scale, finalGrade, isManualGrade, date,
  onStudentNameChange, onTestNumberChange, onTotalScoreChange, onScaleChange,
  onFinalGradeChange, onDateChange, onRestoreAutoGrade,
}: EvaluationFormProps) {
  const uid = useId();
  const gradeStatus = getGradeStatus(finalGrade);

  const scoreNum = parseFloat(totalScore);
  const scoreOutOfRange = totalScore !== '' && (!isNaN(scoreNum)) && (scoreNum < 0 || scoreNum > 100);
  const scoreInvalid   = totalScore !== '' && isNaN(scoreNum);

  const inputBase =
    'w-full px-3 py-2.5 text-sm text-graphite-800 bg-white border border-graphite-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-400/40 focus:border-academic-500 transition placeholder-graphite-300';

  return (
    <div className="bg-white rounded-2xl shadow-card border border-graphite-100 p-6 flex flex-col gap-5">
      {/* Encabezado de tarjeta */}
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

      {/* Nombre del estudiante */}
      <InputField id={`${uid}-name`} label="Nombre del estudiante" required>
        <input
          id={`${uid}-name`}
          type="text"
          value={studentName}
          onChange={e => onStudentNameChange(e.target.value)}
          placeholder="Ej. Juan Pérez Soto"
          className={inputBase}
          autoComplete="off"
        />
      </InputField>

      {/* Número de prueba */}
      <InputField id={`${uid}-test`} label="Número de prueba">
        <input
          id={`${uid}-test`}
          type="text"
          value={testNumber}
          onChange={e => onTestNumberChange(e.target.value)}
          placeholder="Ej. 1, 2, Solemne 1…"
          className={inputBase}
          autoComplete="off"
        />
      </InputField>

      {/* Puntaje total */}
      <InputField id={`${uid}-score`} label="Puntaje total (0 – 100)" required>
        <input
          id={`${uid}-score`}
          type="number"
          min={0}
          max={100}
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
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {scoreInvalid ? 'Ingrese un número válido.' : 'El puntaje debe estar entre 0 y 100.'}
          </p>
        )}
      </InputField>

      {/* Escala de conversión */}
      <InputField id={`${uid}-scale`} label="Escala de conversión">
        <div className="grid grid-cols-3 gap-2">
          {SCALE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onScaleChange(opt.value)}
              className={`flex flex-col items-center px-2 py-2.5 rounded-lg border text-xs font-medium transition cursor-pointer select-none ${
                scale === opt.value
                  ? 'bg-academic-600 border-academic-600 text-white shadow-sm'
                  : 'bg-white border-graphite-200 text-graphite-600 hover:border-academic-300 hover:bg-academic-50'
              }`}
            >
              <span className={`font-bold text-sm ${scale === opt.value ? 'text-white' : 'text-graphite-800'}`}>
                {opt.value}%
              </span>
              <span className={`text-[10px] mt-0.5 ${scale === opt.value ? 'text-academic-100' : 'text-graphite-400'}`}>
                {opt.desc}
              </span>
            </button>
          ))}
        </div>
      </InputField>

      {/* Nota final calculada / editable */}
      <InputField id={`${uid}-grade`} label="Nota final">
        <div className="flex gap-2 items-start">
          <div className="relative flex-1">
            <input
              id={`${uid}-grade`}
              type="text"
              value={finalGrade ? finalGrade.replace('.', ',') : ''}
              onChange={e => {
                const raw = e.target.value.replace(',', '.');
                onFinalGradeChange(raw);
              }}
              placeholder="—"
              className={`${inputBase} font-semibold text-base pr-24 ${
                gradeStatus === 'approved'
                  ? 'text-emerald-700 border-emerald-300 focus:border-emerald-400 focus:ring-emerald-300/40 bg-emerald-50/40'
                  : gradeStatus === 'failed'
                  ? 'text-red-700 border-red-300 focus:border-red-400 focus:ring-red-300/40 bg-red-50/40'
                  : ''
              }`}
            />
            {/* Badge de estado */}
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

          {/* Botón restaurar */}
          {isManualGrade && (
            <button
              type="button"
              onClick={onRestoreAutoGrade}
              title="Restaurar nota automática"
              className="flex-shrink-0 mt-0.5 px-3 py-2.5 text-xs font-medium text-academic-600 bg-academic-50 border border-academic-200 rounded-lg hover:bg-academic-100 transition"
            >
              ↺ Auto
            </button>
          )}
        </div>
        <p className="mt-1 text-[11px] text-graphite-400">
          {isManualGrade
            ? 'Nota editada manualmente. Puede restaurar el valor calculado.'
            : finalGrade
            ? `Calculada automáticamente desde la matriz (escala ${scale}%).`
            : 'Se calculará al ingresar el puntaje.'}
        </p>
      </InputField>

      {/* Fecha */}
      <InputField id={`${uid}-date`} label="Fecha del documento">
        <input
          id={`${uid}-date`}
          type="date"
          value={date}
          onChange={e => onDateChange(e.target.value)}
          className={`${inputBase} cursor-pointer`}
        />
      </InputField>
    </div>
  );
}
