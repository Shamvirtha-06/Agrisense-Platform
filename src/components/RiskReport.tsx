import React from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { 
  WeatherAnalysisResult, 
  CropVulnerabilityAnalysis, 
  ActionPlanResult, 
  LocationData, 
  CropId, 
  GrowthStageId 
} from '../types';
import { CROPS_DATABASE } from '../utils/cropDatabase';
import { 
  Gauge, 
  TrendingUp, 
  Printer, 
  Bug, 
  Droplets, 
  Wind, 
  CheckCircle2, 
  AlertTriangle,
  QrCode,
  FileCheck
} from 'lucide-react';

interface RiskReportProps {
  location: LocationData;
  cropId: CropId;
  stageId: GrowthStageId;
  weatherAnalysis: WeatherAnalysisResult;
  cropVulnerability: CropVulnerabilityAnalysis;
  actionPlan: ActionPlanResult;
}

export const RiskReport: React.FC<RiskReportProps> = ({
  location,
  cropId,
  stageId,
  weatherAnalysis,
  cropVulnerability,
  actionPlan,
}) => {
  const { t, language } = useTranslation();
  const crop = CROPS_DATABASE[cropId];
  const stage = crop.stages[stageId];
  const scores = cropVulnerability.biologicalRiskScores;

  const handlePrint = () => {
    window.print();
  };

  // Compute needle angle for Gauge: 0 -> -90 deg, 100 -> +90 deg
  const overallScore = scores.overallCropRisk;
  const needleRotation = -90 + (overallScore / 100) * 180;

  // Determine risk category label & color
  let riskLabelEn = 'Low Risk (Green)';
  let riskLabelTa = 'குறைந்த அபாயம் (பச்சை)';
  let riskColor = '#059669'; // Emerald

  if (overallScore >= 75) {
    riskLabelEn = 'Critical Risk (Red)';
    riskLabelTa = 'தீவிர அபாயம் (சிவப்பு)';
    riskColor = '#e11d48'; // Rose
  } else if (overallScore >= 50) {
    riskLabelEn = 'High Risk (Orange)';
    riskLabelTa = 'அதிக அபாயம் (ஆரஞ்சு)';
    riskColor = '#ea580c'; // Orange
  } else if (overallScore >= 25) {
    riskLabelEn = 'Moderate Risk (Yellow)';
    riskLabelTa = 'மிதமான அபாயம் (மஞ்சள்)';
    riskColor = '#d97706'; // Amber
  }

  const currentDate = new Date().toLocaleDateString(
    language === 'ta' ? 'ta-IN' : 'en-IN',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-6 space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {t('riskReportTitle')}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('downloadPdfNotice')}
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>{t('printReport')}</span>
        </button>
      </div>

      {/* Top Visual: Gauge & Biological Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Semi-Circle SVG Gauge Meter (4 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            {t('riskMeterTitle')}
          </div>

          <div className="relative w-56 h-32 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 200 110" className="w-full h-full">
              {/* Arc background segments */}
              {/* Green Arc (0-25) */}
              <path
                d="M 20 100 A 80 80 0 0 1 56 43"
                fill="none"
                stroke="#059669"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Yellow/Amber Arc (25-50) */}
              <path
                d="M 60 39 A 80 80 0 0 1 100 20"
                fill="none"
                stroke="#eab308"
                strokeWidth="16"
              />
              {/* Orange Arc (50-75) */}
              <path
                d="M 100 20 A 80 80 0 0 1 140 39"
                fill="none"
                stroke="#f97316"
                strokeWidth="16"
              />
              {/* Red Arc (75-100) */}
              <path
                d="M 144 43 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#e11d48"
                strokeWidth="16"
                strokeLinecap="round"
              />

              {/* Pivot circle */}
              <circle cx="100" cy="98" r="7" fill="#1e293b" />

              {/* Dynamic Needle */}
              <g transform={`rotate(${needleRotation}, 100, 98)`}>
                <line
                  x1="100"
                  y1="98"
                  x2="100"
                  y2="30"
                  stroke="#0f172a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="30" r="2.5" fill="#f8fafc" />
              </g>
            </svg>

            {/* Overall Score Badge Overlay */}
            <div className="absolute bottom-0 text-center">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {overallScore}
              </span>
              <span className="text-xs text-slate-500 font-semibold">/100</span>
            </div>
          </div>

          <div
            className="mt-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
            style={{ backgroundColor: riskColor }}
          >
            {language === 'ta' ? riskLabelTa : riskLabelEn}
          </div>
        </div>

        {/* Biological Risk Progress Bars (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('biologicalRisks')}
          </div>

          {/* 1. Pest & Disease */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Bug className="w-4 h-4 text-amber-600" />
                {t('pestDiseaseRisk')}
              </span>
              <span className="font-mono text-slate-900">{scores.pestAndDiseaseRisk}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 rounded-full bg-amber-500 transition-all duration-500"
                style={{ width: `${scores.pestAndDiseaseRisk}%` }}
              ></div>
            </div>
          </div>

          {/* 2. Water Stress */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Droplets className="w-4 h-4 text-blue-600" />
                {t('waterStressRisk')}
              </span>
              <span className="font-mono text-slate-900">{scores.waterStressRisk}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${scores.waterStressRisk}%` }}
              ></div>
            </div>
          </div>

          {/* 3. Mechanical Damage */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Wind className="w-4 h-4 text-teal-600" />
                {t('mechanicalDamageRisk')}
              </span>
              <span className="font-mono text-slate-900">{scores.mechanicalDamageRisk}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 rounded-full bg-teal-500 transition-all duration-500"
                style={{ width: `${scores.mechanicalDamageRisk}%` }}
              ></div>
            </div>
          </div>

          {/* Physiological & Nutrient Insights */}
          <div className="pt-2 text-xs text-slate-600 space-y-1.5 border-t border-slate-100">
            <p>
              <strong className="text-slate-800">{t('physiologicalImpact')}:</strong>{' '}
              {language === 'ta' ? cropVulnerability.physiologicalImpactTa : cropVulnerability.physiologicalImpactEn}
            </p>
            <p>
              <strong className="text-slate-800">{t('nutrientAdvisory')}:</strong>{' '}
              {language === 'ta' ? cropVulnerability.keyNutrientNeedsTa : cropVulnerability.keyNutrientNeedsEn}
            </p>
          </div>
        </div>

      </div>

      {/* 7-Day Risk Timeline Trajectory Chart */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {t('sevenDayRiskTimeline')}
            </h3>
          </div>
        </div>

        {/* Visual Bar Timeline */}
        <div className="grid grid-cols-7 gap-2">
          {weatherAnalysis.forecastThreatDays.map((day, idx) => {
            const isToday = idx === 0;
            const barHeightPercent = Math.max(15, day.score);
            let barBg = 'bg-emerald-500';
            if (day.score >= 70) barBg = 'bg-rose-500';
            else if (day.score >= 45) barBg = 'bg-orange-500';
            else if (day.score >= 25) barBg = 'bg-amber-400';

            return (
              <div key={day.date} className="flex flex-col items-center">
                {/* Bar Container */}
                <div className="w-full bg-slate-100 rounded-lg h-24 flex items-end p-1 justify-center">
                  <div
                    className={`w-full rounded-md ${barBg} transition-all duration-500 relative group flex items-start justify-center pt-1`}
                    style={{ height: `${barHeightPercent}%` }}
                  >
                    <span className="text-[9px] font-bold text-white leading-none">
                      {day.score}
                    </span>
                  </div>
                </div>

                {/* Day label */}
                <span className={`text-[10px] mt-1.5 font-bold truncate max-w-full ${
                  isToday ? 'text-emerald-700' : 'text-slate-600'
                }`}>
                  {isToday ? (language === 'ta' ? 'இன்று' : 'Today') : (language === 'ta' ? day.dayNameTa.slice(0, 3) : day.dayNameEn.slice(0, 3))}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  {day.date.slice(8)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* PRINT-ONLY OFFICIAL ADVISORY DOCKET FORMAT (Hidden on Screen) */}
      {/* ============================================================== */}
      <div className="hidden print:block text-slate-900 font-sans p-6 bg-white">
        
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-emerald-900">
              {t('appTitle')} • {t('reportHeader')}
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              {t('verifiedAgronomist')}
            </p>
          </div>
          <div className="text-right text-xs">
            <div>{t('printedOn')}: <strong>{currentDate}</strong></div>
            <div>Ref No: <strong>TN-AGR-{Math.floor(Math.random() * 90000 + 10000)}</strong></div>
          </div>
        </div>

        {/* Farmer & Crop Metadata Box */}
        <div className="grid grid-cols-2 gap-4 p-4 border border-slate-300 rounded-lg bg-slate-50 mb-6 text-xs">
          <div>
            <p className="font-bold text-slate-800">{t('farmerName')}</p>
            <p className="text-slate-600">{t('farmLocation')}</p>
            <p className="text-slate-600">
              Location: <strong>{language === 'ta' ? location.nameTa : location.nameEn}</strong> (Lat: {location.latitude}, Lon: {location.longitude})
            </p>
          </div>
          <div>
            <p className="font-bold text-slate-800">
              {t('selectedCrop')}: <strong>{language === 'ta' ? crop.nameTa : crop.nameEn}</strong>
            </p>
            <p className="text-slate-600">
              {t('growthStage')}: <strong>{language === 'ta' ? stage.nameTa : stage.nameEn}</strong> (~{stage.durationDays} days)
            </p>
            <p className="text-slate-600">
              Composite Risk Index: <strong>{overallScore}/100 ({language === 'ta' ? riskLabelTa : riskLabelEn})</strong>
            </p>
          </div>
        </div>

        {/* Foliar Spraying Window Guidance */}
        <div className="p-3 border-2 border-slate-900 rounded mb-4 text-xs">
          <strong className="uppercase text-slate-900">{t('spraySafetyTitle')}: </strong>
          <span className="font-bold">
            {language === 'ta' ? actionPlan.spraySafetyStatus.windowTa : actionPlan.spraySafetyStatus.windowEn}
          </span>
          <p className="mt-1 text-slate-700">
            {language === 'ta' ? actionPlan.spraySafetyStatus.reasonTa : actionPlan.spraySafetyStatus.reasonEn}
          </p>
        </div>

        {/* Priority Actions Checklist for Print */}
        <div className="mb-6 text-xs">
          <h3 className="font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
            {t('immediateActionsTitle')}
          </h3>
          <ul className="space-y-2">
            {actionPlan.immediateActions.map((act) => (
              <li key={act.id} className="flex items-start gap-2">
                <span className="w-3.5 h-3.5 border border-slate-700 rounded-sm mt-0.5 inline-block"></span>
                <div>
                  <strong>{language === 'ta' ? act.titleTa : act.titleEn}</strong>
                  <p className="text-slate-600">{language === 'ta' ? act.descriptionTa : act.descriptionEn}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6 text-xs">
          <h3 className="font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
            {t('shortTermActionsTitle')} & {t('preventativeActionsTitle')}
          </h3>
          <ul className="space-y-2">
            {actionPlan.shortTermActions.concat(actionPlan.preventativeActions).slice(0, 4).map((act) => (
              <li key={act.id} className="flex items-start gap-2">
                <span className="w-3.5 h-3.5 border border-slate-700 rounded-sm mt-0.5 inline-block"></span>
                <div>
                  <strong>{language === 'ta' ? act.titleTa : act.titleEn}</strong>
                  <p className="text-slate-600">{language === 'ta' ? act.descriptionTa : act.descriptionEn}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer & QR Code Placeholder */}
        <div className="border-t border-slate-300 pt-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 border border-slate-400 flex items-center justify-center p-1 bg-slate-100 rounded">
              <QrCode className="w-12 h-12 text-slate-800" />
            </div>
            <p className="text-slate-600 max-w-xs">
              {t('qrCodeText')}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-800">Agricultural Extension Officer</p>
            <p className="text-slate-500 text-[10px]">TNAU Agrometeorological Field Station</p>
          </div>
        </div>

      </div>

    </section>
  );
};
