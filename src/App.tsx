import { useCallback, useEffect, useState } from 'react';
import { BossArena } from './components/BossArena';
import { GameHud } from './components/GameHud';
import { GameOverModal, PauseModal, StageClearModal } from './components/Modals';
import { OverworldMap } from './components/OverworldMap';
import { StageBattle } from './components/StageBattle';
import { TitleScreen } from './components/TitleScreen';
import {
  BOSS_MAX_HP,
  HERO_CHARACTERS,
  HERO_MAX_HP,
  STAGES,
  WEAPONS,
} from './data/stagesAndWeapons';
import {
  checkBossBattleOutcome,
  clampHp,
  computeBossStrikeDamage,
  computeScoreUpdate,
  createInitialDomainStats,
  evaluateAnswer,
  evaluateTimedChallengeBonus,
  getWeaponForStage,
  pickBossQuestions,
  pickStageQuestions,
  recordDomainAnswer,
  TIMED_CHALLENGE_QUESTION_COUNT,
  TIMED_CHALLENGE_SECONDS,
} from './game/engine';
import {
  AnswerEvaluation,
  AppScreenState,
  GameMode,
  HeroCharacter,
  Question,
  RunStats,
} from './types/game';
import { soundFx } from './utils/sound';

const INITIAL_STATS = (): RunStats => ({
  score: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  streak: 0,
  bestStreak: 0,
  clearedStageIds: [],
  unlockedWeaponIds: [],
  weaponBonuses: {},
  domainStats: createInitialDomainStats(),
  bossOutcome: null,
  bossRemainingHp: BOSS_MAX_HP,
  startTimeMs: Date.now(),
  endTimeMs: null,
});

