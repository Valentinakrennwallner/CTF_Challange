const mysql = require('mysql2/promise')

// DB config is read from environment variables: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
async function testConnection() {
  try {
    console.log('🔍 Testing database connection...\n')

    const connection = await mysql.createConnection({
      // Use env vars for DB connection; the real targets
      // are defined in the compose file
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    console.log(' Database connection successful!\n')

    // Test query
    const [rows] = await connection.execute(
      'SELECT 1 as test, NOW() as time_now'
    )
    console.log('Test query result:', rows)

    // Show existing tables
    const [tables] = await connection.execute('SHOW TABLES')
    console.log('\nExisting tables:', tables)

    await connection.end()
    console.log('\n Connection closed successfully')
    process.exit(0)
  } catch (error) {
    console.error(' Database connection failed!\n')
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    console.error('\nFull error:', error)
    process.exit(1)
  }
}

testConnection()
