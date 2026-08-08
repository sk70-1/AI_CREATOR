import React, { useState } from 'react';
import { Settings, Shield, Database, Cpu, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, Share2, Code } from 'lucide-react';

interface SystemSettingsProps {
  status: {
    hasTwitterKeys?: boolean;
    hasGeminiKey?: boolean;
    tursoConnected?: boolean;
    postsCount?: number;
    timestamp?: string;
  } | null;
  onRefreshStatus: () => void;
  onTriggerCron: () => Promise<void>;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({
  status,
  onRefreshStatus,
  onTriggerCron,
}) => {
  const [isCronRunning, setIsCronRunning] = useState(false);

  const handleCronTrigger = async () => {
    setIsCronRunning(true);
    try {
      await onTriggerCron();
    } finally {
      setIsCronRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center border-b border-border-subtle pb-4">
        <div>
          <h3 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            System Settings & API Environment Monitor
          </h3>
          <p className="font-body text-xs text-on-surface-variant">
            Live telemetry for Google Gemini 2.5 Flash, Turso LibSQL Cloud DB, X Twitter API, and Vercel Cron.
          </p>
        </div>
        <button
          onClick={onRefreshStatus}
          className="px-3 py-1.5 border border-border-subtle rounded-lg font-mono text-xs text-on-surface hover:bg-surface-variant transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Grid of System Service Monitors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Service 1: Google Gemini 2.5 Flash */}
        <div className="bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container border border-border-subtle flex items-center justify-center text-primary">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-headline font-bold text-on-surface text-base">Google Gemini 2.5 Flash</h4>
                <p className="font-mono text-xs text-on-surface-variant">AI Topic Curation & Quality Gate</p>
              </div>
            </div>
            {status?.hasGeminiKey ? (
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px] rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Configured
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-tertiary/10 text-tertiary border border-tertiary/20 font-mono text-[11px] rounded-full flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Key Required
              </span>
            )}
          </div>
          <p className="font-body text-xs text-on-surface-variant leading-relaxed">
            Powers autonomous tech news discovery, viral copy generation, tone tailoring, and 9.6/10 quality gate scoring.
          </p>
          <div className="font-mono text-[11px] text-text-muted pt-2 border-t border-border-subtle flex justify-between">
            <span>Model: gemini-2.5-flash</span>
            <span>API Package: @google/genai</span>
          </div>
        </div>

        {/* Service 2: Turso Cloud LibSQL DB */}
        <div className="bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container border border-border-subtle flex items-center justify-center text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-headline font-bold text-on-surface text-base">Turso Cloud LibSQL DB</h4>
                <p className="font-mono text-xs text-on-surface-variant">Serverless Cloud Persistence</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px] rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </span>
          </div>
          <p className="font-body text-xs text-on-surface-variant leading-relaxed">
            Persists agent personas, topic history, deduplication hashes, and generated post feeds across serverless functions.
          </p>
          <div className="font-mono text-[11px] text-text-muted pt-2 border-t border-border-subtle flex justify-between">
            <span>Client: @libsql/client</span>
            <span>Posts Count: {status?.postsCount ?? 0}</span>
          </div>
        </div>

        {/* Service 3: X (Twitter) Publisher */}
        <div className="bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container border border-border-subtle flex items-center justify-center text-tertiary">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-headline font-bold text-on-surface text-base">X (Twitter) Publisher</h4>
                <p className="font-mono text-xs text-on-surface-variant">Direct API v2 & Web Intent</p>
              </div>
            </div>
            {status?.hasTwitterKeys ? (
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px] rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Direct API Active
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-primary-container/20 text-primary border border-primary/30 font-mono text-[11px] rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Intent Fallback Active
              </span>
            )}
          </div>
          <p className="font-body text-xs text-on-surface-variant leading-relaxed">
            Publishes directly to X account via OAuth 1.0a API v2, with automated 1-click Web Intent URL fallback protocol.
          </p>
          <div className="font-mono text-[11px] text-text-muted pt-2 border-t border-border-subtle flex justify-between">
            <span>Library: twitter-api-v2</span>
            <span>Mode: Dual Publish Protocol</span>
          </div>
        </div>

        {/* Service 4: Vercel Cron Automation */}
        <div className="bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container border border-border-subtle flex items-center justify-center text-primary">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-headline font-bold text-on-surface text-base">Vercel Cron Automation</h4>
                <p className="font-mono text-xs text-on-surface-variant">Scheduled Daily Execution</p>
              </div>
            </div>
            <button
              onClick={handleCronTrigger}
              disabled={isCronRunning}
              className="px-2.5 py-1 bg-primary-container text-on-primary-container font-mono text-[11px] font-semibold rounded hover:opacity-90 transition-opacity flex items-center gap-1 disabled:opacity-50"
            >
              {isCronRunning ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
              <span>{isCronRunning ? 'Running Cron...' : 'Run Cron Now'}</span>
            </button>
          </div>
          <p className="font-body text-xs text-on-surface-variant leading-relaxed">
            Automated serverless cron trigger scheduled at 09:00 UTC daily (`0 9 * * *`) via `vercel.json` rewrite handler.
          </p>
          <div className="font-mono text-[11px] text-text-muted pt-2 border-t border-border-subtle flex justify-between">
            <span>Schedule: 0 9 * * *</span>
            <span>Endpoint: /api/cron/trigger</span>
          </div>
        </div>
      </div>

      {/* System Footer */}
      <footer className="pt-8 pb-4 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-text-muted select-none">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-on-surface">AURA AI Enterprise OS</span>
          <span>•</span>
          <span>Google Stitch MCP Certified</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/sk70-1/AI_CREATOR"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <Code className="w-3.5 h-3.5" />
            <span>sk70-1/AI_CREATOR</span>
          </a>
        </div>
      </footer>
    </div>
  );
};
