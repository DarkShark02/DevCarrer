import python from './python.js';
import { moduleTitle } from '../career.js';

// Lezioni per linguaggio, nell'ordine del percorso.
const TRACKS = { python };

export const LESSONS = Object.entries(TRACKS).flatMap(([language, list]) =>
  list.map((lesson) => ({ ...lesson, language })),
);

const BY_ID = new Map(LESSONS.map((l) => [l.id, l]));

export function getLesson(id) {
  return BY_ID.get(id) ?? null;
}

// Esercizio → lezione che lo introduce.
const LESSON_OF = new Map(LESSONS.flatMap((l) => l.exercises.map((ex) => [ex, l.id])));

export function lessonOf(exerciseId) {
  return LESSON_OF.get(exerciseId) ?? null;
}

export function toLessonListItem(lesson, locale) {
  return {
    id: lesson.id,
    language: lesson.language,
    module: lesson.module,
    moduleTitle: moduleTitle(lesson.module, locale),
    title: lesson[locale].title,
    exercises: lesson.exercises,
    slideCount: lesson[locale].slides.length,
    quizCount: lesson[locale].quiz.length,
  };
}

export function toPublicLesson(lesson, locale) {
  const text = lesson[locale];
  return {
    ...toLessonListItem(lesson, locale),
    slides: text.slides,
    // Il quiz è facoltativo e si corregge nel browser: le risposte possono viaggiare col resto.
    quiz: text.quiz.map(({ type, ...q }) => q),
  };
}
