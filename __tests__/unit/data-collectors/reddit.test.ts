import { getRedditMentions } from '@/lib/data-collectors/reddit'

// Mock fetch
global.fetch = jest.fn()

// Need to clear the module cache between tests to reset token cache
let getRedditMentions: any

describe('Reddit Data Collector', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    jest.resetModules()

    // Re-import to get fresh module with cleared cache
    const module = await import('@/lib/data-collectors/reddit')
    getRedditMentions = module.getRedditMentions

    process.env.REDDIT_CLIENT_ID = 'test-client-id'
    process.env.REDDIT_CLIENT_SECRET = 'test-client-secret'
    process.env.REDDIT_USER_AGENT = 'IndieWrestlerDB/1.0'
  })

  afterEach(() => {
    delete process.env.REDDIT_CLIENT_ID
    delete process.env.REDDIT_CLIENT_SECRET
    delete process.env.REDDIT_USER_AGENT
  })

  describe('getRedditMentions', () => {
    it('should fetch mentions successfully', async () => {
      // Mock OAuth token request
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'test-access-token',
          expires_in: 3600,
        }),
      })

      // Mock search request
      const mockSearchData = {
        data: {
          children: [
            {
              data: {
                title: 'Amazing match by Test Wrestler',
                score: 150,
                permalink: '/r/SquaredCircle/comments/abc123/',
                created_utc: Date.now() / 1000 - 86400, // 1 day ago
              },
            },
            {
              data: {
                title: 'Test Wrestler wins championship',
                score: 200,
                permalink: '/r/SquaredCircle/comments/def456/',
                created_utc: Date.now() / 1000 - 172800, // 2 days ago
              },
            },
          ],
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchData,
      })

      const result = await getRedditMentions('Test Wrestler', 30)

      expect(result.success).toBe(true)
      expect(result.data?.mentions).toBe(2)
      expect(result.data?.posts).toHaveLength(2)
      expect(result.data?.posts[0].title).toBe('Amazing match by Test Wrestler')
    })

    it('should return error when wrestler name is empty', async () => {
      const result = await getRedditMentions('')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Wrestler name is required')
    })

    it('should return error when credentials not configured', async () => {
      delete process.env.REDDIT_CLIENT_ID
      delete process.env.REDDIT_CLIENT_SECRET

      const result = await getRedditMentions('Test Wrestler')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Reddit API credentials not configured')

      // Should not have made any API calls
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should filter out old posts', async () => {
      const nowSeconds = Date.now() / 1000
      const mockSearchData = {
        data: {
          children: [
            {
              data: {
                title: 'Recent post',
                score: 100,
                permalink: '/r/SquaredCircle/comments/recent/',
                created_utc: nowSeconds - 86400, // 1 day ago
              },
            },
            {
              data: {
                title: 'Old post',
                score: 50,
                permalink: '/r/SquaredCircle/comments/old/',
                created_utc: nowSeconds - 40 * 24 * 60 * 60, // 40 days ago
              },
            },
          ],
        },
      }

      // Set up two consecutive mocks: first for OAuth, second for search
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            access_token: 'test-token',
            expires_in: 3600,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSearchData,
        })

      const result = await getRedditMentions('Test Wrestler', 30)

      expect(result.success).toBe(true)
      expect(result.data?.mentions).toBe(1)
      expect(result.data?.posts[0].title).toBe('Recent post')
    })

    it('should handle API errors', async () => {
      // Set up two consecutive mocks: first for OAuth, second for search
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            access_token: 'test-token',
          }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
        })

      const result = await getRedditMentions('Test Wrestler')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Reddit API error: 500')
    })

    it('should handle invalid response format', async () => {
      // Mock OAuth token
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'test-token',
        }),
      })

      // Mock invalid search response
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const result = await getRedditMentions('Test Wrestler')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid response from Reddit API')
    })

    it('should limit posts to 10', async () => {
      const nowSeconds = Date.now() / 1000
      const children = Array.from({ length: 20 }, (_, i) => ({
        data: {
          title: `Post ${i}`,
          score: 100,
          permalink: `/r/SquaredCircle/comments/post${i}/`,
          created_utc: nowSeconds - 86400,
        },
      }))

      // Set up two consecutive mocks: first for OAuth, second for search
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            access_token: 'test-token',
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: { children },
          }),
        })

      const result = await getRedditMentions('Test Wrestler')

      expect(result.success).toBe(true)
      expect(result.data?.mentions).toBe(20)
      expect(result.data?.posts).toHaveLength(10)
    })
  })
})
