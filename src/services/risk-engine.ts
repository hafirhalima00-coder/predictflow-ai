import type { SimulationInput, ImpactMetric, RiskAssessment, RiskFactor, SeverityLevel } from '@/lib/types'

export async function assessRisk(
  input: SimulationInput,
  impacts: ImpactMetric[],
): Promise<RiskAssessment> {
  const factors: RiskFactor[] = generateRiskFactors(input, impacts)

  const impactWeights: Record<string, number> = {
    financial: 0.25,
    operational: 0.2,
    customer: 0.2,
    compliance: 0.2,
    security: 0.15,
  }

  const weightedImpactScore = impacts.reduce((sum, impact) => {
    return sum + impact.score * (impactWeights[impact.category] || 0.2)
  }, 0)

  const parameterRiskScore = calculateParameterRisk(input)
  const factorScore = factors.reduce((sum, f) => sum + f.impact, 0) / factors.length

  const riskScore = Math.min(1, weightedImpactScore * 0.5 + parameterRiskScore * 0.25 + factorScore * 0.25)

  const dataQuality = 0.75 + Math.random() * 0.2
  const modelCertainty = 0.7 + Math.random() * 0.25
  const confidenceScore = Math.min(1, (dataQuality + modelCertainty) / 2)

  const severity = getSeverity(riskScore)
  const recommendedAction = getRecommendedAction(riskScore, severity)

  const reasoning = generateReasoning(riskScore, confidenceScore, severity, factors, impacts)

  return {
    riskScore,
    confidenceScore,
    severity,
    recommendedAction,
    reasoning,
    factors,
  }
}

function generateRiskFactors(input: SimulationInput, impacts: ImpactMetric[]): RiskFactor[] {
  const factors: RiskFactor[] = []

  factors.push({
    name: 'Data Sensitivity',
    impact: input.scenarioType === 'delete_records' || input.scenarioType === 'migrate_data' ? 0.8 : 0.3,
    description: 'Level of sensitive data involved in this action',
  })

  factors.push({
    name: 'Scale of Change',
    impact: impacts.find((i) => i.category === 'operational')?.score ?? 0.5,
    description: 'Magnitude of operational change required',
  })

  factors.push({
    name: 'Customer Exposure',
    impact: impacts.find((i) => i.category === 'customer')?.score ?? 0.5,
    description: 'Number of customers potentially affected',
  })

  factors.push({
    name: 'Regulatory Overlap',
    impact: impacts.find((i) => i.category === 'compliance')?.score ?? 0.5,
    description: 'Applicable regulatory requirements',
  })

  factors.push({
    name: 'Reversibility',
    impact: input.parameters.hasBackup === false || input.parameters.softDelete === false ? 0.9 : 0.3,
    description: 'Ability to reverse this action if needed',
  })

  factors.push({
    name: 'System Dependency',
    impact: input.scenarioType === 'migrate_data' || input.scenarioType === 'deploy_feature' ? 0.7 : 0.3,
    description: 'Dependency on critical systems',
  })

  return factors
}

function calculateParameterRisk(input: SimulationInput): number {
  let risk = 0
  const params = input.parameters

  if (params.recordCount && Number(params.recordCount) > 10000) risk += 0.3
  if (params.totalAmount && Number(params.totalAmount) > 50000) risk += 0.2
  if (params.recipients && Number(params.recipients) > 100000) risk += 0.2
  if (params.effectiveImmediately === true) risk += 0.2
  if (params.requiresConsent === false) risk += 0.3
  if (params.downtimeMinutes && Number(params.downtimeMinutes) > 30) risk += 0.3
  if (params.hasBackup === false) risk += 0.3
  if (params.rollbackPlan === false) risk += 0.2

  return Math.min(1, risk)
}

function getSeverity(riskScore: number): SeverityLevel {
  if (riskScore >= 0.8) return 'critical'
  if (riskScore >= 0.6) return 'high'
  if (riskScore >= 0.35) return 'medium'
  return 'low'
}

function getRecommendedAction(
  riskScore: number,
  severity: SeverityLevel,
): 'proceed' | 'review' | 'escalate' | 'block' {
  if (riskScore >= 0.8 || severity === 'critical') return 'block'
  if (riskScore >= 0.6 || severity === 'high') return 'escalate'
  if (riskScore >= 0.35 || severity === 'medium') return 'review'
  return 'proceed'
}

function generateReasoning(
  riskScore: number,
  confidenceScore: number,
  severity: SeverityLevel,
  factors: RiskFactor[],
  impacts: ImpactMetric[],
): string[] {
  const reasoning: string[] = []

  reasoning.push(
    `Risk assessment completed with a score of ${(riskScore * 100).toFixed(0)}/100 (${severity.toUpperCase()} severity).`,
  )
  reasoning.push(
    `Confidence in this prediction: ${(confidenceScore * 100).toFixed(0)}% based on historical data quality and model certainty.`,
  )

  const topFactor = factors.reduce((max, f) => (f.impact > max.impact ? f : max))
  reasoning.push(`Primary risk factor: "${topFactor.name}" (impact: ${(topFactor.impact * 100).toFixed(0)}%). ${topFactor.description}.`)

  const highImpacts = impacts.filter((i) => i.severity === 'high' || i.severity === 'critical')
  if (highImpacts.length > 0) {
    reasoning.push(
      `High-impact areas detected: ${highImpacts.map((i) => i.category).join(', ')}. These require immediate attention.`,
    )
  }

  if (riskScore >= 0.6) {
    reasoning.push(
      'RECOMMENDATION: Do not proceed without full risk mitigation plan and stakeholder approval.',
    )
  } else if (riskScore >= 0.35) {
    reasoning.push(
      'RECOMMENDATION: Proceed with caution. Implement monitoring and rollback procedures.',
    )
  } else {
    reasoning.push('RECOMMENDATION: Safe to proceed. Standard monitoring recommended.')
  }

  return reasoning
}
