import { useEffect, useRef, useState } from 'react';
import { useI18n } from './i18n/index.jsx';

// Ufficio 3D. Quando sei seduto, `children` (il desktop del PC) viene posizionato
// esattamente sopra lo schermo 3D del tuo monitor. Il desktop resta sempre montato
// (solo nascosto), così l'editor non perde il codice quando ti alzi.
// `focused`: un'app è aperta, la camera si avvicina al monitor.
export default function Office({ seated, focused, deskInfo, deskItems, onSit, onEscape, onUnavailable, children }) {
  const { t } = useI18n();
  const mountRef = useRef(null);
  const overlayRef = useRef(null);
  const sceneRef = useRef(null);
  const [near, setNear] = useState(false);
  const [loading, setLoading] = useState(true);
  const [screenVisible, setScreenVisible] = useState(false);

  // I valori più recenti, letti dalla scena che si carica in modo asincrono.
  const latest = useRef();
  latest.current = { seated, focused, deskInfo, deskItems, onSit, onEscape, onUnavailable };

  // Durante lo zoom la scena aggiorna il rettangolo a ogni fotogramma: lo stile si
  // imposta direttamente, senza passare dallo stato di React.
  function placeOverlay(rect) {
    const el = overlayRef.current;
    if (!el) return;
    if (!rect) {
      el.style.display = 'none';
      setScreenVisible(false);
      return;
    }
    el.style.display = '';
    el.style.left = `${rect.left}px`;
    el.style.top = `${rect.top}px`;
    el.style.width = `${rect.layoutWidth}px`;
    el.style.height = `${rect.layoutHeight}px`;
    el.style.transform = `scale(${rect.width / rect.layoutWidth})`;
    setScreenVisible(true);
  }

  useEffect(() => {
    let disposed = false;
    let office = null;
    // Three.js si carica solo qui, in un pezzo separato del bundle.
    import('./office/OfficeScene.js')
      .then(({ OfficeScene }) => {
        if (disposed) return;
        office = new OfficeScene(mountRef.current, {
          onNearDeskChange: setNear,
          onSit: () => latest.current.onSit(),
          onEscape: () => latest.current.onEscape(),
          onScreenRect: placeOverlay,
        });
        office.setDeskInfo(latest.current.deskInfo);
        office.setDeskItems(latest.current.deskItems);
        office.setFocus(latest.current.focused);
        if (latest.current.seated) office.sit();
        sceneRef.current = office;
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ufficio 3D non disponibile:', err);
        if (!disposed) latest.current.onUnavailable();
      });
    return () => {
      disposed = true;
      office?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    const office = sceneRef.current;
    if (!office) return;
    if (seated) office.sit();
    else office.standUp();
  }, [seated]);

  useEffect(() => {
    sceneRef.current?.setFocus(focused);
  }, [focused]);

  const itemsKey = deskItems.join(',');
  useEffect(() => {
    sceneRef.current?.setDeskItems(latest.current.deskItems);
  }, [itemsKey]);

  useEffect(() => {
    sceneRef.current?.setDeskInfo(latest.current.deskInfo);
  }, [deskInfo.title, deskInfo.subtitle]);

  return (
    <div className="office-view">
      <div className="office-canvas" ref={mountRef} />
      <div className="pc-overlay" ref={overlayRef} style={{ display: 'none' }}>
        {children}
      </div>
      {loading ? (
        <div className="office-hud">{t('office.loading')}</div>
      ) : seated ? (
        screenVisible && (
          <div className="office-hud office-hud-small muted">
            {focused ? t('office.focusHint') : t('office.deskHint')}
          </div>
        )
      ) : near ? (
        <div className="office-hud">
          <button className="submit-btn office-sit" onClick={() => onSit()}>
            {t('office.sit')}
          </button>
        </div>
      ) : (
        <div className="office-hud muted">{t('office.help')}</div>
      )}
    </div>
  );
}
