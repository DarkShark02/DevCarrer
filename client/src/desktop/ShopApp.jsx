import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { useI18n } from '../i18n/index.jsx';

// App «Negozio»: compri oggetti e decidi quali tenere sulla scrivania.
export default function ShopApp({ visible, player, onPlayerChange }) {
  const { locale, t } = useI18n();
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    api.shop().then(setItems).catch((e) => setError(e.message));
  }, []);

  // Ricarica quando l'app viene aperta o cambia la lingua.
  useEffect(() => {
    if (visible) load();
  }, [visible, locale, load]);

  async function act(id, request) {
    setBusy(id);
    setError(null);
    try {
      const res = await request();
      onPlayerChange(res.player);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  }

  const balance = player?.balance ?? 0;
  return (
    <div className="shop-app">
      <div className="app-header">
        <p className="muted">{t('shop.intro')}</p>
        <span className="app-balance">💰 {balance} €</span>
      </div>
      {error && <div className="app-error">{error}</div>}
      <div className="shop-grid">
        {items.map((item) => (
          <div key={item.id} className={`shop-item ${item.owned ? 'owned' : ''} ${item.effect ? 'useful' : ''}`}>
            <div className="shop-icon">{item.icon}</div>
            <div className="shop-name">{item.name}</div>
            <div className="shop-desc">{item.description}</div>
            {item.effect && <div className="shop-effect">{t('shop.effect', { effect: item.effect })}</div>}
            <div className="shop-actions">
              {!item.owned ? (
                <button
                  className="submit-btn"
                  disabled={busy === item.id || balance < item.price}
                  title={balance < item.price ? t('shop.missing', { missing: item.price - balance }) : undefined}
                  onClick={() => act(item.id, () => api.buy(item.id))}
                >
                  {balance < item.price ? t('shop.missing', { missing: item.price - balance }) : t('shop.buy', { price: item.price })}
                </button>
              ) : (
                <>
                  <span className={`shop-state ${item.equipped ? 'on' : ''}`}>
                    {item.equipped ? t('shop.onDesk') : t('shop.stored')}
                  </span>
                  <button
                    className="ghost-btn"
                    disabled={busy === item.id}
                    onClick={() => act(item.id, () => api.equip(item.id, !item.equipped))}
                  >
                    {item.equipped ? t('shop.hide') : t('shop.show')}
                  </button>
                </>
              )}
            </div>
            {item.owned && item.effect && !item.equipped && <div className="shop-note muted">{t('shop.effectOff')}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
