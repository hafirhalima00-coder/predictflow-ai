"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate, formatPercentage } from "@/lib/utils"
import type { ApprovalRequest } from "@/lib/types"
import { ShieldCheck, ShieldX, Clock, User, MessageSquare } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface ApprovalQueueProps {
  approvals: ApprovalRequest[]
  onReview: (id: string, status: "approved" | "rejected", comments: string) => void
}

export function ApprovalQueue({ approvals, onReview }: ApprovalQueueProps) {
  const [comments, setComments] = useState<Record<string, string>>({})

  const pending = approvals.filter((a) => a.status === "pending")
  const reviewed = approvals.filter((a) => a.status !== "pending")

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium">
          Pending Approvals ({pending.length})
        </h3>
        {pending.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-sm text-muted-foreground">
              <Clock className="mx-auto mb-2 h-6 w-6" />
              No pending approvals
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pending.map((approval) => (
              <Card key={approval.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {approval.simulationTitle}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Requested by {approval.requestedBy} &middot;{" "}
                        {formatDate(approval.requestedAt)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        approval.riskScore >= 0.8 ? "destructive" : approval.riskScore >= 0.6 ? "warning" : "info"
                      }
                    >
                      Risk: {(approval.riskScore * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {approval.rationale && (
                    <p className="mb-3 text-xs text-muted-foreground">{approval.rationale}</p>
                  )}
                  <Textarea
                    placeholder="Add review comments..."
                    value={comments[approval.id] || ""}
                    onChange={(e) =>
                      setComments((prev) => ({ ...prev, [approval.id]: e.target.value }))
                    }
                    className="mb-3 h-20 text-xs"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                      onClick={() => onReview(approval.id, "rejected", comments[approval.id] || "")}
                    >
                      <ShieldX className="h-3 w-3" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1"
                      onClick={() => onReview(approval.id, "approved", comments[approval.id] || "")}
                    >
                      <ShieldCheck className="h-3 w-3" />
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {reviewed.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium">Review History</h3>
          <div className="space-y-2">
            {reviewed.map((approval) => (
              <Card key={approval.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{approval.simulationTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(approval.requestedAt)} by {approval.requestedBy}
                    </p>
                    {approval.comments && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        <MessageSquare className="mr-1 inline h-3 w-3" />
                        {approval.comments}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      approval.status === "approved"
                        ? "success"
                        : approval.status === "rejected"
                          ? "destructive"
                          : "warning"
                    }
                  >
                    {approval.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
