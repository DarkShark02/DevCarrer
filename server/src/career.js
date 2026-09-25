import { localize } from './locales.js';

// Moduli didattici: gruppi di argomenti, indipendenti dal linguaggio di programmazione.
// Ogni esercizio dichiara il suo modulo; la carriera avanza completando moduli interi.
export const MODULES = [
  { id: 'basics', title: { it: 'Le basi', en: 'The basics' } },
  { id: 'conditions', title: { it: 'Condizioni', en: 'Conditions' } },
  { id: 'loops', title: { it: 'Cicli', en: 'Loops' } },
  { id: 'functions', title: { it: 'Funzioni', en: 'Functions' } },
];

export const ROLES = {
  intern: { it: 'Stagista', en: 'Intern' },
  junior: { it: 'Junior Developer', en: 'Junior Developer' },
  mid: { it: 'Mid Developer', en: 'Mid Developer' },
};

export const CONTRACTS = {
  internship: { it: 'Stage', en: 'Internship' },
  'fixed-term': { it: 'Tempo determinato', en: 'Fixed-term contract' },
  permanent: { it: 'Tempo indeterminato', en: 'Permanent contract' },
};

// Chi scrive i messaggi (dialoghi delle promozioni e posta aziendale).
export const SENDERS = {
  hr: { it: 'Ufficio HR', en: 'HR office' },
  lead: { it: 'Team lead', en: 'Team lead' },
  cto: { it: 'CTO', en: 'CTO' },
};

// Gradi in ordine. Un grado si ottiene completando i suoi moduli e quelli dei gradi precedenti.
export const CAREER_LEVELS = [
  { id: 'intern', role: 'intern', contract: 'internship', requires: [] },
  {
    id: 'junior-fixed',
    role: 'junior',
    contract: 'fixed-term',
    requires: ['basics'],
    from: 'hr',
    message: {
      it: 'Lo stage è andato benissimo. Ti proponiamo un contratto a tempo determinato come Junior Developer!',
      en: 'Your internship went great. We’re offering you a fixed-term contract as a Junior Developer!',
    },
  },
  {
    id: 'junior-permanent',
    role: 'junior',
    contract: 'permanent',
    requires: ['conditions', 'loops'],
    from: 'lead',
    message: {
      it: 'Colloquio superato. Benvenuto nel team a tempo indeterminato!',
      en: 'You passed the interview. Welcome to the team on a permanent contract!',
    },
  },
  {
    id: 'mid',
    role: 'mid',
    contract: 'permanent',
    requires: ['functions'],
    from: 'cto',
    message: {
      it: 'Le tue funzioni sono pulite e riutilizzabili. Da oggi sei Mid Developer.',
      en: 'Your functions are clean and reusable. From today you’re a Mid Developer.',
    },
  },
];

export function moduleTitle(id, locale) {
  const mod = MODULES.find((m) => m.id === id);
  return mod ? localize(mod.title, locale) : id;
}

// Grado più alto i cui requisiti (e quelli dei gradi precedenti) sono tutti soddisfatti.
export function levelIndexFor(doneModules) {
  let idx = 0;
  for (let i = 1; i < CAREER_LEVELS.length; i++) {
    if (!CAREER_LEVELS[i].requires.every((m) => doneModules.has(m))) break;
    idx = i;
  }
  return idx;
}

export function describeLevel(level, locale) {
  return {
    id: level.id,
    role: localize(ROLES[level.role], locale),
    contract: localize(CONTRACTS[level.contract], locale),
    from: level.from ? localize(SENDERS[level.from], locale) : null,
    message: level.message ? localize(level.message, locale) : null,
  };
}