export default function App() {
  const [screen, setScreen] = useState<AppScreenState>('title');
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);

  const [selectedHero, setSelectedHero] = useState<HeroCharacter>(HERO_CHARACTERS[0]);
  const [gameMode, setGameMode] = useState<GameMode>('standard');
  const [questionsPerStage, setQuestionsPerStage] = useState<number>(15);

  const [heroHp, setHeroHp] = useState<number>(HERO_MAX_HP);
  const [stats, setStats] = useState<RunStats>(INITIAL_STATS);
  const [recentlySeenIds, setRecentlySeenIds] = useState<Set<string>>(() => new Set());

  // Active Stage State
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [stageQuestions, setStageQuestions] = useState<Question[]>([]);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [stageCorrectCount, setStageCorrectCount] = useState<number>(0);
  const [currentEvaluation, setCurrentEvaluation] = useState<AnswerEvaluation | null>(null);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(TIMED_CHALLENGE_SECONDS);
  const [timedBonusEarnedThisStage, setTimedBonusEarnedThisStage] = useState<boolean>(false);
  const [timedFailedThisStage, setTimedFailedThisStage] = useState<boolean>(false);

  // Boss Battle State
  const [bossHp, setBossHp] = useState<number>(BOSS_MAX_HP);
  const [bossQuestions, setBossQuestions] = useState<Question[]>([]);
  const [bossIndex, setBossIndex] = useState<number>(0);
  const [bossRound, setBossRound] = useState<number>(1);
  const [selectedWeaponId, setSelectedWeaponId] = useState<string>(WEAPONS[0].id);
  const [lastDamageDealt, setLastDamageDealt] = useState<number | null>(null);

  // Sync document.body.dataset.state ('title' | 'playing' | 'paused' | 'gameover')
  useEffect(() => {
    if (paused) {
      document.body.dataset.state = 'paused';
    } else if (screen === 'title') {
      document.body.dataset.state = 'title';
    } else if (screen === 'gameover') {
      document.body.dataset.state = 'gameover';
    } else {
      document.body.dataset.state = 'playing';
    }
  }, [screen, paused]);

  const handleStartGame = useCallback(() => {
    soundFx.playBrickSnap();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setHeroHp(HERO_MAX_HP);
    setStats(INITIAL_STATS());
    setPaused(false);
    setScreen('map');
  }, []);

  // Support ?autostart=1 to jump directly into 'playing' map
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setScreen('map');
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      soundFx.setMuted(next);
      return next;
    });
  }, []);

  const handleSelectStage = useCallback(
    (stageId: number) => {
      soundFx.playBrickSnap();
      const targetCount =
        gameMode === 'timed' ? TIMED_CHALLENGE_QUESTION_COUNT : questionsPerStage;
      const qs = pickStageQuestions(stageId, targetCount, recentlySeenIds);
      setRecentlySeenIds((prev) => {
        const next = new Set(prev);
        qs.forEach((q) => next.add(q.id));
        if (next.size > 120) {
          // Keep buffer bounded so pool cycles smoothly
          return new Set(qs.map((q) => q.id));
        }
        return next;
      });
      setActiveStageId(stageId);
      setStageQuestions(qs);
      setStageIndex(0);
      setStageCorrectCount(0);
      setCurrentEvaluation(null);
      setTimeLeftSec(TIMED_CHALLENGE_SECONDS);
      setTimedBonusEarnedThisStage(false);
      setTimedFailedThisStage(false);
      setHeroHp((hp) => Math.max(hp, 3)); // Restore minimum 3 hearts when entering a fresh stage
      setScreen('stage');
    },
    [gameMode, questionsPerStage, recentlySeenIds],
  );

  // Stop countdown once the final question has been answered so students can read the explanation
  const finalQuestionAnswered =
    stageQuestions.length > 0 &&
    stageIndex === stageQuestions.length - 1 &&
    currentEvaluation !== null;

  useEffect(() => {
    if (
      screen !== 'stage' ||
      gameMode !== 'timed' ||
      paused ||
      timedFailedThisStage ||
      finalQuestionAnswered
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeftSec((prev) => {
        if (prev <= 1) {
          soundFx.playWrong();
          setTimedFailedThisStage(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [screen, gameMode, paused, timedFailedThisStage, finalQuestionAnswered]);

  const handleSubmitStageAnswer = useCallback(
    (submission: { selectedIndex?: number; selectedBoolean?: boolean; textAnswer?: string }) => {
      if (timedFailedThisStage) return;
      const q = stageQuestions[stageIndex];
      if (!q || currentEvaluation) return;

      const evalResult = evaluateAnswer(q, submission);
      setCurrentEvaluation(evalResult);

      if (evalResult.isCorrect) {
        soundFx.playCorrect();
        setStageCorrectCount((c) => c + 1);
      } else {
        soundFx.playWrong();
        setHeroHp((hp) => clampHp(hp - 1, HERO_MAX_HP));
      }

      setStats((prev) => {
        const { nextScore, nextStreak } = computeScoreUpdate(
          prev.score,
          prev.streak,
          evalResult.isCorrect,
        );
        return {
          ...prev,
          score: nextScore,
          streak: nextStreak,
          bestStreak: Math.max(prev.bestStreak, nextStreak),
          totalAnswered: prev.totalAnswered + 1,
          totalCorrect: prev.totalCorrect + (evalResult.isCorrect ? 1 : 0),
          domainStats: recordDomainAnswer(prev.domainStats, q, evalResult.isCorrect),
        };
      });
    },
    [stageQuestions, stageIndex, currentEvaluation, timedFailedThisStage],
  );

  const handleNextStageQuestion = useCallback(() => {
    if (timedFailedThisStage) return;
    soundFx.playBrickSnap();
    if (stageIndex + 1 < stageQuestions.length) {
      setStageIndex((i) => i + 1);
      setCurrentEvaluation(null);
      return;
    }

    // Stage Completed! Unlock weapon, check timed enhancement bonus, & record cleared stage
    const weapon = getWeaponForStage(activeStageId);
    const { bonusAwarded, bonusAmount } = evaluateTimedChallengeBonus(
      gameMode,
      stageCorrectCount,
      stageQuestions.length,
      timeLeftSec,
    );
    setTimedBonusEarnedThisStage(bonusAwarded);

    soundFx.playVictoryFanfare();
    setStats((prev) => {
      const cleared = prev.clearedStageIds.includes(activeStageId)
        ? prev.clearedStageIds
        : [...prev.clearedStageIds, activeStageId];
      const weapons =
        weapon && !prev.unlockedWeaponIds.includes(weapon.id)
          ? [...prev.unlockedWeaponIds, weapon.id]
          : prev.unlockedWeaponIds;
      const nextBonuses =
        weapon && bonusAwarded
          ? {
              ...prev.weaponBonuses,
              [weapon.id]: Math.max(prev.weaponBonuses[weapon.id] ?? 0, bonusAmount),
            }
          : prev.weaponBonuses;

      return {
        ...prev,
        clearedStageIds: cleared,
        unlockedWeaponIds: weapons,
        weaponBonuses: nextBonuses,
      };
    });
    setCurrentEvaluation(null);
    setScreen('stage_clear');
  }, [
    timedFailedThisStage,
    stageIndex,
    stageQuestions.length,
    activeStageId,
    gameMode,
    stageCorrectCount,
    timeLeftSec,
  ]);

  const handleEnterBoss = useCallback(() => {
    soundFx.playBrickSnap();
    const qs = pickBossQuestions(12, recentlySeenIds);
    setBossQuestions(qs);
    setBossIndex(0);
    setBossRound(1);
    setBossHp(BOSS_MAX_HP);
    setHeroHp(HERO_MAX_HP);
    setCurrentEvaluation(null);
    setLastDamageDealt(null);
    if (stats.unlockedWeaponIds.length > 0) {
      setSelectedWeaponId(stats.unlockedWeaponIds[0]);
    }
    setScreen('boss');
  }, [recentlySeenIds, stats.unlockedWeaponIds]);

  const handleSubmitBossAnswer = useCallback(
    (submission: { selectedIndex?: number; selectedBoolean?: boolean; textAnswer?: string }) => {
      const q = bossQuestions[bossIndex];
      if (!q || currentEvaluation) return;

      const evalResult = evaluateAnswer(q, submission);
      setCurrentEvaluation(evalResult);

      const activeWeapon =
        WEAPONS.find((w) => w.id === selectedWeaponId) ?? WEAPONS[0];
      const bonusDmg = stats.weaponBonuses[activeWeapon.id] ?? 0;

      if (evalResult.isCorrect) {
        soundFx.playWeaponStrike();
        const dmg = computeBossStrikeDamage(activeWeapon, stats.streak, bonusDmg);
        setLastDamageDealt(dmg);
        setBossHp((hp) => Math.max(0, hp - dmg));
      } else {
        soundFx.playWrong();
        setLastDamageDealt(null);
        setHeroHp((hp) => clampHp(hp - 1, HERO_MAX_HP));
      }

      setStats((prev) => {
        const { nextScore, nextStreak } = computeScoreUpdate(
          prev.score,
          prev.streak,
          evalResult.isCorrect,
        );
        return {
          ...prev,
          score: nextScore,
          streak: nextStreak,
          bestStreak: Math.max(prev.bestStreak, nextStreak),
          totalAnswered: prev.totalAnswered + 1,
          totalCorrect: prev.totalCorrect + (evalResult.isCorrect ? 1 : 0),
          domainStats: recordDomainAnswer(prev.domainStats, q, evalResult.isCorrect),
        };
      });
    },
    [bossQuestions, bossIndex, currentEvaluation, selectedWeaponId, stats.streak, stats.weaponBonuses],
  );

  const handleNextBossRound = useCallback(() => {
    const outcome = checkBossBattleOutcome(bossHp, heroHp);
    if (outcome !== 'ongoing') {
      if (outcome === 'victory') {
        soundFx.playVictoryFanfare();
      }
      setStats((prev) => ({
        ...prev,
        bossOutcome: outcome,
        bossRemainingHp: bossHp,
        endTimeMs: Date.now(),
      }));
      setScreen('gameover');
      return;
    }

    soundFx.playBrickSnap();
    setCurrentEvaluation(null);
    setLastDamageDealt(null);
    setBossRound((r) => r + 1);
    if (bossIndex + 1 < bossQuestions.length) {
      setBossIndex((i) => i + 1);
    } else {
      // Replenish fresh Boss questions if battle continues
      const more = pickBossQuestions(10, recentlySeenIds);
      setBossQuestions(more);
      setBossIndex(0);
    }
  }, [bossHp, heroHp, bossIndex, bossQuestions.length, recentlySeenIds]);

  // Global keyboard shortcuts (Title Enter/Space, Escape/P Pause, M Mute, 1-5 Boss Weapon select)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';

      if (screen === 'title' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleStartGame();
        return;
      }

      if (isTyping) return;

      if ((e.key === 'Escape' || e.key.toLowerCase() === 'p') && screen !== 'title' && screen !== 'gameover') {
        e.preventDefault();
        setPaused((p) => !p);
        return;
      }

      if (e.key.toLowerCase() === 'm' && screen !== 'title') {
        e.preventDefault();
        handleToggleMute();
        return;
      }

      if (screen === 'boss' && !currentEvaluation && ['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const idx = Number(e.key) - 1;
        const weapon = WEAPONS[idx];
        if (weapon && stats.unlockedWeaponIds.includes(weapon.id)) {
          setSelectedWeaponId(weapon.id);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [screen, handleStartGame, handleToggleMute, currentEvaluation, stats.unlockedWeaponIds]);

  if (screen === 'title') {
    return (
      <TitleScreen
        selectedHero={selectedHero}
        onSelectHero={setSelectedHero}
        gameMode={gameMode}
        onChangeGameMode={setGameMode}
        questionsPerStage={questionsPerStage}
        onChangeQuestionsPerStage={setQuestionsPerStage}
        onStart={handleStartGame}
      />
    );
  }

  const activeStage = STAGES.find((s) => s.id === activeStageId) ?? STAGES[0];
  const activeStageWeapon = getWeaponForStage(activeStageId) ?? WEAPONS[0];
  const locationLabel =
    screen === 'map'
      ? gameMode === 'timed'
        ? '冒險島嶼 · 限時挑戰模式'
        : '冒險島嶼總覽'
      : screen === 'boss'
      ? '火山要塞 · 終極決戰'
      : `${activeStage.title}${gameMode === 'timed' ? '（限時）' : ''}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f9]">
      <GameHud
        hero={selectedHero}
        heroHp={heroHp}
        maxHp={HERO_MAX_HP}
        score={stats.score}
        streak={stats.streak}
        unlockedWeaponIds={stats.unlockedWeaponIds}
        weaponBonuses={stats.weaponBonuses}
        locationLabel={locationLabel}
        muted={muted}
        showBackToMap={screen === 'stage' || screen === 'boss'}
        onToggleMute={handleToggleMute}
        onOpenPause={() => setPaused(true)}
        onBackToMap={() => {
          setCurrentEvaluation(null);
          setTimedFailedThisStage(false);
          setScreen('map');
        }}
      />

      {screen === 'map' && (
        <OverworldMap
          hero={selectedHero}
          clearedStageIds={stats.clearedStageIds}
          unlockedWeaponIds={stats.unlockedWeaponIds}
          weaponBonuses={stats.weaponBonuses}
          gameMode={gameMode}
          questionsPerStage={questionsPerStage}
          onSelectStage={handleSelectStage}
          onEnterBoss={handleEnterBoss}
          onChangeGameMode={setGameMode}
          onChangeQuestionsPerStage={setQuestionsPerStage}
        />
      )}

      {(screen === 'stage' || screen === 'stage_clear') && (
        <StageBattle
          hero={selectedHero}
          stage={activeStage}
          questions={stageQuestions}
          currentIndex={stageIndex}
          evaluation={currentEvaluation}
          gameMode={gameMode}
          timeLeftSec={timeLeftSec}
          timedFailed={timedFailedThisStage}
          onSubmitAnswer={handleSubmitStageAnswer}
          onNextQuestion={handleNextStageQuestion}
          onRetryStage={() => handleSelectStage(activeStageId)}
          onBackToMap={() => {
            setCurrentEvaluation(null);
            setTimedFailedThisStage(false);
            setScreen('map');
          }}
        />
      )}

      {(screen === 'boss' || screen === 'gameover') && bossQuestions[bossIndex] && (
        <BossArena
          hero={selectedHero}
          unlockedWeaponIds={stats.unlockedWeaponIds}
          weaponBonuses={stats.weaponBonuses}
          selectedWeaponId={selectedWeaponId}
          onSelectWeapon={setSelectedWeaponId}
          bossHp={bossHp}
          streak={stats.streak}
          question={bossQuestions[bossIndex]}
          roundNumber={bossRound}
          evaluation={currentEvaluation}
          lastDamageDealt={lastDamageDealt}
          onSubmitAnswer={handleSubmitBossAnswer}
          onNextRound={handleNextBossRound}
        />
      )}

      {screen === 'stage_clear' && (
        <StageClearModal
          hero={selectedHero}
          stage={activeStage}
          weapon={activeStageWeapon}
          stageCorrect={stageCorrectCount}
          stageTotal={stageQuestions.length}
          gameMode={gameMode}
          weaponBonusTotal={stats.weaponBonuses[activeStageWeapon.id] ?? 0}
          timedBonusJustEarned={timedBonusEarnedThisStage}
          timeRemainingSec={timeLeftSec}
          hasNextStage={activeStageId < STAGES.length}
          onNextStage={() => handleSelectStage(activeStageId + 1)}
          onBackToMap={() => setScreen('map')}
          onEnterBoss={handleEnterBoss}
        />
      )}

      {paused && (
        <PauseModal
          domainStats={stats.domainStats}
          onResume={() => setPaused(false)}
          onBackToMap={() => {
            setPaused(false);
            setCurrentEvaluation(null);
            setTimedFailedThisStage(false);
            setScreen('map');
          }}
          onRestartTitle={() => {
            setPaused(false);
            setTimedFailedThisStage(false);
            setScreen('title');
          }}
        />
      )}

      {screen === 'gameover' && (
        <GameOverModal
          hero={selectedHero}
          stats={stats}
          bossMaxHp={BOSS_MAX_HP}
          onPlayAgain={handleEnterBoss}
          onBackToMap={() => setScreen('map')}
        />
      )}
    </div>
  );
}
