# AgriSense: Climate & Crop Advisory Platform 🌾🌱

> Autonomous Multi-Agent Climate Intelligence & Localized Crop Advisory Engine for Tamil Nadu Farmers.

[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 Overview

**AgriSense** is a full-stack, mobile-responsive web platform designed to empower agricultural extension officers and farmers across Tamil Nadu. By synthesizing live satellite and meteorological telemetry from **Open-Meteo** with deep agronomic physiology models, AgriSense transforms raw weather forecasts into prioritized, actionable field advisories.

The platform features an autonomous **3-Agent Reasoning Pipeline** and full **Bilingual (English + தமிழ்)** localization.

---

## ✨ Core Features

1. **Farmer Dashboard (Feature 01)**
   - Auto-detect GPS coordinates with automatic nearest-hub matching.
   - Quick selection across 6 core Tamil Nadu agricultural hubs: *Coimbatore, Thanjavur, Madurai, Tiruchirappalli, Salem, Tirunelveli*.
   - Crop selector for 8 regional crops with Tamil & English titles and icons: *Paddy / நெல், Cotton / பருத்தி, Sugarcane / கரும்பு, Banana / வாழை, Groundnut / நிலக்கடலை, Tomato / தக்காளி, Maize / மக்காச்சோளம், Finger Millet / கேழ்வரகு*.
   - 4 phenological stages: *Sowing / Nursery, Vegetative, Flowering / Grain Filling, Harvest Ready*.
   - Live telemetry snapshot: Temperature, Feels-like, Relative Humidity, Rain Probability, Wind Speed, UV Index, and Soil Moisture.

2. **Weather Intelligence Agent (Feature 02)**
   - Ingests 7-day forecast data via Open-Meteo API.
   - Evaluates critical indicators:
     - Heat stress (>38°C)
     - Deluge / unseasonal heavy precipitation (>40mm/day)
     - Drought spells (3+ consecutive hot dry days with low soil moisture)
     - Gale wind gusts (>35 km/h)
     - High fungal spore humidity (>85%)
   - Categorizes threat level: `Low`, `Moderate`, `High`, `Severe`.

3. **Crop Biological Advisor Agent (Feature 03)**
   - Cross-references crop phenology with atmospheric diagnosis.
   - Evaluates physiological vulnerabilities (e.g., Paddy neck blast under >82% humidity, Banana stem lodging at winds >26 km/h, Cotton boll rot/sucking pests).
   - Computes biological risk scores: Pest & Disease Risk, Water Stress Risk, Mechanical/Lodging Damage Risk, and Composite Agronomic Stress.

4. **Action Planner Agent (Feature 04)**
   - **Spraying Safety Window**: Real-time foliar spraying advice (identifies chemical wash-off risks, wind drift, and midday heat scorch).
   - **Immediate Actions (Next 24h)**: Urgent spray postponements, emergency field drainage, crop propping/staking, or expedited harvest.
   - **Short-Term Actions (Next 2–4 Days)**: Fertilizer top-dressing timings (e.g., withholding Urea during rain), targeted pest scouting.
   - **Preventative Measures**: Pheromone/light traps, organic mulching, prophylactic neem oil / NSKE barrier.
   - **Agent Reasoning Workflow**: Interactive modal visualizer illustrating intermediate multi-agent inference logic.

5. **Bilingual Engine: Tamil + English (Feature 05)**
   - Instant header language switch (`English` <-> `தமிழ்`).
   - Centralized dictionary (`src/i18n/translations.ts`) with zero hardcoded UI strings.
   - Conversational, farmer-friendly terminology (e.g., தூர்கட்டுதல், கழுத்துக்கருகல், நிலப்போர்வை).

6. **Risk Reports & Action Summary (Feature 06)**
   - Semi-circular SVG Risk Meter gauge with dynamic needle deflection.
   - 7-day risk timeline chart visualizing projected threat levels.
   - One-click print-to-PDF advisory docket complete with farmer details, advisory date, extension officer verification, and QR code placeholder.

7. **Weather Scenario Simulator**
   - Instant 1-click test simulation bar: Live Weather, Monsoon Deluge, Heatwave, High Wind, and Ideal Weather.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (accessible earthy palette: Emerald, Amber, Rose, Slate)
- **Icons**: Lucide React
- **API**: Open-Meteo Forecast API (with resilient offline mock fallback)
- **State & i18n**: React Context API with persistent `localStorage`

---

## 📂 Project Structure

```
src/
├── components/
│   ├── Header.tsx              # Bilingual toggle, status badge, print trigger
│   ├── LocationSelector.tsx    # GPS auto-detection & TN hubs
│   ├── CropSelector.tsx        # 8 crops & 4 growth stages
│   ├── WeatherCard.tsx         # Live weather & 7-day forecast cards
│   ├── AgentWorkflowModal.tsx  # Interactive multi-agent pipeline modal
│   ├── AdvisoryActions.tsx     # Spraying safety window & action checklist
│   ├── RiskReport.tsx          # SVG Risk Meter, 7-day timeline & PDF layout
│   ├── OfflineBanner.tsx       # Offline / simulation mode indicator
│   └── ScenarioSimulator.tsx   # Weather scenario switcher
├── agents/
│   ├── weatherIntelligence.ts  # Agent 1: Atmospheric telemetry & extreme risks
│   ├── cropAdvisor.ts          # Agent 2: Biological risk scores & vulnerabilities
│   └── actionPlanner.ts        # Agent 3: Multi-agent synthesis & action scheduler
├── i18n/
│   ├── translations.ts         # English & Tamil dictionaries
│   ├── useTranslation.ts       # Localization hook export
│   └── useTranslation.tsx      # React Context localization provider
├── types/
│   └── index.ts                # TypeScript definitions
├── utils/
│   ├── weatherApi.ts           # Open-Meteo client & mock generator
│   ├── cropDatabase.ts         # Agronomic thresholds for 8 regional crops
│   └── verify.ts               # Verification test suite
├── App.tsx                     # Main layout & orchestrator
├── index.css                   # Global styles & print media styles
└── main.tsx                    # Application entry point
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/agrisense-platform.git
   cd agrisense-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Testing & Verification

Run the built-in automated test suite:

```bash
npm test
```

This verifies:
- Agronomic database consistency across all 8 crops and 32 stages.
- Weather Intelligence Agent classification across ideal, deluge, heatwave, and gale wind scenarios.
- Crop Biological Advisor and Action Planner synthesis logic.
- 100% translation key parity between English and Tamil dictionaries.

---

## 📦 Production Build

To compile a production-ready build:

```bash
npm run build
```

The output files will be generated in the `dist/` directory.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
