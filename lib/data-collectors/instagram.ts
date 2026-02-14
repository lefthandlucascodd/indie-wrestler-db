import { DataCollectorResponse } from '../types'

const INSTAGRAM_API_BASE = 'https://graph.instagram.com'

export interface InstagramUserData {
  username: string
  followers: number
}

/**
 * Fetches Instagram follower count for a given username
 * Note: Requires Instagram Business/Creator account linked to Facebook
 */
export async function getInstagramFollowers(username: string): Promise<DataCollectorResponse> {
  try {
    if (!username || username.trim() === '') {
      return {
        success: false,
        error: 'Username is required',
      }
    }

    const accessToken = process.env.INSTAGRAM_API_KEY

    if (!accessToken) {
      return {
        success: false,
        error: 'Instagram API credentials not configured',
      }
    }

    // Remove @ if present
    const cleanUsername = username.replace('@', '')

    // Get user info
    const response = await fetch(
      `${INSTAGRAM_API_BASE}/me?fields=username,followers_count&access_token=${accessToken}`,
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'User not found',
        }
      }
      return {
        success: false,
        error: `Instagram API error: ${response.status}`,
      }
    }

    const userData = await response.json()

    if (!userData.username) {
      return {
        success: false,
        error: 'Invalid response from Instagram API',
      }
    }

    const data: InstagramUserData = {
      username: userData.username,
      followers: userData.followers_count || 0,
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
