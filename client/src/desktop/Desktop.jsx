import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/index.jsx';

// Il desktop del PC: sfondo, icone, una finestra per app e la barra delle applicazioni.
// Tutte le app restano montate (quelle non attive sono solo nascoste), così
// passando dall'editor al negozio non si perde niente.
// `active` = id dell'app aperta (null = desktop); lo gestisce App, perché aprire un'app
// avvicina anche la camera al monitor.
export default function Desktop({ apps, active, onActiveChange: setActive, player, onStandUp }) {
  const { t } = useI18n();
  const clock = useClock();

  return (
    <div className="pc">
      <div className="pc-body">
        <div className="pc-wallpaper">
          <span className="pc-wallpaper-logo">&lt;/&gt;</span>
        </div>
        <div className="pc-icons">
          {apps.map((app) => (
            <button key={app.id} className="pc-icon" onDoubleClick={() => setActive(app.id)} onClick={() => setActive(app.id)}>
              <span className="pc-icon-glyph">
                {app.icon}
                {app.badge > 0 && <span className="pc-badge">{app.badge}</span>}
              </span>
              <span className="pc-icon-label">{t(app.label)}</span>
            </button>
          ))}
        </div>
        {apps.map((app) => (
          <section key={app.id} className="pc-window" style={{ display: active === app.id ? undefined : 'none' }}>
            <div className="pc-titlebar">
              <span>
                {app.icon} {t(app.label)}
              </span>
              <button className="pc-close" onClick={() => setActive(null)} aria-label={t('desk.home')}>
                ✕
              </button>
            </div>
            <div className="pc-window-body">{app.render(active === app.id)}</div>
          </section>
        ))}
      </div>

      <div className="pc-taskbar">
        <button className={`pc-start ${active === null ? 'active' : ''}`} onClick={() => setActive(null)} title={t('desk.home')}>
          &lt;/&gt;
        </button>
        {apps.map((app) => (
          <button
            key={app.id}
            className={`pc-task ${active === app.id ? 'active' : ''}`}
            onClick={() => setActive(app.id)}
          >
            {app.icon} <span className="pc-task-label">{t(app.label)}</span>
            {app.badge > 0 && <span className="pc-badge inline">{app.badge}</span>}
          </button>
        ))}
        <span className="pc-tray">
          {player && <span>💰 {player.balance} €</span>}
          <span>{clock}</span>
          {onStandUp && (
            <button className="pc-stand" onClick={onStandUp}>
              {t('desk.standUp')}
            </button>
          )}
        </span>
      </div>
    </div>
  );
}

function useClock() {
  const format = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
}
