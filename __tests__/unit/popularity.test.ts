import {
  calculatePopularityScore,
  normalizeMetric,
  calculateRanks,
  calculateScoreChange,
  DEFAULT_WEIGHTS,
} from '@/lib/popularity'
import { Metrics } from '@/lib/types'
import { Timestamp } from 'firebase/firestore'

describe('Popularity Algorithm', () => {
  describe('normalizeMetric', () => {
    it('should normalize value within range to 0-100', () => {
      expect(normalizeMetric(50, 0, 100)).toBe(50)
      expect(normalizeMetric(25, 0, 100)).toBe(25)
      expect(normalizeMetric(75, 0, 100)).toBe(75)
    })

    it('should return 0 when value equals min', () => {
      expect(normalizeMetric(0, 0, 100)).toBe(0)
    })

    it('should return 100 when value equals max', () => {
      expect(normalizeMetric(100, 0, 100)).toBe(100)
    })

    it('should return 0 when max equals min', () => {
      expect(normalizeMetric(50, 100, 100)).toBe(0)
    })

    it('should return 0 when value is below min', () => {
      expect(normalizeMetric(-10, 0, 100)).toBe(0)
    })

    it('should return 100 when value is above max', () => {
      expect(normalizeMetric(150, 0, 100)).toBe(100)
    })

    it('should handle non-zero min values', () => {
      expect(normalizeMetric(150, 100, 200)).toBe(50)
    })
  })

  describe('calculatePopularityScore', () => {
    const mockMetrics: Metrics = {
      twitterFollowers: 10000,
      instagramFollowers: 8000,
      youtubeSubscribers: 5000,
      redditMentions: 50,
      podcastMentions: 20,
      lastUpdated: Timestamp.now(),
    }

    it('should calculate score with default weights', () => {
      const score = calculatePopularityScore(mockMetrics)

      const expected =
        10000 * 0.25 + // Twitter
        8000 * 0.25 +  // Instagram
        50 * 0.20 +     // Reddit
        20 * 0.20 +     // Podcasts
        5000 * 0.10     // YouTube

      expect(score).toBe(expected)
    })

    it('should calculate score with custom weights', () => {
      const customWeights = {
        twitter: 0.3,
        instagram: 0.3,
        reddit: 0.2,
        podcasts: 0.1,
        youtube: 0.1,
      }

      const score = calculatePopularityScore(mockMetrics, customWeights)

      const expected =
        10000 * 0.3 +
        8000 * 0.3 +
        50 * 0.2 +
        20 * 0.1 +
        5000 * 0.1

      expect(score).toBe(expected)
    })

    it('should throw error if weights do not sum to 1.0', () => {
      const invalidWeights = {
        twitter: 0.3,
        instagram: 0.3,
        reddit: 0.2,
        podcasts: 0.1,
        youtube: 0.05, // Sum = 0.95
      }

      expect(() => calculatePopularityScore(mockMetrics, invalidWeights)).toThrow()
    })

    it('should handle zero metrics', () => {
      const zeroMetrics: Metrics = {
        twitterFollowers: 0,
        instagramFollowers: 0,
        youtubeSubscribers: 0,
        redditMentions: 0,
        podcastMentions: 0,
        lastUpdated: Timestamp.now(),
      }

      const score = calculatePopularityScore(zeroMetrics)
      expect(score).toBe(0)
    })

    it('should normalize metrics when normalization params provided', () => {
      const normParams = {
        twitterMax: 100000,
        instagramMax: 80000,
        redditMax: 1000,
        podcastsMax: 500,
        youtubeMax: 50000,
      }

      const score = calculatePopularityScore(mockMetrics, DEFAULT_WEIGHTS, normParams)

      // Should be between 0-100 when normalized
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)

      // Verify it's using normalized values
      const expectedNormalized =
        10 * 0.25 +  // 10000/100000 * 100 = 10
        10 * 0.25 +  // 8000/80000 * 100 = 10
        5 * 0.20 +   // 50/1000 * 100 = 5
        4 * 0.20 +   // 20/500 * 100 = 4
        10 * 0.10    // 5000/50000 * 100 = 10

      expect(score).toBe(expectedNormalized)
    })

    it('should round score to 2 decimal places', () => {
      const metrics: Metrics = {
        twitterFollowers: 1234,
        instagramFollowers: 5678,
        youtubeSubscribers: 910,
        redditMentions: 11,
        podcastMentions: 13,
        lastUpdated: Timestamp.now(),
      }

      const score = calculatePopularityScore(metrics)

      // Check it has at most 2 decimal places
      expect(Number.isInteger(score * 100)).toBe(true)
    })
  })

  describe('calculateRanks', () => {
    it('should assign ranks in descending score order', () => {
      const scores = [
        { id: 'wrestler1', score: 100 },
        { id: 'wrestler2', score: 80 },
        { id: 'wrestler3', score: 60 },
      ]

      const ranks = calculateRanks(scores)

      expect(ranks.get('wrestler1')).toBe(1)
      expect(ranks.get('wrestler2')).toBe(2)
      expect(ranks.get('wrestler3')).toBe(3)
    })

    it('should assign same rank for same scores', () => {
      const scores = [
        { id: 'wrestler1', score: 100 },
        { id: 'wrestler2', score: 100 },
        { id: 'wrestler3', score: 80 },
      ]

      const ranks = calculateRanks(scores)

      expect(ranks.get('wrestler1')).toBe(1)
      expect(ranks.get('wrestler2')).toBe(1)
      expect(ranks.get('wrestler3')).toBe(3)
    })

    it('should handle single wrestler', () => {
      const scores = [{ id: 'wrestler1', score: 100 }]
      const ranks = calculateRanks(scores)

      expect(ranks.get('wrestler1')).toBe(1)
    })

    it('should handle empty array', () => {
      const ranks = calculateRanks([])
      expect(ranks.size).toBe(0)
    })

    it('should handle all wrestlers with same score', () => {
      const scores = [
        { id: 'wrestler1', score: 50 },
        { id: 'wrestler2', score: 50 },
        { id: 'wrestler3', score: 50 },
      ]

      const ranks = calculateRanks(scores)

      expect(ranks.get('wrestler1')).toBe(1)
      expect(ranks.get('wrestler2')).toBe(1)
      expect(ranks.get('wrestler3')).toBe(1)
    })
  })

  describe('calculateScoreChange', () => {
    it('should calculate positive percentage change', () => {
      expect(calculateScoreChange(100, 150)).toBe(50)
    })

    it('should calculate negative percentage change', () => {
      expect(calculateScoreChange(100, 75)).toBe(-25)
    })

    it('should return 0 for no change', () => {
      expect(calculateScoreChange(100, 100)).toBe(0)
    })

    it('should return 100 when old score is 0 and new score is positive', () => {
      expect(calculateScoreChange(0, 50)).toBe(100)
    })

    it('should return 0 when both scores are 0', () => {
      expect(calculateScoreChange(0, 0)).toBe(0)
    })

    it('should round to 2 decimal places', () => {
      const change = calculateScoreChange(100, 133.33)
      expect(Number.isInteger(change * 100)).toBe(true)
    })

    it('should handle large percentage increases', () => {
      expect(calculateScoreChange(10, 1000)).toBe(9900)
    })

    it('should handle fractional scores', () => {
      expect(calculateScoreChange(45.67, 89.23)).toBeCloseTo(95.38, 2)
    })
  })
})
