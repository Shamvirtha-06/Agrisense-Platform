import React from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { Sprout, Globe, Printer, Cpu, RefreshCw, Radio } from 'lucide-react';

interface HeaderProps {
  onOpenWorkflow: () => void;
  onRefreshWeather: () => void;
  isRefreshing: boolean;
  isOffline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenWorkflow,
  onRefreshWeather,
  isRefreshing,
  isOffline,
}) => {
  const { t, language, toggleLanguage } = useTranslation();

  const handlePrint = () => {
    window.print();
  };

  const currentDateFormatted = new Date().toLocaleDateString(
    language === 'ta' ? 'ta-IN' : 'en-IN',
    { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
  );

  return (
    <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-40 print:hidden border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-300 flex items-center justify-center shadow-md shadow-emerald-950/40 text-emerald-950 flex-shrink-0">
              <Sprout className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight truncate text-white">
                  {t('appTitle')}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-200 border border-emerald-700">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  {isOffline ? t('offlineMode') : t('liveStatus')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/90 truncate font-medium">
                {t('appSubtitle')}
              </p>
            </div>
          </div>

          {/* Action Controls & Navigation */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            {/* Refresh Weather Button */}
            <button
              onClick={onRefreshWeather}
              disabled={isRefreshing}
              title={t('refreshTelemetry')}
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-emerald-800/70 hover:bg-emerald-700 text-emerald-100 transition-colors text-xs font-medium flex items-center gap-1.5 border border-emerald-700/60"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{isRefreshing ? t('refreshing') : t('refreshTelemetry')}</span>
            </button>

            {/* Agent Reasoning Workflow Button */}
            <button
              onClick={onOpenWorkflow}
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm border border-emerald-500/40 hover:border-emerald-400"
              title={t('viewReasoningWorkflow')}
            >
              <Cpu className="w-4 h-4 text-emerald-200" />
              <span className="hidden lg:inline">{t('viewReasoningWorkflow')}</span>
            </button>

            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 transition-colors text-xs font-medium flex items-center gap-1.5 border border-slate-700 shadow-sm"
              title={t('printReport')}
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span className="hidden md:inline">{t('printReport')}</span>
            </button>

            {/* Bilingual Toggle Button (English <-> Tamil) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              aria-label="Toggle language English or Tamil"
            >
              <Globe className="w-4 h-4" />
              <span>{t('changeLanguage')}</span>
            </button>

          </div>

        </div>
      </div>

      {/* Subheader info bar */}
      <div className="bg-emerald-950/80 px-4 py-1.5 text-xs text-emerald-300 border-t border-emerald-800/40 flex justify-between items-center max-w-7xl mx-auto">
        <span className="truncate flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
          {t('tamilNaduAgriNetwork')}
        </span>
        <span className="text-emerald-300/80 hidden sm:inline">
          {t('currentDate')}: <strong className="text-emerald-100 font-semibold">{currentDateFormatted}</strong>
        </span>
      </div>
    </header>
  );
};
