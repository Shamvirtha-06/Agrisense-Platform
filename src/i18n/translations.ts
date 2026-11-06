export const translations = {
  en: {
    appTitle: 'AgriSense',
    appSubtitle: 'Climate & Crop Advisory Platform',
    liveStatus: 'Live Advisory Active',
    offlineMode: 'Offline / Mock Meteorological Mode',
    tamilNaduAgriNetwork: 'Tamil Nadu Agro-Climatic Intelligence',
    
    // Header & Navigation
    changeLanguage: 'தமிழ்',
    currentLanguageName: 'English',
    currentDate: 'Advisory Date',
    printReport: 'Print / Save PDF Report',
    viewReasoningWorkflow: 'Agent Reasoning Workflow',
    scenarioSimulator: 'Simulate Weather Scenario',
    
    // Location Selector
    locationTitle: 'Agro-Climatic Zone & Location',
    autoDetectGps: 'Detect GPS Location',
    gpsLocating: 'Acquiring GPS coordinates...',
    gpsSuccess: 'GPS Location detected',
    gpsFailed: 'GPS unavailable, defaulted to Hub',
    selectHub: 'Select Agricultural Hub',
    latitude: 'Latitude',
    longitude: 'Longitude',
    
    // Crop Selector
    cropSectionTitle: 'Crop & Phenological Growth Stage',
    cropSectionSubtitle: 'Select your current crop and phenological phase for biological risk evaluation',
    selectedCrop: 'Selected Crop',
    growthStage: 'Current Growth Stage',
    stageSowing: 'Sowing / Nursery',
    stageVegetative: 'Vegetative',
    stageFlowering: 'Flowering / Grain Filling',
    stageHarvest: 'Harvest Ready',
    durationEst: 'Stage duration approx.',
    waterNeed: 'Water Need',
    criticalThreatFocus: 'Critical Vulnerability Focus',
    
    // Crops
    crop_paddy: 'Paddy',
    crop_cotton: 'Cotton',
    crop_sugarcane: 'Sugarcane',
    crop_banana: 'Banana',
    crop_groundnut: 'Groundnut',
    crop_tomato: 'Tomato',
    crop_maize: 'Maize',
    crop_finger_millet: 'Finger Millet',
    
    // Weather Card
    weatherTitle: 'Live Weather Snapshot & 7-Day Forecast',
    weatherSubtitle: 'Sourced via Open-Meteo meteorological telemetry',
    temperature: 'Temperature',
    feelsLike: 'Feels Like',
    humidity: 'Relative Humidity',
    precipProb: 'Rain Probability',
    windSpeed: 'Wind Speed',
    uvIndex: 'UV Index',
    soilMoisture: 'Soil Moisture Index',
    lastSync: 'Telemetry Last Updated',
    forecast7Day: '7-Day Climate Projection',
    day: 'Day',
    maxMin: 'Max / Min',
    rain: 'Rain',
    wind: 'Wind',
    
    // Threat Indicators
    weatherThreatTitle: 'Weather Threat Diagnostic',
    threatLevel: 'Weather Threat Level',
    threat_low: 'Low Risk (Green)',
    threat_moderate: 'Moderate Risk (Yellow)',
    threat_high: 'High Risk (Orange)',
    threat_severe: 'Severe Risk (Red)',
    
    extremeIndicatorsTitle: 'Active Extreme Meteorological Triggers',
    heatStressTrigger: 'Heat Stress Alert (>38°C)',
    heavyRainTrigger: 'Unseasonal Deluge Alert (>40mm/day)',
    droughtSpellTrigger: 'Drought & Heat Evaporation Spell',
    galeWindTrigger: 'Gale Winds Risk (>35 km/h)',
    highHumidityTrigger: 'Fungal Spore Humidity (>85%)',
    noExtremeAlerts: 'No critical meteorological threshold breaches detected.',
    
    // Crop Advisor
    cropAdvisorTitle: 'Crop Biological Risk Evaluation',
    cropAdvisorSubtitle: 'Cross-referencing crop physiology with meteorological stress parameters',
    biologicalRisks: 'Biological Vulnerability Scores',
    pestDiseaseRisk: 'Pest & Pathogen Risk',
    waterStressRisk: 'Water / Drought Stress',
    mechanicalDamageRisk: 'Mechanical & Lodging Risk',
    overallCropThreat: 'Overall Agronomic Stress',
    
    keyPestsToMonitor: 'High Priority Pests & Pathogens to Monitor',
    physiologicalImpact: 'Physiological Stress Forecast',
    nutrientAdvisory: 'Nutrient & Soil Condition Advisory',
    
    // Action Planner
    actionPlannerTitle: 'Prioritized Action Plan',
    actionPlannerSubtitle: 'Autonomous multi-agent synthesized recommendations for farm operators',
    
    spraySafetyTitle: 'Foliar Spraying Safety Window',
    spraySafeBadge: 'Foliar Spraying SAFE',
    sprayCautionBadge: 'Spray With Caution',
    sprayUnsafeBadge: 'DO NOT SPRAY TODAY',
    sprayOptimalWindow: 'Optimal Window',
    sprayWindowHours: '06:30 AM – 09:30 AM (Low Wind & Moderate Humidity)',
    sprayWarningReason: 'Spray alert',
    
    immediateActionsTitle: 'Immediate Interventions (Next 24 Hours)',
    immediateSubtitle: 'Urgent actions required to prevent crop loss or input wastage',
    shortTermActionsTitle: 'Short-Term Farm Management (Next 2–4 Days)',
    shortTermSubtitle: 'Fertigation, nutrition top-dressing, and soil aeration schedule',
    preventativeActionsTitle: 'Preventative & Protective Measures',
    preventativeSubtitle: 'Physical staking, biological traps, and soil preservation',
    
    markDone: 'Mark as Completed',
    taskDone: 'Completed',
    urgency_immediate: 'Immediate (24h)',
    urgency_short_term: 'Short-Term (2-4d)',
    urgency_preventative: 'Preventative',
    
    // Risk Report & Meter
    riskReportTitle: 'Agro-Climate Risk Report & Timeline',
    riskMeterTitle: 'Composite Risk Meter',
    riskIndex: 'Composite Risk Index',
    sevenDayRiskTimeline: '7-Day Threat Timeline & Daily Trajectory',
    dailyRiskProjection: 'Daily Threat Index & Trigger Factors',
    downloadPdfNotice: 'Standardized printable advisory docket for field extension officers and farmers',
    
    // Reasoning Modal
    agentWorkflowTitle: 'Autonomous Multi-Agent Reasoning Architecture',
    agentWorkflowSubtitle: 'Transparency pipeline demonstrating how meteorological signals and biological matrices synthesize into operational field actions.',
    step1Title: 'Agent 01: Weather Intelligence Agent',
    step1Desc: 'Extracts real-time telemetry, scans for threshold breaches (>38°C, >40mm rain, >35km/h wind), and compiles atmospheric threat vectors.',
    step2Title: 'Agent 02: Crop Biological Advisor Agent',
    step2Desc: 'Intersects weather data with crop phenological stage, computes physiological vulnerabilities and pathogen incubation indices.',
    step3Title: 'Agent 03: Operational Action Planner Agent',
    step3Desc: 'Reconciles risk vectors, determines spray safety windows, prioritizes field tasks into 24h urgent vs preventative batches.',
    agentInputs: 'Agent Inputs',
    agentReasoning: 'Reasoning Trajectory',
    agentOutputs: 'Synthesized Outputs',
    closeWorkflow: 'Close Workflow Inspector',
    
    // Print View
    reportHeader: 'AgriSense Official Field Advisory Docket',
    farmerDetails: 'Farmer & Farm Details',
    farmerName: 'Farmer Name: K. Murugan (Ration/Kisan ID: TN-AGR-8842)',
    farmLocation: 'Village / Field: Block 4, Delta Ag-Grid',
    verifiedAgronomist: 'Validated by TNAU Agrometeorological Advisory Cell',
    printedOn: 'Generated On',
    qrCodeText: 'Scan for Real-Time Updated Field Advisory',
    
    // Scenario Simulator
    scenarioTitle: 'Climate Scenario Simulator',
    scenarioSubtitle: 'Quickly test how AgriSense agents react to varying climate hazards',
    scenarioReal: 'Live Real-time Telemetry',
    scenarioMonsoon: 'Simulate Cyclone / Monsoon Deluge (75mm rain, 42km/h gale)',
    scenarioHeatwave: 'Simulate Severe Heatwave (41.5°C, high evaporation)',
    scenarioHighWind: 'Simulate Gale Winds (38km/h, lodging threat)',
    scenarioIdeal: 'Simulate Ideal Growing Weather (28°C, light breeze)',
    
    // Miscellaneous
    refreshTelemetry: 'Refresh Weather',
    refreshing: 'Updating...',
    poweredBy: 'AgriSense Autonomous Agricultural Intelligence • Powered by Open-Meteo & TNAU agronomic parameters',
  },
  
  ta: {
    appTitle: 'அக்ரிசென்ஸ் (AgriSense)',
    appSubtitle: 'வானிலை & பயிர் ஆலோசனை வழிகாட்டி தளம்',
    liveStatus: 'நேரலை ஆலோசனை செயல்பாட்டில் உள்ளது',
    offlineMode: 'இணைப்பற்ற / மாதிரி வானிலை முறை',
    tamilNaduAgriNetwork: 'தமிழ்நாடு வேளாண்-காலநிலை நுண்ணறிவு மையம்',
    
    // Header & Navigation
    changeLanguage: 'English',
    currentLanguageName: 'தமிழ்',
    currentDate: 'ஆலோசனை நாள்',
    printReport: 'அறிக்கை அச்சிடு / PDF சேமி',
    viewReasoningWorkflow: 'செயற்கை நுண்ணறிவு பகுப்பாய்வு பாதை',
    scenarioSimulator: 'வானிலை சூழ்நிலையை சோதிக்க',
    
    // Location Selector
    locationTitle: 'வேளாண் காலநிலை மண்டலம் & இருப்பிடம்',
    autoDetectGps: 'GPS இருப்பிடத்தைக் கண்டறி',
    gpsLocating: 'GPS இருப்பிடத்தைத் தேடுகிறது...',
    gpsSuccess: 'தங்கள் இருப்பிடம் கண்டறியப்பட்டது',
    gpsFailed: 'GPS கிடைக்கவில்லை, முதன்மை மையம் தேர்ந்தெடுக்கப்பட்டது',
    selectHub: 'வேளாண் மையத்தைத் தேர்ந்தெடுக்கவும்',
    latitude: 'அட்சரேகை (Lat)',
    longitude: 'தீர்க்கரேகை (Lon)',
    
    // Crop Selector
    cropSectionTitle: 'பயிர் & தற்போதைய வளர்ச்சிப் பருவம்',
    cropSectionSubtitle: 'உயிரியல் அபாயங்களைக் கணக்கிட உங்கள் பயிரையும் அதன் வளர்ச்சி நிலையையும் தேர்வு செய்யவும்',
    selectedCrop: 'தேர்ந்தெடுக்கப்பட்ட பயிர்',
    growthStage: 'வளர்ச்சிப் பருவம்',
    stageSowing: 'நாற்றங்கால் / விதைப்பு',
    stageVegetative: 'வளர்ச்சி / தூர்கட்டுதல்',
    stageFlowering: 'பூக்கும் / கதிர் வரும் பருவம்',
    stageHarvest: 'அறுவடைக்குத் தயார்',
    durationEst: 'பருவக் கால அளவு தோராயமாக',
    waterNeed: 'நீர்த் தேவை',
    criticalThreatFocus: 'முக்கிய பாதிப்பு அபாயம்',
    
    // Crops
    crop_paddy: 'நெல்',
    crop_cotton: 'பருத்தி',
    crop_sugarcane: 'கரும்பு',
    crop_banana: 'வாழை',
    crop_groundnut: 'நிலக்கடலை',
    crop_tomato: 'தக்காளி',
    crop_maize: 'மக்காச்சோளம்',
    crop_finger_millet: 'கேழ்வரகு (ராகி)',
    
    // Weather Card
    weatherTitle: 'நேரலை வானிலை நிலவரம் & 7 நாள் முன்னறிவிப்பு',
    weatherSubtitle: 'ஓபன்-மீட்டியோ (Open-Meteo) வானிலை செயற்கைக்கோள் தரவு',
    temperature: 'வெப்பநிலை',
    feelsLike: 'உணரப்படும் வெப்பம்',
    humidity: 'காற்றின் ஈரப்பதம்',
    precipProb: 'மழை வாய்ப்பு',
    windSpeed: 'காற்றின் வேகம்',
    uvIndex: 'புற ஊதாக் கதிர் (UV)',
    soilMoisture: 'மண் ஈரப்பதக் குறியீடு',
    lastSync: 'வானிலை புதுப்பிக்கப்பட்ட நேரம்',
    forecast7Day: '7 நாள் வானிலை முன்னறிவிப்பு',
    day: 'நாள்',
    maxMin: 'அதிகபட்ச / குறைந்தபட்ச',
    rain: 'மழை அளவு',
    wind: 'காற்று வேகம்',
    
    // Threat Indicators
    weatherThreatTitle: 'வானிலை அச்சுறுத்தல் பகுப்பாய்வு',
    threatLevel: 'வானிலை அச்சுறுத்தல் நிலை',
    threat_low: 'குறைந்த அபாயம் (பச்சை)',
    threat_moderate: 'மிதமான அபாயம் (மஞ்சள்)',
    threat_high: 'அதிக அபாயம் (ஆரஞ்சு)',
    threat_severe: 'தீவிர அபாயம் (சிவப்பு)',
    
    extremeIndicatorsTitle: 'தீவிர வானிலை எச்சரிக்கை அறிகுறிகள்',
    heatStressTrigger: 'கடும் வெப்ப அலை எச்சரிக்கை (>38°C)',
    heavyRainTrigger: 'பருவமற்ற கனமழை எச்சரிக்கை (>40 மி.மீ/நாள்)',
    droughtSpellTrigger: 'வறட்சி மற்றும் தீவிர நீர் ஆவியாதல்',
    galeWindTrigger: 'சூறாவளிக் காற்று அபாயம் (>35 கி.மீ/மணி)',
    highHumidityTrigger: 'பூஞ்சாண வித்து பரவும் ஈரப்பதம் (>85%)',
    noExtremeAlerts: 'தீவிர வானிலை அச்சுறுத்தல்கள் ஏதுமில்லை.',
    
    // Crop Advisor
    cropAdvisorTitle: 'பயிர் உயிரியல் பாதிப்பு மதிப்பீடு',
    cropAdvisorSubtitle: 'பயிரின் உடலியல் நிலையுடன் வானிலை அழுத்தங்களை ஒப்பிட்டு கணக்கிடுதல்',
    biologicalRisks: 'உயிரியல் பாதிப்பு மதிப்பெண்கள்',
    pestDiseaseRisk: 'பூச்சி மற்றும் நோய் அபாயம்',
    waterStressRisk: 'நீர் / வறட்சி அழுத்தம்',
    mechanicalDamageRisk: 'காற்று & சாய்வு சேத அபாயம்',
    overallCropThreat: 'ஒட்டுமொத்த பயிர் பாதுகாப்பு அழுத்தம்',
    
    keyPestsToMonitor: 'கண்காணிக்க வேண்டிய முக்கிய பூச்சிகள் & நோய்கள்',
    physiologicalImpact: 'பயிர் உடலியல் தாக்கம்',
    nutrientAdvisory: 'ஊட்டச்சத்து & மண் மேலாண்மை ஆலோசனை',
    
    // Action Planner
    actionPlannerTitle: 'முன்னுரிமை அடிப்படையிலான விவசாய செயல் திட்டம்',
    actionPlannerSubtitle: 'செயற்கை நுண்ணறிவு முகவர்கள் ஒருங்கிணைத்து வழங்கும் களப் பணிகள்',
    
    spraySafetyTitle: 'மருந்து தெளிப்பு பாதுகாப்பு நேரம்',
    spraySafeBadge: 'மருந்து தெளிக்க உகந்த நேரம்',
    sprayCautionBadge: 'கவனத்துடன் தெளிக்கவும்',
    sprayUnsafeBadge: 'இன்று மருந்து தெளிக்க வேண்டாம்!',
    sprayOptimalWindow: 'உகந்த தெளிப்பு நேரம்',
    sprayWindowHours: 'காலை 06:30 – 09:30 மணிக்குள் (குறைந்த காற்று & தகுந்த ஈரப்பதம்)',
    sprayWarningReason: 'தெளிப்பு எச்சரிக்கை',
    
    immediateActionsTitle: 'உடனடி களப் பணிகள் (அடுத்த 24 மணி நேரத்திற்குள்)',
    immediateSubtitle: 'பயிர் சேதம் மற்றும் உரம்/மருந்து வீணாவதைத் தடுக்க அவசரப் பணிகள்',
    shortTermActionsTitle: 'குறுகிய கால மேலாண்மை (அடுத்த 2–4 நாட்கள்)',
    shortTermSubtitle: 'மேலுரம் இடுதல், நுண்ணீர்ப்பாசனம் மற்றும் களையெடுப்பு அட்டவணை',
    preventativeActionsTitle: 'முன்னெச்சரிக்கை & பாதுகாப்பு நடவடிக்கைகள்',
    preventativeSubtitle: 'முட்டுக்கொடுத்தல், இனக்கவர்ச்சிப் பொறிகள், தழைக்கூளம் அமைத்தல்',
    
    markDone: 'செய்து முடித்ததாகக் குறிக்கவும்',
    taskDone: 'முடிக்கப்பட்டது',
    urgency_immediate: 'உடனடி (24 மணி)',
    urgency_short_term: '2–4 நாட்களில்',
    urgency_preventative: 'முன்னெச்சரிக்கை',
    
    // Risk Report & Meter
    riskReportTitle: 'விவசாய இடர் அறிக்கை & காலவரிசை',
    riskMeterTitle: 'ஒட்டுமொத்த அபாய அளவீட்டு மீட்டர்',
    riskIndex: 'ஒருங்கிணைந்த அபாயக் குறியீடு',
    sevenDayRiskTimeline: '7 நாள் அபாயக் காலவரிசை வரைபடம்',
    dailyRiskProjection: 'தினசரி பாதிப்பு அளவீடு & காரணிகள்',
    downloadPdfNotice: 'விவசாயிகள் மற்றும் கள அதிகாரிகளுக்கான தரப்படுத்தப்பட்ட அச்சு அறிக்கை',
    
    // Reasoning Modal
    agentWorkflowTitle: 'தன்னாட்சி முகவர்களின் கூட்டுப் பகுப்பாய்வு முறைமை',
    agentWorkflowSubtitle: 'வானிலை சமிக்கைகளும் பயிர் உடலியலும் எவ்வாறு களப் பணிகளாக மாறுகின்றன என்பதன் வெளிப்படையான காட்சி.',
    step1Title: 'முகவர் 01: வானிலை நுண்ணறிவு முகவர்',
    step1Desc: 'வானிலை அளவீடுகளைப் பெற்று, தீவிர வரம்புகள் (>38°C, >40 மி.மீ மழை, >35 கி.மீ காற்று) மீறப்பட்டுள்ளனவா எனப் பகுப்பாய்வு செய்கிறது.',
    step2Title: 'முகவர் 02: பயிர் உயிரியல் ஆலோசகர் முகவர்',
    step2Desc: 'பயிரின் தற்போதைய வளர்ச்சிப் பருவத்தை வானிலையுடன் ஒப்பிட்டு, நோய்த் தொற்று மற்றும் சாய்வு அபாயங்களைக் கணக்கிடுகிறது.',
    step3Title: 'முகவர் 03: களச் செயல் திட்ட முகவர்',
    step3Desc: 'அனைத்து அபாயங்களையும் சீர்தூக்கிப் பார்த்து, மருந்து தெளிப்பு நேரம் மற்றும் அவசர களப்பணிகளை 24 மணி நேர அடிப்படையில் வகுக்கிறது.',
    agentInputs: 'முகவர் பெற்ற உள்ளீடுகள்',
    agentReasoning: 'பகுப்பாய்வு சிந்தனைச் சங்கிலி',
    agentOutputs: 'ஒருங்கிணைக்கப்பட்ட முடிவுகள்',
    closeWorkflow: 'பகுப்பாய்வு பலகத்தை மூடுக',
    
    // Print View
    reportHeader: 'அக்ரிசென்ஸ் அதிகாரப்பூர்வ கள ஆலோசனை ஆவணம்',
    farmerDetails: 'விவசாயி மற்றும் நில விபரங்கள்',
    farmerName: 'விவசாயி பெயர்: கே. முருகன் (விவசாயி அட்டை எண்: TN-AGR-8842)',
    farmLocation: 'கிராமம் / வயல்: பகுதி 4, காவிரி பாசனப் பகுதி',
    verifiedAgronomist: 'தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழக பரிந்துரைகளின்படி சரிபார்க்கப்பட்டது',
    printedOn: 'உருவாக்கப்பட்ட தேதி',
    qrCodeText: 'நேரலை கள ஆலோசனையைப் பெற QR குறியீட்டை ஸ்கேன் செய்யவும்',
    
    // Scenario Simulator
    scenarioTitle: 'வானிலை உருவகப்படுத்துதல் கருவி',
    scenarioSubtitle: 'மாறுபட்ட தீவிர வானிலையில் முகவர்கள் எவ்வாறு முடிவெடுக்கிறார்கள் என்பதை உடனே சோதிக்கவும்',
    scenarioReal: 'நேரலை வானிலை அளவீடு',
    scenarioMonsoon: 'சூறாவளி / கனமழை மாதிரி (75 மி.மீ மழை, 42 கி.மீ காற்று)',
    scenarioHeatwave: 'கடும் வெப்ப அலை மாதிரி (41.5°C வெப்பநிலை, வறட்சி)',
    scenarioHighWind: 'சூறைக்காற்று மாதிரி (38 கி.மீ/மணி காற்று, பயிர் சாய்வு அபாயம்)',
    scenarioIdeal: 'சாதகமான மிதமான வானிலை (28°C, மெல்லிய காற்று)',
    
    // Miscellaneous
    refreshTelemetry: 'வானிலையைப் புதுப்பி',
    refreshing: 'புதுப்பிக்கப்படுகிறது...',
    poweredBy: 'அக்ரிசென்ஸ் தன்னாட்சி வேளாண் நுண்ணறிவு தளம் • ஓபன்-மீட்டியோ மற்றும் தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழக வழிகாட்டுதல்',
  }
} as const;

export type TranslationKey = keyof typeof translations.en;
