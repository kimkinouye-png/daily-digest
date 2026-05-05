import Anthropic from '@anthropic-ai/sdk'
import type { FeedItem } from './rss'
import { CATEGORY_LABELS, type FeedSource } from './feeds'

const client = new Anthropic()

export interface DigestBullet {
  label: string
  text: string
}

export interface DigestStory {
  title: string
  source: string
  link: string
  category: FeedSource['category']
  tldr: string
  bullets: DigestBullet[]
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

  const itemList = items
    .map((item, i) => `[${i + 1}] "${item.title}" — ${item.source} (${item.category})\n${item.snippet}`)
    .join('\n\n')

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 6000,
    messages: [
      {
        role: 'user',
        content: `You are the editor of a daily AI and product/design digest. Your reader is a product design operations leader who cares about AI developments, product/UX thinking, and business strategy.

From the articles below, select the 8-12 most important and interesting stories. Group them into these categories:
- AI Research & News (category: "ai")
- Product & UX (category: "product-ux")
- Business & Strategy (category: "business-strategy")

Skip any category if there are no noteworthy stories for it today.

For each selected story, write:
1. A "tldr" — one short sentence (10-15 words) that captures the essence. This goes in the top-of-page preview.
2. 3-4 "bullets" — each bullet has a short LABEL (2-4 words, like a mini headline) and 1-2 sentences of TEXT. Good labels are specific to the bullet, not generic. Examples: "Agentic-first design", "Rollout", "The catch", "Why it matters", "Key numbers", "What's missing", "Bottom line".

Tone: conversational, smart, direct. Like briefing a colleague over coffee. No hype, no filler, no marketing language.

Return valid JSON only, no markdown wrapping. Use this exact structure:
{
  "stories": [
    {
      "title": "Article title",
      "source": "Publication name",
      "link": "URL",
      "category": "ai" | "product-ux" | "business-strategy",
      "tldr": "One short sentence for the preview",
      "bullets": [
        { "label": "Why it matters", "text": "1-2 sentence explanation." },
        { "label": "Key change", "text": "1-2 sentence explanation." },
        { "label": "Rollout", "text": "1-2 sentence explanation." }
      ]
    }
  ]
}

Here are today's articles (${items.length} total):

${itemList}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  let stories: DigestStory[] = []

  try {
    const parsed = JSON.parse(text)
    stories = parsed.stories || []
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      const parsed = JSON.parse(match[0])
      stories = parsed.stories || []
    } else {
      throw new Error('Failed to parse Claude response as JSON')
    }
  }

  const categoryOrder: FeedSource['category'][] = ['ai', 'product-ux', 'business-strategy']
  const sections = categoryOrder
    .map((cat) => ({
      label: CATEGORY_LABELS[cat],
      category: cat,
      stories: stories.filter((s) => s.category === cat),
    }))
    .filter((s) => s.stories.length > 0)

  return { date: today, sections, storyCount: stories.length }
}
