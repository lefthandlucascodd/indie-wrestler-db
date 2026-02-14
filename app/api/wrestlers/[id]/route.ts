import { NextResponse } from 'next/server'
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const WRESTLERS_COLLECTION = 'wrestlers'

/**
 * GET /api/wrestlers/[id]
 * Fetches a single wrestler by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const docRef = doc(db, WRESTLERS_COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: 'Wrestler not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { id: docSnap.id, ...docSnap.data() },
    })
  } catch (error) {
    console.error('Error fetching wrestler:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wrestler' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/wrestlers/[id]
 * Updates a wrestler
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const docRef = doc(db, WRESTLERS_COLLECTION, id)

    // Check if document exists
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: 'Wrestler not found' },
        { status: 404 }
      )
    }

    // Update document
    const updateData = {
      ...body,
      updatedAt: Timestamp.now(),
    }

    await updateDoc(docRef, updateData)

    return NextResponse.json({
      success: true,
      data: { id, ...updateData },
    })
  } catch (error) {
    console.error('Error updating wrestler:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update wrestler' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/wrestlers/[id]
 * Deletes a wrestler
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const docRef = doc(db, WRESTLERS_COLLECTION, id)

    // Check if document exists
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: 'Wrestler not found' },
        { status: 404 }
      )
    }

    await deleteDoc(docRef)

    return NextResponse.json({
      success: true,
      message: 'Wrestler deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting wrestler:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete wrestler' },
      { status: 500 }
    )
  }
}
