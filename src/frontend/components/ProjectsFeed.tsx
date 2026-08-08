import React, { useState } from 'react';
import { Share2, ExternalLink, Sparkles, CheckCircle2, Clock, MessageSquare, Image as ImageIcon } from 'lucide-react';

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

  const filteredPosts = posts.filter((post) => {
    if (filter === 'published') return post.is_published === 1;
    if (filter === 'drafts') return !post.is_published;
    return true;
  });

  const getTwitterIntentUrl = (content: string) => {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
  };

  return (
    <div className="bg-surface border border-border-subtle rounded-xl p-5 mb-6 shadow-xl shadow-black/30 select-none">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4 mb-4">
        <div>
          <h3 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Curated Content & Publishing Stream
          </h3>
          <p className="font-body text-xs text-on-surface-variant">
            Live AI-generated tech insights & AI cover graphics scored by Gemini Quality Gate
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
            Web Intent ({posts.filter((p) => !p.is_published).length})
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
            Run the autonomous discovery pipeline to scrape top stories, generate AI topic cover art, and draft viral posts.
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
            const postText = post.content || post.draft_content || 'AI generated post content...';
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
                          <CheckCircle2 className="w-3 h-3" /> Direct X Published
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-primary-container/20 text-primary border border-primary/30 text-[11px] font-mono rounded-full flex items-center gap-1">
                          <Share2 className="w-3 h-3" /> Web Intent Ready
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

                  {/* Post Content */}
                  <div className="bg-surface/80 border border-border-subtle/50 rounded-lg p-3 text-sm font-body text-on-surface whitespace-pre-wrap leading-relaxed select-text">
                    {postText}
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="pt-2 border-t border-border-subtle/50 flex justify-between items-center text-xs">
                  <span className="font-mono text-text-muted text-[11px]">
                    Agent: {post.agent_id || 'Nexus-7'}
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={getTwitterIntentUrl(postText)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-primary text-background font-mono font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 text-xs shadow-sm shadow-primary/20"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Publish via X Intent</span>
                    </a>
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
