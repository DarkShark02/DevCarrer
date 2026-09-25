import { useState } from 'react';
import { api } from './api.js';
import { useI18n } from './i18n/index.jsx';

// Blocchi di contenuto comuni a consegne e slide:
// stringhe (con `codice` inline), esempi { code, stdin?, output }, testo { pre }, elenchi { list }.

export function Inline({ text }) {
  return text.split('`').map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));
}

// `runnable`: l'esempio ha il pulsante «Prova», che lo esegue davvero nella sandbox.
export function ContentBlock({ block, runnable = false, language = 'python' }) {
  const { t } = useI18n();
  if (typeof block === 'string') {
    return (
      <p>
        <Inline text={block} />
      </p>
    );
  }
  if (block.pre !== undefined) return <pre className="snippet">{block.pre}</pre>;
  if (block.list) {
    return (
      <ul className="content-list">
        {block.list.map((item, i) => (
          <li key={i}>
            <Inline text={item} />
          </li>
        ))}
      </ul>
    );
  }
  return runnable ? <RunnableSnippet block={block} language={language} /> : <Snippet block={block} label={t('brief.snippetOutput')} />;
}

function Snippet({ block, label }) {
  return (
    <div className="snippet-group">
      <pre className="snippet">{block.code}</pre>
      {block.output && (
        <div className="snippet-output">
          <span className="example-label">{label}</span>
          <pre>{block.output}</pre>
        </div>
      )}
    </div>
  );
}

function RunnableSnippet({ block, language }) {
  const { t } = useI18n();
  const [state, setState] = useState(null); // null | 'running' | { stdout, stderr } | { error }

  async function run() {
    setState('running');
    try {
      const res = await api.run(language, block.code, block.stdin ?? '');
      setState({ stdout: res.stdout, stderr: res.stderr });
    } catch (e) {
      setState({ error: e.message });
    }
  }

  return (
    <div className="snippet-group runnable">
      <div className="snippet-bar">
        {block.stdin && (
          <span className="snippet-stdin">
            {t('courses.input')} <code>{block.stdin.replace(/\n/g, ' ⏎ ')}</code>
          </span>
        )}
        <button className="run-btn small" onClick={run} disabled={state === 'running'}>
          {state === 'running' ? t('courses.trying') : t('courses.try')}
        </button>
      </div>
      <pre className="snippet">{block.code}</pre>
      {state && state !== 'running' && (
        <div className="snippet-output live">
          <span className="example-label">{t('brief.snippetOutput')}</span>
          <pre className={state.error || state.stderr ? 'stderr' : ''}>
            {state.error ?? (state.stdout + (state.stderr ?? '') || t('output.empty'))}
          </pre>
        </div>
      )}
    </div>
  );
}
