import React from 'react';
import { Bot, Bell, Menu, X, Play } from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
  onTriggerPipeline: () => void;
  isTriggering: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen = false,
  setMobileMenuOpen,
  onTriggerPipeline,
  isTriggering,
}) => {
  return (
    <header className="lg:hidden flex justify-between items-center px-4 w-full h-16 bg-surface/90 backdrop-blur-xl border-b border-border-subtle sticky top-0 z-50 select-none">
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (typeof setMobileMenuOpen === 'function') {
              setMobileMenuOpen(!mobileMenuOpen);
            }
          }}
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-variant focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setActiveTab('command')}
        >
          <div className="w-7 h-7 rounded bg-primary-container flex items-center justify-center">
            <Bot className="w-4 h-4 text-on-primary-container" />
          </div>
          <span className="font-headline font-bold tracking-tight text-on-surface text-base">
            AURA AI
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('settings')}
          className="p-2 text-on-surface-variant hover:text-primary transition-colors"
          title="Status"
        >
          <Bell className="w-4 h-4" />
        </button>

        <button
          onClick={onTriggerPipeline}
          disabled={isTriggering}
          className="bg-primary-container text-on-primary-container px-3 py-1.5 rounded-lg font-mono text-xs font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isTriggering ? 'Running...' : 'Deploy'}</span>
        </button>
      </div>
    </header>
  );
};
