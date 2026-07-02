import { NextRequest, NextResponse } from 'next/server'
import { getSimulationById } from '@/services/dashboard-service'
import { generateReport, generateComparisonReport } from '@/services/report-service'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const simulationId = searchParams.get('simulationId')
  const comparisonIds = searchParams.get('comparisonIds')
  const pdf = searchParams.get('pdf') === 'true'

  if (comparisonIds) {
    const ids = comparisonIds.split(',')
    const { compareScenarios } = await import('@/services/comparison-service')
    const { getAllSimulations } = await import('@/services/dashboard-service')

    const allSims = getAllSimulations()
    const selected = allSims.filter((s) => ids.includes(s.id))
    if (selected.length === 0) {
      return NextResponse.json({ error: 'No simulations found' }, { status: 404 })
    }

    const comparison = compareScenarios(selected)
    const report = generateComparisonReport(comparison.scenarios, comparison.recommended)

    if (pdf) {
      const { generatePdfReport } = await import('@/services/report-service')
      const buffer = await generatePdfReport(report)
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="comparison-report.pdf"`,
        },
      })
    }

    return NextResponse.json({ report, comparison })
  }

  if (!simulationId) {
    return NextResponse.json({ error: 'simulationId required' }, { status: 400 })
  }

  const simulation = getSimulationById(simulationId)
  if (!simulation) {
    return NextResponse.json({ error: 'Simulation not found' }, { status: 404 })
  }

  const report = generateReport(simulation)

  if (pdf) {
    const { generatePdfReport } = await import('@/services/report-service')
    const buffer = await generatePdfReport(report)
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="simulation-${simulationId}.pdf"`,
      },
    })
  }

  return NextResponse.json({ report })
}
