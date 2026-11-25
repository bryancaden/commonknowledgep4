import React, { useState } from 'react';
import { Play, Timer, Zap } from 'lucide-react';
import { HERO_CHARACTERS } from '../data/stagesAndWeapons';
import { TIMED_CHALLENGE_QUESTION_COUNT, TIMED_CHALLENGE_SECONDS, TIMED_WEAPON_BONUS } from '../game/engine';
import { GameMode, HeroCharacter } from '../types/game';
import { LegoMinifig } from './LegoSprites';

interface TitleScreenProps {
  selectedHero: HeroCharacter;
  onSelectHero: (hero: HeroCharacter) => void;
  gameMode: GameMode;
  onChangeGameMode: (mode: GameMode) => void;
  questionsPerStage: number;
  onChangeQuestionsPerStage: (count: number) => void;
  onStart: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  selectedHero,
  onSelectHero,
  gameMode,
  onChangeGameMode,
  questionsPerStage,
  onChangeQuestionsPerStage,
  onStart,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-sky-200 flex flex-col justify-between">
      {/* Illustrated Key-Art Backdrop */}
      {!imgError ? (
        <img
          src="/src/assets/images/title_bg_1795420688236.jpg"
          alt="樂高積木香港島嶼與山峰背景"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="absolute inset-0 h-full w-full object-cover object-right select-none pointer-events-none"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-sky-300 via-sky-100 to-emerald-100 pointer-events-none" />
      )}

