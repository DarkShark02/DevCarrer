import { db, transaction, LOCAL_PLAYER_ID } from './db.js';
import { CAREER_LEVELS, MODULES, describeLevel, levelIndexFor, moduleTitle } from './career.js';
import { EXERCISES, moduleProgress, doneModules } from './exercises/index.js';
import { getItem, effectsFor } from './shop.js';

const q = {
  player: db.prepare('SELECT id, name, balance FROM players WHERE id = ?'),
  completedIds: db.prepare('SELECT exercise_id FROM completions WHERE player_id = ?'),
  insertCompletion: db.prepare(
    'INSERT OR IGNORE INTO completions (player_id, exercise_id, reward, code) VALUES (?, ?, ?, ?)',
  ),
  addBalance: db.prepare('UPDATE players SET balance = balance + ? WHERE id = ?'),
  insertAttempt: db.prepare(
    'INSERT INTO attempts (player_id, exercise_id, passed) VALUES (?, ?, ?)',
  ),
  inventory: db.prepare('SELECT item_id, equipped FROM inventory WHERE player_id = ?'),
  insertItem: db.prepare('INSERT INTO inventory (player_id, item_id, price) VALUES (?, ?, ?)'),
  setEquipped: db.prepare('UPDATE inventory SET equipped = ? WHERE player_id = ? AND item_id = ?'),
  lessonProgress: db.prepare('SELECT lesson_id, viewed, quiz_best FROM lesson_progress WHERE player_id = ?'),
  saveLessonProgress: db.prepare(`
    INSERT INTO lesson_progress (player_id, lesson_id, viewed, quiz_best) VALUES (?, ?, ?, ?)
    ON CONFLICT (player_id, lesson_id) DO UPDATE SET
      viewed = max(viewed, excluded.viewed),
      quiz_best = CASE
        WHEN excluded.quiz_best IS NULL THEN quiz_best
        WHEN quiz_best IS NULL THEN excluded.quiz_best
        ELSE max(quiz_best, excluded.quiz_best)
      END,
      updated_at = datetime('now')
  `),
};

export function completedSet(playerId = LOCAL_PLAYER_ID) {
  return new Set(q.completedIds.all(playerId).map((r) => r.exercise_id));
}

// item_id → { equipped }
export function inventory(playerId = LOCAL_PLAYER_ID) {
  return new Map(q.inventory.all(playerId).map((r) => [r.item_id, { equipped: !!r.equipped }]));
}

function equippedIds(playerId) {
  return [...inventory(playerId)].filter(([, v]) => v.equipped).map(([id]) => id);
}

// Il grado si ricava dagli esercizi completati: non si perde mai, perché i completamenti
// non si cancellano, e non dipende dal saldo, che scende con gli acquisti.
export function currentLevelIndex(completed) {
  return levelIndexFor(doneModules(moduleProgress(completed)));
}

export function playerState(locale, playerId = LOCAL_PLAYER_ID) {
  const p = q.player.get(playerId);
  const completed = completedSet(playerId);
  const progress = moduleProgress(completed);
  const idx = levelIndexFor(doneModules(progress));
  const next = CAREER_LEVELS[idx + 1];
  const withProgress = (module) => ({
    module,
    title: moduleTitle(module, locale),
    ...(progress.get(module) ?? { done: 0, total: 0 }),
  });
  const desk = equippedIds(playerId);
  return {
    name: p.name,
    balance: p.balance,
    completedCount: completed.size,
    totalExercises: EXERCISES.length,
    level: describeLevel(CAREER_LEVELS[idx], locale),
    nextLevel: next
      ? { ...describeLevel(next, locale), requirements: next.requires.map(withProgress) }
      : null,
    modules: MODULES.map((m) => withProgress(m.id)),
    desk,
    effects: effectsFor(desk),
  };
}

export function isUnlocked(exercise, completed) {
  return !exercise.prerequisite || completed.has(exercise.prerequisite);
}

export function recordAttempt(exerciseId, passed, playerId = LOCAL_PLAYER_ID) {
  q.insertAttempt.run(playerId, exerciseId, passed ? 1 : 0);
}

// Registra il completamento. La ricompensa si incassa solo la prima volta,
// maggiorata se sulla scrivania c'è la macchina espresso.
export function completeExercise(exercise, code, locale, playerId = LOCAL_PLAYER_ID) {
  return transaction(() => {
    const before = currentLevelIndex(completedSet(playerId));
    const { rewardMultiplier } = effectsFor(equippedIds(playerId));
    const reward = Math.round(exercise.reward * rewardMultiplier);
    const { changes } = q.insertCompletion.run(playerId, exercise.id, reward, code);
    const firstTime = changes > 0;
    if (firstTime) q.addBalance.run(reward, playerId);

    const after = currentLevelIndex(completedSet(playerId));
    const promotion = after > before ? describeLevel(CAREER_LEVELS[after], locale) : null;
    return {
      reward: firstTime ? reward : 0,
      bonus: firstTime ? reward - exercise.reward : 0,
      firstTime,
      promotion,
    };
  });
}

// Acquisto: restituisce null se va a buon fine, altrimenti la chiave del messaggio d'errore.
export function buyItem(itemId, playerId = LOCAL_PLAYER_ID) {
  const item = getItem(itemId);
  if (!item) return 'itemNotFound';
  return transaction(() => {
    if (inventory(playerId).has(itemId)) return 'alreadyOwned';
    if (q.player.get(playerId).balance < item.price) return 'notEnoughMoney';
    q.insertItem.run(playerId, itemId, item.price);
    q.addBalance.run(-item.price, playerId);
    return null;
  });
}

// lesson_id → { viewed, quizBest }
export function lessonProgress(playerId = LOCAL_PLAYER_ID) {
  return new Map(
    q.lessonProgress.all(playerId).map((r) => [r.lesson_id, { viewed: !!r.viewed, quizBest: r.quiz_best }]),
  );
}

// Tiene il meglio: una lezione letta resta letta, il quiz conserva il punteggio più alto.
export function saveLessonProgress(lessonId, { viewed = false, quizScore = null }, playerId = LOCAL_PLAYER_ID) {
  q.saveLessonProgress.run(playerId, lessonId, viewed ? 1 : 0, quizScore);
}

export function equipItem(itemId, equipped, playerId = LOCAL_PLAYER_ID) {
  if (!getItem(itemId)) return 'itemNotFound';
  if (!inventory(playerId).has(itemId)) return 'notOwned';
  q.setEquipped.run(equipped ? 1 : 0, playerId, itemId);
  return null;
}
