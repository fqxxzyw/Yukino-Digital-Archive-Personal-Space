import React from 'react';
import { motion } from 'motion/react';
import { 
  Award, Database, Heart, Sparkles, TrendingUp, ShieldCheck, 
  HelpCircle, ChevronRight, Zap, Target, ArrowUpRight, Plus, Eye, Bookmark, Shield, AlertTriangle
} from 'lucide-react';
import { ContributionSummary } from '../../types';

interface ContributionDashboardProps {
  summary: ContributionSummary;
  onOpenSubmitModal?: () => void;
  onAutoPromote?: () => void;
  className?: string;
}

export const ContributionDashboard: React.FC<ContributionDashboardProps> = ({
  summary,
  onOpenSubmitModal,
  onAutoPromote,
  className = ''
}) => {
  const pointsToNextLevel = Math.max(0, Number((summary.targetQuota - summary.formulaScore).toFixed(1)));

  return (
    <div className={`rounded-3xl p-5 sm:p-7 bg-white border border-slate-200/80 shadow-xs space-y-6 relative overflow-hidden ${className}`}>
      
      {/* Background Subtle Tech Watermark */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/60 via-sky-50/20 to-transparent rounded-full -mr-32 -mt-32 pointer-events-none" />

      {/* 1. Header Zone: Token Quota & Usage Title + Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-editorial-mincho">
                  社区贡献度与治理仪表盘
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 font-semibold">
                  TOKEN QUOTA METER
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                严密权重比：浏览千分之一 (0.001) · 点赞百分之一 (0.01) · 收藏百分之二 (0.02) · 考据采纳加成
              </p>
            </div>
          </div>
        </div>

        {/* Status Pills & Fast Action */}
        <div className="flex flex-wrap items-center gap-2 select-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200/60 text-[11px] font-mono font-bold text-blue-700">
            <span>额度达成率: {summary.quotaPercent}%</span>
          </div>

          {summary.canAutoPromoteToAdmin && onAutoPromote && (
            <button
              type="button"
              onClick={onAutoPromote}
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all animate-pulse"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>免审荣任管理员</span>
            </button>
          )}

          {onOpenSubmitModal && (
            <button
              type="button"
              onClick={onOpenSubmitModal}
              className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>补全词条</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Hero Quota & Main Metric Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative z-10 items-stretch">
        
        {/* Left 2 Cols: Main Quota Progress Bar (Token-style Stacked Gauge) */}
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-slate-50/90 via-blue-50/30 to-white p-5 border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                CURRENT TOTAL REPUTATION & CONTRIBUTION SCORE
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tracking-tight">
                  {summary.formulaScore}
                </span>
                <span className="text-sm font-mono text-slate-400">
                  / {summary.targetQuota} pts 额度上限
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-blue-100/80 text-blue-800 ml-1">
                  {summary.quotaPercent}%
                </span>
              </div>
            </div>

            {/* Level Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <Award className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-[10px] text-slate-400 font-mono">当前荣誉称号</div>
                <div className="text-xs font-bold text-slate-800 font-editorial-mincho">
                  {summary.levelTitle} · Lv.{summary.level}
                </div>
              </div>
            </div>
          </div>

          {/* Main Token Stacked Visual Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-sky-700">
                  <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 shadow-xs" />
                  <span>档案完备 ({Number((summary.archiveCompleteness * 0.4).toFixed(1))}分)</span>
                </span>
                <span className="flex items-center gap-1 text-blue-700">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 shadow-xs" />
                  <span>互动加权 ({Number((summary.viewWeightedScore + summary.likeWeightedScore + summary.favoriteWeightedScore).toFixed(2))}分)</span>
                </span>
                <span className="flex items-center gap-1 text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 shadow-xs" />
                  <span>采纳修订 (+{summary.approvedEditsBonus}分)</span>
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                阶梯额度: {summary.targetQuota}
              </span>
            </div>

            {/* Multi-segment Stacked Progress Bar Track */}
            <div className="relative w-full h-4 sm:h-5 rounded-xl bg-slate-100 overflow-hidden p-0.5 border border-slate-200/80 shadow-inner flex">
              {/* Segment 1: Archive Completeness */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((summary.archiveCompleteness * 0.4) / summary.targetQuota) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-sky-400 to-sky-500 rounded-l-lg relative group cursor-pointer"
                title={`档案补全度得分: ${(summary.archiveCompleteness * 0.4).toFixed(1)} 分`}
              />

              {/* Segment 2: Interactive Engagement (Views + Likes + Favorites) */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((summary.viewWeightedScore + summary.likeWeightedScore + summary.favoriteWeightedScore) / summary.targetQuota) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 relative group cursor-pointer"
                title={`互动沉淀得分: ${(summary.viewWeightedScore + summary.likeWeightedScore + summary.favoriteWeightedScore).toFixed(2)} 分`}
              />

              {/* Segment 3: Approved Chronicle Edits */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(summary.approvedEditsBonus / summary.targetQuota) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-r-lg relative group cursor-pointer"
                title={`成功采纳修改奖励: ${summary.approvedEditsBonus} 分`}
              />
            </div>

            {/* Milestone Ruler Ticks */}
            <div className="flex justify-between text-[10px] font-mono text-slate-400 px-0.5 pt-0.5">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span className="font-bold text-slate-600">100% 满额晋级</span>
            </div>
          </div>

          {/* Level Advance Subtext & Admin Promotion Status */}
          <div className="flex flex-wrap items-center justify-between text-xs pt-1 border-t border-slate-200/50 text-slate-500 gap-2">
            <span className="flex items-center gap-1 text-[11px]">
              <Target className="w-3.5 h-3.5 text-blue-500" />
              <span>距下一荣誉阶梯还需:</span>
              <strong className="font-mono text-slate-800">{pointsToNextLevel}</strong>
              <span>分</span>
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-600">
                已成功被采纳编年史修改: <strong className="text-amber-700 font-bold">{summary.approvedEditsCount}</strong> / 3 篇
              </span>
              {summary.canAutoPromoteToAdmin ? (
                <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  ✓ 已达成免审直通管理员资格
                </span>
              ) : (
                <span className="text-[10px] font-mono text-slate-400">
                  (满3篇且评分达标可免审荣任管理员)
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Right Col: Mathematical Formula Card */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-blue-200 tracking-wider">
                ENGAGEMENT WEIGHT FORMULA
              </span>
              <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-md text-white">
                科学防刷单
              </span>
            </div>

            <h4 className="text-sm font-bold font-editorial-mincho mt-1 text-white">
              精细化加权计算模型
            </h4>

            {/* Formula Block */}
            <div className="mt-3 p-3 rounded-xl bg-black/25 border border-white/15 backdrop-blur-xs space-y-1.5 font-mono text-xs">
              <div className="text-sky-300 font-bold text-[11px] leading-tight">
                贡献度 = (档案度×40%) + (浏览×0.001) + (点赞×0.01) + (收藏×0.02) + (采纳×25)
              </div>
              <div className="text-[10px] text-blue-200 border-t border-white/10 pt-1 flex items-center justify-between">
                <span>实时代入演算：</span>
                <span className="text-white font-bold">
                  ({summary.archiveCompleteness}×0.4) + ({summary.totalViewsReceived}×0.001) + ({summary.totalLikesReceived}×0.01) + ({summary.totalFavoritesReceived}×0.02) + ({summary.approvedEditsCount}×25)
                </span>
              </div>
              <div className="text-[10px] text-white/90 text-right font-bold">
                = {(summary.archiveCompleteness * 0.4).toFixed(1)} + {summary.viewWeightedScore} + {summary.likeWeightedScore} + {summary.favoriteWeightedScore} + {summary.approvedEditsBonus} = <span className="text-emerald-300 text-xs font-mono">{summary.formulaScore} 分</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-blue-100/90 leading-relaxed font-light bg-white/10 p-2.5 rounded-xl border border-white/10">
            <strong>治理公约：</strong>浏览权重设为千分之一 (0.001)，点赞设为百分之一 (0.01)，收藏设为百分之二 (0.02)。管理员直撰无需申请，但若遭遇反对票 (👎 ≥ 5) 将直接撤回管理员特权。
          </div>
        </div>

      </div>

      {/* 3. Sub-Dashboard: Three Dimension Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        
        {/* Metric 1: 浏览量 (0.001) */}
        <div className="rounded-2xl p-4 bg-slate-50/80 border border-slate-200/70 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                <Eye className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-800 font-editorial-mincho">
                浏览量权重
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
              千分之一 (0.001)
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-base font-extrabold font-mono text-slate-900">
              {summary.totalViewsReceived} 次浏览
            </span>
            <span className="text-xs font-mono font-bold text-sky-700">
              +{summary.viewWeightedScore} 分
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full w-[70%]" />
          </div>
        </div>

        {/* Metric 2: 点赞量 (0.01) */}
        <div className="rounded-2xl p-4 bg-slate-50/80 border border-slate-200/70 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 fill-blue-500" />
              </div>
              <span className="text-xs font-bold text-slate-800 font-editorial-mincho">
                点赞量权重
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              百分之一 (0.01)
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-base font-extrabold font-mono text-slate-900">
              {summary.totalLikesReceived} 次认同
            </span>
            <span className="text-xs font-mono font-bold text-blue-700">
              +{summary.likeWeightedScore} 分
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full w-[55%]" />
          </div>
        </div>

        {/* Metric 3: 收藏量 (0.02) */}
        <div className="rounded-2xl p-4 bg-slate-50/80 border border-slate-200/70 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Bookmark className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-800 font-editorial-mincho">
                收藏量权重
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              百分之二 (0.02)
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-base font-extrabold font-mono text-slate-900">
              {summary.totalFavoritesReceived} 次珍藏
            </span>
            <span className="text-xs font-mono font-bold text-indigo-700">
              +{summary.favoriteWeightedScore} 分
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full w-[65%]" />
          </div>
        </div>

      </div>

    </div>
  );
};
