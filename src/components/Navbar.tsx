import React from 'react';
import { Sparkles, Smartphone, BarChart3, Sliders, PlayCircle } from 'lucide-react';

export type NavTab = 'simulator' | 'companion' | 'interests' | 'suggestions' | 'analytics';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  reelCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, reelCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single Wordmark */}
        <button
          onClick={() => onSelectTab('simulator')}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 font-display text-left"
        >
          <span>ReelNotch</span>
        </button>

        {/* Zone 2: 4–5 Single-Line Clean Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onSelectTab('simulator')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'simulator' ? 'text-white font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Reel Simulator
          </button>
          <button
            onClick={() => onSelectTab('companion')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'companion' ? 'text-white font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Companion HUD
          </button>
          <button
            onClick={() => onSelectTab('interests')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'interests' ? 'text-white font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Interests & Niches
          </button>
          <button
            onClick={() => onSelectTab('suggestions')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'suggestions' ? 'text-white font-semibold' : 'hover:text-slate-200'
            }`}
          >
            What You'll Love
          </button>
          <button
            onClick={() => onSelectTab('analytics')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'analytics' ? 'text-white font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Watch Analytics
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('suggestions')}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Reels</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Tab Bar (Strictly clean single line on mobile) */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-slate-900 bg-slate-950/90 gap-2 scrollbar-none text-xs">
        <button
          onClick={() => onSelectTab('simulator')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'simulator' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'
          }`}
        >
          Simulator
        </button>
        <button
          onClick={() => onSelectTab('companion')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'companion' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'
          }`}
        >
          Companion HUD
        </button>
        <button
          onClick={() => onSelectTab('interests')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'interests' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'
          }`}
        >
          Interests
        </button>
        <button
          onClick={() => onSelectTab('suggestions')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'suggestions' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'
          }`}
        >
          Suggestions
        </button>
        <button
          onClick={() => onSelectTab('analytics')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'analytics' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'
          }`}
        >
          Analytics
        </button>
      </div>
    </header>
  );
};
