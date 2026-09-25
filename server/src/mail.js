import { localize } from './locales.js';
import { CAREER_LEVELS, SENDERS, describeLevel } from './career.js';

// Posta aziendale: si ricava dallo stato del giocatore (benvenuto + una mail per ogni
// promozione ottenuta), quindi non serve salvarla.
export const MAIL_TEXT = {
  it: {
    welcomeSubject: 'Benvenuto in DevCareer!',
    welcomeBody:
      'Ciao e benvenuto! Da oggi sei il nostro nuovo stagista.\n\nSul tuo PC trovi:\n• Corsi: le lezioni, con slide ed esempi da provare. Ogni lezione è seguita dai suoi esercizi.\n• Editor: gli esercizi e i progetti finali. Ognuno completato ti fa guadagnare.\n• Negozio: spendi i guadagni per attrezzare la tua scrivania.\n• Profilo: a che punto sei della carriera.\n\nOgni modulo si chiude con un progetto finale: completalo per ottenere una promozione. Buon lavoro!',
    promotionSubject: 'Promozione: {role} · {contract}',
  },
  en: {
    welcomeSubject: 'Welcome to DevCareer!',
    welcomeBody:
      'Hi and welcome! From today you are our new intern.\n\nOn your PC you’ll find:\n• Courses: the lessons, with slides and examples to try. Each lesson is followed by its exercises.\n• Editor: the exercises and final projects. Each one you complete earns you money.\n• Shop: spend your earnings to kit out your desk.\n• Profile: where you are in your career.\n\nEvery module ends with a final project: complete it to get a promotion. Good luck!',
    promotionSubject: 'Promotion: {role} · {contract}',
  },
};

// Dalla più recente alla più vecchia.
export function mailFor(levelIndex, locale) {
  const text = MAIL_TEXT[locale];
  const mails = [
    {
      id: 'welcome',
      from: localize(SENDERS.hr, locale),
      subject: text.welcomeSubject,
      body: text.welcomeBody,
    },
  ];
  for (const level of CAREER_LEVELS.slice(1, levelIndex + 1)) {
    const d = describeLevel(level, locale);
    mails.push({
      id: `promotion-${level.id}`,
      from: d.from,
      subject: text.promotionSubject.replace('{role}', d.role).replace('{contract}', d.contract),
      body: d.message,
    });
  }
  return mails.reverse();
}
