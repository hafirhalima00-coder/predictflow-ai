import type { SimulationResult } from '@/lib/types'
import { generateId } from '@/lib/utils'

export interface ExecutionContext {
  simulationId: string
  approvedBy: string
  approvedAt: Date
}

export type ExecutionStatus = 'pending' | 'executing' | 'completed' | 'rolled_back' | 'monitoring' | 'failed'

export interface Execution {
  id: string
  simulationId: string
  status: ExecutionStatus
  startedAt: Date
  completedAt?: Date
  executedBy: string
  beforeState: SystemState
  afterState?: SystemState
  rollbackAvailable: boolean
  sideEffects: SideEffect[]
  monitoringActive: boolean
}

export interface SystemState {
  timestamp: Date
  snapshot: Record<string, unknown>
  affectedResources: string[]
  checksum: string
}

export interface SideEffect {
  id: string
  detected: boolean
  predicted: boolean
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  detectedAt?: Date
}

const executionStore: Map<string, Execution> = new Map()

function computeChecksum(state: Record<string, unknown>): string {
  const str = JSON.stringify(state)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return `chk_${Math.abs(hash).toString(16)}`
}

export function createBeforeState(input: { scenarioType: string; parameters: Record<string, unknown> }): SystemState {
  const snapshots: Record<string, Record<string, unknown>> = {
    delete_records: {
      tableSize: 100000,
      indexIntegrity: 1.0,
      foreignKeys: 47,
      dependentViews: 12,
      backups: 3,
      lastBackup: new Date(Date.now() - 86400000).toISOString(),
    },
    send_campaign: {
      recipientCount: 0,
      deliveryRate: 0.99,
      openRate: 0.0,
      bounceRate: 0.0,
      unsubscribes: 0,
      reputationScore: 98,
      dailyLimit: 100000,
      sentToday: 0,
    },
    update_price: {
      activeProducts: 50,
      avgPrice: 49.99,
      priceChangesLast24h: 0,
      pendingOrders: 120,
      cartAbandonmentRate: 0.68,
    },
    process_refund: {
      totalRefunds: 200,
      refundRate: 0.04,
      accountBalance: 1500000,
      pendingPayouts: 34000,
      fraudFlags: 2,
    },
    change_inventory: {
      totalSKUs: 500,
      stockLevel: 'adequate',
      backorders: 5,
      reorderPoints: 100,
      warehouseCapacity: 0.72,
    },
    update_policy: {
      policyVersion: '3.2',
      consentRecords: 50000,
      lastAuditDate: new Date(Date.now() - 30 * 86400000).toISOString(),
      pendingNotifications: 0,
    },
    migrate_data: {
      sourceRecords: 100000,
      targetRecords: 0,
      syncStatus: 'idle',
      lastSync: new Date(Date.now() - 7 * 86400000).toISOString(),
      integrityScore: 1.0,
    },
    deploy_feature: {
      canaryPercent: 0,
      errorRate: 0.001,
      p99Latency: 150,
      activeUsers: 50000,
      featureFlags: { checkout_v2: false },
    },
  }

  const snapshot = snapshots[input.scenarioType as keyof typeof snapshots] || snapshots.delete_records
  const resources = Object.keys(snapshot)

  return {
    timestamp: new Date(),
    snapshot,
    affectedResources: resources,
    checksum: computeChecksum(snapshot),
  }
}

export function predictSideEffects(result: SimulationResult): SideEffect[] {
  const effects: SideEffect[] = []

  effects.push({
    id: generateId(),
    predicted: true,
    detected: false,
    description: `Direct impact: ${result.input.scenarioType.replace(/_/g, ' ')}`,
    severity: result.risk.severity,
  })

  if (result.risk.riskScore >= 0.3) {
    effects.push({
      id: generateId(),
      predicted: true,
      detected: false,
      description: 'Potential cascading effects on dependent systems',
      severity: 'medium',
    })
  }

  const financialImpact = result.impacts.find((i) => i.category === 'financial')
  if (financialImpact && financialImpact.score >= 0.5) {
    effects.push({
      id: generateId(),
      predicted: true,
      detected: false,
      description: 'Revenue impact may trigger billing reconciliation',
      severity: 'high',
    })
  }

  const customerImpact = result.impacts.find((i) => i.category === 'customer')
  if (customerImpact && customerImpact.score >= 0.6) {
    effects.push({
      id: generateId(),
      predicted: true,
      detected: false,
      description: 'Customer-facing changes may increase support tickets',
      severity: 'medium',
    })
  }

  const complianceImpact = result.impacts.find((i) => i.category === 'compliance')
  if (complianceImpact && complianceImpact.score >= 0.7) {
    effects.push({
      id: generateId(),
      predicted: true,
      detected: false,
      description: 'Regulatory reporting may be required within 72 hours',
      severity: 'critical',
    })
  }

  return effects
}

