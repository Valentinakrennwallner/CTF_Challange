export default function Loader({
  message = 'Memuat...',
}: {
  message?: string
}) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        <div className='relative w-20 h-20'>
          <div className='absolute inset-0 border-4 border-purple-200/20 rounded-full'></div>

          <div className='absolute inset-0 border-4 border-transparent border-t-purple-400 border-r-purple-400 rounded-full animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-3 h-3 bg-purple-400 rounded-full animate-pulse'></div>
          </div>
        </div>
        <div className='text-white text-xl font-medium animate-pulse'>
          {message}
        </div>
        <div className='flex gap-2'>
          <div
            className='w-2 h-2 bg-purple-400 rounded-full animate-bounce'
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className='w-2 h-2 bg-purple-400 rounded-full animate-bounce'
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className='w-2 h-2 bg-purple-400 rounded-full animate-bounce'
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </div>
  )
}
