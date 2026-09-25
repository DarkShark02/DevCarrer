import { useI18n } from '../i18n/index.jsx';

// App «Profilo»: grado, contratto, moduli e cosa serve per la prossima promozione.
export default function ProfileApp({ player }) {
  const { t } = useI18n();
  if (!player) return null;
  const next = player.nextLevel;
  return (
    <div className="profile-app">
      <div className="career-card">
        <div className="career-level">{player.level.role}</div>
        <div className="career-contract">{player.level.contract}</div>
        <div className="career-balance">{player.balance} €</div>
        <div className="muted">{t('profile.completed', { done: player.completedCount, total: player.totalExercises })}</div>
        <div className="muted">{t('profile.desk', { count: player.desk.length })}</div>
      </div>

      <div className="career-card">
        {next ? (
          <>
            <div className="career-next-title">{t('career.next', { role: next.role, contract: next.contract })}</div>
            <div className="career-next-title">{t('career.requirements')}</div>
            {next.requirements.map((r) => (
              <Progress key={r.module} label={r.title} value={r.done} max={r.total} />
            ))}
          </>
        ) : (
          <div className="career-next-title">{t('career.top')}</div>
        )}
      </div>

      <div className="career-card">
        <div className="career-next-title">{t('profile.modules')}</div>
        {player.modules.map((m) => (
          <Progress key={m.module} label={m.title} value={m.done} max={m.total} />
        ))}
      </div>
    </div>
  );
}

function Progress({ label, value, max }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="progress">
      <div className="progress-label">
        <span>{label}</span>
        <span>
          {value} / {max}
        </span>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${pct === 100 ? 'full' : ''}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
