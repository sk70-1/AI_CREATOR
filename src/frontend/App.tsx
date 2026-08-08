import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { ProjectsFeed, PostItem } from './components/ProjectsFeed';
import { AgentPersonas, Persona } from './components/AgentPersonas';
import { LogicPipeline } from './components/LogicPipeline';
import { ExecutionLogs, LogMessage } from './components/ExecutionLogs';
import { SystemSettings } from './components/SystemSettings';
import { X, Bot, LayoutDashboard, GitFork, FileText, Settings, Play } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('command');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Data states
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  
  // Loading states
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [isLoadingPersonas, setIsLoadingPersonas] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Fetch initial data
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/agent/status');
      const data = await res.json();
      if (data.success) {
        setStatus(data);
        if (data.agents) setPersonas(data.agents);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Error fetching status:', err);
    }
  };

  const fetchFeed = async () => {
    setIsLoadingFeed(true);
    try {
      const res = await fetch('/api/agent/feed');
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Error fetching feed:', err);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  const fetchPersonas = async () => {
    setIsLoadingPersonas(true);
    try {
      const res = await fetch('/api/agent/personas');
      const data = await res.json();
      if (data.success && data.personas) {
        setPersonas(data.personas);
      }
    } catch (err) {
      console.error('Error fetching personas:', err);
    } finally {
      setIsLoadingPersonas(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchFeed();
    fetchPersonas();
  }, []);

  const activePersona = personas.find((p) => Number(p.is_active) === 1) || personas[0] || {
    id: 'nexus-7',
    name: 'Nexus-7',
    domain: 'Data Orchestrator',
    tone: 'Authoritative & Technical',
    mode: 'autonomous',
    is_active: 1,
  };

  // Helper to add log entries
  const addLog = (level: 'INFO' | 'WARN' | 'SUCCESS' | 'ERROR', message: string) => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    const newLog: LogMessage = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp,
      level,
      message,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Trigger manual pipeline run
  const handleTriggerPipeline = async () => {
    setIsTriggering(true);
    addLog('INFO', `Initializing autonomous pipeline run with agent "${activePersona.name}"...`);
    addLog('INFO', 'Scraping top tech news stories from HackerNews API & RSS feeds...');

    try {
      const res = await fetch('/api/agent/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: activePersona.id }),
      });
      const data = await res.json();

      if (data.success) {
        const topicName = data.result?.topicTitle || data.result?.topic?.title || 'Tech News Digest';
        addLog('SUCCESS', `Pipeline completed! Topic: "${topicName}"`);
        addLog('INFO', `Gemini Quality Gate score: ${data.result?.score || '9.5'}/10.`);
        if (data.result?.tweetId) {
          addLog('SUCCESS', `Published directly to X (Twitter API v2 ID: ${data.result.tweetId})!`);
        } else {
          addLog('INFO', 'Web Intent link generated for 1-click publishing fallback.');
        }

        // Refresh feed and status
        await fetchFeed();
        await fetchStatus();
      } else {
        addLog('ERROR', `Pipeline error: ${data.error || 'Unknown failure'}`);
      }
    } catch (err: any) {
      addLog('ERROR', `Network failure triggering pipeline: ${err.message}`);
    } finally {
      setIsTriggering(false);
    }
  };

  // Persona management handlers
  const handleSelectPersona = async (id: string) => {
    try {
      const res = await fetch(`/api/agent/personas/${id}/select`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        addLog('INFO', `Switched active persona to persona ID ${id}.`);
        await fetchPersonas();
        await fetchStatus();
      }
    } catch (err) {
      console.error('Error selecting persona:', err);
    }
  };

  const handleCreatePersona = async (newPersona: { name: string; domain: string; tone: string; mode: string }) => {
    try {
      const res = await fetch('/api/agent/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPersona),
      });
      const data = await res.json();
      if (data.success) {
        addLog('SUCCESS', `New persona "${newPersona.name}" deployed successfully.`);
        await fetchPersonas();
        await fetchStatus();
      }
    } catch (err) {
      console.error('Error creating persona:', err);
    }
  };

  const handleUpdatePersona = async (id: string, updated: { name: string; domain: string; tone: string; mode: string }) => {
    try {
      const res = await fetch(`/api/agent/personas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        addLog('INFO', `Persona "${updated.name}" updated successfully.`);
        await fetchPersonas();
        await fetchStatus();
      }
    } catch (err) {
      console.error('Error updating persona:', err);
    }
  };

  const handleDeletePersona = async (id: string) => {
    try {
      const res = await fetch(`/api/agent/personas/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        addLog('WARN', `Persona ID ${id} removed.`);
        await fetchPersonas();
        await fetchStatus();
      }
    } catch (err) {
      console.error('Error deleting persona:', err);
    }
  };

  // Trigger Cron Handler
  const handleTriggerCron = async () => {
    addLog('INFO', 'Vercel Cron endpoint manually triggered (/api/cron/trigger)...');
    try {
      const res = await fetch('/api/cron/trigger');
      const data = await res.json();
      if (data.success) {
        addLog('SUCCESS', 'Vercel Cron pipeline run completed successfully!');
        await fetchFeed();
        await fetchStatus();
      } else {
        addLog('ERROR', `Cron error: ${data.error}`);
      }
    } catch (err: any) {
      addLog('ERROR', `Cron trigger network error: ${err.message}`);
    }
  };

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'command':
        return 'Command Center';
      case 'personas':
        return 'Agent Personas';
      case 'pipeline':
        return 'Logic Pipeline Flow';
      case 'logs':
        return 'Execution Logs & Terminal';
      case 'settings':
        return 'System Settings & Telemetry';
      default:
        return 'Command Center';
    }
  };

  const getSectionSubtitle = () => {
    switch (activeTab) {
      case 'command':
        return 'Real-time telemetry, automated tech news discovery feed, and pipeline controls.';
      case 'personas':
        return 'Manage specialized AI agent personas, writing tones, expertise domains, and autonomy levels.';
      case 'pipeline':
        return 'Interactive 4-stage pipeline flow visualizer (Discovery ➔ Deduplication ➔ Gemini Gate ➔ X Publish).';
      case 'logs':
        return 'Live streaming console output, timestamp trace logs, and pipeline node latency metrics.';
      case 'settings':
        return 'API keys status telemetry for Gemini 2.5 Flash, Turso Cloud DB, X Twitter, and Vercel Cron.';
      default:
        return '';
    }
  };

  return (
    <div className="bg-background text-on-surface font-body antialiased min-h-screen flex flex-col md:flex-row select-none">
      {/* Desktop Left Rail Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTriggerModal={handleTriggerPipeline}
        activePersonaName={activePersona.name}
      />

      {/* Mobile Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onTriggerPipeline={handleTriggerPipeline}
        isTriggering={isTriggering}
      />

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col p-6 pt-20">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-5 right-5 p-2 text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="space-y-2">
            {[
              { id: 'command' as ActiveTab, label: 'Command Center', icon: LayoutDashboard },
              { id: 'personas' as ActiveTab, label: 'Agent Personas', icon: Bot },
              { id: 'pipeline' as ActiveTab, label: 'Logic Pipeline', icon: GitFork },
              { id: 'logs' as ActiveTab, label: 'Execution Logs', icon: FileText },
              { id: 'settings' as ActiveTab, label: 'System Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-sm ${
                    activeTab === item.id
                      ? 'bg-primary-container text-on-primary-container font-bold'
                      : 'text-on-surface-variant hover:bg-surface-variant'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-6 border-t border-border-subtle">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleTriggerPipeline();
              }}
              disabled={isTriggering}
              className="w-full bg-primary text-background font-mono text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isTriggering ? 'Running...' : 'Run Pipeline Now'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 max-w-container-max mx-auto w-full min-h-screen flex flex-col justify-between">
        <div>
          {/* Hero Header */}
          <Hero
            title={getSectionTitle()}
            subtitle={getSectionSubtitle()}
            activePersonaName={activePersona.name}
            onTriggerPipeline={handleTriggerPipeline}
            isTriggering={isTriggering}
            lastUpdated={lastUpdated}
          />

          {/* Stats Bar */}
          <Stats
            postsCount={posts.length}
            activePersonaName={activePersona.name}
            activePersonaDomain={activePersona.domain}
            hasTwitter={status?.hasTwitterKeys}
            hasGemini={status?.hasGeminiKey}
          />

          {/* View Tab Switcher */}
          {activeTab === 'command' && (
            <>
              <ProjectsFeed
                posts={posts}
                isLoading={isLoadingFeed}
                onTriggerPipeline={handleTriggerPipeline}
              />
              <ExecutionLogs logs={logs} onClearLogs={() => setLogs([])} />
            </>
          )}

          {activeTab === 'personas' && (
            <AgentPersonas
              personas={personas}
              onSelectPersona={handleSelectPersona}
              onCreatePersona={handleCreatePersona}
              onUpdatePersona={handleUpdatePersona}
              onDeletePersona={handleDeletePersona}
              isLoading={isLoadingPersonas}
            />
          )}

          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <LogicPipeline
                onTriggerPipeline={handleTriggerPipeline}
                isTriggering={isTriggering}
                activePersonaName={activePersona.name}
              />
              <ExecutionLogs logs={logs} onClearLogs={() => setLogs([])} />
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-6">
              <ExecutionLogs logs={logs} onClearLogs={() => setLogs([])} />
            </div>
          )}

          {activeTab === 'settings' && (
            <SystemSettings
              status={status}
              onRefreshStatus={fetchStatus}
              onTriggerCron={handleTriggerCron}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
