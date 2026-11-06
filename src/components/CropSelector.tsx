import React from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { CropId, GrowthStageId } from '../types';
import { CROPS_DATABASE } from '../utils/cropDatabase';
import { Sprout, Clock, Droplets, AlertTriangle } from 'lucide-react';

interface CropSelectorProps {
  selectedCrop: CropId;
  selectedStage: GrowthStageId;
  onCropChange: (crop: CropId) => void;
  onStageChange: (stage: GrowthStageId) => void;
}

const CROP_KEYS: CropId[] = [
  'paddy',
  'cotton',
  'sugarcane',
  'banana',
  'groundnut',
  'tomato',
  'maize',
  'finger_millet',
];

const STAGE_KEYS: GrowthStageId[] = [
  'sowing',
  'vegetative',
  'flowering',
  'harvest',
];

export const CropSelector: React.FC<CropSelectorProps> = ({
  selectedCrop,
  selectedStage,
  onCropChange,
  onStageChange,
}) => {
  const { t, language } = useTranslation();
  const currentCropData = CROPS_DATABASE[selectedCrop];
  const currentStageData = currentCropData.stages[selectedStage];

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            {t('cropSectionTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('cropSectionSubtitle')}
          </p>
        </div>
      </div>

      {/* 1. Crop Grid Selector (8 Regional Crops) */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          {t('selectedCrop')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {CROP_KEYS.map((cropId) => {
            const crop = CROPS_DATABASE[cropId];
            const isSelected = selectedCrop === cropId;
            return (
              <button
                key={cropId}
                onClick={() => onCropChange(cropId)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all group ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span className="text-2xl mb-1.5 transition-transform group-hover:scale-110">
                  {crop.icon}
                </span>
                <span className="text-xs font-bold block text-slate-900 leading-tight">
                  {language === 'ta' ? crop.nameTa : crop.nameEn}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5 leading-tight">
                  {language === 'ta' ? crop.nameEn : crop.nameTa}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Phenological Growth Stage Selector (4 Distinct Stages) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          {t('growthStage')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {STAGE_KEYS.map((stageId) => {
            const stage = currentCropData.stages[stageId];
            const isSelected = selectedStage === stageId;
            return (
              <button
                key={stageId}
                onClick={() => onStageChange(stageId)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded ${
                    isSelected ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {stageId}
                  </span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    ~{stage.durationDays}d
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold truncate">
                  {language === 'ta' ? stage.nameTa : stage.nameEn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Detail Context Strip */}
      <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-slate-600">
            {t('durationEst')}: <strong className="text-slate-900 font-semibold">~{currentStageData.durationDays} days</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span className="text-slate-600">
            {t('waterNeed')}: <strong className="text-slate-900 font-semibold">{currentStageData.waterRequirement}</strong>
          </span>
        </div>
        <div className="flex items-start gap-2 sm:col-span-1">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <span className="text-slate-600 line-clamp-2">
            <strong className="text-slate-800 font-semibold">{t('criticalThreatFocus')}:</strong>{' '}
            {language === 'ta' ? currentStageData.vulnerabilityFocusTa : currentStageData.vulnerabilityFocusEn}
          </span>
        </div>
      </div>

    </section>
  );
};
