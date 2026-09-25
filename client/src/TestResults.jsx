import { useI18n } from './i18n/index.jsx';

// showDiff: con la papera di gomma sulla scrivania, i test falliti mostrano le differenze riga per riga.
export default function TestResults({ busy, submission, error, showDiff, onNext }) {
  const { t } = useI18n();
  if (busy) return <pre className="console muted">{t('tests.running')}</pre>;
  if (error) return <pre className="console stderr">{error}</pre>;
  if (!submission) return <pre className="console muted">{t('tests.intro')}</pre>;

  const { passed, results, completion } = submission;
  const passedCount = results.filter((r) => r.passed).length;
  const promotion = completion?.promotion;

  return (
    <div className="test-results">
      <div className={`verdict ${passed ? 'ok' : 'fail'}`}>
        {passed
          ? t('tests.allPassed')
          : t('tests.somePassed', { passed: passedCount, total: results.length })}
        {completion?.firstTime && <div className="verdict-reward">+{completion.reward} €</div>}
        {completion?.bonus > 0 && <div className="verdict-note">{t('tests.bonus', { bonus: completion.bonus })}</div>}
        {completion && !completion.firstTime && (
          <div className="verdict-note">{t('tests.alreadyDone')}</div>
        )}
        {promotion && (
          <div className="promotion">
            <div>{t('tests.promotion', { role: promotion.role, contract: promotion.contract })}</div>
            {promotion.message && <div className="promotion-message">{promotion.message}</div>}
          </div>
        )}
        {passed && onNext && (
          <button className="next-btn" onClick={onNext}>
            {t('tests.next')}
          </button>
        )}
      </div>
      {results.map((r) => (
        <TestCase key={r.name} result={r} showDiff={showDiff} />
      ))}
    </div>
  );
}

function TestCase({ result: r, showDiff }) {
  const { t } = useI18n();
  const reason = r.timedOut ? t('tests.timedOut') : r.crashed ? t('tests.crashed') : null;

  return (
    <details className={`test-case ${r.passed ? 'ok' : 'fail'}`} open={!r.passed && !r.hidden}>
      <summary>
        <span>{r.passed ? '✓' : '✗'}</span> {r.name}
        {r.hidden && <span className="muted"> {t('tests.hidden')}</span>}
        {reason && <span className="muted"> · {reason}</span>}
      </summary>
      {r.hidden ? (
        !r.passed && <p className="muted">{t('tests.hiddenDetails')}</p>
      ) : (
        <div className="test-detail">
          {r.stdin && <Block label={t('tests.input')} text={r.stdin} />}
          <Block label={t('tests.expected')} text={r.expected} />
          <Block label={t('tests.actual')} text={r.actual || t('output.empty')} />
          {r.stderr && <Block label={t('tests.errors')} text={r.stderr} className="stderr" />}
          {showDiff && !r.passed && !r.timedOut && !r.crashed && <DuckDiff expected={r.expected} actual={r.actual} />}
        </div>
      )}
    </details>
  );
}

// Stessa normalizzazione del server: niente \r, spazi a fine riga e righe vuote finali.
function lines(text) {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .trimEnd()
    .split('\n');
}

const MAX_ROWS = 5;

function DuckDiff({ expected, actual }) {
  const { t } = useI18n();
  const e = lines(expected);
  const a = actual.trim() ? lines(actual) : [];
  const rows = [];
  for (let i = 0; i < Math.max(e.length, a.length); i++) {
    if (e[i] === a[i]) continue;
    let note = null;
    if (a[i] === undefined) note = 'duck.missing';
    else if (e[i] === undefined) note = 'duck.extra';
    else if (e[i].toLowerCase() === a[i].toLowerCase()) note = 'duck.caseOnly';
    else if (e[i].replace(/\s+/g, '') === a[i].replace(/\s+/g, '')) note = 'duck.spaces';
    rows.push({ n: i + 1, expected: e[i], actual: a[i], note });
  }
  if (!rows.length) return null;
  const show = (s) => (s === undefined ? t('duck.none') : s.replace(/ /g, '·'));
  return (
    <div className="duck-diff">
      <div className="duck-title">{t('duck.title')}</div>
      {rows.slice(0, MAX_ROWS).map((row) => (
        <div className="duck-row" key={row.n}>
          <div className="duck-line">{t('duck.line', { n: row.n })}</div>
          <div className="duck-pair">
            <span className="muted">{t('duck.expected')}</span>
            <code className="duck-exp">{show(row.expected)}</code>
            <span className="muted">{t('duck.actual')}</span>
            <code className="duck-act">{show(row.actual)}</code>
          </div>
          {row.note && <div className="duck-note">{t(row.note)}</div>}
        </div>
      ))}
      {rows.length > MAX_ROWS && <div className="muted">{t('duck.more', { count: rows.length - MAX_ROWS })}</div>}
    </div>
  );
}

function Block({ label, text, className = '' }) {
  return (
    <div>
      <div className="example-label">{label}</div>
      <pre className={className}>{text}</pre>
    </div>
  );
}
