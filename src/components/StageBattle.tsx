import React from 'react';
import { AlertTriangle, Clock, Map, RotateCcw } from 'lucide-react';
import { TIMED_CHALLENGE_SECONDS } from '../game/engine';
import { AnswerEvaluation, GameMode, HeroCharacter, Question, StageInfo } from '../types/game';
import { CurriculumDiagram } from './CurriculumDiagrams';
import { LegoMinifig, StageGuardianSvg } from './LegoSprites';
import { QuestionPanel } from './QuestionPanel';

interface StageBattleProps {
  hero: HeroCharacter;
  stage: StageInfo;
  questions: Question[];
  currentIndex: number;
  evaluation: AnswerEvaluation | null;
  gameMode: GameMode;
  timeLeftSec: number;
  timedFailed: boolean;
  onSubmitAnswer: (submission: {
    selectedIndex?: number;
    selectedBoolean?: boolean;
    textAnswer?: string;
  }) => void;
  onNextQuestion: () => void;
  onRetryStage: () => void;
  onBackToMap: () => void;
}

export const StageBattle: React.FC<StageBattleProps> = ({
  hero,
  stage,
  questions,
  currentIndex,
  evaluation,
  gameMode,
  timeLeftSec,
  timedFailed,
  onSubmitAnswer,
  onNextQuestion,
  onRetryStage,
  onBackToMap,
}) => {
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const isLast = currentIndex === questions.length - 1;
  const heroPose = evaluation ? (evaluation.isCorrect ? 'attack' : 'hurt') : 'idle';
  const guardianHurt = Boolean(evaluation?.isCorrect);
  const isLowTime = timeLeftSec <= 15;
  const timerPct = Math.max(0, Math.min(100, (timeLeftSec / TIMED_CHALLENGE_SECONDS) * 100));

  return (
    <main className="relative flex-1 brick-baseplate-warm py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Top Visual Stage (5 cols on desktop) */}
        <section className="lg:col-span-5 bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[0_5px_0_#0F172A] space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-slate-500">{stage.themeLabel}</div>
              <h1 className="text-lg font-black text-slate-900">{stage.title}</h1>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-500">守護者</div>
              <div className="text-sm font-black" style={{ color: stage.color }}>
                {stage.guardianName}
              </div>
            </div>
          </div>

          {/* 60s Timed Challenge Countdown Strip */}
          {gameMode === 'timed' && (
            <div
              className={`p-3 rounded-xl border-2 border-slate-900 space-y-2 ${
                isLowTime ? 'bg-red-50' : 'bg-amber-50'
              }`}
              aria-live="polite"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-black ${
                    isLowTime ? 'text-red-800' : 'text-slate-900'
                  }`}
                >
                  {isLowTime ? (
                    <AlertTriangle className="w-4 h-4 text-[#D01012]" aria-hidden="true" />
                  ) : (
                    <Clock className="w-4 h-4 text-[#0055BF]" aria-hidden="true" />
                  )}
                  <span>{isLowTime ? '最後倒數！限時全對強化武器' : '限時挑戰倒數（全對武器 +10）'}</span>
                </span>
                <span
                  data-testid="timed-countdown"
                  className={`text-lg font-black font-mono-num whitespace-nowrap ${
                    isLowTime ? 'text-[#D01012]' : 'text-slate-900'
                  }`}
                >
                  {timeLeftSec}s
                </span>
              </div>
              <div className="h-2 w-full bg-white border border-slate-900 rounded-sm overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isLowTime ? 'bg-[#D01012]' : 'bg-[#0055BF]'
                  }`}
                  style={{ width: `${timerPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Brick Progress Track */}
          <div
            className={`flex items-center ${questions.length >= 12 ? 'gap-1' : 'gap-1.5'}`}
            aria-label={`關卡進度第 ${currentIndex + 1} 題，共 ${questions.length} 題`}
          >
            {questions.map((q, idx) => {
              const done = idx < currentIndex;
              const current = idx === currentIndex;
              return (
                <div
                  key={q.id}
                  className={`h-3 flex-1 rounded-sm border border-slate-900 transition-colors ${
                    done
                      ? 'bg-[#237841]'
                      : current
                      ? 'bg-[#F5CD2F]'
                      : 'bg-slate-100'
                  }`}
                />
              );
            })}
          </div>

          {/* Visual Diagram (if看圖題) OR Character Confrontation Diorama */}
          {currentQuestion.type === 'visual' && currentQuestion.diagramId ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>細心觀察下圖作答：</span>
                <span className="font-mono-num text-[#0055BF]">看圖挑戰</span>
              </div>
              <CurriculumDiagram
                diagramId={currentQuestion.diagramId}
                focus={currentQuestion.diagramFocus}
              />
              {/* Compact Hero vs Guardian strip below diagram */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <LegoMinifig hero={hero} pose={heroPose} size={56} />
                  <span className="text-xs font-bold text-slate-800">{hero.name}</span>
                </div>
                <span className="text-xs font-black text-slate-400">VS</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">{stage.guardianName}</span>
                  <StageGuardianSvg stageId={stage.id} hurt={guardianHurt} size={56} />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl border-2 border-slate-900 bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-100 p-4 sm:p-5 min-h-[210px] sm:min-h-[240px] flex items-end justify-between gap-2 overflow-hidden">
              {/* Background Brick Hills */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#237841] border-t-2 border-slate-900" />

              <div className={`relative z-10 shrink-0 ${heroPose === 'attack' ? 'animate-lunge-attack' : ''}`}>
                <LegoMinifig hero={hero} pose={heroPose} size={110} />
              </div>

              <div className="relative z-10 self-center text-center px-1 shrink-0">
                <div className="text-[11px] sm:text-xs font-black text-slate-500 mb-1 whitespace-nowrap">答對削弱防禦</div>
                <div className="px-3 py-1 rounded-lg bg-white border-2 border-slate-900 font-mono-num text-sm font-black text-slate-900 whitespace-nowrap">
                  {currentIndex + 1} / {questions.length}
                </div>
              </div>

              <div className="relative z-10 shrink-0">
                <StageGuardianSvg stageId={stage.id} hurt={guardianHurt} size={106} />
              </div>
            </div>
          )}
        </section>

        {/* Right/Bottom Interactive Question Panel (7 cols on desktop) */}
        <section className="lg:col-span-7">
          <QuestionPanel
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            evaluation={evaluation}
            onSubmitAnswer={onSubmitAnswer}
            onNext={onNextQuestion}
            nextButtonLabel={isLast ? '完成關卡・領取武器' : '下一題'}
          />
        </section>
      </div>

      {/* Time-Up Overlay for Timed Challenge */}
      {timedFailed && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/70 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="timed-failed-title"
        >
          <div className="w-full max-w-md bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[0_8px_0_#0F172A] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 border-2 border-slate-900 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-[#D01012]" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#D01012]">限時挑戰結束</div>
                <h2 id="timed-failed-title" className="text-xl font-black text-slate-900">
                  時間到！60 秒限時結束
                </h2>
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              未能在 {TIMED_CHALLENGE_SECONDS} 秒內完成全部 {questions.length} 題，本次未獲得額外武器強化加成。立即重試或返回地圖切換模式！
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
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
                onClick={onRetryStage}
                className="brick-btn flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-slate-900 bg-[#D01012] hover:bg-[#B80D0F] text-sm font-black text-white shadow-[0_3px_0_#0F172A] cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>重試限時挑戰</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
