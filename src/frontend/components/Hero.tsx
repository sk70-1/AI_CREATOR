import React from 'react';
import { Filter, Play, RefreshCw, Sparkles, Activity } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle: string;
  activePersonaName?: string;
  onTriggerPipeline: () => void;
  isTriggering: boolean;
  onFilterClick?: () => void;
  lastUpdated?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  activePersonaName = 'Nexus-7',
  onTriggerPipeline,
  isTriggering,
  onFilterClick,
  lastUpdated,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-border-subtle pb-6 select-none">
      <div>
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="px-2.5 py-1 bg-surface-variant/80 border border-border-subtle rounded-full font-mono text-xs text-on-surface-variant flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            System Active • {activePersonaName}
          </span>

          {lastUpdated && (
            <span className="text-xs font-mono text-text-muted flex items-center gap-1">
              <Activity className="w-3 h-3 text-primary" />
              {lastUpdated}
            </span>
          )}
        </div>

        <h2 className="font-headline text-2xl md:text-3xl font-semibold text-on-surface tracking-tight">
          {title}
        </h2>
        <p className="font-body text-sm text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {onFilterClick && (
          <button
            onClick={onFilterClick}
            className="px-3.5 py-2 border border-border-subtle rounded-lg font-mono text-xs font-medium text-on-surface hover:bg-surface-variant transition-colors flex items-center gap-2"
          >
            <Filter className="w-3.5 h-3.5 text-on-surface-variant" />
            <span>Filter</span>
          </button>
        )}

        <button
          onClick={onTriggerPipeline}
          disabled={isTriggering}
          className="px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-mono text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 shadow-md shadow-primary-container/20 disabled:opacity-50"
        >
          {isTriggering ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          <span>{isTriggering ? 'Executing Pipeline...' : 'Run Pipeline'}</span>
        </button>
      </div>
    </div>
  );
};
