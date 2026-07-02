"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { Brain, AlertTriangle, ShieldCheck, DollarSign } from "lucide-react"

interface StatsCardsProps {
  totalSimulations: number
  highRiskEvents: number
  preventedIncidents: number
  estimatedSavings: number
}

export function StatsCards({
  totalSimulations,
  highRiskEvents,
  preventedIncidents,
  estimatedSavings,
}: StatsCardsProps) {
  const cards = [
    {
      title: "Simulations Completed",
      value: formatNumber(totalSimulations),
      icon: Brain,
      description: "Total simulations run",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "High-Risk Events",
      value: formatNumber(highRiskEvents),
      icon: AlertTriangle,
      description: "Requiring attention",
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Prevented Incidents",
      value: formatNumber(preventedIncidents),
      icon: ShieldCheck,
      description: "Incidents avoided",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Estimated Savings",
      value: formatCurrency(estimatedSavings),
      icon: DollarSign,
      description: "Cost avoidance",
      color: "text-green-600 dark:text-green-400",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
