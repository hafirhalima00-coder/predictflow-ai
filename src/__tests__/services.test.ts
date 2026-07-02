import { describe, it, expect } from "vitest"
import { runSimulation } from "@/services/simulation-engine"
import { analyzeImpacts } from "@/services/impact-analysis"
import { assessRisk } from "@/services/risk-engine"
import { compareScenarios } from "@/services/comparison-service"
import { requiresApproval, createApprovalRequest, reviewApproval } from "@/services/approval-service"
import { generateReport } from "@/services/report-service"
import type { SimulationInput, SimulationResult } from "@/lib/types"

const mockInput: SimulationInput = {
  scenarioType: "delete_records",
  title: "Test Simulation",
  description: "Testing simulation engine",
  parameters: { recordCount: 100, hasBackup: true, softDelete: true },
  department: "Engineering",
  initiatedBy: "Test",
}

describe("Simulation Engine", () => {
  it("should run a simulation and produce results", async () => {
    const result = await runSimulation(mockInput)
    expect(result).toBeDefined()
    expect(result.id).toBeTruthy()
    expect(result.input.title).toBe("Test Simulation")
    expect(result.impacts).toHaveLength(5)
    expect(result.risk).toBeDefined()
    expect(result.executionTimeMs).toBeGreaterThanOrEqual(0)
  })

  it("should generate all five impact categories", async () => {
    const result = await runSimulation(mockInput)
    const categories = result.impacts.map((i) => i.category)
    expect(categories).toContain("financial")
    expect(categories).toContain("operational")
    expect(categories).toContain("customer")
    expect(categories).toContain("compliance")
    expect(categories).toContain("security")
  })

  it("should produce risk scores between 0 and 1", async () => {
    const result = await runSimulation(mockInput)
    expect(result.risk.riskScore).toBeGreaterThanOrEqual(0)
    expect(result.risk.riskScore).toBeLessThanOrEqual(1)
    expect(result.risk.confidenceScore).toBeGreaterThanOrEqual(0)
    expect(result.risk.confidenceScore).toBeLessThanOrEqual(1)
  })

  it("should handle all scenario types", async () => {
    const types: SimulationInput["scenarioType"][] = [
      "delete_records",
      "send_campaign",
      "update_price",
      "process_refund",
      "change_inventory",
      "update_policy",
      "migrate_data",
      "deploy_feature",
    ]

    for (const scenarioType of types) {
      const input = { ...mockInput, scenarioType }
      const result = await runSimulation(input)
      expect(result.risk.riskScore).toBeDefined()
      expect(result.impacts).toHaveLength(5)
    }
  })
})

describe("Impact Analysis", () => {
  it("should return impacts with severity levels", async () => {
    const impacts = await analyzeImpacts(mockInput)
    expect(impacts).toHaveLength(5)
    impacts.forEach((impact) => {
      expect(["low", "medium", "high", "critical"]).toContain(impact.severity)
      expect(impact.score).toBeGreaterThanOrEqual(0)
      expect(impact.score).toBeLessThanOrEqual(1)
      expect(impact.details.length).toBeGreaterThan(0)
    })
  })
})

describe("Risk Engine", () => {
  it("should assess risk with recommended action", async () => {
    const impacts = await analyzeImpacts(mockInput)
    const risk = await assessRisk(mockInput, impacts)
    expect(["proceed", "review", "escalate", "block"]).toContain(risk.recommendedAction)
    expect(risk.factors.length).toBeGreaterThan(0)
    expect(risk.reasoning.length).toBeGreaterThan(0)
  })
})

describe("Comparison Service", () => {
  it("should rank scenarios by value", async () => {
    const r1 = await runSimulation(mockInput)
    const r2 = await runSimulation({ ...mockInput, scenarioType: "send_campaign", title: "Campaign Test" })
    const comparison = compareScenarios([r1, r2])
    expect(comparison.ranking).toHaveLength(2)
    expect(comparison.recommended).toBeTruthy()
  })
})

describe("Approval Workflow", () => {
  it("should flag high-risk simulations", async () => {
    const highRiskInput: SimulationInput = {
      ...mockInput,
      parameters: { recordCount: 100000, hasBackup: false, softDelete: false },
    }
    const result = await runSimulation(highRiskInput)
    expect(requiresApproval(result)).toBe(true)
  })

  it("should create and process approval requests", async () => {
    const result = await runSimulation(mockInput)
    const approval = createApprovalRequest(result, "Tester")
    expect(approval.status).toBe("pending")

    const reviewed = reviewApproval(approval.id, "approved", "Reviewer", "Looks good")
    expect(reviewed?.status).toBe("approved")
    expect(reviewed?.reviewedBy).toBe("Reviewer")
  })
})

describe("Report Service", () => {
  it("should generate comprehensive reports", async () => {
    const result = await runSimulation(mockInput)
    const report = generateReport(result)
    expect(report.title).toContain("Test Simulation")
    expect(report.sections.length).toBeGreaterThan(0)
    expect(report.summary).toBeTruthy()
  })
})
