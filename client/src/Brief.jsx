import { useState } from 'react';
import { useI18n } from './i18n/index.jsx';
import { ContentBlock, Inline } from './content.jsx';

// Consegna dell'esercizio. rewardMultiplier > 1 quando sulla scrivania c'è la macchina espresso.
export default function Brief({ exercise, completed, rewardMultiplier = 1 }) {
  const { t } = useI18n();
  return (
    <div className="brief">
      <div className="brief-head">
        <span className="brief-topic">
          {exercise.kind === 'project' && <span className="project-badge">{t('brief.project')}</span>}
          {exercise.topic}
        </span>
        <h2>{exercise.title}</h2>
        <span className={`brief-reward ${completed ? 'done' : ''}`}>
          {completed
            ? t('brief.completed')
            : rewardMultiplier > 1
              ? t('brief.rewardBonus', {
                  reward: exercise.reward,
                  bonus: Math.round(exercise.reward * rewardMultiplier) - exercise.reward,
                })
              : t('brief.reward', { reward: exercise.reward })}
        </span>
      </div>
      {exercise.brief.map((block, i) => (
        <ContentBlock key={i} block={block} />
      ))}
      {exercise.examples.some((e) => e.stdin) && (
        <div className="examples">
          {exercise.examples.map((ex, i) => (
            <div className="example" key={i}>
              <div>
                <div className="example-label">{t('brief.input')}</div>
                <pre>{ex.stdin || t('brief.noInput')}</pre>
              </div>
              <div>
                <div className="example-label">{t('brief.expectedOutput')}</div>
                <pre>{ex.expected}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
      {exercise.hiddenTests > 0 && (
        <p className="hint">{t('brief.hiddenTests', { count: exercise.hiddenTests })}</p>
      )}
      <Hints hints={exercise.hints} />
    </div>
  );
}

// Suggerimenti progressivi: se ne scopre uno alla volta.
function Hints({ hints }) {
  const { t } = useI18n();
  const [shown, setShown] = useState(0);
  if (!hints?.length) return null;
  return (
    <div className="hints">
      {hints.slice(0, shown).map((h, i) => (
        <div className="hint-card" key={i}>
          <div className="example-label">{t('hints.title', { n: i + 1 })}</div>
          <p>
            <Inline text={h.text} />
          </p>
          {h.code && <ContentBlock block={h} />}
        </div>
      ))}
      {shown < hints.length && (
        <button className="ghost-btn hint-btn" onClick={() => setShown(shown + 1)}>
          {t('hints.show', { shown: shown + 1, total: hints.length })}
        </button>
      )}
    </div>
  );
}
