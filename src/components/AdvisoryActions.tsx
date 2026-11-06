import React, { useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { ActionPlanResult, ActionItem } from '../types';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  SprayCan, 
  Droplets, 
  Bug, 
  Sun, 
  Hammer, 
  CheckCircle2,
  ShieldAlert,
  Wind
} from 'lucide-react';

interface AdvisoryActionsProps {
  actionPlan: ActionPlanResult;
}

export const AdvisoryActions: React.FC<AdvisoryActionsProps> = ({ actionPlan }) => {
  const { t, language } = useTranslation();
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const sprayStatus = actionPlan.spraySafetyStatus;

  // Helper for dynamic Lucide icons
  const renderActionIcon = (iconName: string) => {
    switch (iconName) {
      case 'SprayCan':
        return <SprayCan className="w-5 h-5 text-emerald-600" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'Bug':
        return <Bug className="w-5 h-5 text-amber-600" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'Hammer':
        return <Hammer className="w-5 h-5 text-purple-600" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-teal-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }
  };

  const renderActionCard = (action: ActionItem) => {
    const isDone = !!completedTasks[action.id];

    return (
      <div
        key={action.id}
        onClick={() => toggleTask(action.id)}
        className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3.5 group ${
          isDone
            ? 'bg-slate-50 border-slate-200 opacity-60'
            : action.highlight
            ? 'bg-rose-50/50 border-rose-300 shadow-sm hover:border-rose-400'
            : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
        }`}
      >
        <button
          type="button"
          aria-label={isDone ? t('taskDone') : t('markDone')}
          className="mt-0.5 text-slate-400 group-hover:text-emerald-600 transition-colors flex-shrink-0"
        >
          {isDone ? (
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              action.highlight
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : 'bg-slate-100 text-slate-700'
            }`}>
              {language === 'ta' ? action.badgeTa : action.badgeEn}
            </span>

            {isDone && (
              <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t('taskDone')}
              </span>
            )}
          </div>

          <h4 className={`text-sm font-bold text-slate-900 leading-snug ${isDone ? 'line-through text-slate-500' : ''}`}>
            {language === 'ta' ? action.titleTa : action.titleEn}
          </h4>

          <p className={`text-xs text-slate-600 mt-1 leading-relaxed ${isDone ? 'line-through text-slate-400' : ''}`}>
            {language === 'ta' ? action.descriptionTa : action.descriptionEn}
          </p>
        </div>

        <div className="hidden sm:block flex-shrink-0 p-2 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-white transition-colors">
          {renderActionIcon(action.iconName)}
        </div>
      </div>
    );
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-6 space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {t('actionPlannerTitle')}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('actionPlannerSubtitle')}
          </p>
        </div>
      </div>

      {/* 1. Foliar Spraying Safety Window Banner (High Priority Feature) */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        sprayStatus.isSafe
          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
          : 'bg-rose-50 border-rose-300 text-rose-950'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl flex-shrink-0 ${
              sprayStatus.isSafe ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}>
              <SprayCan className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  sprayStatus.isSafe ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                }`}>
                  {sprayStatus.isSafe ? t('spraySafeBadge') : t('sprayUnsafeBadge')}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {t('spraySafetyTitle')}
                </span>
              </div>
              
              <div className="text-base sm:text-lg font-extrabold mt-1">
                {language === 'ta' ? sprayStatus.windowTa : sprayStatus.windowEn}
              </div>

              <p className="text-xs mt-1 max-w-2xl text-slate-700">
                <strong className="font-semibold text-slate-900">{t('sprayWarningReason')}:</strong>{' '}
                {language === 'ta' ? sprayStatus.reasonTa : sprayStatus.reasonEn}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Immediate (Next 24 Hours) Actions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-rose-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            {t('immediateActionsTitle')}
          </h3>
          <span className="text-xs text-slate-500 font-normal hidden sm:inline">
            — {t('immediateSubtitle')}
          </span>
        </div>
        <div className="space-y-2.5">
          {actionPlan.immediateActions.map(renderActionCard)}
        </div>
      </div>

      {/* 3. Short-Term (Next 2–4 Days) Actions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            {t('shortTermActionsTitle')}
          </h3>
          <span className="text-xs text-slate-500 font-normal hidden sm:inline">
            — {t('shortTermSubtitle')}
          </span>
        </div>
        <div className="space-y-2.5">
          {actionPlan.shortTermActions.map(renderActionCard)}
        </div>
      </div>

      {/* 4. Preventative Measures */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            {t('preventativeActionsTitle')}
          </h3>
          <span className="text-xs text-slate-500 font-normal hidden sm:inline">
            — {t('preventativeSubtitle')}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {actionPlan.preventativeActions.map((action) => (
            <div
              key={action.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-300 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {language === 'ta' ? action.badgeTa : action.badgeEn}
                </span>
                {renderActionIcon(action.iconName)}
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                {language === 'ta' ? action.titleTa : action.titleEn}
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                {language === 'ta' ? action.descriptionTa : action.descriptionEn}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
