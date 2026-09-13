"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { runSimulation } from "@/services/simulation-engine"
import { storeSimulation } from "@/services/dashboard-service"
import { RiskScore } from "@/components/simulation/risk-score"
import { ImpactPanel } from "@/components/simulation/impact-panel"
import { DiffView } from "@/components/simulation/diff-view"
import type { SimulationInput, SimulationResult } from "@/lib/types"
import type { DiffEntry } from "@/services/execution-service"
import {
  AlertTriangle,
  ShieldX,
  ShieldCheck,
  Play,
  Loader2,
  RotateCcw,
  CheckCircle,
  XCircle,
  Zap,
  Target,
  ArrowRight,
} from "lucide-react"

interface SafetyNetEvent {
  type: string
  severity: string
  message: string
  details: string
  wasPredicted: boolean
  autoAction?: string
}

interface FailureTestResult {
  simulation: SimulationResult
  execution: {
    id: string
    status: string
  }
  safetyNet: {
    safe: boolean
    events: SafetyNetEvent[]
    shouldRollback: boolean
    confidenceInPrediction: number
  }
  diff: DiffEntry[]
  failureReport: string
}

const failureScenarios = [
  {
    id: "mass_email_overload",
    name: "Mass Email Campaign (Under-predicted Impact)",
    description: "Send 500K emails but simulation under-predicts bounce rate and sender reputation damage",
    scenarioType: "send_campaign",
    params: { recipients: 500000, campaignType: "promotional", segmentSize: 50000, aTestEnabled: false },
    override: true,
  },
  {
    id: "price_drop_revenue",
    name: "Aggressive Price Drop (Cascading Effects)",
    description: "Lower prices by 40% — simulation misses competitor price matching cascade",
    scenarioType: "update_price",
    params: { productCount: 200, priceChangePercent: -40, appliesTo: "all_customers", effectiveImmediately: true },
    override: true,
  },
  {
    id: "data_delete_compliance",
    name: "Bulk Data Deletion (Regulatory Gap)",
    description: "Delete 1M records but simulation misses GDPR 72-hour notification requirement",
    scenarioType: "delete_records",
    params: { recordCount: 1000000, tableName: "analytics_events", hasBackup: true, softDelete: false },
    override: true,
  },
]

