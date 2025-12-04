import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getConnection } from '@/lib/db'

export async function GET() {
  try {
    await requireAuth('admin')

    const connection = getConnection()

    const [students] = (await connection.execute(
      'SELECT COUNT(*) as count FROM students'
    )) as any
    const [users] = (await connection.execute(
      'SELECT COUNT(*) as count FROM users'
    )) as any
    const [grades] = (await connection.execute(
      'SELECT COUNT(*) as count FROM grades'
    )) as any

    return NextResponse.json({
      success: true,
      data: {
        students: students[0].count,
        users: users[0].count,
        grades: grades[0].count,
      },
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (error.message === 'Forbidden') {
      return NextResponse.json(
        { success: false, message: 'Forbidden - Admin only' },
        { status: 403 }
      )
    }

    console.error('Error fetching database info:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
