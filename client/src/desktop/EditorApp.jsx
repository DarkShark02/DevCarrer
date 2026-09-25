import { useCallback, useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { api } from '../api.js';
import { useI18n } from '../i18n/index.jsx';
import OutputPanel from '../OutputPanel.jsx';
import TestResults from '../TestResults.jsx';
import Brief from '../Brief.jsx';

// Dettagli di presentazione per linguaggio (quelli di esecuzione stanno sul server).
const EDITOR_LANGUAGES = {
  python: { label: 'Python', monaco: 'python', filename: 'main.py' },
};

// Bozze salvate nel browser, per non perdere il codice cambiando esercizio.
// Il codice iniziale non modificato non viene salvato: così, cambiando lingua,
// si vede il codice iniziale nella nuova lingua.
const draftKey = (id) => `devcareer:draft:${id}`;
function loadDraft(id) {
  try {
    return localStorage.getItem(draftKey(id));
  } catch {
    return null;
  }
}
function saveDraft(id, code, starterCode) {
  try {
    if (code === starterCode) localStorage.removeItem(draftKey(id));
    else localStorage.setItem(draftKey(id), code);
  } catch {
    /* storage non disponibile: pazienza */
  }
}

// App «Editor» del PC: consegna a sinistra, codice e risultati a destra.
// `target` = { id } per aprire un esercizio da fuori (es. dall'app Corsi).
export default function EditorApp({ exercises, player, target, onSubmitted, onExerciseChange, onOpenLesson, onError }) {
  const { locale, t } = useI18n();
  const [exercise, setExercise] = useState(null);
  const [code, setCode] = useState('');
  const [stdin, setStdin] = useState('');
  const [tab, setTab] = useState('output');
  const [busy, setBusy] = useState(null); // 'run' | 'submit' | null
  const [runResult, setRunResult] = useState(null);
  const [runError, setRunError] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const currentId = useRef(null);
  const loadedLocale = useRef(null);

  const openExercise = useCallback(
    async (id) => {
      currentId.current = id;
      try {
        const ex = await api.exercise(id);
        if (currentId.current !== id) return; // nel frattempo è stato aperto un altro esercizio
        loadedLocale.current = locale;
        setExercise(ex);
        setCode(loadDraft(id) ?? ex.starterCode);
        setStdin(ex.examples[0]?.stdin ?? '');
        setRunResult(null);
        setRunError(null);
        setSubmission(null);
        setSubmitError(null);
        setTab('output');
      } catch (e) {
        onError(e.message);
      }
    },
    [locale, onError],
  );

  // All'avvio apre il primo esercizio da fare; cambiando lingua ricarica quello aperto.
  useEffect(() => {
    if (!exercises.length) return;
    const open = exercises.find((e) => e.id === currentId.current && e.unlocked);
    if (open && loadedLocale.current === locale) return;
    const target = open ?? exercises.find((e) => e.unlocked && !e.completed) ?? exercises[exercises.length - 1];
    openExercise(target.id);
  }, [exercises, locale, openExercise]);

  // Ogni richiesta da fuori si esegue una volta sola (non di nuovo al cambio di lingua).
  const handledTarget = useRef(null);
  useEffect(() => {
    if (!target || handledTarget.current === target) return;
    handledTarget.current = target;
    openExercise(target.id);
  }, [target, openExercise]);

  useEffect(() => {
    onExerciseChange(exercise);
  }, [exercise, onExerciseChange]);

  function changeCode(value) {
    setCode(value);
    if (exercise) saveDraft(exercise.id, value, exercise.starterCode);
  }

  function resetCode() {
    if (!exercise || !confirm(t('editor.resetConfirm'))) return;
    changeCode(exercise.starterCode);
  }

  async function run() {
    if (busy || !exercise) return;
    setBusy('run');
    setTab('output');
    setRunError(null);
    try {
      setRunResult(await api.run(exercise.language, code, stdin));
    } catch (e) {
      setRunResult(null);
      setRunError(e.message);
    } finally {
      setBusy(null);
    }
  }

  async function submit() {
    if (busy || !exercise) return;
    setBusy('submit');
    setTab('tests');
    setSubmitError(null);
    try {
      const res = await api.submit(exercise.id, code);
      setSubmission(res);
      await onSubmitted(res);
    } catch (e) {
      setSubmission(null);
      setSubmitError(e.message);
    } finally {
      setBusy(null);
    }
  }

  // I comandi Monaco vengono registrati una volta sola: leggono sempre la versione attuale.
  const actions = useRef();
  actions.current = { run, submit };
  function handleMount(editor, monaco) {
    const { KeyMod, KeyCode } = monaco;
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.Enter, () => actions.current.run());
    editor.addCommand(KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Enter, () => actions.current.submit());
  }

  const currentIndex = exercises.findIndex((e) => e.id === exercise?.id);
  const nextExercise = exercises[currentIndex + 1];
  const current = exercises[currentIndex];
  const editorLang = EDITOR_LANGUAGES[exercise?.language] ?? { label: '', monaco: 'plaintext', filename: '' };

  // Esercizi raggruppati per modulo, nell'ordine del percorso.
  const groups = [];
  for (const ex of exercises) {
    if (groups.at(-1)?.module !== ex.module) groups.push({ module: ex.module, title: ex.moduleTitle, items: [] });
    groups.at(-1).items.push(ex);
  }

  return (
    <div className="editor-app">
      <div className="editor-toolbar">
        <select
          className="exercise-select"
          aria-label={t('editor.exercise')}
          value={exercise?.id ?? ''}
          onChange={(e) => openExercise(e.target.value)}
        >
          {groups.map((g) => (
            <optgroup key={g.module} label={`${t('editor.track', { language: 'Python' })} · ${g.title}`}>
              {g.items.map((ex) => (
                <option key={ex.id} value={ex.id} disabled={!ex.unlocked}>
                  {ex.completed ? '✓ ' : ''}
                  {!ex.unlocked
                    ? t('editor.locked', { title: ex.title })
                    : ex.kind === 'project'
                      ? t('editor.projectOption', { title: ex.title })
                      : `${exercises.indexOf(ex) + 1}. ${ex.title}`}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {current?.lesson && (
          <button className="ghost-btn lesson-btn" onClick={() => onOpenLesson(current.lesson)}>
            {t('editor.lesson')}
          </button>
        )}
        <span className="toolbar-file">{editorLang.filename}</span>
        <div className="actions">
          <button className="ghost-btn" onClick={resetCode} disabled={!exercise}>
            {t('editor.reset')}
          </button>
          <button className="run-btn" onClick={run} disabled={!!busy || !exercise}>
            {busy === 'run' ? t('editor.running') : t('editor.run')}
          </button>
          <button className="submit-btn" onClick={submit} disabled={!!busy || !exercise}>
            {busy === 'submit' ? t('editor.submitting') : t('editor.submit')}
          </button>
        </div>
      </div>

      <div className="editor-body">
        <div className="editor-brief">
          {exercise && (
            <Brief
              key={`${exercise.id}:${locale}`}
              exercise={exercise}
              completed={current?.completed}
              rewardMultiplier={player?.effects.rewardMultiplier ?? 1}
            />
          )}
        </div>
        <div className="editor-work">
          <div className="editor-wrap">
            <Editor
              height="100%"
              language={editorLang.monaco}
              theme="vs-dark"
              path={exercise?.id}
              value={code}
              onChange={(v) => changeCode(v ?? '')}
              onMount={handleMount}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                tabSize: 4,
                automaticLayout: true,
              }}
            />
          </div>
          <div className="editor-panel">
            <div className="tabs">
              <button className={tab === 'output' ? 'active' : ''} onClick={() => setTab('output')}>
                {t('tabs.output')}
              </button>
              <button className={tab === 'tests' ? 'active' : ''} onClick={() => setTab('tests')}>
                {t('tabs.tests')}
                {submission && <span className={`dot ${submission.passed ? 'ok' : 'fail'}`} />}
              </button>
            </div>
            {tab === 'output' ? (
              <div className="output-split">
                <OutputPanel running={busy === 'run'} result={runResult} error={runError} />
                <div className="stdin-wrap">
                  <div className="pane-header">{t('stdin.label')}</div>
                  <textarea
                    className="stdin"
                    placeholder={t('stdin.placeholder')}
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <TestResults
                busy={busy === 'submit'}
                submission={submission}
                error={submitError}
                showDiff={!!player?.effects.testDiff}
                onNext={nextExercise?.unlocked ? () => openExercise(nextExercise.id) : null}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
