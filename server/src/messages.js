// Messaggi d'errore dell'API, nella lingua scelta dal giocatore.
export const MESSAGES = {
  it: {
    emptyCode: 'Il codice è vuoto.',
    codeTooLong: 'Il codice è troppo lungo.',
    unsupportedLanguage: 'Linguaggio non supportato: {language}',
    runFailed: 'Esecuzione non riuscita: {detail}',
    gradeFailed: 'Verifica non riuscita: {detail}',
    notFound: 'Esercizio non trovato.',
    locked: 'Esercizio ancora bloccato.',
    itemNotFound: 'Oggetto non trovato.',
    alreadyOwned: 'Hai già questo oggetto.',
    notEnoughMoney: 'Non hai abbastanza soldi.',
    notOwned: 'Non possiedi questo oggetto.',
    lessonNotFound: 'Lezione non trovata.',
    lessonLocked: 'Lezione ancora bloccata.',
  },
  en: {
    emptyCode: 'The code is empty.',
    codeTooLong: 'The code is too long.',
    unsupportedLanguage: 'Unsupported language: {language}',
    runFailed: 'Execution failed: {detail}',
    gradeFailed: 'Check failed: {detail}',
    notFound: 'Exercise not found.',
    locked: 'This exercise is still locked.',
    itemNotFound: 'Item not found.',
    alreadyOwned: 'You already own this item.',
    notEnoughMoney: 'You don’t have enough money.',
    notOwned: 'You don’t own this item.',
    lessonNotFound: 'Lesson not found.',
    lessonLocked: 'This lesson is still locked.',
  },
};

export function message(locale, key, vars = {}) {
  return MESSAGES[locale][key].replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '');
}
