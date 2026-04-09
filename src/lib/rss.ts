import Parser from 'rss-parser'
import { FEEDS, type FeedSource } from './feeds'

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'DailyDigest/1.0',
  },
})

export interface FeedItem {
  title: string
  link: string
  snippet: string
  pubDate: string
  source: string
  category: FeedSource['category']
}

/** Fetch all feeds in parallel, return items from the last 24 hours */
export async function fetchAllFeeds(): Promise<FeedItem[]> {
  const cutoff = new Date(Date.now() - 26 * 60 * 60 * 1000) // 26 hours for timezone buffer

  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url)
        return (parsed.items || []).map((item) => ({
          title: (item.title || '').trim(),
          link: item.link || '',
          snippet: stripHtml(item.contentSnippet || item.content || item.summary || '').slice(0, 500),
          pubDate: item.pubDate || item.isoDate || '',
          source: feed.name,
          category: feed.category,
        }))
      } catch {
        console.warn(`Failed to fetch ${feed.name}: ${feed.url}`)
        return []
      }
    })
  )

  const allItems: FeedItem[] = []
  for (const result of results) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value)
    }
  }

  // Filter to recent items and deduplicate by title similarity
  const recent = allItems.filter((item) => {
    if (!item.pubDate) return true // include if no date (some feeds omit it)
    const d = new Date(item.pubDate)
    return !isNaN(d.getTime()) && d >= cutoff
  })

  return dedup(recent)
}

/** Remove near-duplicate titles (same story from multiple outlets) */
function dedup(items: FeedItem[]): FeedItem[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key = normalizeTitle(item.title)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60)
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}
