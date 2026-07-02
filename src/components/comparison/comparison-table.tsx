"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ComparisonResult } from "@/lib/types"
import { Trophy, ArrowUpDown } from "lucide-react"

interface ComparisonTableProps {
  comparison: ComparisonResult | null
}

const rankColors = ["text-yellow-500", "text-gray-400", "text-amber-600"]

export function ComparisonTable({ comparison }: ComparisonTableProps) {
  if (!comparison || comparison.scenarios.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Scenario Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Run multiple simulations to compare them here
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <ArrowUpDown className="h-4 w-4" />
          Scenario Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left font-medium">Rank</th>
                <th className="pb-2 text-left font-medium">Scenario</th>
                <th className="pb-2 text-right font-medium">Risk Score</th>
                <th className="pb-2 text-right font-medium">Confidence</th>
                <th className="pb-2 text-right font-medium">Value Score</th>
                <th className="pb-2 text-right font-medium">Severity</th>
                <th className="pb-2 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {comparison.ranking.map((rank, i) => {
                const sim = comparison.scenarios.find((s) => s.id === rank.id)
                if (!sim) return null
                const isRecommended = rank.id === comparison.recommended
                return (
                  <tr
                    key={rank.id}
                    className={`border-b last:border-0 ${isRecommended ? "bg-primary/5" : ""}`}
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        {i === 0 && <Trophy className={`h-4 w-4 ${rankColors[i]}`} />}
                        <span className={rankColors[i] || ""}>{i + 1}</span>
                      </div>
                    </td>
                    <td className="py-3 font-medium">{rank.label}</td>
                    <td className="py-3 text-right">
                      <span
                        className={
                          sim.risk.riskScore >= 0.6
                            ? "text-red-500"
                            : sim.risk.riskScore >= 0.35
                              ? "text-amber-500"
                              : "text-emerald-500"
                        }
                      >
                        {(sim.risk.riskScore * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {(sim.risk.confidenceScore * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 text-right font-medium">
                      {(rank.score * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 text-right">
                      <Badge
                        variant={
                          sim.risk.severity === "low"
                            ? "success"
                            : sim.risk.severity === "medium"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {sim.risk.severity}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Badge variant="outline">{sim.risk.recommendedAction}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
