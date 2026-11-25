import React from 'react';
import { Award, Map, Play, RotateCcw, ShieldAlert, Timer, Trophy, Zap } from 'lucide-react';
import { TIMED_WEAPON_BONUS } from '../game/engine';
import {
  DomainStat,
  GameMode,
  HeroCharacter,
  HumanitiesDomain,
  RunStats,
  StageInfo,
  Weapon,
} from '../types/game';
import { DomainMasteryChart } from './DomainMasteryChart';
import { LegoMinifig, LegoWeaponIcon } from './LegoSprites';

interface StageClearModalProps {
  hero: HeroCharacter;
  stage: StageInfo;
  weapon: Weapon;
  stageCorrect: number;
  stageTotal: number;
  gameMode: GameMode;
  weaponBonusTotal: number;
  timedBonusJustEarned: boolean;
  timeRemainingSec: number;
  hasNextStage: boolean;
  onNextStage: () => void;
  onBackToMap: () => void;
  onEnterBoss: () => void;
}

export const StageClearModal: React.FC<StageClearModalProps> = ({
  hero,
  stage,
  weapon,
  stageCorrect,
  stageTotal,
  gameMode,
  weaponBonusTotal,
  timedBonusJustEarned,
  timeRemainingSec,
  hasNextStage,
  onNextStage,
  onBackToMap,
  onEnterBoss,
}) => {
  const totalDamage = weapon.damage + weaponBonusTotal;

  return (
    <div
      className="fixed inset-0 z-40 bg-slate-900/65 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stage-clear-title"
    >
      <div className="w-full max-w-lg bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[0_8px_0_#0F172A] space-y-5">
        <div className="flex items-center gap-4">
          <LegoMinifig hero={hero} pose="happy" size={88} heldWeaponId={weapon.id} className="shrink-0" />
          <div>
            <div className="text-xs font-bold text-emerald-700">關卡突破 · 武器鍛造完成</div>
            <h2 id="stage-clear-title" className="text-2xl font-black text-slate-900 mt-0.5">
              {stage.title} 通關！
            </h2>
            <p className="text-sm text-slate-600 mt-1 font-mono-num">
              本關答對 {stageCorrect} / {stageTotal} 題
              {gameMode === 'timed' ? ` · 剩餘 ${timeRemainingSec}s` : ''}
            </p>
          </div>
        </div>

        {/* Unlocked Weapon Showcase */}
        <div className="p-4 rounded-xl bg-amber-50 border-2 border-slate-900 space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white border-2 border-slate-900 flex items-center justify-center shrink-0">
              <LegoWeaponIcon weaponId={weapon.id} size={50} />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-800">獲得終極決戰武器</div>
              <div className="text-lg font-black text-slate-900">{weapon.name}</div>
              <div className="text-xs text-slate-700 mt-0.5 font-mono-num">
                {weaponBonusTotal > 0 ? (
                  <span>
                    攻擊力 {weapon.damage} + 限時強化 <strong className="text-[#D01012]">+{weaponBonusTotal}</strong> ={' '}
                    <strong className="text-slate-900">{totalDamage}</strong> · {weapon.role}
                  </span>
                ) : (
                  <span>
                    基礎攻擊力 <strong className="font-bold">{weapon.damage}</strong> · {weapon.role}
                  </span>
                )}
              </div>
            </div>
          </div>

          {gameMode === 'timed' && (
            <div
              className={`p-2.5 rounded-lg border text-xs font-bold flex items-center gap-2 ${
                timedBonusJustEarned
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                  : 'bg-white border-slate-300 text-slate-700'
              }`}
            >
              {timedBonusJustEarned ? (
                <>
                  <Zap className="w-4 h-4 text-[#D01012] shrink-0" aria-hidden="true" />
                  <span>
                    限時全對強化成功！獲得額外武器攻擊力 +{TIMED_WEAPON_BONUS} 加成！
                  </span>
                </>
              ) : (
                <>
                  <Timer className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                  <span>
                    {weaponBonusTotal > 0
                      ? `本關武器已擁有 +${weaponBonusTotal} 限時強化（本次答對 ${stageCorrect}/${stageTotal} 題）。`
                      : `限時挑戰需 5 題全對才可觸發 +${TIMED_WEAPON_BONUS} 強化（本次答對 ${stageCorrect}/${stageTotal} 題）。`}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onBackToMap}
            className="brick-btn flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-900 cursor-pointer whitespace-nowrap"
          >
            <Map className="w-4 h-4" aria-hidden="true" />
            <span>返回冒險地圖</span>
          </button>

          {hasNextStage ? (
            <button
              type="button"
              onClick={onNextStage}
              className="brick-btn flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-slate-900 bg-[#0055BF] hover:bg-[#004499] text-sm font-black text-white shadow-[0_3px_0_#0F172A] cursor-pointer whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>挑戰下一關</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onEnterBoss}
              className="brick-btn flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-slate-900 bg-[#D01012] hover:bg-[#B80D0F] text-sm font-black text-white shadow-[0_3px_0_#0F172A] cursor-pointer whitespace-nowrap"
            >
              <Award className="w-4 h-4" aria-hidden="true" />
              <span>決戰終極大怪獸</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface PauseModalProps {
  domainStats: Record<HumanitiesDomain, DomainStat>;
  onResume: () => void;
  onBackToMap: () => void;
  onRestartTitle: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  domainStats,
  onResume,
  onBackToMap,
  onRestartTitle,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/65 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-modal-title"
    >
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[0_8px_0_#0F172A] space-y-4">
        <div>
          <h2 id="pause-modal-title" className="text-xl font-black text-slate-900">
            冒險暫停 · 學習診斷站
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            查看你目前在各個人文科知識領域的答題正確率，再決定繼續挑戰或切換關卡！
          </p>
        </div>

        <DomainMasteryChart domainStats={domainStats} compact />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onResume}
            className="brick-btn w-full py-2.5 px-4 rounded-xl border-2 border-slate-900 bg-[#0055BF] text-white font-black text-sm shadow-[0_3px_0_#0F172A] cursor-pointer whitespace-nowrap"
          >
            繼續冒險
          </button>
          <button
            type="button"
            onClick={onBackToMap}
            className="brick-btn w-full py-2.5 px-4 rounded-xl border-2 border-slate-900 bg-slate-100 text-slate-900 font-bold text-sm cursor-pointer whitespace-nowrap"
          >
            返回冒險地圖
          </button>
          <button
            type="button"
            onClick={onRestartTitle}
            className="brick-btn w-full py-2.5 px-4 rounded-xl border-2 border-slate-300 bg-white text-slate-700 font-bold text-sm cursor-pointer whitespace-nowrap"
          >
            回到主畫面
          </button>
        </div>
      </div>
    </div>
  );
};

interface GameOverModalProps {
  hero: HeroCharacter;
  stats: RunStats;
  bossMaxHp: number;
  onPlayAgain: () => void;
  onBackToMap: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  hero,
  stats,
  bossMaxHp,
  onPlayAgain,
  onBackToMap,
}) => {
  const isVictory = stats.bossOutcome === 'victory';
  const accuracy =
    stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0;
  const elapsedSec = Math.max(
    1,
    Math.round(((stats.endTimeMs ?? Date.now()) - stats.startTimeMs) / 1000),
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/75 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gameover-modal-title"
    >
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[0_8px_0_#0F172A] space-y-5">
        <div className="flex items-center gap-4">
          <LegoMinifig hero={hero} pose={isVictory ? 'happy' : 'hurt'} size={86} className="shrink-0" />
          <div>
            <div className={`inline-flex items-center gap-1.5 text-xs font-bold ${isVictory ? 'text-emerald-700' : 'text-red-700'}`}>
              {isVictory ? <Trophy className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              <span>{isVictory ? '終極勝利 · 人文知識大師' : '戰敗退回 · 再接再厲'}</span>
            </div>
            <h2 id="gameover-modal-title" className="text-2xl font-black text-slate-900 mt-1">
              {isVictory ? '成功擊敗混沌污染魔龍！' : '差一點就打敗怪獸了！'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {isVictory
                ? '你已掌握小四人文科 4A 核心知識，守護了樂高香港與地球家園！'
                : `怪獸還剩 ${stats.bossRemainingHp} / ${bossMaxHp} HP，多收集武器或重溫題目再戰！`}
            </p>
          </div>
        </div>

        {/* 3 Tabular Stat Tiles */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <div className="text-xs text-slate-500 font-bold">總積分</div>
            <div className="text-xl font-black font-mono-num text-slate-900 mt-0.5">{stats.score}</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <div className="text-xs text-slate-500 font-bold">答對率</div>
            <div className="text-xl font-black font-mono-num text-slate-900 mt-0.5">{accuracy}%</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <div className="text-xs text-slate-500 font-bold">{isVictory ? '冒險用時' : '怪獸餘血'}</div>
            <div className="text-xl font-black font-mono-num text-slate-900 mt-0.5">
              {isVictory ? `${elapsedSec}s` : `${stats.bossRemainingHp}`}
            </div>
          </div>
        </div>

        <DomainMasteryChart domainStats={stats.domainStats} />

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onBackToMap}
            className="brick-btn flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-900 cursor-pointer whitespace-nowrap"
          >
            <Map className="w-4 h-4" aria-hidden="true" />
            <span>返回冒險地圖</span>
          </button>
          <button
            type="button"
            data-start="true"
            onClick={onPlayAgain}
            className="brick-btn flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-slate-900 bg-[#D01012] hover:bg-[#B80D0F] text-sm font-black text-white shadow-[0_3px_0_#0F172A] cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>再挑戰一次</span>
          </button>
        </div>
      </div>
    </div>
  );
};
