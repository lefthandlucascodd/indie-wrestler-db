# Testing Guide

This document provides detailed information about the testing strategy and practices for the Indie Wrestler Database project.

## Test Statistics

- **Total Tests**: 89
- **Test Suites**: 7
- **Coverage Target**: 80%+
- **Test Types**: Unit, Component, Integration

## Testing Philosophy

We follow **Test-Driven Development (TDD)** principles:
1. Write tests before implementation
2. Write minimal code to make tests pass
3. Refactor with confidence
4. Maintain high test coverage

## Test Categories

### 1. Unit Tests (53 tests)

#### Popularity Algorithm Tests (26 tests)
Location: `__tests__/unit/popularity.test.ts`

Tests the core ranking algorithm that powers the entire application.

**Coverage:**
- `normalizeMetric()` - Value normalization (7 tests)
- `calculatePopularityScore()` - Score calculation (6 tests)
- `calculateRanks()` - Rank assignment (5 tests)
- `calculateScoreChange()` - Change tracking (8 tests)

**Critical Test Cases:**
- Edge cases (zero values, equal scores, large numbers)
- Weight validation
- Normalization boundaries
- Rounding precision

#### Data Collector Tests (27 tests)

**Twitter Collector** (11 tests)
- Location: `__tests__/unit/data-collectors/twitter.test.ts`
- Mock fetch API calls
- Test error handling, 404s, invalid responses
- Verify authorization headers

**Reddit Collector** (7 tests)
- Location: `__tests__/unit/data-collectors/reddit.test.ts`
- OAuth token caching
- Date filtering
- Result limiting

**Podcast Collector** (11 tests)
- Location: `__tests__/unit/data-collectors/podcasts.test.ts`
- RSS feed parsing
- Case-insensitive search
- Date range filtering
- Resilience to feed failures

### 2. Component Tests (36 tests)

#### RankingBadge Tests (10 tests)
Location: `__tests__/components/RankingBadge.test.tsx`

**Coverage:**
- Color coding for different ranks
- Change indicators (up/down arrows)
- Accessibility attributes
- Edge cases (0, negative changes)

#### WrestlerCard Tests (13 tests)
Location: `__tests__/components/WrestlerCard.test.tsx`

**Coverage:**
- Data rendering
- Number formatting
- Rank change calculation
- Link generation
- Bio truncation
- Accessibility

#### SearchBar Tests (11 tests)
Location: `__tests__/components/SearchBar.test.tsx`

**Coverage:**
- Real-time search
- Form submission
- Clear button
- Input validation
- Accessibility
- User interactions

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Watch mode (reruns on file changes)
npm run test:watch

# Coverage report
npm run test:coverage

# Run specific file
npm test -- popularity.test.ts

# Run by pattern
npm test -- components
npm test -- data-collectors

# Verbose output
npm test -- --verbose
```

### Coverage Reports

After running `npm run test:coverage`, view the report:

```bash
# Open HTML coverage report
open coverage/lcov-report/index.html
```

Coverage is collected for:
- `lib/**/*.{js,jsx,ts,tsx}`
- `components/**/*.{js,jsx,ts,tsx}`
- `app/**/*.{js,jsx,ts,tsx}`

## Writing New Tests

### Unit Test Template

```typescript
import { functionToTest } from '@/lib/module'

describe('ModuleName', () => {
  describe('functionToTest', () => {
    it('should handle normal case', () => {
      const result = functionToTest('input')
      expect(result).toBe('expected')
    })

    it('should handle edge case', () => {
      const result = functionToTest('')
      expect(result).toBe('')
    })

    it('should throw error for invalid input', () => {
      expect(() => functionToTest(null)).toThrow()
    })
  })
})
```

### Component Test Template

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Component from '@/components/Component'

describe('Component', () => {
  it('should render with props', () => {
    render(<Component prop="value" />)
    expect(screen.getByText('value')).toBeInTheDocument()
  })

  it('should handle user interaction', async () => {
    const user = userEvent.setup()
    const mockHandler = jest.fn()

    render(<Component onClick={mockHandler} />)

    await user.click(screen.getByRole('button'))

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  it('should have proper accessibility', () => {
    render(<Component />)
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
  })
})
```

### API Route Test Template

```typescript
import { POST } from '@/app/api/route/route'

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  db: {},
}))

describe('API Route', () => {
  it('should return success response', async () => {
    const request = new Request('http://localhost/api/route', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('should validate input', async () => {
    const request = new Request('http://localhost/api/route', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
  })
})
```

## Mocking Strategies

### Mock fetch API

```typescript
global.fetch = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})

it('should make API call', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: 'test' }),
  })

  const result = await fetchData()

  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining('api.example.com'),
    expect.any(Object)
  )
})
```

### Mock Firebase

```typescript
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ toMillis: () => Date.now() })),
  },
}))
```

### Mock Next.js Router

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))
```

## Test Best Practices

### DO ✅

- Test behavior, not implementation
- Use descriptive test names
- Test edge cases and error states
- Mock external dependencies
- Use `userEvent` for user interactions
- Check accessibility attributes
- Test loading and error states
- Clean up after tests (mocks, timers)

### DON'T ❌

- Test internal implementation details
- Write brittle tests that break with refactoring
- Ignore accessibility
- Skip edge cases
- Leave console errors/warnings
- Mock everything (integration tests need real code)
- Test framework code (like Next.js routing)

## Debugging Tests

### See what's rendered

```typescript
import { render, screen } from '@testing-library/react'
import { debug } from '@testing-library/react'

it('test', () => {
  render(<Component />)

  // Print DOM
  screen.debug()

  // Or specific element
  debug(screen.getByRole('button'))
})
```

### Find elements

```typescript
// By role (preferred)
screen.getByRole('button', { name: /submit/i })

// By label
screen.getByLabelText('Username')

// By text
screen.getByText(/hello world/i)

// By test ID (last resort)
screen.getByTestId('custom-element')
```

### Async testing

```typescript
// Wait for element to appear
await screen.findByText('Loaded')

// Wait for element to disappear
await waitFor(() => {
  expect(screen.queryByText('Loading')).not.toBeInTheDocument()
})
```

## Continuous Integration

Tests run automatically on:
- Every commit (pre-commit hook)
- Pull requests
- Main branch merges
- Deployment

CI fails if:
- Any test fails
- Coverage drops below 80%
- Linting errors exist

## Performance Testing

Monitor test execution time:

```bash
npm test -- --verbose

# Example output:
# PASS __tests__/unit/popularity.test.ts (0.748s)
```

If tests become slow:
- Check for unnecessary async/await
- Mock heavy operations
- Use `jest.setTimeout()` sparingly
- Consider test parallelization

## Common Issues

### Tests timing out
- Increase timeout: `jest.setTimeout(10000)`
- Check for unresolved promises
- Mock async operations

### Tests pass locally but fail in CI
- Check environment variables
- Verify Node.js version
- Look for time-zone dependencies
- Check for file path issues

### Flaky tests
- Avoid testing implementation details
- Use `waitFor` for async operations
- Don't rely on timeouts
- Mock date/time functions

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Playground](https://testing-playground.com/)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
