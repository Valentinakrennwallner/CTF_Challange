import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getConnection } from '@/lib/db'
import { createToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const connection = getConnection()

  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      )
    }

    const query = `SELECT id, username, password, role, student_id FROM users WHERE username = '${username}'`

    let users = []
    let queryError = null

    try {
      const [result] = (await connection.execute(query)) as any
      users = result
    } catch (sqlError: any) {
      queryError = sqlError.message

      if (
        username.includes("' OR ") ||
        username.includes("' or ") ||
        username.includes("' --") ||
        username.includes("'--")
      ) {
        try {
          const [adminUsers] = (await connection.execute(
            "SELECT id, username, password, role, student_id FROM users WHERE role = 'admin' LIMIT 1"
          )) as any
          if (adminUsers.length > 0) {
            users = adminUsers
          }
        } catch (e) {}
      }
    }

    if (users.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: queryError
            ? `SQL Error: ${queryError}`
            : 'Kredensial tidak valid - No users found',
          executed_query: query,
          debug: {
            usersFound: 0,
            sqlError: queryError,
            suggestion:
              "Coba payload: admin' OR 1=1-- atau admin' -- atau admin' OR 'a'='a",
          },
        },
        { status: 401 }
      )
    }

    const user = users[0]

    const isSQLInjection =
      username.includes("'") ||
      username.includes('OR') ||
      username.includes('--') ||
      username.includes('1=1')

    let passwordMatch = false

    if (isSQLInjection) {
      passwordMatch = true
    } else {
      passwordMatch = await bcrypt.compare(password, user.password)
    }

    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: `Password incorrect for user: ${user.username}`,
          executed_query: query,
          debug: {
            usersFound: users.length,
            userFound: user.username,
            isSQLInjection,
            passwordChecked: !isSQLInjection,
          },
        },
        { status: 401 }
      )
    }

    const token = await createToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      studentId: user.student_id,
    })

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login berhasil',
        user: {
          username: user.username,
          role: user.role,
          studentId: user.student_id,
        },
        vulnerability_demo: true,
        executed_query: query,
        debug: {
          usersFound: users.length,
          isSQLInjection,
          passwordBypassed: isSQLInjection,
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
    return NextResponse.json(
      {
        success: false,
        message: 'Login gagal',
        error: error instanceof Error ? error.message : 'Unknown error',
        vulnerability_demo: true,
      },
      { status: 500 }
    )
  }
}
