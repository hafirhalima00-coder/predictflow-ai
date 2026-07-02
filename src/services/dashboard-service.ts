import type { SimulationResult, DashboardStats } from '@/lib/types'

const simulationStore: Map<string, SimulationResult> = new Map()

export function storeSimulation(result: SimulationResult): void {
  simulationStore.set(result.id, result)
}

export function getAllSimulations(): SimulationResult[] {
  return Array.from(simulationStore.values()).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )
}

export function getSimulationById(id: string): SimulationResult | null {
  return simulationStore.get(id) ?? null
}

export function getDashboardStats(): DashboardStats {
  const simulations = getAllSimulations()
  const highRisk = simulations.filter(
    (s) => s.risk.severity === 'high' || s.risk.severity === 'critical',
  )
  const prevented = highRisk.filter((s) => s.risk.recommendedAction === 'block').length
  const savings = highRisk.reduce((sum, s) => {
    const financial = s.impacts.find((i) => i.category === 'financial')
    return sum + (financial?.estimatedValue ?? 0)
  }, 0)

  const confidenceSum = simulations.reduce((sum, s) => sum + s.risk.confidenceScore, 0)
  const avgConfidence = simulations.length > 0 ? confidenceSum / simulations.length : 0

  const riskDistribution = [
    { severity: 'low', count: simulations.filter((s) => s.risk.severity === 'low').length },
    { severity: 'medium', count: simulations.filter((s) => s.risk.severity === 'medium').length },
    { severity: 'high', count: simulations.filter((s) => s.risk.severity === 'high').length },
    { severity: 'critical', count: simulations.filter((s) => s.risk.severity === 'critical').length },
  ]

  const simulationsTrend = generateTrend(simulations, 7)
  const confidenceTrend = simulations.map((s) => ({
    date: new Date(s.timestamp).toLocaleDateString(),
    score: s.risk.confidenceScore,
  }))

  return {
    totalSimulations: simulations.length,
    highRiskEvents: highRisk.length,
    preventedIncidents: prevented,
    estimatedSavings: savings,
    approvalRate: 0.82,
    averageConfidence: avgConfidence,
    pendingApprovals: highRisk.length,
    simulationsTrend,
    confidenceTrend,
    riskDistribution,
    recentSimulations: simulations.slice(0, 5),
  }
}

function generateTrend(
  simulations: SimulationResult[],
  days: number,
): Array<{ date: string; count: number }> {
  const trend: Array<{ date: string; count: number }> = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toLocaleDateString()

    const count = simulations.filter((s) => {
      const simDate = new Date(s.timestamp)
      return simDate.toLocaleDateString() === dateStr
    }).length

    trend.push({ date: dateStr, count })
  }

  return trend
}

export function searchSimulations(query: string): SimulationResult[] {
  const q = query.toLowerCase()
  return getAllSimulations().filter(
    (s) =>
      s.input.title.toLowerCase().includes(q) ||
      s.input.description.toLowerCase().includes(q) ||
      s.input.scenarioType.toLowerCase().includes(q) ||
      s.input.department.toLowerCase().includes(q),
  )
}

export function filterSimulations(filters: {
  severity?: string
  type?: string
  dateFrom?: string
  dateTo?: string
}): SimulationResult[] {
  return getAllSimulations().filter((s) => {
    if (filters.severity && s.risk.severity !== filters.severity) return false
    if (filters.type && s.input.scenarioType !== filters.type) return false
    return true
  })
}
