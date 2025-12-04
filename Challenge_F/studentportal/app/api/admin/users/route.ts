import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { requireAuth } from '@/lib/auth'
import { getConnection } from '@/lib/db'
import {
  validatePassword,
  validateUsername,
  sanitizeInput,
  detectSuspiciousInput,
} from '@/lib/validation'
import { logAudit, getClientIp } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request)

  try {
    const session = await requireAuth('admin')
    const body = await request.json()
    const { username, password, confirm_password } = body

    if (!username || !password || !confirm_password) {
      return NextResponse.json(
        { success: false, message: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    const sanitizedUsername = sanitizeInput(username)

    if (detectSuspiciousInput(sanitizedUsername)) {
      await logAudit(
        'create_admin',
        session.username,
        clientIp,
        'failure',
        'Suspicious input detected'
      )
      return NextResponse.json(
        { success: false, message: 'Input tidak valid terdeteksi' },
        { status: 400 }
      )
    }

    if (!validateUsername(sanitizedUsername)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username must be 3-100 alphanumeric characters',
        },
        { status: 400 }
      )
    }

    const passwordErrors = validatePassword(password)
    if (passwordErrors.length > 0) {
      return NextResponse.json(
        { success: false, message: passwordErrors[0].message },
        { status: 400 }
      )
    }

    if (password !== confirm_password) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password' },
        { status: 400 }
      )
    }

    const connection = getConnection()

    const [existingUsers] = (await connection.execute(
      'SELECT username FROM users WHERE username = ?',
      [sanitizedUsername]
    )) as any

    if (existingUsers.length > 0) {
      await logAudit(
        'create_admin',
        session.username,
        clientIp,
        'failure',
        `Username ${sanitizedUsername} already exists`
      )
      return NextResponse.json(
        { success: false, message: 'Nama pengguna sudah terdaftar' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await connection.execute(
      'INSERT INTO users (username, password, role, student_id) VALUES (?, ?, ?, ?)',
      [sanitizedUsername, hashedPassword, 'admin', null]
    )

    await logAudit(
      'create_admin',
      session.username,
      clientIp,
      'success',
      `Created admin user: ${sanitizedUsername}`
    )

    return NextResponse.json(
      {
        success: true,
        message: 'Admin account added successfully',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating admin user:', error)
    await logAudit('create_admin', null, clientIp, 'failure', error.message)
    return NextResponse.json(
      { success: false, message: 'Kesalahan server internal' },
      { status: 500 }
    )
  }
}
