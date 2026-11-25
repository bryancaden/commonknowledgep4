import React from 'react';
import { Check, ChevronRight, Lock, RotateCcw, Swords, Timer, Zap } from 'lucide-react';
import { STAGES, WEAPONS } from '../data/stagesAndWeapons';
import {
  canChallengeBoss,
  TIMED_CHALLENGE_QUESTION_COUNT,
  TIMED_CHALLENGE_SECONDS,
  TIMED_WEAPON_BONUS,
} from '../game/engine';
import { GameMode, HeroCharacter } from '../types/game';
import { BossDragonSvg, LegoMinifig, LegoWeaponIcon } from './LegoSprites';

interface OverworldMapProps {
  hero: HeroCharacter;
  clearedStageIds: number[];
  unlockedWeaponIds: string[];
  weaponBonuses: Record<string, number>;
  gameMode: GameMode;
  questionsPerStage: number;
  onSelectStage: (stageId: number) => void;
  onEnterBoss: () => void;
  onChangeGameMode: (mode: GameMode) => void;
  onChangeQuestionsPerStage: (count: number) => void;
}

export const OverworldMap: React.FC<OverworldMapProps> = ({
  hero,
  clearedStageIds,
  unlockedWeaponIds,
  weaponBonuses,
  gameMode,
  questionsPerStage,
  onSelectStage,
  onEnterBoss,
  onChangeGameMode,
  onChangeQuestionsPerStage,
}) => {
  const bossUnlocked = canChallengeBoss(unlockedWeaponIds);
  const allCleared = clearedStageIds.length === STAGES.length;
  const nextStageId = STAGES.find((s) => !clearedStageIds.includes(s.id))?.id ?? 1;
  const isTimed = gameMode === 'timed';
  const activeQuestionCount = isTimed ? TIMED_CHALLENGE_QUESTION_COUNT : questionsPerStage;

  return (
    <main className="flex-1 brick-baseplate py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Adventure Banner */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 md:p-6 shadow-[0_4px_0_#0F172A] flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <LegoMinifig hero={hero} pose={allCleared ? 'happy' : 'idle'} size={84} className="shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-500">
                小四人文科 4A · 已完成 {clearedStageIds.length} / {STAGES.length} 關 · 武器 {unlockedWeaponIds.length} / {WEAPONS.length} 件
              </div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">
                {allCleared
                  ? '全套積木武器已集齊！立即出戰終極大怪獸！'
                  : `下一站建議：${STAGES.find((s) => s.id === nextStageId)?.title}`}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {isTimed
                  ? `限時挑戰模式：每關固定 ${TIMED_CHALLENGE_QUESTION_COUNT} 題，於 ${TIMED_CHALLENGE_SECONDS} 秒內全對（5/5）即可額外強化武器攻擊力 +${TIMED_WEAPON_BONUS}！`
                  : `每關隨機抽出 ${activeQuestionCount} 題（含選擇、填充、是非及看圖題），過關即可解鎖專屬積木武器。`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-300 rounded-lg" role="group" aria-label="挑戰模式切換">
              <button
                type="button"
                onClick={() => onChangeGameMode('standard')}
                aria-pressed={!isTimed}
                className={`px-3 py-1.5 text-xs font-bold rounded-md cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                  !isTimed ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-white'
                }`}
              >
                標準模式
              </button>
              <button
                type="button"
                data-mode="timed"
                onClick={() => onChangeGameMode('timed')}
                aria-pressed={isTimed}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-md cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                  isTimed ? 'bg-[#D01012] text-white' : 'text-slate-700 hover:bg-white'
                }`}
              >
                <Timer className="w-3.5 h-3.5" aria-hidden="true" />
                <span>限時挑戰</span>
              </button>
            </div>

            {!isTimed ? (
              <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-300 rounded-lg">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => onChangeQuestionsPerStage(cnt)}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded-md cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                      questionsPerStage === cnt ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    {cnt} 題/關
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-lg text-xs font-black text-amber-900 font-mono-num whitespace-nowrap">
                60 秒 · 5 題 · 全對 +{TIMED_WEAPON_BONUS}
              </div>
            )}

            <button
              type="button"
              onClick={() => onSelectStage(nextStageId)}
              className="brick-btn inline-flex items-center gap-2 px-5 py-2.5 bg-[#0055BF] hover:bg-[#004499] text-white text-sm font-black rounded-xl border-2 border-slate-900 shadow-[0_3px_0_#0F172A] cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>
                {isTimed
                  ? `限時挑戰第 ${nextStageId} 關`
                  : clearedStageIds.includes(nextStageId)
                  ? '重溫挑戰'
                  : `進入第 ${nextStageId} 關`}
              </span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* 6 Curriculum Stages Grid (3x2 on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {STAGES.map((stage) => {
            const isCleared = clearedStageIds.includes(stage.id);
            const weapon = WEAPONS.find((w) => w.id === stage.weaponId)!;
            const bonus = weaponBonuses[weapon.id] ?? 0;
            const isNext = stage.id === nextStageId && !allCleared;

            return (
              <section
                key={stage.id}
                className={`bg-white border-2 rounded-2xl p-5 flex flex-col justify-between transition-transform ${
                  isNext
                    ? 'border-slate-900 shadow-[0_5px_0_#0F172A] ring-2 ring-amber-300'
                    : 'border-slate-900 shadow-[0_4px_0_#0F172A]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-500">
                      {stage.themeLabel} · {isCleared ? '已通關' : isNext ? '建議挑戰' : '可自由練習'}
                    </span>
                    {isCleared && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>已獲武器</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-slate-900">{stage.title}</h2>
                    <p className="text-sm font-bold mt-0.5" style={{ color: stage.color }}>
                      {stage.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{stage.lessons}</p>
                  </div>

                  {/* Weapon Reward Preview */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="w-11 h-11 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <LegoWeaponIcon weaponId={weapon.id} size={34} locked={!isCleared} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        過關武器：{weapon.name}
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono-num flex items-center gap-1 flex-wrap">
                        <span>攻擊力 {weapon.damage + bonus}</span>
                        {bonus > 0 && (
                          <span className="inline-flex items-center gap-0.5 font-bold text-[#D01012]">
                            <Zap className="w-3 h-3" aria-hidden="true" />
                            <span>含強化 +{bonus}</span>
                          </span>
                        )}
                        <span>· {weapon.role}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectStage(stage.id)}
                  className="brick-btn mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-slate-900 text-sm font-black text-white shadow-[0_3px_0_#0F172A] cursor-pointer whitespace-nowrap"
                  style={{ backgroundColor: stage.color }}
                >
                  {isTimed ? (
                    <>
                      <Timer className="w-4 h-4" aria-hidden="true" />
                      <span>{bonus > 0 ? '重溫限時挑戰（60秒5題）' : '限時挑戰（60秒5題）'}</span>
                    </>
                  ) : isCleared ? (
                    <>
                      <RotateCcw className="w-4 h-4" aria-hidden="true" />
                      <span>再次挑戰（全新題目）</span>
                    </>
                  ) : (
                    <>
                      <span>挑戰關卡（{activeQuestionCount} 題）</span>
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </section>
            );
          })}

          {/* Final Boss Arena Full-Width Banner Card */}
          <section className="md:col-span-2 lg:col-span-3 bg-slate-900 text-white border-2 border-slate-900 rounded-2xl p-5 md:p-6 shadow-[0_5px_0_#D01012] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
              <BossDragonSvg size={88} className="shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-amber-300">
                    終極決戰 · 4A 總複習挑戰
                  </span>
                  <span className="text-xs font-mono-num text-slate-300">
                    已裝備 {unlockedWeaponIds.length} / {WEAPONS.length} 件武器
                  </span>
                </div>
                <h2 className="text-xl font-black text-white">終極大怪獸：混沌污染魔龍</h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {unlockedWeaponIds.length === 0
                    ? `先完成任意 1 個關卡取得第一件武器即可開啟終極對決（集齊全部 ${WEAPONS.length} 件武器威力最強！）。`
                    : unlockedWeaponIds.length < WEAPONS.length
                    ? `目前已解鎖 ${unlockedWeaponIds.length} 件武器！你可先試戰魔龍，或挑戰其餘關卡及限時挑戰強化武器。`
                    : `全部 ${WEAPONS.length} 件傳說積木武器已就緒！準備發出最強連擊！`}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={!bossUnlocked}
              onClick={onEnterBoss}
              className={`brick-btn w-full lg:w-auto lg:min-w-[220px] inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl border-2 text-sm font-black whitespace-nowrap shrink-0 ${
                bossUnlocked
                  ? 'bg-[#D01012] hover:bg-[#B80D0F] text-white border-amber-300 shadow-[0_3px_0_#92400E] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
              }`}
            >
              {bossUnlocked ? (
                <>
                  <Swords className="w-4 h-4" aria-hidden="true" />
                  <span>迎戰終極大怪獸</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" aria-hidden="true" />
                  <span>需至少解鎖 1 件武器</span>
                </>
              )}
            </button>
          </section>
        </div>
      </div>
    </main>
  );
};
