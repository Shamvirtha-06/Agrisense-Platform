import React from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { WeatherScenario } from '../utils/weatherApi';
import { Sliders, CloudLightning, Flame, Wind, Sun, Radio } from 'lucide-react';

interface ScenarioSimulatorProps {
  currentScenario: WeatherScenario;
  onSelectScenario: (scenario: WeatherScenario) => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  currentScenario,
  onSelectScenario,
}) => {
  const { t } = useTranslation();

  const scenarios: { id: WeatherScenario; labelKey: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'real',
      labelKey: 'scenarioReal',
      icon: <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />,
      color: 'hover:border-emerald-400',
    },
    {
      id: 'monsoon',
      labelKey: 'scenarioMonsoon',
      icon: <CloudLightning className="w-4 h-4 text-blue-600" />,
      color: 'hover:border-blue-400',
    },
    {
      id: 'heatwave',
      labelKey: 'scenarioHeatwave',
      icon: <Flame className="w-4 h-4 text-rose-600" />,
      color: 'hover:border-rose-400',
    },
    {
      id: 'high_wind',
      labelKey: 'scenarioHighWind',
      icon: <Wind className="w-4 h-4 text-purple-600" />,
      color: 'hover:border-purple-400',
    },
    {
      id: 'ideal',
      labelKey: 'scenarioIdeal',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      color: 'hover:border-amber-400',
    },
  ];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-800 print:hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-slate-200">
            {t('scenarioTitle')}
          </h3>
        </div>
        <p className="text-[11px] text-slate-400">
          {t('scenarioSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {scenarios.map((sc) => {
          const isSelected = currentScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-left ${
                isSelected
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                  : `bg-slate-800/80 border-slate-700/80 text-slate-300 ${sc.color} hover:bg-slate-800`
              }`}
            >
              <div className="flex-shrink-0">{sc.icon}</div>
              <span className="truncate">
                {t(sc.labelKey as any)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
