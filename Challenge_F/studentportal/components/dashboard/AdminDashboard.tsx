import { useState } from 'react'
import StatsCard from './StatsCard'
import GradeModal from './GradeModal'
import AdminModal from './AdminModal'

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
  student_id?: string
  student_name?: string
}

interface AdminData {
  students: StudentProfile[]
  users: any[]
  grades: Grade[]
  stats: {
    totalStudents: number
    totalUsers: number
    totalGrades: number
  }
}

interface AdminDashboardProps {
  data: AdminData
  onRefresh: () => void
}

export default function AdminDashboard({
  data,
  onRefresh,
}: AdminDashboardProps) {
  const [showGradeModal, setShowGradeModal] = useState(false)
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null)
  const [gradeForm, setGradeForm] = useState({
    student_id: '',
    course_code: '',
    course_title: '',
    grade: '',
  })
  const [gradeMessage, setGradeMessage] = useState('')
  const [studentsList, setStudentsList] = useState<StudentProfile[]>([])
  const [submitting, setSubmitting] = useState(false)

  const [showAdminModal, setShowAdminModal] = useState(false)
  const [adminForm, setAdminForm] = useState({
    username: '',
    password: '',
    confirm_password: '',
  })
  const [adminMessage, setAdminMessage] = useState('')
  const [adminSubmitting, setAdminSubmitting] = useState(false)

  const fetchStudentsList = async () => {
    try {
      const response = await fetch('/api/admin/students')
      const data = await response.json()
      if (data.success) {
        setStudentsList(data.data)
      }
    } catch (error) {
      console.error('Error fetching students list:', error)
    }
  }

  const openAddGradeModal = async () => {
    setEditingGrade(null)
    setGradeForm({
      student_id: '',
      course_code: '',
      course_title: '',
      grade: '',
    })
    setGradeMessage('')
    await fetchStudentsList()
    setShowGradeModal(true)
  }

  const openEditGradeModal = async (grade: Grade) => {
    setEditingGrade(grade)
    setGradeForm({
      student_id: grade.student_id || '',
      course_code: grade.course_code,
      course_title: grade.course_title,
      grade: grade.grade,
    })
    setGradeMessage('')
    await fetchStudentsList()
    setShowGradeModal(true)
  }

  const closeGradeModal = () => {
    setShowGradeModal(false)
    setEditingGrade(null)
    setGradeForm({
      student_id: '',
      course_code: '',
      course_title: '',
      grade: '',
    })
    setGradeMessage('')
  }

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGradeMessage('')
    setSubmitting(true)

    try {
      const url = '/api/admin/grades'
      const method = editingGrade ? 'PUT' : 'POST'
      const body = editingGrade
        ? { id: editingGrade.id, ...gradeForm }
        : gradeForm

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        setGradeMessage(data.message)
        setTimeout(() => {
          closeGradeModal()
          onRefresh()
        }, 1500)
      } else {
        setGradeMessage(data.message || 'Failed to save grade')
      }
    } catch (error) {
      console.error('Error saving grade:', error)
      setGradeMessage('An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteGrade = async (gradeId: number) => {
    if (!confirm('Are you sure you want to delete this score?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/grades?id=${gradeId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message)
        onRefresh()
      } else {
        alert(data.message || 'Failed to delete grade')
      }
    } catch (error) {
      console.error('Error deleting grade:', error)
      alert('An error occurred')
    }
  }

  const openAddAdminModal = () => {
    setAdminForm({
      username: '',
      password: '',
      confirm_password: '',
    })
    setAdminMessage('')
    setShowAdminModal(true)
  }

  const closeAdminModal = () => {
    setShowAdminModal(false)
    setAdminForm({
      username: '',
      password: '',
      confirm_password: '',
    })
    setAdminMessage('')
  }

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdminMessage('')
    setAdminSubmitting(true)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminForm),
      })

      const data = await response.json()

      if (data.success) {
        setAdminMessage(data.message)
        setTimeout(() => {
          closeAdminModal()
          onRefresh()
        }, 1500)
      } else {
        setAdminMessage(data.message || 'Gagal menambahkan admin')
      }
    } catch (error) {
      console.error('Error creating admin:', error)
      setAdminMessage('Terjadi kesalahan')
    } finally {
      setAdminSubmitting(false)
    }
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
        <StatsCard
          title='Total Students'
          value={data.stats.totalStudents || 0}
          icon={
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
                d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
              />
            </svg>
          }
          bgColor='bg-blue-500/20'
        />
        <StatsCard
          title='Total Users'
          value={data.stats.totalUsers || 0}
          icon={
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
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              />
            </svg>
          }
          bgColor='bg-green-500/20'
        />
        <StatsCard
          title='Total Score'
          value={data.stats.totalGrades || 0}
          icon={
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
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
          }
          bgColor='bg-purple-500/20'
        />
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
              d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
            />
          </svg>
          All Students
        </h2>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-white/10'>
                <th className='text-left text-purple-300 font-semibold py-3 px-4'>
                  Student ID Number
                </th>
                <th className='text-left text-purple-300 font-semibold py-3 px-4'>
                  Name
                </th>
                <th className='text-left text-purple-300 font-semibold py-3 px-4'>
                  Email
                </th>
                <th className='text-left text-purple-300 font-semibold py-3 px-4'>
                  Major
                </th>
              </tr>
            </thead>
            <tbody>
              {data.students.map((student) => (
                <tr
                  key={student.student_id}
                  className='border-b border-white/5 hover:bg-white/5 transition-colors'
                >
                  <td className='text-white py-4 px-4'>{student.student_id}</td>
                  <td className='text-white py-4 px-4'>{student.name}</td>
                  <td className='text-white py-4 px-4'>
                    {student.email || 'N/A'}
                  </td>
                  <td className='text-white py-4 px-4'>
                    {student.major || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-white text-2xl font-bold flex items-center gap-2'>
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
            All Grades
          </h2>
          <button
            onClick={openAddGradeModal}
            className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 4v16m8-8H4'
              />
            </svg>
            Add Score
          </button>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-white/10'>
                <th className='text-left text-purple-300 font-semibold py-3 px-4'>
                  Student ID Number
                </th>
                <th className='text-left text-purple-300 font-semibold py-3 px-4'>
                  Student Name
                </th>
                <th className='text-left text-purple-300 font-semibold py-3 px-4'>
                  Course Code
                </th>
                <th className='text-left text-purple-300 font-semibold py-3 px-4'>
                  Subject
                </th>
                <th className='text-center text-purple-300 font-semibold py-3 px-4'>
                  Grade
                </th>
                <th className='text-center text-purple-300 font-semibold py-3 px-4'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.grades.map((grade) => (
                <tr
                  key={grade.id}
                  className='border-b border-white/5 hover:bg-white/5 transition-colors'
                >
                  <td className='text-white py-4 px-4'>{grade.student_id}</td>
                  <td className='text-white py-4 px-4'>{grade.student_name}</td>
                  <td className='text-white py-4 px-4'>{grade.course_code}</td>
                  <td className='text-white py-4 px-4'>{grade.course_title}</td>
                  <td className='text-center py-4 px-4'>
                    <span
                      className={`inline-block px-3 py-1 rounded-lg font-bold ${getGradeColor(
                        grade.grade
                      )}`}
                    >
                      {grade.grade}
                    </span>
                  </td>
                  <td className='text-center py-4 px-4'>
                    <div className='flex justify-center gap-2'>
                      <button
                        onClick={() => openEditGradeModal(grade)}
                        className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGrade(grade.id)}
                        className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors'
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <GradeModal
        isOpen={showGradeModal}
        onClose={closeGradeModal}
        onSubmit={handleGradeSubmit}
        formData={gradeForm}
        setFormData={setGradeForm}
        students={studentsList}
        isEditing={!!editingGrade}
        message={gradeMessage}
        isSubmitting={submitting}
      />

      <AdminModal
        isOpen={showAdminModal}
        onClose={closeAdminModal}
        onSubmit={handleAdminSubmit}
        formData={adminForm}
        setFormData={setAdminForm}
        message={adminMessage}
        isSubmitting={adminSubmitting}
      />

      <button
        id='openAdminModalBtn'
        onClick={openAddAdminModal}
        className='hidden'
      />
    </div>
  )
}
