# Loom Walkthrough Script: PredictFlow AI (90 Seconds)

> **Challenge:** Simulate Before You Act  
> **Repository:** https://github.com/hafirhalima00-coder/predictflow-ai  
> **Live Demo:** https://predictflow-ai.vercel.app

---

## Storyboard & Timing Breakdown

### [0:00 - 0:15] The Core Thesis
- **Visual**: Open dashboard at `https://predictflow-ai.vercel.app` showing recent simulations, risk distributions, and confidence trends.
- **Narrative**:
  > *"When AI agents act across production infrastructure, traditional undo buttons are useless. If a marketing agent emails 500,000 customers by mistake, you can't unsend them. PredictFlow AI enforces a mandatory cognitive pause: Simulate Before You Act."*

### [0:15 - 0:35] What-If Simulation & State Diff
- **Visual**: Navigate to **Simulation** tab. Configure action: *"Deploy Database Index & Schema Migration"*. Click **"Run Simulation"**.
- **Narrative**:
  > *"Here, an agent proposes a database migration. Before a single SQL statement touches the database, our simulation engine evaluates impact across 5 dimensions: financial, operational, customer blast radius, compliance, and security. Notice the state diff: lines in red vs green showing exactly what changes."*

### [0:35 - 0:55] Gating & Human Approval
- **Visual**: Show the composite risk score (78/100, High Risk) and the Gating decision: *"Human Approval Required"*. Click **"Approve & Execute with Safety Net"**.
- **Narrative**:
  > *"Because this action modifies shared indexes, the engine gates execution, routing it to the human review queue. The human operator reviews the predicted diff, confidence score (89%), and activates execution with safety net monitoring enabled."*

### [0:55 - 1:15] Failure Test: Unpredicted Drift & Auto-Rollback
- **Visual**: Navigate to **Failure Test** (`/failure-test`). Run Scenario 1: *"Hidden Cascading Dependency"*. Show the post-execution monitor catching an unexpected latency spike and triggering the red **"AUTO-ROLLBACK TRIGGERED"** card.
- **Narrative**:
  > *"What happens when the simulation under-predicts? This is our deliberate failure test. Reality throws an unexpected dependency spike that wasn't in the training data. PredictFlow's post-execution safety net detects the divergence in real-time, halts the agent, and executes an automatic rollback within 800 milliseconds."*

### [1:15 - 1:30] Closing & Comparison
- **Visual**: Switch to **Comparison** tab showing non-simulated baseline vs simulation-gated agent.
- **Narrative**:
  > *"Simulate first, verify second, rollback automatically if reality drifts. PredictFlow AI turns high-risk autonomous agents into safe, deployable colleagues. Thank you."*
