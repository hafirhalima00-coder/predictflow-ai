import type { SimulationInput, ImpactMetric, ImpactCategory, SeverityLevel } from '@/lib/types'

interface ImpactConfig {
  financial: { base: number; volatility: number }
  operational: { base: number; volatility: number }
  customer: { base: number; volatility: number }
  compliance: { base: number; volatility: number }
  security: { base: number; volatility: number }
}

const scenarioImpactConfigs: Record<string, ImpactConfig> = {
  delete_records: {
    financial: { base: 0.7, volatility: 0.2 },
    operational: { base: 0.8, volatility: 0.15 },
    customer: { base: 0.6, volatility: 0.25 },
    compliance: { base: 0.85, volatility: 0.1 },
    security: { base: 0.5, volatility: 0.3 },
  },
  send_campaign: {
    financial: { base: 0.3, volatility: 0.2 },
    operational: { base: 0.2, volatility: 0.15 },
    customer: { base: 0.6, volatility: 0.2 },
    compliance: { base: 0.7, volatility: 0.15 },
    security: { base: 0.2, volatility: 0.15 },
  },
  update_price: {
    financial: { base: 0.8, volatility: 0.1 },
    operational: { base: 0.3, volatility: 0.1 },
    customer: { base: 0.75, volatility: 0.15 },
    compliance: { base: 0.3, volatility: 0.1 },
    security: { base: 0.1, volatility: 0.1 },
  },
  process_refund: {
    financial: { base: 0.5, volatility: 0.15 },
    operational: { base: 0.4, volatility: 0.15 },
    customer: { base: 0.4, volatility: 0.2 },
    compliance: { base: 0.6, volatility: 0.15 },
    security: { base: 0.3, volatility: 0.15 },
  },
  change_inventory: {
    financial: { base: 0.6, volatility: 0.15 },
    operational: { base: 0.7, volatility: 0.15 },
    customer: { base: 0.5, volatility: 0.2 },
    compliance: { base: 0.2, volatility: 0.1 },
    security: { base: 0.15, volatility: 0.1 },
  },
  update_policy: {
    financial: { base: 0.4, volatility: 0.2 },
    operational: { base: 0.5, volatility: 0.2 },
    customer: { base: 0.7, volatility: 0.15 },
    compliance: { base: 0.9, volatility: 0.1 },
    security: { base: 0.5, volatility: 0.2 },
  },
  migrate_data: {
    financial: { base: 0.6, volatility: 0.2 },
    operational: { base: 0.85, volatility: 0.1 },
    customer: { base: 0.5, volatility: 0.25 },
    compliance: { base: 0.75, volatility: 0.15 },
    security: { base: 0.8, volatility: 0.15 },
  },
  deploy_feature: {
    financial: { base: 0.3, volatility: 0.15 },
    operational: { base: 0.4, volatility: 0.2 },
    customer: { base: 0.6, volatility: 0.2 },
    compliance: { base: 0.2, volatility: 0.1 },
    security: { base: 0.4, volatility: 0.2 },
  },
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

function calculateImpact(
  config: ImpactConfig,
  category: ImpactCategory,
  seed: number,
): { score: number; estimatedValue: number; severity: SeverityLevel; description: string; details: string[] } {
  const cfg = config[category]
  const random = seededRandom(seed + category.length)
  const noise = (random - 0.5) * cfg.volatility * 2
  const score = Math.max(0, Math.min(1, cfg.base + noise))

  let estimatedValue: number
  let severity: SeverityLevel

  if (score >= 0.8) {
    severity = 'critical'
    estimatedValue = score * 500000
  } else if (score >= 0.6) {
    severity = 'high'
    estimatedValue = score * 200000
  } else if (score >= 0.3) {
    severity = 'medium'
    estimatedValue = score * 50000
  } else {
    severity = 'low'
    estimatedValue = score * 10000
  }

  const descriptions: Record<ImpactCategory, string> = {
    financial: 'Estimated financial exposure from this action',
    operational: 'Impact on operational efficiency and workflows',
    customer: 'Effect on customer experience and satisfaction',
    compliance: 'Regulatory and compliance risk assessment',
    security: 'Security posture and data protection impact',
  }

  const detailsMap: Record<ImpactCategory, string[]> = {
    financial: [
      `Direct cost impact: ${score >= 0.6 ? 'Significant' : 'Moderate'} financial exposure`,
      `Revenue at risk: ${(estimatedValue * 0.4).toLocaleString()} USD`,
      `Operational cost increase: ${(estimatedValue * 0.15).toLocaleString()} USD`,
    ],
    operational: [
      `Process disruption: ${score >= 0.7 ? 'Major' : 'Minor'} workflow changes expected`,
      `Team hours affected: ${Math.round(score * 200)} person-hours`,
      `System downtime risk: ${score >= 0.5 ? 'Possible' : 'Unlikely'}`,
    ],
    customer: [
      `Customers affected: ${score >= 0.6 ? 'Broad' : 'Limited'} segment impact`,
      `Satisfaction impact: ${score >= 0.5 ? 'Negative trend expected' : 'Minimal change'}`,
      `Support ticket increase: ${Math.round(score * 300)}% expected surge`,
    ],
    compliance: [
      `Regulatory exposure: ${score >= 0.7 ? 'High scrutiny required' : 'Standard review'}`,
      `GDPR/SOX considerations: ${score >= 0.6 ? 'Applicable' : 'Not applicable'}`,
      `Documentation required: ${score >= 0.4 ? 'Extensive' : 'Minimal'}`,
    ],
    security: [
      `Data exposure risk: ${score >= 0.7 ? 'Critical' : score >= 0.4 ? 'Moderate' : 'Low'}`,
      `Access control changes: ${score >= 0.5 ? 'Required' : 'Not required'}`,
      `Audit trail impact: ${score >= 0.3 ? 'Enhanced logging needed' : 'Standard logging'}`,
    ],
  }

  return {
    score,
    estimatedValue,
    severity,
    description: descriptions[category],
    details: detailsMap[category],
  }
}

export async function analyzeImpacts(input: SimulationInput): Promise<ImpactMetric[]> {
  const config = scenarioImpactConfigs[input.scenarioType] || scenarioImpactConfigs.delete_records
  const seed = input.scenarioType.length + Object.keys(input.parameters).length

  const categories: ImpactCategory[] = ['financial', 'operational', 'customer', 'compliance', 'security']

  return categories.map((category, index) => {
    const result = calculateImpact(config, category, seed + index)
    return {
      category,
      score: result.score,
      description: result.description,
      details: result.details,
      severity: result.severity,
      estimatedValue: result.estimatedValue,
    }
  })
}
