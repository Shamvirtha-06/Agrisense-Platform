import { 
  WeatherData, 
  WeatherAnalysisResult, 
  WeatherThreatLevel, 
  WeatherExtremeIndicators, 
  ForecastThreatDay 
} from '../types';

export function analyzeWeatherIntelligence(weather: WeatherData): WeatherAnalysisResult {
  const current = weather.current;
  const daily = weather.daily;

  // 1. Extreme Indicators Detection
  const maxDayTemp = Math.max(current.temperature, ...(daily.map(d => d.tempMax) || [current.temperature]));
  const maxRain = Math.max(...(daily.map(d => d.precipitationSum) || [0]));
  const maxWind = Math.max(current.windSpeed, ...(daily.map(d => d.windSpeedMax) || [current.windSpeed]));
  const currentHumidity = current.humidity;

  const heatStress = maxDayTemp > 38.0 || current.temperature > 38.0;
  const unseasonalRain = maxRain > 40.0;
  const galeWinds = maxWind > 35.0 || current.windSpeed > 35.0;
  const excessiveHumidity = currentHumidity > 85.0;

  // Drought spell check: 3 or more consecutive days with rain < 1.0mm and tempMax > 34°C
  let consecutiveDryDays = 0;
  let maxDryRun = 0;
  for (const day of daily) {
    if (day.precipitationSum < 1.0 && day.tempMax >= 33.5) {
      consecutiveDryDays++;
      if (consecutiveDryDays > maxDryRun) maxDryRun = consecutiveDryDays;
    } else {
      consecutiveDryDays = 0;
    }
  }
  const droughtSpell = maxDryRun >= 3 && current.soilMoisture < 35;

  const indicators: WeatherExtremeIndicators = {
    heatStress,
    unseasonalRain,
    droughtSpell,
    galeWinds,
    excessiveHumidity,
  };

  // 2. Score Computation (0-100)
  let threatScore = 15; // baseline moderate low

  if (heatStress) threatScore += 25;
  if (unseasonalRain) threatScore += 35;
  if (droughtSpell) threatScore += 20;
  if (galeWinds) threatScore += 30;
  if (excessiveHumidity) threatScore += 15;

  // Cap at 100
  threatScore = Math.min(100, threatScore);

  // 3. Level Assignment
  let threatLevel: WeatherThreatLevel = 'low';
  if (threatScore >= 75) {
    threatLevel = 'severe';
  } else if (threatScore >= 50) {
    threatLevel = 'high';
  } else if (threatScore >= 30) {
    threatLevel = 'moderate';
  } else {
    threatLevel = 'low';
  }

  // 4. Diagnostic Notes Generation (Bilingual)
  const diagnosticNotesEn: string[] = [];
  const diagnosticNotesTa: string[] = [];

  if (heatStress) {
    diagnosticNotesEn.push(`Extreme heat stress warning: ambient temperature reaching ${maxDayTemp.toFixed(1)}°C accelerates moisture transpiration and leaf scorching.`);
    diagnosticNotesTa.push(`கடும் வெப்ப எச்சரிக்கை: சூழல் வெப்பநிலை ${maxDayTemp.toFixed(1)}°C வரை உயர்ந்து இலைகளிலிருந்து அதிகப்படியான நீர் ஆவியாதலை ஏற்படுத்துகிறது.`);
  }

  if (unseasonalRain) {
    diagnosticNotesEn.push(`Heavy precipitation trigger: forecast indicates daily rainfall spike up to ${maxRain.toFixed(1)}mm, posing direct root waterlogging and nutrient leaching risk.`);
    diagnosticNotesTa.push(`கனமழை எச்சரிக்கை: தினசரி மழை அளவு ${maxRain.toFixed(1)} மி.மீ வரை பதிவாக வாய்ப்புள்ளது, இது வேர் அழுகல் மற்றும் உரக் கசிவை உண்டாக்கும்.`);
  }

  if (galeWinds) {
    diagnosticNotesEn.push(`Gale force wind alert: wind gusts peaking at ${maxWind.toFixed(1)} km/h exceed mechanical lodging tolerance for tall crops.`);
    diagnosticNotesTa.push(`சூறைக்காற்று எச்சரிக்கை: காற்றின் வேகம் ${maxWind.toFixed(1)} கி.மீ/மணி வரை வீசுவதால் உயரமான பயிர்கள் சாயும் பேராபத்து உள்ளது.`);
  }

  if (droughtSpell) {
    diagnosticNotesEn.push(`Persistent drought spell: ${maxDryRun} consecutive hot-dry days with soil moisture at ${current.soilMoisture}% necessitates supplemental deficit irrigation.`);
    diagnosticNotesTa.push(`தொடர் வறட்சி எச்சரிக்கை: ${maxDryRun} நாட்கள் மழை இன்றி மண் ஈரப்பதம் ${current.soilMoisture}% ஆகக் குறைந்துள்ளதால் அவசர பாசனம் தேவை.`);
  }

  if (excessiveHumidity) {
    diagnosticNotesEn.push(`High atmospheric humidity (${currentHumidity}%) promotes aggressive fungal spore germination and aerial blight dissemination.`);
    diagnosticNotesTa.push(`காற்றின் அதிக ஈரப்பதம் (${currentHumidity}%) பூஞ்சாண வித்துக்கள் எளிதில் பரவி பயிர்களில் இலைக்கருகல் நோயை உருவாக்க வாய்ப்பளிக்கிறது.`);
  }

  if (diagnosticNotesEn.length === 0) {
    diagnosticNotesEn.push(`Fair agro-climatic conditions: current meteorological envelope is stable with temperature at ${current.temperature}°C and mild wind.`);
    diagnosticNotesTa.push(`சாதகமான வானிலை நிலவரம்: தற்போதைய சூழல் வெப்பநிலை ${current.temperature}°C ஆகவும் மிதமான காற்றுடனும் சீராக உள்ளது.`);
  }

  // 5. Daily Forecast Threat Trajectory
  const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayNamesTa = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];

  const forecastThreatDays: ForecastThreatDay[] = daily.map((day) => {
    const d = new Date(day.date);
    const dayIndex = isNaN(d.getDay()) ? 0 : d.getDay();
    let dayScore = 15;
    let dayLevel: WeatherThreatLevel = 'low';
    let reasonEn = 'Normal conditions';
    let reasonTa = 'சாதாரண நிலை';

    if (day.tempMax > 38) {
      dayScore += 30;
      reasonEn = 'Heat Stress';
      reasonTa = 'வெப்ப அழுத்தம்';
    }
    if (day.precipitationSum > 35) {
      dayScore += 45;
      reasonEn = 'Heavy Rain / Waterlogging';
      reasonTa = 'கனமழை / நீர் தேக்கம்';
    } else if (day.precipitationSum > 15) {
      dayScore += 20;
      reasonEn = 'Moderate Rain';
      reasonTa = 'மிதமான மழை';
    }
    if (day.windSpeedMax > 32) {
      dayScore += 30;
      reasonEn = 'High Wind Gusts';
      reasonTa = 'பலத்த காற்று';
    }

    dayScore = Math.min(100, dayScore);
    if (dayScore >= 70) dayLevel = 'severe';
    else if (dayScore >= 45) dayLevel = 'high';
    else if (dayScore >= 25) dayLevel = 'moderate';
    else dayLevel = 'low';

    return {
      date: day.date,
      dayNameEn: dayNamesEn[dayIndex],
      dayNameTa: dayNamesTa[dayIndex],
      level: dayLevel,
      tempMax: day.tempMax,
      rainSum: day.precipitationSum,
      windMax: day.windSpeedMax,
      reasonEn,
      reasonTa,
      score: dayScore,
    };
  });

  // Summary Strings
  const summaryEn = threatLevel === 'severe' 
    ? 'Severe weather hazard: Immediate agricultural mitigation needed across field plots.'
    : threatLevel === 'high'
    ? 'Elevated climate stress: Proactive preventive measures strongly recommended.'
    : threatLevel === 'moderate'
    ? 'Moderate microclimate variation: Monitor soil moisture and foliar disease cues.'
    : 'Benign weather envelope: Optimal conditions for standard farm operations.';

  const summaryTa = threatLevel === 'severe'
    ? 'தீவிர வானிலை ஆபத்து: உடனடி பாதுகாப்பு நடவடிக்கைகளை வயலில் மேற்கொள்ளவும்.'
    : threatLevel === 'high'
    ? 'உயர்ந்த காலநிலை அழுத்தம்: முன்னெச்சரிக்கை நடவடிக்கைகளை உடனடியாக எடுக்கவும்.'
    : threatLevel === 'moderate'
    ? 'மிதமான காலநிலை மாற்றம்: பயிர் நோய் அறிகுறிகளையும் மண் ஈரப்பதத்தையும் கண்காணிக்கவும்.'
    : 'சாதகமான வானிலை: வழக்கமான விவசாய பணிகளை தடையின்றி தொடரலாம்.';

  return {
    threatLevel,
    threatScore,
    indicators,
    summaryEn,
    summaryTa,
    diagnosticNotesEn,
    diagnosticNotesTa,
    forecastThreatDays,
  };
}
