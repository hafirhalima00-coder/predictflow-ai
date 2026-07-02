"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { RiskAssessment } from "@/lib/types"

interface RiskScoreProps {
  risk: RiskAssessment
}

const actionColors: Record<string, string> = {
  proceed: "text-emerald-600 dark:text-emerald-400",
  review: "text-amber-600 dark:text-amber-400",
  escalate: "text-orange-600 dark:text-orange-400",
  block: "text-red-600 dark:text-red-400",
}

const actionLabels: Record<string, string> = {
  proceed: "Proceed",
  review: "Review Required",
  escalate: "Escalate",
  block: "Blocked",
}

const severityColors: Record<string, "success" | "warning" | "destructive" | "info"> = {
  low: "success",
  medium: "warning",
  high: "destructive",
  critical: "destructive",
}

export function RiskScore({ risk }: RiskScoreProps) {
  const riskPercent = Math.round(risk.riskScore * 100)
  const confidencePercent = Math.round(risk.confidenceScore * 100)
  const riskColor =
    riskPercent >= 80 ? "bg-red-500" : riskPercent >= 60 ? "bg-orange-500" : riskPercent >= 35 ? "bg-amber-500" : "bg-emerald-500"

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium">Risk Assessment</h3>
          <Badge variant={severityColors[risk.severity]}>
            {risk.severity.toUpperCase()}
          </Badge>
        </div>

        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span>Risk Score</span>
            <span className="font-bold">{riskPercent}/100</span>
          </div>
          <Progress value={riskPercent} className={riskColor} />
        </div>

        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span>Confidence</span>
            <span className="font-bold">{confidencePercent}%</span>
          </div>
          <Progress value={confidencePercent} />
        </div>

        <div className="mb-4 rounded-lg border p-3">
          <p className="mb-1 text-xs text-muted-foreground">Recommended Action</p>
          <p className={`text-lg font-bold ${actionColors[risk.recommendedAction]}`}>
            {actionLabels[risk.recommendedAction]}
          </p>
        </div>

        <div className="space-y-2">
          {risk.reasoning.map((line, i) => (
            <p key={i} className="text-xs text-muted-foreground">
              {line}
            </p>
          ))}
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Risk Factors</p>
          {risk.factors.map((factor) => (
            <div key={factor.name} className="mb-2">
              <div className="flex items-center justify-between text-xs">
                <span>{factor.name}</span>
                <span>{(factor.impact * 100).toFixed(0)}%</span>
              </div>
              <Progress value={factor.impact * 100} className="h-1.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
