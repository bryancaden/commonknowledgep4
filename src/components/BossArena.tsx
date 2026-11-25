import React, { useState } from 'react';
import { Swords } from 'lucide-react';
import { BOSS_MAX_HP, WEAPONS } from '../data/stagesAndWeapons';
import { computeBossStrikeDamage } from '../game/engine';
import { AnswerEvaluation, HeroCharacter, Question } from '../types/game';
import { CurriculumDiagram } from './CurriculumDiagrams';
import { BossDragonSvg, LegoMinifig, LegoWeaponIcon } from './LegoSprites';
import { QuestionPanel } from './QuestionPanel';

interface BossArenaProps {
  hero: HeroCharacter;
  unlockedWeaponIds: string[];
  weaponBonuses: Record<string, number>;
  selectedWeaponId: string;
  onSelectWeapon: (weaponId: string) => void;
  bossHp: number;
  streak: number;
  question: Question;
  roundNumber: number;
  evaluation: AnswerEvaluation | null;
  lastDamageDealt: number | null;
  onSubmitAnswer: (submission: {
    selectedIndex?: number;
    selectedBoolean?: boolean;
    textAnswer?: string;
  }) => void;
  onNextRound: () => void;
}

export const BossArena: React.FC<BossArenaProps> = ({
  hero,
  unlockedWeaponIds,
  weaponBonuses,
  selectedWeaponId,
  onSelectWeapon,
  bossHp,
  streak,
  question,
  roundNumber,
  evaluation,
  lastDamageDealt,
  onSubmitAnswer,
  onNextRound,
}) => {
  const [bgError, setBgError] = useState(false);

  const unlockedWeapons = WEAPONS.filter((w) => unlockedWeaponIds.includes(w.id));
  const activeWeapon =
    unlockedWeapons.find((w) => w.id === selectedWeaponId) ?? unlockedWeapons[0] ?? WEAPONS[0];
  const activeBonus = weaponBonuses[activeWeapon.id] ?? 0;

  const hpPct = Math.max(0, Math.min(100, (bossHp / BOSS_MAX_HP) * 100));
  const bossHit = Boolean(evaluation?.isCorrect);
  const heroPose = evaluation ? (evaluation.isCorrect ? 'attack' : 'hurt') : 'idle';

  return (
    <main className="relative flex-1 bg-slate-950 py-5 px-4 md:px-8 overflow-hidden">
      {/* Arena Backdrop */}
      {!bgError ? (
        <img
          src="/src/assets/images/boss_arena_bg_1795420688343.jpg"
          alt="火山積木要塞決戰舞台"
          referrerPolicy="no-referrer"
          onError={() => setBgError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none select-none"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-red-950 pointer-events-none" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/55 to-slate-950/75 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left/Top Boss Combat Stage (5 cols) */}
        <section className="lg:col-span-5 space-y-4">
          {/* Boss HP Header Card */}
          <div className="bg-slate-900/95 border-2 border-amber-400 rounded-2xl p-4 text-white shadow-[0_5px_0_#0F172A]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div>
                <div className="text-xs font-bold text-amber-300">終極大怪獸</div>
                <h1 className="text-lg font-black">混沌污染魔龍</h1>
              </div>
              <div className="text-right font-mono-num">
                <div className="text-xs text-slate-400">BOSS HP</div>
                <div className="text-xl font-black text-amber-300">
                  {bossHp} / {BOSS_MAX_HP}
                </div>
              </div>
            </div>

            {/* Boss HP Bar with delayed drain ghost bar */}
            <div className="relative h-5 w-full bg-slate-800 rounded-md border border-slate-700 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-amber-400/50 transition-all duration-700 ease-out"
                style={{ width: `${hpPct}%` }}
              />
              <div
                className="relative h-full bg-[#D01012] transition-all duration-200 ease-out"
                style={{ width: `${hpPct}%` }}
              />
            </div>

            {/* Arena Duel Stage */}
            <div className="relative mt-4 rounded-xl bg-slate-950/50 border border-slate-700 p-4 min-h-[210px] flex items-end justify-between">
              <div className={heroPose === 'attack' ? 'animate-lunge-attack' : ''}>
                <LegoMinifig hero={hero} pose={heroPose} size={108} heldWeaponId={activeWeapon.id} />
              </div>

              {lastDamageDealt !== null && evaluation?.isCorrect && (
                <div className="self-center text-center">
                  <div className="text-2xl font-black font-mono-num text-amber-300 drop-shadow">
                    -{lastDamageDealt}
                  </div>
                  <div className="text-xs font-bold text-emerald-300">{activeWeapon.name}命中！</div>
                </div>
              )}

              <div>
                <BossDragonSvg hit={bossHit} defeated={bossHp <= 0} size={146} />
              </div>
            </div>
          </div>

          {/* Weapon Arsenal Selector Dock */}
          <div className="bg-slate-900/95 border-2 border-slate-700 rounded-2xl p-4 text-white space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="inline-flex items-center gap-1.5 text-amber-300">
                <Swords className="w-4 h-4" aria-hidden="true" />
                <span>選擇出戰武器（鍵盤 1–{WEAPONS.length}）</span>
              </span>
              <span className="font-mono-num text-slate-200">
                預計威力 {computeBossStrikeDamage(activeWeapon, streak, activeBonus)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {WEAPONS.map((w, idx) => {
                const unlocked = unlockedWeaponIds.includes(w.id);
                const selected = activeWeapon.id === w.id && unlocked;
                const bonus = weaponBonuses[w.id] ?? 0;
                return (
                  <button
                    key={w.id}
                    type="button"
                    disabled={!unlocked || Boolean(evaluation)}
                    onClick={() => onSelectWeapon(w.id)}
                    className={`brick-btn flex items-center gap-3 p-2.5 rounded-xl border-2 text-left transition-colors ${
                      !unlocked
                        ? 'bg-slate-800/75 border-slate-700 text-slate-300 cursor-not-allowed'
                        : selected
                        ? 'bg-amber-400/20 border-amber-300 text-white cursor-pointer'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-100 cursor-pointer'
                    }`}
                  >
                    <span className="text-xs font-mono-num font-bold w-5 text-center text-amber-300">
                      [{idx + 1}]
                    </span>
                    <LegoWeaponIcon weaponId={w.id} size={28} locked={!unlocked} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black truncate">
                        {unlocked ? w.name : `尚未解鎖（第 ${w.stageId} 關）`}
                      </div>
                      <div className="text-[11px] text-slate-300 truncate font-mono-num">
                        {unlocked
                          ? `攻擊力 ${w.damage + bonus}${bonus > 0 ? `（含限時強化 +${bonus}）` : ''} · ${w.role}`
                          : w.role}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right/Bottom Boss Counter-Question Panel (7 cols) */}
        <section className="lg:col-span-7 space-y-4">
          {question.type === 'visual' && question.diagramId && (
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[0_4px_0_#0F172A]">
              <div className="text-xs font-bold text-slate-600 mb-2">
                終極看圖考驗 · 仔細觀察圖片並發動 {activeWeapon.name}！
              </div>
              <CurriculumDiagram diagramId={question.diagramId} focus={question.diagramFocus} />
            </div>
          )}

          <QuestionPanel
            question={question}
            questionNumber={roundNumber}
            evaluation={evaluation}
            onSubmitAnswer={onSubmitAnswer}
            onNext={onNextRound}
            nextButtonLabel={bossHp <= 0 ? '查看勝利戰果' : '下一擊！'}
          />
        </section>
      </div>
    </main>
  );
};
