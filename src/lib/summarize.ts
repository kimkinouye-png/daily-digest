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
  designRelevance?: boolean
  designImplication?: string
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
    max_tokens: 8000,
    messages: [
      {
        role: 'user',
        content: `You are the editor of a daily AI and product/design digest. Your reader is a Design Operations leader at a large tech company. They care about AI developments, product/UX thinking, business strategy — and especially how all of these affect design teams, design systems, and the practice of design at scale.

From the articles below, select the 8-12 most important and interesting stories. Group them into these categories:
- AI Research & News (category: "ai")
- Product & UX (category: "product-ux")
- Business & Strategy (category: "business-strategy")

Skip any category if there are no noteworthy stories for it today.

For each selected story, write:
1. "tldr" — one short sentence (10-15 words) that captures the essence. Goes in the top-of-page preview.
2. "bullets" — 3-4 bullets, each with a short LABEL (2-4 words, like a mini headline) and 1-2 sentences of TEXT. Good labels are specific to the bullet. Examples: "Agentic-first design", "Rollout", "The catch", "Why it matters", "Key numbers", "What's missing", "Bottom line".
3. "designRelevance" — boolean. Is this story directly useful for a Design Operations leader (someone managing design teams, design systems, AI tools used by designers, cross-functional design strategy, design hiring, design org structure)? BE SELECTIVE. Set true only when there's a real, specific connection a design ops leader would care about. Most general AI infrastructure or pure business strategy stories should be false. Most Product & UX stories will be true. AI stories about tools that affect designer workflows (Figma, image generation, design assistants) should be true. AI safety news, geopolitics, model releases without design implications should be false.
4. "designImplication" — string, ONLY include when designRelevance is true. One or two concrete sentences explaining what this story means for design teams or design operations specifically. Be specific and useful — not generic platitudes. Bad: "this could change how design teams work in the future." Good: "Design teams currently piloting Figma's AI features should anticipate new legal review cycles before any enterprise rollout."

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
      ],
      "designRelevance": true,
      "designImplication": "Concrete sentence about what this means for design ops."
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
