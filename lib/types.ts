import { Timestamp } from 'firebase/firestore'

export interface SocialMedia {
  twitter?: string
  instagram?: string
  youtube?: string
}

export interface Metrics {
  twitterFollowers: number
  instagramFollowers: number
  youtubeSubscribers: number
  redditMentions: number
  podcastMentions: number
  lastUpdated: Timestamp | Date
}

export interface HistoricalDataPoint {
  date: Timestamp | Date
  score: number
}

export interface Wrestler {
  id: string
  name: string
  bio: string
  photoUrl: string
  socialMedia: SocialMedia
  metrics: Metrics
  popularityScore: number
  popularityRank: number
  historicalData: HistoricalDataPoint[]
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}

export interface PopularityWeights {
  twitter: number
  instagram: number
  reddit: number
  podcasts: number
  youtube: number
}

export interface DataCollectorResponse {
  success: boolean
  data?: any
  error?: string
}
