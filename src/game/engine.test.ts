import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canChallengeBoss,
  checkBossBattleOutcome,
  computeBossStrikeDamage,
  computeScoreUpdate,
  createInitialDomainStats,
  evaluateAnswer,
  evaluateTimedChallengeBonus,
  getQuestionDomain,
  HUMANITIES_DOMAINS,
  pickBossQuestions,
  pickStageQuestions,
  recordDomainAnswer,
  summarizeDomainMastery,
  TIMED_CHALLENGE_QUESTION_COUNT,
  TIMED_WEAPON_BONUS,
} from './engine';
import { ALL_QUESTIONS } from '../data/questionBank';
import { STAGES, WEAPONS } from '../data/stagesAndWeapons';

test('pickStageQuestions returns 5 to 15 questions per stage and enforces format diversity', () => {
  assert.equal(STAGES.length, 6, 'Should include all 6 curriculum stages');
  assert.equal(WEAPONS.length, 6, 'Should include 6 unlockable LEGO weapons');

  for (const stage of STAGES) {
    for (const count of [5, 10, 15]) {
      const qs = pickStageQuestions(stage.id, count, new Set());
      assert.equal(qs.length, count, `Stage ${stage.id} should return ${count} questions`);

      const uniqueIds = new Set(qs.map((q) => q.id));
      assert.equal(uniqueIds.size, count, `Stage ${stage.id} should not return duplicate questions`);

      const types = new Set(qs.map((q) => q.type));
      assert.ok(types.has('mc'), `Stage ${stage.id} should include mc`);
      assert.ok(types.has('tf'), `Stage ${stage.id} should include tf`);
      assert.ok(types.has('fill'), `Stage ${stage.id} should include fill`);
      assert.ok(types.has('visual'), `Stage ${stage.id} should include visual`);
    }
  }
});

test('pickStageQuestions avoids recently seen questions on consecutive 15-question runs', () => {
  for (const stage of STAGES) {
    const firstRun = pickStageQuestions(stage.id, 15, new Set());
    const seen = new Set(firstRun.map((q) => q.id));
    const secondRun = pickStageQuestions(stage.id, 15, seen);

    const overlapCount = secondRun.filter((q) => seen.has(q.id)).length;
    assert.ok(
      overlapCount <= 2,
      `Stage ${stage.id} second 15-question run should mostly introduce unseen questions (overlap=${overlapCount})`,
    );
  }
});

