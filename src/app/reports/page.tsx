"use client"

import { Suspense, useState, useEffect } from "react"
import { getAllSimulations } from "@/services/dashboard-service"
import { generateReport, generateComparisonReport } from "@/services/report-service"
import { compareScenarios } from "@/services/comparison-service"
import { ReportViewer } from "@/components/reports/report-viewer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SimulationResult, Report } from "@/lib/types"
import { FileText, Download } from "lucide-react"
import { useSearchParams } from "next/navigation"

function ReportsContent() {
  const searchParams = useSearchParams()
  const [simulations, setSimulations] = useState<SimulationResult[]>([])
  const [selectedId, setSelectedId] = useState<string>("")
  const [report, setReport] = useState<Report | null>(null)

  useEffect(() => {
    const allSims = getAllSimulations()
    setSimulations(allSims)

    const comparisonIds = searchParams.get("comparison")
    if (comparisonIds && allSims.length > 0) {
      const ids = comparisonIds.split(",")
      const selected = allSims.filter((s) => ids.includes(s.id))
      if (selected.length >= 2) {
        const comp = compareScenarios(selected)
        const compReport = generateComparisonReport(comp.scenarios, comp.recommended)
        setReport(compReport)
        return
      }
    }
  }, [searchParams])

  const handleGenerate = () => {
    if (!selectedId) return
    const sim = simulations.find((s) => s.id === selectedId)
    if (sim) {
      setReport(generateReport(sim))
    }
  }

  const handlePdfDownload = async () => {
    if (!report) return
    const { generatePdfReport } = await import("@/services/report-service")
    const buffer = await generatePdfReport(report)
    const blob = new Blob([buffer], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `predictflow-report-${report.id}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Generate detailed simulation reports with analysis and recommendations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a simulation..." />
              </SelectTrigger>
              <SelectContent>
                {simulations.map((sim) => (
                  <SelectItem key={sim.id} value={sim.id}>
                    {sim.input.title} ({(sim.risk.riskScore * 100).toFixed(0)}% risk)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleGenerate} disabled={!selectedId} className="gap-2">
              <FileText className="h-4 w-4" />
              Generate
            </Button>
            {report && (
              <Button variant="outline" onClick={handlePdfDownload} className="gap-2">
                <Download className="h-4 w-4" />
                PDF
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ReportViewer report={report} />
    </div>
  )
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading...</p></div>}>
      <ReportsContent />
    </Suspense>
  )
}
