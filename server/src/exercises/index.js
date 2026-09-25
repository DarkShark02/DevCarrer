import python from './python.js';
import { localize } from '../locales.js';
import { moduleTitle } from '../career.js';
import { lessonOf } from '../lessons/index.js';

// Un percorso per linguaggio. Ogni esercizio si sblocca completando il precedente
// nello stesso percorso.
const TRACKS = { python };

export const EXERCISES = Object.entries(TRACKS).flatMap(([language, list]) =>
  list.map((ex, index) => ({
    ...ex,
    language,
    index,
    prerequisite: index > 0 ? list[index - 1].id : null,
  })),
);

const BY_ID = new Map(EXERCISES.map((ex) => [ex.id, ex]));

export function getExercise(id) {
  return BY_ID.get(id) ?? null;
}

export function expectedFor(test, locale) {
  return localize(test.expected, locale);
}

// Avanzamento per modulo: { done, total } nel percorso in cui il giocatore è più avanti.
// Così un modulo vale una volta sola anche quando ci saranno più linguaggi.
export function moduleProgress(completed) {
  const progress = new Map();
  for (const list of Object.values(TRACKS)) {
    const perTrack = new Map();
    for (const ex of list) {
      const p = perTrack.get(ex.module) ?? { done: 0, total: 0 };
      p.total++;
      if (completed.has(ex.id)) p.done++;
      perTrack.set(ex.module, p);
    }
    for (const [module, p] of perTrack) {
      const best = progress.get(module);
      if (!best || p.done / p.total > best.done / best.total) progress.set(module, p);
    }
  }
  return progress;
}

export function doneModules(progress) {
  return new Set([...progress].filter(([, p]) => p.total > 0 && p.done === p.total).map(([m]) => m));
}

// Voce dell'elenco, nella lingua scelta.
export function toListItem(ex, locale) {
  const text = ex[locale];
  return {
    id: ex.id,
    kind: ex.kind ?? 'exercise',
    lesson: lessonOf(ex.id),
    language: ex.language,
    module: ex.module,
    moduleTitle: moduleTitle(ex.module, locale),
    topic: text.topic,
    title: text.title,
    reward: ex.reward,
  };
}

// Vista per il client: niente soluzione, niente test nascosti.
export function toPublic(ex, locale) {
  const text = ex[locale];
  return {
    ...toListItem(ex, locale),
    brief: text.brief,
    hints: text.hints,
    starterCode: text.starterCode,
    examples: ex.tests
      .filter((t) => !t.hidden)
      .map((t) => ({ stdin: t.stdin ?? '', expected: expectedFor(t, locale) })),
    hiddenTests: ex.tests.filter((t) => t.hidden).length,
  };
}
