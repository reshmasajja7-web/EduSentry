import { api } from './api.js'

const MAX_ENTRIES = 300

// --------------------------------------------------
// GET ACTIVITY HISTORY FROM POSTGRESQL
// --------------------------------------------------

export async function getActivityLog() {
  try {
    const data = await api.activity.list()

    return (data.activities || []).slice(0, MAX_ENTRIES).map((entry) => ({
      id: entry.id,
      type: entry.type,
      meta: entry.meta || {},
      at: entry.at || entry.created_at,
    }))
  } catch (error) {
    console.error('Could not load activity history:', error)
    return []
  }
}

// --------------------------------------------------
// CREATE ACTIVITY IN POSTGRESQL
// --------------------------------------------------

export async function logActivity(type, meta = {}) {
  try {
    const data = await api.activity.create({
      type,
      meta,
    })

    const entry = data.activity

    return {
      id: entry.id,
      type: entry.type,
      meta: entry.meta || {},
      at: entry.at || entry.created_at,
    }
  } catch (error) {
    console.error('Could not save activity:', error)
    throw error
  }
}

// --------------------------------------------------
// CLEAR ALL ACTIVITY FOR CURRENT USER
// --------------------------------------------------

export async function clearActivityLog() {
  try {
    await api.activity.deleteAll()
    return true
  } catch (error) {
    console.error('Could not clear activity history:', error)
    throw error
  }
}

// --------------------------------------------------
// CALCULATE CURRENT LEARNING STREAK
// --------------------------------------------------

export function computeStreak(entries) {
  if (!entries || entries.length === 0) {
    return 0
  }

  const days = new Set(
    entries
      .filter((entry) => entry.at)
      .map((entry) => new Date(entry.at).toDateString())
  )

  const oneDay = 24 * 60 * 60 * 1000

  let cursor = new Date()

  // If the user hasn't done anything today,
  // allow yesterday to be the beginning of the current streak.
  if (!days.has(cursor.toDateString())) {
    cursor = new Date(cursor.getTime() - oneDay)
  }

  let streak = 0

  while (days.has(cursor.toDateString())) {
    streak += 1
    cursor = new Date(cursor.getTime() - oneDay)
  }

  return streak
}

// --------------------------------------------------
// HUMAN-READABLE TIME
// --------------------------------------------------

export function timeAgo(iso) {
  if (!iso) {
    return ''
  }

  const diffMs = Date.now() - new Date(iso).getTime()

  const mins = Math.round(diffMs / 60000)

  if (mins < 1) {
    return 'just now'
  }

  if (mins < 60) {
    return `${mins} min${mins === 1 ? '' : 's'} ago`
  }

  const hours = Math.round(mins / 60)

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }

  const days = Math.round(hours / 24)

  if (days < 7) {
    return `${days} day${days === 1 ? '' : 's'} ago`
  }

  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}