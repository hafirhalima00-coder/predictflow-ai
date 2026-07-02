import type { SimulationResult, Report, ReportSection } from '@/lib/types'
import { generateId, formatCurrency } from '@/lib/utils'

export function generateReport(result: SimulationResult, generatedBy: string = 'PredictFlow AI'): Report {
  const sections: ReportSection[] = []

  sections.push({
    title: 'Executive Summary',
    type: 'text',
    content: `This report analyzes the simulation "${result.input.title}" (${result.input.scenarioType.replace(/_/g, ' ')} scenario). Overall risk score: ${(result.risk.riskScore * 100).toFixed(0)}/100. Confidence: ${(result.risk.confidenceScore * 100).toFixed(0)}%. Recommended action: ${result.risk.recommendedAction.toUpperCase()}.`,
  })

  sections.push({
    title: 'Scenario Details',
    type: 'table',
    content: 'Key parameters and configuration for this simulation.',
    data: {
      headers: ['Parameter', 'Value'],
      rows: [
        ['Scenario Type', result.input.scenarioType.replace(/_/g, ' ')],
        ['Department', result.input.department],
        ['Initiated By', result.input.initiatedBy],
        ['Execution Time', `${result.executionTimeMs}ms`],
        ['Timestamp', new Date(result.timestamp).toISOString()],
        ...Object.entries(result.input.parameters).map(([k, v]) => [k, String(v)]),
      ],
    },
  })

  sections.push({
    title: 'Impact Analysis',
    type: 'table',
    content: 'Analysis across five impact dimensions.',
    data: {
      headers: ['Category', 'Score', 'Severity', 'Estimated Value'],
      rows: result.impacts.map((i) => [
        i.category.charAt(0).toUpperCase() + i.category.slice(1),
        `${(i.score * 100).toFixed(0)}%`,
        i.severity.toUpperCase(),
        formatCurrency(i.estimatedValue ?? 0),
      ]),
    },
  })

  sections.push({
    title: 'Risk Assessment',
    type: 'risk',
    content: result.risk.reasoning.join('\n\n'),
    data: {
      riskScore: result.risk.riskScore,
      confidenceScore: result.risk.confidenceScore,
      severity: result.risk.severity,
      recommendation: result.risk.recommendedAction,
      factors: result.risk.factors,
    },
  })

  sections.push({
    title: 'Key Risk Factors',
    type: 'table',
    content: 'Contributing factors to the overall risk score.',
    data: {
      headers: ['Factor', 'Impact Score', 'Description'],
      rows: result.risk.factors.map((f) => [
        f.name,
        `${(f.impact * 100).toFixed(0)}%`,
        f.description,
      ]),
    },
  })

  sections.push({
    title: 'Assumptions & Methodology',
    type: 'text',
    content:
      'This simulation uses a multi-factor risk model incorporating financial, operational, customer, compliance, and security impact dimensions. Risk scores are calculated using weighted averages with Monte Carlo variance simulation. Confidence scores reflect historical data quality and model certainty. Simulations assume current system state and may not account for external market conditions or unforeseen events.',
  })

  sections.push({
    title: 'Recommendations',
    type: 'text',
    content:
      result.risk.recommendedAction === 'proceed'
        ? 'This action has low risk. Standard monitoring is recommended. Proceed with normal change management procedures.'
        : result.risk.recommendedAction === 'review'
          ? 'This action has moderate risk. Implement gradual rollout with monitoring. Ensure rollback plan is in place before proceeding.'
          : result.risk.recommendedAction === 'escalate'
            ? 'This action has significant risk. Do not proceed without stakeholder approval. Implement all mitigations listed in the risk factors. Consider alternative approaches.'
            : 'This action has critical risk and is BLOCKED. Seek executive-level review. Consider alternative approaches with lower risk profiles.',
  })

  return {
    id: generateId(),
    simulationId: result.id,
    title: `Simulation Report: ${result.input.title}`,
    summary: `Risk Score: ${(result.risk.riskScore * 100).toFixed(0)}/100 | Severity: ${result.risk.severity.toUpperCase()} | Confidence: ${(result.risk.confidenceScore * 100).toFixed(0)}%`,
    sections,
    generatedAt: new Date(),
    generatedBy,
  }
}

export function generateComparisonReport(
  results: SimulationResult[],
  recommendedId: string,
): Report {
  const best = results.find((r) => r.id === recommendedId)
  const title = `Comparison Report: ${results.length} Scenarios Analyzed`

  const sections: ReportSection[] = [
    {
      title: 'Executive Summary',
      type: 'text',
      content: `Analysis comparing ${results.length} scenarios. ${best ? `Optimal scenario: "${best.input.title}" with risk score ${(best.risk.riskScore * 100).toFixed(0)}/100.` : ''}`,
    },
    {
      title: 'Scenario Ranking',
      type: 'table',
      content: 'Scenarios ranked by overall value score.',
      data: {
        headers: ['Rank', 'Scenario', 'Risk Score', 'Confidence', 'Action'],
        rows: results
          .sort((a, b) => a.risk.riskScore - b.risk.riskScore)
          .map((r, i) => [
            `${i + 1}`,
            r.input.title,
            `${(r.risk.riskScore * 100).toFixed(0)}%`,
            `${(r.risk.confidenceScore * 100).toFixed(0)}%`,
            r.risk.recommendedAction.toUpperCase(),
          ]),
      },
    },
    {
      title: 'Detailed Comparison',
      type: 'text',
      content: results
        .map(
          (r) =>
            `${r.input.title}: Risk=${(r.risk.riskScore * 100).toFixed(0)}%, Confidence=${(r.risk.confidenceScore * 100).toFixed(0)}%, Severity=${r.risk.severity}, Recommendation=${r.risk.recommendedAction}`,
        )
        .join('\n'),
    },
  ]

  return {
    id: generateId(),
    simulationId: 'comparison',
    title,
    summary: `Best option: ${best?.input.title ?? 'N/A'}`,
    sections,
    generatedAt: new Date(),
    generatedBy: 'PredictFlow AI',
  }
}

export async function generatePdfReport(report: Report): Promise<Buffer> {
  const pdfMake = require('pdfmake/build/pdfmake')
  const pdfFonts = require('pdfmake/build/vfs_fonts')
  pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs

  const docDefinition = {
    content: [
      { text: report.title, style: 'header' },
      { text: report.summary, style: 'subheader' },
      ...report.sections.flatMap((section) => {
        const items: unknown[] = [{ text: section.title, style: 'sectionHeader' }]
        items.push({ text: section.content, style: 'body', margin: [0, 5, 0, 10] })
        return items
      }),
    ],
    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      subheader: { fontSize: 12, italics: true, margin: [0, 0, 0, 20] },
      sectionHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
      body: { fontSize: 10, lineHeight: 1.5 },
    },
  }

  return new Promise((resolve, reject) => {
    const pdfDoc = pdfMake.createPdf(docDefinition)
    pdfDoc.getBuffer((buffer: Buffer) => resolve(buffer))
  })
}
