import React, { useState } from 'react';
import { BarChart3, Radar, TrendingUp, AlertCircle } from 'lucide-react';
import { summarizeDomainMastery } from '../game/engine';
import { DomainStat, HumanitiesDomain } from '../types/game';

interface DomainMasteryChartProps {
  domainStats: Record<HumanitiesDomain, DomainStat>;
  compact?: boolean;
}

type ChartViewMode = 'bar' | 'radar';

export const DomainMasteryChart: React.FC<DomainMasteryChartProps> = ({
  domainStats,
  compact = false,
}) => {
  const [viewMode, setViewMode] = useState<ChartViewMode>('bar');
  const [focusedDomainId, setFocusedDomainId] = useState<HumanitiesDomain | null>(null);

  const { items, strongest, weakest, testedCount } = summarizeDomainMastery(domainStats);
  const focusedItem = items.find((it) => it.id === focusedDomainId) ?? strongest ?? items[0];

  // Radar SVG geometry (5 axes starting at -90deg top)
  const cx = 140;
  const cy = 120;
  const maxR = 76;
  const ringLevels = [0.25, 0.5, 0.75, 1];

  const getAxisPoint = (index: number, ratio: number) => {
    const angle = (-90 + index * 72) * (Math.PI / 180);
    return {
      x: cx + Math.cos(angle) * maxR * ratio,
      y: cy + Math.sin(angle) * maxR * ratio,
    };
  };

  const dataPoints = items.map((item, idx) => {
    const ratio = item.accuracyPct !== null ? Math.max(0.08, item.accuracyPct / 100) : 0;
    return getAxisPoint(idx, ratio);
  });
  const polygonPoints = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <section
      aria-label="人文科知識領域正確率分析"
      className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5"
      data-testid="domain-mastery-module"
    >
      {/* Header + Segmented View Switch */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-black text-slate-900">
            知識領域掌握分析
          </h3>
          <p className="text-xs text-slate-600">
            {testedCount > 0
              ? `已追蹤 ${testedCount} / ${items.length} 個知識領域的答題正確率`
              : '尚未有作答紀錄，完成題目後將即時更新各領域正確率'}
          </p>
        </div>

        <div
          className="flex items-center gap-1 p-1 bg-white border border-slate-300 rounded-lg"
          role="group"
          aria-label="切換圖表檢視方式"
        >
          <button
            type="button"
            onClick={() => setViewMode('bar')}
            aria-pressed={viewMode === 'bar'}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'bar'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>長條圖</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('radar')}
            aria-pressed={viewMode === 'radar'}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'radar'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Radar className="w-3.5 h-3.5" aria-hidden="true" />
            <span>雷達圖</span>
          </button>
        </div>
      </div>

      {/* Chart Body */}
      {viewMode === 'bar' ? (
        <div className={compact ? 'space-y-2.5' : 'space-y-3'}>
          {items.map((item) => {
            const pct = item.accuracyPct ?? 0;
            const statusTextColor =
              item.level === 'strong'
                ? 'text-emerald-800'
                : item.level === 'good'
                ? 'text-blue-800'
                : item.level === 'weak'
                ? 'text-red-800'
                : 'text-slate-500';

            return (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-xs shrink-0 border border-slate-900/20"
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    />
                    <span className="font-bold text-slate-900 truncate">{item.label}</span>
                    <span className="text-slate-400" aria-hidden="true">·</span>
                    <span className={`font-bold whitespace-nowrap ${statusTextColor}`}>
                      {item.levelLabel}
                    </span>
                  </div>

                  <div className="font-mono-num tabular-nums text-right whitespace-nowrap shrink-0">
                    {item.accuracyPct !== null ? (
                      <span className="text-slate-900 font-black">
                        {item.accuracyPct}%{' '}
                        <span className="text-slate-500 font-medium">
                          ({item.correct}/{item.answered})
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">-- (0/0)</span>
                    )}
                  </div>
                </div>

                {/* Brick-style Progress Bar */}
                <div
                  className="h-3 w-full bg-white border border-slate-300 rounded-sm overflow-hidden"
                  role="progressbar"
                  aria-valuenow={item.accuracyPct ?? 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.label}正確率`}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${item.accuracyPct !== null && pct > 0 ? Math.max(pct, 4) : 0}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white border border-slate-200 rounded-lg p-3">
          <svg
            viewBox="0 0 280 240"
            className="w-full max-w-[260px] h-auto shrink-0"
            role="img"
            aria-label="五大人文科知識領域雷達圖"
          >
            {/* Concentric Grid Pentagons */}
            {ringLevels.map((lvl) => {
              const pts = items
                .map((_, idx) => {
                  const p = getAxisPoint(idx, lvl);
                  return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
                })
                .join(' ');
              return (
                <polygon
                  key={lvl}
                  points={pts}
                  fill={lvl === 1 ? '#F8FAFC' : 'none'}
                  stroke="#CBD5E1"
                  strokeWidth="1"
                  strokeDasharray={lvl === 1 ? undefined : '3 3'}
                />
              );
            })}

            {/* Axis Spokes & Labels */}
            {items.map((item, idx) => {
              const outer = getAxisPoint(idx, 1);
              const labelPos = getAxisPoint(idx, 1.32);
              const isSelected = focusedItem?.id === item.id;
              return (
                <g key={item.id}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={outer.x}
                    y2={outer.y}
                    stroke="#CBD5E1"
                    strokeWidth="1"
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y + 4}
                    textAnchor="middle"
                    className={`text-[11px] font-bold cursor-pointer ${
                      isSelected ? 'fill-slate-900' : 'fill-slate-600'
                    }`}
                    onClick={() => setFocusedDomainId(item.id)}
                  >
                    {item.shortLabel}
                  </text>
                </g>
              );
            })}

            {/* Scale Label */}
            <text x={cx + 4} y={cy - maxR * 0.5 + 3} className="text-[9px] font-mono-num fill-slate-400">
              50%
            </text>
            <text x={cx + 4} y={cy - maxR + 9} className="text-[9px] font-mono-num fill-slate-400">
              100%
            </text>

            {/* Student Mastery Polygon */}
            {testedCount > 0 && (
              <polygon
                points={polygonPoints}
                fill="#0055BF"
                fillOpacity="0.22"
                stroke="#0055BF"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            )}

            {/* Interactive Domain Nodes */}
            {items.map((item, idx) => {
              const pt = dataPoints[idx];
              const isSelected = focusedItem?.id === item.id;
              return (
                <circle
                  key={item.id}
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 6 : 4.5}
                  fill={item.accuracyPct !== null ? item.color : '#CBD5E1'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => setFocusedDomainId(item.id)}
                />
              );
            })}
          </svg>

          {/* Interactive Selected Axis Detail Panel */}
          <div className="flex-1 w-full space-y-2.5 text-xs">
            <div className="flex flex-wrap gap-1.5">
              {items.map((item) => {
                const active = focusedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFocusedDomainId(item.id)}
                    className={`px-2 py-1 rounded-md border text-xs font-bold cursor-pointer transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {item.shortLabel}
                  </button>
                );
              })}
            </div>

            {focusedItem && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-slate-900 text-sm">{focusedItem.label}</span>
                  <span className="font-mono-num tabular-nums font-black text-slate-900">
                    {focusedItem.accuracyPct !== null ? `${focusedItem.accuracyPct}%` : '尚未作答'}
                  </span>
                </div>
                <div className="text-slate-600 font-mono-num tabular-nums">
                  答對 {focusedItem.correct} / {focusedItem.answered} 題 · {focusedItem.levelLabel}
                </div>
                <div className="text-slate-500">
                  對應練習：{focusedItem.recommendedStage}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Strength & Weakness Actionable Insight Footer */}
      {testedCount > 0 && (
        <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {strongest ? (
            <div className="flex items-start gap-2 text-emerald-900">
              <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="font-black">強項領域：</span>
                <span className="font-bold">{strongest.label}</span>
                <span className="font-mono-num tabular-nums text-emerald-800">
                  （{strongest.accuracyPct}% · {strongest.correct}/{strongest.answered}）
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-slate-700">
              <TrendingUp className="w-4 h-4 text-[#0055BF] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="font-black">累積實力中：</span>
                <span>暫未出現達 60% 的強項領域，繼續加油！</span>
              </div>
            </div>
          )}

          {weakest ? (
            <div className="flex items-start gap-2 text-amber-950">
              <AlertCircle className="w-4 h-4 text-[#D01012] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="font-black">建議加強：</span>
                <span className="font-bold">{weakest.label}</span>
                <span className="font-mono-num tabular-nums text-red-800">
                  （{weakest.accuracyPct}% · 建議重溫{weakest.recommendedStage}）
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-slate-700">
              <TrendingUp className="w-4 h-4 text-[#0055BF] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="font-black">整體表現：</span>
                <span>各已作答領域正確率均達 80% 以上，繼續保持！</span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
