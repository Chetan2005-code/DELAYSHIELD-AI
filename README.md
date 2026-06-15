# 🚀 DelayShield AI

**Intelligent Logistics Decision Platform with What-If Simulation, Carbon Shield (ESG), and SLA Guardian**

DelayShield AI is a next-generation logistics and supply chain decision platform that transitions operations from reactive monitoring to proactive, intelligent decision-making. Built around Google Gemini AI, interactive route visualization, and specialized analytics engines, the system predicts route risks, estimates financial losses, triggers operational recovery plans, and calculates real-time ESG carbon footprints.

---

## 💡 The Core Problem & Our Solution

### 🧠 The Problem
Traditional logistics operations face severe efficiency bottlenecks:
*   **Reactive Management:** Operations centers respond only *after* a delay or SLA violation has occurred.
*   **Invisible Costs:** Managers lack real-time visibility into the financial impact of transit delays (e.g., driver overtime, fuel waste, SLA penalties).
*   **Missing ESG Metrics:** Standard routing systems ignore carbon emissions, leaving businesses unable to meet modern environmental, social, and governance (ESG) compliance requirements.
*   **No Predictive Overrides:** Operators cannot simulate how upcoming weather patterns or sudden traffic congestion will impact delivery schedules before dispatching.

### 💡 The Solution
DelayShield AI offers a unified decision-support suite:
*   **Predictive Disruption Detection:** Dynamically ranks fleet risks based on live weather, traffic, and delay metrics.
*   **AI Strategic Recommendation:** Recommends optimal operational actions (*Proceed*, *Monitor*, or *Reroute*) with clear trade-off explanations powered by Google Gemini.
*   **SLA Guardian & Detour Recovery:** Calculates detour options using a dynamic bypass algorithm to protect delivery SLA timelines.
*   **Carbon Shield (ESG Sustainability):** Measures transit and idling carbon emissions (CO₂) and displays green ratings.
*   **What-If Scenario Modeler:** Allows operators to override environment variables to stress-test routes and compare strategies.

---

## 🧠 System Architecture

The project is structured as a decoupled monorepo (Client + Server) using modern ES Modules:

```text
               ┌────────────────────────────────────────┐
               │         Frontend UI (React + Vite)      │
               │  Dashboard | Simulation | SLA Guardian │
               └───────────────────┬────────────────────┘
                                   │ HTTPS / JSON
                                   ▼
               ┌────────────────────────────────────────┐
               │       Express.js Gateway / Router      │
               │   Validates JWT & Routes Requests      │
               └───────────────────┬────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Risk Engine     │      │   Cost Engine    │      │  SLA Guardian    │
│  Traffic, Delay  │      │  Fuel & Penalty  │      │  Detour Planning │
└──────────────────┘      └──────────────────┘      └──────────────────┘
         ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Simulation      │      │  Carbon Shield   │      │  Gemini AI       │
│  What-If Engine  │      │  Transit/Idling  │      │  Strategy Plan   │
└──────────────────┘      └──────────────────┘      └──────────────────┘
         ▲                         ▲                         ▲
         └─────────────────────────┼─────────────────────────┘
                                   │
                                   ▼
                       ┌────────────────────────┐
                       │  MongoDB Data Store    │
                       │  Shipments, Templates  │
                       └────────────────────────┘
```

---

## 🛠️ Technology Stack

*   **Frontend Client:** React.js (Vite compiler), Tailwind CSS (Glassmorphism layout), Leaflet & React-Leaflet (Interactive Maps), Recharts & Chart.js (Data Visualizations), Lucide React (Icons).
*   **Backend Server:** Node.js, Express.js (ESM), Mongoose (MongoDB ODM).
*   **AI Engine:** Google Gemini API (`@google/generative-ai`) for decision plans and strategic explanations.
*   **Authentication:** Google Identity Services (GIS) OAuth 2.0 with JWT-based session management, and a secure manual admin fallback.
*   **Testing:** Mocha and Chai for unit testing core decision and explainer logic.

---

## 📐 Mathematical Formulas & Core Engines

The system utilizes precise mathematical modeling to drive its risk scoring, cost impacts, and ESG metrics.

### 1. Risk Engine (`riskengine.js`)
Calculates the numerical risk score ($S_{\text{risk}} \in [0, 100]$) and risk level classification:
$$S_{\text{risk}} = (\text{Traffic} \times 0.4) + (\text{Delay} \times 0.6)$$
*   **Low Risk:** $S_{\text{risk}} \le 35$
*   **Medium Risk:** $35 < S_{\text{risk}} \le 60$
*   **High Risk:** $S_{\text{risk}} > 60$

