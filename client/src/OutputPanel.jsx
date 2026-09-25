import { useI18n } from './i18n/index.jsx';

export default function OutputPanel({ running, result, error }) {
  const { t } = useI18n();
  if (running) return <pre className="console muted">{t('output.running')}</pre>;
  if (error) return <pre className="console stderr">{error}</pre>;
  if (!result) return <pre className="console muted">{t('output.intro')}</pre>;

  const killed = result.signal === 'SIGKILL';
  const ok = result.exitCode === 0 && !killed;
  return (
    <div className="output">
      <pre className="console">
        {result.stdout}
        {result.stderr && <span className="stderr">{result.stderr}</span>}
        {!result.stdout && !result.stderr && <span className="muted">{t('output.empty')}</span>}
      </pre>
      <div className={`run-meta ${ok ? 'ok' : 'fail'}`}>
        {killed ? t('output.killed') : t('output.exitCode', { code: result.exitCode })}
        <span>{result.durationMs} ms</span>
      </div>
    </div>
  );
}
