interface MessageBoxProps {
  message: string
  type: 'success' | 'error'
}

export default function MessageBox({ message, type }: MessageBoxProps) {
  return (
    <div
      className={`px-4 py-2 rounded-lg text-sm ${
        type === 'success'
          ? 'bg-green-500/10 border border-green-500 text-green-500'
          : 'bg-red-500/10 border border-red-500 text-red-500'
      }`}
    >
      {message}
    </div>
  )
}
