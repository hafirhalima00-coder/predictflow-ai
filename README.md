# PredictFlow AI — Simulate Before You Act

> **Mission Challenge:** Can an AI system think through consequences before it changes something?

## 🏆 Competition Submission

| Deliverable | Status | Link |
|---|---|---|
| **Public repo** | ✅ | [GitHub](https://github.com/hafirhalima00-coder/predictflow-ai) |
| **Live demo** | ✅ | [predictflow-ai.vercel.app](https://predictflow-ai.vercel.app) |
| **90-second walkthrough** | See below | [Architecture & Flow](#90-second-walkthrough) |
| **Architecture snapshot** | ✅ | Intent → Simulate → Present → Execute/Rollback |
| **Failure test** | ✅ | [/failure-test](https://predictflow-ai.vercel.app/failure-test) |
| **Two-year thesis** | ✅ | [/thesis](https://predictflow-ai.vercel.app/thesis) |

### How It Meets the Criteria

| Weight | Criterion | How PredictFlow Delivers |
|---|---|---|
| 25 | **Conceptual clarity** | Simulation changes the decision: block/review/proceed are determined by simulation output, not narration. High-risk actions are gated. |
| 25 | **Technical depth** | Real before/after state diff, 5-dimension impact analysis, confidence scoring, automatic rollback when safety net triggers. |
| 20 | **Demo quality** | 4-tab flow (Configure → Simulate → Execute → Results) in 90 seconds. Reviewer sees diff, approves, watches safety net activate. |
| 15 | **Failure thinking** | Dedicated failure test page: 3 scenarios where simulation under-predicts. Safety net catches unpredicted side effects and auto-rollbacks. |
| 15 | **Future thesis** | 300-word thesis arguing simulation-gated agents will be default by 2028. |

### AI Tools Used

- **Ollama** (optional): LLM integration for AI-enhanced predictions
- **GPT-4**: Architecture design and code generation assistance
- **Vercel AI patterns**: Deployment and serverless architecture

---

## 🧠 Overview

PredictFlow AI is an enterprise-grade simulation-gated agent platform. It enforces a mandatory **simulate-before-execute** pattern for any action that modifies a system. Every write operation passes through:

1. **Intent** — User describes what they want to do
2. **Simulate** — System predicts consequences across 5 dimensions
3. **Present** — Shows diff-style before/after, risk scores, and confidence
4. **Gate** — Human approves, tweaks, or rejects based on simulation
5. **Execute** — Action runs with monitoring active
6. **Safety Net** — Post-execution monitoring detects gaps in prediction

### Key Capabilities

| Capability | Description |
|---|---|
| **Simulation Engine** | Run what-if scenarios without executing actions |
| **Impact Analysis** | Multi-dimensional impact assessment (5 categories) |
| **Risk Engine** | Risk scoring, confidence estimation, severity classification |
| **Execution Gate** | Actions blocked until simulation-approved |
| **State Diff** | Before/after comparison of system state |
| **Safety Net** | Post-execution monitoring catches prediction gaps |
| **Auto-Rollback** | Automatic rollback when safety net detects critical issues |
| **Failure Test** | Demonstrates when simulation under-predicts |
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

## 🎬 90-Second Walkthrough

**Goal:** Show a reviewer approving a dangerous action in 90 seconds, with the simulation changing the decision.

### Script (0:00 – 1:30)

| Time | Action | What to show |
|---|---|---|
| 0:00–0:10 | Open dashboard | Stats, charts, dark mode |
| 0:10–0:20 | Click **Simulation** | Configure form |
| 0:20–0:30 | Select **Delete Records**, type "Delete 1M user records" | Parameters auto-fill |
| 0:30–0:35 | Click **Simulate Before Acting** | Loading spinner → results |
| 0:35–0:45 | Show **Impact Analysis** | 5 cards: Financial (low), Customer (medium), Compliance (CRITICAL) |
| 0:45–0:50 | Show **Risk Score** | 30% risk, 80% confidence, **COMPLIANCE CRITICAL** |
| 0:50–0:55 | Click **Review for Execution** | Confirmation screen |
| 0:55–1:05 | Show **"What will happen"** | Impact breakdown with severity badges |
| 1:05–1:10 | Click **Confirm & Execute** | Execution completes |
| 1:10–1:20 | Show **State Diff** | Before/After comparison |
| 1:20–1:25 | Show **Safety Net Events** | "Unpredicted side effect detected" |
| 1:25–1:30 | Click **Rollback** | System returns to pre-execution state |

**Key message:** The simulation DETECTED the compliance risk and BLOCKED automatic execution. The reviewer saw the risk, made an informed decision, and the safety net caught additional effects.

### Failure Test Walkthrough (30 seconds)

| Time | Action |
|---|---|
| 0:00–0:10 | Open **Failure Test** page |
| 0:10–0:15 | Select "Mass Email Campaign (Under-predicted Impact)" |
| 0:15–0:20 | Run the test |
| 0:20–0:25 | Show **SAFETY NET CAUGHT THE GAP** |
| 0:25–0:30 | Show unpredicted events and failure report |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- (Optional) Ollama for AI enhancement

### Installation

```bash
# Clone the repository
git clone https://github.com/hafirhalima00-coder/predictflow-ai.git
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
│   │   │   ├── execute/route.ts
│   │   │   ├── safety-net/route.ts
│   │   │   ├── scenarios/route.ts
│   │   │   ├── approvals/route.ts
│   │   │   ├── reports/route.ts
│   │   │   └── dashboard/route.ts
│   │   ├── simulation/page.tsx
│   │   ├── comparison/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── approval/page.tsx
│   │   ├── timeline/page.tsx
│   │   ├── failure-test/page.tsx
│   │   ├── thesis/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/ (shadcn primitives)
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── simulation/
│   │   │   ├── scenario-form.tsx
│   │   │   ├── impact-panel.tsx
│   │   │   ├── risk-score.tsx
│   │   │   ├── simulation-flow.tsx
│   │   │   └── diff-view.tsx
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
│   │   ├── execution-service.ts
│   │   ├── safety-net-service.ts
│   │   ├── dashboard-service.ts
│   │   ├── report-service.ts
│   │   ├── ollama-service.ts
│   │   └── notification-service.ts
│   └── __tests__/
│       └── services.test.ts
└── .github/workflows/ci.yml
```

## 🌐 Deployment

### Live Demo

**URL:** [https://predictflow-ai.vercel.app](https://predictflow-ai.vercel.app)

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
# Production build with Ollama
docker compose up -d

# Standalone build
docker build -t predictflow-ai .
docker run -p 3000:3000 predictflow-ai
```

## 🔒 Security

- All simulations are sandboxed — no real actions are executed without explicit approval
- High-risk actions are **blocked** by the simulation gate until human review
- Safety net monitors post-execution and auto-rollbacks on prediction gaps
- Approval workflow provides full audit trail
- State diffs show exactly what will change before execution

## 📊 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/simulate` | POST | Run a simulation |
| `/api/execute` | POST | Execute with simulation gate |
| `/api/execute` | GET | Get execution history and diffs |
| `/api/safety-net` | POST | Run safety net check |
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

AI Engineering Competition — "Simulate Before You Act" challenge.

### Key Decisions

1. **Two-layer safety architecture:** Simulation as the gate, safety net as the backup. Neither is sufficient alone.
2. **State diff presentation:** Before/after comparison makes the impact tangible for reviewers.
3. **Failure-first design:** Dedicated failure test page demonstrates when predictions fail.
4. **In-memory simulation:** Fast iteration without external dependencies (Ollama optional).
5. **TypeScript throughout:** Full type safety across simulation, execution, and monitoring layers.

### Out of Scope (for this submission)

- Real external API integrations (simulated for demo)
- Persistent database (in-memory for demo, SQLite configured for production)
- LLM-powered predictions (Ollama integration ready but optional)
- Production-grade authentication (demo mode)

### What to Look At

1. **`/simulation`** — The core gate: configure → simulate → review → execute → see diff
2. **`/failure-test`** — When simulation under-predicts, safety net catches it
3. **`/thesis`** — Two-year thesis on simulation-gated agents
4. **`/api/execute`** — Real execution gating with state management
5. **`/api/safety-net`** — Post-execution monitoring

---

**PredictFlow AI** — Intent → Simulate → Present → Execute/Rollback. Simulation is not narration; it changes the decision.
