import React from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  ThumbsUp,
  Ban,
  Sparkles,
  Sliders,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { InterestCategoryId, UserInterestPreference } from '../types/reel';
import { CATEGORIES } from '../data/categories';

interface InterestManagerProps {
  preferences: Record<InterestCategoryId, 'loved' | 'like' | 'neutral' | 'avoid'>;
  onSetPreference: (
    categoryId: InterestCategoryId,
    level: 'loved' | 'like' | 'neutral' | 'avoid'
  ) => void;
  onQuickPreset: (preset: 'deep_learning' | 'health_creator' | 'creative_arts') => void;
  onViewSuggestions: () => void;
}

export const InterestManager: React.FC<InterestManagerProps> = ({
  preferences,
  onSetPreference,
  onQuickPreset,
  onViewSuggestions,
}) => {
  const categoryIds = Object.keys(CATEGORIES) as InterestCategoryId[];

  const lovedCount = categoryIds.filter((id) => preferences[id] === 'loved').length;
  const likeCount = categoryIds.filter((id) => preferences[id] === 'like').length;
  const avoidCount = categoryIds.filter((id) => preferences[id] === 'avoid').length;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Header and Quick Presets */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold font-display text-white">
                Reel Interest & Preference Hub
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Tell ReelNotch what you love to see so our suggestion engine curates high-value feeds on Instagram, Facebook & Snapchat.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Quick Presets:</span>
            <button
              onClick={() => onQuickPreset('deep_learning')}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              Dev & Science
            </button>
            <button
              onClick={() => onQuickPreset('health_creator')}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              Fitness & Food
            </button>
            <button
              onClick={() => onQuickPreset('creative_arts')}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              Design & Travel
            </button>
          </div>
        </div>

        {/* Status Tracker Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-300">
                <strong>{lovedCount}</strong> Loved Topics
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-slate-300">
                <strong>{likeCount}</strong> Interested
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <span className="text-slate-300">
                <strong>{avoidCount}</strong> Avoided
              </span>
            </div>
          </div>

          <button
            onClick={onViewSuggestions}
            className="py-1.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Suggestions</span>
          </button>
        </div>
      </div>

      {/* Grid of All Interest Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryIds.map((catId) => {
          const cat = CATEGORIES[catId];
          const currentPref = preferences[catId] || 'neutral';

          return (
            <motion.div
              key={catId}
              layout
              className={`p-4 rounded-2xl border transition-all ${
                currentPref === 'loved'
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-sm shadow-rose-950/30'
                  : currentPref === 'like'
                  ? 'bg-blue-950/20 border-blue-500/40'
                  : currentPref === 'avoid'
                  ? 'bg-slate-950/40 border-slate-800/80 opacity-60'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-sm text-white">{cat.label}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="flex items-center gap-1.5 flex-wrap my-2.5">
                {cat.recommendedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[11px] font-mono text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded-md border border-slate-800"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              {/* 3-State Toggle Controls */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/60">
                <button
                  onClick={() =>
                    onSetPreference(catId, currentPref === 'loved' ? 'neutral' : 'loved')
                  }
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                    currentPref === 'loved'
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${currentPref === 'loved' ? 'fill-white' : ''}`} />
                  <span>Loved</span>
                </button>

                <button
                  onClick={() =>
                    onSetPreference(catId, currentPref === 'like' ? 'neutral' : 'like')
                  }
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                    currentPref === 'like'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Like</span>
                </button>

                <button
                  onClick={() =>
                    onSetPreference(catId, currentPref === 'avoid' ? 'neutral' : 'avoid')
                  }
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                    currentPref === 'avoid'
                      ? 'bg-slate-700 text-slate-200'
                      : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Avoid</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
