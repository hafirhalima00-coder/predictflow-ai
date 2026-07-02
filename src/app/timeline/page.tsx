"use client"

import { useState, useEffect } from "react"
import { getAllSimulations } from "@/services/dashboard-service"
import { TimelineView } from "@/components/timeline/timeline-view"
import type { SimulationResult } from "@/lib/types"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

export default function TimelinePage() {
  const [simulations, setSimulations] = useState<SimulationResult[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")

  useEffect(() => {
    setSimulations(getAllSimulations())
  }, [])

  const filtered = simulations.filter((sim) => {
    const matchesSearch =
      sim.input.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.input.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.input.scenarioType.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSeverity =
      severityFilter === "all" || sim.risk.severity === severityFilter

    return matchesSearch && matchesSeverity
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Timeline</h1>
        <p className="text-sm text-muted-foreground">
          Chronological view of all simulations and their outcomes
        </p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search simulations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-8 text-sm"
          />
        </div>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="h-9 w-36 text-xs">
            <Filter className="mr-1 h-3 w-3" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TimelineView simulations={filtered} />
    </div>
  )
}
