# VAJRA (वज्र) — Real-Time Convective Storm Nowcasting Console

[![SIH 2026](https://img.shields.io/badge/SIH-2026-orange.svg)](https://www.sih.gov.in/)
[![Problem Statement](https://img.shields.io/badge/Problem%20Statement-PS%2026084-blue.svg)](https://www.sih.gov.in/)
[![Team](https://img.shields.io/badge/Team-CodeX__2026-emerald.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Autonomous Multi-Sensor Convective Storm Nowcasting System (0–6 Hours)**  
> Developed for **India Meteorological Department (IMD)** and **National Centre for Medium Range Weather Forecasting (NCMRWF)** operational forecasters.

---

## 🌩️ Problem Statement (PS 26084)

Severe convective events — including supercell thunderstorms, destructive hail, dry microbursts, extreme cloudbursts, and lightning strikes — develop and evolve within tens of minutes, frequently causing catastrophic loss of life and infrastructure across the Indian subcontinent.

Traditional numerical weather prediction (NWP) models suffer from spin-up latency and cannot update at the cadence needed for rapid convective onset. Conversely, Doppler radar extrapolation suffers from turbulent decorrelation beyond 90 minutes.

**VAJRA bridges the "Nowcasting Void" (0–6 hours)** by continuously ingesting and fusing:
1. **Doppler Weather Radar (DWR)**: 5-minute polarimetric volume scans (reflectivity $Z$, radial velocity $V$, differential reflectivity $Z_{DR}$, specific differential phase $K_{DP}$, vertically integrated liquid $VIL$).
2. **INSAT-3DS Satellite**: 4.5-minute rapid-scan thermal infrared (TIR-1, TIR-2, and Water Vapor channels) computing Cloud-Top Cooling (CTC) rates to detect Convective Initiation (CI) up to 45 minutes before radar first echoes.
3. **Lightning Location Network**: IITM/IMD VLF/LF pulse arrival sensors tracking intra-cloud (IC) and cloud-to-ground (CG) flash rates to detect non-inductive graupel charging and lightning jumps.
4. **NCMRWF Convection-Permitting NWP**: 1.5 km regional model runs providing synoptic shear, thermodynamic instability (CAPE/CIN), and steering winds to guide blending beyond 90 minutes.

---

## ✨ Key Features & Capabilities

- **Mission-Control Workstation UI**: Built with dark-mode glassmorphic aesthetics (`#070B14`, `#0E1626`), high-contrast hazard palettes (IMD standardized color scales), and real-time telemetry counters.
- **Honest Arrival Windows (Not Misleading Point Countdowns)**: Atmospheric turbulence disperses storm trajectories. Rather than deceptive single-minute countdowns, VAJRA calculates temporal confidence intervals ($T_{start}$ to $T_{end}$) with calibrated impact likelihoods.
- **5-Minute Continuous Lead-Time Scrubber (0 to 360 Minutes)**: Seamlessly scrubs from $T+0$ to $T+360$ minutes across three blending regimes:
  - *0–90 min*: Radar Lagrangian Cell Advection ($1\text{ km}$ resolution).
  - *90–180 min*: Lagrangian Optical Flow + NWP Ensembles Blend.
  - *180–360 min*: Convection-Permitting NWP Hazard Probability Field.
- **Interactive Multi-Hazard Profiling**:
  - ⚡ **Severe Thunderstorms**: Peak dBZ, storm top heights, hail probability, kinematic motion vectors.
  - 🌩️ **Lightning Stroke Density**: Total flash rates, IC/CG breakdown, and lightning jump detection.
  - 🧊 **Hail Swaths & Downbursts**: Graupel core descent indicators and surface outflow gusts.
  - 🌊 **Orographic Cloudbursts**: 3D slope-aspect moisture convergence alarms for steep Himalayan terrain.
- **Standardized CAP XML (v1.2) Alert Generator**: Generates OASIS Common Alerting Protocol XML feeds formatted for instantaneous dispatch to NDMA Sachet and state disaster management authorities.
- **Forecast Verification & Skill Scoring**: Live Critical Success Index (CSI), Probability of Detection (POD), False Alarm Ratio (FAR), and Brier reliability scores across 10 to 360-minute lead times.
- **Multi-Domain Radar Coverage**: Pre-configured domains covering Kolkata (Gangetic West Bengal), Uttarakhand (Himalayan Terrain), Delhi NCR (Northern Plains), Mumbai (Konkan Coast), and Bengaluru (Peninsular Plateau).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & Design System** | Tailwind CSS, Lucide Icons, Glassmorphic Dark UI |
| **Geospatial Mapping** | MapLibre GL JS, Esri World Dark Gray Canvas Basemap |
| **High-Performance Canvas** | Custom 2D Canvas Overlay (Gaussian radar cores, advection vectors, 30/60m uncertainty ellipses) |
| **Analytics & Data Viz** | Recharts (CSI skill decay curves, arrival probability distributions) |
| **Architecture** | Decoupled Meteorological Data Service (`stormDataService.ts`) ready for REST/WebSocket radar feed integration |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node.js 20/22/26)
- npm or pnpm

### Installation & Local Run

```bash
# 1. Clone the repository
git clone https://github.com/satvikpandurangi/VAJRA-SIH-26084.git

# 2. Enter the project directory
cd VAJRA-SIH-26084

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
```

The production assets will be generated in the `dist/` directory.

---

## 👥 Team & Submission Information

- **Smart India Hackathon (SIH) 2026**
- **Problem Statement ID**: PS 26084
- **Project Title**: VAJRA (वज्र) — Multi-Sensor Convective Storm Nowcasting Console
- **Team**: CodeX_2026
- **Lead Developer**: Satvik Pandurangi ([@satvikpandurangi](https://github.com/satvikpandurangi))
- **Disclaimer**: *Demo data and prototype simulation generated for research, design demonstration, and forecaster usability benchmarking. Operational deployment connects to IMD radar network APIs.*

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
