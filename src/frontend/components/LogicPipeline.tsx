import React, { useState } from 'react';
import { 
  Compass, 
  GitCompare, 
  ShieldCheck, 
  Share2, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  MoreVertical,
  Activity,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface LogicPipelineProps {
  onTriggerPipeline: () => void;
  isTriggering: boolean;
  activePersonaName: string;
}

export const LogicPipeline: React.FC<LogicPipelineProps> = ({
  onTriggerPipeline,
  isTriggering,
  activePersonaName,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 1.3));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.7));

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-surface-dim border border-border-subtle rounded-xl overflow-hidden shadow-2xl relative select-none">
      {/* Control Header Bar matching Stitch */}
      <div className="h-16 flex justify-between items-center px-4 md:px-6 border-b border-border-subtle bg-surface-dim/90 backdrop-blur-xl shrink-0 z-30">
        <div className="flex items-center gap-3">
          <h3 className="font-headline font-bold text-on-surface text-base md:text-lg tracking-tight">
            Autonomous Pipeline Flow_v2.4
          </h3>
          <span className="px-2.5 py-1 bg-surface-variant border border-border-subtle rounded-full font-mono text-xs text-on-surface-variant flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Active • {activePersonaName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={zoomIn}
            className="p-1.5 text-on-surface-variant hover:text-primary transition-colors rounded hover:bg-surface-variant"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={zoomOut}
            className="p-1.5 text-on-surface-variant hover:text-primary transition-colors rounded hover:bg-surface-variant"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-border-subtle mx-1"></div>

          <button
            onClick={onTriggerPipeline}
            disabled={isTriggering}
            className="bg-primary-container text-on-primary-container px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md shadow-primary-container/20 disabled:opacity-50"
          >
            {isTriggering ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isTriggering ? 'Running Flow...' : 'Test Flow'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Grid Canvas */}
      <div className="flex-grow relative overflow-auto bg-grid-pattern p-6">
        <div
          className="relative min-w-[1100px] min-h-[480px] transition-transform duration-200 origin-top-left"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Animated SVG Connections Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
            {/* Node 1 -> Node 2 */}
            <path
              d="M 270 140 C 340 140, 340 140, 410 140"
              fill="none"
              stroke="rgba(197, 192, 255, 0.25)"
              strokeWidth="2"
            />
            <path
              className="flow-line"
              d="M 270 140 C 340 140, 340 140, 410 140"
              fill="none"
              stroke="#c5c0ff"
              strokeWidth="2"
            />

            {/* Node 2 -> Node 3 */}
            <path
              d="M 670 140 C 740 140, 740 260, 810 260"
              fill="none"
              stroke="rgba(197, 192, 255, 0.25)"
              strokeWidth="2"
            />
            <path
              className="flow-line"
              d="M 670 140 C 740 140, 740 260, 810 260"
              fill="none"
              stroke="#c5c0ff"
              strokeWidth="2"
            />

            {/* Node 3 -> Node 4 */}
            <path
              d="M 1070 260 C 1140 260, 1140 260, 1200 260"
              fill="none"
              stroke="rgba(197, 192, 255, 0.25)"
              strokeWidth="2"
            />
            <path
              className="flow-line"
              d="M 1070 260 C 1140 260, 1140 260, 1200 260"
              fill="none"
              stroke="#c5c0ff"
              strokeWidth="2"
            />
          </svg>

          {/* Node 1: Discovery Node */}
          <div
            onClick={() => setSelectedNode('discovery')}
            className={`absolute left-[20px] top-[60px] w-[250px] bg-surface-container-low border rounded-xl p-4 flex flex-col gap-3 shadow-xl shadow-black/50 cursor-pointer transition-all ${
              selectedNode === 'discovery' ? 'border-primary ring-1 ring-primary' : 'border-border-subtle hover:border-primary/50'
            }`}
            style={{ zIndex: 20 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center border border-border-subtle text-primary">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-mono text-xs font-bold text-on-surface">1. Discovery Node</h4>
                  <p className="font-mono text-[10px] text-on-surface-variant">HackerNews & RSS</p>
                </div>
              </div>
              <MoreVertical className="w-4 h-4 text-on-surface-variant" />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1 font-mono text-xs">
              <div className="bg-surface p-2 rounded border border-border-subtle">
                <p className="text-[10px] text-text-muted">Throughput</p>
                <p className="font-semibold text-primary">12.4k/s</p>
              </div>
              <div className="bg-surface p-2 rounded border border-border-subtle">
                <p className="text-[10px] text-text-muted">Latency</p>
                <p className="font-semibold text-on-surface">42ms</p>
              </div>
            </div>

            {/* Output Port */}
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-surface-container border border-primary rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
          </div>

          {/* Node 2: Deduplication Node */}
          <div
            onClick={() => setSelectedNode('dedup')}
            className={`absolute left-[420px] top-[60px] w-[250px] bg-surface-container-low border rounded-xl p-4 flex flex-col gap-3 shadow-xl shadow-black/50 cursor-pointer transition-all ${
              selectedNode === 'dedup' ? 'border-primary ring-1 ring-primary' : 'border-border-subtle hover:border-primary/50'
            }`}
            style={{ zIndex: 20 }}
          >
            {/* Input Port */}
            <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-surface-container border border-border-subtle rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full"></div>
            </div>

            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center border border-border-subtle text-primary">
                  <GitCompare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-mono text-xs font-bold text-on-surface">2. Deduplication</h4>
                  <p className="font-mono text-[10px] text-on-surface-variant">Turso Hash Compare</p>
                </div>
              </div>
              <MoreVertical className="w-4 h-4 text-on-surface-variant" />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1 font-mono text-xs">
              <div className="bg-surface p-2 rounded border border-border-subtle">
                <p className="text-[10px] text-text-muted">Processed</p>
                <p className="font-semibold text-on-surface">11.8k/s</p>
              </div>
              <div className="bg-surface p-2 rounded border border-border-subtle">
                <p className="text-[10px] text-text-muted">Discarded</p>
                <p className="font-semibold text-tertiary">600/s</p>
              </div>
            </div>

            {/* Output Port */}
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-surface-container border border-primary rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
          </div>

          {/* Node 3: Gemini 2.5 Quality Gate */}
          <div
            onClick={() => setSelectedNode('quality')}
            className={`absolute left-[820px] top-[180px] w-[250px] bg-surface-container-low border rounded-xl p-4 flex flex-col gap-3 shadow-xl shadow-black/50 cursor-pointer transition-all ${
              selectedNode === 'quality' ? 'border-primary ring-1 ring-primary' : 'border-border-subtle hover:border-primary/50'
            }`}
            style={{ zIndex: 20 }}
          >
            {/* Input Port */}
            <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-surface-container border border-border-subtle rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full"></div>
            </div>

            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center border border-border-subtle text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-mono text-xs font-bold text-on-surface">3. Gemini 2.5 Gate</h4>
                  <p className="font-mono text-[10px] text-on-surface-variant">LLM Quality Scoring</p>
                </div>
              </div>
              <MoreVertical className="w-4 h-4 text-on-surface-variant" />
            </div>

            <div className="space-y-1.5 font-mono text-xs mt-1">
              <div className="bg-surface p-2 rounded border border-border-subtle flex justify-between items-center">
                <span className="text-[10px] text-text-muted">Quality Score</span>
                <span className="font-semibold text-emerald-400">94%</span>
              </div>
              <div className="bg-surface p-2 rounded border border-border-subtle flex justify-between items-center">
                <span className="text-[10px] text-text-muted">Min Threshold</span>
                <span className="font-semibold text-on-surface">8.0/10</span>
              </div>
            </div>

            {/* Output Port */}
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-surface-container border border-primary rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
          </div>

          {/* Node 4: Publisher Layer */}
          <div
            onClick={() => setSelectedNode('publisher')}
            className={`absolute left-[1220px] top-[180px] w-[240px] bg-surface-container-low border rounded-xl p-4 flex flex-col gap-3 shadow-xl shadow-black/50 cursor-pointer transition-all ${
              selectedNode === 'publisher' ? 'border-primary ring-1 ring-primary' : 'border-border-subtle hover:border-primary/50'
            }`}
            style={{ zIndex: 20 }}
          >
            {/* Input Port */}
            <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-surface-container border border-border-subtle rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full"></div>
            </div>

            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center border border-border-subtle text-tertiary">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-mono text-xs font-bold text-on-surface">4. Publisher Layer</h4>
                  <p className="font-mono text-[10px] text-on-surface-variant">X API & Web Intent</p>
                </div>
              </div>
            </div>

            <div className="bg-surface p-2 rounded border border-border-subtle flex justify-between items-center font-mono text-xs">
              <span className="text-[10px] text-text-muted">Target Platform</span>
              <span className="font-semibold text-tertiary flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
