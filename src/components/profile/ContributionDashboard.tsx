import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, Database, Heart, Sparkles, TrendingUp, ShieldCheck, 
  HelpCircle, ChevronRight, Zap, Target, ArrowUpRight, Plus, RefreshCw
} from 'lucide-react';
import { ContributionSummary } from '../../types';

interface ContributionDashboardProps {
  summary: ContributionSummary;
  onOpenSubmitModal?: () => void;
  className?: string;
}

export const ContributionDashboard: React.FC<ContributionDashboardProps> = ({
  summary,
  onOpenSubmitModal,
  className = ''
}) => {
  const [showFormulaTooltip, setShowFormulaTooltip] = useState(false);

  // Percent of total points in formula
  const archiveShare = summary.formulaScore > 0 
    ? Math.round((summary.archiveWeightedScore / summary.formulaScore) * 100) 
    : 40;
  const likeShare = summary.formulaScore > 0 
    ? 100 - archiveShare 
    : 60;

  // Next level threshold calculation
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
                  社区贡献度仪表盘
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 font-semibold">
                  TOKEN METER UI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                实时计量档案考据补全与社区点赞认同 · 动态加权结算
              </p>
            </div>
          </div>
        </div>

        {/* Status Pills & Fast Action */}
        <div className="flex flex-wrap items-center gap-2 select-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] font-mono text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>实时结算中</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200/60 text-[11px] font-mono font-bold text-blue-700">
            <span>额度达成率: {summary.quotaPercent}%</span>
          </div>

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
                CURRENT TOTAL CONTRIBUTION / TOKEN USAGE
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
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-sky-700">
                  <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 shadow-xs" />
                  <span>档案补全 ({summary.archiveWeightedScore}分 · {archiveShare}%)</span>
                </span>
                <span className="flex items-center gap-1.5 text-blue-700">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 shadow-xs" />
                  <span>点赞认同 ({summary.likeWeightedScore}分 · {likeShare}%)</span>
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                阶梯额度: {summary.targetQuota}
              </span>
            </div>

            {/* Multi-segment Stacked Progress Bar Track */}
            <div className="relative w-full h-4 sm:h-5 rounded-xl bg-slate-100 overflow-hidden p-0.5 border border-slate-200/80 shadow-inner flex">
              {/* Segment 1: Archive Completeness weighted contribution */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(summary.archiveWeightedScore / summary.targetQuota) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-sky-400 to-sky-500 rounded-l-lg relative group cursor-pointer"
                title={`档案补全度得分: ${summary.archiveWeightedScore} 分`}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>

              {/* Segment 2: Likes weighted contribution */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(summary.likeWeightedScore / summary.targetQuota) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-r-lg relative group cursor-pointer"
                title={`被点赞总数得分: ${summary.likeWeightedScore} 分`}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
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

          {/* Level Advance Subtext */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50 text-slate-500">
            <span className="flex items-center gap-1 text-[11px]">
              <Target className="w-3.5 h-3.5 text-blue-500" />
              <span>距下一荣誉阶梯还需:</span>
              <strong className="font-mono text-slate-800">{pointsToNextLevel}</strong>
              <span>分</span>
            </span>
            <span className="text-[11px] font-mono text-blue-600 font-medium">
              累计加权结算完毕 ✓
            </span>
          </div>

        </div>

        {/* Right Col: Mathematical Formula Card */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-blue-200 tracking-wider">
                CALCULATION FORMULA SPEC
              </span>
              <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-md text-white">
                权重配比: 4:6
              </span>
            </div>

            <h4 className="text-sm font-bold font-editorial-mincho mt-1 text-white">
              社区贡献度计算公式
            </h4>

            {/* Formula Block */}
            <div className="mt-3 p-3 rounded-xl bg-black/25 border border-white/15 backdrop-blur-xs space-y-1.5 font-mono text-xs">
              <div className="text-sky-300 font-bold text-[11px]">
                贡献度 = (档案补全度 × 0.4) + (被点赞总数 × 0.6)
              </div>
              <div className="text-[10px] text-blue-200 border-t border-white/10 pt-1 flex items-center justify-between">
                <span>实时代入演算：</span>
                <span className="text-white font-bold">
                  ({summary.archiveCompleteness} × 0.4) + ({summary.totalLikesReceived} × 0.6)
                </span>
              </div>
              <div className="text-[10px] text-white/90 text-right font-bold">
                = {summary.archiveWeightedScore} + {summary.likeWeightedScore} = <span className="text-emerald-300 text-xs">{summary.formulaScore} 分</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-blue-100/90 leading-relaxed font-light bg-white/10 p-2.5 rounded-xl border border-white/10">
            每一条经社区检验的考据赋予 40% 的治学严谨度权重，读者的每一次点赞认可赋予 60% 的共鸣共振权重。
          </div>
        </div>

      </div>

      {/* 3. Sub-Dashboard: Dual Visual Progress Bars for Each Dimension */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        
        {/* Metric 1: 档案补全度进度条 */}
        <div className="rounded-2xl p-4 bg-slate-50/80 border border-slate-200/70 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                <Database className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 font-editorial-mincho">
                  档案补全度指标
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  权重系数: ×0.4 (40%)
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-extrabold font-mono text-sky-700">
                {summary.archiveCompleteness}%
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                贡献得分: +{summary.archiveWeightedScore} 分
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${summary.archiveCompleteness}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-sky-400 to-cyan-500 rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>已补全 {summary.archiveCount} 条核心考据</span>
              <span>基准达标率 {summary.archiveCompleteness}%</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-light pt-1 border-t border-slate-200/50 flex items-center justify-between">
            <span>算式: {summary.archiveCompleteness} × 0.4</span>
            <span className="font-mono font-bold text-sky-700">+{summary.archiveWeightedScore} 贡献分</span>
          </div>
        </div>

        {/* Metric 2: 获得的被点赞总数进度条 */}
        <div className="rounded-2xl p-4 bg-slate-50/80 border border-slate-200/70 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 fill-blue-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 font-editorial-mincho">
                  获得的被点赞总数
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  权重系数: ×0.6 (60%)
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-extrabold font-mono text-blue-700">
                {summary.totalLikesReceived} 次
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                贡献得分: +{summary.likeWeightedScore} 分
              </div>
            </div>
          </div>

          {/* Progress Bar (normalized to e.g. 200 likes benchmark) */}
          <div className="space-y-1">
            <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.round((summary.totalLikesReceived / 200) * 100))}%` }}
                transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>累计获得社区读者赞赏</span>
              <span>基准达标率 {Math.min(100, Math.round((summary.totalLikesReceived / 200) * 100))}%</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-light pt-1 border-t border-slate-200/50 flex items-center justify-between">
            <span>算式: {summary.totalLikesReceived} × 0.6</span>
            <span className="font-mono font-bold text-blue-700">+{summary.likeWeightedScore} 贡献分</span>
          </div>
        </div>

      </div>

    </div>
  );
};
