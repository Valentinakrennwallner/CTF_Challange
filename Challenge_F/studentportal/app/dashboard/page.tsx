'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Loader from '@/components/Loader'
import Navbar from '@/components/dashboard/Navbar'
import AdminDashboard from '@/components/dashboard/AdminDashboard'
import StudentDashboard from '@/components/dashboard/StudentDashboard'

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

interface User {
  id: number
  username: string
  role: string
  student_id: string | null
  created_at: string
}

interface AdminData {
  students: StudentProfile[]
  users: User[]
  grades: Grade[]
  stats: {
    totalStudents: number
    totalUsers: number
    totalGrades: number
  }
}

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<'student' | 'admin' | null>(null)
  const [username, setUsername] = useState<string>('')
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [grades, setGrades] = useState<Grade[]>([])
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    checkSessionAndFetchData()
  }, [])

  const checkSessionAndFetchData = async () => {
    try {
      const sessionResponse = await fetch('/api/auth/session')
      const sessionData = await sessionResponse.json()

      if (!sessionData.success) {
        router.push('/login')
        return
      }

      setUserRole(sessionData.data.role)
      setUsername(sessionData.data.username)

      if (sessionData.data.role === 'admin') {
        await fetchAdminData()
      } else {
        await fetchStudentData()
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentData = async () => {
    try {
      const response = await fetch('/api/student/me')
      const data = await response.json()

      if (data.success) {
        setProfile(data.data.profile)
        setGrades(data.data.grades)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching student data:', error)
      router.push('/login')
    }
  }

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      const data = await response.json()

      if (data.success) {
        setAdminData(data.data)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
      router.push('/login')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const openAddAdminModal = () => {
    const btn = document.getElementById('openAdminModalBtn')
    if (btn) btn.click()
  }

  if (loading) {
    return <Loader message='Login...' />
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      <Navbar
        title={userRole === 'admin' ? 'Admin Dashboard' : 'Student Portal'}
        username={userRole === 'admin' ? username : profile?.name || ''}
        role={
          userRole === 'admin' ? 'Administrator' : profile?.student_id || ''
        }
        onLogout={handleLogout}
        onAddAdmin={openAddAdminModal}
        showAddAdmin={userRole === 'admin'}
      />

      {userRole === 'admin' && adminData ? (
        <AdminDashboard data={adminData} onRefresh={fetchAdminData} />
      ) : profile ? (
        <StudentDashboard profile={profile} grades={grades} />
      ) : null}
    </div>
  )
}
