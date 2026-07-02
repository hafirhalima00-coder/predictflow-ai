"use client"

import { useMemo } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SimulationResult } from "@/lib/types"
import { Brain, Activity, Shield, BarChart3, CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const nodeTypes = { simulationNode: SimulationNode }

interface SimulationFlowProps {
  result: SimulationResult | null
  loading: boolean
}

function SimulationNode({ data }: NodeProps<{ label: string; type: string; details?: string; score?: number }>) {
  const iconMap: Record<string, React.ReactNode> = {
    input: <Brain className="h-4 w-4" />,
    process: <Activity className="h-4 w-4" />,
    impact: <BarChart3 className="h-4 w-4" />,
    risk: <Shield className="h-4 w-4" />,
    output: <CheckCircle className="h-4 w-4" />,
  }

  const borderColors: Record<string, string> = {
    input: "border-blue-500",
    process: "border-amber-500",
    impact: "border-purple-500",
    risk: "border-red-500",
    output: "border-emerald-500",
  }

  return (
    <div
      className={cn(
        "rounded-lg border-2 bg-card px-4 py-2 shadow-sm",
        borderColors[data.type] || "border-muted",
      )}
    >
      <div className="flex items-center gap-2">
        {iconMap[data.type] || <Brain className="h-4 w-4" />}
        <span className="text-xs font-medium">{data.label}</span>
      </div>
      {data.details && <p className="mt-1 text-[10px] text-muted-foreground">{data.details}</p>}
      {data.score != null && (
        <Badge variant="outline" className="mt-1 text-[10px]">
          Score: {data.score}
        </Badge>
      )}
    </div>
  )
}

function buildFlow(result: SimulationResult): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [
    {
      id: "input",
      type: "simulationNode",
      position: { x: 0, y: 0 },
      data: { label: result.input.title, type: "input", details: result.input.scenarioType.replace(/_/g, " ") },
    },
    {
      id: "engine",
      type: "simulationNode",
      position: { x: 0, y: 100 },
      data: { label: "Simulation Engine", type: "process", details: `${result.executionTimeMs}ms` },
    },
  ]

  const edges: Edge[] = [
    {
      id: "e-input-engine",
      source: "input",
      target: "engine",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
    },
  ]

  result.impacts.forEach((impact, i) => {
    const id = `impact-${impact.category}`
    nodes.push({
      id,
      type: "simulationNode",
      position: { x: i * 220 - 220, y: 220 },
      data: {
        label: impact.category.charAt(0).toUpperCase() + impact.category.slice(1),
        type: "impact",
        details: `Score: ${(impact.score * 100).toFixed(0)}% - ${impact.severity}`,
        score: Math.round(impact.score * 100),
      },
    })
    edges.push({
      id: `e-engine-${id}`,
      source: "engine",
      target: id,
      markerEnd: { type: MarkerType.ArrowClosed },
    })
  })

  nodes.push({
    id: "risk",
    type: "simulationNode",
    position: { x: 0, y: 360 },
    data: {
      label: `Risk: ${(result.risk.riskScore * 100).toFixed(0)}%`,
      type: "risk",
      details: `${result.risk.severity.toUpperCase()} - ${result.risk.recommendedAction}`,
      score: Math.round(result.risk.riskScore * 100),
    },
  })

  result.impacts.forEach((impact) => {
    edges.push({
      id: `e-${impact.category}-risk`,
      source: `impact-${impact.category}`,
      target: "risk",
      markerEnd: { type: MarkerType.ArrowClosed },
    })
  })

  nodes.push({
    id: "output",
    type: "simulationNode",
    position: { x: 0, y: 480 },
    data: {
      label: "Recommendation",
      type: "output",
      details: result.risk.recommendedAction.toUpperCase(),
    },
  })

  edges.push({
    id: "e-risk-output",
    source: "risk",
    target: "output",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  })

  return { nodes, edges }
}

export function SimulationFlow({ result, loading }: SimulationFlowProps) {
  const { nodes: flowNodes, edges: flowEdges } = useMemo(
    () => (result ? buildFlow(result) : { nodes: [], edges: [] }),
    [result],
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges)

  useMemo(() => {
    setNodes(flowNodes)
    setEdges(flowEdges)
  }, [flowNodes, flowEdges, setNodes, setEdges])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Simulation Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[450px] rounded-lg border">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">Simulating...</span>
              </div>
            </div>
          ) : result ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">Run a simulation to see the flow</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
