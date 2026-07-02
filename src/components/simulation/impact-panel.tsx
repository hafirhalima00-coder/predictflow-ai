"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { ImpactMetric } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { AlertTriangle, DollarSign, Users, Shield, FileCheck } from "lucide-react"

const categoryIcons = {
  financial: DollarSign,
  operational: AlertTriangle,
  customer: Users,
  compliance: FileCheck,
  security: Shield,
}

const categoryLabels: Record<string, string> = {
  financial: "Financial",
  operational: "Operational",
  customer: "Customer",
  compliance: "Compliance",
  security: "Security",
}

const severityColors: Record<string, "success" | "warning" | "destructive" | "info"> = {
  low: "success",
  medium: "warning",
  high: "destructive",
  critical: "destructive",
}

interface ImpactPanelProps {
  impacts: ImpactMetric[]
}

export function ImpactPanel({ impacts }: ImpactPanelProps) {
  return (
    <div className="space-y-3">
      {impacts.map((impact) => {
        const Icon = categoryIcons[impact.category]
        return (
          <Card key={impact.category}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-medium">
                    {categoryLabels[impact.category]}
                  </CardTitle>
                </div>
                <Badge variant={severityColors[impact.severity]}>
                  {impact.severity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-xs text-muted-foreground">{impact.description}</p>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Impact Score</span>
                <span className="font-medium">{(impact.score * 100).toFixed(0)}%</span>
              </div>
              <Progress value={impact.score * 100} className="mb-3" />
              {impact.estimatedValue != null && (
                <p className="text-xs text-muted-foreground">
                  Estimated value: {formatCurrency(impact.estimatedValue)}
                </p>
              )}
              <ul className="mt-2 space-y-1">
                {impact.details.map((detail, i) => (
                  <li key={i} className="text-xs text-muted-foreground">
                    &bull; {detail}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
