import Modal from '../Modal'
import FormInput from '../FormInput'
import MessageBox from '../MessageBox'

interface AdminFormData {
  username: string
  password: string
  confirm_password: string
}

interface AdminModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  formData: AdminFormData
  setFormData: (data: AdminFormData) => void
  message: string
  isSubmitting: boolean
}

export default function AdminModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  message,
  isSubmitting,
}: AdminModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Add New Admin Account'>
      <form onSubmit={onSubmit} className='space-y-4'>
        <FormInput
          label='Username'
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          placeholder='example., admin2'
          required
          minLength={3}
        />

        <div>
          <FormInput
            label='Password'
            type='password'
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder='Min. 8 characters'
            required
            minLength={8}
          />
          <p className='text-xs text-gray-400 mt-1'>
            Minimum 8 characters, must contain uppercase letters, lowercase letters, and numbers
          </p>
        </div>

        <FormInput
          label='Confirm Password'
          type='password'
          value={formData.confirm_password}
          onChange={(e) =>
            setFormData({ ...formData, confirm_password: e.target.value })
          }
          placeholder='Repeat password'
          required
        />

        {message && (
          <MessageBox
            message={message}
            type={message.includes('berhasil') ? 'success' : 'error'}
          />
        )}

        <div className='flex gap-3 mt-6'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            {isSubmitting && (
              <svg
                className='animate-spin h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
            )}
            {isSubmitting ? 'Adding...' : 'Add Admin'}
          </button>
          <button
            type='button'
            onClick={onClose}
            disabled={isSubmitting}
            className='flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  )
}
