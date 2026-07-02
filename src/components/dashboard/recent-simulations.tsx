"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { SimulationResult } from "@/lib/types"

interface RecentSimulationsProps {
  simulations: SimulationResult[]
}

const severityColors: Record<string, "success" | "warning" | "destructive" | "info"> = {
  low: "success",
  medium: "warning",
  high: "destructive",
  critical: "destructive",
}

export function RecentSimulations({ simulations }: RecentSimulationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent Simulations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {simulations.length === 0 && (
            <p className="text-sm text-muted-foreground">No simulations yet. Run your first simulation!</p>
          )}
          {simulations.map((sim) => (
            <div
              key={sim.id}
              className="flex items-center justify-between rounded-lg border p-3 text-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{sim.input.title}</p>
                <p className="text-xs text-muted-foreground">
                  {sim.input.scenarioType.replace(/_/g, " ")} &middot; {formatDate(new Date(sim.timestamp))}
                </p>
              </div>
              <div className="ml-4 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Risk: {(sim.risk.riskScore * 100).toFixed(0)}%
                </span>
                <Badge variant={severityColors[sim.risk.severity]}>
                  {sim.risk.severity}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
