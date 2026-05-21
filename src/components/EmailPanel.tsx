import { useState, useEffect, useId } from 'react';

interface EmailPanelProps {
  studentName: string;
  subject: string;
  professor: string;
}

function buildSubject(subject: string): string {
  return `Retroalimentación de evaluación${subject ? ` — ${subject}` : ''}`;
}

function buildBody(studentName: string, subject: string, professor: string): string {
  const name = studentName.trim() || '[nombre del estudiante]';
  const asig = subject.trim()    || '[asignatura]';
  const prof = professor.trim()  || '[profesor]';
  return (
    `Estimado/a ${name}:\n\n` +
    `Junto con saludar, envío la retroalimentación correspondiente a su evaluación de ${asig}.\n\n` +
    `En el documento PDF adjunto encontrará el detalle de la revisión, el puntaje obtenido y la nota correspondiente según la escala aplicada.\n\n` +
    `Saludos cordiales,\n\n${prof}`
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function EmailPanel({ studentName, subject, professor }: EmailPanelProps) {
  const uid = useId();

  const [isOpen,        setIsOpen]        = useState(false);
  const [studentEmail,  setStudentEmail]  = useState('');
  const [emailSubject,  setEmailSubject]  = useState(() => buildSubject(subject));
  const [emailBody,     setEmailBody]     = useState(() => buildBody(studentName, subject, professor));
  const [isManualSubj,  setIsManualSubj]  = useState(false);
  const [isManualBody,  setIsManualBody]  = useState(false);
  const [emailWarning,  setEmailWarning]  = useState('');
  const [messageCopied, setMessageCopied] = useState(false);

  // Auto-actualiza asunto si no fue editado manualmente
  useEffect(() => {
    if (!isManualSubj) setEmailSubject(buildSubject(subject));
  }, [subject, isManualSubj]);

  // Auto-actualiza cuerpo si no fue editado manualmente
  useEffect(() => {
    if (!isManualBody) setEmailBody(buildBody(studentName, subject, professor));
  }, [studentName, subject, professor, isManualBody]);

  function handleOpenMail() {
    if (!studentEmail.trim()) {
      setEmailWarning('Ingrese el correo del estudiante antes de continuar.');
      return;
    }
    if (!isValidEmail(studentEmail)) {
      setEmailWarning('El formato del correo no es válido. Revíselo e intente nuevamente.');
      return;
    }
    setEmailWarning('');
    const mailto =
      `mailto:${encodeURIComponent(studentEmail.trim())}` +
      `?subject=${encodeURIComponent(emailSubject)}` +
      `&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailto;
  }

  async function handleCopyMessage() {
    const full = `Para: ${studentEmail || '[correo del estudiante]'}\nAsunto: ${emailSubject}\n\n${emailBody}`;
    try {
      await navigator.clipboard.writeText(full);
      setMessageCopied(true);
      setTimeout(() => setMessageCopied(false), 2200);
    } catch { /* sin API */ }
  }

  function handleRestoreBody() {
    setIsManualBody(false);
    setEmailBody(buildBody(studentName, subject, professor));
  }

  function handleRestoreSubject() {
    setIsManualSubj(false);
    setEmailSubject(buildSubject(subject));
  }

  const inputBase =
    'w-full px-3 py-2.5 text-sm text-graphite-800 bg-white border border-graphite-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-400/40 focus:border-academic-500 transition placeholder-graphite-300';

  return (
    <div className="mt-4 bg-white rounded-2xl shadow-card border border-graphite-100 overflow-hidden">
      {/* Cabecera colapsable */}
      <button
        type="button"
        onClick={() => setIsOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-graphite-50/60 transition text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-academic-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-academic-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-graphite-800">Envío por correo</span>
            <span className="ml-2 text-xs text-graphite-400">Opcional</span>
            {!isOpen && (
              <p className="text-xs text-graphite-400 mt-0.5">
                Prepare el correo con la retroalimentación para el estudiante
              </p>
            )}
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-graphite-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Contenido del panel */}
      {isOpen && (
        <div className="px-6 pb-6 border-t border-graphite-100">

          {/* Aviso adjuntar PDF */}
          <div className="mt-5 flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <p className="text-xs text-amber-800 leading-relaxed">
              <span className="font-semibold">Recuerde adjuntar manualmente el PDF descargado</span> antes de enviar el correo desde su cliente de correo.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Columna izquierda */}
            <div className="flex flex-col gap-4">
              {/* Correo del estudiante */}
              <div>
                <label htmlFor={`${uid}-email`} className="block text-xs font-semibold text-graphite-600 uppercase tracking-wide mb-1.5">
                  Correo del estudiante<span className="text-burgundy-500 ml-0.5">*</span>
                </label>
                <input
                  id={`${uid}-email`}
                  type="email"
                  value={studentEmail}
                  onChange={e => { setStudentEmail(e.target.value); setEmailWarning(''); }}
                  placeholder="estudiante@pucv.cl"
                  className={`${inputBase} ${
                    emailWarning
                      ? 'border-burgundy-400 focus:border-burgundy-500 focus:ring-burgundy-300/40 bg-burgundy-50/20'
                      : studentEmail && !isValidEmail(studentEmail)
                      ? 'border-amber-300 focus:border-amber-400 focus:ring-amber-200/40'
                      : ''
                  }`}
                  autoComplete="off"
                  spellCheck={false}
                />
                {emailWarning && (
                  <p className="mt-1 text-xs text-burgundy-600 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {emailWarning}
                  </p>
                )}
              </div>

              {/* Asunto */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor={`${uid}-subject`} className="block text-xs font-semibold text-graphite-600 uppercase tracking-wide">
                    Asunto
                  </label>
                  {isManualSubj && (
                    <button type="button" onClick={handleRestoreSubject}
                      className="text-[11px] text-academic-500 hover:text-academic-700 transition">
                      ↺ Restaurar
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id={`${uid}-subject`}
                    type="text"
                    value={emailSubject}
                    onChange={e => { setEmailSubject(e.target.value); setIsManualSubj(true); }}
                    className={`${inputBase} pr-16`}
                    autoComplete="off"
                  />
                  {isManualSubj && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-200">
                        manual
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha: cuerpo del correo */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor={`${uid}-body`} className="block text-xs font-semibold text-graphite-600 uppercase tracking-wide">
                  Mensaje
                </label>
                {isManualBody && (
                  <button type="button" onClick={handleRestoreBody}
                    className="text-[11px] text-academic-500 hover:text-academic-700 transition">
                    ↺ Restaurar plantilla
                  </button>
                )}
              </div>
              <div className="relative">
                <textarea
                  id={`${uid}-body`}
                  value={emailBody}
                  onChange={e => { setEmailBody(e.target.value); setIsManualBody(true); }}
                  rows={9}
                  className="w-full px-3.5 py-3 text-sm text-graphite-800 bg-graphite-50/40 border border-graphite-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-400/40 focus:border-academic-500 transition resize-none leading-relaxed font-[inherit]"
                  spellCheck={false}
                />
                {isManualBody && (
                  <span className="absolute top-2.5 right-3 pointer-events-none">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-200">
                      editado
                    </span>
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-graphite-400">
                El mensaje se actualiza automáticamente al cambiar nombre, asignatura o profesor.
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleOpenMail}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-academic-600 hover:bg-academic-700 text-white text-sm font-semibold rounded-xl shadow-sm transition focus:outline-none focus:ring-2 focus:ring-academic-400/50 focus:ring-offset-2 active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Abrir correo
            </button>

            <button
              type="button"
              onClick={handleCopyMessage}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-graphite-50 hover:bg-graphite-100 text-graphite-700 text-sm font-medium rounded-xl border border-graphite-200 transition focus:outline-none focus:ring-2 focus:ring-graphite-300/50 focus:ring-offset-1"
            >
              {messageCopied ? (
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
                  Copiar mensaje
                </>
              )}
            </button>

            <p className="text-[11px] text-graphite-400 ml-1">
              Se abrirá su cliente de correo con el mensaje ya redactado.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