export function startExecution(
  simulationId: string,
  executedBy: string,
  beforeState: SystemState,
): Execution {
  const execution: Execution = {
    id: generateId(),
    simulationId,
    status: 'executing',
    startedAt: new Date(),
    executedBy,
    beforeState,
    rollbackAvailable: true,
    sideEffects: [],
    monitoringActive: false,
  }

  executionStore.set(execution.id, execution)
  return execution
}

export function completeExecution(
  executionId: string,
  sideEffects: SideEffect[],
  additionalEffects: SideEffect[] = [],
): Execution | null {
  const execution = executionStore.get(executionId)
  if (!execution) return null

  const allSideEffects = [...sideEffects, ...additionalEffects]

  const afterState = generateAfterState(execution.beforeState)

  execution.status = 'completed'
  execution.completedAt = new Date()
  execution.sideEffects = allSideEffects
  execution.afterState = afterState
  execution.monitoringActive = true

  return execution
}

function generateAfterState(before: SystemState): SystemState {
  const after = { ...before.snapshot }
  const delta: Record<string, unknown> = {}

  for (const key of Object.keys(after)) {
    const val = after[key]
    if (typeof val === 'number') {
      const change = (Math.random() - 0.5) * 0.1 * Math.abs(val)
      after[key] = Math.round(val + change)
      delta[key] = after[key]
    }
  }

  return {
    timestamp: new Date(),
    snapshot: after,
    affectedResources: before.affectedResources,
    checksum: computeChecksum(after),
  }
}

export function rollbackExecution(executionId: string): { success: boolean; message: string } {
  const execution = executionStore.get(executionId)
  if (!execution) return { success: false, message: 'Execution not found' }
  if (!execution.rollbackAvailable) return { success: false, message: 'Rollback not available' }

  execution.status = 'rolled_back'
  execution.afterState = execution.beforeState
  execution.rollbackAvailable = false

  return { success: true, message: 'Successfully rolled back to pre-execution state' }
}

export function detectSideEffect(executionId: string, effectDescription: string): SideEffect | null {
  const execution = executionStore.get(executionId)
  if (!execution) return null

  const unpredicted: SideEffect = {
    id: generateId(),
    detected: true,
    predicted: false,
    description: effectDescription,
    severity: 'high',
    detectedAt: new Date(),
  }

  execution.sideEffects.push(unpredicted)
  return unpredicted
}

export function getExecutionById(id: string): Execution | null {
  return executionStore.get(id) ?? null
}

export function getExecutionsBySimulation(simulationId: string): Execution[] {
  return Array.from(executionStore.values()).filter((e) => e.simulationId === simulationId)
}

export function getAllExecutions(): Execution[] {
  return Array.from(executionStore.values()).sort(
    (a, b) => b.startedAt.getTime() - a.startedAt.getTime(),
  )
}

export function generateDiffView(before: SystemState, after?: SystemState): DiffEntry[] {
  if (!after) return []

  const entries: DiffEntry[] = []

  for (const key of Object.keys(before.snapshot)) {
    const beforeVal = before.snapshot[key]
    const afterVal = after.snapshot[key]

    if (beforeVal !== afterVal) {
      entries.push({
        field: key,
        before: beforeVal,
        after: afterVal,
        changed: true,
      })
    } else {
      entries.push({
        field: key,
        before: beforeVal,
        after: afterVal,
        changed: false,
      })
    }
  }

  return entries
}

export interface DiffEntry {
  field: string
  before: unknown
  after: unknown
  changed: boolean
}
