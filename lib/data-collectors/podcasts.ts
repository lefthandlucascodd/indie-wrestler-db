import { DataCollectorResponse } from '../types'

// List of popular wrestling podcast RSS feeds
const WRESTLING_PODCAST_FEEDS = [
  'https://feeds.megaphone.fm/WWO3519750118', // Talk Is Jericho
  'https://feeds.simplecast.com/jSc95OHX', // The Jim Cornette Experience
  'https://feeds.megaphone.fm/83dirtsheet', // 83 Weeks
  // Add more feeds as needed
]

export interface PodcastMentionData {
  mentions: number
  episodes: Array<{
    title: string
    podcastName: string
    publishDate: string
    url: string
  }>
}

/**
 * Parses RSS feed XML to extract episodes
 */
function parseRSSFeed(xml: string): Array<{
  title: string
  pubDate: string
  link: string
  description: string
}> {
  try {
    // Basic XML parsing - in production, consider using a proper XML parser
    const items = xml.match(/<item>([\s\S]*?)<\/item>/gi) || []

    return items.map((item) => {
      const title = item.match(/<title>(.*?)<\/title>/i)?.[1] || ''
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/i)?.[1] || ''
      const link = item.match(/<link>(.*?)<\/link>/i)?.[1] || ''
      const description = item.match(/<description>([\s\S]*?)<\/description>/i)?.[1] || ''

      return {
        title: title.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim(),
        pubDate,
        link: link.trim(),
        description: description.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim(),
      }
    })
  } catch (error) {
    return []
  }
}

/**
 * Searches wrestling podcast RSS feeds for mentions of a wrestler name
 */
export async function getPodcastMentions(
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

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysBack)

    const allMentions: Array<{
      title: string
      podcastName: string
      publishDate: string
      url: string
    }> = []

    // Fetch and parse each RSS feed
    for (const feedUrl of WRESTLING_PODCAST_FEEDS) {
      try {
        const response = await fetch(feedUrl)

        if (!response.ok) continue

        const xml = await response.text()
        const episodes = parseRSSFeed(xml)

        // Get podcast name from the feed
        const podcastName =
          xml.match(/<title>(.*?)<\/title>/i)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() ||
          'Unknown Podcast'

        // Filter episodes that mention the wrestler and are recent
        for (const episode of episodes) {
          const episodeDate = new Date(episode.pubDate)

          if (episodeDate >= cutoffDate) {
            // Check if wrestler name appears in title or description
            const searchText = `${episode.title} ${episode.description}`.toLowerCase()
            if (searchText.includes(wrestlerName.toLowerCase())) {
              allMentions.push({
                title: episode.title,
                podcastName,
                publishDate: episode.pubDate,
                url: episode.link,
              })
            }
          }
        }
      } catch (error) {
        // Skip failed feeds
        continue
      }
    }

    const data: PodcastMentionData = {
      mentions: allMentions.length,
      episodes: allMentions.slice(0, 10), // Return top 10 mentions
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
