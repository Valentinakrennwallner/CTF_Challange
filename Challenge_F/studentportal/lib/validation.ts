export interface ValidationError {
  field: string
  message: string
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validatePassword(password: string): ValidationError[] {
  const errors: ValidationError[] = []

  if (password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters',
    })
  }

  if (!/[A-Z]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one uppercase letter',
    })
  }

  if (!/[a-z]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one lowercase letter',
    })
  }

  if (!/[0-9]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one number',
    })
  }

  return errors
}

export function validateStudentId(studentId: string): boolean {
  return /^\d{6,10}$/.test(studentId)
}

export function validateUsername(username: string): boolean {
  return (
    username.length >= 3 &&
    username.length <= 100 &&
    /^[a-zA-Z0-9_]+$/.test(username)
  )
}

export function sanitizeInput(input: string): string {
  return input.trim()
}

export function detectSuspiciousInput(input: string): boolean {
  const suspiciousPatterns = [
    /--/,
    /;/,
    /'/,
    /"/,
    /union/i,
    /select/i,
    /drop/i,
    /insert/i,
    /update/i,
    /delete/i,
  ]

  return suspiciousPatterns.some((pattern) => pattern.test(input))
}
