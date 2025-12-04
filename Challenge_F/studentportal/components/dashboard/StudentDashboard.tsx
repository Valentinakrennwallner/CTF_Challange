interface StudentProfile {
  student_id: string
  name: string
  email: string
  major: string
  created_at: string
}

interface Grade {
  id: number
  course_code: string
  course_title: string
  grade: string
}

interface StudentDashboardProps {
  profile: StudentProfile
  grades: Grade[]
}

export default function StudentDashboard({
  profile,
  grades,
}: StudentDashboardProps) {
  const calculateGPA = () => {
    if (grades.length === 0) return '0.00'

    const gradePoints: { [key: string]: number } = {
      A: 4.0,
      'A-': 3.7,
      'B+': 3.3,
      B: 3.0,
      'B-': 2.7,
      'C+': 2.3,
      C: 2.0,
      'C-': 1.7,
      D: 1.0,
      F: 0.0,
    }

    const total = grades.reduce((sum, grade) => {
      return sum + (gradePoints[grade.grade] || 0)
    }, 0)

    return (total / grades.length).toFixed(2)
  }

  const getGradeColor = (grade: string) => {
    if (grade === 'A') return 'bg-green-500/20 text-green-400'
    if (grade.startsWith('A')) return 'bg-green-500/20 text-green-400'
    if (grade.startsWith('B')) return 'bg-blue-500/20 text-blue-400'
    if (grade.startsWith('C')) return 'bg-yellow-500/20 text-yellow-400'
    return 'bg-red-500/20 text-red-400'
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-purple-300 text-sm font-medium mb-1'>GPA</p>
              <p className='text-white text-3xl font-bold'>{calculateGPA()}</p>
            </div>
            <div className='bg-purple-500/20 p-3 rounded-xl'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-8 w-8 text-purple-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
            </div>
          </div>
        </div>

        <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-purple-300 text-sm font-medium mb-1'>
                Total Courses
              </p>
              <p className='text-white text-3xl font-bold'>{grades.length}</p>
            </div>
            <div className='bg-blue-500/20 p-3 rounded-xl'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-8 w-8 text-blue-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                />
              </svg>
            </div>
          </div>
        </div>

        <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-purple-300 text-sm font-medium mb-1'>
                Major
              </p>
              <p className='text-white text-lg font-bold'>
                {profile.major || 'N/A'}
              </p>
            </div>
            <div className='bg-green-500/20 p-3 rounded-xl'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-8 w-8 text-green-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl mb-8'>
        <h2 className='text-white text-2xl font-bold mb-6 flex items-center gap-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
            />
          </svg>
          Student Profile
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <p className='text-purple-300 text-sm mb-1'>Student ID</p>
            <p className='text-white text-lg font-semibold'>
              {profile.student_id}
            </p>
          </div>
          <div>
            <p className='text-purple-300 text-sm mb-1'>Full Name</p>
            <p className='text-white text-lg font-semibold'>{profile.name}</p>
          </div>
          <div>
            <p className='text-purple-300 text-sm mb-1'>Email</p>
            <p className='text-white text-lg font-semibold'>
              {profile.email || 'N/A'}
            </p>
          </div>
          <div>
            <p className='text-purple-300 text-sm mb-1'>Major</p>
            <p className='text-white text-lg font-semibold'>
              {profile.major || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl'>
        <h2 className='text-white text-2xl font-bold mb-6 flex items-center gap-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
          Academic Grades
        </h2>

        {grades.length === 0 ? (
          <div className='text-center py-12'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-16 w-16 text-purple-300 mx-auto mb-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
            <p className='text-purple-300 text-lg'>There is no score available</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-white/10'>
                  <th className='text-left text-purple-300 font-semibold py-3 px-4'>
                    Course Code
                  </th>
                  <th className='text-left text-purple-300 font-semibold py-3 px-4'>
                    Course
                  </th>
                  <th className='text-center text-purple-300 font-semibold py-3 px-4'>
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => (
                  <tr
                    key={grade.id}
                    className='border-b border-white/5 hover:bg-white/5 transition-colors'
                  >
                    <td className='text-white py-4 px-4'>
                      {grade.course_code}
                    </td>
                    <td className='text-white py-4 px-4'>
                      {grade.course_title}
                    </td>
                    <td className='text-center py-4 px-4'>
                      <span
                        className={`inline-block px-3 py-1 rounded-lg font-bold ${getGradeColor(
                          grade.grade
                        )}`}
                      >
                        {grade.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
