import { ALL_QUESTIONS, buildParametricQuestions } from '../data/questionBank';
import { BOSS_MAX_HP, HERO_MAX_HP, STAGES, WEAPONS } from '../data/stagesAndWeapons';
import {
  AnswerEvaluation,
  DomainMasteryItem,
  DomainStat,
  GameMode,
  HumanitiesDomain,
  Question,
  QuestionType,
  Weapon,
} from '../types/game';

export const TIMED_CHALLENGE_SECONDS = 60;
export const TIMED_CHALLENGE_QUESTION_COUNT = 5;
export const TIMED_WEAPON_BONUS = 10;

/**
 * Fisher-Yates shuffle using a provided RNG function (defaults to Math.random).
 */
export function shuffleArray<T>(items: T[], rng: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Shuffles the options of an MC/Visual question while tracking the updated correctIndex.
 */
export function shuffleQuestionOptions(q: Question, rng: () => number = Math.random): Question {
  if ((q.type !== 'mc' && q.type !== 'visual') || !q.options || q.correctIndex === undefined) {
    if (q.type === 'fill' && q.wordBank) {
      return {
        ...q,
        wordBank: shuffleArray(q.wordBank, rng),
      };
    }
    return q;
  }

  const indexed = q.options.map((opt, idx) => ({
    opt,
    isCorrect: idx === q.correctIndex,
  }));
  const shuffled = shuffleArray(indexed, rng);
  return {
    ...q,
    options: shuffled.map((item) => item.opt),
    correctIndex: shuffled.findIndex((item) => item.isCorrect),
  };
}

/**
 * Selects between 5 and 15 fresh questions for a given stage.
 * Guarantees format variety (MC, TF, Fill, Visual) and avoids repeating recently seen IDs.
 */
export function pickStageQuestions(
  stageId: number,
  requestedCount = 15,
  recentlySeenIds: Set<string> = new Set(),
  rng: () => number = Math.random,
): Question[] {
  const count = Math.max(5, Math.min(15, requestedCount));
  const parametric = buildParametricQuestions(rng).filter((q) => q.stageId === stageId);
  const pool = [...ALL_QUESTIONS.filter((q) => q.stageId === stageId), ...parametric];

  const unseen = pool.filter((q) => !recentlySeenIds.has(q.id));
  const seen = pool.filter((q) => recentlySeenIds.has(q.id));

  // Prioritize unseen questions, fall back to seen if pool is smaller
  const prioritized = [...shuffleArray(unseen, rng), ...shuffleArray(seen, rng)];

  const selected: Question[] = [];
  const usedIds = new Set<string>();

  // First pass: guarantee at least 1 question from each available format ('visual', 'mc', 'tf', 'fill')
  const desiredFormats: QuestionType[] = ['visual', 'mc', 'tf', 'fill'];
  for (const fmt of desiredFormats) {
    if (selected.length >= count) break;
    const match = prioritized.find((q) => q.type === fmt && !usedIds.has(q.id));
    if (match) {
      selected.push(match);
      usedIds.add(match.id);
    }
  }

  // Second pass: fill up to `count` from remaining prioritized questions
  for (const q of prioritized) {
    if (selected.length >= count) break;
    if (!usedIds.has(q.id)) {
      selected.push(q);
      usedIds.add(q.id);
    }
  }

  // Shuffle order of selected questions & their internal options so each run feels brand new
  return shuffleArray(selected, rng).map((q) => shuffleQuestionOptions(q, rng));
}

/**
 * Selects randomized cross-curriculum questions for the Final Boss Battle.
 */
export function pickBossQuestions(
  count = 10,
  recentlySeenIds: Set<string> = new Set(),
  rng: () => number = Math.random,
): Question[] {
  const parametric = buildParametricQuestions(rng);
  const pool = [...ALL_QUESTIONS, ...parametric];
  const unseen = shuffleArray(
    pool.filter((q) => !recentlySeenIds.has(q.id)),
    rng,
  );
  const seen = shuffleArray(
    pool.filter((q) => recentlySeenIds.has(q.id)),
    rng,
  );
  const combined = [...unseen, ...seen].slice(0, count);
  return combined.map((q) => shuffleQuestionOptions(q, rng));
}

/**
 * Normalizes student text input for fill-in-the-blank tolerance.
 */
export function normalizeFillText(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, '')
    .replace(/[。，、！？「」『』（）()]/g, '')
    .toLowerCase();
}

/**
 * Evaluates a user's answer across MC, Visual, True/False, and Fill-in-the-blank formats.
 */
