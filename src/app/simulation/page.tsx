"use client"

import { useState } from "react"
import { ScenarioForm } from "@/components/simulation/scenario-form"
import { ImpactPanel } from "@/components/simulation/impact-panel"
import { RiskScore } from "@/components/simulation/risk-score"
import { SimulationFlow } from "@/components/simulation/simulation-flow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SimulationInput, SimulationResult } from "@/lib/types"
import { runSimulation } from "@/services/simulation-engine"
import { storeSimulation } from "@/services/dashboard-service"
import { requiresApproval, createApprovalRequest } from "@/services/approval-service"
import { Brain, AlertTriangle, ShieldCheck, Clock, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function SimulationPage() {
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("impacts")

  const handleSimulate = async (input: SimulationInput) => {
    setLoading(true)
    setError(null)
    try {
      const simResult = await runSimulation(input)
      storeSimulation(simResult)

      if (requiresApproval(simResult)) {
        createApprovalRequest(simResult, input.initiatedBy || "User")
      }

      setResult(simResult)
      setActiveTab("impacts")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Simulation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Simulation Studio</h1>
        <p className="text-sm text-muted-foreground">
          Configure and run what-if scenarios to predict outcomes before taking action
        </p>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-2 py-3 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ScenarioForm onSimulate={handleSimulate} loading={loading} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {loading && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="font-medium">Simulating scenario...</p>
                  <p className="text-xs">Analyzing impacts, calculating risk, generating predictions</p>
                </div>
              </CardContent>
            </Card>
          )}

          {result && !loading && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        {result.input.title}
                      </CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {result.input.scenarioType.replace(/_/g, " ")} &middot;{" "}
                        {result.input.department} &middot; {formatDate(result.timestamp)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          result.risk.severity === "low"
                            ? "success"
                            : result.risk.severity === "medium"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {result.risk.severity}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {result.executionTimeMs}ms
                      </span>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <RiskScore risk={result.risk} />

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <ShieldCheck className="h-4 w-4" />
                      Approval Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {requiresApproval(result) ? (
                      <div className="space-y-2">
                        <Badge variant="warning" className="mb-2">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Approval Required
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          This action has been flagged for human review due to its risk score of{" "}
                          {(result.risk.riskScore * 100).toFixed(0)}%.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Badge variant="success">No Approval Needed</Badge>
                        <p className="text-xs text-muted-foreground">
                          Low-risk simulation. Safe to proceed with standard monitoring.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="impacts">Impact Analysis</TabsTrigger>
                  <TabsTrigger value="flow">Simulation Flow</TabsTrigger>
                </TabsList>
                <TabsContent value="impacts">
                  <ImpactPanel impacts={result.impacts} />
                </TabsContent>
                <TabsContent value="flow">
                  <SimulationFlow result={result} loading={false} />
                </TabsContent>
              </Tabs>
            </>
          )}

          {!result && !loading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Brain className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 text-lg font-medium">Ready to Simulate</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Configure your scenario on the left and click &quot;Simulate &amp; Predict&quot; to see
                  the predicted outcomes, risks, and recommendations.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
