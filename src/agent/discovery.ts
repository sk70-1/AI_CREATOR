import axios from 'axios';
import Parser from 'rss-parser';

export interface RawTopic {
  title: string;
  url: string;
  summary: string;
  source: string;
}

const parser = new Parser();

const RSS_FEEDS = [
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
  { name: 'Ars Technica', url: 'http://feeds.arstechnica.com/arstechnica/index' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
];

export async function fetchHackerNewsTopStories(limit: number = 8): Promise<RawTopic[]> {
  try {
    const { data: topIds } = await axios.get<number[]>('https://hacker-news.firebaseio.com/v0/topstories.json');
    const selectedIds = topIds.slice(0, limit);

    const storyPromises = selectedIds.map(async (id) => {
      try {
        const { data: item } = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        if (item && item.title && item.url) {
          return {
            title: item.title,
            url: item.url,
            summary: item.title,
            source: 'HackerNews',
          };
        }
      } catch {
        return null;
      }
      return null;
    });

    const stories = await Promise.all(storyPromises);
    return stories.filter((s): s is RawTopic => s !== null);
  } catch (error) {
    console.error('Error fetching HackerNews stories:', error);
    return [];
  }
}

export async function fetchRssFeeds(itemsPerFeed: number = 3): Promise<RawTopic[]> {
  const topics: RawTopic[] = [];

  for (const feedConfig of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedConfig.url);
      const items = (feed.items || []).slice(0, itemsPerFeed);

      for (const item of items) {
        if (item.title && item.link) {
          topics.push({
            title: item.title,
            url: item.link,
            summary: item.contentSnippet || item.title,
            source: feedConfig.name,
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
    fetchHackerNewsTopStories(8),
    fetchRssFeeds(2),
  ]);

  return [...hnTopics, ...rssTopics];
}