export function evaluateAnswer(
  question: Question,
  submission: { selectedIndex?: number; selectedBoolean?: boolean; textAnswer?: string },
): AnswerEvaluation {
  if (question.type === 'mc' || question.type === 'visual') {
    const correctIdx = question.correctIndex ?? 0;
    const correctDisplay = question.options?.[correctIdx] ?? '';
    return {
      isCorrect: submission.selectedIndex === correctIdx,
      correctAnswerDisplay: correctDisplay,
    };
  }

  if (question.type === 'tf') {
    const expected = Boolean(question.correctBoolean);
    return {
      isCorrect: submission.selectedBoolean === expected,
      correctAnswerDisplay: expected ? '✓ 正確' : `✗ 錯誤（${question.correctionHint ?? '需修正'}）`,
    };
  }

  // Fill-in-the-blank
  const accepted = question.acceptedAnswers ?? [];
  const normalizedUser = normalizeFillText(submission.textAnswer ?? '');
  const isCorrect =
    normalizedUser.length > 0 &&
    accepted.some((ans) => normalizeFillText(ans) === normalizedUser);

  return {
    isCorrect,
    correctAnswerDisplay: accepted[0] ?? '',
  };
}

/**
 * Computes score gain & streak update for a question answer.
 */
export function computeScoreUpdate(
  currentScore: number,
  currentStreak: number,
  isCorrect: boolean,
): { nextScore: number; nextStreak: number; deltaScore: number } {
  if (!isCorrect) {
    return {
      nextScore: currentScore,
      nextStreak: 0,
      deltaScore: 0,
    };
  }
  const nextStreak = currentStreak + 1;
  const streakBonus = Math.min(nextStreak - 1, 5) * 15;
  const deltaScore = 100 + streakBonus;
  return {
    nextScore: currentScore + deltaScore,
    nextStreak,
    deltaScore,
  };
}

/**
 * Evaluates whether a player earned the Timed Challenge weapon enhancement bonus.
 * Requires timed mode, all 5 questions answered correctly, and remaining time > 0.
 */
export function evaluateTimedChallengeBonus(
  mode: GameMode,
  correctCount: number,
  totalCount: number,
  remainingSec: number,
): { bonusAwarded: boolean; bonusAmount: number } {
  const qualified =
    mode === 'timed' &&
    remainingSec > 0 &&
    totalCount === TIMED_CHALLENGE_QUESTION_COUNT &&
    correctCount === totalCount;

  return {
    bonusAwarded: qualified,
    bonusAmount: qualified ? TIMED_WEAPON_BONUS : 0,
  };
}

/**
 * Computes weapon attack damage against the Final Boss (including timed bonus & streak critical bonus).
 */
export function computeBossStrikeDamage(
  weapon: Weapon,
  streak: number,
  bonusDamage = 0,
): number {
  const streakMultiplier = 1 + Math.min(streak, 4) * 0.1;
  return Math.round((weapon.damage + bonusDamage) * streakMultiplier);
}

/**
 * Determines whether the player has unlocked enough weapons to enter the Boss Arena.
 * At least 1 weapon is required so players can immediately try their weapon after Stage 1,
 * while collecting all 6 weapons grants full firepower.
 */
export function canChallengeBoss(unlockedWeaponIds: string[]): boolean {
  return unlockedWeaponIds.length >= 1;
}

export function getWeaponForStage(stageId: number): Weapon | undefined {
  const stage = STAGES.find((s) => s.id === stageId);
  if (!stage) return undefined;
  return WEAPONS.find((w) => w.id === stage.weaponId);
}

export function checkBossBattleOutcome(bossHp: number, heroHp: number): 'ongoing' | 'victory' | 'defeat' {
  if (bossHp <= 0) return 'victory';
  if (heroHp <= 0) return 'defeat';
  return 'ongoing';
}

export function clampHp(value: number, max: number): number {
  return Math.max(0, Math.min(max, value));
}

export const HUMANITIES_DOMAINS: Array<{
  id: HumanitiesDomain;
  label: string;
  shortLabel: string;
  color: string;
  recommendedStage: string;
}> = [
  {
    id: 'geography',
    label: '地理與氣象',
    shortLabel: '地理氣象',
    color: '#0055BF',
    recommendedStage: '第 1–3 關',
  },
  {
    id: 'environment',
    label: '地球與環保',
    shortLabel: '地球環保',
    color: '#237841',
    recommendedStage: '第 3–4 關',
  },
  {
    id: 'history_culture',
    label: '歷史與文化',
    shortLabel: '歷史文化',
    color: '#7C3AED',
    recommendedStage: '第 1、5 關',
  },
  {
    id: 'health',
    label: '身心健康',
    shortLabel: '身心健康',
    color: '#0D9488',
    recommendedStage: '第 6 關',
  },
  {
    id: 'civics',
    label: '社會規範與公民',
    shortLabel: '社會規範',
    color: '#D97706',
    recommendedStage: '第 5–6 關',
  },
];

