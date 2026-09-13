import { NextRequest, NextResponse } from 'next/server'
import { monitorExecution, getSafetyNetEvents, generateFailureReport } from '@/services/safety-net-service'
import { getSimulationById } from '@/services/dashboard-service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { executionId, simulationId } = body

    const simulation = getSimulationById(simulationId)
    if (!simulation) {
      return NextResponse.json({ error: 'Simulation not found' }, { status: 404 })
    }

    const result = monitorExecution(executionId, simulation)

    return NextResponse.json({
      success: true,
      safe: result.safe,
      events: result.events,
      shouldRollback: result.shouldRollback,
      confidenceInPrediction: result.confidenceInPrediction,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Safety net check failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const executionId = searchParams.get('executionId')

  if (!executionId) {
    return NextResponse.json({ error: 'executionId required' }, { status: 400 })
  }

  const events = getSafetyNetEvents(executionId)
  return NextResponse.json({ events })
}
