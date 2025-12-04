interface Option {
  value: string
  label: string
}

interface FormSelectProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: Option[]
  required?: boolean
  disabled?: boolean
  placeholder?: string
  helperText?: string
}

export default function FormSelect({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  placeholder = 'Pilih opsi',
  helperText,
}: FormSelectProps) {
  return (
    <div>
      {label && (
        <label className='text-purple-300 text-sm mb-2 block'>{label}</label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        <option value=''>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && <p className='text-xs text-gray-400 mt-1'>{helperText}</p>}
    </div>
  )
}
