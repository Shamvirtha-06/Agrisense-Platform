import { 
  CropId, 
  GrowthStageId, 
  WeatherAnalysisResult, 
  CropVulnerabilityAnalysis, 
  BiologicalRiskScores, 
  WeatherData 
} from '../types';
import { CROPS_DATABASE } from '../utils/cropDatabase';

export function evaluateCropAdvisor(
  cropId: CropId,
  stageId: GrowthStageId,
  weatherAnalysis: WeatherAnalysisResult,
  weather: WeatherData
): CropVulnerabilityAnalysis {
  const cropConfig = CROPS_DATABASE[cropId];
  const stageConfig = cropConfig.stages[stageId];
  const current = weather.current;
  const indicators = weatherAnalysis.indicators;

  // 1. Compute Pest & Disease Risk Score (0-100)
  let pestScore = 20; // baseline
  if (current.humidity >= cropConfig.humidityBlastVulnerability) {
    pestScore += 35; // major fungal spore humidity trigger
  } else if (current.humidity > 70) {
    pestScore += 15;
  }
  if (current.temperature >= 26 && current.temperature <= 33) {
    pestScore += 15; // optimal insect reproduction temperature bracket
  }
  if (indicators.unseasonalRain) {
    pestScore += 20; // splash dispersal of bacterial/fungal pathogens
  }
  pestScore = Math.min(100, Math.max(10, pestScore));

  // 2. Compute Water Stress Risk Score (0-100)
  let waterStressScore = 15;
  if (indicators.droughtSpell) {
    waterStressScore += 45;
  }
  if (indicators.heatStress) {
    waterStressScore += 30;
  }
  if (current.soilMoisture < 30) {
    waterStressScore += 25;
  } else if (current.soilMoisture > 85 && indicators.unseasonalRain) {
    waterStressScore += 40; // Hypoxia / root suffocation stress
  }
  waterStressScore = Math.min(100, Math.max(10, waterStressScore));

  // 3. Compute Mechanical Damage Risk Score (0-100)
  let mechanicalScore = 10;
  const currentMaxWind = Math.max(current.windSpeed, ...(weather.daily.map(d => d.windSpeedMax) || [0]));
  
  if (currentMaxWind >= cropConfig.criticalWindThreshold) {
    mechanicalScore += 50;
    if (cropId === 'banana' || cropId === 'sugarcane' || cropId === 'maize') {
      mechanicalScore += 25; // tall canopy crops extra prone to stem breakage / lodging
    }
  } else if (currentMaxWind >= 24) {
    mechanicalScore += 25;
  }
  if (stageId === 'flowering' || stageId === 'harvest') {
    mechanicalScore += 15; // heavy fruit/cobs make plants top-heavy
  }
  mechanicalScore = Math.min(100, Math.max(5, mechanicalScore));

  // 4. Overall Crop Risk (Weighted average)
  const overallRisk = Math.min(100, Math.round(
    pestScore * 0.4 + waterStressScore * 0.35 + mechanicalScore * 0.25
  ));

  const biologicalRiskScores: BiologicalRiskScores = {
    pestAndDiseaseRisk: pestScore,
    waterStressRisk: waterStressScore,
    mechanicalDamageRisk: mechanicalScore,
    overallCropRisk: overallRisk,
  };

  // 5. Crop-Specific Vulnerability Notes (Bilingual)
  const vulnerabilitiesEn: string[] = [];
  const vulnerabilitiesTa: string[] = [];

  // Specific rule-based matches:
  if (cropId === 'paddy') {
    if (stageId === 'flowering') {
      if (current.humidity >= 82) {
        vulnerabilitiesEn.push('Paddy Panicle Blast & Neck Rot Threat: Atmospheric humidity >82% with night dew triggers Pyricularia fungal blast on emerging panicles.');
        vulnerabilitiesTa.push('நெல் கழுத்துக்கருகல் நோய் அபாயம்: காற்றில் 82%க்கு மேல் உள்ள ஈரப்பதம் மற்றும் பனிப்பொழிவு கதிர்களில் பூஞ்சாணக் கருகலைத் தீவிரப்படுத்தும்.');
      }
      if (current.temperature > 36) {
        vulnerabilitiesEn.push('Heat Spikelet Sterility: Ambient temperature above 36°C desicates pollen grains, leading to chaffy, unfilled grains (Savvi).');
        vulnerabilitiesTa.push('வெப்பத்தினால் மணி பிடிக்காமை: 36°Cக்கு மேல் வெப்பம் நிலவினால் மகரந்தம் காய்ந்து நெல்மணிகள் சாவியாக மாறும்.');
      }
    } else if (stageId === 'vegetative') {
      if (indicators.unseasonalRain || current.humidity > 80) {
        vulnerabilitiesEn.push('Yellow Stem Borer & Leaf Folder: Cloudy skies and humidity foster caterpillar larval tunneling in tillers.');
        vulnerabilitiesTa.push('மஞ்சள் குருத்துப்பூச்சி & இலைசுருட்டுப்புழு: மேகமூட்டமும் ஈரப்பதமும் இளம் தூர்களில் புழுக்கள் துளையிட ஏதுவான சூழலை உருவாக்குகிறது.');
      }
    } else if (stageId === 'harvest' && (indicators.unseasonalRain || current.precipitationProbability > 40)) {
      vulnerabilitiesEn.push('Earhead Sprouting & Grain Shattering: Rainfall on mature standing crop will trigger viviparous grain germination.');
      vulnerabilitiesTa.push('கதிரிலேயே நெல் முளைத்தல்: அறுவடைக்குத் தயாராக உள்ள பயிரில் மழைநீர் தேங்கினால் கதிரிலேயே நெல் முளைத்துவிடும்.');
    }
  } else if (cropId === 'cotton') {
    if (indicators.unseasonalRain || current.soilMoisture > 80) {
      vulnerabilitiesEn.push('Root Waterlogging & Boll Rot: Cotton taproot is intolerant of water stagnation exceeding 24 hours, inducing leaf reddening and square drop.');
      vulnerabilitiesTa.push('வேர் அழுகல் & காய் அழுகல்: பருத்தி செடியின் ஆணிவேர் 24 மணி நேரத்திற்கு மேல் நீர் தேங்கினால் அழுகி இலைகள் சிவந்து உதிரும்.');
    }
    if (stageId === 'vegetative' || stageId === 'flowering') {
      vulnerabilitiesEn.push('Sucking Pest Surge (Whitefly/Thrips): Warm, humid conditions accelerate whitefly population multiplication.');
      vulnerabilitiesTa.push('சாறு உறிஞ்சும் பூச்சிகள் (வெள்ளை ஈ/இலைப்பேன்): வெப்பமும் ஈரப்பதமும் கூடும்போது வெள்ளை ஈக்கள் அதிகளவில் பெருகும்.');
    }
  } else if (cropId === 'banana') {
    if (currentMaxWind >= 26) {
      vulnerabilitiesEn.push('Severe Pseudostem Lodging Danger: Bananas bearing emerging or maturing bunches face catastrophic uprooting in winds over 26 km/h.');
      vulnerabilitiesTa.push('மரம் சாய்ந்து முறியும் ஆபத்து: பலத்த காற்று வீசும்போது கனமான தார் கொண்ட வாழை மரங்கள் அடியோடு சாய்ந்து முறிந்துவிடும்.');
    }
    if (current.humidity >= 85) {
      vulnerabilitiesEn.push('Sigatoka Leaf Spot (Black Streak): High humidity accelerates Mycosphaerella fungal lesions across broad leaves.');
      vulnerabilitiesTa.push('சிகடோகா இலைப்புள்ளி நோய்: அதிக ஈரப்பதத்தால் இலைகளில் கரும் புள்ளிகள் தோன்றி ஒளிச்சேர்க்கையைப் பாதிக்கும்.');
    }
  } else if (cropId === 'groundnut') {
    if (stageId === 'flowering' && indicators.droughtSpell) {
      vulnerabilitiesEn.push('Hard Soil Peg Entry Impediment: Dry hardpan soil stops gynophores (pegs) from penetrating underground for pod development.');
      vulnerabilitiesTa.push('விழுதுகள் நிலத்தில் இறங்குவதில் தடை: நிலம் வறண்டு இறுகினால் விழுதுகள் பூமிக்குள் இறங்கி காயாக மாற முடியாது.');
    }
    if (current.humidity >= 80) {
      vulnerabilitiesEn.push('Tikka Leaf Spot (Cercospora): Leaf spotting risk is heightened, causing premature defoliation.');
      vulnerabilitiesTa.push('திக்கா இலைப்புள்ளி நோய்: இலைகளில் வட்டப் புள்ளிகள் தோன்றி இலைகள் முன்கூட்டியே உதிரும் அபாயம்.');
    }
  } else if (cropId === 'tomato') {
    if (current.humidity >= 80 || indicators.unseasonalRain) {
      vulnerabilitiesEn.push('Early & Late Blight (Phytophthora / Alternaria): Rain splash and leaves remaining wet for >6 hours cause rapid leaf and stem blackening.');
      vulnerabilitiesTa.push('தக்காளி இலைக்கருகல் நோய்: மழைத்துளிகள் மற்றும் இலைகளில் 6 மணி நேரத்திற்கு மேல் நீர் நிற்பது கருகல் நோயை மிக வேகமாகப் பரப்பும்.');
    }
    if (current.temperature > 35 && stageId === 'flowering') {
      vulnerabilitiesEn.push('Blossom Drop & Poor Fruit Set: Heat stress >35°C aborts tomato flower clusters.');
      vulnerabilitiesTa.push('பூ உதிர்தல்: 35°Cக்கு மேல் நிலவும் வெப்பம் தக்காளி பூங்கொத்துகளை உதிரச் செய்யும்.');
    }
  } else if (cropId === 'maize') {
    if (stageId === 'vegetative') {
      vulnerabilitiesEn.push('Fall Armyworm (Spodoptera frugiperda) Alert: Warm weather fuels destructive whorl-feeding caterpillar infestation.');
      vulnerabilitiesTa.push('படைப்புழுவின் தீவிர தாக்குதல்: வெதுவெதுப்பான சூழல் பயிரின் குருத்துப் பகுதியை தின்று தீர்க்கும் படைப்புழுவை ஊக்குவிக்கும்.');
    }
    if (stageId === 'flowering' && indicators.droughtSpell) {
      vulnerabilitiesEn.push('Silking Moisture Stress: Moisture deficit during pollen shedding causes unfilled barren cobs.');
      vulnerabilitiesTa.push('மஞ்சரி வறட்சி அழுத்தம்: பூக்கும் தருணத்தில் தண்ணீர் பற்றாக்குறை ஏற்பட்டால் கதிரில் மணிகள் உருவாகாது.');
    }
  } else if (cropId === 'sugarcane') {
    if (currentMaxWind >= 32) {
      vulnerabilitiesEn.push('Stalk Lodging: Tall canes risk bending and lodging, leading to rodent harboring and stalk breakage.');
      vulnerabilitiesTa.push('கரும்பு சாய்வு ஆபத்து: வேகமான காற்று கரும்பை நிலத்தில் சாய்த்து எலி சேதத்தையும் மகசூல் இழப்பையும் உருவாக்கும்.');
    }
  } else if (cropId === 'finger_millet') {
    if (current.humidity >= 80) {
      vulnerabilitiesEn.push('Ragi Blast (Pyricularia grisea): Finger and neck blast infection risk is elevated under humid overcast skies.');
      vulnerabilitiesTa.push('கேழ்வரகு விரல் மற்றும் கழுத்துக்கருகல்: மேகமூட்டமும் ஈரப்பதமும் கதிர்களைக் கருக்கி மகசூலைப் பாதிக்கும்.');
    }
  }

  // Fallback if no specific condition triggered
  if (vulnerabilitiesEn.length === 0) {
    vulnerabilitiesEn.push(`${cropConfig.nameEn} at ${stageConfig.nameEn}: Agronomic parameters currently within safe operational resilience thresholds.`);
    vulnerabilitiesTa.push(`${cropConfig.nameTa} (${stageConfig.nameTa}): தற்போதைய சூழல் பயிரின் இயல்பான தாங்கும் திறனுக்குள் உள்ளது.`);
  }

  // 6. Physiological Impact & Nutrient Needs
  let physiologicalImpactEn = '';
  let physiologicalImpactTa = '';
  let keyNutrientNeedsEn = '';
  let keyNutrientNeedsTa = '';

  if (indicators.heatStress) {
    physiologicalImpactEn = 'Elevated stomatal closure observed. Cellular transpiration deficit may trigger leaf wilting during peak solar irradiance (12:00 PM - 03:00 PM).';
    physiologicalImpactTa = 'இலைத்துளைகள் மூடிக்கொள்வதால் நண்பகல் வேளையில் இலைகள் வாடி சுருங்கும் வாய்ப்புள்ளது.';
    keyNutrientNeedsEn = 'Apply Potassium (K) supplement (e.g. 1% MOP or SOP foliar) to regulate stomatal conductance and osmoprotection.';
    keyNutrientNeedsTa = 'வறட்சியைத் தாங்க பொட்டாஷ் (1% MOP அல்லது SOP) தெளித்து இலைகளின் நீர் சமநிலையைப் பாதுகாக்கவும்.';
  } else if (indicators.unseasonalRain) {
    physiologicalImpactEn = 'Rhizosphere saturated. Anaerobic root zone reduces nitrogen uptake and promotes secondary rootlet rot.';
    physiologicalImpactTa = 'மண்ணில் நீர் முழுமையாக நிரம்புவதால் வேர்களுக்குக் காற்று கிடைக்காமல் தழைச்சத்து எடுப்பது பாதிக்கப்படும்.';
    keyNutrientNeedsEn = 'Withhold urea top-dressing until standing water drains out to avoid nitrate leaching; apply booster Zinc sulphate later.';
    keyNutrientNeedsTa = 'தேங்கிய நீர் வடியும் வரை யூரியா இட வேண்டாம்; பின்னர் துத்தநாக சல்பேட் நுண்ணூட்டம் அளிக்கவும்.';
  } else {
    physiologicalImpactEn = 'Metabolic assimilation and photosynthetic rate operating at balanced agronomic baseline.';
    physiologicalImpactTa = 'பயிரின் வளர்ச்சி மற்றும் ஒளிச்சேர்க்கை சீரான நல்ல நிலையில் இயங்கி வருகிறது.';
    keyNutrientNeedsEn = 'Proceed with scheduled split application of N:P:K tailored to current phenological stage.';
    keyNutrientNeedsTa = 'பயிரின் வளர்ச்சிப் பருவத்திற்கு ஏற்ற பரிந்துரைக்கப்பட்ட தழை, மணி, சாம்பல் சத்துக்களை வழக்கம் போல் இடலாம்.';
  }

  return {
    cropId,
    stageId,
    biologicalRiskScores,
    vulnerabilitiesEn,
    vulnerabilitiesTa,
    physiologicalImpactEn,
    physiologicalImpactTa,
    keyNutrientNeedsEn,
    keyNutrientNeedsTa,
  };
}
