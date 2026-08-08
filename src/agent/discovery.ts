import axios from 'axios';
import Parser from 'rss-parser';

export interface RawTopic {
  title: string;
  url: string;
  summary: string;
  source: string;
  imageUrl?: string;
}

const parser = new Parser({
  timeout: 5000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AURA-AI/1.0',
  },
});

const TECH_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
];

function getRandomTechImage(index: number): string {
  return TECH_IMAGES[index % TECH_IMAGES.length];
}

const RSS_FEEDS = [
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
  { name: 'Ars Technica', url: 'http://feeds.arstechnica.com/arstechnica/index' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
];

export async function fetchHackerNewsTopStories(limit: number = 6): Promise<RawTopic[]> {
  try {
    const { data: topIds } = await axios.get<number[]>(
      'https://hacker-news.firebaseio.com/v0/topstories.json',
      { timeout: 5000 }
    );
    const selectedIds = topIds.slice(0, limit);

    const storyPromises = selectedIds.map(async (id, idx) => {
      try {
        const { data: item } = await axios.get(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
          { timeout: 4000 }
        );
        if (item && item.title && item.url) {
          return {
            title: item.title,
            url: item.url,
            summary: item.title,
            source: 'HackerNews',
            imageUrl: getRandomTechImage(idx),
          };
        }
      } catch {
        return null;
      }
      return null;
    });

    const stories = await Promise.all(storyPromises);
    return stories.filter(Boolean) as RawTopic[];
  } catch (error) {
    console.error('Error fetching HackerNews stories:', error);
    return [];
  }
}

export async function fetchRssFeeds(itemsPerFeed: number = 2): Promise<RawTopic[]> {
  const topics: RawTopic[] = [];

  for (const feedConfig of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedConfig.url);
      const items = (feed.items || []).slice(0, itemsPerFeed);

      let idx = 0;
      for (const item of items) {
        if (item.title && item.link) {
          topics.push({
            title: item.title,
            url: item.link,
            summary: item.contentSnippet || item.title,
            source: feedConfig.name,
            imageUrl: getRandomTechImage(idx++),
          });
        }
      }
    } catch (error) {
      console.warn(`Failed to parse RSS feed ${feedConfig.name}:`, error);
    }
  }

  return topics;
}

export async function discoverTopics(): Promise<RawTopic[]> {
  const [hnTopics, rssTopics] = await Promise.all([
    fetchHackerNewsTopStories(6),
    fetchRssFeeds(2),
  ]);

  return [...hnTopics, ...rssTopics];
}
