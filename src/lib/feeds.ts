export interface FeedSource {
  name: string
  url: string
  category: 'ai' | 'product-ux' | 'business-strategy'
}

export const FEEDS: FeedSource[] = [
  // AI Research & News
  { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/', category: 'ai' },
  { name: 'The Verge (AI)', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', category: 'ai' },
  { name: 'Wired (AI)', url: 'https://www.wired.com/feed/tag/ai/latest/rss', category: 'ai' },
  { name: 'Ars Technica (AI)', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', category: 'ai' },
  { name: 'TechCrunch (AI)', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'ai' },
  { name: 'Import AI (Jack Clark)', url: 'https://importai.substack.com/feed', category: 'ai' },
  { name: 'The Batch (Andrew Ng)', url: 'https://www.deeplearning.ai/the-batch/feed/', category: 'ai' },

  // Product & UX
  { name: 'Nielsen Norman Group', url: 'https://www.nngroup.com/feed/rss/', category: 'product-ux' },
  { name: 'UX Collective', url: 'https://uxdesign.cc/feed', category: 'product-ux' },
  { name: 'Sidebar.io', url: 'https://sidebar.io/feed.xml', category: 'product-ux' },
  { name: 'A List Apart', url: 'https://alistapart.com/main/feed/', category: 'product-ux' },

  // Business & Strategy
  { name: 'Benedict Evans', url: 'https://www.ben-evans.com/benedictevans?format=rss', category: 'business-strategy' },
  { name: 'Stratechery', url: 'https://stratechery.com/feed/', category: 'business-strategy' },
  { name: 'CB Insights', url: 'https://www.cbinsights.com/research/feed/', category: 'business-strategy' },
  { name: 'NYT Technology', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml', category: 'business-strategy' },
  { name: 'Platformer', url: 'https://www.platformer.news/rss/', category: 'business-strategy' },
]

export const CATEGORY_LABELS: Record<FeedSource['category'], string> = {
  'ai': 'AI Research & News',
  'product-ux': 'Product & UX',
  'business-strategy': 'Business & Strategy',
}
