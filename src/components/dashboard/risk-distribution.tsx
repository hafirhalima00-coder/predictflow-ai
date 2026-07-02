"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface RiskDistributionProps {
  data: Array<{ severity: string; count: number }>
}

const severityColors: Record<string, string> = {
  low: "hsl(var(--primary))",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
}

export function RiskDistribution({ data }: RiskDistributionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="severity"
                tick={{ fontSize: 11, textTransform: "capitalize" }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                barSize={40}
                fill="hsl(var(--primary))"
              >
                {data.map((entry, index) => (
                  <rect key={index} fill={severityColors[entry.severity] || "hsl(var(--primary))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Custom shape to color bars individually
function CustomBar(props: unknown) {
  const { fill, x, y, width, height, payload } = props as {
    fill?: string
    x: number
    y: number
    width: number
    height: number
    payload: { severity: string }
  }
  const color = severityColors[payload.severity] || fill
  return <rect x={x} y={y} width={width} height={height} fill={color} rx={4} />
}

export function ColoredRiskDistribution({ data }: RiskDistributionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="severity"
                tick={{ fontSize: 11, textTransform: "capitalize" }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                barSize={40}
                shape={<CustomBar />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
