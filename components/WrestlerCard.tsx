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
        className="group relative bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 hover:border-yellow-500 rounded-xl p-6 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] card-shine overflow-hidden"
        data-testid={`wrestler-card-${wrestler.id}`}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/5 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-black text-white group-hover:text-yellow-500 transition-colors uppercase tracking-tight">
                {wrestler.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Popularity Score</span>
                <span className="text-yellow-500 font-black text-lg">
                  {wrestler.popularityScore.toFixed(0)}
                </span>
              </div>
            </div>
            <RankingBadge rank={wrestler.popularityRank} change={rankChange} />
          </div>

          <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">{wrestler.bio}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-800">
            <div className="bg-black/50 rounded-lg p-3 border border-blue-500/20">
              <div className="text-blue-400 text-xs uppercase font-bold mb-1">Twitter</div>
              <div className="text-white font-black text-lg">
                {wrestler.metrics.twitterFollowers.toLocaleString()}
              </div>
            </div>
            <div className="bg-black/50 rounded-lg p-3 border border-pink-500/20">
              <div className="text-pink-400 text-xs uppercase font-bold mb-1">Instagram</div>
              <div className="text-white font-black text-lg">
                {wrestler.metrics.instagramFollowers.toLocaleString()}
              </div>
            </div>
            <div className="bg-black/50 rounded-lg p-3 border border-orange-500/20">
              <div className="text-orange-400 text-xs uppercase font-bold mb-1">Reddit</div>
              <div className="text-white font-black text-lg">
                {wrestler.metrics.redditMentions}
              </div>
            </div>
            <div className="bg-black/50 rounded-lg p-3 border border-purple-500/20">
              <div className="text-purple-400 text-xs uppercase font-bold mb-1">Podcasts</div>
              <div className="text-white font-black text-lg">
                {wrestler.metrics.podcastMentions}
              </div>
            </div>
          </div>

          {/* View Profile Button */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 text-yellow-500 group-hover:text-yellow-400 font-bold text-sm uppercase">
              <span>View Full Profile</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
