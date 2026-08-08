import React from 'react';
import { Zap, Clock, ShieldCheck, Share2, Layers } from 'lucide-react';

interface StatsProps {
  postsCount: number;
  activePersonaName: string;
  activePersonaDomain: string;
  hasTwitter: boolean;
  hasGemini: boolean;
}

export const Stats: React.FC<StatsProps> = ({
  postsCount,
  activePersonaName,
  activePersonaDomain,
  hasTwitter,
  hasGemini,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Stat 1: Throughput */}
      <div className="bg-surface border border-border-subtle rounded-xl p-4 flex flex-col justify-between hover:border-primary/50 transition-colors">
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-xs text-text-muted uppercase tracking-wider">Throughput</span>
          <div className="w-7 h-7 rounded bg-surface-container flex items-center justify-center text-primary">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="font-headline text-2xl font-bold text-primary">12.4k/s</p>
          <p className="font-body text-xs text-on-surface-variant mt-0.5">Real-time Stream</p>
        </div>
      </div>

      {/* Stat 2: Latency */}
      <div className="bg-surface border border-border-subtle rounded-xl p-4 flex flex-col justify-between hover:border-primary/50 transition-colors">
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-xs text-text-muted uppercase tracking-wider">Latency</span>
          <div className="w-7 h-7 rounded bg-surface-container flex items-center justify-center text-on-surface-variant">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="font-headline text-2xl font-bold text-on-surface">42ms</p>
          <p className="font-body text-xs text-on-surface-variant mt-0.5">Gemini 2.5 Flash</p>
        </div>
      </div>

      {/* Stat 3: Quality Score */}
      <div className="bg-surface border border-border-subtle rounded-xl p-4 flex flex-col justify-between hover:border-primary/50 transition-colors">
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-xs text-text-muted uppercase tracking-wider">Quality Gate</span>
          <div className="w-7 h-7 rounded bg-surface-container flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="font-headline text-2xl font-bold text-emerald-400">94%</p>
          <p className="font-body text-xs text-on-surface-variant mt-0.5">Confidence Score</p>
        </div>
      </div>

      {/* Stat 4: Curated Posts */}
      <div className="bg-surface border border-border-subtle rounded-xl p-4 flex flex-col justify-between hover:border-primary/50 transition-colors">
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-xs text-text-muted uppercase tracking-wider">Curated Posts</span>
          <div className="w-7 h-7 rounded bg-surface-container flex items-center justify-center text-tertiary">
            <Share2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="font-headline text-2xl font-bold text-tertiary">{postsCount}</p>
          <p className="font-body text-xs text-on-surface-variant mt-0.5 truncate">
            {activePersonaName} ({activePersonaDomain})
          </p>
        </div>
      </div>
    </div>
  );
};
