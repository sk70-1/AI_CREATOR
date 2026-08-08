import React, { useState } from 'react';
import { Terminal, Trash2, Download, Pause, Play, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export interface LogMessage {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'SUCCESS' | 'ERROR';
  message: string;
}

interface ExecutionLogsProps {
  logs: LogMessage[];
  onClearLogs?: () => void;
}

export const ExecutionLogs: React.FC<ExecutionLogsProps> = ({ logs, onClearLogs }) => {
  const [activeTab, setActiveTab] = useState<'console' | 'metrics' | 'alerts'>('console');
  const [isPaused, setIsPaused] = useState(false);

  const initialDefaultLogs: LogMessage[] = [
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 600000).toTimeString().split(' ')[0],
      level: 'INFO',
      message: 'Discovery Node initialized. Connected to HackerNews Firebase API & RSS seeds.',
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 540000).toTimeString().split(' ')[0],
      level: 'INFO',
      message: 'Deduplication engine loaded Turso Cloud hash registry: 14M entries cached.',
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 480000).toTimeString().split(' ')[0],
      level: 'WARN',
      message: 'Quality Gate: Spike in unverified AI story patterns detected (Source: HN_Top_Stories).',
    },
    {
      id: 'log-4',
      timestamp: new Date(Date.now() - 360000).toTimeString().split(' ')[0],
      level: 'SUCCESS',
      message: 'Gemini 2.5 Flash evaluation completed. Topic draft generated (Score: 9.6/10).',
    },
    {
      id: 'log-5',
      timestamp: new Date(Date.now() - 120000).toTimeString().split(' ')[0],
      level: 'INFO',
      message: 'Publishing layer ready. Direct X API token verified & Web Intent protocol armed.',
    },
  ];

  const displayLogs = logs.length > 0 ? logs : initialDefaultLogs;

  return (
    <div className="bg-surface-container-lowest border border-border-subtle rounded-xl flex flex-col overflow-hidden shadow-2xl mb-6">
      {/* Console Header Bar matching Stitch */}
      <div className="flex border-b border-border-subtle px-4 h-11 items-center gap-6 select-none bg-surface-container-low">
        <div className="flex gap-4 h-full">
          <button
            onClick={() => setActiveTab('console')}
            className={`font-mono text-xs h-full px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'console'
                ? 'text-primary border-primary font-semibold'
                : 'text-on-surface-variant border-transparent hover:text-on-surface'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Pipeline Console
          </button>

          <button
            onClick={() => setActiveTab('metrics')}
            className={`font-mono text-xs h-full px-2 border-b-2 transition-colors ${
              activeTab === 'metrics'
                ? 'text-primary border-primary font-semibold'
                : 'text-on-surface-variant border-transparent hover:text-on-surface'
            }`}
          >
            Node Metrics
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`font-mono text-xs h-full px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'text-primary border-primary font-semibold'
                : 'text-on-surface-variant border-transparent hover:text-on-surface'
            }`}
          >
            Alerts
            <span className="bg-surface-variant text-on-surface px-1.5 py-0.2 rounded text-[10px]">
              0
            </span>
          </button>
        </div>

        <div className="flex-grow"></div>

        <div className="flex items-center gap-2 text-on-surface-variant">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 hover:text-on-surface transition-colors"
            title={isPaused ? 'Resume Stream' : 'Pause Stream'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {onClearLogs && (
            <button
              onClick={onClearLogs}
              className="p-1 hover:text-on-surface transition-colors"
              title="Clear Console"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Content Body */}
      {activeTab === 'console' && (
        <div className="p-4 font-mono text-xs overflow-y-auto max-h-80 min-h-[220px] bg-background/90 space-y-2 select-text leading-relaxed">
          {displayLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 hover:bg-white/[0.02] p-1 rounded">
              <span className="text-text-muted shrink-0 text-[11px] font-mono">{log.timestamp}</span>

              {log.level === 'INFO' && (
                <span className="text-primary font-semibold shrink-0 text-[11px] flex items-center gap-1">
                  [INFO]
                </span>
              )}
              {log.level === 'WARN' && (
                <span className="text-tertiary font-semibold shrink-0 text-[11px] flex items-center gap-1">
                  [WARN]
                </span>
              )}
              {log.level === 'SUCCESS' && (
                <span className="text-emerald-400 font-semibold shrink-0 text-[11px] flex items-center gap-1">
                  [SUCCESS]
                </span>
              )}
              {log.level === 'ERROR' && (
                <span className="text-error font-semibold shrink-0 text-[11px] flex items-center gap-1">
                  [ERROR]
                </span>
              )}

              <span className="text-on-surface-variant break-words">{log.message}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="p-4 font-mono text-xs text-on-surface-variant grid grid-cols-1 md:grid-cols-3 gap-4 bg-background/90">
          <div className="bg-surface p-3 rounded-lg border border-border-subtle">
            <p className="text-text-muted mb-1">Scraped Items/Min</p>
            <p className="text-lg font-bold text-primary">1,240</p>
          </div>
          <div className="bg-surface p-3 rounded-lg border border-border-subtle">
            <p className="text-text-muted mb-1">Gemini API Latency</p>
            <p className="text-lg font-bold text-emerald-400">420 ms</p>
          </div>
          <div className="bg-surface p-3 rounded-lg border border-border-subtle">
            <p className="text-text-muted mb-1">Turso Query Time</p>
            <p className="text-lg font-bold text-on-surface">12 ms</p>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="p-6 font-mono text-xs text-text-muted text-center bg-background/90">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <p className="text-on-surface font-semibold">All Systems Operational</p>
          <p className="text-xs">No active pipeline warnings or system errors flagged.</p>
        </div>
      )}
    </div>
  );
};
