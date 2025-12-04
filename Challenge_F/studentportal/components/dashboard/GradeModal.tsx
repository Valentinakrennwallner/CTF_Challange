import Modal from '../Modal'
import FormInput from '../FormInput'
import MessageBox from '../MessageBox'

interface GradeFormData {
  student_id: string
  course_code: string
  course_title: string
  grade: string
}

interface Student {
  student_id: string
  name: string
  major: string
}

interface GradeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  formData: GradeFormData
  setFormData: (data: GradeFormData) => void
  students: Student[]
  isEditing: boolean
  message: string
  isSubmitting: boolean
}

export default function GradeModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  students,
  isEditing,
  message,
  isSubmitting,
}: GradeModalProps) {
  const gradeOptions = [
    { value: 'A', label: 'A' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B', label: 'B' },
    { value: 'B-', label: 'B-' },
    { value: 'C+', label: 'C+' },
    { value: 'C', label: 'C' },
    { value: 'C-', label: 'C-' },
    { value: 'D', label: 'D' },
    { value: 'F', label: 'F' },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Change score' : 'Add new score'}
    >
      <form onSubmit={onSubmit} className='space-y-4'>
        <div>
          <label className='text-purple-300 text-sm mb-2 block'>Student ID</label>
          <select
            value={formData.student_id}
            onChange={(e) =>
              setFormData({ ...formData, student_id: e.target.value })
            }
            className='w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-purple-500 focus:outline-none'
            required
            disabled={isEditing}
          >
            <option value=''>Choose Student</option>
            {students.map((student) => (
              <option key={student.student_id} value={student.student_id}>
                {student.student_id} - {student.name} ({student.major})
              </option>
            ))}
          </select>
          {isEditing && (
            <p className='text-xs text-gray-400 mt-1'>
               Student ID cannot be changed when editing
            </p>
          )}
        </div>

        <FormInput
          label='Course ID'
          value={formData.course_code}
          onChange={(e) =>
            setFormData({ ...formData, course_code: e.target.value })
          }
          placeholder='example., TI101'
          required
        />

        <FormInput
          label='Subject'
          value={formData.course_title}
          onChange={(e) =>
            setFormData({ ...formData, course_title: e.target.value })
          }
          placeholder='example., Introduction to Programming'
          required
        />

        <div>
          <label className='text-purple-300 text-sm mb-2 block'>Score</label>
          <select
            value={formData.grade}
            onChange={(e) =>
              setFormData({ ...formData, grade: e.target.value })
            }
            className='w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-purple-500 focus:outline-none'
            required
          >
            <option value=''>Choose Score </option>
            {gradeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

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
            {isSubmitting
              ? isEditing
                ? 'Changing...'
                : 'Adding...'
              : (isEditing ? 'Change' : 'Add') + ' Score'}
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
