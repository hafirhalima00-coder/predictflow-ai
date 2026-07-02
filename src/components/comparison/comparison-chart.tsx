"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { ComparisonResult } from "@/lib/types"

interface ComparisonChartProps {
  comparison: ComparisonResult | null
}

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"]

export function ComparisonChart({ comparison }: ComparisonChartProps) {
  if (!comparison || comparison.scenarios.length === 0) return null

  const categories = ["Financial", "Operational", "Customer", "Compliance", "Security"]

  const chartData = categories.map((cat) => {
    const point: Record<string, string | number> = { category: cat }
    comparison.scenarios.forEach((sim) => {
      const impact = sim.impacts.find(
        (i) => i.category === cat.toLowerCase(),
      )
      point[sim.input.title] = impact ? impact.score * 100 : 0
    })
    return point
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Impact Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              />
              {comparison.scenarios.map((sim, i) => (
                <Radar
                  key={sim.id}
                  name={sim.input.title}
                  dataKey={sim.input.title}
                  stroke={COLORS[i % COLORS.length]}
                  fill={COLORS[i % COLORS.length]}
                  fillOpacity={0.1}
                />
              ))}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
