import React from 'react';
import { Heart, Pause, Volume2, VolumeX, Map } from 'lucide-react';
import { WEAPONS } from '../data/stagesAndWeapons';
import { HeroCharacter } from '../types/game';
import { LegoWeaponIcon } from './LegoSprites';

interface GameHudProps {
  hero: HeroCharacter;
  heroHp: number;
  maxHp: number;
  score: number;
  streak: number;
  unlockedWeaponIds: string[];
  weaponBonuses: Record<string, number>;
  locationLabel: string;
  muted: boolean;
  showBackToMap: boolean;
  onToggleMute: () => void;
  onOpenPause: () => void;
  onBackToMap: () => void;
}

export const GameHud: React.FC<GameHudProps> = ({
  hero,
  heroHp,
  maxHp,
  score,
  streak,
  unlockedWeaponIds,
  weaponBonuses,
  locationLabel,
  muted,
  showBackToMap,
  onToggleMute,
  onOpenPause,
  onBackToMap,
}) => {
  return (
    <header className="w-full bg-white border-b-2 border-slate-900 px-4 py-2.5 md:px-6 z-20">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Hero Identity & Vitality Pips */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg border-2 border-slate-900 flex items-center justify-center font-black text-sm text-white shrink-0"
              style={{ backgroundColor: hero.torsoColor }}
              aria-hidden="true"
            >
              {hero.name.slice(0, 1)}
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 leading-tight whitespace-nowrap">
                {hero.name}
              </div>
              <div className="text-xs text-slate-600 font-medium whitespace-nowrap">
                {locationLabel}
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" aria-hidden="true" />

          {/* Heart Vitality Sockets */}
          <div className="flex items-center gap-1" aria-label={`生命值 ${heroHp} / ${maxHp}`}>
            {Array.from({ length: maxHp }).map((_, idx) => {
              const filled = idx < heroHp;
              return (
                <Heart
                  key={idx}
                  className={`w-5 h-5 transition-transform ${
                    filled ? 'text-[#D01012] fill-[#D01012]' : 'text-slate-300 fill-slate-100'
                  }`}
                  aria-hidden="true"
                />
              );
            })}
            <span className="ml-1.5 text-xs font-bold font-mono-num text-slate-700 whitespace-nowrap">
              {heroHp}/{maxHp}
            </span>
          </div>
        </div>

        {/* Center: Earned Weapon Arsenal Strip */}
        <div className="hidden lg:flex items-center gap-2" aria-label="積木武器庫">
          <span className="text-xs font-bold text-slate-500 mr-1 whitespace-nowrap">武器庫</span>
          {WEAPONS.map((w) => {
            const unlocked = unlockedWeaponIds.includes(w.id);
            const bonus = weaponBonuses[w.id] ?? 0;
            return (
              <div
                key={w.id}
                title={
                  unlocked
                    ? `${w.name}（攻擊力 ${w.damage + bonus}${bonus > 0 ? ` · 含限時強化 +${bonus}` : ''}）`
                    : `尚未解鎖：第 ${w.stageId} 關武器`
                }
                className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center transition-colors ${
                  unlocked
                    ? bonus > 0
                      ? 'bg-amber-100 border-[#D01012] shadow-[0_2px_0_#0F172A]'
                      : 'bg-amber-50 border-slate-900 shadow-[0_2px_0_#0F172A]'
                    : 'bg-slate-100 border-slate-200'
                }`}
              >
                <LegoWeaponIcon weaponId={w.id} size={26} locked={!unlocked} />
              </div>
            );
          })}
        </div>

        {/* Right: Score, Streak & Utility Controls */}
        <div className="flex items-center gap-3">
          <div className="text-right pr-1">
            <div className="text-[11px] font-bold text-slate-500 leading-none">
              積分{streak >= 2 ? ` · 連勝 ×${streak}` : ''}
            </div>
            <div className="text-lg font-black font-mono-num text-slate-900 leading-tight">
              {score}
            </div>
          </div>

          {showBackToMap && (
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                onBackToMap();
              }}
              aria-label="返回冒險地圖"
              title="返回冒險地圖"
              className="brick-btn inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-900 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Map className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">地圖</span>
            </button>
          )}

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleMute();
            }}
            aria-label={muted ? '開啟音效 (M)' : '靜音 (M)'}
            title={muted ? '開啟音效 [M]' : '靜音 [M]'}
            className="brick-btn w-9 h-9 rounded-lg border-2 border-slate-900 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-900 cursor-pointer shrink-0"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenPause();
            }}
            aria-label="暫停選單 (P)"
            title="暫停選單 [P]"
            className="brick-btn w-9 h-9 rounded-lg border-2 border-slate-900 bg-amber-300 hover:bg-amber-400 flex items-center justify-center text-slate-900 cursor-pointer shrink-0"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
