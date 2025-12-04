import { getConnection } from './db'

export async function logAudit(
  action: string,
  username: string | null,
  ipAddress: string | null,
  status: 'success' | 'failure',
  details?: string
) {
  try {
    const connection = getConnection()
    await connection.execute(
      `INSERT INTO audit_logs (action, username, ip_address, status, details) VALUES (?, ?, ?, ?, ?)`,
      [action, username, ipAddress, status, details || null]
    )
  } catch (error) {
    console.error('Failed to log audit:', error)
  }
}

export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  return realIp || null
}
