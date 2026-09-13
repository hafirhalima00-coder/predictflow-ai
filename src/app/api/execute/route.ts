import { NextRequest, NextResponse } from 'next/server'
import {
  startExecution,
  completeExecution,
  getExecutionById,
  getAllExecutions,
  rollbackExecution,
  detectSideEffect,
  createBeforeState,
  predictSideEffects,
  generateDiffView,
} from '@/services/execution-service'
import { getSimulationById } from '@/services/dashboard-service'
import { monitorExecution, generateFailureReport } from '@/services/safety-net-service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, executionId, simulationId, executedBy } = body

    if (action === 'start') {
      const simulation = getSimulationById(simulationId)
      if (!simulation) {
        return NextResponse.json({ error: 'Simulation not found' }, { status: 404 })
      }

      const beforeState = createBeforeState({
        scenarioType: simulation.input.scenarioType,
        parameters: simulation.input.parameters,
      })

      const execution = startExecution(simulationId, executedBy || 'system', beforeState)
      const sideEffects = predictSideEffects(simulation)
      const completed = completeExecution(execution.id, sideEffects)

      const safetyNet = monitorExecution(execution.id, simulation)

      if (safetyNet.shouldRollback) {
        rollbackExecution(execution.id)
      }

      const diff = generateDiffView(beforeState, completed?.afterState)

      return NextResponse.json({
        success: true,
        execution: completed,
        safetyNet,
        diff,
        message: safetyNet.shouldRollback
          ? 'Execution completed but safety net triggered rollback'
          : 'Execution completed successfully',
      })
    }

    if (action === 'rollback') {
      const result = rollbackExecution(executionId)
      return NextResponse.json(result)
    }

    if (action === 'simulate_only') {
      const simulation = getSimulationById(simulationId)
      if (!simulation) {
        return NextResponse.json({ error: 'Simulation not found' }, { status: 404 })
      }

      const beforeState = createBeforeState({
        scenarioType: simulation.input.scenarioType,
        parameters: simulation.input.parameters,
      })

      return NextResponse.json({
        success: true,
        beforeState,
        prediction: {
          riskScore: simulation.risk.riskScore,
          severity: simulation.risk.severity,
          recommendation: simulation.risk.recommendedAction,
          impacts: simulation.impacts,
        },
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Execution error:', error)
    return NextResponse.json({ error: 'Execution failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const simulationId = searchParams.get('simulationId')
  const failureReport = searchParams.get('failureReport')

  if (failureReport) {
    const report = generateFailureReport(failureReport)
    return NextResponse.json({ report })
  }

  if (id) {
    const execution = getExecutionById(id)
    if (!execution) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const diff = generateDiffView(execution.beforeState, execution.afterState)
    return NextResponse.json({ execution, diff })
  }

  if (simulationId) {
    const executions = getAllExecutions().filter((e) => e.simulationId === simulationId)
    return NextResponse.json({ executions })
  }

  return NextResponse.json({ executions: getAllExecutions() })
}
