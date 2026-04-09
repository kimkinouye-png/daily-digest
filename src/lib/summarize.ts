import Anthropic from '@anthropic-ai/sdk'
import type { FeedItem } from './rss'
import { CATEGORY_LABELS, type FeedSource } from './feeds'

const client = new Anthropic()

export interface DigestStory {
  title: string
  source: string
  link: string
  summary: string
  category: FeedSource['category']
}

export interface Digest {
  date: string
  sections: {
    label: string
    category: FeedSource['category']
    stories: DigestStory[]
  }[]
  storyCount: number
}

export async function buildDigest(items: FeedItem[]): Promise<Digest> {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Chicago',
  })

  // Build the item list for Claude
  const itemList = items
    .map((item, i) => `[${i + 1}] "${item.title}" — ${item.source} (${item.category})\n${item.snippet}`)
    .join('\n\n')

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `You are the editor of a daily AI and product/design digest. Your reader is a product design operations leader who cares about AI developments, product/UX thinking, and business strategy.

From the articles below, select the 8-12 most important and interesting stories. Group them into these categories:
- AI Research & News
- Product & UX
- Business & Strategy

Skip any category if there are no noteworthy stories for it today.

For each selected story, write a 2-3 sentence summary that explains why it matters. Be conversational but smart — like briefing a colleague over coffee. No hype, no filler.

Return valid JSON only, no markdown wrapping. Use this exact structure:
{
  "stories": [
    {
      "title": "Article title",
      "source": "Publication name",
      "link": "URL",
      "summary": "2-3 sentence summary",
      "category": "ai" | "product-ux" | "business-strategy"
    }
  ]
}

Here are today's articles (${items.length} total):

${itemList}`,
      },
    ],
  })

  // Parse the response
  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  let stories: DigestStory[] = []

  try {
    const parsed = JSON.parse(text)
    stories = parsed.stories || []
  } catch {
    // Try to extract JSON from the response if it has surrounding text
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      const parsed = JSON.parse(match[0])
      stories = parsed.stories || []
    } else {
      throw new Error('Failed to parse Claude response as JSON')
    }
  }

  // Group into sections
  const categoryOrder: FeedSource['category'][] = ['ai', 'product-ux', 'business-strategy']
  const sections = categoryOrder
    .map((cat) => ({
      label: CATEGORY_LABELS[cat],
      category: cat,
      stories: stories.filter((s) => s.category === cat),
    }))
    .filter((s) => s.stories.length > 0)

  return {
    date: today,
    sections,
    storyCount: stories.length,
  }
}
