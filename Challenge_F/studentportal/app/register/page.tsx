'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import FormInput from '@/components/FormInput'
import FormSelect from '@/components/FormSelect'
import SubmitButton from '@/components/SubmitButton'
import MessageBox from '@/components/MessageBox'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    email: '',
    username: '',
    password: '',
    confirm_password: '',
    major: '',
  })
  const [errors, setErrors] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const majors = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Information Technology', label: 'Information Technology' },
    { value: 'Software Engineering', label: 'Software Engineering' },
    { value: 'Information System', label: 'Information System' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Cyber Security', label: 'Cyber Security' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('“Registration successful! Redirecting to the login page...”')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setMessage(data.message || 'Registration failed')
        }
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getFieldError = (field: string) => {
    return errors.find((e) => e.field === field)?.message
  }

  return (
    <div className='min-h-screen flex'>
      <div className='w-full lg:w-1/2 bg-[#2c2c2c] flex items-center justify-center p-8 overflow-y-auto'>
        <div className='w-full max-w-md py-8'>
          <h1 className='text-white text-5xl font-bold mb-2'>Register</h1>
          <p className='text-gray-400 text-lg mb-8'>Create your student account</p>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <FormInput
              label=''
              value={formData.student_id}
              onChange={(e) =>
                setFormData({ ...formData, student_id: e.target.value })
              }
              placeholder='Student ID number (6-10 digit)'
              required
              error={getFieldError('student_id')}
            />

            <FormInput
              label=''
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder='Fullname'
              required
            />

            <FormInput
              label=''
              type='email'
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder='Email'
              error={getFieldError('email')}
            />

            <FormSelect
              label=''
              value={formData.major}
              onChange={(e) =>
                setFormData({ ...formData, major: e.target.value })
              }
              options={majors}
              placeholder='Select a major'
            />

            <FormInput
              label=''
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder='Username'
              required
              error={getFieldError('username')}
            />

            <FormInput
              label=''
              type='password'
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder='Password'
              required
              minLength={8}
              error={getFieldError('password')}
            />

            <FormInput
              label=''
              type='password'
              value={formData.confirm_password}
              onChange={(e) =>
                setFormData({ ...formData, confirm_password: e.target.value })
              }
              placeholder='Confirm Password'
              required
              error={getFieldError('confirm_password')}
            />

            {message && (
              <MessageBox
                message={message}
                type={message.includes('berhasil') ? 'success' : 'error'}
              />
            )}

            <SubmitButton
              isLoading={loading}
              loadingText='Creating your account...'
              text='Register'
            />
          </form>

          <div className='mt-6 text-center'>
            <span className='text-white'>Already have an account? </span>
            <Link
              href='/login'
              className='text-white font-semibold bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg inline-block transition-all'
            >
              Log in
            </Link>
          </div>
        </div>
      </div>

      <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-400 to-purple-500 items-center justify-center p-4 relative overflow-hidden'>
        <div className='relative w-3/4 max-w-2xl'>
          <Image
            src='/login.png'
            alt='Login Portal Illustration'
            width={800}
            height={600}
            className='w-full h-full'
            priority
          />
        </div>

        <div className='absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl'></div>
      </div>
    </div>
  )
}
