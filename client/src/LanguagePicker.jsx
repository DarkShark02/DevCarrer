import { LOCALES } from './i18n/index.jsx';

// Prima schermata: la lingua non è ancora scelta, quindi il testo è in tutte le lingue.
export default function LanguagePicker({ onPick }) {
  return (
    <div className="picker">
      <div className="picker-card">
        <div className="brand">
          <span className="logo">&lt;/&gt;</span> DevCareer
        </div>
        <p>
          In che lingua vuoi giocare?
          <br />
          <span className="muted">Which language do you want to play in?</span>
        </p>
        <div className="picker-options">
          {LOCALES.map((l) => (
            <button key={l.id} className="submit-btn" onClick={() => onPick(l.id)}>
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