export function createInitialDomainStats(): Record<HumanitiesDomain, DomainStat> {
  return {
    geography: { answered: 0, correct: 0 },
    environment: { answered: 0, correct: 0 },
    history_culture: { answered: 0, correct: 0 },
    health: { answered: 0, correct: 0 },
    civics: { answered: 0, correct: 0 },
  };
}

const HISTORY_STAGE1_TAGS = new Set([
  '昔日香港歷史事件',
  '昔日香港制水',
  '香港開埠初期',
  '香港水庫歷史',
]);

const CIVICS_TAGS = new Set([
  '香港防貪機構',
  '中國傳統飲食禮儀',
  '文化全球化態度',
  '中華傳統美德',
  '病人四大權益',
  '病人責任與服藥',
  '病人責任',
  '看圖識病人權益',
  '《基本法》與一國兩制',
  '《基本法》憲制基礎',
  '香港居民義務',
  '大眾傳播與分辨資訊',
  '智慧使用資訊科技',
  '資訊素養與版權',
  '網絡安全與反欺凌',
]);

const ENVIRONMENT_TAGS = new Set([
  '香港生態保育',
  '天然資源分類',
  '天然資源與日常用品',
  '礦產資源',
]);

/**
 * Classifies any curriculum question into one of the 5 Primary 4 Humanities knowledge domains.
 */
export function getQuestionDomain(question: Question): HumanitiesDomain {
  const tag = question.topicTag;

  if (CIVICS_TAGS.has(tag)) return 'civics';
  if (ENVIRONMENT_TAGS.has(tag)) return 'environment';
  if (HISTORY_STAGE1_TAGS.has(tag)) return 'history_culture';

  switch (question.stageId) {
    case 1:
    case 2:
    case 3:
      return 'geography';
    case 4:
      return 'environment';
    case 5:
      return 'history_culture';
    case 6:
      return 'health';
    default:
      return 'geography';
  }
}

export function recordDomainAnswer(
  domainStats: Record<HumanitiesDomain, DomainStat>,
  question: Question,
  isCorrect: boolean,
): Record<HumanitiesDomain, DomainStat> {
  const domain = getQuestionDomain(question);
  const prev = domainStats[domain] ?? { answered: 0, correct: 0 };
  return {
    ...domainStats,
    [domain]: {
      answered: prev.answered + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
    },
  };
}

export function summarizeDomainMastery(
  domainStats: Record<HumanitiesDomain, DomainStat>,
): {
  items: DomainMasteryItem[];
  strongest: DomainMasteryItem | null;
  weakest: DomainMasteryItem | null;
  testedCount: number;
} {
  const items: DomainMasteryItem[] = HUMANITIES_DOMAINS.map((meta) => {
    const stat = domainStats[meta.id] ?? { answered: 0, correct: 0 };
    const accuracyPct =
      stat.answered > 0 ? Math.round((stat.correct / stat.answered) * 100) : null;

    let level: DomainMasteryItem['level'] = 'untested';
    let levelLabel = '尚未作答';
    if (accuracyPct !== null) {
      if (accuracyPct >= 80) {
        level = 'strong';
        levelLabel = '表現優異';
      } else if (accuracyPct >= 60) {
        level = 'good';
        levelLabel = '穩步掌握';
      } else {
        level = 'weak';
        levelLabel = '建議加強';
      }
    }

    return {
      id: meta.id,
      label: meta.label,
      shortLabel: meta.shortLabel,
      color: meta.color,
      recommendedStage: meta.recommendedStage,
      answered: stat.answered,
      correct: stat.correct,
      accuracyPct,
      level,
      levelLabel,
    };
  });

  const tested = items.filter((item) => item.answered > 0 && item.accuracyPct !== null);
  const testedCount = tested.length;

  let strongest: DomainMasteryItem | null = null;
  if (tested.length > 0) {
    const top = [...tested].sort((a, b) => {
      const diff = (b.accuracyPct ?? 0) - (a.accuracyPct ?? 0);
      return diff !== 0 ? diff : b.answered - a.answered;
    })[0];
    if ((top.accuracyPct ?? 0) >= 60) {
      strongest = top;
    }
  }

  let weakest: DomainMasteryItem | null = null;
  const needsPractice = tested.filter((item) => (item.accuracyPct ?? 0) < 80);
  if (needsPractice.length > 0) {
    weakest = [...needsPractice].sort((a, b) => {
      const diff = (a.accuracyPct ?? 0) - (b.accuracyPct ?? 0);
      return diff !== 0 ? diff : b.answered - a.answered;
    })[0];
  }

  return {
    items,
    strongest,
    weakest,
    testedCount,
  };
}

export { BOSS_MAX_HP, HERO_MAX_HP };
