import React, { useState } from 'react';
import { Bot, Plus, Check, MoreHorizontal, Shield, Edit3, Trash2, Zap, Lock, Sparkles, X } from 'lucide-react';

export interface Persona {
  id: string;
  name: string;
  domain: string;
  tone: string;
  mode: string;
  is_active: number;
  created_at?: string;
}

interface AgentPersonasProps {
  personas: Persona[];
  onSelectPersona: (id: string) => void;
  onCreatePersona: (data: { name: string; domain: string; tone: string; mode: string }) => Promise<void>;
  onUpdatePersona: (id: string, data: { name: string; domain: string; tone: string; mode: string }) => Promise<void>;
  onDeletePersona: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const AgentPersonas: React.FC<AgentPersonasProps> = ({
  personas,
  onSelectPersona,
  onCreatePersona,
  onUpdatePersona,
  onDeletePersona,
  isLoading,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
  const [formData, setFormData] = useState({ name: '', domain: '', tone: '', mode: 'autonomous' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingPersona(null);
    setFormData({ name: '', domain: '', tone: 'Authoritative & Concise', mode: 'autonomous' });
    setModalOpen(true);
  };

  const openEditModal = (persona: Persona) => {
    setEditingPersona(persona);
    setFormData({
      name: persona.name,
      domain: persona.domain,
      tone: persona.tone,
      mode: persona.mode || 'autonomous',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.domain || !formData.tone) return;
    setIsSubmitting(true);
    try {
      if (editingPersona) {
        await onUpdatePersona(editingPersona.id, formData);
      } else {
        await onCreatePersona(formData);
      }
      setModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tonePresets = [
    'Authoritative & Concise',
    'Technical & Deep Dive',
    'Builder & Hacker Vibe',
    'Minimalist News Digest',
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <h3 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Agent Personas Management
          </h3>
          <p className="font-body text-xs text-on-surface-variant">
            Configure autonomous agent personas, expertise domains, writing tones, and operational status.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-mono text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md shadow-primary-container/20 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Deploy New Persona</span>
        </button>
      </div>

      {/* Grid of Personas matching Stitch design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {personas.map((persona) => {
          const isActive = Number(persona.is_active) === 1;

          return (
            <div
              key={persona.id}
              className={`bg-surface border rounded-xl p-5 flex flex-col justify-between gap-4 transition-all relative ${
                isActive
                  ? 'border-primary shadow-lg shadow-primary/10'
                  : 'border-border-subtle hover:border-primary/50'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container border border-border-subtle flex items-center justify-center text-primary">
                    <Bot className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isActive ? (
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px] rounded-full flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
                      </span>
                    ) : (
                      <button
                        onClick={() => onSelectPersona(persona.id)}
                        className="px-2.5 py-1 bg-surface-container text-on-surface-variant hover:text-on-surface border border-border-subtle font-mono text-[11px] rounded-full transition-colors"
                      >
                        Set Active
                      </button>
                    )}

                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === persona.id ? null : persona.id)}
                        className="w-8 h-8 rounded-lg hover:bg-surface-variant flex items-center justify-center text-on-surface-variant transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenuId === persona.id && (
                        <div className="absolute right-0 top-9 w-36 bg-surface-container-high border border-border-subtle rounded-lg shadow-xl z-20 py-1 font-mono text-xs">
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              openEditModal(persona);
                            }}
                            className="w-full px-3 py-1.5 text-left text-on-surface hover:bg-surface-variant flex items-center gap-2"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit Persona
                          </button>
                          {personas.length > 1 && (
                            <button
                              onClick={async () => {
                                setActiveMenuId(null);
                                await onDeletePersona(persona.id);
                              }}
                              className="w-full px-3 py-1.5 text-left text-error hover:bg-error-container/20 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name & Domain */}
                <div>
                  <h4 className="font-headline text-lg font-bold text-on-surface mb-0.5">
                    {persona.name}
                  </h4>
                  <p className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                    {persona.domain}
                  </p>
                </div>

                {/* Tone tag */}
                <div className="mt-3">
                  <span className="px-2 py-0.5 rounded border border-border-subtle bg-surface-container-low font-mono text-[11px] text-primary">
                    #{persona.tone}
                  </span>
                </div>
              </div>

              {/* Bottom Autonomy bar */}
              <div className="pt-3 border-t border-border-subtle flex justify-between items-center text-xs">
                <span className="font-mono text-text-muted">Autonomy Mode</span>
                <span className="font-mono font-semibold text-on-surface flex items-center gap-1">
                  {persona.mode || 'Autonomous'}
                  <Zap className="w-3.5 h-3.5 text-primary" />
                </span>
              </div>
            </div>
          );
        })}

        {/* Create Persona Card matching Stitch */}
        <button
          onClick={openCreateModal}
          className="bg-surface-container border border-border-subtle border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-surface-variant hover:border-primary/50 transition-all group min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-lg bg-surface-container-low border border-border-subtle flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:border-primary/30 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h4 className="font-headline font-semibold text-on-surface text-base mb-0.5">
              Create Persona
            </h4>
            <p className="font-mono text-xs text-on-surface-variant">
              Deploy a new specialized AI agent
            </p>
          </div>
        </button>
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-low border border-border-subtle rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {editingPersona ? 'Edit Agent Persona' : 'Deploy New Agent Persona'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 font-body text-xs">
              <div>
                <label className="block text-on-surface font-mono font-medium mb-1">
                  Persona Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nexus-7, Tech-Scribe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-surface border border-border-subtle rounded-lg px-3 py-2 text-on-surface focus:border-primary focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-on-surface font-mono font-medium mb-1">
                  Specialized Domain
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Orchestrator, AI & Quantum Tech"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full bg-surface border border-border-subtle rounded-lg px-3 py-2 text-on-surface focus:border-primary focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-on-surface font-mono font-medium mb-1">
                  Writing Tone & Style
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Authoritative & Concise"
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full bg-surface border border-border-subtle rounded-lg px-3 py-2 text-on-surface focus:border-primary focus:outline-none font-mono mb-2"
                />
                <div className="flex flex-wrap gap-1.5">
                  {tonePresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFormData({ ...formData, tone: preset })}
                      className="px-2 py-0.5 bg-surface-variant hover:bg-primary-container/30 text-on-surface-variant text-[10px] font-mono rounded border border-border-subtle transition-colors"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-on-surface font-mono font-medium mb-1">
                  Autonomy Level
                </label>
                <select
                  value={formData.mode}
                  onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                  className="w-full bg-surface border border-border-subtle rounded-lg px-3 py-2 text-on-surface focus:border-primary focus:outline-none font-mono"
                >
                  <option value="autonomous">Full Autonomous</option>
                  <option value="semi-autonomous">Semi-Autonomous (Human Oversight)</option>
                  <option value="manual">Manual Approval Only</option>
                </select>
              </div>

              <div className="pt-4 border-t border-border-subtle flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-border-subtle rounded-lg font-mono text-on-surface hover:bg-surface-variant transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-mono font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingPersona ? 'Update Persona' : 'Deploy Persona'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
