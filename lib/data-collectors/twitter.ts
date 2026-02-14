import { DataCollectorResponse } from '../types'

const TWITTER_API_BASE = 'https://api.twitter.com/2'

export interface TwitterUserData {
  username: string
  followers: number
  verified: boolean
}

/**
 * Fetches Twitter follower count for a given username
 */
export async function getTwitterFollowers(username: string): Promise<DataCollectorResponse> {
  try {
    if (!username || username.trim() === '') {
      return {
        success: false,
        error: 'Username is required',
      }
    }

    const bearerToken = process.env.TWITTER_BEARER_TOKEN

    if (!bearerToken) {
      return {
        success: false,
        error: 'Twitter API credentials not configured',
      }
    }

    // Remove @ if present
    const cleanUsername = username.replace('@', '')

    // Get user by username
    const userResponse = await fetch(
      `${TWITTER_API_BASE}/users/by/username/${cleanUsername}?user.fields=public_metrics,verified`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    )

    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        return {
          success: false,
          error: 'User not found',
        }
      }
      return {
        success: false,
        error: `Twitter API error: ${userResponse.status}`,
      }
    }

    const userData = await userResponse.json()

    if (!userData.data) {
      return {
        success: false,
        error: 'Invalid response from Twitter API',
      }
    }

    const data: TwitterUserData = {
      username: userData.data.username,
      followers: userData.data.public_metrics?.followers_count || 0,
      verified: userData.data.verified || false,
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
