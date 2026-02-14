interface RankingBadgeProps {
  rank: number
  change?: number
}

export default function RankingBadge({ rank, change }: RankingBadgeProps) {
  const getBadgeStyle = (rank: number): string => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black border-4 border-yellow-300 shadow-xl shadow-yellow-500/50 animate-pulse'
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-black border-4 border-gray-200 shadow-xl shadow-gray-400/50'
    if (rank === 3) return 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white border-4 border-orange-400 shadow-xl shadow-orange-500/50'
    if (rank <= 10) return 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white border-2 border-blue-400 shadow-lg'
    return 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white border-2 border-gray-600'
  }

  const getRankIcon = (rank: number): string => {
    if (rank === 1) return '👑'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return ''
  }

  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-lg font-black text-xs ml-2 shadow-lg" aria-label="Rank increased">
          <span className="text-sm">↑</span>
          <span>{change}</span>
        </div>
      )
    }
    if (change < 0) {
      return (
        <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded-lg font-black text-xs ml-2 shadow-lg" aria-label="Rank decreased">
          <span className="text-sm">↓</span>
          <span>{Math.abs(change)}</span>
        </div>
      )
    }
    return null
  }

  return (
    <div className="inline-flex items-center">
      <span
        className={`px-4 py-2 rounded-xl font-black text-lg flex items-center gap-2 ${getBadgeStyle(rank)}`}
        aria-label={`Rank ${rank}`}
      >
        {getRankIcon(rank) && <span className="text-xl">{getRankIcon(rank)}</span>}
        <span>#{rank}</span>
      </span>
      {change !== undefined && change !== 0 && getChangeIndicator(change)}
    </div>
  )
}
