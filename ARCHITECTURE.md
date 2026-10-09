# Architecture Snapshot: PredictFlow AI

> **Intent → Simulate → Present → Execute / Auto-Rollback**

PredictFlow AI implements a mandatory pre-execution simulation gate and continuous post-execution safety net for any autonomous agent action that mutates systems.

---

## 1. High-Level Flow: Intent to Execution & Safety Net

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PREDICTFLOW ARCHITECTURE                        │
│                                                                        │
│   ┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐   │
│   │ 1. INTENT    │────▶│ 2. SIMULATION    │────▶│ 3. PRESENT       │   │
│   │              │     │    ENGINE        │     │    (DIFF VIEW)   │   │
│   │ • User /     │     │ • 5-Dimension    │     │ • State Before/  │   │
│   │   Agent Goal │     │   Impact         │     │   After Diff     │   │
│   │ • Proposed   │     │ • Risk Scorer    │     │ • Risk Score &   │   │
│   │   Action     │     │ • Confidence     │     │   Blast Radius   │   │
│   └──────────────┘     └──────────────────┘     └────────┬─────────┘   │
│                                                          │             │
│                                                          ▼             │
│   ┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐   │
│   │ 6. AUTO-     │◀────│ 5. POST-EXEC     │◀────│ 4. EXECUTION     │   │
│   │    ROLLBACK  │     │    SAFETY NET    │     │    GATE          │   │
│   │ • Instant    │     │ • Telemetry vs   │     │ • Block / Review │   │
│   │   Snapshot   │     │   Prediction Diff│     │ • Human Sign-off │   │
│   │   Restoration│     │ • Drift Detector │     │ • Safe Dispatch  │   │
│   └──────────────┘     └──────────────────┘     └──────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Dimensional Impact & State Diff Pipeline

```mermaid
flowchart TD
    subgraph ProposedAction["1. Proposed Mutation"]
        ACT["Action: Database Migration / Marketing Blast / Bulk Refund"]
    end

    subgraph SimulationService["2. Predictive Simulation Engine"]
        DIM1["Financial Impact ($ estimated cost & liability)"]
        DIM2["Operational Impact (Latency, CPU, Error budget)"]
        DIM3["Customer Blast Radius (% users affected)"]
        DIM4["Compliance & Governance (GDPR / SOC2 constraints)"]
        DIM5["Security Boundary (Privilege escalation risk)"]
    end

    subgraph StateDiff["3. JSON Patch State Diff & Risk Score"]
        DIFF["State Before vs. Predicted State After"]
        SCORE{"Composite Risk Calculation:
        Risk = Σ (Dimension Impact × Weight)
        Confidence = (1 - Model Uncertainty)"}
    end

    subgraph DecisionGate["4. Gating & Post-Execution Monitor"]
        GATE{"Risk Level?"}
        GATE -->|Critical / Prohibited| BLOCK["BLOCK: Action Refused"]
        GATE -->|High Risk| HUMAN["APPROVAL QUEUE: Human Review Required"]
        GATE -->|Low / Medium Risk| EXEC["EXECUTE: Run Mutation"]
        EXEC --> MONITOR["SAFETY NET: Real-time Telemetry Verification"]
        MONITOR -->|Prediction Valid| SUCCESS["SUCCESS: Metrics Logged"]
        MONITOR -->|Unpredicted Side Effects Detected| ROLLBACK["AUTO-ROLLBACK: Revert to Snapshot"]
    end

    ProposedAction --> SimulationService
    SimulationService --> StateDiff
    StateDiff --> DecisionGate
```

---

## 3. Deliberate Failure Scenarios & Safety Net Containment

The platform implements 3 deliberate failure test cases (`/failure-test`):

1. **Unpredicted Dependency Cascade**: An action predicted as isolated affects an undocumented downstream microservice. The safety net detects latency spiking above 500ms and triggers automatic rollback within 800ms.
2. **Hidden Rate Limit Exhaustion**: A simulated bulk notification underestimates external API rate limits. Telemetry catches HTTP 429 surges, pauses dispatch, and reverts queue state.
3. **Data Loss Anomaly**: A database cleanup script exceeds predicted row deletion count by $> 10\%$. Safety net halts execution and restores the pre-execution transaction snapshot.
