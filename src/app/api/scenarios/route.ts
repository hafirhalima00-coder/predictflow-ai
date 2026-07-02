import { NextRequest, NextResponse } from 'next/server'
import { getAllSimulations, getSimulationById, searchSimulations, filterSimulations } from '@/services/dashboard-service'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const query = searchParams.get('q')
  const severity = searchParams.get('severity')
  const type = searchParams.get('type')

  if (id) {
    const sim = getSimulationById(id)
    if (!sim) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ simulation: sim })
  }

  if (query) {
    const results = searchSimulations(query)
    return NextResponse.json({ simulations: results })
  }

  if (severity || type) {
    const results = filterSimulations({ severity: severity ?? undefined, type: type ?? undefined })
    return NextResponse.json({ simulations: results })
  }

  const simulations = getAllSimulations()
  return NextResponse.json({ simulations })
}
