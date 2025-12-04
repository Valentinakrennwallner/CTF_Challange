import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getConnection } from '@/lib/db'

export async function GET() {
  try {
    const session = await requireAuth()

    if (!session.studentId) {
      return NextResponse.json(
        { success: false, message: 'Student ID not found' },
        { status: 400 }
      )
    }

    const connection = getConnection()

    const [students] = (await connection.execute(
      'SELECT student_id, name, email, major, created_at FROM students WHERE student_id = ?',
      [session.studentId]
    )) as any

    if (students.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      )
    }

    const [grades] = (await connection.execute(
      'SELECT id, course_code, course_title, grade FROM grades WHERE student_id = ? ORDER BY id DESC',
      [session.studentId]
    )) as any

    return NextResponse.json({
      success: true,
      data: {
        profile: students[0],
        grades,
      },
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.error('Error fetching student data:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
