import { getTwitterFollowers } from '@/lib/data-collectors/twitter'

// Mock fetch
global.fetch = jest.fn()

describe('Twitter Data Collector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.TWITTER_BEARER_TOKEN = 'test-bearer-token'
  })

  afterEach(() => {
    delete process.env.TWITTER_BEARER_TOKEN
  })

  describe('getTwitterFollowers', () => {
    it('should fetch follower count successfully', async () => {
      const mockResponse = {
        data: {
          username: 'testwrestler',
          public_metrics: {
            followers_count: 15000,
          },
          verified: true,
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await getTwitterFollowers('testwrestler')

      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        username: 'testwrestler',
        followers: 15000,
        verified: true,
      })
    })

    it('should handle username with @ symbol', async () => {
      const mockResponse = {
        data: {
          username: 'testwrestler',
          public_metrics: {
            followers_count: 15000,
          },
          verified: false,
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await getTwitterFollowers('@testwrestler')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/testwrestler?'),
        expect.any(Object)
      )
    })

    it('should return error when username is empty', async () => {
      const result = await getTwitterFollowers('')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Username is required')
    })

    it('should return error when credentials not configured', async () => {
      delete process.env.TWITTER_BEARER_TOKEN

      const result = await getTwitterFollowers('testwrestler')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Twitter API credentials not configured')
    })

    it('should handle 404 user not found', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const result = await getTwitterFollowers('nonexistentuser')

      expect(result.success).toBe(false)
      expect(result.error).toBe('User not found')
    })

    it('should handle API errors', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const result = await getTwitterFollowers('testwrestler')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Twitter API error: 500')
    })

    it('should handle missing data in response', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const result = await getTwitterFollowers('testwrestler')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid response from Twitter API')
    })

    it('should handle missing followers count', async () => {
      const mockResponse = {
        data: {
          username: 'testwrestler',
          verified: false,
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await getTwitterFollowers('testwrestler')

      expect(result.success).toBe(true)
      expect(result.data?.followers).toBe(0)
    })

    it('should handle network errors', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const result = await getTwitterFollowers('testwrestler')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })

    it('should include authorization header', async () => {
      const mockResponse = {
        data: {
          username: 'testwrestler',
          public_metrics: { followers_count: 1000 },
          verified: false,
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await getTwitterFollowers('testwrestler')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer test-bearer-token',
          },
        })
      )
    })
  })
})