      {/* Subtle left readability gradient over the sky negative space */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(240,249,255,0.94) 0%, rgba(240,249,255,0.82) 42%, rgba(240,249,255,0.12) 72%, rgba(240,249,255,0) 100%)',
        }}
      />

      {/* Main Content Container anchored in left negative space */}
      <div className="relative z-10 flex-1 flex items-center px-6 py-8 md:px-14 lg:px-20 max-w-7xl w-full mx-auto">
        <div className="w-full max-w-xl space-y-5">
          {/* Bespoke Inline SVG Title Emblem */}
          <div className="space-y-3">
            <svg
              viewBox="0 0 460 110"
              className="w-full max-w-[440px] h-auto"
              role="img"
              aria-label="小四人文科 4A 樂高人知識大冒險"
            >
              {/* Brick Title Plaque */}
              <rect x="4" y="10" width="452" height="92" rx="12" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
              {/* Top LEGO Studs */}
              <rect x="28" y="2" width="26" height="9" rx="2" fill="#D01012" stroke="#0F172A" strokeWidth="3" />
              <rect x="66" y="2" width="26" height="9" rx="2" fill="#F5CD2F" stroke="#0F172A" strokeWidth="3" />
              <rect x="104" y="2" width="26" height="9" rx="2" fill="#0055BF" stroke="#0F172A" strokeWidth="3" />
              <rect x="142" y="2" width="26" height="9" rx="2" fill="#237841" stroke="#0F172A" strokeWidth="3" />

              <text x="26" y="46" className="text-[18px] font-bold fill-[#0055BF]">
                小四人文科上學期 · 4A 互動自學教具
              </text>
              <text x="24" y="84" className="text-[32px] font-black fill-[#0F172A] tracking-tight">
                樂高人知識大冒險
              </text>
            </svg>

            <p className="text-slate-700 text-base md:text-lg leading-relaxed max-w-lg font-medium">
              結合香港地圖、天氣防災、地球保育、中華文化與健康公民素養，闖過六大積木關卡收集武器，合力擊敗混沌污染巨獸。
            </p>
          </div>

          {/* Hero Selection Strip */}
          <div className="bg-white/95 border-2 border-slate-900 rounded-xl p-4 shadow-[0_4px_0_#0F172A]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">選擇你的樂高小勇士</h2>
              <span className="text-xs text-slate-500 font-medium">{selectedHero.role}</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {HERO_CHARACTERS.map((hero) => {
                const isSelected = hero.id === selectedHero.id;
                return (
                  <button
                    key={hero.id}
                    type="button"
                    onClick={() => onSelectHero(hero)}
                    aria-pressed={isSelected}
                    className={`brick-btn flex flex-col items-center p-2.5 rounded-lg border-2 text-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                      isSelected
                        ? 'bg-amber-50 border-slate-900 shadow-[0_3px_0_#0F172A]'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <LegoMinifig hero={hero} pose={isSelected ? 'happy' : 'idle'} size={62} />
                    <span className="mt-1 text-xs md:text-sm font-bold text-slate-900 whitespace-nowrap">
                      {hero.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Challenge Mode Menu */}
          <div className="bg-white/95 border-2 border-slate-900 rounded-xl p-3.5 shadow-[0_4px_0_#0F172A] space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-900">冒險模式選單</span>
              <span className="text-[11px] font-medium text-slate-600">可於地圖隨時切換</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onChangeGameMode('standard')}
                aria-pressed={gameMode === 'standard'}
                className={`brick-btn flex flex-col items-start p-2.5 rounded-lg border-2 text-left cursor-pointer ${
                  gameMode === 'standard'
                    ? 'bg-sky-50 border-slate-900 shadow-[0_2px_0_#0F172A]'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-400'
                }`}
              >
                <span className="text-xs sm:text-sm font-black text-slate-900 whitespace-nowrap">
                  標準模式
                </span>
                <span className="text-[11px] text-slate-600 mt-0.5">
                  預設每關 15 題輕鬆闖關
                </span>
              </button>

              <button
                type="button"
                data-mode="timed"
                onClick={() => onChangeGameMode('timed')}
                aria-pressed={gameMode === 'timed'}
                className={`brick-btn flex flex-col items-start p-2.5 rounded-lg border-2 text-left cursor-pointer ${
                  gameMode === 'timed'
                    ? 'bg-amber-50 border-slate-900 shadow-[0_2px_0_#0F172A]'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-400'
                }`}
              >
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-slate-900 whitespace-nowrap">
                  <Timer className="w-3.5 h-3.5 text-[#D01012]" aria-hidden="true" />
                  <span>限時挑戰</span>
                </span>
                <span className="text-[11px] text-slate-700 mt-0.5">
                  {TIMED_CHALLENGE_SECONDS} 秒答 {TIMED_CHALLENGE_QUESTION_COUNT} 題 · 全對武器 +{TIMED_WEAPON_BONUS}
                </span>
              </button>
            </div>
          </div>

          {/* Question Count / Timed Rule & Primary Start Action */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {gameMode === 'standard' ? (
              <div className="flex items-center gap-1 p-1.5 bg-white/95 border-2 border-slate-900 rounded-xl shadow-[0_3px_0_#0F172A]">
                <span className="px-2.5 text-xs font-bold text-slate-700 whitespace-nowrap">每關題數</span>
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => onChangeQuestionsPerStage(cnt)}
                    aria-pressed={questionsPerStage === cnt}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      questionsPerStage === cnt
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cnt} 題
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-amber-50 border-2 border-slate-900 rounded-xl shadow-[0_3px_0_#0F172A]">
                <Zap className="w-4 h-4 text-[#D01012] shrink-0" aria-hidden="true" />
                <span className="text-xs font-black text-slate-900 whitespace-nowrap font-mono-num">
                  {TIMED_CHALLENGE_SECONDS}s 限時 {TIMED_CHALLENGE_QUESTION_COUNT} 題 · 全對攻擊 +{TIMED_WEAPON_BONUS}
                </span>
              </div>
            )}

            <button
              type="button"
              data-start="true"
              onClick={onStart}
              className="brick-btn flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#D01012] hover:bg-[#B80D0F] text-white text-lg font-black rounded-xl border-2 border-slate-900 shadow-[0_5px_0_#0F172A] cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              <Play className="w-5 h-5 fill-current" aria-hidden="true" />
              <span>{gameMode === 'timed' ? '開始限時挑戰' : '開始冒險'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Flat, single-line control hint in bottom safe margin */}
      <footer className="relative z-10 px-6 pb-4 text-center sm:text-left max-w-7xl w-full mx-auto">
        <p className="text-xs font-medium text-slate-700">
          Enter / Space 開始冒險 · 每次隨機抽取題目與看圖題 · 限時挑戰全對可強化武器攻擊力
        </p>
      </footer>
    </main>
  );
};
