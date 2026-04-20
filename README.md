# 🚀 DelayShield AI

### Supply Chain Disruption Prediction & Intelligent Decision System

---

## 🧠 Problem Statement

In logistics and supply chain operations, delays occur due to traffic congestion, weather disruptions, and inefficient routing.

The real issue is **late reaction** — companies respond only *after* disruptions occur, leading to:

* 📉 Increased operational costs
* ⏱️ Missed delivery deadlines
* 😞 Poor customer experience

---

## 💡 Solution

**DelayShield AI** is a smart decision-support system that:

* 🔍 Predicts disruptions **before they happen**
* 🧠 Uses AI to recommend **optimal decisions**
* 💰 Minimizes losses using **cost analysis**
* ⚡ Simulates real-world scenarios for better planning

👉 It transforms logistics from **reactive → proactive**

---

## ⚙️ System Workflow

### 1️⃣ Data Input Layer

* Shipment data (source, destination, priority, ETA)
* Traffic data (simulated or API-based)
* Weather data (optional integration)

---

### 2️⃣ Risk Detection Engine

* Classifies risk into:

  * 🟢 Low
  * 🟡 Medium
  * 🔴 High
* Identifies cause:

  * Traffic / Weather / Route inefficiency

---

### 3️⃣ 🧠 AI Decision Engine (Core Innovation)

Powered by **Gemini AI + custom logic**

Suggests:

* 🚛 Rerouting shipments
* ⏳ Delaying low-priority deliveries
* 🚨 Prioritizing critical shipments

📁 Implemented in:

```
src/engine/decision/aiplanner.js
```

---

### 4️⃣ 📊 Simulation Engine (What-If Analysis)

* Simulates multiple scenarios
* Compares outcomes:

  * Before AI decision
  * After AI decision

📁 Implemented in:

```
src/engine/simulation/whatifengine.js
```

---

### 5️⃣ 💰 Cost Engine

* Calculates:

  * Loss due to delays
  * Savings after optimization

📁 Implemented in:

```
src/engine/cost/costengine.js
```

---

## 🧩 Key Features

* 📦 Shipment Monitoring APIs
* ⚠️ Real-Time Risk Detection
* 🧠 AI-Based Decision Suggestions
* 💰 Cost Impact Analysis Engine
* 🗺️ Route Optimization Logic
* 🔄 What-If Simulation Engine
* 📊 Before vs After Comparison
* ⚡ Lightweight In-Memory Processing
* 🔌 Modular Backend Architecture

---

## 🧠 Data Strategy

Instead of a heavy database, the system uses:

* ⚡ In-memory data for ultra-fast processing
* 📁 Static datasets:

  * `cities.js`
  * `routes.js`
  * `shipment.js`
* 🚦 Traffic simulation utility:

  * `simulatetraffic.js`

👉 This ensures:

* Faster execution
* Easy testing
* Hackathon-ready scalability

---

## 🏗️ Project Structure

```
delayshield-ai/
│
├── client/                  # React Frontend
│
├── server/
│   ├── src/
│   │   ├── config/          # AI config (Gemini)
│   │   ├── controllers/     # Business logic controllers
│   │   ├── routes/          # API routes
│   │   ├── engine/
│   │   │   ├── decision/    # AI planner
│   │   │   ├── cost/        # Cost engine
│   │   │   └── simulation/  # What-if engine
│   │   ├── data/            # Mock datasets
│   │   ├── utils/           # Traffic simulation
│   │   └── app.js
│
├── docs/                    # PPT, diagrams
└── README.md
```

---

## 🛠️ Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js + Express.js
* **AI Integration:** Gemini API
* **Data Handling:** In-memory + Mock Data
* **Simulation:** Custom Engine Logic

---

## 🔌 Core APIs

### 📦 Shipment APIs

```
GET  /api/shipments
```

### ⚠️ Risk Analysis

```
POST /api/analyze
```

### 🧠 AI Decision

```
POST /api/decision
```

### 💰 Cost Calculation

```
POST /api/cost
```

### 🔄 Simulation (What-If)

```
POST /api/simulate
```

### 🌍 City Data

```
GET /api/cities
```

---

## 🎯 Target Users

* 🚛 Logistics companies
* 📦 Supply chain managers
* 🚚 Fleet operators

---

## 🏆 Why This Project Stands Out

* ✅ Solves a **real-world logistics problem**
* 🧠 Focuses on **decision intelligence (not just tracking)**
* ⚡ Combines:

  * AI + Simulation + Cost Analysis
* 🏗️ Clean modular backend architecture
* 🚀 Ready for real-world scaling

---

## 👥 Team Members

* Chaitanya Verma
* Devesh Sahu
* Govind Dangi

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/delayshield-ai.git
cd delayshield-ai
```

---

### 2️⃣ Backend Setup

```
cd server
npm install
npm run dev
```

---

### 3️⃣ Frontend Setup

```
cd client
npm install
npm run dev
```

---

## 🧪 Sample Workflow (How to Use APIs)

1. Get shipments
2. Analyze risk
3. Get AI decision
4. Run simulation
5. Calculate cost impact

---

## 📌 Future Scope

* 📍 Real-time GPS tracking
* 🤖 Advanced ML prediction models
* ☁️ Cloud deployment (AWS/GCP)
* 📱 Mobile application
* 🔗 Integration with logistics platforms

---

## 💬 One-Line Pitch

> “DelayShield AI predicts disruptions before they happen and helps logistics companies take smarter decisions to minimize delays and costs.”

---

## ⭐ Final Note

This project is designed as a **hackathon-ready intelligent system** with a strong focus on:

* Real-world applicability
* Clean architecture
* AI-driven decision making

---

🔥 *Built for impact. Designed for scale.*
