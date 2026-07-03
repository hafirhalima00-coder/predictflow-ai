# PredictFlow AI

> **Simulate Before You Act** — An AI-powered decision simulation platform that predicts consequences before actions are executed.

![PredictFlow AI](public/images/predictflow-banner.png)

## 🧠 Overview

PredictFlow AI is an enterprise-grade simulation platform that helps organizations make safer decisions by simulating business actions before executing them. It analyzes impacts across five dimensions (financial, operational, customer, compliance, security), calculates risk scores, and provides AI-powered recommendations.

### Key Capabilities

| Capability | Description |
|---|---|
| **Simulation Engine** | Run what-if scenarios without executing actions |
| **Impact Analysis** | Multi-dimensional impact assessment (5 categories) |
| **Risk Engine** | Risk scoring, confidence estimation, severity classification |
| **Scenario Comparison** | Side-by-side comparison to find optimal actions |
| **Approval Workflow** | Human-in-the-loop for high-risk simulations |
| **Executive Dashboard** | Real-time analytics and monitoring |
| **Reporting** | Detailed PDF reports with recommendations |
| **AI Enhancement** | Ollama integration for AI-powered predictions |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Next.js 15 App                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │Dashboard  │  │Simulation│  │Comparison│  │ Reports │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │Approval  │  │ Timeline │  │   API    │              │
│  └──────────┘  └──────────┘  └──────────┘              │
├─────────────────────────────────────────────────────────┤
│                    Service Layer                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │Simulation│  │  Impact  │  │   Risk   │  │Comparison│ │
│  │  Engine  │  │ Analysis │  │  Engine  │  │ Service  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │Approval  │  │Dashboard │  │   Ollama │              │
│  │ Service  │  │ Service  │  │  Service │              │
│  └──────────┘  └──────────┘  └──────────┘              │
├─────────────────────────────────────────────────────────┤
│                    Data Layer                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  SQLite  │  │ In-Memory│  │   React Flow         │  │
│  │   (DB)   │  │  Store   │  │   Visualization      │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- (Optional) Ollama for AI enhancement

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/predictflow-ai.git
cd predictflow-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the application.

### Docker

```bash
# Build and run with Docker Compose (includes Ollama)
docker compose up -d

# Build without Ollama
docker build -t predictflow-ai .
docker run -p 3000:3000 predictflow-ai
```

## 💻 Usage

### Running a Simulation

1. Navigate to **Simulation Studio**
2. Select a scenario type (Delete Records, Send Campaign, etc.)
3. Configure parameters
4. Click **Simulate & Predict**
5. View impact analysis, risk scores, and recommendations

### Comparing Scenarios

1. Run multiple simulations
2. Navigate to **Scenario Comparison**
3. Select scenarios to compare
4. Click **Compare** to view side-by-side analysis

### Approval Workflow

- High-risk simulations (score ≥ 60%) require human approval
- Navigate to **Approvals** to review pending requests
- Approve or reject with comments

### Generating Reports

1. Navigate to **Reports**
2. Select a simulation from the dropdown
3. Click **Generate**
4. Download as PDF

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | UI component system |
| **React Flow** | Simulation workflow visualization |
| **Recharts** | Charts and analytics |
| **SQLite** | Embedded database |
| **Zustand** | State management |
| **Ollama** | AI enhancement |
| **pdfmake** | PDF report generation |
| **Vitest** | Testing framework |

## 📁 Project Structure

```
├── Dockerfile
├── docker-compose.yml
├── next.config.ts
├── vitest.config.ts
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── simulate/route.ts
│   │   │   ├── scenarios/route.ts
│   │   │   ├── approvals/route.ts
│   │   │   ├── reports/route.ts
│   │   │   └── dashboard/route.ts
│   │   ├── simulation/page.tsx
│   │   ├── comparison/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── approval/page.tsx
│   │   ├── timeline/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/ (shadcn primitives)
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── simulation/
│   │   ├── comparison/
│   │   ├── reports/
│   │   ├── approval/
│   │   └── timeline/
│   ├── lib/
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── db.ts
│   ├── services/
│   │   ├── simulation-engine.ts
│   │   ├── impact-analysis.ts
│   │   ├── risk-engine.ts
│   │   ├── comparison-service.ts
│   │   ├── approval-service.ts
│   │   ├── dashboard-service.ts
│   │   ├── report-service.ts
│   │   ├── ollama-service.ts
│   │   └── notification-service.ts
│   └── __tests__/
│       └── services.test.ts
└── .github/workflows/ci.yml
```

## 🌐 Deployment

### Vercel

```bash
# Deploy to Vercel
vercel --prod
```

Configure environment variables:
- `OLLAMA_BASE_URL` (optional): Ollama API endpoint
- `OLLAMA_MODEL` (optional): AI model name

### Docker

```bash
# Production build
docker compose -f docker-compose.yml up -d
```

## 🔒 Security

- All simulations are sandboxed — no real actions are executed
- High-risk actions require human approval
- Approval workflow provides audit trail
- SQLite with WAL mode for data integrity

## 📊 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/simulate` | POST | Run a simulation |
| `/api/scenarios` | GET | List/filter simulations |
| `/api/approvals` | GET/POST | Manage approvals |
| `/api/reports` | GET | Generate reports |
| `/api/dashboard` | GET | Dashboard statistics |

## 🧩 Extending

### Adding a New Scenario Type

1. Add to `ScenarioType` in `src/lib/types.ts`
2. Add labels/icons in the same file
3. Add impact config in `src/services/impact-analysis.ts`
4. Add default parameters in `src/services/simulation-engine.ts`

### Adding Custom Risk Factors

Edit `generateRiskFactors` in `src/services/risk-engine.ts`

## 📝 License

MIT — See [LICENSE](LICENSE)

## 🏆 Built For

AI Engineering Competition — demonstrating how AI systems can think through consequences before taking action.

---

**PredictFlow AI** — Making decisions safer, one simulation at a time.

---

> **built by Halima Hafir**

