import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '@/components/SearchBar'

describe('SearchBar', () => {
  const mockOnSearch = jest.fn()

  beforeEach(() => {
    mockOnSearch.mockClear()
  })

  it('should render search input', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    expect(screen.getByLabelText('Search wrestlers')).toBeInTheDocument()
  })

  it('should render with custom placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} placeholder="Find a wrestler..." />)
    expect(screen.getByPlaceholderText('Find a wrestler...')).toBeInTheDocument()
  })

  it('should render with initial value', () => {
    render(<SearchBar onSearch={mockOnSearch} initialValue="John Doe" />)
    const input = screen.getByLabelText('Search wrestlers') as HTMLInputElement
    expect(input.value).toBe('John Doe')
  })

  it('should call onSearch when typing (real-time search)', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Search wrestlers')
    await user.type(input, 'Test')

    // Should be called for "Te", "Tes", "Test"
    expect(mockOnSearch).toHaveBeenCalledWith('Te')
    expect(mockOnSearch).toHaveBeenCalledWith('Tes')
    expect(mockOnSearch).toHaveBeenCalledWith('Test')
  })

  it('should not trigger search for single character', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Search wrestlers')
    await user.type(input, 'T')

    // Should not be called for single character
    expect(mockOnSearch).not.toHaveBeenCalledWith('T')
  })

  it('should call onSearch on form submit', () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Search wrestlers')
    fireEvent.change(input, { target: { value: 'Test Wrestler' } })
    fireEvent.submit(input)

    expect(mockOnSearch).toHaveBeenCalledWith('Test Wrestler')
  })

  it('should trim whitespace from search query', () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Search wrestlers')
    fireEvent.change(input, { target: { value: '  Test Wrestler  ' } })
    fireEvent.submit(input)

    expect(mockOnSearch).toHaveBeenCalledWith('Test Wrestler')
  })

  it('should show clear button when input has value', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Search wrestlers')
    await user.type(input, 'Test')

    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('should not show clear button when input is empty', () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
  })

  it('should clear input and call onSearch with empty string when clear button clicked', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Search wrestlers') as HTMLInputElement
    await user.type(input, 'Test')

    const clearButton = screen.getByLabelText('Clear search')
    await user.click(clearButton)

    expect(input.value).toBe('')
    expect(mockOnSearch).toHaveBeenCalledWith('')
  })

  it('should call onSearch with empty string when input cleared', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} initialValue="Test" />)

    const input = screen.getByLabelText('Search wrestlers')
    await user.clear(input)

    expect(mockOnSearch).toHaveBeenCalledWith('')
  })

  it('should update input value as user types', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Search wrestlers') as HTMLInputElement
    await user.type(input, 'Wrestler Name')

    expect(input.value).toBe('Wrestler Name')
  })

  it('should have proper accessibility attributes', () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Search wrestlers')
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveAttribute('aria-label', 'Search wrestlers')
  })
})
