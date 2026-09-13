"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DiffEntry } from "@/services/execution-service"
import { ArrowRight, ArrowDown } from "lucide-react"

interface DiffViewProps {
  entries: DiffEntry[]
}

function formatValue(val: unknown): string {
  if (typeof val === 'number') return val.toLocaleString()
  if (typeof val === 'boolean') return val ? 'True' : 'False'
  if (typeof val === 'string') {
    if (val.includes('T') && val.includes('-')) {
      try { return new Date(val).toLocaleDateString() } catch { return val }
    }
    return val
  }
  return JSON.stringify(val)
}

export function DiffView({ entries }: DiffViewProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-sm text-muted-foreground">
          No state changes detected
        </CardContent>
      </Card>
    )
  }

  const changed = entries.filter((e) => e.changed)
  const unchanged = entries.filter((e) => !e.changed)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <span className="h-3 w-3 rounded-full bg-primary" />
          State Diff — Before vs After
        </CardTitle>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>{changed.length} changed</span>
          <span>{unchanged.length} unchanged</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {entries.map((entry) => (
            <div
              key={entry.field}
              className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                entry.changed
                  ? 'bg-amber-500/5 border border-amber-500/20'
                  : 'bg-muted/30'
              }`}
            >
              <span className="font-mono text-xs text-muted-foreground">
                {entry.field}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant={entry.changed ? 'warning' : 'outline'} className="text-[10px]">
                  {formatValue(entry.before)}
                </Badge>
                {entry.changed && (
                  <>
                    <ArrowRight className="h-3 w-3 text-amber-500" />
                    <Badge variant="destructive" className="text-[10px]">
                      {formatValue(entry.after)}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
