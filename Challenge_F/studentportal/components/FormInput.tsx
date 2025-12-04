interface FormInputProps {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  error?: string
  minLength?: number
  disabled?: boolean
}

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  minLength,
  disabled = false,
}: FormInputProps) {
  return (
    <div>
      {label && (
        <label className='text-purple-300 text-sm mb-2 block'>{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        disabled={disabled}
        className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed'
      />
      {error && <p className='text-red-400 text-xs mt-1'>{error}</p>}
    </div>
  )
}
