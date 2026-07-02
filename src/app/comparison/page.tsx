"use client"

import { useState, useEffect } from "react"
import { getAllSimulations } from "@/services/dashboard-service"
import { compareScenarios } from "@/services/comparison-service"
import { ComparisonTable } from "@/components/comparison/comparison-table"
import { ComparisonChart } from "@/components/comparison/comparison-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { SimulationResult, ComparisonResult } from "@/lib/types"
import { GitCompare, GitCompareArrows, Trophy, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ComparisonPage() {
  const [simulations, setSimulations] = useState<SimulationResult[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [comparison, setComparison] = useState<ComparisonResult | null>(null)

  useEffect(() => {
    setSimulations(getAllSimulations())
  }, [])

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleCompare = () => {
    const selectedSims = simulations.filter((s) => selected.has(s.id))
    if (selectedSims.length >= 2) {
      setComparison(compareScenarios(selectedSims))
    }
  }

  const selectAll = () => {
    setSelected(new Set(simulations.map((s) => s.id)))
  }

  const clearSelection = () => {
    setSelected(new Set())
    setComparison(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Scenario Comparison</h1>
        <p className="text-sm text-muted-foreground">
          Compare multiple scenarios side by side to find the optimal action
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Select Scenarios to Compare
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={clearSelection}>
                Clear
              </Button>
              <Button
                size="sm"
                disabled={selected.size < 2}
                onClick={handleCompare}
                className="gap-2"
              >
                <GitCompareArrows className="h-4 w-4" />
                Compare ({selected.size})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {simulations.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <GitCompare className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No simulations found. Run at least 2 simulations first.
              </p>
              <Link href="/simulation">
                <Button variant="link" size="sm">
                  Go to Simulation Studio
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {simulations.map((sim) => (
                <label
                  key={sim.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent ${
                    selected.has(sim.id) ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <Checkbox
                    checked={selected.has(sim.id)}
                    onCheckedChange={() => toggleSelect(sim.id)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{sim.input.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {sim.input.scenarioType.replace(/_/g, " ")} &middot;{" "}
                      Risk: {(sim.risk.riskScore * 100).toFixed(0)}%
                    </p>
                  </div>
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
                </label>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {comparison && (
        <>
          <Card className="border-emerald-500/50 bg-emerald-500/5">
            <CardContent className="flex items-center gap-3 py-4">
              <Trophy className="h-6 w-6 text-emerald-500" />
              <div>
                <p className="font-medium text-emerald-700 dark:text-emerald-300">
                  Recommended Scenario
                </p>
                <p className="text-sm text-muted-foreground">
                  {
                    comparison.scenarios.find((s) => s.id === comparison.recommended)?.input
                      .title
                  }{" "}
                  has the best risk-value balance
                </p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto gap-1" asChild>
                <Link href={`/reports?comparison=${comparison.scenarios.map(s => s.id).join(',')}`}>
                  <ArrowRight className="h-3 w-3" />
                  View Report
                </Link>
              </Button>
            </CardContent>
          </Card>

          <ComparisonTable comparison={comparison} />
          <ComparisonChart comparison={comparison} />
        </>
      )}
    </div>
  )
}
