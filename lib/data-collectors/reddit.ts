import { DataCollectorResponse } from '../types'

const REDDIT_API_BASE = 'https://oauth.reddit.com'
const REDDIT_AUTH_URL = 'https://www.reddit.com/api/v1/access_token'

let cachedToken: { token: string; expires: number } | null = null

/**
 * Gets Reddit OAuth token
 */
async function getRedditToken(): Promise<string | null> {
  try {
    // Check cached token
    if (cachedToken && cachedToken.expires > Date.now()) {
      return cachedToken.token
    }

    const clientId = process.env.REDDIT_CLIENT_ID
    const clientSecret = process.env.REDDIT_CLIENT_SECRET
    const userAgent = process.env.REDDIT_USER_AGENT || 'IndieWrestlerDB/1.0'

    if (!clientId || !clientSecret) {
      return null
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const response = await fetch(REDDIT_AUTH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': userAgent,
      },
      body: 'grant_type=client_credentials',
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    // Cache token (expires in 1 hour, cache for 50 minutes to be safe)
    cachedToken = {
      token: data.access_token,
      expires: Date.now() + 50 * 60 * 1000,
    }

    return data.access_token
  } catch (error) {
    return null
  }
}

export interface RedditMentionData {
  mentions: number
  posts: Array<{
    title: string
    score: number
    url: string
    created: number
  }>
}

/**
 * Searches r/SquaredCircle for mentions of a wrestler name in the past 30 days
 */
export async function getRedditMentions(
  wrestlerName: string,
  daysBack: number = 30
): Promise<DataCollectorResponse> {
  try {
    if (!wrestlerName || wrestlerName.trim() === '') {
      return {
        success: false,
        error: 'Wrestler name is required',
      }
    }

    const token = await getRedditToken()

    if (!token) {
      return {
        success: false,
        error: 'Reddit API credentials not configured',
      }
    }

    const userAgent = process.env.REDDIT_USER_AGENT || 'IndieWrestlerDB/1.0'

    // Search in r/SquaredCircle
    const response = await fetch(
      `${REDDIT_API_BASE}/r/SquaredCircle/search?q=${encodeURIComponent(
        wrestlerName
      )}&restrict_sr=1&sort=new&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': userAgent,
        },
      }
    )

    if (!response.ok) {
      return {
        success: false,
        error: `Reddit API error: ${response.status}`,
      }
    }

    const searchData = await response.json()

    if (!searchData.data || !searchData.data.children) {
      return {
        success: false,
        error: 'Invalid response from Reddit API',
      }
    }

    // Filter posts from the past N days
    const cutoffTime = Date.now() / 1000 - daysBack * 24 * 60 * 60

    const recentPosts = searchData.data.children
      .map((child: any) => child.data)
      .filter((post: any) => post.created_utc >= cutoffTime)

    const data: RedditMentionData = {
      mentions: recentPosts.length,
      posts: recentPosts.slice(0, 10).map((post: any) => ({
        title: post.title,
        score: post.score,
        url: `https://reddit.com${post.permalink}`,
        created: post.created_utc,
      })),
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
