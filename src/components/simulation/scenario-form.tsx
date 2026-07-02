"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SimulationInput, ScenarioType } from "@/lib/types"
import { ScenarioLabels } from "@/lib/types"
import { generateScenarioParameters } from "@/services/simulation-engine"
import { Brain, Loader2, Play } from "lucide-react"

interface ScenarioFormProps {
  onSimulate: (input: SimulationInput) => void
  loading: boolean
}

export function ScenarioForm({ onSimulate, loading }: ScenarioFormProps) {
  const [scenarioType, setScenarioType] = useState<ScenarioType>("delete_records")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [department, setDepartment] = useState("Engineering")
  const [initiatedBy, setInitiatedBy] = useState("")

  const [params, setParams] = useState<Record<string, number | string | boolean>>(
    generateScenarioParameters("delete_records"),
  )

  const handleTypeChange = (type: ScenarioType) => {
    setScenarioType(type)
    setParams(generateScenarioParameters(type))
    setTitle(`Simulate: ${ScenarioLabels[type]}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSimulate({
      scenarioType,
      title: title || `Simulate: ${ScenarioLabels[scenarioType]}`,
      description: description || `Simulating the effects of ${ScenarioLabels[scenarioType].toLowerCase()}`,
      parameters: params,
      department,
      initiatedBy: initiatedBy || "User",
    })
  }

  const updateParam = (key: string, value: string | boolean) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="scenario">Scenario Type</Label>
              <Select
                value={scenarioType}
                onValueChange={(v) => handleTypeChange(v as ScenarioType)}
              >
                <SelectTrigger id="scenario">
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ScenarioLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger id="department">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Simulation title"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you want to simulate..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initiatedBy">Initiated By</Label>
              <Input
                id="initiatedBy"
                value={initiatedBy}
                onChange={(e) => setInitiatedBy(e.target.value)}
                placeholder="Your name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 text-sm font-medium">Scenario Parameters</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(params).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <Label htmlFor={key} className="text-xs capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </Label>
                {typeof value === "boolean" ? (
                  <Select
                    value={String(value)}
                    onValueChange={(v) => updateParam(key, v === "true")}
                  >
                    <SelectTrigger id={key} className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={key}
                    type={typeof value === "number" ? "number" : "text"}
                    value={String(value)}
                    onChange={(e) => updateParam(key, e.target.value)}
                    className="h-8 text-xs"
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} className="w-full gap-2">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Simulating...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            <Brain className="h-4 w-4" />
            Simulate & Predict
          </>
        )}
      </Button>
    </form>
  )
}
