import { CROPS_DATABASE, TAMIL_NADU_HUBS } from './cropDatabase.ts';
import { generateMockWeatherData } from './weatherApi.ts';
import { analyzeWeatherIntelligence } from '../agents/weatherIntelligence.ts';
import { evaluateCropAdvisor } from '../agents/cropAdvisor.ts';
import { planActions } from '../agents/actionPlanner.ts';
import { translations } from '../i18n/translations.ts';
import { CropId, GrowthStageId } from '../types/index.ts';

console.log('--- Running AgriSense Platform Automated Verification ---\n');

// 1. Verify Agronomic Database
const cropIds: CropId[] = ['paddy', 'cotton', 'sugarcane', 'banana', 'groundnut', 'tomato', 'maize', 'finger_millet'];
const stageIds: GrowthStageId[] = ['sowing', 'vegetative', 'flowering', 'harvest'];

console.log(`[1] Verifying Regional Crop Database (${cropIds.length} crops)...`);
cropIds.forEach((cropId) => {
  const crop = CROPS_DATABASE[cropId];
  if (!crop) throw new Error(`Missing crop: ${cropId}`);
  stageIds.forEach((stageId) => {
    const stage = crop.stages[stageId];
    if (!stage) throw new Error(`Missing stage: ${stageId} for crop ${cropId}`);
  });
});
console.log('✓ All 8 regional crops and 32 phenological stages are fully defined.\n');

// 2. Verify Weather Intelligence Agent
console.log('[2] Verifying Weather Intelligence Agent across extreme meteorological scenarios...');
const testHub = TAMIL_NADU_HUBS[0]; // Thanjavur

const normalWeather = generateMockWeatherData(testHub, 'ideal');
const normalAnalysis = analyzeWeatherIntelligence(normalWeather);
console.log(`  - Ideal Weather Threat Level: ${normalAnalysis.threatLevel} (Score: ${normalAnalysis.threatScore})`);
if (normalAnalysis.threatLevel !== 'low') throw new Error('Expected low threat for ideal weather');

const monsoonWeather = generateMockWeatherData(testHub, 'monsoon');
const monsoonAnalysis = analyzeWeatherIntelligence(monsoonWeather);
console.log(`  - Monsoon Deluge Threat Level: ${monsoonAnalysis.threatLevel} (Score: ${monsoonAnalysis.threatScore})`);
if (monsoonAnalysis.threatLevel !== 'severe') throw new Error('Expected severe threat for monsoon scenario');

const heatwaveWeather = generateMockWeatherData(testHub, 'heatwave');
const heatwaveAnalysis = analyzeWeatherIntelligence(heatwaveWeather);
console.log(`  - Heatwave Threat Level: ${heatwaveAnalysis.threatLevel} (Score: ${heatwaveAnalysis.threatScore})`);
if (!heatwaveAnalysis.indicators.heatStress) throw new Error('Expected heatStress indicator to be true');

const windWeather = generateMockWeatherData(testHub, 'high_wind');
const windAnalysis = analyzeWeatherIntelligence(windWeather);
console.log(`  - High Wind Threat Level: ${windAnalysis.threatLevel} (Score: ${windAnalysis.threatScore})`);
if (!windAnalysis.indicators.galeWinds) throw new Error('Expected galeWinds indicator to be true');
console.log('✓ Weather Intelligence Agent correctly classifies extreme triggers.\n');

// 3. Verify Crop Biological Advisor & Action Planner
console.log('[3] Verifying Crop Biological Advisor and Action Planner...');
// Paddy at flowering under monsoon conditions:
const paddyVulnerability = evaluateCropAdvisor('paddy', 'flowering', monsoonAnalysis, monsoonWeather);
console.log(`  - Paddy @ Flowering Biological Risk: ${paddyVulnerability.biologicalRiskScores.overallCropRisk}/100`);
console.log(`    (Pest: ${paddyVulnerability.biologicalRiskScores.pestAndDiseaseRisk}%, Water: ${paddyVulnerability.biologicalRiskScores.waterStressRisk}%, Wind: ${paddyVulnerability.biologicalRiskScores.mechanicalDamageRisk}%)`);

const { actionPlan, workflowSteps } = planActions('paddy', 'flowering', monsoonAnalysis, paddyVulnerability, monsoonWeather);
console.log(`  - Spray Safety in Monsoon: isSafe=${actionPlan.spraySafetyStatus.isSafe} (${actionPlan.spraySafetyStatus.windowEn})`);
if (actionPlan.spraySafetyStatus.isSafe) throw new Error('Spraying should be unsafe during monsoon deluge');

console.log(`  - Immediate Actions Count: ${actionPlan.immediateActions.length}`);
console.log(`  - Short-Term Actions Count: ${actionPlan.shortTermActions.length}`);
console.log(`  - Preventative Actions Count: ${actionPlan.preventativeActions.length}`);
console.log(`  - Agent Workflow Steps Count: ${workflowSteps.length}`);
if (workflowSteps.length !== 3) throw new Error('Expected 3 agent workflow steps');
console.log('✓ Crop Advisor & Action Planner synthesized multi-agent outputs cleanly.\n');

// 4. Verify Bilingual Translations
console.log('[4] Verifying Bilingual Translation Key Parity...');
const enKeys = Object.keys(translations.en).sort();
const taKeys = Object.keys(translations.ta).sort();

const missingInTa = enKeys.filter(k => !(k in translations.ta));
const missingInEn = taKeys.filter(k => !(k in translations.en));

if (missingInTa.length > 0) {
  throw new Error(`Keys missing in Tamil: ${missingInTa.join(', ')}`);
}
if (missingInEn.length > 0) {
  throw new Error(`Keys missing in English: ${missingInEn.join(', ')}`);
}
console.log(`✓ 100% Translation parity verified across all ${enKeys.length} localization keys.\n`);

console.log('=== ALL SYSTEM VERIFICATION CHECKS PASSED SUCCESSFULLY ===');
