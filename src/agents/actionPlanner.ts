import { 
  WeatherAnalysisResult, 
  CropVulnerabilityAnalysis, 
  ActionPlanResult, 
  ActionItem, 
  SpraySafetyStatus, 
  AgentWorkflowStep, 
  WeatherData, 
  CropId, 
  GrowthStageId 
} from '../types';
import { CROPS_DATABASE } from '../utils/cropDatabase';

export function planActions(
  cropId: CropId,
  stageId: GrowthStageId,
  weatherAnalysis: WeatherAnalysisResult,
  cropVulnerability: CropVulnerabilityAnalysis,
  weather: WeatherData
): { actionPlan: ActionPlanResult; workflowSteps: AgentWorkflowStep[] } {
  const current = weather.current;
  const indicators = weatherAnalysis.indicators;
  const cropConfig = CROPS_DATABASE[cropId];
  const stageConfig = cropConfig.stages[stageId];
  const maxWind = Math.max(current.windSpeed, ...(weather.daily.map(d => d.windSpeedMax) || [0]));

  // 1. Evaluate Spray Safety Window
  let isSpraySafe = true;
  let sprayWindowEn = '06:30 AM – 09:30 AM';
  let sprayWindowTa = 'காலை 06:30 – 09:30 மணி வரை';
  let sprayReasonEn = 'Low wind drift and moderate relative humidity provide good foliar adhesion.';
  let sprayReasonTa = 'குறைந்த காற்று வேகம் மற்றும் சீரான ஈரப்பதம் மருந்துகள் இலைகளில் நன்கு ஒட்ட உதவுகிறது.';

  if (current.precipitationProbability >= 50 || indicators.unseasonalRain) {
    isSpraySafe = false;
    sprayWindowEn = 'SUSPEND SPRAYING TODAY';
    sprayWindowTa = 'இன்று மருந்து தெளிக்க வேண்டாம்';
    sprayReasonEn = `Rainfall probability (${current.precipitationProbability}%) will cause wash-off and environmental leaching of chemical inputs.`;
    sprayReasonTa = `மழை வாய்ப்பு (${current.precipitationProbability}%) அதிகமாக உள்ளதால் மருந்து மழைநீரில் அடித்துச் செல்லப்பட்டு வீணாகும்.`;
  } else if (current.windSpeed > 18) {
    isSpraySafe = false;
    sprayWindowEn = 'HIGH WIND DRIFT ALERT';
    sprayWindowTa = 'காற்று வீச்சு அதிகம்';
    sprayReasonEn = `Wind speed at ${current.windSpeed} km/h will cause severe droplet drift away from target foliage.`;
    sprayReasonTa = `காற்றின் வேகம் ${current.windSpeed} கி.மீ/மணியாக உள்ளதால் தெளிக்கும் மருந்து காற்றில் பறந்து வீணாகும்.`;
  } else if (current.temperature > 36) {
    isSpraySafe = false;
    sprayWindowEn = 'SPRAY ONLY BEFORE 07:30 AM';
    sprayWindowTa = 'காலை 07:30 மணிக்குள் மட்டுமே';
    sprayReasonEn = 'High midday ambient heat causes rapid droplet evaporation and potential chemical phytotoxicity (leaf scorch).';
    sprayReasonTa = 'நண்பகல் வெப்பத்தினால் மருந்து ஆவியாகி பயிரில் இலைக்கருகல் நச்சுத்தன்மையை ஏற்படுத்தலாம்.';
  }

  const spraySafetyStatus: SpraySafetyStatus = {
    isSafe: isSpraySafe,
    windowEn: sprayWindowEn,
    windowTa: sprayWindowTa,
    reasonEn: sprayReasonEn,
    reasonTa: sprayReasonTa,
  };

  // 2. Immediate Actions (Next 24 Hours)
  const immediateActions: ActionItem[] = [];

  // Spraying action
  if (!isSpraySafe) {
    immediateActions.push({
      id: 'imm-spray-halt',
      urgency: 'immediate',
      category: 'spraying',
      titleEn: 'Postpone Chemical Spray Applications',
      titleTa: 'மருந்து தெளிப்பை உடனடியாக ஒத்திவைக்கவும்',
      descriptionEn: sprayReasonEn,
      descriptionTa: sprayReasonTa,
      iconName: 'SprayCan',
      badgeEn: 'Urgent Weather Halt',
      badgeTa: 'வானிலை அவசர நிறுத்தம்',
      highlight: true,
    });
  } else {
    immediateActions.push({
      id: 'imm-spray-safe',
      urgency: 'immediate',
      category: 'spraying',
      titleEn: `Safe Foliar Spray Window (${sprayWindowEn})`,
      titleTa: `மருந்து தெளிக்க உகந்த நேரம் (${sprayWindowTa})`,
      descriptionEn: `Execute scheduled protective spraying against ${stageConfig.pestsToWatchEn[0] || 'foliar pests'} during early morning calm hours.`,
      descriptionTa: `அதிகாலை அமைதியான நேரத்தில் ${stageConfig.pestsToWatchTa[0] || 'பூச்சிகளுக்கு'} எதிரான தடுப்பு மருந்தை தெளிக்கவும்.`,
      iconName: 'SprayCan',
      badgeEn: 'Safe Window',
      badgeTa: 'பாதுகாப்பான நேரம்',
    });
  }

  // Emergency Drainage for Heavy Rain
  if (indicators.unseasonalRain || current.soilMoisture > 85) {
    immediateActions.push({
      id: 'imm-drainage',
      urgency: 'immediate',
      category: 'drainage',
      titleEn: 'Clear Field Perimeter Drainage Trenches',
      titleTa: 'வயல் வடிகால் வாய்க்கால்களை தூர்வாரி சுத்தம் செய்யவும்',
      descriptionEn: 'Form deep relief trenches around field borders to prevent root asphyxiation from accumulated rainfall.',
      descriptionTa: 'கனமழையினால் வேர்ப்பகுதியில் நீர் தேங்குவதைத் தடுக்க வயலைச் சுற்றிலும் ஆழமான வடிகால் வாய்க்கால்களை உடனே அமையுங்கள்.',
      iconName: 'Droplets',
      badgeEn: 'Drainage Priority',
      badgeTa: 'வடிகால் முதன்மை',
      highlight: true,
    });
  }

  // Urgent Harvest Rush if harvest ready and rain imminent
  if (stageId === 'harvest' && (indicators.unseasonalRain || current.precipitationProbability > 40)) {
    immediateActions.push({
      id: 'imm-harvest-rush',
      urgency: 'immediate',
      category: 'harvest',
      titleEn: 'Accelerate Emergency Harvest & Safe Storage',
      titleTa: 'அறுவடையைத் துரிதப்படுத்தி விளைபொருளைப் பாதுகாப்பான இடத்திற்கு மாற்றவும்',
      descriptionEn: 'Mature crop must be reaped immediately or harvested produce moved to moisture-proof tarpaulin storage.',
      descriptionTa: 'அறுவடைக்குத் தயாராக உள்ள விளைபொருளை உடனே அறுத்து அல்லது தார்ப்பாய் கொண்டு மூடி நனையாமல் பாதுகாக்கவும்.',
      iconName: 'CheckCircle',
      badgeEn: 'Harvest Rush',
      badgeTa: 'அவசர அறுவடை',
      highlight: true,
    });
  }

  // High Wind Mechanical Staking / Propping
  if (maxWind >= 26 && (cropId === 'banana' || cropId === 'sugarcane' || cropId === 'tomato')) {
    immediateActions.push({
      id: 'imm-propping',
      urgency: 'immediate',
      category: 'structural',
      titleEn: `Emergency Staking / Propping for ${cropConfig.nameEn}`,
      titleTa: `${cropConfig.nameTa} பயிர்களுக்கு உடனடி முட்டுக்கொடுத்தல்`,
      descriptionEn: `Gale winds (${maxWind} km/h) require bamboo propping or double-tie earthing up to prevent catastrophic stalk lodging.`,
      descriptionTa: `${maxWind} கி.மீ வேகத்தில் வீசும் காற்றினால் பயிர் சாயாமல் இருக்க மூங்கில் முட்டுக் கொடுக்கவும் அல்லது மண்களை அணைத்துக் கட்டவும்.`,
      iconName: 'Hammer',
      badgeEn: 'Lodging Risk Action',
      badgeTa: 'சாய்வு தடுப்பு நடவடிக்கை',
      highlight: true,
    });
  }

  // Drought Irrigation Emergency
  if (indicators.droughtSpell || current.soilMoisture < 25) {
    immediateActions.push({
      id: 'imm-irrigation',
      urgency: 'immediate',
      category: 'irrigation',
      titleEn: 'Deploy Deficit Night/Evening Micro-Irrigation',
      titleTa: 'மாலை அல்லது இரவு நேர நுண்ணீர்ப்பாசனம் வழங்கவும்',
      descriptionEn: 'Deliver 15-20mm water depth in evening hours to mitigate thermal leaf dehydration and replenish rhizosphere reserves.',
      descriptionTa: 'வெயிலில் நீர் ஆவியாவதைத் தவிர்க்க மாலையில் நுண்ணீர்ப்பாசனம் மூலம் வேர்ப்பகுதிக்கு மிதமான நீர் பாய்ச்சவும்.',
      iconName: 'Droplets',
      badgeEn: 'Moisture Replenishment',
      badgeTa: 'ஈரப்பதம் மீட்டெடுத்தல்',
    });
  }

  // 3. Short-Term Farm Management (Next 2–4 Days)
  const shortTermActions: ActionItem[] = [];

  // Fertilizer top-dressing
  if (indicators.unseasonalRain) {
    shortTermActions.push({
      id: 'st-fert-defer',
      urgency: 'short_term',
      category: 'fertilizer',
      titleEn: 'Withhold Nitrogen Top-Dressing Until Runoff Ceases',
      titleTa: 'மழைநீர் வடியும் வரை தழைச்சத்து உரம் (யூரியா) இடுவதை ஒத்திவைக்கவும்',
      descriptionEn: 'Apply split dose of Potassium and micro-nutrients 48 hours after field soil moisture stabilizes to field capacity.',
      descriptionTa: 'மண் ஈரம் சீரடைந்த 48 மணி நேரத்திற்குப் பிறகு பொட்டாஷ் மற்றும் நுண்ணூட்ட உரங்களை மேலுரமாக இடவும்.',
      iconName: 'Sun',
      badgeEn: 'Fertilizer Timing',
      badgeTa: 'உர மேலாண்மை',
    });
  } else if (indicators.heatStress) {
    shortTermActions.push({
      id: 'st-foliar-spray',
      urgency: 'short_term',
      category: 'fertilizer',
      titleEn: 'Foliar Osmoprotectant Application (1% MOP or Kaolin)',
      titleTa: 'வெப்ப அழுத்தத்தைத் தாங்க 1% பொட்டாஷ் அல்லது கயோலின் தெளிப்பு',
      descriptionEn: 'Foliar spray of 1% Muriate of Potash creates osmotic adjustment in leaves, reducing thermal radiation shock.',
      descriptionTa: '1% பொட்டாஷ் கரைசல் தெளிப்பதன் மூலம் இலைகளின் வெப்பத் தாங்கு திறன் அதிகரித்து பயிர் வாடாமல் காக்கப்படும்.',
      iconName: 'Sun',
      badgeEn: 'Heat Mitigation',
      badgeTa: 'வெப்பத் தணிப்பு',
    });
  } else {
    shortTermActions.push({
      id: 'st-fert-routine',
      urgency: 'short_term',
      category: 'fertilizer',
      titleEn: `Scheduled ${stageConfig.nameEn} Nutrition Boost`,
      titleTa: `${stageConfig.nameTa} பருவத்திற்கான பரிந்துரைக்கப்பட்ட ஊட்டச்சத்து`,
      descriptionEn: cropVulnerability.keyNutrientNeedsEn,
      descriptionTa: cropVulnerability.keyNutrientNeedsTa,
      iconName: 'Sun',
      badgeEn: 'Agronomic Nutrition',
      badgeTa: 'வழக்கமான ஊட்டச்சத்து',
    });
  }

  // Pest scouting schedule
  shortTermActions.push({
    id: 'st-pest-scout',
    urgency: 'short_term',
    category: 'pest_control',
    titleEn: `Field Scouting for ${stageConfig.pestsToWatchEn[0]} & ${stageConfig.pestsToWatchEn[1] || 'Vector Insects'}`,
    titleTa: `${stageConfig.pestsToWatchTa[0]} மற்றும் ${stageConfig.pestsToWatchTa[1] || 'பூச்சிகள்'} களக் கண்காணிப்பு`,
    descriptionEn: `Inspect underside of 20 random leaves per acre. Check economic threshold levels (ETL) before committing chemical controls.`,
    descriptionTa: `ஏக்கருக்கு 20 செடிகளின் இலைகளின் அடிப்பகுதியை ஆய்வு செய்து பூச்சியின் பொருளாதார சேத வரம்பை (ETL) உறுதி செய்யவும்.`,
    iconName: 'Bug',
    badgeEn: 'Biosecurity Scouting',
    badgeTa: 'களக் கண்காணிப்பு',
  });

  // 4. Preventative Measures
  const preventativeActions: ActionItem[] = [
    {
      id: 'prev-traps',
      urgency: 'preventative',
      category: 'pest_control',
      titleEn: 'Install Pheromone & Yellow Sticky Traps',
      titleTa: 'இனக்கவர்ச்சி மற்றும் மஞ்சள் ஒட்டும் பொறிகள் அமைத்தல்',
      descriptionEn: `Set up 5 pheromone traps/acre for borer moths and 10 yellow sticky sheets/acre for whiteflies and thrips.`,
      descriptionTa: `ஏக்கருக்கு 5 இனக்கவர்ச்சி பொறிகளையும், 10 மஞ்சள் நிற ஒட்டும் பொறிகளையும் வைத்து பூச்சிகளைக் கட்டுப்படுத்தவும்.`,
      iconName: 'Bug',
      badgeEn: 'Eco-Trap System',
      badgeTa: 'இயற்கைப் பொறி முறை',
    },
    {
      id: 'prev-mulch',
      urgency: 'preventative',
      category: 'irrigation',
      titleEn: 'Organic Biomass Mulching in Furrows',
      titleTa: 'பயிர்க்கழிவுகள் கொண்டு நிலப்போர்வை (தழைக்கூளம்) அமைத்தல்',
      descriptionEn: 'Spread dried straw or coir pith at 5cm depth along crop rows to suppress weed emergence and lock soil moisture.',
      descriptionTa: 'காய்ந்த வைக்கோல் அல்லது தென்னை நார்க்கழிவு கொண்டு நிலப்போர்வை அமைத்து ஈரப்பதத்தைப் பாதுகாக்கவும்.',
      iconName: 'ShieldAlert',
      badgeEn: 'Soil Conservation',
      badgeTa: 'மண் பாதுகாப்பு',
    },
    {
      id: 'prev-neem',
      urgency: 'preventative',
      category: 'spraying',
      titleEn: 'Prophylactic Azadirachtin / Neem Oil (3ml/L) Barrier',
      titleTa: 'வேப்பெண்ணெய் (3 மி.லி/லி) தடுப்புத் தெளிப்பு',
      descriptionEn: 'Spray botanical neem seed kernel extract (NSKE 5%) to act as an insect feeding deterrent and oviposition repellent.',
      descriptionTa: 'வேப்பெண்ணெய் கரைசல் தெளிப்பதன் மூலம் பூச்சிகள் முட்டையிடுவதையும் இலைகளை உண்பதையும் இயற்கையாகத் தடுக்கலாம்.',
      iconName: 'SprayCan',
      badgeEn: 'Organic Protection',
      badgeTa: 'இயற்கை பூச்சி விரட்டி',
    },
  ];

  // Overall priority assessment
  let overallActionPriority: 'emergency' | 'high_vigilance' | 'standard_management' | 'optimal' = 'standard_management';
  if (weatherAnalysis.threatLevel === 'severe' || cropVulnerability.biologicalRiskScores.overallCropRisk >= 75) {
    overallActionPriority = 'emergency';
  } else if (weatherAnalysis.threatLevel === 'high' || cropVulnerability.biologicalRiskScores.overallCropRisk >= 50) {
    overallActionPriority = 'high_vigilance';
  } else if (weatherAnalysis.threatLevel === 'moderate') {
    overallActionPriority = 'standard_management';
  } else {
    overallActionPriority = 'optimal';
  }

  const actionPlan: ActionPlanResult = {
    spraySafetyStatus,
    immediateActions,
    shortTermActions,
    preventativeActions,
    overallActionPriority,
  };

  // 5. Construct Visual Agent Workflow Reasoning Steps
  const workflowSteps: AgentWorkflowStep[] = [
    {
      stepNumber: 1,
      agentId: 'weather',
      agentNameEn: 'Weather Intelligence Agent',
      agentNameTa: 'வானிலை நுண்ணறிவு முகவர்',
      agentRoleEn: 'Atmospheric Signal Extraction & Extreme Risk Detection',
      agentRoleTa: 'வானிலை அளவீட்டு சமிக்கைகள் & தீவிர வரம்புப் பகுப்பாய்வு',
      inputDescriptionEn: `Ingested Open-Meteo telemetry: Temp ${current.temperature}°C, Humidity ${current.humidity}%, Rain Prob ${current.precipitationProbability}%, Wind ${current.windSpeed} km/h, 7-day projection.`,
      inputDescriptionTa: `வானிலை அளவீடுகள் பெறப்பட்டது: வெப்பநிலை ${current.temperature}°C, ஈரப்பதம் ${current.humidity}%, மழை வாய்ப்பு ${current.precipitationProbability}%, காற்று ${current.windSpeed} கி.மீ/மணி.`,
      reasoningChainEn: [
        `Evaluated heat stress threshold (>38°C): ${indicators.heatStress ? 'BREACHED' : 'Normal'}`,
        `Evaluated unseasonal rainfall threshold (>40mm): ${indicators.unseasonalRain ? 'CRITICAL DELUGE' : 'Normal'}`,
        `Evaluated gale wind force threshold (>35 km/h): ${indicators.galeWinds ? 'HIGH GUST RISK' : 'Normal'}`,
        `Evaluated persistent drought & evaporation run: ${indicators.droughtSpell ? 'DROUGHT IDENTIFIED' : 'Adequate'}`,
        `Calculated composite Weather Threat Score: ${weatherAnalysis.threatScore}/100 [Level: ${weatherAnalysis.threatLevel.toUpperCase()}]`,
      ],
      reasoningChainTa: [
        `வெப்ப அலை வரம்பு (>38°C) சோதனை: ${indicators.heatStress ? 'மீறப்பட்டது' : 'சீரானது'}`,
        `கனமழை வரம்பு (>40 மி.மீ) சோதனை: ${indicators.unseasonalRain ? 'கனமழை எச்சரிக்கை' : 'சீரானது'}`,
        `சூறைக்காற்று வரம்பு (>35 கி.மீ) சோதனை: ${indicators.galeWinds ? 'பலத்த காற்று அபாயம்' : 'சீரானது'}`,
        `வறட்சி மற்றும் ஆவியாதல் ஆய்வு: ${indicators.droughtSpell ? 'வறட்சி அடையாளம் காணப்பட்டது' : 'போதுமானது'}`,
        `ஒருங்கிணைந்த வானிலை அச்சுறுத்தல் மதிப்பெண்: ${weatherAnalysis.threatScore}/100 [நிலை: ${weatherAnalysis.threatLevel.toUpperCase()}]`,
      ],
      outputSummaryEn: `Delivered threat rating '${weatherAnalysis.threatLevel.toUpperCase()}' with ${weatherAnalysis.diagnosticNotesEn.length} active meteorological diagnostic vectors.`,
      outputSummaryTa: `'${weatherAnalysis.threatLevel.toUpperCase()}' அச்சுறுத்தல் நிலையும் ${weatherAnalysis.diagnosticNotesTa.length} தீவிர வானிலை எச்சரிக்கைகளும் கணக்கிடப்பட்டு அடுத்த முகவருக்கு அனுப்பப்பட்டது.`,
    },
    {
      stepNumber: 2,
      agentId: 'crop',
      agentNameEn: 'Crop Biological Advisor Agent',
      agentNameTa: 'பயிர் உயிரியல் ஆலோசகர் முகவர்',
      agentRoleEn: 'Phenological Vulnerability Intersection & Biological Risk Scoring',
      agentRoleTa: 'பயிர் உடலியல் & உயிரியல் பாதிப்பு மதிப்பீடு',
      inputDescriptionEn: `Cross-referenced '${cropConfig.nameEn}' at '${stageConfig.nameEn}' stage against Agent 1 weather diagnostic vectors.`,
      inputDescriptionTa: `'${cropConfig.nameTa}' (${stageConfig.nameTa}) உடலியல் பண்புகளை வானிலை முகவரின் தரவுகளுடன் ஒப்பீடு செய்தது.`,
      reasoningChainEn: [
        `Examined fungal blast & sporulation threshold: Humidity ${current.humidity}% vs Crop threshold ${cropConfig.humidityBlastVulnerability}% -> Pathogen risk score ${cropVulnerability.biologicalRiskScores.pestAndDiseaseRisk}/100`,
        `Examined lodging resistance vs wind gusts: Max wind ${maxWind} km/h vs Crop lodging limit ${cropConfig.criticalWindThreshold} km/h -> Mechanical risk ${cropVulnerability.biologicalRiskScores.mechanicalDamageRisk}/100`,
        `Examined root zone water saturation vs drought tolerance: Soil moisture ${current.soilMoisture}% -> Water stress score ${cropVulnerability.biologicalRiskScores.waterStressRisk}/100`,
        `Synthesized Overall Biological Stress Score: ${cropVulnerability.biologicalRiskScores.overallCropRisk}/100`,
      ],
      reasoningChainTa: [
        `பூஞ்சாண நோய் வரம்பு ஆய்வு: காற்றில் ஈரப்பதம் ${current.humidity}% vs பயிர் வரம்பு ${cropConfig.humidityBlastVulnerability}% -> நோய் அபாய மதிப்பு ${cropVulnerability.biologicalRiskScores.pestAndDiseaseRisk}/100`,
        `பயிர் சாய்வு தாங்குதிறன் ஆய்வு: காற்றின் வேகம் ${maxWind} கி.மீ/மணி vs சாய்வு வரம்பு ${cropConfig.criticalWindThreshold} கி.மீ/மணி -> சாய்வு அபாய மதிப்பு ${cropVulnerability.biologicalRiskScores.mechanicalDamageRisk}/100`,
        `வேர்ப்பகுதி ஈரப்பதம் & வறட்சி ஆய்வு: மண் ஈரம் ${current.soilMoisture}% -> நீர்ப்பற்றாக்குறை அபாய மதிப்பு ${cropVulnerability.biologicalRiskScores.waterStressRisk}/100`,
        `ஒருங்கிணைந்த பயிர் உயிரியல் பாதுகாப்பு அழுத்தம்: ${cropVulnerability.biologicalRiskScores.overallCropRisk}/100`,
      ],
      outputSummaryEn: `Formulated ${cropVulnerability.vulnerabilitiesEn.length} physiological vulnerability alerts and identified critical target pests: ${stageConfig.pestsToWatchEn.slice(0, 2).join(', ')}.`,
      outputSummaryTa: `${cropVulnerability.vulnerabilitiesTa.length} பயிர் பாதிப்பு எச்சரிக்கைகள் மற்றும் முக்கிய பூச்சிகள் (${stageConfig.pestsToWatchTa.slice(0, 2).join(', ')}) கண்டறியப்பட்டன.`,
    },
    {
      stepNumber: 3,
      agentId: 'planner',
      agentNameEn: 'Operational Action Planner Agent',
      agentNameTa: 'களச் செயல் திட்ட முகவர்',
      agentRoleEn: 'Multi-Agent Synthesis & Priority-Timed Field Scheduler',
      agentRoleTa: 'முகவர்கள் ஒருங்கிணைப்பு & முன்னுரிமை அடிப்படையிலான களப் பணிகள் உருவாக்கம்',
      inputDescriptionEn: `Reconciled Agent 1 (Atmospheric Threat: ${weatherAnalysis.threatLevel}) + Agent 2 (Biological Risk: ${cropVulnerability.biologicalRiskScores.overallCropRisk}/100).`,
      inputDescriptionTa: `முகவர் 1 (வானிலை அழுத்தம்) மற்றும் முகவர் 2 (பயிர் உயிரியல் பாதிப்பு) தரவுகளை ஒருங்கிணைத்தது.`,
      reasoningChainEn: [
        `Spraying Safety Algorithm evaluated: Rain ${current.precipitationProbability}% / Wind ${current.windSpeed} km/h -> Status: ${spraySafetyStatus.isSafe ? 'SAFE WINDOW GRANTED' : 'UNSAFE / WITHHELD'}`,
        `Urgency Segregation: Sorted high-impact field actions into Next 24 Hours (${immediateActions.length} actions) vs Next 2-4 Days (${shortTermActions.length} actions)`,
        `Instituted IPM Biosecurity: Added ${preventativeActions.length} preventative non-chemical protection measures`,
        `Final Priority Level Assigned: ${overallActionPriority.toUpperCase()}`,
      ],
      reasoningChainTa: [
        `மருந்து தெளிப்பு பாதுகாப்பு கணக்கீடு: மழை ${current.precipitationProbability}% / காற்று ${current.windSpeed} கி.மீ -> முடிவு: ${spraySafetyStatus.isSafe ? 'தெளிப்பு உகந்தது' : 'தெளிப்பு ஒத்திவைக்கப்பட்டது'}`,
        `பணிகள் பிரிப்பு: உடனடி 24 மணி நேரப் பணிகள் (${immediateActions.length} பணிகள்) மற்றும் 2-4 நாள் திட்டப் பணிகள் (${shortTermActions.length} பணிகள்) வகைப்படுத்தப்பட்டன`,
        `ஒருங்கிணைந்த பயிர் பாதுகாப்பு: ${preventativeActions.length} இயற்கை பாதுகாப்பு நடவடிக்கைகள் இணைக்கப்பட்டன`,
        `இறுதி கள முன்னுரிமை நிலை: ${overallActionPriority.toUpperCase()}`,
      ],
      outputSummaryEn: `Generated actionable farmer docket with ${immediateActions.length + shortTermActions.length + preventativeActions.length} time-slotted operations and foliar spraying guidance.`,
      outputSummaryTa: `விவசாயிகளுக்கான ${immediateActions.length + shortTermActions.length + preventativeActions.length} காலவரையறை செய்யப்பட்ட களப்பணிகளும் மருந்து தெளிப்பு வழிகாட்டுதலும் வெற்றிகரமாக வகுக்கப்பட்டன.`,
    },
  ];

  return { actionPlan, workflowSteps };
}
