import React from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { WeatherScenario } from '../utils/weatherApi';

interface OfflineBannerProps {
  isOffline: boolean;
  scenario: WeatherScenario;
  onResetToReal: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOffline,
  scenario,
  onResetToReal,
}) => {
  const { t } = useTranslation();

  if (!isOffline && scenario === 'real') {
    return null;
  }

  const isScenarioActive = scenario !== 'real';

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-900 px-4 py-2.5 print:hidden">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            {isScenarioActive ? (
              <>
                <strong className="font-bold text-amber-950 uppercase tracking-wide">
                  [{t('scenarioSimulator')}]:
                </strong>{' '}
                {scenario === 'monsoon' && t('scenarioMonsoon')}
                {scenario === 'heatwave' && t('scenarioHeatwave')}
                {scenario === 'high_wind' && t('scenarioHighWind')}
                {scenario === 'ideal' && t('scenarioIdeal')}
              </>
            ) : (
              t('offlineMode')
            )}
          </span>
        </div>
        {isScenarioActive && (
          <button
            onClick={onResetToReal}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('scenarioReal')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
