"use client"

import { useState, useEffect } from "react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ConfidenceChart } from "@/components/dashboard/confidence-chart"
import { ColoredRiskDistribution } from "@/components/dashboard/risk-distribution"
import { RecentSimulations } from "@/components/dashboard/recent-simulations"
import { TrendChart } from "@/components/dashboard/trend-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DashboardStats } from "@/lib/types"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Brain, Search, Shield, TrendingUp, Activity } from "lucide-react"
import { formatPercentage } from "@/lib/utils"

function generateMockStats(): DashboardStats {
  const now = Date.now()
  const day = 86400000
  return {
    totalSimulations: 147,
    highRiskEvents: 38,
    preventedIncidents: 23,
    estimatedSavings: 2840000,
    approvalRate: 0.82,
    averageConfidence: 0.87,
    pendingApprovals: 7,
    simulationsTrend: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(now - (6 - i) * day).toLocaleDateString(),
      count: Math.floor(Math.random() * 15) + 5,
    })),
    confidenceTrend: [
      { date: "Week 1", score: 0.72 },
      { date: "Week 2", score: 0.78 },
      { date: "Week 3", score: 0.81 },
      { date: "Week 4", score: 0.85 },
      { date: "Week 5", score: 0.83 },
      { date: "Week 6", score: 0.88 },
      { date: "Week 7", score: 0.87 },
    ],
    riskDistribution: [
      { severity: "low", count: 52 },
      { severity: "medium", count: 57 },
      { severity: "high", count: 28 },
      { severity: "critical", count: 10 },
    ],
    recentSimulations: [],
  }
}

export default function DashboardPage() {
  const [stats] = useState<DashboardStats>(generateMockStats)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSeverity, setFilterSeverity] = useState("all")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            PredictFlow AI &mdash; Simulate Before You Act
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search simulations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-48 pl-8 text-sm lg:w-64"
            />
          </div>
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="h-9 w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <StatsCards
        totalSimulations={stats.totalSimulations}
        highRiskEvents={stats.highRiskEvents}
        preventedIncidents={stats.preventedIncidents}
        estimatedSavings={stats.estimatedSavings}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ConfidenceChart data={stats.confidenceTrend} />
        <ColoredRiskDistribution data={stats.riskDistribution} />
        <TrendChart data={stats.simulationsTrend} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approval Stats</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">{formatPercentage(stats.approvalRate)}</p>
                <p className="text-xs text-muted-foreground">Approval Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
                <p className="text-xs text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">{formatPercentage(stats.averageConfidence)}</p>
                <p className="text-xs text-muted-foreground">Avg Confidence</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalSimulations}</p>
                <p className="text-xs text-muted-foreground">Total Simulations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <RecentSimulations simulations={stats.recentSimulations} />
    </div>
  )
}
