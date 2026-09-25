// Lingua dell'interfaccia: il server la usa per consegne, output attesi ed errori.
let locale = 'it';
export function setApiLocale(value) {
  locale = value;
}

async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: { ...options.headers, 'X-Locale': locale },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(body.error ?? `HTTP ${res.status}`), { body });
  return body;
}

const post = (path, data) =>
  request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const api = {
  health: () => request('/health'),
  player: () => request('/player'),
  exercises: () => request('/exercises'),
  exercise: (id) => request(`/exercises/${id}`),
  run: (language, code, stdin) => post('/run', { language, code, stdin }),
  submit: (id, code) => post(`/exercises/${id}/submit`, { code }),
  shop: () => request('/shop'),
  buy: (id) => post(`/shop/${id}/buy`, {}),
  equip: (id, equipped) => post(`/shop/${id}/equip`, { equipped }),
  mail: () => request('/mail'),
  lessons: () => request('/lessons'),
  lesson: (id) => request(`/lessons/${id}`),
  lessonProgress: (id, progress) => post(`/lessons/${id}/progress`, progress),
};
