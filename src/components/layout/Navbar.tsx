import React from 'react';
import {
  Layers,
  Split,
  Compass,
  Cpu,
  Network,
  BookOpen,
  Binary,
} from 'lucide-react';

export type ActiveTab = 'sorting' | 'race' | 'pathfinding' | 'scheduling' | 'graph' | 'reference';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'sorting', label: 'Sorting Arena', icon: Layers },
    { id: 'race', label: 'Algorithm Race', icon: Split },
    { id: 'pathfinding', label: 'Pathfinding Lab', icon: Compass },
    { id: 'scheduling', label: 'CPU Scheduler', icon: Cpu },
    { id: 'graph', label: 'Graph Explorer', icon: Network },
    { id: 'reference', label: 'Complexity Matrix', icon: BookOpen },
  ];

  return (
    <header className="w-full bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4 h-16">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xs bg-slate-900 border border-slate-700 flex items-center justify-center text-sky-400">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-100 text-sm tracking-widest">
                ALGO NEXUS
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded-xs border border-slate-800">
                v1.0
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">
              Algorithm Visualization & Analysis Platform
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider transition-colors border ${
                  isActive
                    ? 'bg-slate-900 border-sky-400 text-sky-300 font-semibold'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Engine Status indicator */}
        <div className="hidden lg:flex items-center gap-2 font-mono text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-sm border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>DETERMINISTIC V8 ENGINE</span>
        </div>
      </div>
    </header>
  );
};
