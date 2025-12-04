const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...\n')

    const connection = await mysql.createConnection({
      // Use env vars for DB connection; the real targets
      // are defined in the compose file
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    console.log('✅ Connected to database\n')

    // Check if data already exists
    const [existingStudents] = await connection.execute(
      'SELECT COUNT(*) as count FROM students'
    )
    if (existingStudents[0].count > 0) {
      console.log('Database already has data. Skipping seed...')
      await connection.end()
      process.exit(0)
    }

    // Sample student data
    const students = [
      {
        student_id: '2024001',
        name: 'Valin Fernanda',
        email: 'valin@example.com',
        major: 'Computer Science',
      },
      {
        student_id: '2024002',
        name: 'Andreas',
        email: 'andreas@example.com',
        major: 'Information Technology',
      },
    ]

    console.log('Adding sample students...')
    for (const student of students) {
      await connection.execute(
        'INSERT INTO students (student_id, name, email, major) VALUES (?, ?, ?, ?)',
        [student.student_id, student.name, student.email, student.major]
      )
      console.log(`Added student: ${student.name} (${student.student_id})`)
    }

    // Sample users with hashed passwords
    console.log('\nAdding sample users...')
    const hashedPassword1 = await bcrypt.hash('Student123', 10)
    const hashedPassword2 = await bcrypt.hash('Admin123', 10)

    await connection.execute(
      'INSERT INTO users (username, password, role, student_id) VALUES (?, ?, ?, ?)',
      ['valin', hashedPassword1, 'student', '2024001']
    )
    console.log('Added user: valin (password: Student123)')

    await connection.execute(
      'INSERT INTO users (username, password, role, student_id) VALUES (?, ?, ?, ?)',
      ['admin', hashedPassword2, 'admin', null]
    )
    console.log('Added user: admin (password: Admin123)')

    // Sample grades for Valin
    console.log('\nAdding sample grades...')
    const grades = [
      {
        student_id: '2024001',
        course_code: 'IF101',
        course_title: 'Introduction to Programming',
        grade: 'A',
      },
      {
        student_id: '2024001',
        course_code: 'IF102',
        course_title: 'Data Structure',
        grade: 'A-',
      },
      {
        student_id: '2024001',
        course_code: 'IF103',
        course_title: 'Algorithms and Programming',
        grade: 'B+',
      },
      {
        student_id: '2024001',
        course_code: 'MAT101',
        course_title: 'Calculus I',
        grade: 'B',
      },
    ]

    for (const grade of grades) {
      await connection.execute(
        'INSERT INTO grades (student_id, course_code, course_title, grade) VALUES (?, ?, ?, ?)',
        [grade.student_id, grade.course_code, grade.course_title, grade.grade]
      )
      console.log(`Added grade: ${grade.course_code} - ${grade.grade}`)
    }

    await connection.end()

    console.log('\n Database seeded successfully!\n')
    console.log(' Test credentials:')
    console.log('   Student: username=valin, password=Student123')
    console.log('   Admin:   username=admin, password=Admin123\n')

    process.exit(0)
  } catch (error) {
    console.error('\n Database seeding failed!')
    console.error('Error:', error.message)
    process.exit(1)
  }
}

seedDatabase()
