import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import { AnswerEvaluation, Question } from '../types/game';

interface QuestionPanelProps {
  question: Question;
  questionNumber: number;
  totalQuestions?: number;
  evaluation: AnswerEvaluation | null;
  onSubmitAnswer: (submission: {
    selectedIndex?: number;
    selectedBoolean?: boolean;
    textAnswer?: string;
  }) => void;
  onNext: () => void;
  nextButtonLabel: string;
}

const TYPE_LABEL_MAP: Record<Question['type'], string> = {
  mc: '選擇題',
  tf: '是非題',
  fill: '填充題',
  visual: '看圖題',
};

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  question,
  questionNumber,
  totalQuestions,
  evaluation,
  onSubmitAnswer,
  onNext,
  nextButtonLabel,
}) => {
  const [fillInput, setFillInput] = useState('');
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  const [chosenBool, setChosenBool] = useState<boolean | null>(null);

  useEffect(() => {
    setFillInput('');
    setChosenIndex(null);
    setChosenBool(null);
  }, [question.id, questionNumber]);

  useEffect(() => {
    if (!evaluation) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [evaluation, onNext]);

  const handleMcClick = (idx: number) => {
    if (evaluation) return;
    setChosenIndex(idx);
    onSubmitAnswer({ selectedIndex: idx });
  };

  const handleTfClick = (val: boolean) => {
    if (evaluation) return;
    setChosenBool(val);
    onSubmitAnswer({ selectedBoolean: val });
  };

  const handleFillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (evaluation || !fillInput.trim()) return;
    onSubmitAnswer({ textAnswer: fillInput });
  };

  const handleWordBankChip = (word: string) => {
    if (evaluation) return;
    setFillInput(word);
  };

  const renderBlankTemplate = () => {
    if (!question.blankTemplate) return null;
    const parts = question.blankTemplate.split('______');
    return (
      <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200 text-base md:text-lg font-bold text-slate-900 leading-relaxed">
        {parts[0]}
        <span className="inline-block min-w-[90px] mx-1 px-3 py-0.5 border-b-3 border-[#0055BF] text-[#0055BF] text-center bg-white rounded-t">
          {fillInput.trim() ? fillInput : '______'}
        </span>
        {parts[1] ?? ''}
      </div>
    );
  };

  return (
    <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 md:p-6 shadow-[0_5px_0_#0F172A] flex flex-col justify-between gap-5">
      <div className="space-y-4">
        {/* Clean typographic kicker (no pill clutter) */}
        <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-500">
          <span>
            {TYPE_LABEL_MAP[question.type]} · {question.topicTag}
          </span>
          <span className="font-mono-num">
            {totalQuestions ? `第 ${questionNumber} / ${totalQuestions} 題` : `回合 ${questionNumber}`}
          </span>
        </div>

        {/* Question Prompt */}
        <h2 className="text-lg md:text-xl font-black text-slate-900 leading-snug whitespace-pre-line">
          {question.prompt}
        </h2>

        {/* Answer Input Zone by Type */}
        {(question.type === 'mc' || question.type === 'visual') && question.options && (
          <div className="grid grid-cols-1 gap-2.5">
            {question.options.map((opt, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx] ?? String(idx + 1);
              const isSelected = chosenIndex === idx;
              const isCorrectOpt = idx === question.correctIndex;

              let btnStyle =
                'bg-slate-50 hover:bg-amber-50 border-slate-300 hover:border-slate-900 text-slate-900 shadow-[0_3px_0_#CBD5E1] hover:shadow-[0_3px_0_#0F172A]';
              if (evaluation) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-50 border-emerald-700 text-emerald-950 shadow-[0_3px_0_#15803D]';
                } else if (isSelected && !evaluation.isCorrect) {
                  btnStyle = 'bg-red-50 border-red-700 text-red-950 shadow-[0_3px_0_#B91C1C]';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-75';
                }
              }

              return (
                <button
                  key={`${question.id}-opt-${idx}`}
                  type="button"
                  disabled={Boolean(evaluation)}
                  onClick={() => handleMcClick(idx)}
                  className={`brick-btn w-full text-left px-4 py-3 rounded-xl border-2 font-bold text-sm md:text-base flex items-center gap-3 cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  <span className="w-7 h-7 rounded-md bg-white border-2 border-current flex items-center justify-center text-xs font-black font-mono-num shrink-0">
                    {letter}
                  </span>
                  <span className="flex-1 leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {question.type === 'tf' && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            {[
              { val: true, label: '✓ 正確' },
              { val: false, label: '✗ 錯誤' },
            ].map((choice) => {
              const isSelected = chosenBool === choice.val;
              const isCorrectChoice = question.correctBoolean === choice.val;
              let btnStyle =
                'bg-slate-50 hover:bg-amber-50 border-slate-300 hover:border-slate-900 text-slate-900 shadow-[0_4px_0_#CBD5E1]';
              if (evaluation) {
                if (isCorrectChoice) {
                  btnStyle = 'bg-emerald-50 border-emerald-700 text-emerald-950 shadow-[0_4px_0_#15803D]';
                } else if (isSelected && !evaluation.isCorrect) {
                  btnStyle = 'bg-red-50 border-red-700 text-red-950 shadow-[0_4px_0_#B91C1C]';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-75';
                }
              }

              return (
                <button
                  key={String(choice.val)}
                  type="button"
                  disabled={Boolean(evaluation)}
                  onClick={() => handleTfClick(choice.val)}
                  className={`brick-btn py-4 px-4 rounded-xl border-2 text-lg font-black cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
        )}

        {question.type === 'fill' && (
          <form onSubmit={handleFillSubmit} className="space-y-3.5">
            {renderBlankTemplate()}

            {/* Clickable Brick Word-Bank Chips */}
            {question.wordBank && question.wordBank.length > 0 && (
              <div>
                <div className="text-xs font-bold text-slate-500 mb-2">
                  點擊積木字卡填入空格，或直接輸入答案：
                </div>
                <div className="flex flex-wrap gap-2">
                  {question.wordBank.map((word) => {
                    const active = fillInput.trim() === word;
                    return (
                      <button
                        key={word}
                        type="button"
                        disabled={Boolean(evaluation)}
                        onClick={() => handleWordBankChip(word)}
                        className={`brick-btn px-3.5 py-2 rounded-lg border-2 text-sm font-bold cursor-pointer disabled:cursor-default ${
                          active
                            ? 'bg-[#0055BF] text-white border-slate-900 shadow-[0_2px_0_#0F172A]'
                            : 'bg-amber-50 hover:bg-amber-100 text-slate-900 border-slate-900 shadow-[0_2px_0_#0F172A]'
                        }`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-2.5">
              <label htmlFor={`fill-input-${question.id}`} className="sr-only">
                填充答案輸入欄
              </label>
              <input
                id={`fill-input-${question.id}`}
                type="text"
                disabled={Boolean(evaluation)}
                value={fillInput}
                onChange={(e) => setFillInput(e.target.value)}
                placeholder="在此輸入或點選上方詞語..."
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-900 bg-white text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0055BF] disabled:bg-slate-100"
              />
              <button
                type="submit"
                disabled={Boolean(evaluation) || !fillInput.trim()}
                className="brick-btn px-5 py-2.5 rounded-xl border-2 border-slate-900 bg-[#237841] hover:bg-[#1B5E32] disabled:bg-slate-300 disabled:border-slate-400 text-white font-black text-sm shadow-[0_3px_0_#0F172A] disabled:shadow-none cursor-pointer whitespace-nowrap"
              >
                提交答案
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Instant Feedback & Workbook Insight */}
      {evaluation && (
        <div
          className={`rounded-xl border-2 p-4 space-y-3 ${
            evaluation.isCorrect
              ? 'bg-emerald-50 border-emerald-700 text-emerald-950'
              : 'bg-red-50 border-red-700 text-red-950'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {evaluation.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <XCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <div className="space-y-1 text-sm">
              <div className="font-black">
                {evaluation.isCorrect
                  ? '答對了！樂高積木能量充能成功！'
                  : `答錯了！正確答案：${evaluation.correctAnswerDisplay}`}
              </div>
              <p className="text-slate-800 leading-relaxed flex items-start gap-1.5">
                <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-slate-600" aria-hidden="true" />
                <span>習作重點：{question.explanation}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNext}
            className="brick-btn w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-slate-900 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-[0_3px_0_#334155] cursor-pointer"
          >
            <span>{nextButtonLabel}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};