test('enriched question bank has unique IDs, valid fields, and >= 28 questions per stage', () => {
  const seenIds = new Set<string>();
  const stageCounts: Record<number, number> = {};

  for (const q of ALL_QUESTIONS) {
    assert.equal(seenIds.has(q.id), false, `Duplicate question id: ${q.id}`);
    seenIds.add(q.id);
    stageCounts[q.stageId] = (stageCounts[q.stageId] ?? 0) + 1;

    if (q.type === 'mc' || q.type === 'visual') {
      assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Missing options on ${q.id}`);
      assert.ok(
        typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < q.options.length,
        `Invalid correctIndex on ${q.id}`,
      );
    }
    if (q.type === 'visual') {
      assert.ok(Boolean(q.diagramId), `Visual question ${q.id} must specify diagramId`);
    }
    if (q.type === 'fill') {
      assert.ok(
        Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.length > 0,
        `Fill question ${q.id} must have acceptedAnswers`,
      );
    }
  }

  for (const stage of STAGES) {
    assert.ok(
      (stageCounts[stage.id] ?? 0) >= 28,
      `Stage ${stage.id} has ${stageCounts[stage.id] ?? 0} questions, expected >= 28`,
    );
  }
});

test('evaluateAnswer handles mc, tf, fill, and visual correctly', () => {
  const mcQ = {
    id: 'test-mc',
    stageId: 1,
    type: 'mc' as const,
    topicTag: 'test',
    prompt: 'Q',
    options: ['正確', '錯誤'],
    correctIndex: 0,
    explanation: 'exp',
  };
  assert.equal(evaluateAnswer(mcQ, { selectedIndex: 0 }).isCorrect, true);
  assert.equal(evaluateAnswer(mcQ, { selectedIndex: 1 }).isCorrect, false);

  const tfQ = {
    id: 'test-tf',
    stageId: 1,
    type: 'tf' as const,
    topicTag: 'test',
    prompt: 'Q',
    correctBoolean: false,
    correctionHint: '應改為大帽山',
    explanation: 'exp',
  };
  assert.equal(evaluateAnswer(tfQ, { selectedBoolean: false }).isCorrect, true);
  assert.equal(evaluateAnswer(tfQ, { selectedBoolean: true }).isCorrect, false);

  const fillQ = {
    id: 'test-fill',
    stageId: 1,
    type: 'fill' as const,
    topicTag: 'test',
    prompt: 'Q',
    acceptedAnswers: ['大帽山'],
    explanation: 'exp',
  };
  assert.equal(evaluateAnswer(fillQ, { textAnswer: ' 大帽山。 ' }).isCorrect, true);
  assert.equal(evaluateAnswer(fillQ, { textAnswer: '' }).isCorrect, false);
  assert.equal(evaluateAnswer(fillQ, { textAnswer: '鳳凰山' }).isCorrect, false);
});

test('score update and boss strike damage scale with streak', () => {
  const s1 = computeScoreUpdate(0, 0, true);
  assert.equal(s1.nextScore, 100);
  assert.equal(s1.nextStreak, 1);

  const s2 = computeScoreUpdate(s1.nextScore, s1.nextStreak, true);
  assert.equal(s2.nextScore, 215);
  assert.equal(s2.nextStreak, 2);

  const sMiss = computeScoreUpdate(s2.nextScore, s2.nextStreak, false);
  assert.equal(sMiss.nextStreak, 0);
  assert.equal(sMiss.nextScore, 215);

  const weapon = WEAPONS[0];
  assert.ok(computeBossStrikeDamage(weapon, 3) > computeBossStrikeDamage(weapon, 0));
});

test('boss entry and victory/defeat thresholds work as expected', () => {
  assert.equal(canChallengeBoss([]), false);
  assert.equal(canChallengeBoss(['grid-laser']), true);

  assert.equal(checkBossBattleOutcome(0, 3), 'victory');
  assert.equal(checkBossBattleOutcome(40, 0), 'defeat');
  assert.equal(checkBossBattleOutcome(40, 2), 'ongoing');

  const bossQs = pickBossQuestions(10, new Set());
  assert.equal(bossQs.length, 10);
});

test('timed challenge awards weapon bonus only when 5/5 answered within 60 seconds', () => {
  const win = evaluateTimedChallengeBonus('timed', 5, TIMED_CHALLENGE_QUESTION_COUNT, 18);
  assert.deepEqual(win, { bonusAwarded: true, bonusAmount: TIMED_WEAPON_BONUS });

  const imperfect = evaluateTimedChallengeBonus('timed', 4, TIMED_CHALLENGE_QUESTION_COUNT, 25);
  assert.deepEqual(imperfect, { bonusAwarded: false, bonusAmount: 0 });

  const timeout = evaluateTimedChallengeBonus('timed', 5, TIMED_CHALLENGE_QUESTION_COUNT, 0);
  assert.deepEqual(timeout, { bonusAwarded: false, bonusAmount: 0 });

  const standard = evaluateTimedChallengeBonus('standard', 5, TIMED_CHALLENGE_QUESTION_COUNT, 40);
  assert.deepEqual(standard, { bonusAwarded: false, bonusAmount: 0 });

  const weapon = WEAPONS[0];
  const baseDmg = computeBossStrikeDamage(weapon, 0, 0);
  const enhancedDmg = computeBossStrikeDamage(weapon, 0, TIMED_WEAPON_BONUS);
  assert.equal(enhancedDmg, baseDmg + TIMED_WEAPON_BONUS);
});

test('getQuestionDomain covers all 5 humanities domains across ALL_QUESTIONS', () => {
  const counts: Record<string, number> = {};
  for (const q of ALL_QUESTIONS) {
    const domain = getQuestionDomain(q);
    counts[domain] = (counts[domain] ?? 0) + 1;
  }

  for (const domainMeta of HUMANITIES_DOMAINS) {
    assert.ok(
      (counts[domainMeta.id] ?? 0) >= 10,
      `Domain ${domainMeta.id} should have >= 10 questions (got ${counts[domainMeta.id] ?? 0})`,
    );
  }
});

test('recordDomainAnswer and summarizeDomainMastery compute domain accuracies and strengths/weaknesses', () => {
  let stats = createInitialDomainStats();
  const emptySummary = summarizeDomainMastery(stats);
  assert.equal(emptySummary.testedCount, 0);
  assert.equal(emptySummary.strongest, null);
  assert.equal(emptySummary.weakest, null);

  const geoQ = ALL_QUESTIONS.find((q) => getQuestionDomain(q) === 'geography')!;
  const histQ = ALL_QUESTIONS.find((q) => getQuestionDomain(q) === 'history_culture')!;
  const civicsQ = ALL_QUESTIONS.find((q) => getQuestionDomain(q) === 'civics')!;

  // Geography: 2/2 (100%)
  stats = recordDomainAnswer(stats, geoQ, true);
  stats = recordDomainAnswer(stats, geoQ, true);
  // History: 1/2 (50%)
  stats = recordDomainAnswer(stats, histQ, true);
  stats = recordDomainAnswer(stats, histQ, false);
  // Civics: 1/3 (33%)
  stats = recordDomainAnswer(stats, civicsQ, true);
  stats = recordDomainAnswer(stats, civicsQ, false);
  stats = recordDomainAnswer(stats, civicsQ, false);

  const summary = summarizeDomainMastery(stats);
  assert.equal(summary.testedCount, 3);
  assert.equal(summary.strongest?.id, 'geography');
  assert.equal(summary.strongest?.accuracyPct, 100);
  assert.equal(summary.weakest?.id, 'civics');
  assert.equal(summary.weakest?.accuracyPct, 33);

  // When all tested domains are below 60% (e.g., 0%), strongest should be null while weakest is populated
  let lowStats = createInitialDomainStats();
  lowStats = recordDomainAnswer(lowStats, geoQ, false);
  lowStats = recordDomainAnswer(lowStats, civicsQ, false);
  const lowSummary = summarizeDomainMastery(lowStats);
  assert.equal(lowSummary.testedCount, 2);
  assert.equal(lowSummary.strongest, null);
  assert.ok(lowSummary.weakest !== null);
  assert.equal(lowSummary.weakest?.accuracyPct, 0);
});
