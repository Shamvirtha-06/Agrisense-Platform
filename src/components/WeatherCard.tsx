import React from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { WeatherData, WeatherAnalysisResult, WeatherThreatLevel } from '../types';
import { 
  CloudSun, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  CloudRain, 
  Calendar,
  Waves
} from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherData;
  analysis: WeatherAnalysisResult;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, analysis }) => {
  const { t, language } = useTranslation();
  const current = weather.current;
  const indicators = analysis.indicators;

  // Map Threat Level to badge styling
  const getThreatBadge = (level: WeatherThreatLevel) => {
    switch (level) {
      case 'severe':
        return {
          bg: 'bg-rose-600 text-white border-rose-700',
          label: t('threat_severe'),
          icon: <ShieldAlert className="w-4 h-4 text-white" />,
        };
      case 'high':
        return {
          bg: 'bg-amber-600 text-white border-amber-700',
          label: t('threat_high'),
          icon: <AlertTriangle className="w-4 h-4 text-white" />,
        };
      case 'moderate':
        return {
          bg: 'bg-amber-400 text-slate-950 border-amber-500',
          label: t('threat_moderate'),
          icon: <AlertTriangle className="w-4 h-4 text-slate-900" />,
        };
      case 'low':
      default:
        return {
          bg: 'bg-emerald-600 text-white border-emerald-700',
          label: t('threat_low'),
          icon: <CheckCircle2 className="w-4 h-4 text-white" />,
        };
    }
  };

  const threatBadge = getThreatBadge(analysis.threatLevel);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-6 space-y-6">
      
      {/* Header & Threat Diagnostic Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {t('weatherTitle')}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('weatherSubtitle')} • {t('lastSync')}: <span className="font-semibold text-slate-700">{weather.lastUpdated}</span>
          </p>
        </div>

        {/* Threat Level Badge */}
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm border shadow-sm ${threatBadge.bg}`}>
          {threatBadge.icon}
          <span>{threatBadge.label}</span>
          <span className="opacity-90 font-mono text-xs">({analysis.threatScore}/100)</span>
        </div>
      </div>

      {/* Primary Weather Metric Snapshot Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        
        {/* 1. Temperature */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t('temperature')}</span>
            <Thermometer className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {current.temperature}°C
            </span>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {t('feelsLike')}: <strong className="text-slate-700 font-semibold">{current.apparentTemperature}°C</strong>
            </div>
          </div>
        </div>

        {/* 2. Humidity */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${
          current.humidity > 80 ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t('humidity')}</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {current.humidity}%
            </span>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {current.humidity > 80 ? (
                <span className="text-amber-700 font-semibold">High spore moisture</span>
              ) : (
                'Normal RH'
              )}
            </div>
          </div>
        </div>

        {/* 3. Rain Probability */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${
          current.precipitationProbability >= 45 ? 'bg-blue-50/80 border-blue-300' : 'bg-slate-50 border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t('precipProb')}</span>
            <CloudRain className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {current.precipitationProbability}%
            </span>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {current.precipitationProbability >= 45 ? (
                <span className="text-blue-700 font-semibold">Rain likely</span>
              ) : (
                'Dry canopy'
              )}
            </div>
          </div>
        </div>

        {/* 4. Wind Speed */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${
          current.windSpeed >= 28 ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t('windSpeed')}</span>
            <Wind className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {current.windSpeed}
            </span>
            <span className="text-xs font-bold text-slate-500 ml-1">km/h</span>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {current.windSpeed >= 28 ? (
                <span className="text-rose-700 font-semibold">Gale Alert</span>
              ) : (
                'Gentle breeze'
              )}
            </div>
          </div>
        </div>

        {/* 5. UV Index */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t('uvIndex')}</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {current.uvIndex}
            </span>
            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
              {current.uvIndex >= 8 ? 'Very High UV' : 'Moderate UV'}
            </div>
          </div>
        </div>

        {/* 6. Soil Moisture Index */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${
          current.soilMoisture < 30 ? 'bg-amber-50 border-amber-300' : current.soilMoisture > 80 ? 'bg-blue-50 border-blue-300' : 'bg-slate-50 border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t('soilMoisture')}</span>
            <Waves className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {current.soilMoisture}%
            </span>
            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
              {current.soilMoisture < 30 ? (
                <span className="text-amber-700">Dry soil</span>
              ) : current.soilMoisture > 80 ? (
                <span className="text-blue-700">Saturated</span>
              ) : (
                'Optimal moisture'
              )}
            </div>
          </div>
        </div>

        {/* 7. Summary Risk Diagnostic */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 p-3 bg-slate-900 text-white rounded-xl flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {t('threatLevel')}
          </div>
          <div className="mt-1">
            <span className="text-base font-extrabold uppercase tracking-tight block">
              {analysis.threatLevel}
            </span>
            <p className="text-[10px] text-slate-300 line-clamp-2 mt-0.5">
              {language === 'ta' ? analysis.summaryTa : analysis.summaryEn}
            </p>
          </div>
        </div>

      </div>

      {/* Extreme Meteorological Indicators Strip */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-600" />
          {t('extremeIndicatorsTitle')}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {indicators.heatStress && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              {t('heatStressTrigger')}
            </span>
          )}

          {indicators.unseasonalRain && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
              <CloudRain className="w-3.5 h-3.5 text-blue-600" />
              {t('heavyRainTrigger')}
            </span>
          )}

          {indicators.galeWinds && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
              <Wind className="w-3.5 h-3.5 text-purple-600" />
              {t('galeWindTrigger')}
            </span>
          )}

          {indicators.droughtSpell && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              {t('droughtSpellTrigger')}
            </span>
          )}

          {indicators.excessiveHumidity && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300">
              <Droplets className="w-3.5 h-3.5 text-teal-600" />
              {t('highHumidityTrigger')}
            </span>
          )}

          {!indicators.heatStress && !indicators.unseasonalRain && !indicators.galeWinds && !indicators.droughtSpell && !indicators.excessiveHumidity && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {t('noExtremeAlerts')}
            </span>
          )}
        </div>

        {/* Detailed diagnostic notes list */}
        <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5">
          {(language === 'ta' ? analysis.diagnosticNotesTa : analysis.diagnosticNotesEn).map((note, idx) => (
            <p key={idx} className="text-xs text-slate-700 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0"></span>
              <span>{note}</span>
            </p>
          ))}
        </div>
      </div>

      {/* 7-Day Forecast Mini Cards */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-emerald-600" />
          {t('forecast7Day')}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {analysis.forecastThreatDays.map((fDay, idx) => {
            const isToday = idx === 0;
            return (
              <div
                key={fDay.date}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isToday 
                    ? 'bg-emerald-50/60 border-emerald-400 ring-1 ring-emerald-400 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-[11px] font-bold text-slate-800">
                  {isToday ? (language === 'ta' ? 'இன்று' : 'Today') : (language === 'ta' ? fDay.dayNameTa : fDay.dayNameEn)}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {fDay.date.slice(5)}
                </div>

                <div className="my-2 flex items-center justify-center">
                  {fDay.rainSum > 20 ? (
                    <CloudRain className="w-6 h-6 text-blue-500" />
                  ) : fDay.windMax > 30 ? (
                    <Wind className="w-6 h-6 text-purple-500" />
                  ) : fDay.tempMax > 38 ? (
                    <Sun className="w-6 h-6 text-rose-500" />
                  ) : (
                    <CloudSun className="w-6 h-6 text-amber-500" />
                  )}
                </div>

                <div className="text-xs font-bold text-slate-900">
                  {fDay.tempMax}° / <span className="text-slate-500">{weather.daily[idx]?.tempMin || '--'}°</span>
                </div>

                <div className="text-[10px] text-slate-500 mt-1 flex flex-col gap-0.5">
                  <span>{fDay.rainSum} mm</span>
                  <span>{fDay.windMax} km/h</span>
                </div>

                <div className={`mt-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  fDay.level === 'severe'
                    ? 'bg-rose-100 text-rose-800'
                    : fDay.level === 'high'
                    ? 'bg-amber-100 text-amber-800'
                    : fDay.level === 'moderate'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {language === 'ta' ? fDay.reasonTa : fDay.reasonEn}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
