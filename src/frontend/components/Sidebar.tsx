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
  Sparkles,
  X
} from 'lucide-react';

export type ActiveTab = 'command' | 'personas' | 'pipeline' | 'logs' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
  onOpenTriggerModal?: () => void;
  activePersonaName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen = false,
  setMobileMenuOpen,
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

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    if (setMobileMenuOpen) setMobileMenuOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 select-none">
      <div>
        {/* Brand Logo Header */}
        <div className="px-2 py-3 mb-4 flex items-center justify-between border-b border-border-subtle/50 pb-4">
          <div className="flex items-center gap-3">
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

          {/* Close button for mobile menu */}
          {setMobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-variant"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Primary Nav List */}
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container shadow-md shadow-primary-container/30 font-semibold'
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
      <div className="space-y-4 pt-4 border-t border-border-subtle/50">
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
        {onOpenTriggerModal && (
          <button
            onClick={() => {
              onOpenTriggerModal();
              if (setMobileMenuOpen) setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 bg-primary text-background font-body text-xs font-semibold py-2.5 rounded-lg hover:opacity-95 active:scale-[0.98] transition-all shadow-md shadow-primary/10"
          >
            <Plus className="w-4 h-4" />
            <span>New Pipeline Run</span>
          </button>
        )}

        {/* Secondary Links */}
        <ul className="space-y-1">
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
              onClick={() => handleNavClick('settings')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>System Health</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar — Natural flex child, no overlap */}
      <aside className="hidden lg:flex bg-surface-container-low h-screen w-64 sticky top-0 shrink-0 border-r border-border-subtle flex-col z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
          ></div>
          <div className="relative bg-surface-container-low w-72 h-full shadow-2xl z-10 border-r border-border-subtle">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
