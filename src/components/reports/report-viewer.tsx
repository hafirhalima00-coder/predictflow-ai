"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Report } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

interface ReportViewerProps {
  report: Report | null
}

export function ReportViewer({ report }: ReportViewerProps) {
  if (!report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Report</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Run a simulation and generate a report to see it here
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                {report.title}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{report.summary}</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              PDF
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Generated {formatDate(report.generatedAt)} by {report.generatedBy}
          </p>
        </CardHeader>
      </Card>

      {report.sections.map((section, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {section.type === "text" && (
              <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                {section.content}
              </div>
            )}
            {section.type === "table" && section.data && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {(section.data as { headers: string[] }).headers.map(
                        (header: string, j: number) => (
                          <th key={j} className="pb-2 text-left font-medium">
                            {header}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(section.data as { rows: string[][] }).rows.map(
                      (row: string[], j: number) => (
                        <tr key={j} className="border-b last:border-0">
                          {row.map((cell: string, k: number) => (
                            <td key={k} className="py-2 text-sm">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {section.type === "risk" && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {(section.data as { riskScore: number; severity: string; recommendation: string }).riskScore != null && (
                    <Badge>
                      Risk: {((section.data as { riskScore: number }).riskScore * 100).toFixed(0)}%
                    </Badge>
                  )}
                  {(section.data as { severity: string }) && (
                    <Badge variant="destructive">
                      {(section.data as { severity: string }).severity}
                    </Badge>
                  )}
                  {(section.data as { recommendation: string }).recommendation && (
                    <Badge variant="outline">
                      {(section.data as { recommendation: string }).recommendation}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{section.content}</div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
