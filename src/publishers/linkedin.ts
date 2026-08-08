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

export async function getLinkedInUserInfo(accessToken: string) {
  const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const sub = response.data.sub;
  return {
    sub,
    name: response.data.name || response.data.given_name,
    email: response.data.email,
    authorUrn: `urn:li:person:${sub}`,
  };
}

export async function publishToLinkedIn(
  content: string,
  topicUrl?: string,
  topicTitle?: string
): Promise<LinkedInPublishResult> {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  let authorUrn = process.env.LINKEDIN_AUTHOR_URN; // e.g. urn:li:person:123456
  const shareIntentUrl = getLinkedInShareIntentUrl(topicUrl);

  if (!accessToken) {
    console.warn('⚠️ LINKEDIN_ACCESS_TOKEN missing. Generating 1-click LinkedIn Intent URL fallback.');
    return {
      postId: `linkedin_intent_${Date.now()}`,
      postUrl: shareIntentUrl,
      shareIntentUrl,
      isSimulated: true,
      message: 'LINKEDIN_ACCESS_TOKEN is missing. 1-click Share Intent URL generated.',
    };
  }

  // Auto-fetch authorUrn if token exists but URN is not set
  if (!authorUrn) {
    try {
      const info = await getLinkedInUserInfo(accessToken);
      authorUrn = info.authorUrn;
      console.log(`ℹ️ Auto-retrieved LinkedIn Author URN: ${authorUrn}`);
    } catch (err: any) {
      console.warn('⚠️ Failed to auto-fetch LinkedIn Author URN:', err?.message || err);
    }
  }

  if (!authorUrn) {
    return {
      postId: `linkedin_intent_${Date.now()}`,
      postUrl: shareIntentUrl,
      shareIntentUrl,
      isSimulated: true,
      message: 'Could not resolve LINKEDIN_AUTHOR_URN. 1-click Share Intent URL generated.',
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