### 2. Cost & Loss Engine (`costengine.js`)
Calculates the financial impacts of transit disruptions:
*   **No-Action Cost ($C_{\text{no-action}}$):**
    $$C_{\text{no-action}} = \text{Delay (mins)} \times 10 \times M_{\text{priority}} \times M_{\text{risk}}$$
    *   **Priority Multiplier ($M_{\text{priority}}$):** High (2.0) | Medium (1.5) | Low (1.0)
    *   **Risk Multiplier ($M_{\text{risk}}$):** High (1.5) | Medium (1.2) | Low (1.0)
*   **Reroute Cost ($C_{\text{reroute}}$):**
    $$C_{\text{reroute}} = (\text{Distance}_{\text{km}} \times \text{Fuel Rate}) + (\text{Duration}_{\text{hours}} \times \text{Driver Rate})$$
    *   *Fuel Rate:* ₹8 per km | *Driver Rate:* ₹100 per hour
*   **Financial Savings ($C_{\text{savings}}$):**
    $$C_{\text{savings}} = \max(0, C_{\text{no-action}} - C_{\text{reroute}})$$
*   **Real-time Loss Breakdown:**
    *   *Fuel Waste:* $\text{Delay (mins)} \times ₹5$
    *   *SLA Penalty:* 
        *   If Delay $\le 30$ mins: $₹0$
        *   If $30 < \text{Delay} \le 120$ mins: $\frac{\text{Delay} - 30}{60} \times ₹500$
        *   If Delay $> 120$ mins: $(\frac{90}{60} \times ₹500) + (\frac{\text{Delay} - 120}{60} \times ₹1000)$

### 3. Carbon Shield ESG Engine (`costengine.js`)
Calculates real-time greenhouse gas emissions (CO₂) for sustainability reporting:
*   **CO₂ Transit Coefficient:** $0.95\text{ kg CO}_2\text{ per km}$ (for heavy commercial freight trucks)
*   **CO₂ Idling Coefficient:** $0.15\text{ kg CO}_2\text{ per min}$ (during delays/gridlock)
*   **Total Emission ($E_{\text{total}}$):**
    $$E_{\text{total}} = (\text{Distance}_{\text{km}} \times 0.95) + (\text{Delay}_{\text{mins}} \times 0.15)$$
*   **Sustainability Score:**
    $$\text{Score}_{\text{sustainability}} = \max(0, 100 - \frac{E_{\text{total}}}{10})$$
*   **Carbon Offset Cost:** $E_{\text{total}} \times ₹2.5$
*   **Eco Badge Rating:**
    *   **Eco Friendly (Green):** $E_{\text{total}} < 150\text{ kg CO}_2$
    *   **Moderate (Orange):** $150 \le E_{\text{total}} \le 400\text{ kg CO}_2$
    *   **High Emission (Red):** $E_{\text{total}} > 400\text{ kg CO}_2$

### 4. SLA Guardian Detour Engine (`slaGuardianEngine.js`)
Proposes recovery detours based on delay severity:
*   **Detour Bypass Distance:** $500\text{ meters}$ per minute of predicted delay (capped at $100\text{ km}$).
*   **Bypass Duration:** Calculated assuming an average detour speed of $50\text{ km/h}$.
*   **Estimated Time Saved:** For non-low risk routes, the AI recovery strategy deterministically recovers $\min(\text{Delay}, \max(30\text{ mins}, \text{Delay} \times 0.6))$.

### 5. What-If Simulation Engine (`whatifengine.js`)
Calculates an aggregate **Impact Score** comparing baseline conditions against simulated overrides:
$$\text{Impact Score} = |\Delta S_{\text{risk}}| + |\frac{\Delta C_{\text{no-action}}}{10}| + |\frac{\Delta E_{\text{total}}}{2}|$$

---

## 🔌 API Endpoints Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---|
| **POST** | `/auth/google` | Verify Google credentials and issue JWT | No |
| **POST** | `/auth/login` | Email/password fallback authentication | No |
| **GET** | `/shipment` | Fetch shipments (optional `?showDemo=true`) | Yes |
| **POST** | `/shipment` | Create a new shipment and run initial analysis | Yes |
| **POST** | `/analyze-shipment`| Run dynamic route discovery & AI planning | Yes |
| **POST** | `/simulation` | Run What-If multi-scenario simulations | Yes |
| **POST** | `/sla/analyze` | Run SLA risk, detour calculations, and carbon impact | Yes |
| **GET** | `/sla/shipment/:id` | Get SLA metrics for a specific shipment | Yes |
| **GET** | `/warehouse` | Fetch warehouse load levels and congestion states | Yes |
| **POST** | `/warehouse/redirect`| Redirect shipment to a load-balanced warehouse | Yes |
| **GET** | `/dna` | Fetch Delay DNA feature-importance weights | Yes |
| **GET** | `/communication/logs`| Fetch sent notifications and communications | Yes |
| **POST** | `/communication/trigger`| Send SMS alerts using template templates | Yes |

