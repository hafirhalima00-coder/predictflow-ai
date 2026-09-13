import type { SimulationResult } from '@/lib/types'
import { generateId } from '@/lib/utils'

export interface SafetyNetEvent {
  id: string
  executionId: string
  type: 'unpredicted_side_effect' | 'threshold_breach' | 'anomaly_detected' | 'cascade_warning' | 'auto_rollback'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  details: string
  detectedAt: Date
  wasPredicted: boolean
  autoAction?: string
}

export interface SafetyNetResult {
  safe: boolean
  events: SafetyNetEvent[]
  shouldRollback: boolean
  confidenceInPrediction: number
}

const safetyNetStore: Map<string, SafetyNetEvent[]> = new Map()

export function monitorExecution(
  executionId: string,
  simulation: SimulationResult,
): SafetyNetResult {
  const events: SafetyNetEvent[] = []

  const unpredictedRisk = Math.random() < 0.15
  if (unpredictedRisk) {
    events.push({
      id: generateId(),
      executionId,
      type: 'unpredicted_side_effect',
      severity: 'high',
      message: 'Unpredicted side effect detected',
      details: 'Cross-service dependency triggered unexpected cascade. This effect was not in the original simulation prediction.',
      detectedAt: new Date(),
      wasPredicted: false,
    })
  }

  const complianceImpact = simulation.impacts.find((i) => i.category === 'compliance')
  if (complianceImpact && complianceImpact.score >= 0.7 && Math.random() < 0.3) {
    events.push({
      id: generateId(),
      executionId,
      type: 'threshold_breach',
      severity: 'critical',
      message: 'Compliance threshold breached beyond prediction',
      details: `Predicted compliance impact: ${(complianceImpact.score * 100).toFixed(0)}%. Actual impact exceeded threshold. Auto-rollback recommended.`,
      detectedAt: new Date(),
      wasPredicted: true,
      autoAction: 'auto_rollback',
    })
  }

  if (Math.random() < 0.08) {
    events.push({
      id: generateId(),
      executionId,
      type: 'anomaly_detected',
      severity: 'medium',
      message: 'Behavioral anomaly detected',
      details: 'System behavior deviates from predicted pattern. Performance degradation in dependent services.',
      detectedAt: new Date(),
      wasPredicted: false,
    })
  }

  if (events.some((e) => e.severity === 'critical')) {
    events.push({
      id: generateId(),
      executionId,
      type: 'auto_rollback',
      severity: 'critical',
      message: 'AUTO-ROLLBACK TRIGGERED',
      details: 'Safety net detected critical failure. Rolling back execution automatically to prevent further damage.',
      detectedAt: new Date(),
      wasPredicted: false,
      autoAction: 'auto_rollback',
    })
  }

  const stored = safetyNetStore.get(executionId) || []
  stored.push(...events)
  safetyNetStore.set(executionId, stored)

  const shouldRollback = events.some((e) => e.type === 'auto_rollback')
  const safe = events.length === 0
  const confidenceInPrediction = Math.max(0, 1 - events.length * 0.15 - (unpredictedRisk ? 0.3 : 0))

  return { safe, events, shouldRollback, confidenceInPrediction }
}

export function getSafetyNetEvents(executionId: string): SafetyNetEvent[] {
  return safetyNetStore.get(executionId) || []
}

export function generateFailureReport(executionId: string): string {
  const events = safetyNetStore.get(executionId) || []
  if (events.length === 0) {
    return 'No failures detected. Simulation predictions were accurate.'
  }

  const unpredicted = events.filter((e) => !e.wasPredicted)
  const predicted = events.filter((e) => e.wasPredicted)

  let report = `Safety Net Failure Report for Execution ${executionId}\n`
  report += `Total events: ${events.length}\n`
  report += `Unpredicted events: ${unpredicted.length}\n`
  report += `Predicted events caught: ${predicted.length}\n\n`

  if (unpredicted.length > 0) {
    report += 'UNPREDICTED SIDE EFFECTS (simulation gap):\n'
    for (const event of unpredicted) {
      report += `  - ${event.type}: ${event.message}\n    ${event.details}\n`
    }
  }

  report += '\nLESSON: The simulation under-predicted the impact. '
  report += 'The safety net caught these effects post-execution. '
  report += 'This demonstrates why simulation alone is not enough - '
  report += 'you need monitoring as a second layer of protection.'

  return report
}
