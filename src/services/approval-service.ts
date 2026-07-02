import type { ApprovalRequest, ApprovalStatus, SimulationResult, SeverityLevel } from '@/lib/types'
import { generateId } from '@/lib/utils'

export const HIGH_RISK_THRESHOLD = 0.6

const approvalStore: Map<string, ApprovalRequest> = new Map()

export function requiresApproval(result: SimulationResult): boolean {
  return (
    result.risk.riskScore >= HIGH_RISK_THRESHOLD ||
    result.risk.severity === 'high' ||
    result.risk.severity === 'critical'
  )
}

export function createApprovalRequest(result: SimulationResult, requestedBy: string): ApprovalRequest {
  const request: ApprovalRequest = {
    id: generateId(),
    simulationId: result.id,
    simulationTitle: result.input.title,
    riskScore: result.risk.riskScore,
    severity: result.risk.severity,
    requestedBy,
    requestedAt: new Date(),
    status: 'pending',
    rationale: result.risk.reasoning.join('\n'),
  }

  approvalStore.set(request.id, request)
  return request
}

export function reviewApproval(
  approvalId: string,
  status: Extract<ApprovalStatus, 'approved' | 'rejected'>,
  reviewedBy: string,
  comments?: string,
): ApprovalRequest | null {
  const request = approvalStore.get(approvalId)
  if (!request || request.status !== 'pending') return null

  request.status = status
  request.reviewedBy = reviewedBy
  request.reviewedAt = new Date()
  request.comments = comments

  return request
}

export function getPendingApprovals(): ApprovalRequest[] {
  return Array.from(approvalStore.values()).filter((a) => a.status === 'pending')
}

export function getApprovalById(id: string): ApprovalRequest | null {
  return approvalStore.get(id) ?? null
}

export function getAllApprovals(): ApprovalRequest[] {
  return Array.from(approvalStore.values()).sort(
    (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
  )
}

export function getApprovalStats(): { approved: number; rejected: number; pending: number; rate: number } {
  const all = Array.from(approvalStore.values())
  const approved = all.filter((a) => a.status === 'approved').length
  const rejected = all.filter((a) => a.status === 'rejected').length
  const pending = all.filter((a) => a.status === 'pending').length
  const total = approved + rejected
  return {
    approved,
    rejected,
    pending,
    rate: total > 0 ? approved / total : 0,
  }
}

export async function autoEscalateHighRisk(approvalId: string): Promise<ApprovalRequest | null> {
  const request = approvalStore.get(approvalId)
  if (!request || request.status !== 'pending') return null

  const hoursSinceRequest =
    (Date.now() - new Date(request.requestedAt).getTime()) / (1000 * 60 * 60)

  if (hoursSinceRequest > 4 && request.riskScore >= 0.8) {
    request.status = 'escalated'
  }

  return request
}
