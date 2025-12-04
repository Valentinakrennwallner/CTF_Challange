import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getConnection } from '@/lib/db'
import { createToken } from '@/lib/auth'
import { sanitizeInput, detectSuspiciousInput } from '@/lib/validation'
import { logAudit, getClientIp } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const connection = getConnection()
  const clientIp = getClientIp(request)

  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      )
    }

    const sanitizedUsername = sanitizeInput(username)

    if (detectSuspiciousInput(sanitizedUsername)) {
      await logAudit(
        'login',
        sanitizedUsername,
        clientIp,
        'failure',
        'Suspicious input detected'
      )
      return NextResponse.json(
        { success: false, message: 'Kredensial tidak valid' },
        { status: 401 }
      )
    }

    const [users] = (await connection.execute(
      'SELECT id, username, password, role, student_id FROM users WHERE username = ?',
      [sanitizedUsername]
    )) as any

    if (users.length === 0) {
      await logAudit(
        'login',
        sanitizedUsername,
        clientIp,
        'failure',
        'User not found'
      )
      return NextResponse.json(
        { success: false, message: 'Kredensial tidak valid' },
        { status: 401 }
      )
    }

    const user = users[0]

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      await logAudit(
        'login',
        sanitizedUsername,
        clientIp,
        'failure',
        'Invalid password'
      )
      return NextResponse.json(
        { success: false, message: 'Kredensial tidak valid' },
        { status: 401 }
      )
    }

    const token = await createToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      studentId: user.student_id,
    })

    await logAudit(
      'login',
      sanitizedUsername,
      clientIp,
      'success',
      `User logged in successfully`
    )

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login berhasil',
        user: {
          username: user.username,
          role: user.role,
          studentId: user.student_id,
        },
      },
      { status: 200 }
    )

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    await logAudit('login', null, clientIp, 'failure', 'Server error')
    return NextResponse.json(
      { success: false, message: 'Login gagal' },
      { status: 500 }
    )
  }
}
