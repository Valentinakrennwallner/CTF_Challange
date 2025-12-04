import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getConnection } from '@/lib/db'
import { logAudit, getClientIp } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    await requireAuth('admin')

    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get('student_id')

    const connection = getConnection()

    let query = `
      SELECT g.id, g.student_id, s.name as student_name, 
             g.course_code, g.course_title, g.grade 
      FROM grades g 
      LEFT JOIN students s ON g.student_id = s.student_id
    `
    const params: any[] = []

    if (studentId) {
      query += ' WHERE g.student_id = ?'
      params.push(studentId)
    }

    query += ' ORDER BY g.id DESC'

    const [grades] = (await connection.execute(query, params)) as any

    return NextResponse.json({
      success: true,
      data: grades,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 403 }
      )
    }

    console.error('Error fetching grades:', error)
    return NextResponse.json(
      { success: false, message: 'Kesalahan server internal' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request)

  try {
    const session = await requireAuth('admin')
    const body = await request.json()
    const { student_id, course_code, course_title, grade } = body

    if (!student_id || !course_code || !course_title || !grade) {
      return NextResponse.json(
        { success: false, message: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    const connection = getConnection()

    const [students] = (await connection.execute(
      'SELECT student_id FROM students WHERE student_id = ?',
      [student_id]
    )) as any

    if (students.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      )
    }

    const [result] = (await connection.execute(
      'INSERT INTO grades (student_id, course_code, course_title, grade) VALUES (?, ?, ?, ?)',
      [student_id, course_code, course_title, grade]
    )) as any

    await logAudit(
      'create_grade',
      session.username,
      clientIp,
      'success',
      `Created grade for student ${student_id}: ${course_code} - ${grade}`
    )

    return NextResponse.json(
      {
        success: true,
        message: 'Score has been added',
        data: { id: result.insertId },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating grade:', error)
    await logAudit('create_grade', null, clientIp, 'failure', error.message)
    return NextResponse.json(
      { success: false, message: 'Kesalahan server internal' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const clientIp = getClientIp(request)

  try {
    const session = await requireAuth('admin')
    const body = await request.json()
    const { id, student_id, course_code, course_title, grade } = body

    if (!id || !student_id || !course_code || !course_title || !grade) {
      return NextResponse.json(
        { success: false, message: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    const connection = getConnection()

    const [existingGrades] = (await connection.execute(
      'SELECT id FROM grades WHERE id = ?',
      [id]
    )) as any

    if (existingGrades.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Grade not found' },
        { status: 404 }
      )
    }

    await connection.execute(
      'UPDATE grades SET student_id = ?, course_code = ?, course_title = ?, grade = ? WHERE id = ?',
      [student_id, course_code, course_title, grade, id]
    )

    await logAudit(
      'update_grade',
      session.username,
      clientIp,
      'success',
      `Updated grade ID ${id}: ${course_code} - ${grade}`
    )

    return NextResponse.json({
      success: true,
      message: 'Grade has been updated',
    })
  } catch (error: any) {
    console.error('Error updating grade:', error)
    await logAudit('update_grade', null, clientIp, 'failure', error.message)
    return NextResponse.json(
      { success: false, message: 'Error internal server' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const clientIp = getClientIp(request)

  try {
    const session = await requireAuth('admin')
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID score should be filled' },
        { status: 400 }
      )
    }

    const connection = getConnection()

    const [existingGrades] = (await connection.execute(
      'SELECT id, course_code FROM grades WHERE id = ?',
      [id]
    )) as any

    if (existingGrades.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Score not found' },
        { status: 404 }
      )
    }

    await connection.execute('DELETE FROM grades WHERE id = ?', [id])

    await logAudit(
      'delete_grade',
      session.username,
      clientIp,
      'success',
      `Deleted grade ID ${id}: ${existingGrades[0].course_code}`
    )

    return NextResponse.json({
      success: true,
      message: 'Score has been deleted',
    })
  } catch (error: any) {
    console.error('Error deleting grade:', error)
    await logAudit('delete_grade', null, clientIp, 'failure', error.message)
    return NextResponse.json(
      { success: false, message: 'Kesalahan server internal' },
      { status: 500 }
    )
  }
}
