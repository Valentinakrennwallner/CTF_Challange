import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getConnection } from '@/lib/db'

export async function GET() {
  try {
    await requireAuth('admin')

    const connection = getConnection()

    const [students] = (await connection.execute(
      'SELECT student_id, name, email, major FROM students ORDER BY student_id ASC'
    )) as any

    return NextResponse.json({
      success: true,
      data: students,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 403 }
      )
    }

    console.error('Error fetching students:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
