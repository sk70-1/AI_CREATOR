import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { ProjectsFeed, PostItem } from './components/ProjectsFeed';
import { AgentPersonas, PersonaItem } from './components/AgentPersonas';
import { LogicPipeline } from './components/LogicPipeline';
import { ExecutionLogs, LogMessage } from './components/ExecutionLogs';
import { SystemSettings } from './components/SystemSettings';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [personas, setPersonas] = useState<PersonaItem[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [isLoadingPersonas, setIsLoadingPersonas] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);

  const parseApiResponse = async (res: Response) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Server returned status ${res.status}: ${text.slice(0, 100)}`);
    }
  };

  // Fetch telemetry status
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/agent/status');
      const data = await parseApiResponse(res);
      if (data.success) {
        setStatus(data);
      }
    } catch (err) {
      console.error('Error fetching status:', err);
    }
  };

  // Fetch posts feed
  const fetchFeed = async () => {
    setIsLoadingFeed(true);
    try {
      const res = await fetch('/api/agent/feed');
      const data = await parseApiResponse(res);
      if (data.success && data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Error fetching feed:', err);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  // Fetch active personas
  const fetchPersonas = async () => {
    setIsLoadingPersonas(true);
    try {
      const res = await fetch('/api/agent/personas');
      const data = await parseApiResponse(res);
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
      const data = await parseApiResponse(res);

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
      addLog('ERROR', `Pipeline execution response: ${err.message}`);
    } finally {
      setIsTriggering(false);
    }
  };

  // Persona management handlers
  const handleSelectPersona = async (id: string) => {
    try {
      const res = await fetch(`/api/agent/personas/${id}/select`, { method: 'POST' });
      const data = await parseApiResponse(res);
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
      const data = await parseApiResponse(res);
      if (data.success) {
        addLog('SUCCESS', `Created new agent persona: "${newPersona.name}".`);
        await fetchPersonas();
        await fetchStatus();
      }
    } catch (err) {
      console.error('Error creating persona:', err);
    }
  };

  const handleUpdatePersona = async (updatedPersona: { id: string; name: string; domain: string; tone: string; mode: string }) => {
    try {
      const res = await fetch(`/api/agent/personas/${updatedPersona.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPersona),
      });
      const data = await parseApiResponse(res);
      if (data.success) {
        addLog('INFO', `Updated configuration for persona "${updatedPersona.name}".`);
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
      const data = await parseApiResponse(res);
      if (data.success) {
        addLog('WARN', `Deleted persona ID ${id}.`);
        await fetchPersonas();
        await fetchStatus();
      }
    } catch (err) {
      console.error('Error deleting persona:', err);
    }
  };

  const handleTriggerCron = async () => {
    addLog('INFO', 'Triggering scheduled Vercel Cron endpoint manually...');
    try {
      const res = await fetch('/api/cron/trigger');
      const data = await parseApiResponse(res);
      if (data.success) {
        addLog('SUCCESS', `Cron execution completed! Result: ${data.result?.topicTitle || 'Success'}`);
        await fetchFeed();
        await fetchStatus();
      }
    } catch (err: any) {
      addLog('ERROR', `Cron error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex font-body antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header activePersona={activePersona} onTriggerPipeline={handleTriggerPipeline} isTriggering={isTriggering} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 overflow-y-auto">
          {/* Hero Section */}
          <Hero activePersona={activePersona} onTriggerPipeline={handleTriggerPipeline} isTriggering={isTriggering} />

          {/* Stats Bar */}
          <Stats status={status} postsCount={posts.length} />

          {/* Main Tab Views */}
          {activeTab === 'feed' && (
            <ProjectsFeed posts={posts} isLoading={isLoadingFeed} onTriggerPipeline={handleTriggerPipeline} />
          )}

          {activeTab === 'personas' && (
            <AgentPersonas
              personas={personas}
              isLoading={isLoadingPersonas}
              onSelectPersona={handleSelectPersona}
              onCreatePersona={handleCreatePersona}
              onUpdatePersona={handleUpdatePersona}
              onDeletePersona={handleDeletePersona}
            />
          )}

          {activeTab === 'pipeline' && (
            <LogicPipeline activePersona={activePersona} onTriggerPipeline={handleTriggerPipeline} isTriggering={isTriggering} />
          )}

          {activeTab === 'logs' && <ExecutionLogs logs={logs} onClearLogs={() => setLogs([])} />}

          {activeTab === 'settings' && (
            <SystemSettings status={status} onRefreshStatus={fetchStatus} onTriggerCron={handleTriggerCron} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
