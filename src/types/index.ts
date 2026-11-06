export type Language = 'en' | 'ta';

export type CropId = 
  | 'paddy'
  | 'cotton'
  | 'sugarcane'
  | 'banana'
  | 'groundnut'
  | 'tomato'
  | 'maize'
  | 'finger_millet';

export type GrowthStageId = 
  | 'sowing'
  | 'vegetative'
  | 'flowering'
  | 'harvest';

export interface LocationData {
  id: string;
  nameEn: string;
  nameTa: string;
  districtEn: string;
  districtTa: string;
  latitude: number;
  longitude: number;
  isAutoDetected?: boolean;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitationProbability: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  soilMoisture: number; // percentage 0-100
  weatherCode: number;
  isDay: number;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  windSpeedMax: number;
  weatherCode: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  isOfflineOrFallback: boolean;
  lastUpdated: string;
}

export type WeatherThreatLevel = 'low' | 'moderate' | 'high' | 'severe';

export interface WeatherExtremeIndicators {
  heatStress: boolean;        // >38°C
  unseasonalRain: boolean;    // >40mm/day
  droughtSpell: boolean;      // 3+ days dry + high temp
  galeWinds: boolean;         // >35 km/h
  excessiveHumidity: boolean; // >85%
}

export interface ForecastThreatDay {
  date: string;
  dayNameEn: string;
  dayNameTa: string;
  level: WeatherThreatLevel;
  tempMax: number;
  rainSum: number;
  windMax: number;
  reasonEn: string;
  reasonTa: string;
  score: number; // 0-100
}

export interface WeatherAnalysisResult {
  threatLevel: WeatherThreatLevel;
  threatScore: number; // 0-100
  indicators: WeatherExtremeIndicators;
  summaryEn: string;
  summaryTa: string;
  diagnosticNotesEn: string[];
  diagnosticNotesTa: string[];
  forecastThreatDays: ForecastThreatDay[];
}

export interface BiologicalRiskScores {
  pestAndDiseaseRisk: number; // 0-100
  waterStressRisk: number;    // 0-100
  mechanicalDamageRisk: number;// 0-100
  overallCropRisk: number;    // 0-100
}

export interface CropVulnerabilityAnalysis {
  cropId: CropId;
  stageId: GrowthStageId;
  biologicalRiskScores: BiologicalRiskScores;
  vulnerabilitiesEn: string[];
  vulnerabilitiesTa: string[];
  diseaseOutbreakRiskEn?: string;
  diseaseOutbreakRiskTa?: string;
  physiologicalImpactEn: string;
  physiologicalImpactTa: string;
  keyNutrientNeedsEn: string;
  keyNutrientNeedsTa: string;
}

export type ActionUrgency = 'immediate' | 'short_term' | 'preventative';
export type ActionCategory = 
  | 'spraying'
  | 'irrigation'
  | 'drainage'
  | 'fertilizer'
  | 'structural'
  | 'harvest'
  | 'pest_control';

export interface ActionItem {
  id: string;
  urgency: ActionUrgency;
  category: ActionCategory;
  titleEn: string;
  titleTa: string;
  descriptionEn: string;
  descriptionTa: string;
  iconName: 'Droplets' | 'SprayCan' | 'ShieldAlert' | 'Wind' | 'Sun' | 'Bug' | 'Hammer' | 'CheckCircle';
  badgeEn: string;
  badgeTa: string;
  highlight?: boolean;
}

export interface SpraySafetyStatus {
  isSafe: boolean;
  windowEn: string;
  windowTa: string;
  reasonEn: string;
  reasonTa: string;
}

export interface ActionPlanResult {
  spraySafetyStatus: SpraySafetyStatus;
  immediateActions: ActionItem[];
  shortTermActions: ActionItem[];
  preventativeActions: ActionItem[];
  overallActionPriority: 'emergency' | 'high_vigilance' | 'standard_management' | 'optimal';
}

export interface AgentWorkflowStep {
  stepNumber: number;
  agentId: 'weather' | 'crop' | 'planner';
  agentNameEn: string;
  agentNameTa: string;
  agentRoleEn: string;
  agentRoleTa: string;
  inputDescriptionEn: string;
  inputDescriptionTa: string;
  reasoningChainEn: string[];
  reasoningChainTa: string[];
  outputSummaryEn: string;
  outputSummaryTa: string;
}

export interface AgronomicThresholds {
  id: CropId;
  nameEn: string;
  nameTa: string;
  icon: string;
  descriptionEn: string;
  descriptionTa: string;
  optimalTempMin: number;
  optimalTempMax: number;
  criticalHeatThreshold: number;
  criticalRainLimitDaily: number;
  criticalWindThreshold: number;
  humidityBlastVulnerability: number; // humidity % triggering fungal/blast
  stages: Record<GrowthStageId, {
    nameEn: string;
    nameTa: string;
    durationDays: number;
    waterRequirement: 'Low' | 'Medium' | 'High' | 'Very High';
    vulnerabilityFocusEn: string;
    vulnerabilityFocusTa: string;
    pestsToWatchEn: string[];
    pestsToWatchTa: string[];
  }>;
}
