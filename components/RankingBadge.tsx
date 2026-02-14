interface RankingBadgeProps {
  rank: number
  change?: number
}

export default function RankingBadge({ rank, change }: RankingBadgeProps) {
  const getBadgeColor = (rank: number): string => {
    if (rank === 1) return 'bg-yellow-500 text-white'
    if (rank === 2) return 'bg-gray-400 text-white'
    if (rank === 3) return 'bg-orange-600 text-white'
    if (rank <= 10) return 'bg-blue-600 text-white'
    return 'bg-gray-200 text-gray-800'
  }

  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return (
        <span className="text-green-600 text-xs ml-1" aria-label="Rank increased">
          ↑{change}
        </span>
      )
    }
    if (change < 0) {
      return (
        <span className="text-red-600 text-xs ml-1" aria-label="Rank decreased">
          ↓{Math.abs(change)}
        </span>
      )
    }
    return null
  }

  return (
    <div className="inline-flex items-center">
      <span
        className={`px-3 py-1 rounded-full font-bold ${getBadgeColor(rank)}`}
        aria-label={`Rank ${rank}`}
      >
        #{rank}
      </span>
      {change !== undefined && change !== 0 && getChangeIndicator(change)}
    </div>
  )
}
