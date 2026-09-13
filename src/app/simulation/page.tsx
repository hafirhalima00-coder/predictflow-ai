"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { runSimulation } from "@/services/simulation-engine"
import { storeSimulation } from "@/services/dashboard-service"
import { ImpactPanel } from "@/components/simulation/impact-panel"
import { RiskScore } from "@/components/simulation/risk-score"
import { DiffView } from "@/components/simulation/diff-view"
import type { SimulationInput, SimulationResult } from "@/lib/types"
import type { DiffEntry } from "@/services/execution-service"
import {
  Play,
  ShieldCheck,
  ShieldX,
  RotateCcw,
  AlertTriangle,
  Zap,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  Clock,
} from "lucide-react"

interface SafetyNetEvent {
  type: string
  severity: string
  message: string
  details: string
  wasPredicted: boolean
  autoAction?: string
}

interface ExecutionResult {
  execution: {
    id: string
    status: string
    sideEffects: Array<{ description: string; predicted: boolean; severity: string }>
  }
  safetyNet: {
    safe: boolean
    events: SafetyNetEvent[]
    shouldRollback: boolean
    confidenceInPrediction: number
  }
  diff: DiffEntry[]
}

export default function SimulationPage() {
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [execution, setExecution] = useState<ExecutionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [activeTab, setActiveTab] = useState("simulation")
  const [scenarioType, setScenarioType] = useState("delete_records")
  const [title, setTitle] = useState("Delete inactive user records")
  const [description, setDescription] = useState("Remove users inactive for >90 days to comply with data retention policy")
  const [department, setDepartment] = useState("Engineering")
  const [initiatedBy, setInitiatedBy] = useState("DataOps Team")

  const [params, setParams] = useState<Record<string, number | string | boolean>>({
    recordCount: 100000,
    hasBackup: true,
    softDelete: true,
  })

  const handleSimulate = async () => {
    setLoading(true)
    setExecution(null)
    try {
      const simResult = await runSimulation({
        scenarioType: scenarioType as SimulationInput["scenarioType"],
        title,
        description,
        parameters: params,
        department,
        initiatedBy,
      })
      storeSimulation(simResult)
      setResult(simResult)
      setActiveTab("simulation")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleExecute = async () => {
    if (!result) return
    setExecuting(true)
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          simulationId: result.id,
          executedBy: initiatedBy || "system",
        }),
      })
      const data = await res.json()
      setExecution(data)
      setActiveTab("execution")
    } catch (err) {
      console.error(err)
    } finally {
      setExecuting(false)
    }
  }

  const handleRollback = async () => {
    if (!execution) return
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rollback",
          executionId: execution.execution.id,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setExecution((prev) => prev ? {
          ...prev,
          execution: { ...prev.execution, status: "rolled_back" }
        } : null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const severityColors = {
    low: "success",
    medium: "warning",
    high: "destructive",
    critical: "destructive",
  } as const

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Simulation Studio</h1>
        <p className="text-sm text-muted-foreground">
          Configure, simulate, and execute — with safety gates at every step
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="configure" className="gap-1">
            <Play className="h-3 w-3" />
            Configure
          </TabsTrigger>
          <TabsTrigger value="simulation" disabled={!result} className="gap-1">
            <Zap className="h-3 w-3" />
            Simulation
          </TabsTrigger>
          <TabsTrigger value="execute" disabled={!result} className="gap-1">
            <ShieldCheck className="h-3 w-3" />
            Execute
          </TabsTrigger>
          <TabsTrigger value="execution" disabled={!execution} className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configure">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Action Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Scenario Type</Label>
                    <Select value={scenarioType} onValueChange={setScenarioType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delete_records">Delete Records</SelectItem>
                        <SelectItem value="send_campaign">Send Campaign</SelectItem>
                        <SelectItem value="update_price">Update Price</SelectItem>
                        <SelectItem value="process_refund">Process Refund</SelectItem>
                        <SelectItem value="change_inventory">Change Inventory</SelectItem>
                        <SelectItem value="update_policy">Update Policy</SelectItem>
                        <SelectItem value="migrate_data">Migrate Data</SelectItem>
                        <SelectItem value="deploy_feature">Deploy Feature</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <input
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Parameters</Label>
                    {Object.entries(params).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        {typeof value === "boolean" ? (
                          <Select value={String(value)} onValueChange={(v) => setParams(p => ({...p, [key]: v === "true"}))}>
                            <SelectTrigger className="h-7 w-20 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Yes</SelectItem>
                              <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <input
                            className="h-7 w-24 rounded border bg-transparent px-2 text-right text-xs"
                            value={String(value)}
                            onChange={(e) => setParams(p => ({...p, [key]: Number(e.target.value)}))}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleSimulate} disabled={loading} className="w-full gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                    Simulate Before Acting
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="py-16 text-center">
                  <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                  <h3 className="mb-2 text-lg font-medium">Intent → Simulate → Review → Execute</h3>
                  <p className="max-w-md text-sm text-muted-foreground">
                    Describe your action on the left, then click Simulate to predict its consequences.
                    Only after review can you proceed to execution.
                  </p>
                  <div className="mt-6 flex justify-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-blue-500" /> Configure</div>
                    <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-amber-500" /> Simulate</div>
                    <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Execute</div>
                    <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-red-500" /> Rollback</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="simulation">
          {result && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{result.input.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {result.input.scenarioType.replace(/_/g, " ")} &middot; {result.input.department} &middot; {result.executionTimeMs}ms
                      </p>
                    </div>
                    <Badge variant={severityColors[result.risk.severity]}>{result.risk.severity}</Badge>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <RiskScore risk={result.risk} />
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Prediction Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.risk.reasoning.map((line, i) => (
                      <p key={i} className="text-xs text-muted-foreground">{line}</p>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <ImpactPanel impacts={result.impacts} />

              <Card className="border-dashed">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium">Simulation complete. Ready to review.</p>
                    <p className="text-xs text-muted-foreground">
                      {result.risk.recommendedAction === "proceed"
                        ? "Low risk — safe to execute with standard monitoring."
                        : result.risk.recommendedAction === "review"
                          ? "Medium risk — implement monitoring and rollback plan."
                          : result.risk.recommendedAction === "escalate"
                            ? "High risk — requires stakeholder approval before execution."
                            : "Critical risk — action blocked. Consider alternative approaches."}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSimulate}>
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Re-simulate
                    </Button>
                    <Button
                      onClick={() => setActiveTab("execute")}
                      disabled={result.risk.recommendedAction === "block"}
                    >
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      Review for Execution
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="execute">
          {result && (
            <div className="space-y-6">
              <Card className={result.risk.recommendedAction === "block" ? "border-destructive" : "border-emerald-500/50"}>
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    {result.risk.recommendedAction === "block" ? (
                      <XCircle className="h-8 w-8 text-destructive shrink-0" />
                    ) : (
                      <ShieldCheck className="h-8 w-8 text-emerald-500 shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {result.risk.recommendedAction === "block"
                          ? "Action Blocked"
                          : result.risk.recommendedAction === "escalate"
                            ? "Escalation Required"
                            : "Ready to Execute"}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {result.risk.recommendedAction === "block"
                          ? "This action has been blocked due to critical risk. Consider alternative approaches."
                          : result.risk.recommendedAction === "escalate"
                            ? "This action requires stakeholder approval. High risk detected."
                            : "Simulation complete. Review the predicted impacts below, then confirm execution."}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Risk Score:</span>{" "}
                          <span className="font-medium">{(result.risk.riskScore * 100).toFixed(0)}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Confidence:</span>{" "}
                          <span className="font-medium">{(result.risk.confidenceScore * 100).toFixed(0)}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Severity:</span>{" "}
                          <Badge variant={severityColors[result.risk.severity]}>{result.risk.severity}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-2">
                    <Button variant="outline" onClick={() => setActiveTab("simulation")}>
                      Back to Simulation
                    </Button>
                    {result.risk.recommendedAction !== "block" && (
                      <Button onClick={handleExecute} disabled={executing} className="gap-2">
                        {executing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Zap className="h-4 w-4" />
                        )}
                        {executing ? "Executing..." : "Confirm & Execute"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">What will happen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.impacts.map((impact) => (
                      <div key={impact.category} className="flex items-center justify-between text-sm">
                        <span className="capitalize text-muted-foreground">{impact.category}</span>
                        <Badge variant={severityColors[impact.severity]}>{(impact.score * 100).toFixed(0)}%</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="execution">
          {execution && (
            <div className="space-y-6">
              <Card className={
                execution.safetyNet.shouldRollback ? "border-destructive" :
                execution.execution.status === "rolled_back" ? "border-amber-500" :
                "border-emerald-500/50"
              }>
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    {execution.safetyNet.shouldRollback ? (
                      <AlertTriangle className="h-8 w-8 text-destructive shrink-0" />
                    ) : execution.execution.status === "rolled_back" ? (
                      <RotateCcw className="h-8 w-8 text-amber-500 shrink-0" />
                    ) : (
                      <CheckCircle className="h-8 w-8 text-emerald-500 shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {execution.safetyNet.shouldRollback
                          ? "SAFETY NET TRIGGERED"
                          : execution.execution.status === "rolled_back"
                            ? "Rolled Back"
                            : "Execution Complete"}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {execution.safetyNet.shouldRollback
                          ? "The safety net detected issues during monitoring and triggered an automatic rollback."
                          : execution.execution.status === "rolled_back"
                            ? "Execution was rolled back to the pre-execution state."
                            : "Action executed successfully. Monitoring is active."}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="outline">Execution: {execution.execution.id.slice(0, 8)}</Badge>
                        <Badge variant="outline">Confidence: {(execution.safetyNet.confidenceInPrediction * 100).toFixed(0)}%</Badge>
                        <Badge variant={execution.safetyNet.safe ? "success" : "warning"}>
                          {execution.safetyNet.safe ? "No Issues" : `${execution.safetyNet.events.length} Events`}
                        </Badge>
                      </div>
                    </div>
                    {execution.execution.status === "completed" && !execution.safetyNet.shouldRollback && (
                      <Button variant="outline" onClick={handleRollback} className="gap-1">
                        <RotateCcw className="h-3 w-3" />
                        Rollback
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <DiffView entries={execution.diff} />

              {execution.safetyNet.events.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <ShieldX className="h-4 w-4 text-destructive" />
                      Safety Net Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {execution.safetyNet.events.map((event, i) => (
                      <div key={i} className={`rounded-lg border p-3 ${event.severity === "critical" ? "border-destructive bg-destructive/5" : "border-amber-500/20 bg-amber-500/5"}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant={event.wasPredicted ? "outline" : "destructive"} className="text-[10px]">
                                {event.wasPredicted ? "Predicted" : "UNPREDICTED"}
                              </Badge>
                              <span className="text-xs font-medium">{event.message}</span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{event.details}</p>
                          </div>
                          {event.autoAction === "auto_rollback" && (
                            <Badge variant="destructive" className="text-[10px]">
                              AUTO-ROLLBACK
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Post-Execution Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Monitoring active since execution
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                      System integrity: Normal
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3 w-3" />
                      Side effects: {execution.execution.sideEffects.length} detected
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
