import { render, screen } from '@testing-library/react'
import WrestlerCard from '@/components/WrestlerCard'
import { Wrestler } from '@/lib/types'
import { Timestamp } from 'firebase/firestore'

const mockWrestler: Wrestler = {
  id: 'wrestler-1',
  name: 'Test Wrestler',
  bio: 'An amazing independent wrestler known for high-flying moves',
  photoUrl: 'https://example.com/photo.jpg',
  socialMedia: {
    twitter: '@testwrestler',
    instagram: '@testwrestler',
  },
  metrics: {
    twitterFollowers: 15000,
    instagramFollowers: 12000,
    youtubeSubscribers: 5000,
    redditMentions: 45,
    podcastMentions: 12,
    lastUpdated: Timestamp.now(),
  },
  popularityScore: 13525,
  popularityRank: 5,
  historicalData: [],
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
}

describe('WrestlerCard', () => {
  it('should render wrestler name', () => {
    render(<WrestlerCard wrestler={mockWrestler} />)
    expect(screen.getByText('Test Wrestler')).toBeInTheDocument()
  })

  it('should render popularity score', () => {
    render(<WrestlerCard wrestler={mockWrestler} />)
    expect(screen.getByText(/Score: 13525.00/)).toBeInTheDocument()
  })

  it('should render bio', () => {
    render(<WrestlerCard wrestler={mockWrestler} />)
    expect(screen.getByText(/An amazing independent wrestler/)).toBeInTheDocument()
  })

  it('should render ranking badge', () => {
    render(<WrestlerCard wrestler={mockWrestler} />)
    expect(screen.getByText('#5')).toBeInTheDocument()
  })

  it('should render social media metrics', () => {
    render(<WrestlerCard wrestler={mockWrestler} />)

    expect(screen.getByText('15,000')).toBeInTheDocument() // Twitter
    expect(screen.getByText('12,000')).toBeInTheDocument() // Instagram
    expect(screen.getByText('45')).toBeInTheDocument() // Reddit
    expect(screen.getByText('12')).toBeInTheDocument() // Podcasts
  })

  it('should format large numbers with commas', () => {
    const wrestlerWithLargeFollowing = {
      ...mockWrestler,
      metrics: {
        ...mockWrestler.metrics,
        twitterFollowers: 1234567,
      },
    }

    render(<WrestlerCard wrestler={wrestlerWithLargeFollowing} />)
    expect(screen.getByText('1,234,567')).toBeInTheDocument()
  })

  it('should show rank change when previousRank provided', () => {
    render(<WrestlerCard wrestler={mockWrestler} previousRank={8} />)
    // Rank improved from 8 to 5, so change is +3
    expect(screen.getByText('↑3')).toBeInTheDocument()
  })

  it('should calculate negative rank change', () => {
    render(<WrestlerCard wrestler={mockWrestler} previousRank={3} />)
    // Rank worsened from 3 to 5, so change is -2
    expect(screen.getByText('↓2')).toBeInTheDocument()
  })

  it('should not show rank change when previousRank not provided', () => {
    render(<WrestlerCard wrestler={mockWrestler} />)
    expect(screen.queryByText(/↑/)).not.toBeInTheDocument()
    expect(screen.queryByText(/↓/)).not.toBeInTheDocument()
  })

  it('should link to wrestler detail page', () => {
    render(<WrestlerCard wrestler={mockWrestler} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/wrestler/wrestler-1')
  })

  it('should have testid for easy selection', () => {
    render(<WrestlerCard wrestler={mockWrestler} />)
    expect(screen.getByTestId('wrestler-card-wrestler-1')).toBeInTheDocument()
  })

  it('should truncate long bios', () => {
    const wrestlerWithLongBio = {
      ...mockWrestler,
      bio: 'This is a very long bio that should be truncated in the card view to maintain a clean layout. It contains a lot of information about the wrestler.',
    }

    render(<WrestlerCard wrestler={wrestlerWithLongBio} />)
    const card = screen.getByTestId('wrestler-card-wrestler-1')
    const bioElement = card.querySelector('.line-clamp-2')
    expect(bioElement).toBeInTheDocument()
  })
})
