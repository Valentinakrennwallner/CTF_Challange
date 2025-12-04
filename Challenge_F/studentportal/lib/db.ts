import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

export function getConnection() {
  if (!pool) {
    // LANGSUNG PAKAI CONFIG LOKAL XAMPP (nggak usah DATABASE_URL lagi)
    pool = mysql.createPool({
      // Use env vars for DB connection; the real targets
      // are defined in the compose file
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    })
  }
  return pool
}

export async function initializeDatabase() {
  const connection = getConnection()

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id VARCHAR(20) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NULL,
      major VARCHAR(100) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('student','admin') NOT NULL DEFAULT 'student',
      student_id VARCHAR(20) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE SET NULL
    )
  `)

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS grades (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id VARCHAR(20) NOT NULL,
      course_code VARCHAR(20),
      course_title VARCHAR(255),
      grade VARCHAR(10),
      FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
    )
  `)

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      action VARCHAR(100) NOT NULL,
      username VARCHAR(100) NULL,
      ip_address VARCHAR(45) NULL,
      status VARCHAR(20) NOT NULL,
      details TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  console.log('Database tables initialized successfully')
}