---

## 🧭 Core User Flows & UI Modules

### 1. Login & Secure Onboarding
*   Users sign in securely via **Google Login** using Google Identity Services.
*   **Corporate Fallback:** If corporate firewalls block OAuth endpoints, users can use the fallback credentials:
    *   *Email:* `admin@delayshield.ai`
    *   *Password:* `admin123`

### 2. Live Fleet Dashboard & Interactive Map
*   Displays live counts of total shipments, critical warnings, saved carbon (kg), and active alerts.
*   An interactive Leaflet map plots the live coordinate tracks of all fleet shipments. Shipments are color-coded:
    *   🔴 **Critical Risk** | 🟠 **At Risk** | 🟢 **Safe**
*   Clicking a shipment opens instant key telemetry charts (Risk Breakdown, Financial Loss, Carbon Meter).

### 3. Shipment Details & Gemini AI Explainer
*   Navigate to `/shipment/:id` to inspect an active shipment.
*   The page displays a dual-mode map comparing the **Baseline Route** against the **AI Suggested Route**.
*   The **AI Strategic Explainer** modal uses Gemini API output to translate raw percentages into structured human reasoning, showing:
    *   *Dominant Disruption Factor* (e.g., "75% weather density").
    *   *Recommended Operational Actions* with trade-offs and cost estimates.
    *   *Sustainability Carbon Meter* showcasing the transit CO₂, delay idling emissions, and ESG eco badges.

### 4. SLA Guardian & Detour Routing
*   Open the `/sla-guardian` portal to monitor critical SLA thresholds.
*   Displays the fleet grouped by SLA violation probability.
*   Provides automated detour recommendations, calculating exact distance detours (at 500m per minute of delay) and comparing carbon footprints between the primary route and alternate corridors.

### 5. What-If Scenario Simulator
*   Accessible under `/simulation` or the **Neural Simulation** sidebar widget.
*   Operators input base metrics (Traffic, Delay, Weather) and create multiple scenario overrides.
*   Clicking **Run Simulation** sends the scenario array to the What-If engine, rendering side-by-side:
    *   A **Radar Chart** overlaying Risk Score, Costs, and Carbon emissions.
    *   Comparative bar charts highlighting delta metrics and the calculated **Impact Score**.
    *   Google Gemini-powered strategy recalculations.

### 6. Warehouse Intelligence & Redirection
*   Provides a system map of regional fulfillment centers showing current load capacity, processing times, and congestion flags.
*   If a warehouse experiences a surge, the operator can click **Redirect Shipment** to reroute incoming trucks to adjacent, less congested hubs to preserve SLAs.

### 7. Delay DNA Engine
*   A mathematical breakdown screen displaying feature-importance variables.
*   Helps managers understand whether precipitation, heavy traffic, day of the week, or visibility contributes most to latency anomalies.

### 8. Communication Center
*   Bridges the dispatch office to driver field teams.
*   Allows operators to select predefined notification templates, insert dynamic placeholders (Shipment ID, alternate road directions, ETA changes), and simulate sending SMS alerts directly to drivers.

---

## 🚀 Getting Started

### Local Installation

#### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Local or MongoDB Atlas)

#### 1. Setup Backend Server
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/
MONGODB_DB_NAME=delayshield_ai
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```
Run the development server (automatically seeds the database on initial connection):
```bash
npm run dev
```

#### 2. Setup Frontend Client
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
Run the development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Testing

The backend includes a comprehensive suite of Mocha & Chai tests. Tests are located in their respective module folders under `server/src/engine/**/*.test.js`.

To execute the test suite:
```bash
cd server
npm test
```

---

## 🏆 Why DelayShield AI Stands Out

*   **Actionable Decisions:** It does not simply log problems—it compares financial, temporal, and ecological trade-offs to tell you the best recovery action.
*   **Dual-Route Analysis:** Plots physical detour routes and calculates exact CO₂ savings.
*   **Hackathon-Ready Simulators:** Operators can stress-test the entire pipeline using slider controls without needing expensive live commercial API feeds.
*   **Premium Visual Design:** Styled with a sleek glassmorphism aesthetic, dark/light contrast styling, smooth UI loading contexts, and interactive charts.

