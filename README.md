# Indie Wrestler Database

[![Test Suite](https://github.com/lefthandlucascodd/indie-wrestler-db/actions/workflows/test.yml/badge.svg)](https://github.com/lefthandlucascodd/indie-wrestler-db/actions/workflows/test.yml)
[![Code Quality](https://github.com/lefthandlucascodd/indie-wrestler-db/actions/workflows/lint.yml/badge.svg)](https://github.com/lefthandlucascodd/indie-wrestler-db/actions/workflows/lint.yml)
[![Tests](https://img.shields.io/badge/tests-89%20passing-brightgreen)](https://github.com/lefthandlucascodd/indie-wrestler-db)
[![Coverage](https://img.shields.io/badge/coverage-90%25+-brightgreen)](https://github.com/lefthandlucascodd/indie-wrestler-db)

A Next.js application that catalogs independent professional wrestlers (not signed to AEW/WWE) and ranks them by popularity based on automated data collection from social media, Reddit, and podcast mentions.

## Features

- **Automated Rankings**: Wrestlers ranked by popularity score based on multiple data sources
- **Daily Updates**: Metrics automatically updated via scheduled cron jobs
- **Real-time Search**: Search and filter wrestlers instantly
- **Comprehensive Testing**: 89 tests across unit, component, and integration levels
- **Responsive Design**: Mobile-first UI built with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Firebase (Firestore)
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **TypeScript**: Full type safety

## Data Sources

The popularity algorithm considers:
- Twitter followers (25%)
- Instagram followers (25%)
- Reddit mentions in r/SquaredCircle (20%)
- Podcast mentions (20%)
- YouTube subscribers (10%)

## Project Structure

```
indie-wrestler-db/
├── app/
│   ├── api/
│   │   ├── wrestlers/           # CRUD operations
│   │   ├── update-metrics/      # Scheduled metric updates
│   │   └── wrestler/[id]/       # Individual wrestler routes
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── WrestlerCard.tsx         # Card component for list view
│   ├── SearchBar.tsx            # Search interface
│   └── RankingBadge.tsx         # Popularity rank display
├── lib/
│   ├── data-collectors/
│   │   ├── twitter.ts           # Twitter API integration
│   │   ├── instagram.ts         # Instagram API integration
│   │   ├── reddit.ts            # Reddit API integration
│   │   └── podcasts.ts          # RSS feed parser
│   ├── popularity.ts            # Popularity score algorithm
│   ├── firebase.ts              # Firebase configuration
│   └── types.ts                 # TypeScript interfaces
└── __tests__/
    ├── unit/
    │   ├── popularity.test.ts
    │   └── data-collectors/
    └── components/
```

## Testing Strategy

### Test Coverage
- **89 total tests** across 7 test suites
- **Unit tests**: Popularity algorithm, data collectors, utility functions
- **Component tests**: All React components with user interaction testing
- **Integration tests**: API routes (ready for implementation)

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- popularity.test.ts

# Run specific test suite
npm test -- components
npm test -- data-collectors
```

### Test Structure

1. **Unit Tests** (`__tests__/unit/`)
   - Popularity algorithm (26 tests)
   - Twitter data collector (11 tests)
   - Reddit data collector (7 tests)
   - Podcast data collector (11 tests)
   - **Coverage**: 100% for critical algorithms

2. **Component Tests** (`__tests__/components/`)
   - RankingBadge (10 tests)
   - WrestlerCard (13 tests)
   - SearchBar (11 tests)
   - **Coverage**: User interactions, accessibility, edge cases

3. **Integration Tests** (`__tests__/integration/`)
   - API routes (ready for implementation with Firebase emulator)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your API keys:

```bash
cp .env.local.example .env.local
```

Required API keys:
- Firebase configuration
- Twitter API (Bearer Token)
- Instagram Graph API
- Reddit API (Client ID & Secret)

### 3. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Copy your Firebase config to `.env.local`
4. Create Firestore indexes:
   - `wrestlers` collection: index on `popularityRank` (ascending)
   - `wrestlers` collection: index on `name` (ascending)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## API Endpoints

### GET /api/wrestlers
Fetch all wrestlers with optional filtering and sorting.

**Query Parameters:**
- `sortBy`: `popularityRank` | `name` | `popularityScore`
- `limit`: Number of results to return
- `q`: Search query

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "wrestler-1",
      "name": "Wrestler Name",
      "popularityScore": 13525,
      "popularityRank": 1,
      ...
    }
  ]
}
```

### POST /api/wrestlers
Create a new wrestler.

**Body:**
```json
{
  "name": "Wrestler Name",
  "bio": "Biography",
  "socialMedia": {
    "twitter": "@handle",
    "instagram": "@handle"
  }
}
```

### GET /api/wrestlers/[id]
Fetch a single wrestler by ID.

### PUT /api/wrestlers/[id]
Update a wrestler.

### DELETE /api/wrestlers/[id]
Delete a wrestler.

### POST /api/update-metrics
Update metrics for all wrestlers (should be called by cron job).

**Headers:**
- `Authorization: Bearer <CRON_SECRET>`

## Scheduled Updates

Set up a daily cron job to update wrestler metrics:

### Option 1: Vercel Cron Jobs
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/update-metrics",
    "schedule": "0 2 * * *"
  }]
}
```

### Option 2: External Cron Service
Use services like EasyCron or cron-job.org to hit the endpoint daily:
```bash
curl -X POST https://your-domain.com/api/update-metrics \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Code Quality

### Type Safety
- Full TypeScript coverage
- Strict mode enabled
- Comprehensive type definitions

### Testing Standards
- 80%+ code coverage target
- All critical paths tested
- Mocked external API calls
- Accessibility testing

### Best Practices
- Component composition
- Server components where possible
- Error handling at all levels
- Loading states and fallbacks

## Development Workflow

1. **Write tests first** for new features
2. **Implement the feature** with tests passing
3. **Run full test suite** before committing
4. **Check test coverage** for new code

## Performance Considerations

- Server-side rendering for initial page load
- Optimized images with Next.js Image component
- Firestore queries with proper indexing
- Client-side caching for wrestler data
- Rate limiting for API endpoints

## Future Enhancements

- Admin dashboard for managing wrestlers
- User authentication and favorites
- Historical trend charts
- Event calendar integration
- Match video highlights
- Community voting/ratings
- Email notifications for rank changes
- Public API for external developers

## Contributing

When adding new features:
1. Write tests first (TDD)
2. Ensure all tests pass
3. Maintain 80%+ coverage
4. Update documentation
5. Follow existing code patterns

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
