import type { AppConfig } from '../types';

interface HeaderProps {
  config: AppConfig;
}

export default function Header({ config }: HeaderProps) {
  return (
    <header className="bg-academic-600 border-b border-academic-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Logo + título */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center justify-center w-9 h-9 bg-white/10 rounded-lg border border-white/20">
                <span className="text-white font-serif font-bold text-sm tracking-tight">Lx</span>
              </div>
              <div>
                <h1 className="text-white text-xl font-semibold tracking-tight leading-none">
                  LexFeedback
                </h1>
                <p className="text-academic-200 text-xs mt-0.5">
                  Demo académica · Generación de retroalimentaciones individuales
                </p>
              </div>
            </div>
          </div>

          {/* Badges institucionales */}
          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
                PUCV · {config.subject}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-academic-700/60 text-academic-100 border border-academic-500/30">
                {config.professor}
              </span>
            </div>
            <p className="text-academic-300 text-xs">
              Demo creada por{' '}
              <span className="text-white font-medium">{config.createdBy}</span>,{' '}
              {config.createdByRole}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
