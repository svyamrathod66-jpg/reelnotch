import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  Check,
  Compass,
  ArrowRight,
  TrendingUp,
  Flame,
  Bookmark,
  Share2,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { InterestCategoryId, PlatformId, ReelSuggestion } from '../types/reel';
import { CATEGORIES, PLATFORMS } from '../data/categories';
import { CURATED_SUGGESTIONS, SMART_SEARCH_PLATFORM_URLS } from '../data/suggestionsData';
import { generateSmartReelIdeas } from '../services/geminiSuggestions';
import { generateUniqueId } from '../utils/id';

interface ReelSuggestionsViewProps {
  lovedCategories: Set<InterestCategoryId>;
  currentPlatform: PlatformId;
  watchedCount: number;
  watchTimeSeconds: number;
}

export const ReelSuggestionsView: React.FC<ReelSuggestionsViewProps> = ({
  lovedCategories,
  currentPlatform,
  watchedCount,
  watchTimeSeconds,
}) => {
  const [selectedFilterPlatform, setSelectedFilterPlatform] = useState<PlatformId | 'all'>('all');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<InterestCategoryId | 'all'>('all');
  const [aiSuggestions, setAiSuggestions] = useState<ReelSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customMoodInput, setCustomMoodInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Combine curated suggestions + generated AI suggestions
  const allSuggestions = [...aiSuggestions, ...CURATED_SUGGESTIONS];

  // Filter based on loved interests, category filter, and platform filter
  const filteredSuggestions = allSuggestions.filter((item) => {
    // If user has specific filter selected
    if (activeCategoryFilter !== 'all' && item.category !== activeCategoryFilter) {
      return false;
    }
    // Filter by platform
    if (selectedFilterPlatform !== 'all' && !item.platforms.includes(selectedFilterPlatform)) {
      return false;
    }
    return true;
  });

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    const interests = Array.from(lovedCategories);
    if (interests.length === 0) {
      interests.push('tech_coding', 'fitness_health');
    }

    const results = await generateSmartReelIdeas({
      interests,
      currentMood: customMoodInput.trim() || 'Inspiring, creative, and educational reels',
      watchedCount,
    });

    if (results.length > 0) {
      setAiSuggestions(results);
    } else {
      // If offline/no key, synthesize custom dynamic smart recommendation from interest tags
      const topCategory = interests[0] || 'tech_coding';
      const cat = CATEGORIES[topCategory];
      const fallbackAi: ReelSuggestion = {
        id: generateUniqueId('sug'),
        title: `Curated ${cat.label} Masterclass & Trends`,
        category: topCategory,
        platforms: ['instagram', 'snapchat', 'facebook'],
        targetCreator: `@curated.${topCategory} / @mastery`,
        searchQuery: `${cat.recommendedKeywords[0]} best tips 2026`,
        hookDescription: `The counter-intuitive secret about ${cat.label} that 95% of creators never talk about.`,
        whyYouWillLoveIt: `Hand-selected based on your preference for ${cat.label}.`,
        estimatedDuration: '45s',
        hashtags: cat.recommendedKeywords,
      };
      setAiSuggestions([fallbackAi, ...aiSuggestions]);
    }
    setIsGenerating(false);
  };

  const handleCopyQuery = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Header & Smart Swap Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold font-display text-white">
                Reels You'll Love To See
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              High-value, inspiring reel recommendations curated for Instagram, Facebook, and Snapchat based on your verified interests.
            </p>
          </div>

          {/* Platform Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              onClick={() => setSelectedFilterPlatform('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedFilterPlatform === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Platforms
            </button>
            {(['instagram', 'facebook', 'snapchat'] as PlatformId[]).map((pId) => {
              const p = PLATFORMS[pId];
              const isActive = selectedFilterPlatform === pId;
              return (
                <button
                  key={pId}
                  onClick={() => setSelectedFilterPlatform(pId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: p.brandColor }}
                  />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Generator / Custom Vibe Search Box */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={customMoodInput}
              onChange={(e) => setCustomMoodInput(e.target.value)}
              placeholder="What vibe or skill are you craving right now? (e.g., Quick morning routine, AI coding, sourdough pasta...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/60"
            />
          </div>

          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="w-full sm:w-auto py-2.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all shrink-0"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Curating...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Generate Reel Ideas</span>
              </>
            )}
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 scrollbar-none">
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs whitespace-nowrap transition-all ${
              activeCategoryFilter === 'all'
                ? 'bg-white text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            All Topics ({allSuggestions.length})
          </button>
          {(Object.keys(CATEGORIES) as InterestCategoryId[]).map((catId) => {
            const cat = CATEGORIES[catId];
            const isLoved = lovedCategories.has(catId);
            const isSelected = activeCategoryFilter === catId;
            return (
              <button
                key={catId}
                onClick={() => setActiveCategoryFilter(catId)}
                className={`px-3 py-1 rounded-xl text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-slate-950 font-bold'
                    : isLoved
                    ? 'bg-rose-950/40 text-rose-300 border border-rose-800/40 hover:bg-rose-900/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span>{cat.label}</span>
                {isLoved && <span className="text-[10px] text-rose-400">★</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSuggestions.map((item) => {
          const categoryMeta = CATEGORIES[item.category] || CATEGORIES.tech_coding;
          const isLoved = lovedCategories.has(item.category);

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-lg flex flex-col justify-between transition-all"
            >
              <div>
                {/* Top Badge: Category & Supported Platforms */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: categoryMeta.color }}
                    />
                    <span className="text-xs font-semibold text-slate-300">
                      {categoryMeta.label}
                    </span>
                    {isLoved && (
                      <span className="text-[10px] font-medium text-rose-400 bg-rose-950/60 border border-rose-800/50 px-2 py-0.5 rounded-full">
                        Your Loved Niche
                      </span>
                    )}
                  </div>

                  {/* Platforms */}
                  <div className="flex items-center gap-1.5">
                    {item.platforms.map((pId) => (
                      <span
                        key={pId}
                        className="w-2.5 h-2.5 rounded-full ring-1 ring-white/10"
                        style={{ backgroundColor: PLATFORMS[pId].brandColor }}
                        title={`Watch on ${PLATFORMS[pId].name}`}
                      />
                    ))}
                    <span className="text-[11px] font-mono text-slate-400 ml-1">
                      {item.estimatedDuration}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-base text-white leading-snug mb-2">
                  {item.title}
                </h3>

                {/* Opening Hook / Description */}
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-3 text-xs text-slate-300 leading-relaxed">
                  <span className="text-slate-400 font-semibold block mb-1">
                    Opening Hook:
                  </span>
                  "{item.hookDescription}"
                </div>

                {/* Why You Will Love It */}
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  <strong className="text-slate-300">Why you'll love it:</strong>{' '}
                  {item.whyYouWillLoveIt}
                </p>

                {/* Target Creator and Hashtags */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pt-2 border-t border-slate-800/60">
                  <span className="truncate">Creator: <strong className="text-slate-200">{item.targetCreator}</strong></span>
                  <div className="flex items-center gap-1 text-[11px] text-sky-400/90 font-mono">
                    {item.hashtags.slice(0, 2).join(' ')}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Direct Deep Search on Instagram, Facebook, Snapchat */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => handleCopyQuery(item.id, item.searchQuery)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Search!</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Copy Search Query</span>
                    </>
                  )}
                </button>

                {/* Direct App Launch Links */}
                {item.platforms.map((pId) => {
                  const p = PLATFORMS[pId];
                  const url = SMART_SEARCH_PLATFORM_URLS[pId](item.searchQuery);
                  return (
                    <a
                      key={pId}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-xs font-medium text-white flex items-center gap-1 transition-colors"
                      title={`Search this reel on ${p.name}`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: p.brandColor }}
                      />
                      <span className="hidden sm:inline">{p.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
