import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getConnection } from '@/lib/db'
import {
  validateEmail,
  validatePassword,
  validateStudentId,
  validateUsername,
  sanitizeInput,
  detectSuspiciousInput,
} from '@/lib/validation'
import { logAudit, getClientIp } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const connection = getConnection()
  const clientIp = getClientIp(request)

  try {
    const body = await request.json()
    const {
      student_id,
      name,
      email,
      username,
      password,
      confirm_password,
      major,
    } = body

    const errors: any[] = []

    if (!student_id || !name || !username || !password || !confirm_password) {
      return NextResponse.json(
        { success: false, message: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    const sanitizedStudentId = sanitizeInput(student_id)
    const sanitizedName = sanitizeInput(name)
    const sanitizedEmail = email ? sanitizeInput(email) : null
    const sanitizedUsername = sanitizeInput(username)
    const sanitizedMajor = major ? sanitizeInput(major) : null

    if (
      detectSuspiciousInput(sanitizedUsername) ||
      detectSuspiciousInput(sanitizedStudentId)
    ) {
      await logAudit(
        'register',
        sanitizedUsername,
        clientIp,
        'failure',
        'Suspicious input detected'
      )
      return NextResponse.json(
        { success: false, message: 'Input tidak valid terdeteksi' },
        { status: 400 }
      )
    }

    if (!validateStudentId(sanitizedStudentId)) {
      errors.push({
        field: 'student_id',
        message: 'Student ID should 6-10 digits',
      })
    }

    if (!validateUsername(sanitizedUsername)) {
      errors.push({
        field: 'username',
        message: 'Username must be 3-100 alphanumeric characters',
      })
    }

    if (sanitizedEmail && !validateEmail(sanitizedEmail)) {
      errors.push({ field: 'email', message: 'Format email tidak valid' })
    }

    const passwordErrors = validatePassword(password)
    errors.push(...passwordErrors)

    if (password !== confirm_password) {
      errors.push({
        field: 'confirm_password',
        message: 'Passwords do not match',
      })
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    const [existingStudent] = (await connection.execute(
      'SELECT student_id FROM students WHERE student_id = ?',
      [sanitizedStudentId]
    )) as any

    if (existingStudent.length > 0) {
      await logAudit(
        'register',
        sanitizedUsername,
        clientIp,
        'failure',
        'Student ID already exists'
      )
      return NextResponse.json(
        { success: false, message: 'Student ID is already registered' },
        { status: 409 }
      )
    }

    const [existingUser] = (await connection.execute(
      'SELECT username FROM users WHERE username = ?',
      [sanitizedUsername]
    )) as any

    if (existingUser.length > 0) {
      await logAudit(
        'register',
        sanitizedUsername,
        clientIp,
        'failure',
        'Username already exists'
      )
      return NextResponse.json(
        { success: false, message: 'Username is already registered' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const conn = await connection.getConnection()
    await conn.beginTransaction()

    try {
      await conn.execute(
        'INSERT INTO students (student_id, name, email, major) VALUES (?, ?, ?, ?)',
        [sanitizedStudentId, sanitizedName, sanitizedEmail, sanitizedMajor]
      )

      await conn.execute(
        'INSERT INTO users (username, password, role, student_id) VALUES (?, ?, ?, ?)',
        [sanitizedUsername, hashedPassword, 'student', sanitizedStudentId]
      )

      await conn.commit()
      conn.release()

      await logAudit(
        'register',
        sanitizedUsername,
        clientIp,
        'success',
        `Student ${sanitizedStudentId} registered`
      )

      return NextResponse.json(
        { success: true, message: 'Registrasi berhasil' },
        { status: 201 }
      )
    } catch (error) {
      await conn.rollback()
      conn.release()
      throw error
    }
  } catch (error) {
    console.error('Registration error:', error)
    await logAudit('register', null, clientIp, 'failure', 'Server error')
    return NextResponse.json(
      { success: false, message: 'Registrasi gagal' },
      { status: 500 }
    )
  }
}
