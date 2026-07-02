export type ScenarioType =
  | 'delete_records'
  | 'send_campaign'
  | 'update_price'
  | 'process_refund'
  | 'change_inventory'
  | 'update_policy'
  | 'migrate_data'
  | 'deploy_feature'

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'escalated'

export type ImpactCategory = 'financial' | 'operational' | 'customer' | 'compliance' | 'security'

export interface SimulationInput {
  scenarioType: ScenarioType
  title: string
  description: string
  parameters: Record<string, number | string | boolean>
  department: string
  initiatedBy: string
}

export interface ImpactMetric {
  category: ImpactCategory
  score: number
  description: string
  details: string[]
  severity: SeverityLevel
  estimatedValue?: number
}

export interface RiskAssessment {
  riskScore: number
  confidenceScore: number
  severity: SeverityLevel
  recommendedAction: 'proceed' | 'review' | 'escalate' | 'block'
  reasoning: string[]
  factors: RiskFactor[]
}

export interface RiskFactor {
  name: string
  impact: number
  description: string
}

export interface SimulationResult {
  id: string
  input: SimulationInput
  impacts: ImpactMetric[]
  risk: RiskAssessment
  timestamp: Date
  executionTimeMs: number
  version: string
}

export interface ComparisonResult {
  scenarios: SimulationResult[]
  recommended: string
  ranking: Array<{ id: string; score: number; label: string }>
}

export interface ApprovalRequest {
  id: string
  simulationId: string
  simulationTitle: string
  riskScore: number
  severity: SeverityLevel
  requestedBy: string
  requestedAt: Date
  status: ApprovalStatus
  reviewedBy?: string
  reviewedAt?: Date
  comments?: string
  rationale?: string
}

export interface DashboardStats {
  totalSimulations: number
  highRiskEvents: number
  preventedIncidents: number
  estimatedSavings: number
  approvalRate: number
  averageConfidence: number
  pendingApprovals: number
  simulationsTrend: Array<{ date: string; count: number }>
  confidenceTrend: Array<{ date: string; score: number }>
  riskDistribution: Array<{ severity: string; count: number }>
  recentSimulations: SimulationResult[]
}

export interface Report {
  id: string
  simulationId: string
  title: string
  summary: string
  sections: ReportSection[]
  generatedAt: Date
  generatedBy: string
}

export interface ReportSection {
  title: string
  content: string
  type: 'text' | 'table' | 'chart' | 'risk'
  data?: unknown
}

export interface FlowNodeData {
  label: string
  type: 'input' | 'process' | 'impact' | 'risk' | 'output'
  status?: 'pending' | 'running' | 'completed' | 'error'
  details?: string
  score?: number
}

export interface Notification {
  id: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  description: string
  timestamp: Date
  read: boolean
}

export const ScenarioLabels: Record<ScenarioType, string> = {
  delete_records: 'Delete Records',
  send_campaign: 'Send Campaign',
  update_price: 'Update Price',
  process_refund: 'Process Refund',
  change_inventory: 'Change Inventory',
  update_policy: 'Update Policy',
  migrate_data: 'Migrate Data',
  deploy_feature: 'Deploy Feature',
}

export const ScenarioIcons: Record<ScenarioType, string> = {
  delete_records: 'trash2',
  send_campaign: 'send',
  update_price: 'dollar-sign',
  process_refund: 'rotate-ccw',
  change_inventory: 'package',
  update_policy: 'file-text',
  migrate_data: 'database',
  deploy_feature: 'rocket',
}
