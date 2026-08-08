import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface LinkedInPublishResult {
  postId: string;
  postUrl: string;
  shareIntentUrl: string;
  isSimulated: boolean;
  message?: string;
}

export function getLinkedInShareIntentUrl(topicUrl?: string): string {
  const targetUrl = topicUrl || 'https://github.com/sk70-1/AI_CREATOR';
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(targetUrl)}`;
}

export function getRedditShareIntentUrl(topicUrl?: string, topicTitle?: string): string {
  const targetUrl = topicUrl || 'https://github.com/sk70-1/AI_CREATOR';
  const title = topicTitle || 'AURA AI Tech Curator';
  return `https://www.reddit.com/submit?url=${encodeURIComponent(targetUrl)}&title=${encodeURIComponent(title)}`;
}

export async function publishToLinkedIn(
  content: string,
  topicUrl?: string,
  topicTitle?: string
): Promise<LinkedInPublishResult> {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const authorUrn = process.env.LINKEDIN_AUTHOR_URN; // e.g. urn:li:person:123456 or urn:li:organization:123456
  const shareIntentUrl = getLinkedInShareIntentUrl(topicUrl);

  if (!accessToken || !authorUrn) {
    console.warn('⚠️ LINKEDIN_ACCESS_TOKEN or LINKEDIN_AUTHOR_URN missing. Generating 1-click LinkedIn Intent URL fallback.');
    return {
      postId: `linkedin_intent_${Date.now()}`,
      postUrl: shareIntentUrl,
      shareIntentUrl,
      isSimulated: true,
      message: 'LinkedIn API credentials missing. 1-click Share Intent URL generated.',
    };
  }

  try {
    // Call LinkedIn ugcPosts API
    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: topicUrl ? 'ARTICLE' : 'NONE',
            media: topicUrl
              ? [
                  {
                    status: 'READY',
                    originalUrl: topicUrl,
                    title: { text: topicTitle || 'AI Curator Update' },
                  },
                ]
              : [],
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'Content-Type': 'application/json',
        },
      }
    );

    const postId = response.data.id || `li_${Date.now()}`;
    console.log(`✅ Posted successfully to LinkedIn API! Post ID: ${postId}`);

    return {
      postId,
      postUrl: `https://www.linkedin.com/feed/update/${postId}`,
      shareIntentUrl,
      isSimulated: false,
    };
  } catch (error: any) {
    console.warn('⚠️ LinkedIn API publishing failed:', error?.response?.data || error?.message);
    return {
      postId: `linkedin_fallback_${Date.now()}`,
      postUrl: shareIntentUrl,
      shareIntentUrl,
      isSimulated: true,
      message: error?.response?.data?.message || error?.message || 'LinkedIn API error fallback',
    };
  }
}
