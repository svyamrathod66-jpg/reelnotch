import React from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  TrendingUp,
  BarChart3,
  Calendar,
  Heart,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { WatchedReelRecord, PlatformId, InterestCategoryId } from '../types/reel';
import { PLATFORMS, CATEGORIES } from '../data/categories';

interface ReelAnalyticsViewProps {
  records: WatchedReelRecord[];
  totalWatchSeconds: number;
  totalReelCount: number;
  onResetSession: () => void;
  lovedCategories: Set<InterestCategoryId>;
}

export const ReelAnalyticsView: React.FC<ReelAnalyticsViewProps> = ({
  records,
  totalWatchSeconds,
  totalReelCount,
  onResetSession,
  lovedCategories,
}) => {
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  // Group by platform
  const platformStats: Record<PlatformId, { count: number; seconds: number }> = {
    instagram: { count: 0, seconds: 0 },
    facebook: { count: 0, seconds: 0 },
    snapchat: { count: 0, seconds: 0 },
  };

  // Group by category
  const categoryStats: Partial<Record<InterestCategoryId, { count: number; seconds: number }>> = {};

  records.forEach((r) => {
    if (platformStats[r.platform]) {
      platformStats[r.platform].count += 1;
      platformStats[r.platform].seconds += r.durationSeconds;
    }
    if (!categoryStats[r.category]) {
      categoryStats[r.category] = { count: 0, seconds: 0 };
    }
    categoryStats[r.category]!.count += 1;
    categoryStats[r.category]!.seconds += r.durationSeconds;
  });

  // Calculate Conscious Interest alignment
  const consciousCount = records.filter((r) => lovedCategories.has(r.category)).length;
  const consciousScore = records.length > 0 ? Math.round((consciousCount / records.length) * 100) : 100;

  const avgSeconds = totalReelCount > 0 ? Math.round(totalWatchSeconds / totalReelCount) : 0;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="text-xs font-mono text-slate-400 mb-1">Total Reels Watched</div>
          <div className="text-3xl font-display font-extrabold text-white font-mono tabular-nums">
            #{totalReelCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across 3 platforms</div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="text-xs font-mono text-slate-400 mb-1">Total Watch Time</div>
          <div className="text-3xl font-display font-extrabold text-white font-mono tabular-nums text-emerald-400">
            {formatTime(totalWatchSeconds)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Active screen duration</div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="text-xs font-mono text-slate-400 mb-1">Average Reel Dwell</div>
          <div className="text-3xl font-display font-extrabold text-white font-mono tabular-nums">
            {avgSeconds}s
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {avgSeconds < 15 ? 'Fast swipe velocity' : 'Deep watching rhythm'}
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="text-xs font-mono text-slate-400 mb-1">Conscious Reel Match</div>
          <div className="text-3xl font-display font-extrabold text-rose-400 font-mono tabular-nums">
            {consciousScore}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Matched your loved interests</div>
        </div>
      </div>

      {/* Platform Comparison Cards */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-white">Platform Breakdown</h3>
            <p className="text-xs text-slate-400">
              Reels count and elapsed watch time on Instagram, Facebook, and Snapchat.
            </p>
          </div>
          <button
            onClick={onResetSession}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset History</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['instagram', 'facebook', 'snapchat'] as PlatformId[]).map((pId) => {
            const p = PLATFORMS[pId];
            const stats = platformStats[pId];
            const percentOfReels =
              totalReelCount > 0 ? Math.round((stats.count / totalReelCount) * 100) : 0;

            return (
              <div
                key={pId}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: p.brandColor }}
                      />
                      <span className="font-bold text-sm text-white">{p.name}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{percentOfReels}%</span>
                  </div>

                  <div className="space-y-1 mb-4">
                    <div className="text-2xl font-bold font-mono text-white">
                      #{stats.count} <span className="text-xs font-sans text-slate-400 font-normal">reels</span>
                    </div>
                    <div className="text-xs font-mono text-emerald-400">
                      {formatTime(stats.seconds)} watch time
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentOfReels}%`,
                      backgroundColor: p.brandColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Watch Distribution */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="font-display font-bold text-lg text-white mb-1">
          Interest Distribution & Time Spent
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Compare how your attention was spent across educational, creative, and casual categories.
        </p>

        <div className="space-y-3">
          {(Object.keys(CATEGORIES) as InterestCategoryId[]).map((catId) => {
            const cat = CATEGORIES[catId];
            const stats = categoryStats[catId] || { count: 0, seconds: 0 };
            const percent = totalReelCount > 0 ? Math.round((stats.count / totalReelCount) * 100) : 0;
            const isLoved = lovedCategories.has(catId);

            if (stats.count === 0 && !isLoved) return null;

            return (
              <div key={catId} className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-semibold text-white">{cat.label}</span>
                    {isLoved && (
                      <span className="text-[10px] text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800/40">
                        Loved Niche
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 font-mono text-slate-400">
                    <span>#{stats.count} reels</span>
                    <span>{formatTime(stats.seconds)}</span>
                    <span className="font-bold text-white w-10 text-right">{percent}%</span>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Logged Reels Table / Stream */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="font-display font-bold text-lg text-white mb-1">Session Reel Stream</h3>
        <p className="text-xs text-slate-400 mb-4">
          Detailed reel-by-reel log with timestamps and dwell metrics.
        </p>

        {records.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No reels logged yet. Swipe reels in the Simulator or tap "+1 Reel" in Companion mode!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Platform</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Dwell Time</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {records
                  .slice(-8)
                  .reverse()
                  .map((r, index) => {
                    const p = PLATFORMS[r.platform];
                    const cat = CATEGORIES[r.category];
                    const isLoved = lovedCategories.has(r.category);

                    return (
                      <tr key={`${r.id || 'rec'}_${index}`} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-3 text-slate-400 font-bold">#{r.reelNumber}</td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1.5 font-sans font-medium text-slate-200">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: p.brandColor }}
                            />
                            <span>{p.name}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-sans text-slate-300">{cat?.label || r.category}</span>
                        </td>
                        <td className="py-2.5 px-3 text-emerald-400 tabular-nums">
                          {r.durationSeconds}s
                        </td>
                        <td className="py-2.5 px-3">
                          {isLoved ? (
                            <span className="font-sans text-[11px] text-rose-400 flex items-center gap-1">
                              <Heart className="w-3 h-3 fill-rose-400" /> Loved Niche
                            </span>
                          ) : (
                            <span className="font-sans text-[11px] text-slate-400">Regular</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
