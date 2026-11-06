import { WeatherData, CurrentWeather, DailyForecast, LocationData } from '../types';

export type WeatherScenario = 'real' | 'monsoon' | 'heatwave' | 'high_wind' | 'ideal';

// Realistic baseline meteorological data for Tamil Nadu hubs
const MOCK_BASELINES: Record<string, { temp: number; humidity: number; wind: number; rainProb: number; rainSum: number }> = {
  thanjavur: { temp: 33.5, humidity: 78, wind: 14, rainProb: 35, rainSum: 4.2 },
  coimbatore: { temp: 31.0, humidity: 65, wind: 18, rainProb: 20, rainSum: 1.5 },
  madurai: { temp: 36.2, humidity: 55, wind: 16, rainProb: 15, rainSum: 0.0 },
  tiruchirappalli: { temp: 35.8, humidity: 62, wind: 15, rainProb: 25, rainSum: 2.0 },
  salem: { temp: 34.0, humidity: 60, wind: 12, rainProb: 18, rainSum: 0.5 },
  tirunelveli: { temp: 33.8, humidity: 72, wind: 22, rainProb: 30, rainSum: 3.5 },
};

export function generateMockWeatherData(location: LocationData, scenario: WeatherScenario = 'real'): WeatherData {
  const base = MOCK_BASELINES[location.id] || { temp: 33, humidity: 70, wind: 15, rainProb: 25, rainSum: 2.0 };
  const today = new Date();
  
  let currentTemp = base.temp;
  let humidity = base.humidity;
  let windSpeed = base.wind;
  let precipProb = base.rainProb;
  let uvIndex = 8.5;
  let soilMoisture = 48; // %
  let weatherCode = 1; // Mainly clear
  
  if (scenario === 'monsoon') {
    currentTemp = 25.5;
    humidity = 94;
    windSpeed = 42;
    precipProb = 95;
    uvIndex = 2.0;
    soilMoisture = 96;
    weatherCode = 65; // Heavy rain
  } else if (scenario === 'heatwave') {
    currentTemp = 41.5;
    humidity = 38;
    windSpeed = 19;
    precipProb = 5;
    uvIndex = 11.5;
    soilMoisture = 18;
    weatherCode = 0; // Clear sky
  } else if (scenario === 'high_wind') {
    currentTemp = 29.0;
    humidity = 68;
    windSpeed = 38.5;
    precipProb = 45;
    uvIndex = 6.0;
    soilMoisture = 55;
    weatherCode = 3; // Overcast
  } else if (scenario === 'ideal') {
    currentTemp = 28.5;
    humidity = 65;
    windSpeed = 11;
    precipProb = 10;
    uvIndex = 6.5;
    soilMoisture = 60;
    weatherCode = 1;
  }

  const current: CurrentWeather = {
    temperature: currentTemp,
    apparentTemperature: Number((currentTemp + (humidity > 70 ? 3.5 : -1.0)).toFixed(1)),
    humidity,
    precipitationProbability: precipProb,
    windSpeed,
    windDirection: 140,
    uvIndex,
    soilMoisture,
    weatherCode,
    isDay: 1,
  };

  const daily: DailyForecast[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    
    let tMax = Number((currentTemp + (Math.sin(i) * 1.5)).toFixed(1));
    let tMin = Number((tMax - 8 - (Math.cos(i) * 0.8)).toFixed(1));
    let pSum = scenario === 'monsoon' ? (i === 0 ? 65 : i === 1 ? 48 : 22) : (scenario === 'heatwave' ? 0 : Math.max(0, Number((base.rainSum + (i === 2 ? 8 : 0)).toFixed(1))));
    let pProb = scenario === 'monsoon' ? Math.max(70, 95 - i * 10) : (scenario === 'heatwave' ? 5 : Math.min(80, base.rainProb + (i % 2 === 0 ? 10 : -5)));
    let wMax = scenario === 'high_wind' ? Math.max(30, 42 - i * 3) : Number((windSpeed + (i % 2 === 0 ? 3 : -2)).toFixed(1));
    let wCode = pSum > 30 ? 65 : (pSum > 10 ? 61 : (tMax > 38 ? 0 : 2));

    daily.push({
      date: dateStr,
      tempMax: tMax,
      tempMin: tMin,
      precipitationSum: pSum,
      precipitationProbability: pProb,
      windSpeedMax: wMax,
      weatherCode: wCode,
    });
  }

  return {
    current,
    daily,
    isOfflineOrFallback: scenario !== 'real',
    lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

export async function fetchWeatherData(
  location: LocationData, 
  scenario: WeatherScenario = 'real'
): Promise<WeatherData> {
  // If user selected an active scenario test mode, immediately return that simulated meteorological envelope
  if (scenario !== 'real') {
    return generateMockWeatherData(location, scenario);
  }

  const { latitude, longitude } = location;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max,weathercode&current_weather=true&hourly=relativehumidity_2m,apparent_temperature,uv_index,soil_moisture_0_to_1cm&timezone=auto`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP error: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse current weather
    const current = data.current_weather;
    const hourly = data.hourly || {};
    
    // Get latest hourly metrics matching current hour or index 0
    const humidity = hourly.relativehumidity_2m ? hourly.relativehumidity_2m[0] ?? 70 : 70;
    const apparentTemp = hourly.apparent_temperature ? hourly.apparent_temperature[0] ?? current.temperature : current.temperature + 2;
    const uv = hourly.uv_index ? Math.max(...hourly.uv_index.slice(10, 16)) : 7.5;
    
    // Soil moisture from Open-Meteo is m³/m³, convert to percentage or estimate
    let soilMoisturePercent = 45;
    if (hourly.soil_moisture_0_to_1cm && hourly.soil_moisture_0_to_1cm[0] !== undefined) {
      soilMoisturePercent = Math.min(100, Math.round(hourly.soil_moisture_0_to_1cm[0] * 200));
    } else {
      // Estimate based on recent rainfall and humidity
      const rainEstimate = data.daily?.precipitation_sum?.[0] || 0;
      soilMoisturePercent = Math.min(95, Math.max(20, Math.round(humidity * 0.5 + rainEstimate * 2)));
    }

    const dailyList: DailyForecast[] = [];
    const dailyData = data.daily;
    if (dailyData && dailyData.time) {
      for (let i = 0; i < Math.min(7, dailyData.time.length); i++) {
        dailyList.push({
          date: dailyData.time[i],
          tempMax: Number(dailyData.temperature_2m_max[i]),
          tempMin: Number(dailyData.temperature_2m_min[i]),
          precipitationSum: Number(dailyData.precipitation_sum[i] ?? 0),
          precipitationProbability: Number(dailyData.precipitation_probability_max?.[i] ?? 20),
          windSpeedMax: Number(dailyData.windspeed_10m_max[i]),
          weatherCode: Number(dailyData.weathercode?.[i] ?? 1),
        });
      }
    }

    return {
      current: {
        temperature: Number(current.temperature),
        apparentTemperature: Number(apparentTemp.toFixed(1)),
        humidity: Number(humidity),
        precipitationProbability: dailyList[0]?.precipitationProbability ?? 20,
        windSpeed: Number(current.windspeed),
        windDirection: Number(current.winddirection ?? 120),
        uvIndex: Number(uv.toFixed(1)),
        soilMoisture: soilMoisturePercent,
        weatherCode: Number(current.weathercode ?? 1),
        isDay: Number(current.is_day ?? 1),
      },
      daily: dailyList,
      isOfflineOrFallback: false,
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (err) {
    console.warn('Weather API fetch failed or offline, switching smoothly to mock meteorological fallback:', err);
    return generateMockWeatherData(location, 'real');
  }
}
