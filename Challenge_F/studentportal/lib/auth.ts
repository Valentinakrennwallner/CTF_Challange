import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key'
)

export interface JWTPayload {
  userId: number
  username: string
  role: 'student' | 'admin'
  studentId?: string
}

export async function createToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)

  return token
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return {
      userId: payload.userId as number,
      username: payload.username as string,
      role: payload.role as 'student' | 'admin',
      studentId: payload.studentId as string | undefined,
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  return verifyToken(token)
}

export async function requireAuth(
  requiredRole?: 'student' | 'admin'
): Promise<JWTPayload> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  if (requiredRole && session.role !== requiredRole) {
    throw new Error('Forbidden')
  }

  return session
}
