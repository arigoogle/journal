// One-time backfill: mirrors every existing journal entry (and its photo)
// into the DreamHost backup API. New entries are kept in sync automatically
// by the app itself (src/features/journal/backupApi.ts) — this script only
// covers entries written before that wiring existed.
//
// Usage:
//   node --env-file=.env scripts/backfill-backup.mjs
//
// Reuses the app's own env vars, plus one extra, server-only one:
//   VITE_SUPABASE_URL — source of truth
//   SUPABASE_SERVICE_ROLE_KEY — from Supabase dashboard → Project Settings →
//     API → "service_role" secret. NOT the anon key: RLS restricts
//     journal_entries to the authenticated owner, and this script has no
//     logged-in session, so the anon key would just return zero rows.
//     Deliberately NOT prefixed with VITE_ — that prefix gets inlined into
//     the browser bundle by Vite, which would leak an RLS-bypassing key to
//     anyone who opens devtools. Add it to .env (gitignored) only for this
//     run, then remove it again.
//   VITE_BACKUP_API_URL, VITE_BACKUP_API_TOKEN — backup destination

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BACKUP_API_URL = process.env.VITE_BACKUP_API_URL
const BACKUP_API_TOKEN = process.env.VITE_BACKUP_API_TOKEN

// Shared hosting is doing a synchronous image download per entry with a
// photo — give it room to breathe instead of firing everything at once.
const DELAY_MS = 300

function extractFirstImageSrc(html) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/)
  return match ? match[1] : null
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const missing = [
    ['VITE_SUPABASE_URL', SUPABASE_URL],
    ['SUPABASE_SERVICE_ROLE_KEY', SUPABASE_SERVICE_ROLE_KEY],
    ['VITE_BACKUP_API_URL', BACKUP_API_URL],
    ['VITE_BACKUP_API_TOKEN', BACKUP_API_TOKEN],
  ].filter(([, value]) => !value)

  if (missing.length > 0) {
    console.error(
      `Missing env vars: ${missing.map(([name]) => name).join(', ')}. ` +
        'Run with: node --env-file=.env scripts/backfill-backup.mjs',
    )
    process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const { data: entries, error } = await supabase
    .from('journal_entries')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    console.error('Could not fetch entries from Supabase:', error.message)
    process.exit(1)
  }

  console.log(`Found ${entries.length} entries. Backing up to ${BACKUP_API_URL}…\n`)

  let ok = 0
  const failures = []

  for (const entry of entries) {
    const imageUrl = extractFirstImageSrc(entry.content)
    process.stdout.write(`${entry.date}${imageUrl ? ' (photo)' : ''} … `)

    try {
      const response = await fetch(`${BACKUP_API_URL}/api/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${BACKUP_API_TOKEN}`,
        },
        body: JSON.stringify({
          date: entry.date,
          content: entry.content,
          location_lat: entry.location_lat,
          location_lng: entry.location_lng,
          image_url: imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      console.log('ok')
      ok++
    } catch (err) {
      console.log(`FAILED (${err.message})`)
      failures.push(entry.date)
    }

    await sleep(DELAY_MS)
  }

  console.log(`\n${ok}/${entries.length} backed up.`)
  if (failures.length > 0) {
    console.log(`Failed dates: ${failures.join(', ')}`)
    process.exit(1)
  }
}

main()
