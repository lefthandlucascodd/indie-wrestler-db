import { render, screen } from '@testing-library/react'
import RankingBadge from '@/components/RankingBadge'

describe('RankingBadge', () => {
  it('should render rank number', () => {
    render(<RankingBadge rank={5} />)
    expect(screen.getByText('#5')).toBeInTheDocument()
    expect(screen.getByLabelText('Rank 5')).toBeInTheDocument()
  })

  it('should apply gold color for rank 1', () => {
    render(<RankingBadge rank={1} />)
    const badge = screen.getByLabelText('Rank 1')
    expect(badge.className).toContain('from-yellow')
    expect(screen.getByText('👑')).toBeInTheDocument()
  })

  it('should apply silver color for rank 2', () => {
    render(<RankingBadge rank={2} />)
    const badge = screen.getByLabelText('Rank 2')
    expect(badge.className).toContain('from-gray')
    expect(screen.getByText('🥈')).toBeInTheDocument()
  })

  it('should apply bronze color for rank 3', () => {
    render(<RankingBadge rank={3} />)
    const badge = screen.getByLabelText('Rank 3')
    expect(badge.className).toContain('from-orange')
    expect(screen.getByText('🥉')).toBeInTheDocument()
  })

  it('should apply blue color for ranks 4-10', () => {
    render(<RankingBadge rank={7} />)
    const badge = screen.getByLabelText('Rank 7')
    expect(badge.className).toContain('from-blue')
  })

  it('should apply gray color for ranks > 10', () => {
    render(<RankingBadge rank={15} />)
    const badge = screen.getByLabelText('Rank 15')
    expect(badge.className).toContain('from-gray')
  })

  it('should show positive change indicator', () => {
    render(<RankingBadge rank={5} change={3} />)
    const indicator = screen.getByLabelText('Rank increased')
    expect(indicator).toBeInTheDocument()
    expect(indicator).toHaveTextContent('↑')
    expect(indicator).toHaveTextContent('3')
  })

  it('should show negative change indicator', () => {
    render(<RankingBadge rank={10} change={-2} />)
    const indicator = screen.getByLabelText('Rank decreased')
    expect(indicator).toBeInTheDocument()
    expect(indicator).toHaveTextContent('↓')
    expect(indicator).toHaveTextContent('2')
  })

  it('should not show change indicator when change is 0', () => {
    render(<RankingBadge rank={5} change={0} />)
    expect(screen.queryByText(/↑/)).not.toBeInTheDocument()
    expect(screen.queryByText(/↓/)).not.toBeInTheDocument()
  })

  it('should not show change indicator when change is undefined', () => {
    render(<RankingBadge rank={5} />)
    expect(screen.queryByText(/↑/)).not.toBeInTheDocument()
    expect(screen.queryByText(/↓/)).not.toBeInTheDocument()
  })

  it('should show absolute value for negative change', () => {
    render(<RankingBadge rank={8} change={-5} />)
    const indicator = screen.getByLabelText('Rank decreased')
    expect(indicator).toHaveTextContent('↓')
    expect(indicator).toHaveTextContent('5')
  })
})
