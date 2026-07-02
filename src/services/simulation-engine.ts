import {
  type SimulationInput,
  type SimulationResult,
  type ImpactMetric,
  type RiskAssessment,
  type SeverityLevel,
} from '@/lib/types'
import { generateId } from '@/lib/utils'
import { analyzeImpacts } from './impact-analysis'
import { assessRisk } from './risk-engine'

export async function runSimulation(input: SimulationInput): Promise<SimulationResult> {
  const startTime = performance.now()

  const impacts = await analyzeImpacts(input)
  const risk = await assessRisk(input, impacts)
  const overallSeverity = calculateOverallSeverity(impacts, risk)

  const executionTimeMs = Math.round(performance.now() - startTime)

  const result: SimulationResult = {
    id: generateId(),
    input,
    impacts,
    risk: { ...risk, severity: overallSeverity },
    timestamp: new Date(),
    executionTimeMs,
    version: '1.0.0',
  }

  return result
}

function calculateOverallSeverity(impacts: ImpactMetric[], risk: RiskAssessment): SeverityLevel {
  const severityScores: Record<SeverityLevel, number> = {
    low: 0,
    medium: 1,
    high: 2,
    critical: 3,
  }

  const maxImpactSeverity = Math.max(...impacts.map((i) => severityScores[i.severity]))
  const riskSeverity = severityScores[risk.severity]

  const combined = Math.max(maxImpactSeverity, riskSeverity)

  const levels: SeverityLevel[] = ['low', 'medium', 'high', 'critical']
  return levels[combined]
}

export function generateScenarioParameters(scenarioType: string): Record<string, number | string | boolean> {
  const defaults: Record<string, Record<string, number | string | boolean>> = {
    delete_records: { recordCount: 1000, tableName: 'users', hasBackup: true, softDelete: true },
    send_campaign: { recipients: 50000, campaignType: 'promotional', segmentSize: 10000, aTestEnabled: true },
    update_price: { productCount: 50, priceChangePercent: 15, appliesTo: 'all_customers', effectiveImmediately: false },
    process_refund: { refundCount: 200, totalAmount: 15000, refundMethod: 'original_payment', requiresApproval: true },
    change_inventory: { skuCount: 100, adjustmentType: 'decrease', adjustmentPercent: 25, affectsBackorders: true },
    update_policy: { policyArea: 'privacy', userImpact: 'all', requiresConsent: true, gracePeriod: 30 },
    migrate_data: { recordCount: 100000, sourceSystem: 'legacy_db', targetSystem: 'new_platform', downtimeMinutes: 15 },
    deploy_feature: { featureName: 'checkout_v2', trafficPercent: 10, canaryEnabled: true, rollbackPlan: true },
  }

  return (defaults[scenarioType] || defaults.delete_records) as Record<string, number | string | boolean>
}
