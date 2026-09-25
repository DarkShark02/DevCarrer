import express from 'express';
import { LANGUAGES, getLanguage } from './languages.js';
import { execute, runtimes, PISTON_URL } from './piston.js';
import { grade } from './grader.js';
import { EXERCISES, getExercise, toListItem, toPublic } from './exercises/index.js';
import { pickLocale } from './locales.js';
import { message } from './messages.js';
import { ITEMS, toPublicItem } from './shop.js';
import { mailFor } from './mail.js';
import { LESSONS, getLesson, toLessonListItem, toPublicLesson } from './lessons/index.js';
import {
  playerState,
  completedSet,
  isUnlocked,
  recordAttempt,
  completeExercise,
  currentLevelIndex,
  inventory,
  buyItem,
  equipItem,
  lessonProgress,
  saveLessonProgress,
} from './player.js';

const PORT = process.env.PORT ?? 3001;
const MAX_CODE_LENGTH = 20_000;

const app = express();
app.use(express.json({ limit: '100kb' }));

// Lingua dell'interfaccia scelta dal giocatore, inviata dal client a ogni richiesta.
app.use((req, _res, next) => {
  req.locale = pickLocale(req.get('X-Locale'));
  next();
});

function validateCode(code, locale) {
  if (typeof code !== 'string' || code.trim().length === 0) return message(locale, 'emptyCode');
  if (code.length > MAX_CODE_LENGTH) return message(locale, 'codeTooLong');
  return null;
}

app.get('/api/health', async (_req, res) => {
  try {
    const installed = await runtimes();
    const languages = Object.values(LANGUAGES).map((l) => ({
      id: l.id,
      label: l.label,
      ready: installed.some(
        (r) => r.language === l.piston.language && r.version === l.piston.version,
      ),
    }));
    res.json({ piston: 'online', languages });
  } catch {
    res.status(503).json({ piston: 'offline', pistonUrl: PISTON_URL });
  }
});

app.post('/api/run', async (req, res) => {
  const { language, code, stdin } = req.body ?? {};
  const lang = getLanguage(language);

  if (!lang) {
    return res.status(400).json({ error: message(req.locale, 'unsupportedLanguage', { language }) });
  }
  const invalid = validateCode(code, req.locale);
  if (invalid) return res.status(400).json({ error: invalid });

  const started = Date.now();
  try {
    const result = await execute(lang, code, typeof stdin === 'string' ? stdin : '');
    res.json({ ...result, durationMs: Date.now() - started });
  } catch (err) {
    console.error('[run]', err.message);
    res.status(502).json({ error: message(req.locale, 'runFailed', { detail: err.message }) });
  }
});

app.get('/api/player', (req, res) => {
  res.json(playerState(req.locale));
});

app.get('/api/exercises', (req, res) => {
  const completed = completedSet();
  res.json(
    EXERCISES.map((ex) => ({
      ...toListItem(ex, req.locale),
      completed: completed.has(ex.id),
      unlocked: isUnlocked(ex, completed),
    })),
  );
});

app.get('/api/exercises/:id', (req, res) => {
  const ex = getExercise(req.params.id);
  if (!ex) return res.status(404).json({ error: message(req.locale, 'notFound') });
  if (!isUnlocked(ex, completedSet())) {
    return res.status(403).json({ error: message(req.locale, 'locked') });
  }
  res.json(toPublic(ex, req.locale));
});

app.post('/api/exercises/:id/submit', async (req, res) => {
  const ex = getExercise(req.params.id);
  if (!ex) return res.status(404).json({ error: message(req.locale, 'notFound') });
  if (!isUnlocked(ex, completedSet())) {
    return res.status(403).json({ error: message(req.locale, 'locked') });
  }
  const { code } = req.body ?? {};
  const invalid = validateCode(code, req.locale);
  if (invalid) return res.status(400).json({ error: invalid });

  try {
    const outcome = await grade(getLanguage(ex.language), ex, code, req.locale);
    recordAttempt(ex.id, outcome.passed);
    const completion = outcome.passed ? completeExercise(ex, code, req.locale) : null;
    res.json({ ...outcome, completion, player: playerState(req.locale) });
  } catch (err) {
    console.error('[submit]', err.message);
    res.status(502).json({ error: message(req.locale, 'gradeFailed', { detail: err.message }) });
  }
});

app.get('/api/shop', (req, res) => {
  const owned = inventory();
  res.json(ITEMS.map((item) => toPublicItem(item, req.locale, owned)));
});

app.post('/api/shop/:id/buy', (req, res) => {
  const error = buyItem(req.params.id);
  if (error) return res.status(error === 'itemNotFound' ? 404 : 400).json({ error: message(req.locale, error) });
  res.json({ player: playerState(req.locale) });
});

app.post('/api/shop/:id/equip', (req, res) => {
  const error = equipItem(req.params.id, !!req.body?.equipped);
  if (error) return res.status(error === 'itemNotFound' ? 404 : 400).json({ error: message(req.locale, error) });
  res.json({ player: playerState(req.locale) });
});

// Una lezione si apre insieme al suo primo esercizio: il corso segue il percorso.
function lessonUnlocked(lesson, completed) {
  const first = getExercise(lesson.exercises[0]);
  return !first || isUnlocked(first, completed);
}

app.get('/api/lessons', (req, res) => {
  const completed = completedSet();
  const progress = lessonProgress();
  res.json(
    LESSONS.map((lesson) => {
      const p = progress.get(lesson.id);
      return {
        ...toLessonListItem(lesson, req.locale),
        unlocked: lessonUnlocked(lesson, completed),
        viewed: !!p?.viewed,
        quizBest: p?.quizBest ?? null,
        exercisesDone: lesson.exercises.filter((id) => completed.has(id)).length,
      };
    }),
  );
});

app.get('/api/lessons/:id', (req, res) => {
  const lesson = getLesson(req.params.id);
  if (!lesson) return res.status(404).json({ error: message(req.locale, 'lessonNotFound') });
  if (!lessonUnlocked(lesson, completedSet())) {
    return res.status(403).json({ error: message(req.locale, 'lessonLocked') });
  }
  res.json(toPublicLesson(lesson, req.locale));
});

// { viewed: true } a fine slide, { quizScore } a fine quiz.
app.post('/api/lessons/:id/progress', (req, res) => {
  const lesson = getLesson(req.params.id);
  if (!lesson) return res.status(404).json({ error: message(req.locale, 'lessonNotFound') });
  const { viewed, quizScore } = req.body ?? {};
  const score = Number.isInteger(quizScore)
    ? Math.max(0, Math.min(quizScore, lesson[req.locale].quiz.length))
    : null;
  saveLessonProgress(lesson.id, { viewed: viewed === true, quizScore: score });
  res.json({ ok: true });
});

app.get('/api/mail', (req, res) => {
  res.json(mailFor(currentLevelIndex(completedSet()), req.locale));
});

app.listen(PORT, () => {
  console.log(`Server su http://localhost:${PORT} (Piston: ${PISTON_URL})`);
});
