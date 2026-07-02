import { NextResponse } from 'next/server'
import { runSimulation } from '@/services/simulation-engine'
import { storeSimulation } from '@/services/dashboard-service'
import { requiresApproval, createApprovalRequest } from '@/services/approval-service'
import { isOllamaAvailable, enhanceSimulationWithAI } from '@/services/ollama-service'
import type { SimulationInput } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const input: SimulationInput = await request.json()

    if (!input.scenarioType || !input.title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await runSimulation(input)

    let enhanced = null
    if (isOllamaAvailable()) {
      enhanced = await enhanceSimulationWithAI(input, result)
    }

    storeSimulation(result)

    let approval = null
    if (requiresApproval(result)) {
      approval = createApprovalRequest(result, input.initiatedBy || 'system')
    }

    return NextResponse.json({
      success: true,
      result,
      enhanced,
      approval,
      requiresApproval: !!approval,
    })
  } catch (error) {
    console.error('Simulation error:', error)
    return NextResponse.json(
      { error: 'Simulation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
