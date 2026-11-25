export type QuestionType = 'mc' | 'tf' | 'fill' | 'visual';

export type VisualDiagramId =
  | 'hk-grid-map'
  | 'hk-relief-map'
  | 'weather-warnings'
  | 'weather-season-table'
  | 'world-continents'
  | 'traditional-dwellings'
  | 'earth-layers'
  | 'earthquake-safety'
  | 'water-habits'
  | 'hk-water-bill'
  | 'chinese-calligraphy'
  | 'chinese-instruments'
  | 'hk-heritage'
  | 'world-landmarks'
  | 'health-habits';

export interface Question {
  id: string;
  stageId: number;
  type: QuestionType;
  topicTag: string;
  prompt: string;
  // Multiple Choice / Visual Choice
  options?: string[];
  correctIndex?: number;
  // True / False
  correctBoolean?: boolean;
  correctionHint?: string;
  // Fill-in-the-blank
  acceptedAnswers?: string[];
  wordBank?: string[];
  blankTemplate?: string; // e.g. "香港最高山峰是 ______，位於新界中部。"
  // Visual Diagram reference
  diagramId?: VisualDiagramId;
  diagramFocus?: string;
  // Explanation shown after answering
  explanation: string;
}

export interface Weapon {
  id: string;
  stageId: number;
  name: string;
  englishName: string;
  role: string;
  damage: number;
  color: string;
  accentColor: string;
}

export interface StageInfo {
  id: number;
  title: string;
  subtitle: string;
  themeLabel: string;
  lessons: string;
  guardianName: string;
  color: string;
  borderColor: string;
  weaponId: string;
}

export interface HeroCharacter {
  id: 'explorer' | 'scholar' | 'ranger';
  name: string;
  role: string;
  helmetColor: string;
  torsoColor: string;
  accentColor: string;
}

export type GameMode = 'standard' | 'timed';

export type AppScreenState = 'title' | 'map' | 'stage' | 'stage_clear' | 'boss' | 'gameover';

export type HumanitiesDomain =
  | 'geography'
  | 'environment'
  | 'history_culture'
  | 'health'
  | 'civics';

export interface DomainStat {
  answered: number;
  correct: number;
}

export interface DomainMasteryItem {
  id: HumanitiesDomain;
  label: string;
  shortLabel: string;
  color: string;
  recommendedStage: string;
  answered: number;
  correct: number;
  accuracyPct: number | null;
  level: 'strong' | 'good' | 'weak' | 'untested';
  levelLabel: string;
}

export interface RunStats {
  score: number;
  totalAnswered: number;
  totalCorrect: number;
  streak: number;
  bestStreak: number;
  clearedStageIds: number[];
  unlockedWeaponIds: string[];
  weaponBonuses: Record<string, number>;
  domainStats: Record<HumanitiesDomain, DomainStat>;
  bossOutcome: 'victory' | 'defeat' | null;
  bossRemainingHp: number;
  startTimeMs: number;
  endTimeMs: number | null;
}

export interface AnswerEvaluation {
  isCorrect: boolean;
  correctAnswerDisplay: string;
}
