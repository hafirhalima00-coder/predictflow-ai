"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Shield, Zap, ArrowRight } from "lucide-react"

export default function ThesisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Two-Year Thesis</h1>
        <p className="text-sm text-muted-foreground">
          Simulation-Gated Agents: Why &quot;Simulate Before You Act&quot; Will Be the Default
        </p>
      </div>

      <Card>
        <CardContent className="prose prose-sm max-w-none py-6">
          <h2 className="text-lg font-bold">Simulation as the Default Safety Layer for AI Agents</h2>

          <div className="my-6 space-y-4 text-sm leading-relaxed">
            <p>
              Within two years, every AI agent that modifies production systems will run a simulation
              before executing. This is not optional — it will be table stakes for responsible deployment.
            </p>

            <p>
              The reasoning is simple: AI agents operate at a speed where traditional &quot;undo&quot; is
              insufficient. A marketing agent sending 500,000 emails in 30 seconds cannot wait for
              a human to notice the damage. A deployment agent pushing code to production at 2 AM
              cannot rely on a rollback button pressed in panic. The cost of mistakes is too high,
              and the speed of action too fast, for reactive safety alone.
            </p>

            <p>
              The simulation-gated pattern — <strong>Intent → Simulate → Present → Execute/Rollback</strong> —
              solves this by creating a mandatory thinking pause. Before any write operation, the agent
              runs a prediction of its consequences across financial, operational, customer, compliance,
              and security dimensions. This prediction is not a formality; it must change the decision.
              If the simulation predicts critical risk, the action is blocked. If it predicts moderate
              risk, additional monitoring and rollback mechanisms are activated. Only low-risk actions
              proceed without gating.
            </p>

            <p>
              The key insight is that simulation alone is not enough. We also need a safety net —
              post-execution monitoring that detects when the simulation was wrong. Every prediction
              has an uncertainty margin. By tracking unpredicted side effects and comparing them to
              predictions, we continuously improve the simulation model. When the safety net catches
              a gap, it triggers automatic rollback and logs the failure for model retraining.
            </p>

            <p>
              In two years, this two-layer architecture — simulation as the gate, monitoring as the
              safety net — will be the standard. Companies that ship agents without it will face
              regulatory pressure, customer backlash, and catastrophic incidents. The simulate-first
              pattern is not a feature; it is the foundation of trustworthy AI.
            </p>

            <p className="font-medium">
              Prediction: By 2028, no major platform will deploy AI agents that modify production
              systems without simulation gating and post-execution safety nets. The organizations
              that build this capability now will own the safety story — and the market.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Badge variant="outline" className="text-xs">
              <Brain className="mr-1 h-3 w-3" />
              Simulation-Gated
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Shield className="mr-1 h-3 w-3" />
              Safety Net
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Zap className="mr-1 h-3 w-3" />
              Auto-Rollback
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Architecture: Intent → Simulate → Present → Execute/rollback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2 text-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-lg border bg-blue-500/5 px-4 py-2 text-center">
                <p className="font-medium">1. Intent</p>
                <p className="text-xs text-muted-foreground">User describes action</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="rounded-lg border bg-amber-500/5 px-4 py-2 text-center">
                <p className="font-medium">2. Simulate</p>
                <p className="text-xs text-muted-foreground">Predict consequences</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="rounded-lg border bg-emerald-500/5 px-4 py-2 text-center">
                <p className="font-medium">3. Present</p>
                <p className="text-xs text-muted-foreground">Show diff & risks</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="rounded-lg border bg-purple-500/5 px-4 py-2 text-center">
                <p className="font-medium">4. Gate</p>
                <p className="text-xs text-muted-foreground">Approve/Reject</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="rounded-lg border bg-red-500/5 px-4 py-2 text-center">
                <p className="font-medium">5. Execute</p>
                <p className="text-xs text-muted-foreground">Run + Monitor</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="rounded-lg border bg-orange-500/5 px-4 py-2 text-center">
                <p className="font-medium">6. Safety Net</p>
                <p className="text-xs text-muted-foreground">Detect & rollback</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
