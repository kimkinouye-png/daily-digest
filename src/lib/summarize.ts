import Anthropic from '@anthropic-ai/sdk'
import type { FeedItem } from './rss'
import { CATEGORY_LABELS, type FeedSource } from './feeds'
import { VALID_LENSES, type Lens, type DigestStory } from './lenses'

// Re-export the lens types so existing consumers of '@/lib/summarize' keep
// working unchanged. Client components should import from '@/lib/lenses'
// directly to avoid pulling the Anthropic SDK into the browser bundle.
export { VALID_LENSES } from './lenses'
export type { Lens, DigestBullet, DigestImplication, DigestStory } from './lenses'

const client = new Anthropic()

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
        content: `You are the editor of a daily AI and product/design digest. Your reader is a Design Operations leader at a large tech company. They care about AI developments, product/UX thinking, business strategy — and how all of these affect cross-functional teams.

From the articles below, select the 8-12 most important and interesting stories. Group them into these categories:
- AI Research & News (category: "ai")
- Product & UX (category: "product-ux")
- Business & Strategy (category: "business-strategy")

Skip any category if there are no noteworthy stories for it today.

For each selected story, write:

1. "tldr" — one short sentence (10-15 words) that captures the essence. Goes in the top-of-page preview.

2. "bullets" — 3-4 bullets, each with a short LABEL (2-4 words, like a mini headline) and 1-2 sentences of TEXT. Good labels are specific to the bullet. Examples: "Agentic-first design", "Rollout", "The catch", "Why it matters", "Key numbers", "What's missing", "Bottom line".

3. "tags" — array of zero or more lens tags from this fixed list, indicating which professional lenses this story is genuinely relevant to. Available lenses:
   - "design": directly affects designers, design teams, design tools, design systems
   - "ethics": raises ethical questions about AI, privacy, fairness, safety, manipulation
   - "engineering": affects engineers, dev tools, infrastructure, technical workflows
   - "product": affects product managers, product strategy, roadmap, prioritization
   - "leadership": relevant to managing teams, org design, change management, hiring
   - "accessibility": affects accessibility, inclusive design, assistive technology

   BE SELECTIVE. Only tag a lens when there's a real, specific connection a leader in that domain would care about. Most stories will have 0-2 tags. A few will have 3+. Some will have 0 (e.g. pure geopolitics or model release without role-specific implications).

4. "implication" — OPTIONAL object with shape { "lens": "<one of the tags above>", "text": "<1-2 sentences>" }. Include ONLY when there's a concrete, useful "what should this person do or think" that wouldn't already be obvious from the bullets. Pick the SINGLE lens where you have the most specific and actionable thing to say (don't write multiple implications). Be specific — not generic platitudes. Bad: "this could change how teams work in the future." Good: "Worth raising with your AI safety reviewer before any internal Figma AI rollout — the methodology suggests current guardrails miss social-engineering attacks." Omit the field entirely when there's nothing concrete to add.

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
      "tags": ["design", "leadership"],
      "implication": { "lens": "design", "text": "Concrete sentence about what this means for designers specifically." }
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

  // Sanitize: ensure tags are valid, implication has a valid lens
  stories = stories.map((s) => {
    const cleanTags = (s.tags || []).filter((t): t is Lens => (VALID_LENSES as readonly string[]).includes(t))
    const cleanImplication = s.implication && (VALID_LENSES as readonly string[]).includes(s.implication.lens) && s.implication.text
      ? s.implication
      : undefined
    return { ...s, tags: cleanTags.length > 0 ? cleanTags : undefined, implication: cleanImplication }
  })

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
