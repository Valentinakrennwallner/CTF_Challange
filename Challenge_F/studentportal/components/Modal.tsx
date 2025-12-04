import { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20'>
        <h3 className='text-white text-2xl font-bold mb-6'>{title}</h3>
        {children}
      </div>
    </div>
  )
}
