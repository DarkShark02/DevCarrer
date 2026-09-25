import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { useI18n } from '../i18n/index.jsx';
import { ContentBlock, Inline } from '../content.jsx';

// App «Corsi»: elenco delle lezioni, lettore di slide e mini-quiz facoltativo.
// `target` = { id } per aprire una lezione da fuori (es. dal pulsante «Lezione» dell'Editor).
export default function CoursesApp({ visible, exercises, target, onOpenExercise }) {
  const { locale, t } = useI18n();
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(null);

  const loadList = useCallback(() => {
    api.lessons().then(setLessons).catch((e) => setError(e.message));
  }, []);

  // Ricarica quando l'app viene aperta, cambia la lingua o si completa un esercizio.
  useEffect(() => {
    if (visible) loadList();
  }, [visible, locale, exercises, loadList]);

  const openId = useRef(null);
  const openLesson = useCallback(async (id) => {
    openId.current = id;
    setError(null);
    try {
      setLesson(await api.lesson(id));
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const handledTarget = useRef(null);
  useEffect(() => {
    if (!target || handledTarget.current === target) return;
    handledTarget.current = target;
    openLesson(target.id);
  }, [target, openLesson]);

  // Cambiando lingua la lezione aperta si ricarica tradotta.
  useEffect(() => {
    if (openId.current) openLesson(openId.current);
  }, [locale, openLesson]);

  if (lesson) {
    return (
      <LessonViewer
        key={`${lesson.id}:${locale}`}
        lesson={lesson}
        exercises={exercises}
        onBack={() => {
          openId.current = null;
          setLesson(null);
          loadList();
        }}
        onOpenExercise={onOpenExercise}
      />
    );
  }

  // Elenco raggruppato per modulo, con il progetto finale in fondo a ogni modulo.
  const modules = [];
  for (const l of lessons) {
    if (modules.at(-1)?.module !== l.module) modules.push({ module: l.module, title: l.moduleTitle, lessons: [] });
    modules.at(-1).lessons.push(l);
  }
  return (
    <div className="courses-app">
      <p className="muted">{t('courses.intro')}</p>
      {error && <div className="app-error">{error}</div>}
      {modules.map((m) => {
        const project = exercises.find((ex) => ex.module === m.module && ex.kind === 'project');
        return (
          <section key={m.module} className="course-module">
            <h3>{m.title}</h3>
            <div className="course-grid">
              {m.lessons.map((l) => (
                <button key={l.id} className="course-card" disabled={!l.unlocked} onClick={() => openLesson(l.id)}>
                  <span className="course-title">{l.unlocked ? l.title : `🔒 ${l.title}`}</span>
                  <span className="course-meta">
                    {t('courses.slides', { count: l.slideCount })}
                    {' · '}
                    {t('courses.exercises', { done: l.exercisesDone, total: l.exercises.length })}
                  </span>
                  <span className={`course-state ${l.viewed ? 'done' : ''}`}>
                    {l.viewed ? t('courses.read') : t('courses.toRead')}
                    {l.quizBest !== null && ` · ${t('courses.quizScore', { score: l.quizBest, total: l.quizCount })}`}
                  </span>
                </button>
              ))}
              {project && (
                <button
                  className={`course-card project ${project.completed ? 'done' : ''}`}
                  disabled={!project.unlocked}
                  onClick={() => onOpenExercise(project.id)}
                >
                  <span className="course-kicker">{t('courses.project')}</span>
                  <span className="course-title">{project.unlocked ? project.title : `🔒 ${project.title}`}</span>
                  <span className="course-meta">{t('courses.projectHint', { reward: project.reward })}</span>
                  {project.completed && <span className="course-state done">{t('brief.completed')}</span>}
                </button>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function LessonViewer({ lesson, exercises, onBack, onOpenExercise }) {
  const { t } = useI18n();
  // indice della slide; slides.length = quiz; slides.length + 1 = fine
  const [page, setPage] = useState(0);
  const total = lesson.slides.length;
  const hasQuiz = lesson.quiz.length > 0;

  useEffect(() => {
    if (page === total - 1) api.lessonProgress(lesson.id, { viewed: true }).catch(() => {});
  }, [page, total, lesson.id]);

  const nextExercise =
    exercises.find((ex) => lesson.exercises.includes(ex.id) && ex.unlocked && !ex.completed) ??
    exercises.find((ex) => ex.id === lesson.exercises[0]);

  const toExercises = nextExercise && (
    <button className="submit-btn" onClick={() => onOpenExercise(nextExercise.id)}>
      {t('courses.toExercises')}
    </button>
  );

  return (
    <div className="lesson-viewer">
      <div className="lesson-head">
        <button className="ghost-btn" onClick={onBack}>
          {t('courses.back')}
        </button>
        <span className="lesson-title">{lesson.title}</span>
        <span className="muted">
          {page < total ? t('courses.slide', { n: page + 1, total }) : t('courses.quizTitle')}
        </span>
      </div>

      <div className="lesson-body">
        {page < total ? (
          <div className="slide" key={page}>
            <h2>{lesson.slides[page].title}</h2>
            {lesson.slides[page].blocks.map((b, i) => (
              <ContentBlock key={i} block={b} runnable language={lesson.language} />
            ))}
          </div>
        ) : (
          <Quiz lesson={lesson} footer={toExercises} />
        )}
      </div>

      {page < total && (
        <div className="lesson-nav">
          <button className="ghost-btn" disabled={page === 0} onClick={() => setPage(page - 1)}>
            {t('courses.prev')}
          </button>
          <div className="slide-dots">
            {lesson.slides.map((_, i) => (
              <button key={i} className={`dot-btn ${i === page ? 'active' : ''}`} onClick={() => setPage(i)} aria-label={t('courses.slide', { n: i + 1, total })} />
            ))}
          </div>
          {page < total - 1 ? (
            <button className="submit-btn" onClick={() => setPage(page + 1)}>
              {t('courses.next')}
            </button>
          ) : (
            <span className="lesson-end">
              {toExercises}
              {hasQuiz && (
                <button className="run-btn" onClick={() => setPage(total)}>
                  {t('courses.toQuiz')}
                </button>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Mini-quiz facoltativo: una domanda alla volta, correzione immediata con spiegazione.
function Quiz({ lesson, footer }) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const questions = lesson.quiz;
  const q = questions[index];

  function choose(i) {
    if (chosen !== null) return;
    setChosen(i);
    if (i === q.answer) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setChosen(null);
    } else {
      setFinished(true);
      api.lessonProgress(lesson.id, { quizScore: score }).catch(() => {});
    }
  }

  function restart() {
    setIndex(0);
    setChosen(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="quiz">
        <h2>{t('courses.quizTitle')}</h2>
        <p className="quiz-result">{t('courses.results', { score, total: questions.length })}</p>
        <div className="quiz-actions">
          {footer}
          <button className="run-btn" onClick={restart}>
            {t('courses.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz">
      <h2>{t('courses.quizTitle')}</h2>
      <p className="muted">{t('courses.quizIntro')}</p>
      <div className="muted">{t('courses.question', { n: index + 1, total: questions.length })}</div>
      <p className="quiz-question">
        <Inline text={q.question} />
      </p>
      {q.code && <pre className="snippet">{q.code}</pre>}
      <div className="quiz-options">
        {q.options.map((opt, i) => {
          const state = chosen === null ? '' : i === q.answer ? 'right' : i === chosen ? 'wrong' : 'dim';
          return (
            <button key={i} className={`quiz-option ${state}`} onClick={() => choose(i)} disabled={chosen !== null}>
              <pre>{opt}</pre>
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <div className={`quiz-feedback ${chosen === q.answer ? 'right' : 'wrong'}`}>
          <strong>{chosen === q.answer ? t('courses.correct') : t('courses.wrong')}</strong>{' '}
          <Inline text={q.explanation} />
          <div>
            <button className="submit-btn" onClick={next}>
              {index + 1 < questions.length ? t('courses.nextQuestion') : t('courses.seeResults')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
