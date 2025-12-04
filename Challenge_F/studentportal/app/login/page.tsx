'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import FormInput from '@/components/FormInput'
import SubmitButton from '@/components/SubmitButton'
import MessageBox from '@/components/MessageBox'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  //const [loginMode, setLoginMode] = useState<'secure' | 'vulnerable'>('secure')
  const router = useRouter()

  // Ensure loginMode is always defined to avoid ReferenceError in the browser.
  // Use window.loginMode when available (client), then NEXT_PUBLIC_LOGIN_MODE, then default 'safe'.
  const loginMode =
    (typeof window !== 'undefined' && (window as any).loginMode) ||
    process.env.NEXT_PUBLIC_LOGIN_MODE ||
    'safe'

  {/*
  const handleSubmit = async (
    e: React.FormEvent,
      mode: 'secure' | 'vulnerable' = loginMode
  ) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint =
        mode === 'vulnerable' ? '/api/vulnerable/login' : '/api/login'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()

      if (data.success) {
        router.push('/dashboard')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      setError('An error has occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }
    */}

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    // SELALU PAKAI ENDPOINT VULNERABLE
    const response = await fetch('/api/vulnerable/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      router.push('/dashboard');
    } else {
      setError(data.message || 'Login failed');
    }
  } catch (error) {
    setError('An error has occurred. Please try again.');
  } finally {
    setLoading(false);
  }
}; 

  return (
    <div className='min-h-screen flex'>
      <div className='w-full lg:w-1/2 bg-[#2c2c2c] flex items-center justify-center p-8'>
        <div className='w-full max-w-md'>
          <h1 className='text-white text-5xl font-bold mb-2'>Login</h1>
          <p className='text-gray-400 text-lg mb-8'>
            Input your detail
          </p>

 {/*
          <div className='mb-6'>
            <div className='flex bg-gray-700 rounded-lg p-1'>
               
              <button
                type='button'
                onClick={() => setLoginMode('secure')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  loginMode === 'secure'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
              
               
                

              </button>
              <button
                type='button'
                onClick={() => setLoginMode('vulnerable')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  loginMode === 'vulnerable'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >

              </button>
            </div>
          </div>
          */}

          <form onSubmit={handleSubmit} className='space-y-6'>
            <FormInput
              label=''
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder='Username'
              required
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
            />

            <div className='text-left'>
              <a href='#' className='text-white hover:text-purple-400 text-sm'>
                Forget Password?
              </a>
            </div>

            {error && <MessageBox message={error} type='error' />}

            <SubmitButton
              isLoading={loading}
              loadingText='Logging in...'
              text={`Login ${loginMode === 'vulnerable' ? '(Vulnerable)' : ''}`}
            />
          </form>

          <div className='mt-8 text-center'>
            <span className='text-white'>Don’t have an account yet? </span>
            <Link
              href='/register'
              className='text-white font-semibold bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg inline-block transition-all'
            >
              Register
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
