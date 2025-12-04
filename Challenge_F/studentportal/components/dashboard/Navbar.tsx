interface NavbarProps {
  title: string
  username: string
  role: string
  onLogout: () => void
  onAddAdmin?: () => void
  showAddAdmin?: boolean
}

export default function Navbar({
  title,
  username,
  role,
  onLogout,
  onAddAdmin,
  showAddAdmin = false,
}: NavbarProps) {
  return (
    <nav className='bg-white/10 backdrop-blur-lg border-b border-white/10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center gap-3'>
            <h1 className='text-white text-2xl font-bold'>{title}</h1>
            {role === 'admin' && (
              <span className='bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-semibold'>
                ADMIN
              </span>
            )}
          </div>
          <div className='flex items-center gap-4'>
            {showAddAdmin && onAddAdmin && (
              <button
                onClick={onAddAdmin}
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
                    d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
                  />
                </svg>
                Add Admin
              </button>
            )}
            <div className='text-right'>
              <p className='text-white font-semibold'>{username}</p>
              <p className='text-purple-300 text-sm'>{role}</p>
            </div>
            <button
              onClick={onLogout}
              className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors'
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
