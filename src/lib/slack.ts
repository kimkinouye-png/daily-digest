import type { Digest } from './summarize'

/** Format digest as Slack Block Kit message and post via webhook */
export async function postToSlack(digest: Digest): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) {
    throw new Error('SLACK_WEBHOOK_URL is not set')
  }

  const blocks: any[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `Daily Digest — ${digest.date}`,
        emoji: true,
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `${digest.storyCount} stories from across the web`,
        },
      ],
    },
    { type: 'divider' },
  ]

  for (const section of digest.sections) {
    // Section header
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${section.label}*`,
      },
    })

    // Stories
    for (const story of section.stories) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<${story.link}|*${escapeSlack(story.title)}*> — _${escapeSlack(story.source)}_\n${escapeSlack(story.summary)}`,
        },
      })
    }

    blocks.push({ type: 'divider' })
  }

  // Footer
  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: 'Curated by Daily Digest',
      },
    ],
  })

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Slack webhook failed (${res.status}): ${body}`)
  }
}

function escapeSlack(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
