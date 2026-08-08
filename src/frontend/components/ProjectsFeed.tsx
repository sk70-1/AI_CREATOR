import React, { useState } from 'react';
import { 
  Share2, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Image as ImageIcon,
  Copy,
  Check,
  Globe,
  Loader2
} from 'lucide-react';

export interface PostItem {
  id: string;
  agent_id?: string;
  content?: string;
  draft_content?: string;
  topic_title?: string;
  source_title?: string;
  topic_url?: string;
  source_url?: string;
  image_url?: string;
  score?: number;
  is_published?: number;
  published_tweet_id?: string;
  created_at: string;
}

interface ProjectsFeedProps {
  posts: PostItem[];
  isLoading: boolean;
  onTriggerPipeline: () => void;
}

export const ProjectsFeed: React.FC<ProjectsFeedProps> = ({
  posts,
  isLoading,
  onTriggerPipeline,
}) => {
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const filteredPosts = posts.filter((post) => {
    if (filter === 'published') return post.is_published === 1;
    if (filter === 'drafts') return !post.is_published;
    return true;
  });

  const getTwitterIntentUrl = (content: string) => {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
  };

  const getLinkedInShareUrl = (topicUrl?: string) => {
    const targetUrl = topicUrl || 'https://github.com/sk70-1/AI_CREATOR';
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(targetUrl)}`;
  };

  const getRedditShareUrl = (topicUrl?: string, title?: string) => {
    const targetUrl = topicUrl || 'https://github.com/sk70-1/AI_CREATOR';
    return `https://www.reddit.com/submit?url=${encodeURIComponent(targetUrl)}&title=${encodeURIComponent(title || 'AURA AI Curator')}`;
  };

  const formatLinkedInPost = (post: PostItem) => {
    const rawContent = post.content || post.draft_content || '';
    const topicUrl = post.topic_url || post.source_url || '';
    const topicTitle = post.topic_title || post.source_title || '';
    const cleanTitle = topicTitle || rawContent.split('\n')[0].replace(/[🔥🚀⚡🤖💡]/g, '').trim();

    if (!rawContent.includes('\n\n') || rawContent.length < 150) {
      return `🚀 ${cleanTitle}\n\n📌 Detailed Overview:\nLatest key update on ${cleanTitle}. Explore full details, source insights, and technical breakdown.\n\n💡 Why It Matters:\nThis development impacts software architecture, open-source technology, and modern digital ecosystems.\n\n🔗 Full Story: ${topicUrl || 'https://github.com/sk70-1/AI_CREATOR'}\n\n#ArtificialIntelligence #TechNews #FutureTech #Innovation #AURA_AI`;
    }

    if (!rawContent.includes('#')) {
      return `${rawContent}\n\n#ArtificialIntelligence #TechNews #FutureTech #Innovation #AURA_AI`;
    }

    return rawContent;
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLinkedInShare = async (post: PostItem) => {
    const content = post.content || post.draft_content || '';
    const topicUrl = post.topic_url || post.source_url || '';
    const topicTitle = post.topic_title || post.source_title || '';
    const richDescription = formatLinkedInPost(post);

    setPublishingId(post.id);
    try {
      // Auto-copy rich description to clipboard for seamless pasting
      await navigator.clipboard.writeText(richDescription);
      setCopiedId(post.id);

      const res = await fetch('/api/agent/publish/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: richDescription, topicUrl, topicTitle }),
      });
      const data = await res.json();
      if (data.success && !data.result?.isSimulated) {
        alert('✅ Post with rich description & hashtags published directly to your LinkedIn feed!');
      } else {
        // Fallback: Open LinkedIn Share Intent with description copied to clipboard
        window.open(getLinkedInShareUrl(topicUrl), '_blank');
      }
    } catch {
      await navigator.clipboard.writeText(richDescription);
      setCopiedId(post.id);
      window.open(getLinkedInShareUrl(topicUrl), '_blank');
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <div className="bg-surface border border-border-subtle rounded-xl p-5 mb-6 shadow-xl shadow-black/30 select-none">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4 mb-4">
        <div>
          <h3 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Multi-Platform Content Stream
          </h3>
          <p className="font-body text-xs text-on-surface-variant">
            Autonomous tech insights formatted with full descriptions for X, LinkedIn, and Reddit
          </p>
        </div>

        <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg border border-border-subtle">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All ({posts.length})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
              filter === 'published'
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Published ({posts.filter((p) => p.is_published === 1).length})
          </button>
          <button
            onClick={() => setFilter('drafts')}
            className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
              filter === 'drafts'
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Multi-Share ({posts.filter((p) => !p.is_published).length})
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="py-12 text-center text-on-surface-variant space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-mono text-xs">Fetching curated feed from Turso Cloud DB...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        /* Empty State */
        <div className="py-12 text-center border border-dashed border-border-subtle rounded-xl p-8 bg-surface-container-lowest">
          <Sparkles className="w-10 h-10 text-primary mx-auto mb-3 opacity-60" />
          <h4 className="font-headline font-semibold text-on-surface text-base mb-1">
            No Curated Posts Yet
          </h4>
          <p className="font-body text-xs text-on-surface-variant max-w-md mx-auto mb-4">
            Run the autonomous discovery pipeline to scrape top stories, generate AI topic cover art, and draft posts for X, LinkedIn, and Reddit.
          </p>
          <button
            onClick={onTriggerPipeline}
            className="px-4 py-2 bg-primary text-background font-mono text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Trigger Curation Pipeline
          </button>
        </div>
      ) : (
        /* Feed List */
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const rawPostText = post.content || post.draft_content || 'AI generated post content...';
            const displayPostText = formatLinkedInPost(post);
            const titleText = post.topic_title || post.source_title || '';
            const urlText = post.topic_url || post.source_url || '';
            const imageSrc = post.image_url;

            return (
              <div
                key={post.id}
                className="bg-surface-container-low border border-border-subtle rounded-xl p-4 hover:border-primary/50 transition-all group flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex justify-between items-start gap-3 mb-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      {post.is_published === 1 ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Direct API Published
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-primary-container/20 text-primary border border-primary/30 text-[11px] font-mono rounded-full flex items-center gap-1">
                          <Globe className="w-3 h-3" /> Multi-Share Ready
                        </span>
                      )}

                      <span className="px-2 py-0.5 bg-surface-variant text-on-surface text-[11px] font-mono rounded border border-border-subtle">
                        Score: {post.score || '9.5'}/10
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleString()}
                    </span>
                  </div>

                  {/* Source Title Link */}
                  {titleText && (
                    <h4 className="font-headline font-semibold text-on-surface text-base mb-2 leading-snug">
                      {urlText ? (
                        <a
                          href={urlText}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-primary transition-colors flex items-center gap-1.5 inline-flex"
                        >
                          {titleText}
                          <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                        </a>
                      ) : (
                        titleText
                      )}
                    </h4>
                  )}

                  {/* Generated Cover Image */}
                  {imageSrc && (
                    <div className="relative mb-3 rounded-lg overflow-hidden border border-border-subtle bg-surface-container group/img max-h-64">
                      <img
                        src={imageSrc}
                        alt={titleText || 'Topic AI Cover'}
                        className="w-full h-48 md:h-56 object-cover transition-transform duration-500 group-hover/img:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-md text-[10px] font-mono text-on-surface-variant rounded border border-white/10 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-primary" /> AI Topic Cover
                      </div>
                    </div>
                  )}

                  {/* Post Content & Description */}
                  <div className="bg-surface/80 border border-border-subtle/50 rounded-lg p-3 text-sm font-body text-on-surface whitespace-pre-wrap leading-relaxed select-text">
                    {displayPostText}
                  </div>
                </div>

                {/* Multi-Platform Action Toolbar */}
                <div className="pt-3 border-t border-border-subtle/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <span className="font-mono text-text-muted text-[11px]">
                    Agent: {post.agent_id || 'Nexus-7'}
                  </span>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* Share to X */}
                    <a
                      href={getTwitterIntentUrl(rawPostText)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 bg-primary-container text-on-primary-container font-mono font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 text-xs shadow-sm shadow-primary-container/20"
                      title="Post to X (Twitter)"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Post to X</span>
                    </a>

                    {/* Share / Publish to LinkedIn with full Description */}
                    <button
                      onClick={() => handleLinkedInShare(post)}
                      disabled={publishingId === post.id}
                      className="px-2.5 py-1.5 bg-[#0A66C2]/20 text-[#0A66C2] border border-[#0A66C2]/40 font-mono font-semibold rounded-lg hover:bg-[#0A66C2]/30 transition-colors flex items-center gap-1.5 text-xs disabled:opacity-50"
                      title="Publish post with full description to LinkedIn"
                    >
                      {publishingId === post.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0A66C2]" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5 text-[#0A66C2]" />
                      )}
                      <span>{publishingId === post.id ? 'Publishing...' : 'LinkedIn'}</span>
                    </button>

                    {/* Share to Reddit */}
                    <a
                      href={getRedditShareUrl(urlText, titleText)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 bg-[#FF4500]/20 text-[#FF4500] border border-[#FF4500]/40 font-mono font-semibold rounded-lg hover:bg-[#FF4500]/30 transition-colors flex items-center gap-1.5 text-xs"
                      title="Post to Reddit"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#FF4500]" />
                      <span>Reddit</span>
                    </a>

                    {/* Copy Post Text */}
                    <button
                      onClick={() => handleCopyText(post.id, displayPostText)}
                      className="px-2 py-1.5 bg-surface-variant text-on-surface-variant hover:text-on-surface border border-border-subtle rounded-lg font-mono text-xs transition-colors flex items-center gap-1"
                      title="Copy Post Content"
                    >
                      {copiedId === post.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
