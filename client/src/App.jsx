import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';
import { LOCALES, useI18n } from './i18n/index.jsx';
import Office from './Office.jsx';
import Desktop from './desktop/Desktop.jsx';
import EditorApp from './desktop/EditorApp.jsx';
import CoursesApp from './desktop/CoursesApp.jsx';
import ShopApp from './desktop/ShopApp.jsx';
import MailApp from './desktop/MailApp.jsx';
import ProfileApp from './desktop/ProfileApp.jsx';

// Messaggi già letti: preferenza del browser, non serve salvarla sul server.
const READ_KEY = 'devcareer:mail-read';
function loadRead() {
  try {
    return new Set(JSON.parse(localStorage.getItem(READ_KEY) ?? '[]'));
  } catch {
    return new Set();
  }
}

export default function App({ onChangeLocale }) {
  const { locale, t } = useI18n();
  const [health, setHealth] = useState(null);
  const [player, setPlayer] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [mail, setMail] = useState([]);
  const [readIds, setReadIds] = useState(loadRead);
  const [loadError, setLoadError] = useState(null);
  const [exercise, setExercise] = useState(null);
  // seduto alla scrivania (desktop del PC) o in piedi nell'ufficio
  const [seated, setSeated] = useState(false);
  const [openApp, setOpenApp] = useState(null); // app aperta sul PC, null = desktop
  // Passaggi tra app: un oggetto nuovo a ogni richiesta, così si può riaprire lo stesso id.
  const [editorTarget, setEditorTarget] = useState(null);
  const [courseTarget, setCourseTarget] = useState(null);
  const [officeAvailable, setOfficeAvailable] = useState(true);

  useEffect(() => {
    api.health().then(setHealth).catch((e) => setHealth(e.body ?? { piston: 'offline' }));
  }, []);

  // Contenuti nella lingua scelta; cambiando lingua si ricarica tutto.
  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    Promise.all([api.player(), api.exercises(), api.mail()])
      .then(([p, list, m]) => {
        if (cancelled) return;
        setPlayer(p);
        setExercises(list);
        setMail(m);
      })
      .catch((e) => !cancelled && setLoadError(t('app.serverError', { message: e.message })));
    return () => {
      cancelled = true;
    };
  }, [locale, t]);

  // Dopo una consegna: saldo e grado arrivano con la risposta; elenco e posta si ricaricano
  // (una promozione porta una mail nuova).
  const onSubmitted = useCallback(async (res) => {
    setPlayer(res.player);
    if (res.passed) {
      const [list, m] = await Promise.all([api.exercises(), api.mail()]);
      setExercises(list);
      setMail(m);
    }
  }, []);

  const markRead = useCallback((id) => {
    setReadIds((prev) => {
      const next = new Set(prev).add(id);
      try {
        localStorage.setItem(READ_KEY, JSON.stringify([...next]));
      } catch {
        /* storage non disponibile */
      }
      return next;
    });
  }, []);

  const unread = mail.filter((m) => !readIds.has(m.id)).length;
  const langReady = health?.languages?.find((l) => l.id === 'python')?.ready;

  const openExerciseApp = useCallback((id) => {
    setEditorTarget({ id });
    setOpenApp('editor');
  }, []);
  const openLessonApp = useCallback((id) => {
    setCourseTarget({ id });
    setOpenApp('courses');
  }, []);

  const apps = [
    {
      id: 'courses',
      icon: '📚',
      label: 'apps.courses',
      render: (visible) => (
        <CoursesApp visible={visible} exercises={exercises} target={courseTarget} onOpenExercise={openExerciseApp} />
      ),
    },
    {
      id: 'editor',
      icon: '📝',
      label: 'apps.editor',
      render: () => (
        <EditorApp
          exercises={exercises}
          player={player}
          target={editorTarget}
          onSubmitted={onSubmitted}
          onOpenLesson={openLessonApp}
          onExerciseChange={setExercise}
          onError={setLoadError}
        />
      ),
    },
    {
      id: 'shop',
      icon: '🛒',
      label: 'apps.shop',
      render: (visible) => <ShopApp visible={visible} player={player} onPlayerChange={setPlayer} />,
    },
    {
      id: 'mail',
      icon: '✉️',
      label: 'apps.mail',
      badge: unread,
      render: () => <MailApp mail={mail} readIds={readIds} onRead={markRead} />,
    },
    { id: 'profile', icon: '👤', label: 'apps.profile', render: () => <ProfileApp player={player} /> },
  ];

  function standUp() {
    setOpenApp(null);
    setSeated(false);
  }

  // Esc da seduto: prima chiude l'app aperta (la camera torna alla scrivania), poi ti alza.
  function escape() {
    if (openApp) setOpenApp(null);
    else standUp();
  }

  const desktop = (
    <Desktop
      apps={apps}
      active={openApp}
      onActiveChange={setOpenApp}
      player={player}
      onStandUp={officeAvailable ? standUp : null}
    />
  );

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo">&lt;/&gt;</span> DevCareer
        </div>
        <div className="hud">
          {player && (
            <span className="badge">
              🎓 {player.level.role} · {player.level.contract}
            </span>
          )}
          {player && <span className="badge">💰 {player.balance} €</span>}
          <SandboxStatus health={health} ready={langReady} />
          <select
            className="badge locale-select"
            aria-label={t('app.language')}
            value={locale}
            onChange={(e) => onChangeLocale(e.target.value)}
          >
            {LOCALES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {loadError && <div className="banner-error">{loadError}</div>}

      {officeAvailable ? (
        <Office
          seated={seated}
          focused={openApp !== null}
          deskInfo={{
            title: exercise?.title ?? '',
            subtitle: player ? `${player.level.role} · ${player.level.contract}` : '',
          }}
          deskItems={player?.desk ?? []}
          onSit={() => setSeated(true)}
          onEscape={escape}
          onUnavailable={() => setOfficeAvailable(false)}
        >
          {desktop}
        </Office>
      ) : (
        // Senza WebGL: niente ufficio, il desktop occupa tutta la pagina.
        <div className="pc-fullscreen">{desktop}</div>
      )}
    </div>
  );
}

function SandboxStatus({ health, ready }) {
  const { t } = useI18n();
  if (!health) return <span className="badge muted">…</span>;
  if (health.piston !== 'online') return <span className="badge bad">{t('sandbox.offline')}</span>;
  if (ready === false) return <span className="badge warn">{t('sandbox.noRuntime')}</span>;
  return <span className="badge good">{t('sandbox.ready')}</span>;
}
