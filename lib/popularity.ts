import { Metrics, PopularityWeights } from './types'

/**
 * Default weights for popularity calculation
 * Twitter: 25%, Instagram: 25%, Reddit: 20%, Podcasts: 20%, YouTube: 10%
 */
export const DEFAULT_WEIGHTS: PopularityWeights = {
  twitter: 0.25,
  instagram: 0.25,
  reddit: 0.20,
  podcasts: 0.20,
  youtube: 0.10,
}

/**
 * Normalizes a metric value using min-max normalization
 * Scales values to 0-100 range for fair comparison
 */
export function normalizeMetric(value: number, min: number, max: number): number {
  if (max === min) return 0
  if (value < min) return 0
  if (value > max) return 100
  return ((value - min) / (max - min)) * 100
}

/**
 * Calculates popularity score based on weighted metrics
 * Returns a score between 0-100
 */
export function calculatePopularityScore(
  metrics: Metrics,
  weights: PopularityWeights = DEFAULT_WEIGHTS,
  normalizationParams?: {
    twitterMax: number
    instagramMax: number
    redditMax: number
    podcastsMax: number
    youtubeMax: number
  }
): number {
  // Validate weights sum to 1.0
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0)
  if (Math.abs(totalWeight - 1.0) > 0.01) {
    throw new Error(`Weights must sum to 1.0, got ${totalWeight}`)
  }

  // If normalization parameters provided, normalize metrics
  let normalizedMetrics = {
    twitter: metrics.twitterFollowers,
    instagram: metrics.instagramFollowers,
    reddit: metrics.redditMentions,
    podcasts: metrics.podcastMentions,
    youtube: metrics.youtubeSubscribers,
  }

  if (normalizationParams) {
    normalizedMetrics = {
      twitter: normalizeMetric(metrics.twitterFollowers, 0, normalizationParams.twitterMax),
      instagram: normalizeMetric(metrics.instagramFollowers, 0, normalizationParams.instagramMax),
      reddit: normalizeMetric(metrics.redditMentions, 0, normalizationParams.redditMax),
      podcasts: normalizeMetric(metrics.podcastMentions, 0, normalizationParams.podcastsMax),
      youtube: normalizeMetric(metrics.youtubeSubscribers, 0, normalizationParams.youtubeMax),
    }
  }

  // Calculate weighted score
  const score =
    normalizedMetrics.twitter * weights.twitter +
    normalizedMetrics.instagram * weights.instagram +
    normalizedMetrics.reddit * weights.reddit +
    normalizedMetrics.podcasts * weights.podcasts +
    normalizedMetrics.youtube * weights.youtube

  // Round to 2 decimal places
  return Math.round(score * 100) / 100
}

/**
 * Calculate popularity ranks for an array of wrestlers
 * Wrestlers with same score get the same rank
 */
export function calculateRanks(scores: { id: string; score: number }[]): Map<string, number> {
  // Sort by score descending
  const sorted = [...scores].sort((a, b) => b.score - a.score)

  const ranks = new Map<string, number>()
  let currentRank = 1

  for (let i = 0; i < sorted.length; i++) {
    // If score is same as previous, use same rank
    if (i > 0 && sorted[i].score === sorted[i - 1].score) {
      ranks.set(sorted[i].id, ranks.get(sorted[i - 1].id)!)
    } else {
      ranks.set(sorted[i].id, currentRank)
    }
    currentRank++
  }

  return ranks
}

/**
 * Calculate percentage change between two scores
 */
export function calculateScoreChange(oldScore: number, newScore: number): number {
  if (oldScore === 0) return newScore > 0 ? 100 : 0
  const change = ((newScore - oldScore) / oldScore) * 100
  return Math.round(change * 100) / 100
}
