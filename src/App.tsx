import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from './i18n/useTranslation';
import { 
  LocationData, 
  CropId, 
  GrowthStageId, 
  WeatherData 
} from './types';
import { TAMIL_NADU_HUBS } from './utils/cropDatabase';
import { fetchWeatherData, WeatherScenario } from './utils/weatherApi';
import { analyzeWeatherIntelligence } from './agents/weatherIntelligence';
import { evaluateCropAdvisor } from './agents/cropAdvisor';
import { planActions } from './agents/actionPlanner';

import { Header } from './components/Header';
import { OfflineBanner } from './components/OfflineBanner';
import { LocationSelector } from './components/LocationSelector';
import { CropSelector } from './components/CropSelector';
import { WeatherCard } from './components/WeatherCard';
import { AdvisoryActions } from './components/AdvisoryActions';
import { RiskReport } from './components/RiskReport';
import { AgentWorkflowModal } from './components/AgentWorkflowModal';
import { ScenarioSimulator } from './components/ScenarioSimulator';

export const App: React.FC = () => {
  const { t } = useTranslation();

  // 1. Core Platform State
  const [location, setLocation] = useState<LocationData>(TAMIL_NADU_HUBS[0]); // Thanjavur (Cauvery Delta)
  const [cropId, setCropId] = useState<CropId>('paddy');
  const [stageId, setStageId] = useState<GrowthStageId>('flowering');
  const [scenario, setScenario] = useState<WeatherScenario>('real');

  // Weather data & fetching states
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);

  // 2. Fetch Weather Telemetry
  const loadWeather = useCallback(async (loc: LocationData, sc: WeatherScenario) => {
    setIsRefreshing(true);
    try {
      const data = await fetchWeatherData(loc, sc);
      setWeatherData(data);
    } catch (err) {
      console.error('Failed to load weather:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(location, scenario);
  }, [location, scenario, loadWeather]);

  const handleRefreshWeather = () => {
    loadWeather(location, scenario);
  };

  const handleResetToReal = () => {
    setScenario('real');
  };

  // If weatherData is not yet loaded, render a clean loading skeleton
  if (!weatherData) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 flex flex-col items-center max-w-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce mb-4 text-2xl">
            🌱
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            {t('appTitle')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('weatherSubtitle')}...
          </p>
        </div>
      </div>
    );
  }

  // 3. Multi-Agent Autonomous Processing Pipeline
  // Agent 01: Weather Intelligence
  const weatherAnalysis = analyzeWeatherIntelligence(weatherData);

  // Agent 02: Crop Biological Advisor
  const cropVulnerability = evaluateCropAdvisor(cropId, stageId, weatherAnalysis, weatherData);

  // Agent 03: Operational Action Planner
  const { actionPlan, workflowSteps } = planActions(cropId, stageId, weatherAnalysis, cropVulnerability, weatherData);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* 1. Global Navigation Header */}
      <Header
        onOpenWorkflow={() => setIsWorkflowOpen(true)}
        onRefreshWeather={handleRefreshWeather}
        isRefreshing={isRefreshing}
        isOffline={weatherData.isOfflineOrFallback}
      />

      {/* 2. Offline / Simulated Scenario Banner */}
      <OfflineBanner
        isOffline={weatherData.isOfflineOrFallback}
        scenario={scenario}
        onResetToReal={handleResetToReal}
      />

      {/* 3. Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Scenario Simulator Controls */}
        <ScenarioSimulator
          currentScenario={scenario}
          onSelectScenario={setScenario}
        />

        {/* Location Selector (Tamil Nadu Hubs & GPS) */}
        <LocationSelector
          currentLocation={location}
          onLocationChange={setLocation}
        />

        {/* Crop & Phenological Growth Stage Selector */}
        <CropSelector
          selectedCrop={cropId}
          selectedStage={stageId}
          onCropChange={setCropId}
          onStageChange={setStageId}
        />

        {/* Live Weather Metrics & 7-Day Forecast */}
        <WeatherCard
          weather={weatherData}
          analysis={weatherAnalysis}
        />

        {/* Risk Meter Gauge, 7-Day Timeline & Print PDF Docket */}
        <RiskReport
          location={location}
          cropId={cropId}
          stageId={stageId}
          weatherAnalysis={weatherAnalysis}
          cropVulnerability={cropVulnerability}
          actionPlan={actionPlan}
        />

        {/* Action Planner: Spraying Safety Window, Immediate 24h & Short-Term */}
        <AdvisoryActions
          actionPlan={actionPlan}
        />

      </main>

      {/* 4. Multi-Agent Reasoning Modal Inspector */}
      <AgentWorkflowModal
        isOpen={isWorkflowOpen}
        onClose={() => setIsWorkflowOpen(false)}
        workflowSteps={workflowSteps}
      />

      {/* 5. Accessible Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          <p className="font-medium">
            {t('poweredBy')}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            AgriSense v1.0 • Tamil Nadu Agricultural University (TNAU) Agro-Climatic Zones
          </p>
        </div>
      </footer>

    </div>
  );
};