export default function FailureTestPage() {
  const [selectedScenario, setSelectedScenario] = useState(failureScenarios[0])
  const [result, setResult] = useState<FailureTestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("simulate")

  const handleRunTest = async () => {
    setLoading(true)
    try {
      const simResult = await runSimulation({
        scenarioType: selectedScenario.scenarioType as SimulationInput["scenarioType"],
        title: selectedScenario.name,
        description: selectedScenario.description,
        parameters: selectedScenario.params,
        department: "Engineering",
        initiatedBy: "Failure Test",
      })
      storeSimulation(simResult)

      const execRes = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          simulationId: simResult.id,
          executedBy: "failure-test",
        }),
      })
      const execData = await execRes.json()

      const reportRes = await fetch(`/api/execute?failureReport=${execData.execution.id}`)
      const reportData = await reportRes.json()

      setResult({
        simulation: simResult,
        execution: execData.execution,
        safetyNet: execData.safetyNet,
        diff: execData.diff,
        failureReport: reportData.report,
      })
      setActiveTab("results")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Failure Test</h1>
        <p className="text-sm text-muted-foreground">
          Demonstrating when simulations under-predict — and how the safety net catches it
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="simulate" className="gap-1">
            <Target className="h-3 w-3" />
            Configure
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!result} className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simulate">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Failure Scenario</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Scenario</Label>
                    <Select
                      value={selectedScenario.id}
                      onValueChange={(v) => setSelectedScenario(failureScenarios.find((s) => s.id === v)!)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {failureScenarios.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-300">What this test demonstrates:</p>
                    <p className="mt-1 text-xs text-muted-foreground">{selectedScenario.description}</p>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>The simulation will produce a risk assessment, but it will <strong>under-predict</strong> the actual impact.</p>
                    <p>The safety net will then detect unpredicted side effects during monitoring, demonstrating why simulation alone is not enough.</p>
                  </div>
                  <Button onClick={handleRunTest} disabled={loading} className="w-full gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    Run Failure Test
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="py-16 text-center">
                  <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                  <h3 className="mb-2 text-lg font-medium">Failure Test Pipeline</h3>
                  <p className="max-w-md text-sm text-muted-foreground">
                    This test intentionally runs a scenario where the simulation&apos;s prediction will be wrong.
                    The safety net will then detect the gap and demonstrate the safety mechanism.
                  </p>
                  <div className="mt-6 flex justify-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-blue-500" /> Simulate</div>
                    <ArrowRight className="h-3 w-3" />
                    <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Execute</div>
                    <ArrowRight className="h-3 w-3" />
                    <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-red-500" /> Safety Net</div>
                    <ArrowRight className="h-3 w-3" />
                    <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-amber-500" /> Detect Gap</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results">
          {result && (
            <div className="space-y-6">
              <Card className={
                result.safetyNet.shouldRollback
                  ? "border-destructive"
                  : "border-emerald-500/50"
              }>
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    {result.safetyNet.shouldRollback ? (
                      <ShieldX className="h-8 w-8 text-destructive shrink-0" />
                    ) : (
                      <ShieldCheck className="h-8 w-8 text-emerald-500 shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {result.safetyNet.shouldRollback
                          ? "SAFETY NET CAUGHT THE GAP"
                          : "Execution Complete — Monitoring Active"}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {result.safetyNet.shouldRollback
                          ? "The simulation under-predicted the impact. The safety net detected unpredicted side effects and triggered automatic rollback."
                          : "Execution completed. Monitoring detected no additional issues beyond predictions."}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="outline">Simulation Risk: {(result.simulation.risk.riskScore * 100).toFixed(0)}%</Badge>
                        <Badge variant="outline">Prediction Confidence: {(result.simulation.risk.confidenceScore * 100).toFixed(0)}%</Badge>
                        <Badge variant={result.safetyNet.safe ? "success" : "destructive"}>
                          {result.safetyNet.safe ? "Safe" : `${result.safetyNet.events.length} Events Detected`}
                        </Badge>
                        {result.safetyNet.shouldRollback && (
                          <Badge variant="destructive">AUTO-ROLLBACK</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                <RiskScore risk={result.simulation.risk} />
                <DiffView entries={result.diff} />
              </div>

              <ImpactPanel impacts={result.simulation.impacts} />

              {result.safetyNet.events.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      Safety Net Detection Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.safetyNet.events.map((event, i) => (
                      <div
                        key={i}
                        className={`rounded-lg border p-3 ${
                          event.severity === "critical"
                            ? "border-destructive bg-destructive/5"
                            : "border-amber-500/20 bg-amber-500/5"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant={event.wasPredicted ? "outline" : "destructive"} className="text-[10px]">
                                {event.wasPredicted ? "PREDICTED" : "UNPREDICTED"}
                              </Badge>
                              <span className="text-xs font-medium">{event.message}</span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{event.details}</p>
                          </div>
                          {event.autoAction === "auto_rollback" && (
                            <Badge variant="destructive" className="text-[10px] shrink-0">
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
                  <CardTitle className="text-sm font-medium">Failure Analysis Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap rounded-lg bg-muted/30 p-4 text-xs text-muted-foreground">
                    {result.failureReport}
                  </pre>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardContent className="py-6 text-center">
                  <h3 className="mb-2 font-medium">Why This Matters</h3>
                  <p className="max-w-2xl mx-auto text-sm text-muted-foreground">
                    If we had executed without the safety net, the unpredicted side effects would have
                    caused real damage. The safety net provides a second layer of protection that catches
                    what simulation misses. This is the simulate-first pattern: simulation is the first
                    gate, monitoring is the second.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab("simulate")}>
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Run Another Test
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
