import { NextResponse } from 'next/server'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Wrestler } from '@/lib/types'

const WRESTLERS_COLLECTION = 'wrestlers'

/**
 * GET /api/wrestlers
 * Fetches all wrestlers, optionally filtered and sorted
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sortBy') || 'popularityRank'
    const limitParam = searchParams.get('limit')
    const searchQuery = searchParams.get('q')

    let q = query(collection(db, WRESTLERS_COLLECTION))

    // Add search filter
    if (searchQuery) {
      q = query(
        collection(db, WRESTLERS_COLLECTION),
        where('name', '>=', searchQuery),
        where('name', '<=', searchQuery + '\uf8ff')
      )
    }

    // Add sorting
    if (sortBy === 'popularityRank') {
      q = query(q, orderBy('popularityRank', 'asc'))
    } else if (sortBy === 'name') {
      q = query(q, orderBy('name', 'asc'))
    } else if (sortBy === 'popularityScore') {
      q = query(q, orderBy('popularityScore', 'desc'))
    }

    // Add limit
    if (limitParam) {
      q = query(q, limit(parseInt(limitParam)))
    }

    const querySnapshot = await getDocs(q)
    const wrestlers: Wrestler[] = []

    querySnapshot.forEach((doc) => {
      wrestlers.push({ id: doc.id, ...doc.data() } as Wrestler)
    })

    return NextResponse.json({ success: true, data: wrestlers })
  } catch (error) {
    console.error('Error fetching wrestlers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wrestlers' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/wrestlers
 * Creates a new wrestler
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.bio) {
      return NextResponse.json(
        { success: false, error: 'Name and bio are required' },
        { status: 400 }
      )
    }

    // Create new wrestler document
    const newWrestler = {
      name: body.name,
      bio: body.bio,
      photoUrl: body.photoUrl || '',
      socialMedia: body.socialMedia || {},
      metrics: body.metrics || {
        twitterFollowers: 0,
        instagramFollowers: 0,
        youtubeSubscribers: 0,
        redditMentions: 0,
        podcastMentions: 0,
        lastUpdated: Timestamp.now(),
      },
      popularityScore: body.popularityScore || 0,
      popularityRank: body.popularityRank || 0,
      historicalData: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await addDoc(collection(db, WRESTLERS_COLLECTION), newWrestler)

    return NextResponse.json(
      { success: true, data: { id: docRef.id, ...newWrestler } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating wrestler:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create wrestler' },
      { status: 500 }
    )
  }
}
