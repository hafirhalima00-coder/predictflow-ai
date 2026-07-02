"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SimulationResult } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Clock, Zap, Shield, CheckCircle, XCircle } from "lucide-react"

interface TimelineViewProps {
  simulations: SimulationResult[]
}

export function TimelineView({ simulations }: TimelineViewProps) {
  if (simulations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Simulation Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            No simulations yet. Run simulations to see them here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Simulation Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {simulations.map((sim, index) => {
            const isLast = index === simulations.length - 1
            const severityColor =
              sim.risk.severity === "critical"
                ? "border-red-500"
                : sim.risk.severity === "high"
                  ? "border-orange-500"
                  : sim.risk.severity === "medium"
                    ? "border-amber-500"
                    : "border-emerald-500"

            return (
              <div key={sim.id} className="relative flex gap-4 pb-8">
                {!isLast && (
                  <div className="absolute left-[15px] top-8 h-full w-px bg-border" />
                )}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background ${severityColor}`}
                >
                  {sim.risk.recommendedAction === "block" ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : sim.risk.recommendedAction === "proceed" ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Shield className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-medium">{sim.input.title}</h4>
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
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {sim.input.scenarioType.replace(/_/g, " ")} &middot;{" "}
                    {sim.input.department}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(new Date(sim.timestamp))}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {sim.executionTimeMs}ms
                    </span>
                    <span>
                      Risk: {(sim.risk.riskScore * 100).toFixed(0)}%
                    </span>
                    <span>
                      Confidence: {(sim.risk.confidenceScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {sim.impacts.map((impact) => (
                      <Badge key={impact.category} variant="outline" className="text-[10px]">
                        {impact.category}: {(impact.score * 100).toFixed(0)}%
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
