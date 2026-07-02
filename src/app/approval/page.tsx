"use client"

import { useState, useEffect } from "react"
import { getAllApprovals, reviewApproval, createApprovalRequest } from "@/services/approval-service"
import { ApprovalQueue } from "@/components/approval/approval-queue"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ApprovalRequest } from "@/lib/types"
import { ShieldCheck, ShieldAlert, Clock } from "lucide-react"
import { formatPercentage } from "@/lib/utils"

export default function ApprovalPage() {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([])

  useEffect(() => {
    setApprovals(getAllApprovals())
  }, [])

  const handleReview = (id: string, status: "approved" | "rejected", comments: string) => {
    const updated = reviewApproval(id, status, "Current User", comments)
    if (updated) {
      setApprovals(getAllApprovals())
    }
  }

  const pending = approvals.filter((a) => a.status === "pending")
  const approved = approvals.filter((a) => a.status === "approved")
  const rejected = approvals.filter((a) => a.status === "rejected")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Approval Workflow</h1>
        <p className="text-sm text-muted-foreground">
          Review and approve high-risk simulations before execution
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pending.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{approved.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{rejected.length}</p>
          </CardContent>
        </Card>
      </div>

      <ApprovalQueue approvals={approvals} onReview={handleReview} />
    </div>
  )
}
