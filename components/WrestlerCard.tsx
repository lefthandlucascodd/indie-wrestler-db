import Link from 'next/link'
import { Wrestler } from '@/lib/types'
import RankingBadge from './RankingBadge'

interface WrestlerCardProps {
  wrestler: Wrestler
  previousRank?: number
}

export default function WrestlerCard({ wrestler, previousRank }: WrestlerCardProps) {
  const rankChange = previousRank ? previousRank - wrestler.popularityRank : undefined

  return (
    <Link href={`/wrestler/${wrestler.id}`}>
      <div
        className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
        data-testid={`wrestler-card-${wrestler.id}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold">{wrestler.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Score: {wrestler.popularityScore.toFixed(2)}
            </p>
          </div>
          <RankingBadge rank={wrestler.popularityRank} change={rankChange} />
        </div>

        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{wrestler.bio}</p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">Twitter:</span>{' '}
            <span className="font-semibold">{wrestler.metrics.twitterFollowers.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Instagram:</span>{' '}
            <span className="font-semibold">{wrestler.metrics.instagramFollowers.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Reddit:</span>{' '}
            <span className="font-semibold">{wrestler.metrics.redditMentions}</span>
          </div>
          <div>
            <span className="text-gray-600">Podcasts:</span>{' '}
            <span className="font-semibold">{wrestler.metrics.podcastMentions}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
