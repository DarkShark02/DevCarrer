import { useState } from 'react';
import { useI18n } from '../i18n/index.jsx';

// App «Posta»: messaggi di benvenuto e delle promozioni.
export default function MailApp({ mail, readIds, onRead }) {
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState(null);
  const selected = mail.find((m) => m.id === selectedId);

  function open(m) {
    setSelectedId(m.id);
    onRead(m.id);
  }

  return (
    <div className="mail-app">
      <ul className="mail-list">
        {mail.map((m) => (
          <li key={m.id}>
            <button
              className={`mail-item ${m.id === selectedId ? 'active' : ''} ${readIds.has(m.id) ? '' : 'unread'}`}
              onClick={() => open(m)}
            >
              <span className="mail-from">{m.from}</span>
              <span className="mail-subject">{m.subject}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mail-view">
        {selected ? (
          <>
            <h3>{selected.subject}</h3>
            <div className="muted mail-meta">{t('mail.from', { from: selected.from })}</div>
            <div className="mail-body">{selected.body}</div>
          </>
        ) : (
          <p className="muted">{t('mail.pick')}</p>
        )}
      </div>
    </div>
  );
}
