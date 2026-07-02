import type { SimulationResult, ComparisonResult } from '@/lib/types'

export function compareScenarios(results: SimulationResult[]): ComparisonResult {
  const scored = results.map((r) => {
    const impactScore = r.impacts.reduce((sum, i) => sum + i.score, 0) / r.impacts.length
    const valueScore = 1 - impactScore
    const confidenceWeight = r.risk.confidenceScore
    const finalScore = valueScore * 0.6 + confidenceWeight * 0.4

    return {
      id: r.id,
      score: finalScore,
      label: r.input.title,
    }
  })

  scored.sort((a, b) => b.score - a.score)

  const recommended = scored[0]?.id ?? ''

  return {
    scenarios: results,
    recommended,
    ranking: scored,
  }
}

export function getOptimalScenario(results: SimulationResult[]): SimulationResult | null {
  if (results.length === 0) return null
  const comparison = compareScenarios(results)
  const recommendedId = comparison.recommended
  return results.find((r) => r.id === recommendedId) ?? null
}
