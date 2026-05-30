# 🚀 ReasonMind AI — Startup Guide

A step-by-step guide to launch the full ReasonMind AI platform locally.

---

## 📋 Prerequisites

| Requirement     | Version  | Check Command          |
|-----------------|----------|------------------------|
| Python          | 3.10+    | `python --version`     |
| Node.js         | 18+      | `node --version`       |
| npm             | 9+       | `npm --version`        |
| pip             | latest   | `pip --version`        |

---

## 🔧 One-Time Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vsoham19/Reasonmind-ai.git
cd reasonmind-ai
```

### 2. Create & Activate Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS / Linux)
source venv/bin/activate
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

> **Required packages:** `groq`, `python-dotenv`, `yfinance`, `flask`

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 5. Configure Environment Variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

> 💡 Get your free API key from [Groq Console](https://console.groq.com/keys)

---

## 🟢 Starting the Project

The platform consists of **2 services** that need to run simultaneously.  
Open **2 separate terminals**, all from the project root directory.

---

### Terminal 1 — 🐍 Flask API Bridge (Backend)

Serves live stock prices from Yahoo Finance to the frontend.

```bash
# From project root: reasonmind-ai/
python api.py
```

| Detail      | Value                          |
|-------------|--------------------------------|
| **URL**     | http://localhost:5000          |
| **API Endpoint** | http://localhost:5000/api/stocks |
| **Purpose** | Live Nifty 50 price data via yfinance |

✅ You should see:
```
Starting ReasonMind API Bridge on port 5000...
 * Running on http://127.0.0.1:5000
```

---

### Terminal 2 — ⚛️ React + Tailwind Frontend (Dashboard)

The main interactive dashboard with DCF Sandbox, Chatbot, and Nifty Explorer.

```bash
# From project root: reasonmind-ai/
cd frontend
npm run dev
```

| Detail      | Value                          |
|-------------|--------------------------------|
| **URL**     | http://localhost:5173          |
| **Purpose** | Interactive financial dashboard |

✅ You should see:
```
VITE ready in ~700ms
➜  Local: http://localhost:5173/
```

> ⚠️ If port 5173 is busy, Vite will auto-pick the next available port (5174, 5175, etc.)

---

## 🗺️ Architecture Overview

The system runs in two primary modes:
1. **Interactive Web Dashboard:** A high-fidelity React + Tailwind frontend that connects to a Flask API backend for real-time stock prices (calculated and served from Yahoo Finance), with built-in client-side DCF financial calculators and Monte Carlo engines.
2. **Autonomous CLI Agent Loop:** An offline console-based reasoning system (`main.py`) that leverages the Groq LLM API to execute multi-step financial planning, tool execution, self-correction, and final response synthesis.

```
┌──────────────────────────────────────────────────────────┐
│                    USER (Browser)                        │
│                                                          │
│                 ┌─────────────────────┐                  │
│                 │  React Dashboard    │                  │
│                 │  localhost:5173     │                  │
│                 └──────────┬──────────┘                  │
└────────────────────────────┼─────────────────────────────┘
                             │ fetch /api/stocks
                             ▼
┌──────────────────────────────────────────────────────────┐
│                    Flask API Bridge                      │
│                    localhost:5000                        │
│                                                          │
│                 ┌─────────────────────┐                  │
│                 │      yfinance       │                  │
│                 │     (Yahoo API)     │                  │
│                 └─────────────────────┘                  │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                 CLI Agent Runner (main.py)               │
│                 (Console-based LLM analysis)             │
│                                                          │
│  ┌───────────────────────┐     ┌───────────────────────┐ │
│  │     Agent Loop        │     │    Groq Cloud (LLM)   │ │
│  │ Planner → Tools →     │◀───▶│ llama-3.1-8b-instant  │ │
│  │ Eval → Synthesizer    │     └───────────────────────┘ │
│  └───────────────────────┘                               │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
reasonmind-ai/
├── api.py                  # Flask REST API bridge (live stock prices)
├── main.py                 # Console-based agent runner
├── .env                    # Environment variables (GROQ_API_KEY)
├── requirements.txt        # Python dependencies
│
├── agent/                  # AI Agent modules
│   ├── agent_loop.py       # Main reasoning loop with self-correction
│   ├── planner.py          # LLM-based task planner
│   ├── evaluator.py        # Response quality evaluator
│   └── synthesizer.py      # Final answer synthesizer
│
├── core/                   # Core utilities
│   └── llm_client.py       # Groq API client wrapper
│
├── tools/                  # Financial analysis tools
│   ├── financial_tools.py  # Stock data retrieval (live + fallback)
│   ├── live_data.py        # yfinance integration & ticker resolver
│   ├── valuation_models.py # DCF, DDM, Monte Carlo models
│   ├── math_tools.py       # Mathematical utilities
│   ├── nifty_graph_tools.py# Nifty graph analysis
│   └── tool_registry.py    # Central tool registry
│
├── knowledge/              # Static knowledge base
│   └── nifty_knowledge.py  # Nifty 50 company data
│
├── prompts/                # LLM system prompts
│   ├── planner_prompt.txt
│   ├── evaluator_prompt.txt
│   └── synthesizer_prompt.txt
│
└── frontend/               # React + Tailwind CSS dashboard
    ├── src/
    │   └── App.jsx         # Main dashboard component
    ├── package.json
    └── vite.config.js
```

---

## 🛑 Stopping the Services

Press `Ctrl + C` in each of the 2 terminal windows to gracefully stop each service.

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError` | Make sure `venv` is activated and run `pip install -r requirements.txt` |
| `FileNotFoundError: prompts/...` | Always run commands from the **project root** (`reasonmind-ai/`) |
| Port already in use | Kill the process using the port: `netstat -ano \| findstr :5000` then `taskkill /PID <pid> /F` |
| Groq API `401 Unauthorized` | Your API key has expired — generate a new one at [console.groq.com](https://console.groq.com/keys) |
| React app shows static prices | Make sure the Flask API (Terminal 1) is running before opening the dashboard |
| `yfinance` returning stale data | Stock market may be closed (weekends/holidays) — prices shown will be last closing prices |

---

## ⚡ Quick Start (Copy-Paste)

Run these commands in 2 separate terminals from the project root:

```bash
# Terminal 1 — API
python api.py

# Terminal 2 — Frontend
cd frontend && npm run dev
```

---

> 📌 **Tip:** The React frontend auto-polls the Flask API every 30 seconds. If the API is down, the dashboard gracefully falls back to static reference prices.
