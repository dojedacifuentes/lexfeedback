import type { AppConfig } from '../types';

interface FooterProps {
  config: AppConfig;
}

export default function Footer({ config }: FooterProps) {
  return (
    <footer className="bg-graphite-900 border-t border-graphite-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-serif font-bold text-sm">Lx</span>
              <span className="text-graphite-300 text-sm font-medium">LexFeedback</span>
            </div>
            <p className="text-graphite-400 text-xs leading-relaxed max-w-lg">
              Demo académica desarrollada por{' '}
              <span className="text-graphite-200">{config.createdBy}</span> para apoyar
              procesos de retroalimentación docente en {config.subject}, PUCV.
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-graphite-400 text-xs">
                Procesamiento 100% local
              </span>
            </div>
            <span className="text-graphite-500 text-xs">
              Sin backend · Sin login · Sin envío de datos
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
