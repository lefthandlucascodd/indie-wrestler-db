import { getPodcastMentions } from '@/lib/data-collectors/podcasts'

// Mock fetch
global.fetch = jest.fn()

describe('Podcast Data Collector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockRSSFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title><![CDATA[Wrestling Talk Podcast]]></title>
    <item>
      <title><![CDATA[Episode 1: Test Wrestler's Amazing Career]]></title>
      <pubDate>Mon, 10 Feb 2026 12:00:00 GMT</pubDate>
      <link>https://podcast.example.com/episode1</link>
      <description><![CDATA[We discuss Test Wrestler and their recent matches]]></description>
    </item>
    <item>
      <title><![CDATA[Episode 2: Championship Recap]]></title>
      <pubDate>Mon, 03 Feb 2026 12:00:00 GMT</pubDate>
      <link>https://podcast.example.com/episode2</link>
      <description><![CDATA[A recap of the championship matches]]></description>
    </item>
    <item>
      <title><![CDATA[Episode 3: Old Episode with Test Wrestler]]></title>
      <pubDate>Mon, 01 Jan 2020 12:00:00 GMT</pubDate>
      <link>https://podcast.example.com/episode3</link>
      <description><![CDATA[An old episode about Test Wrestler]]></description>
    </item>
  </channel>
</rss>`

  describe('getPodcastMentions', () => {
    it('should find mentions in recent podcast episodes', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: async () => mockRSSFeed,
      })

      const result = await getPodcastMentions('Test Wrestler', 30)

      expect(result.success).toBe(true)
      expect(result.data?.mentions).toBeGreaterThan(0)
      expect(result.data?.episodes[0].title).toContain('Test Wrestler')
    })

    it('should return error when wrestler name is empty', async () => {
      const result = await getPodcastMentions('')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Wrestler name is required')
    })

    it('should filter out episodes older than daysBack', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: async () => mockRSSFeed,
      })

      // Only looking for mentions in past 30 days
      const result = await getPodcastMentions('Test Wrestler', 30)

      expect(result.success).toBe(true)
      // Should find recent mentions but not the one from 2020
      if (result.data?.episodes) {
        const oldEpisode = result.data.episodes.find((ep) =>
          ep.publishDate.includes('2020')
        )
        expect(oldEpisode).toBeUndefined()
      }
    })

    it('should be case insensitive when searching', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: async () => mockRSSFeed,
      })

      const result = await getPodcastMentions('test wrestler', 30)

      expect(result.success).toBe(true)
      expect(result.data?.mentions).toBeGreaterThan(0)
    })

    it('should handle failed feed requests gracefully', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
      })

      const result = await getPodcastMentions('Test Wrestler', 30)

      expect(result.success).toBe(true)
      expect(result.data?.mentions).toBe(0)
    })

    it('should search both title and description', async () => {
      const feedWithDescriptionMatch = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Wrestling Podcast</title>
    <item>
      <title>General Wrestling News</title>
      <pubDate>Mon, 10 Feb 2026 12:00:00 GMT</pubDate>
      <link>https://podcast.example.com/episode1</link>
      <description>Special guest Test Wrestler joins us today</description>
    </item>
  </channel>
</rss>`

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: async () => feedWithDescriptionMatch,
      })

      const result = await getPodcastMentions('Test Wrestler', 30)

      expect(result.success).toBe(true)
      expect(result.data?.mentions).toBeGreaterThan(0)
    })

    it('should limit results to 10 episodes', async () => {
      const items = Array.from(
        { length: 20 },
        (_, i) => `
      <item>
        <title>Episode ${i}: Test Wrestler Special</title>
        <pubDate>Mon, 10 Feb 2026 12:00:00 GMT</pubDate>
        <link>https://podcast.example.com/episode${i}</link>
        <description>Episode about Test Wrestler</description>
      </item>
    `
      ).join('')

      const largeFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Wrestling Podcast</title>
    ${items}
  </channel>
</rss>`

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: async () => largeFeed,
      })

      const result = await getPodcastMentions('Test Wrestler', 30)

      expect(result.success).toBe(true)
      // With 3 podcast feeds, each with 20 episodes = 60 total mentions
      expect(result.data?.mentions).toBe(60)
      expect(result.data?.episodes.length).toBeLessThanOrEqual(10)
    })

    it('should handle malformed RSS feeds', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: async () => 'Not valid XML',
      })

      const result = await getPodcastMentions('Test Wrestler', 30)

      expect(result.success).toBe(true)
      expect(result.data?.mentions).toBe(0)
    })

    it('should extract podcast name from feed', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: async () => mockRSSFeed,
      })

      const result = await getPodcastMentions('Test Wrestler', 30)

      expect(result.success).toBe(true)
      if (result.data?.episodes && result.data.episodes.length > 0) {
        expect(result.data.episodes[0].podcastName).toBe('Wrestling Talk Podcast')
      }
    })

    it('should handle network errors gracefully', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      // Podcast collector is designed to be resilient - it continues if individual feeds fail
      const result = await getPodcastMentions('Test Wrestler', 30)

      expect(result.success).toBe(true)
      expect(result.data?.mentions).toBe(0)
    })
  })
})
