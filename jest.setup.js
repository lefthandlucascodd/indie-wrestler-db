// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key'
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com'
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project'
process.env.TWITTER_API_KEY = 'test-twitter-key'
process.env.INSTAGRAM_API_KEY = 'test-instagram-key'
process.env.REDDIT_CLIENT_ID = 'test-reddit-id'
process.env.REDDIT_CLIENT_SECRET = 'test-reddit-secret'
