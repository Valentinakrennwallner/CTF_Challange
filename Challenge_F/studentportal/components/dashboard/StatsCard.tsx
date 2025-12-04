interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  bgColor: string
}

export default function StatsCard({
  title,
  value,
  icon,
  bgColor,
}: StatsCardProps) {
  return (
    <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-purple-300 text-sm font-medium mb-1'>{title}</p>
          <p className='text-white text-3xl font-bold'>{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-xl`}>{icon}</div>
      </div>
    </div>
  )
}
