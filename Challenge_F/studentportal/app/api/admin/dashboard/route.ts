import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getConnection } from '@/lib/db'

export async function GET() {
  try {
    const session = await requireAuth('admin')

    const connection = getConnection()

    const [students] = (await connection.execute(
      'SELECT student_id, name, email, major, created_at FROM students ORDER BY created_at DESC'
    )) as any

    const [users] = (await connection.execute(
      'SELECT id, username, role, student_id, created_at FROM users ORDER BY created_at DESC'
    )) as any

    const [grades] = (await connection.execute(
      'SELECT g.id, g.student_id, s.name as student_name, g.course_code, g.course_title, g.grade FROM grades g LEFT JOIN students s ON g.student_id = s.student_id ORDER BY g.id DESC'
    )) as any

    const [statsStudents] = (await connection.execute(
      'SELECT COUNT(*) as count FROM students'
    )) as any
    const [statsUsers] = (await connection.execute(
      'SELECT COUNT(*) as count FROM users'
    )) as any
    const [statsGrades] = (await connection.execute(
      'SELECT COUNT(*) as count FROM grades'
    )) as any

    return NextResponse.json({
      success: true,
      data: {
        students,
        users,
        grades,
        stats: {
          totalStudents: statsStudents[0].count,
          totalUsers: statsUsers[0].count,
          totalGrades: statsGrades[0].count,
        },
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

    console.error('Error fetching admin data:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
