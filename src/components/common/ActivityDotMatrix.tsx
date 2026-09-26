import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, TrendingUp, Info } from 'lucide-react';

export type ActivityViewMode = 'daily' | 'weekly' | 'cumulative';

export interface ActivityMatrixItem {
  id: string;
  date: string; // ISO date string 'YYYY-MM-DD'
  value: number; // raw value (e.g. 1 diary, or 50 contribution points)
  color?: string; // color for the dots in this column
  label?: string; // e.g. "真物探寻" or "档案补全"
  title?: string; // e.g. diary title or contribution title
  secondaryValue?: number; // e.g. likes received
  meta?: any;
}

interface ActivityDotMatrixProps {
  title: string;
  subtitle?: string;
  items: ActivityMatrixItem[];
  defaultMode?: ActivityViewMode;
  emptyDotColor?: string;
  defaultFilledColor?: string;
  maxLevels?: number; // Default 8 (as in the screenshot)
  monthsCount?: number; // Default 12 months (e.g. 10月 -> 9月)
  className?: string;
  showLegend?: boolean;
  legendItems?: { label: string; color: string }[];
  summarySlot?: React.ReactNode;
}

export const ActivityDotMatrix: React.FC<ActivityDotMatrixProps> = ({
  title,
  subtitle,
  items,
  defaultMode = 'cumulative',
  emptyDotColor = 'bg-slate-100 hover:bg-slate-200/80',
  defaultFilledColor = '#3b82f6',
  maxLevels = 8,
  className = '',
  showLegend = false,
  legendItems = [],
  summarySlot
}) => {
  const [mode, setMode] = useState<ActivityViewMode>(defaultMode);
  const [hoveredColIndex, setHoveredColIndex] = useState<number | null>(null);

  // Generate 12 months columns ending at current month (e.g. Oct -> Sept)
  // Around 48 columns (approx 4 weeks per month for 12 months, mirroring the screenshot)
  const columns = useMemo(() => {
    const totalCols = 44; // Closely matches the user's screenshot width
    const cols = [];
    
    // Create rolling 12 month time intervals
    const now = new Date('2026-09-25T20:00:00Z');
    const startDate = new Date(now);
    startDate.setMonth(now.getMonth() - 11);
    startDate.setDate(1);

    const stepMs = (now.getTime() - startDate.getTime()) / (totalCols - 1);

    for (let i = 0; i < totalCols; i++) {
      const colDate = new Date(startDate.getTime() + i * stepMs);
      const colStartMs = colDate.getTime() - stepMs / 2;
      const colEndMs = colDate.getTime() + stepMs / 2;

      // Filter matching items in this time window
      const matched = items.filter(it => {
        const itMs = new Date(it.date).getTime();
        return itMs >= colStartMs && itMs <= colEndMs;
      });

      const totalVal = matched.reduce((sum, it) => sum + (it.value || 1), 0);
      const dominantItem = matched[matched.length - 1]; // Latest item in period
      const dominantColor = dominantItem?.color || defaultFilledColor;

      cols.push({
        index: i,
        date: colDate,
        dateStr: colDate.toISOString().split('T')[0],
        month: colDate.getMonth() + 1,
        items: matched,
        totalVal,
        color: dominantColor,
        dominantItem
      });
    }

    // Compute filled dots level (1 to 8) based on mode
    let cumulativeSum = 0;
    const allTotalSum = cols.reduce((acc, c) => acc + c.totalVal, 0) || 1;
    const maxPeriodVal = Math.max(...cols.map(c => c.totalVal), 1);

    return cols.map((col, idx) => {
      cumulativeSum += col.totalVal;

      let level = 0;
      if (mode === 'cumulative') {
        if (cumulativeSum > 0) {
          // Monotonically climbing steps like in screenshot (from ~1 up to maxLevels)
          const ratio = cumulativeSum / allTotalSum;
          level = Math.min(maxLevels, Math.max(1, Math.round(ratio * maxLevels)));
        } else {
          level = 0;
        }
      } else if (mode === 'weekly' || mode === 'daily') {
        if (col.totalVal > 0) {
          const ratio = col.totalVal / maxPeriodVal;
          level = Math.min(maxLevels, Math.max(1, Math.round(ratio * maxLevels)));
        } else {
          level = 0;
        }
      }

      return {
        ...col,
        level,
        cumulativeAtPoint: cumulativeSum
      };
    });
  }, [items, mode, maxLevels, defaultFilledColor]);

  // Distinct Month Markers for X-axis labels
  const monthLabels = useMemo(() => {
    const labels: { colIndex: number; monthName: string }[] = [];
    let lastMonth = -1;

    columns.forEach((col, idx) => {
      if (col.month !== lastMonth) {
        lastMonth = col.month;
        labels.push({
          colIndex: idx,
          monthName: `${col.month}月`
        });
      }
    });

    return labels;
  }, [columns]);

  return (
    <div className={`rounded-3xl p-5 sm:p-6 bg-white border border-slate-200/80 shadow-xs space-y-4 ${className}`}>
      
      {/* 1. Header with Title & Top-Right View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-editorial-mincho">
              {title}
            </h3>
            {subtitle && (
              <span className="text-xs text-slate-400 font-sans hidden sm:inline">
                {subtitle}
              </span>
            )}
          </div>
          {summarySlot && <div className="mt-1">{summarySlot}</div>}
        </div>

        {/* View Switcher: 每日 | 每周 | 累计 (Matches the user's screenshot with the blue outline box) */}
        <div className="flex items-center gap-2 self-start sm:self-auto select-none">
          <div className="inline-flex items-center gap-1 text-xs">
            {(['daily', 'weekly', 'cumulative'] as const).map((m) => {
              const labelMap = { daily: '每日', weekly: '每周', cumulative: '累计' };
              const isActive = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-2 py-0.5 text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'border-2 border-[#1677ff] text-[#1677ff] font-bold rounded-[3px] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 border-2 border-transparent px-2 py-0.5'
                  }`}
                >
                  {labelMap[m]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Dot Matrix Canvas */}
      <div className="relative pt-2 pb-1 overflow-x-auto no-scrollbar">
        <div className="min-w-[560px] select-none">
          
          {/* Columns Matrix Container */}
          <div className="flex items-end justify-between gap-[3px] sm:gap-[5px] h-[120px] pb-2">
            {columns.map((col) => {
              const isHovered = hoveredColIndex === col.index;
              const colColor = col.items.length > 0 ? col.color : defaultFilledColor;

              return (
                <div
                  key={col.index}
                  onMouseEnter={() => setHoveredColIndex(col.index)}
                  onMouseLeave={() => setHoveredColIndex(null)}
                  className="flex-1 flex flex-col items-center justify-end gap-[4px] sm:gap-[5px] h-full cursor-pointer relative group/col py-1"
                >
                  {/* Vertical stack of 8 dots (from top row [maxLevels-1] down to bottom row [0]) */}
                  {Array.from({ length: maxLevels }).map((_, rowIdx) => {
                    // rowIdx 0 is top dot, rowIdx 7 is bottom dot
                    // A level of 4 means bottom 4 dots are filled (rowIdx 4,5,6,7)
                    const dotIndexFromBottom = maxLevels - 1 - rowIdx;
                    const isFilled = dotIndexFromBottom < col.level;

                    return (
                      <span
                        key={rowIdx}
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 shrink-0 ${
                          isFilled
                            ? 'scale-100 shadow-2xs'
                            : `${emptyDotColor} scale-90 opacity-60`
                        }`}
                        style={{
                          backgroundColor: isFilled ? colColor : undefined,
                          boxShadow: isFilled && isHovered ? `0 0 8px ${colColor}80` : undefined
                        }}
                      />
                    );
                  })}

                  {/* Column Hover Indicator Line */}
                  <div
                    className={`absolute -bottom-1 inset-x-0 h-0.5 rounded-full transition-opacity ${
                      isHovered ? 'bg-[#1677ff] opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* X-Axis Month Labels */}
          <div className="flex justify-between border-t border-slate-100 pt-2 text-[11px] font-sans text-slate-400">
            {monthLabels.map((ml, idx) => (
              <span key={idx} className="hover:text-slate-700 transition-colors">
                {ml.monthName}
              </span>
            ))}
          </div>
        </div>

        {/* Hover Floating Tooltip */}
        <AnimatePresence>
          {hoveredColIndex !== null && columns[hoveredColIndex] && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute top-0 right-2 sm:right-6 pointer-events-none z-30"
            >
              {(() => {
                const col = columns[hoveredColIndex];
                return (
                  <div className="bg-slate-900/95 text-white backdrop-blur-md px-3 py-2 rounded-xl shadow-xl border border-white/10 text-xs space-y-1 min-w-[150px]">
                    <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 font-mono">
                      <span>{col.dateStr}</span>
                      <span className="text-sky-300">
                        {mode === 'cumulative' ? '累计进度' : '时段计数'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: col.color }}
                      />
                      <span className="font-bold text-sm">
                        {mode === 'cumulative' 
                          ? `${col.cumulativeAtPoint} 记录` 
                          : `${col.totalVal} 记录`}
                      </span>
                    </div>

                    {col.dominantItem?.label && (
                      <div className="text-[11px] text-slate-300 flex items-center gap-1">
                        <span>主心境/分类:</span>
                        <span className="font-medium text-sky-300">{col.dominantItem.label}</span>
                      </div>
                    )}

                    {col.dominantItem?.title && (
                      <p className="text-[10px] text-slate-400 line-clamp-1 italic">
                        “{col.dominantItem.title}”
                      </p>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Optional Legend */}
      {showLegend && legendItems.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span className="text-[11px] text-slate-400">心境色彩图例:</span>
          {legendItems.map((leg, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: leg.color }}
              />
              <span className="text-[11px]">{leg.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
