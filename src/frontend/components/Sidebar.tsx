import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  GitFork, 
  FileText, 
  Settings, 
  Plus, 
  BookOpen, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

export type ActiveTab = 'command' | 'personas' | 'pipeline' | 'logs' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenTriggerModal?: () => void;
  activePersonaName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenTriggerModal,
  activePersonaName = 'Nexus-7',
}) => {
  const navItems = [
    { id: 'command' as ActiveTab, label: 'Command Center', icon: LayoutDashboard },
    { id: 'personas' as ActiveTab, label: 'Agent Personas', icon: Bot },
    { id: 'pipeline' as ActiveTab, label: 'Logic Pipeline', icon: GitFork },
    { id: 'logs' as ActiveTab, label: 'Execution Logs', icon: FileText },
    { id: 'settings' as ActiveTab, label: 'System Settings', icon: Settings },
  ];

  return (
    <nav className="hidden md:flex bg-surface-container-low h-screen w-64 fixed left-0 top-0 z-40 border-r border-border-subtle flex-col p-stack-md justify-between select-none">
      <div>
        {/* Brand Logo Header */}
        <div className="px-3 py-4 mb-stack-md flex items-center gap-3 border-b border-border-subtle/50 pb-4">
          <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center shadow-lg shadow-primary-container/20">
            <Bot className="w-5 h-5 text-on-primary-container" />
          </div>
          <div>
            <h1 className="font-headline text-lg font-bold tracking-tight text-on-surface flex items-center gap-1.5">
              AURA AI
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h1>
            <p className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider opacity-80">
              Enterprise OS
            </p>
          </div>
        </div>

        {/* Primary Nav List */}
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container shadow-md shadow-primary-container/30'
                      : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-on-primary-container' : 'text-on-surface-variant'}`} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer & Actions */}
      <div className="space-y-4">
        {/* Active Persona Badge Banner */}
        <div className="bg-surface-container border border-border-subtle p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <div className="truncate">
              <p className="text-[10px] uppercase font-mono text-text-muted">Active Agent</p>
              <p className="text-xs font-semibold text-on-surface truncate">{activePersonaName}</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
        </div>

        {/* New Pipeline Trigger Button */}
        <button
          onClick={onOpenTriggerModal}
          className="w-full flex items-center justify-center gap-2 bg-primary text-background font-body text-xs font-semibold py-2.5 rounded-lg hover:opacity-95 active:scale-[0.98] transition-all shadow-md shadow-primary/10"
        >
          <Plus className="w-4 h-4" />
          <span>New Pipeline Run</span>
        </button>

        {/* Secondary Links */}
        <ul className="space-y-1 pt-2 border-t border-border-subtle/50">
          <li>
            <a
              href="https://github.com/sk70-1/AI_CREATOR#readme"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Documentation</span>
            </a>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('settings')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>System Health</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
