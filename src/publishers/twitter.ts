import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

export interface PublishResult {
  tweetId: string;
  tweetUrl: string;
  isSimulated: boolean;
}

export async function publishToTwitter(content: string): Promise<PublishResult> {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  // If credentials are not provided, fallback to simulated post mode
  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    console.warn('⚠️ Twitter API credentials missing. Simulating X post submission.');
    const mockId = `sim_${Date.now()}`;
    return {
      tweetId: mockId,
      tweetUrl: `https://x.com/intent/post?text=${encodeURIComponent(content.slice(0, 280))}`,
      isSimulated: true,
    };
  }

  const client = new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  });

  const rwClient = client.readWrite;

  // 1. Try publishing via Twitter API v2
  try {
    if (content.includes('\n---\n')) {
      const tweets = content.split('\n---\n').map((t) => t.trim()).filter(Boolean);
      const threadResult = await rwClient.v2.tweetThread(tweets);
      const firstTweet = threadResult[0];
      const tweetId = firstTweet.data.id;
      return {
        tweetId,
        tweetUrl: `https://x.com/user/status/${tweetId}`,
        isSimulated: false,
      };
    } else {
      const tweetResult = await rwClient.v2.tweet(content);
      const tweetId = tweetResult.data.id;
      return {
        tweetId,
        tweetUrl: `https://x.com/user/status/${tweetId}`,
        isSimulated: false,
      };
    }
  } catch (v2Error: any) {
    console.warn('⚠️ X API v2 failed/restricted:', v2Error?.message || v2Error);
    console.log('🔄 Attempting fallback via X API v1.1 status endpoint...');

    // 2. Fallback: Try publishing via Twitter API v1.1
    try {
      const cleanContent = content.split('\n---\n')[0].trim();
      const v1Result = await rwClient.v1.tweet(cleanContent);
      console.log('✅ Posted successfully via X API v1.1 fallback!');
      return {
        tweetId: v1Result.id_str,
        tweetUrl: `https://x.com/user/status/${v1Result.id_str}`,
        isSimulated: false,
      };
    } catch (v1Error: any) {
      console.warn('⚠️ X API v1.1 also restricted:', v1Error?.message || v1Error);
    }
  }

  // 3. Ultimate Fallback: Intent URL if all API endpoints are restricted on current free tier
  console.log('ℹ️ Generating 1-click Twitter intent share link fallback.');
  const mockId = `intent_${Date.now()}`;
  const firstTweet = content.split('\n---\n')[0].trim();
  const encodedText = encodeURIComponent(firstTweet.slice(0, 240));
  return {
    tweetId: mockId,
    tweetUrl: `https://x.com/intent/post?text=${encodedText}`,
    isSimulated: true,
  };
}
