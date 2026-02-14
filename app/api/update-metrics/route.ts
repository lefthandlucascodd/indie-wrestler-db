import { NextResponse } from 'next/server'
import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Wrestler } from '@/lib/types'
import { getTwitterFollowers } from '@/lib/data-collectors/twitter'
import { getInstagramFollowers } from '@/lib/data-collectors/instagram'
import { getRedditMentions } from '@/lib/data-collectors/reddit'
import { getPodcastMentions } from '@/lib/data-collectors/podcasts'
import { calculatePopularityScore, calculateRanks } from '@/lib/popularity'

const WRESTLERS_COLLECTION = 'wrestlers'

/**
 * POST /api/update-metrics
 * Updates metrics for all wrestlers and recalculates rankings
 * This endpoint should be called by a cron job daily
 */
export async function POST(request: Request) {
  try {
    // Optional: Add authentication/authorization here
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all wrestlers
    const querySnapshot = await getDocs(collection(db, WRESTLERS_COLLECTION))
    const wrestlers: Array<Wrestler & { docId: string }> = []

    querySnapshot.forEach((doc) => {
      wrestlers.push({ docId: doc.id, id: doc.id, ...doc.data() } as Wrestler & {
        docId: string
      })
    })

    if (wrestlers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No wrestlers to update',
        updated: 0,
      })
    }

    const updateResults = {
      updated: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Update metrics for each wrestler
    for (const wrestler of wrestlers) {
      try {
        const newMetrics = { ...wrestler.metrics }

        // Fetch Twitter followers
        if (wrestler.socialMedia.twitter) {
          const twitterResult = await getTwitterFollowers(wrestler.socialMedia.twitter)
          if (twitterResult.success && twitterResult.data) {
            newMetrics.twitterFollowers = twitterResult.data.followers
          }
        }

        // Fetch Instagram followers
        if (wrestler.socialMedia.instagram) {
          const instagramResult = await getInstagramFollowers(wrestler.socialMedia.instagram)
          if (instagramResult.success && instagramResult.data) {
            newMetrics.instagramFollowers = instagramResult.data.followers
          }
        }

        // Fetch Reddit mentions
        const redditResult = await getRedditMentions(wrestler.name, 30)
        if (redditResult.success && redditResult.data) {
          newMetrics.redditMentions = redditResult.data.mentions
        }

        // Fetch podcast mentions
        const podcastResult = await getPodcastMentions(wrestler.name, 30)
        if (podcastResult.success && podcastResult.data) {
          newMetrics.podcastMentions = podcastResult.data.mentions
        }

        // Calculate new popularity score
        const newScore = calculatePopularityScore(newMetrics)

        // Add to historical data
        const historicalData = wrestler.historicalData || []
        historicalData.push({
          date: Timestamp.now(),
          score: newScore,
        })

        // Keep only last 90 days of historical data
        const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000
        const filteredHistory = historicalData.filter((point) => {
          const pointDate =
            point.date instanceof Timestamp ? point.date.toMillis() : point.date
          return pointDate >= ninetyDaysAgo
        })

        // Update wrestler document
        await updateDoc(doc(db, WRESTLERS_COLLECTION, wrestler.docId), {
          metrics: {
            ...newMetrics,
            lastUpdated: Timestamp.now(),
          },
          popularityScore: newScore,
          historicalData: filteredHistory,
          updatedAt: Timestamp.now(),
        })

        updateResults.updated++
      } catch (error) {
        updateResults.failed++
        updateResults.errors.push(`Failed to update ${wrestler.name}: ${error}`)
      }
    }

    // Recalculate rankings
    const scoresForRanking = wrestlers.map((w) => ({
      id: w.docId,
      score: w.popularityScore,
    }))

    const ranks = calculateRanks(scoresForRanking)

    // Update ranks
    for (const [wrestlerId, rank] of ranks.entries()) {
      await updateDoc(doc(db, WRESTLERS_COLLECTION, wrestlerId), {
        popularityRank: rank,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Metrics updated successfully',
      ...updateResults,
    })
  } catch (error) {
    console.error('Error updating metrics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update metrics' },
      { status: 500 }
    )
  }
}
