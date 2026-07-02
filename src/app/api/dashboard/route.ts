import { NextResponse } from 'next/server'
import { getDashboardStats } from '@/services/dashboard-service'
import { getApprovalStats } from '@/services/approval-service'

export async function GET() {
  const dashboard = getDashboardStats()
  const approvalStats = getApprovalStats()

  return NextResponse.json({
    ...dashboard,
    approvalStats,
  })
}
