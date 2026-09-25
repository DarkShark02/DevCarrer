import { localize } from './locales.js';

// Oggetti per la scrivania. Ognuno ha un posto fisso sulla postazione 3D (vedi
// client/src/office/deskItems.js). Pochi hanno un effetto sul gioco (`effect`).
export const ITEMS = [
  {
    id: 'cactus',
    icon: '🌵',
    price: 40,
    name: { it: 'Piccolo cactus', en: 'Tiny cactus' },
    description: { it: 'Non ha bisogno di acqua, solo di un po’ di compagnia.', en: 'Needs no water, just a little company.' },
  },
  {
    id: 'photo',
    icon: '🖼️',
    price: 80,
    name: { it: 'Foto incorniciata', en: 'Framed photo' },
    description: { it: 'Un ricordo da guardare mentre il codice compila.', en: 'Something to look at while the code compiles.' },
  },
  {
    id: 'plant',
    icon: '🪴',
    price: 120,
    name: { it: 'Monstera', en: 'Monstera' },
    description: { it: 'Una pianta grande accanto alla scrivania. L’open space ringrazia.', en: 'A big plant next to your desk. The open space thanks you.' },
  },
  {
    id: 'lamp',
    icon: '💡',
    price: 150,
    name: { it: 'Lampada da scrivania', en: 'Desk lamp' },
    description: { it: 'Luce calda per le sessioni di debug serali.', en: 'Warm light for late-night debugging sessions.' },
  },
  {
    id: 'duck',
    icon: '🦆',
    price: 180,
    effect: 'test-diff',
    name: { it: 'Papera di gomma', en: 'Rubber duck' },
    description: { it: 'Il classico rubber duck debugging.', en: 'Classic rubber duck debugging.' },
    effectText: {
      it: 'Quando un test fallisce, ti mostra riga per riga dove l’output è diverso.',
      en: 'When a test fails, it shows you line by line where the output differs.',
    },
  },
  {
    id: 'headphones',
    icon: '🎧',
    price: 200,
    name: { it: 'Cuffie', en: 'Headphones' },
    description: { it: 'Il segnale universale per «sono concentrato».', en: 'The universal sign for “I’m focused”.' },
  },
  {
    id: 'figure',
    icon: '🤖',
    price: 220,
    name: { it: 'Robottino', en: 'Little robot' },
    description: { it: 'Veglia sul tuo codice dall’angolo della scrivania.', en: 'Watches over your code from the corner of your desk.' },
  },
  {
    id: 'keyboard-rgb',
    icon: '⌨️',
    price: 250,
    name: { it: 'Tastiera meccanica RGB', en: 'RGB mechanical keyboard' },
    description: { it: 'Non ti fa scrivere codice migliore, ma sembra di sì.', en: 'It won’t make your code better, but it feels like it does.' },
  },
  {
    id: 'chair-gaming',
    icon: '🪑',
    price: 350,
    name: { it: 'Sedia gaming', en: 'Gaming chair' },
    description: { it: 'Poggiatesta, fianchi imbottiti e molto stile.', en: 'Headrest, padded sides and plenty of style.' },
  },
  {
    id: 'monitor-xl',
    icon: '🖥️',
    price: 400,
    effect: 'big-monitor',
    name: { it: 'Monitor grande', en: 'Big monitor' },
    description: { it: 'Un monitor da 32 pollici al posto di quello aziendale.', en: 'A 32-inch monitor instead of the company one.' },
    effectText: {
      it: 'Quando sei alla scrivania lo schermo occupa più spazio: più posto per il codice.',
      en: 'When you’re at your desk the screen takes up more space: more room for code.',
    },
  },
  {
    id: 'espresso',
    icon: '☕',
    price: 500,
    effect: 'reward-bonus',
    name: { it: 'Macchina espresso', en: 'Espresso machine' },
    description: { it: 'Caffè vero, direttamente sulla scrivania.', en: 'Real coffee, right on your desk.' },
    effectText: {
      it: '+10% su tutte le ricompense degli esercizi.',
      en: '+10% on all exercise rewards.',
    },
  },
];

export const REWARD_BONUS = 0.1;

const BY_ID = new Map(ITEMS.map((item) => [item.id, item]));

export function getItem(id) {
  return BY_ID.get(id) ?? null;
}

// Gli effetti valgono per gli oggetti posati sulla scrivania, non per quelli nascosti.
export function effectsFor(equippedIds) {
  const on = (effect) => equippedIds.some((id) => getItem(id)?.effect === effect);
  return {
    rewardMultiplier: on('reward-bonus') ? 1 + REWARD_BONUS : 1,
    testDiff: on('test-diff'),
    bigMonitor: on('big-monitor'),
  };
}

export function toPublicItem(item, locale, inventory) {
  const owned = inventory.get(item.id);
  return {
    id: item.id,
    icon: item.icon,
    price: item.price,
    name: localize(item.name, locale),
    description: localize(item.description, locale),
    effect: item.effectText ? localize(item.effectText, locale) : null,
    owned: !!owned,
    equipped: !!owned?.equipped,
  };
}
