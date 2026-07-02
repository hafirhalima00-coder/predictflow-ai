import { NextRequest, NextResponse } from 'next/server'
import {
  getPendingApprovals,
  reviewApproval,
  getAllApprovals,
  getApprovalStats,
  getApprovalById,
} from '@/services/approval-service'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const stats = searchParams.get('stats')

  if (stats === 'true') {
    return NextResponse.json({ stats: getApprovalStats() })
  }

  if (id) {
    const approval = getApprovalById(id)
    if (!approval) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ approval })
  }

  const pending = searchParams.get('pending') === 'true'
  if (pending) {
    return NextResponse.json({ approvals: getPendingApprovals() })
  }

  return NextResponse.json({ approvals: getAllApprovals() })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, status, reviewedBy, comments } = body

    if (!id || !status || !reviewedBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (status !== 'approved' && status !== 'rejected') {
      return NextResponse.json({ error: 'Status must be approved or rejected' }, { status: 400 })
    }

    const result = reviewApproval(id, status, reviewedBy, comments)
    if (!result) {
      return NextResponse.json({ error: 'Approval not found or already processed' }, { status: 404 })
    }

    return NextResponse.json({ success: true, approval: result })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process approval' }, { status: 500 })
  }
}
