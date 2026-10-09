# Notes: AI Tools, Key Decisions & Limitations

> **Challenge:** Simulate Before You Act  
> **Repository:** https://github.com/hafirhalima00-coder/predictflow-ai

---

## 1. AI Tools Used

- **Claude / Cursor**: Used for component layout prototyping, Next.js 15 styling, and synthetic what-if scenario design.
- **Deterministic Core Services**: The 5-dimension impact evaluation, risk calculation formula, JSON Patch state diffing, and auto-rollback trigger mechanisms are implemented in deterministic TypeScript with zero hallucination risk.
- **Ollama (Optional Plugin)**: Includes an optional LLM connector (`ollama-service.ts`) for generating narrative scenario summaries when local LLMs are running; automatically falls back to deterministic rule-based summaries when offline.

---

## 2. Key Architectural Decisions

1. **Mandatory 5-Dimension Risk Scoring**:
   - Evaluating actions exclusively on "is this safe?" is too vague. We quantify impact across Financial, Operational, Customer, Compliance, and Security vectors.
2. **State Diff Before Any Mutation**:
   - Operators and upstream agents see an explicit JSON Patch / git-style diff before execution is unlocked.
3. **The Two-Layer Philosophy: Simulation Gate + Post-Exec Safety Net**:
   - Simulations are models; models can be incomplete. A simulation engine without a post-execution safety net gives false confidence. By monitoring post-execution telemetry against predicted invariants and auto-rolling back on variance, the system remains safe even when predictions are imperfect.

---

## 3. What Was Intentionally Left Out of Scope

- **Direct Cloud Provider VPC / AWS CloudFormation Rollbacks**: Implemented through lightweight state snapshotting and transactional rollbacks to run locally and on Vercel without requiring AWS credentials.
- **Continuous Background Cron Polling**: System runs purely on event-driven REST and WebSocket hooks.

---

## 4. Limits & "This Breaks When..."

- **This breaks when:** An external third-party API has zero rollback or cancellation endpoint (e.g., physical paper mail dispatch or SMS delivered to carrier); in such cases, the engine marks the reversibility as 0.0 and defaults to strict human executive sign-off.
- **This breaks when:** Telemetry drift takes hours to manifest rather than seconds; for long-horizon mutations, asynchronous canary observation windows are required.
