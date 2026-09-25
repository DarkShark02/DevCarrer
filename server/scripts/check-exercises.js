// Verifica la coerenza dei contenuti, per ogni lingua dell'interfaccia:
//  1. la soluzione di riferimento supera tutti i test; il codice iniziale no
//  2. ogni esempio di codice (consegna e suggerimenti) produce davvero l'output dichiarato
//  3. ogni riga di output attesa che contiene testo compare nella consegna
//     (a meno di numeri e valori letti dall'input, scritti come <segnaposto>)
//  4. ogni stringa tra virgolette nei suggerimenti e nel codice iniziale fa parte
//     dell'output atteso: niente hint che stampano "Ciao" quando il test vuole "Hello"
//  5. nessun testo contiene l'output atteso di un'altra lingua
//  6. traduzioni complete: esercizi, carriera, negozio, posta, messaggi del server, testi del client
//  7. lezioni: gli esempi delle slide stampano quello che dichiarano; nei quiz «cosa stampa?»
//     la risposta giusta è proprio l'output del codice e nessuna risposta sbagliata lo è;
//     ogni esercizio sta in una sola lezione del suo modulo
//  8. progetti: uno per modulo, ultimo esercizio del modulo, senza lezione
import { EXERCISES, expectedFor } from '../src/exercises/index.js';
import { getLanguage } from '../src/languages.js';
import { grade, normalize } from '../src/grader.js';
import { execute } from '../src/piston.js';
import { LOCALES } from '../src/locales.js';
import { MESSAGES } from '../src/messages.js';
import { MODULES, CAREER_LEVELS, ROLES, CONTRACTS, SENDERS } from '../src/career.js';
import { ITEMS } from '../src/shop.js';
import { MAIL_TEXT } from '../src/mail.js';
import { STRINGS } from '../../client/src/i18n/strings.js';
import { LESSONS } from '../src/lessons/index.js';

const TEXT_FIELDS = ['topic', 'title', 'brief', 'hints', 'starterCode', 'solution'];
const HAS_LETTER = /\p{L}/u;

const lines = (text) => normalize(text).split('\n');
const inlineCode = (text) => [...text.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
const quoted = (text) => [...text.matchAll(/"([^"\n]*)"/g)].map((m) => m[1]);

// Riduce una riga a uno schema: numeri, valori letti dall'input e <segnaposto> diventano @.
function pattern(line, stdinValues = []) {
  let s = line;
  for (const v of stdinValues) if (HAS_LETTER.test(v)) s = s.split(v).join('@');
  return s.replace(/<[^>]+>/g, '@').replace(/\d+/g, '@');
}

// Tutto il testo che il giocatore vede in una lingua, per il controllo 5.
function visibleText(text) {
  const parts = [text.title, text.topic, text.starterCode];
  for (const b of text.brief) parts.push(typeof b === 'string' ? b : [b.code, b.output, b.pre, ...(b.list ?? [])].join('\n'));
  for (const h of text.hints) parts.push([h.text, h.code, h.output].join('\n'));
  return parts.filter(Boolean).join('\n');
}

async function checkSnippet(lang, snippet, where) {
  if (snippet.output === undefined) return [`${where}: esempio di codice senza "output" dichiarato`];
  const run = await execute(lang, snippet.code, snippet.stdin ?? '');
  if (run.exitCode !== 0) return [`${where}: l'esempio termina con un errore: ${run.stderr.trim()}`];
  if (normalize(run.stdout) !== normalize(snippet.output)) {
    return [`${where}: l'esempio stampa ${JSON.stringify(run.stdout)}, non ${JSON.stringify(snippet.output)}`];
  }
  return [];
}

async function checkExerciseLocale(ex, locale) {
  const text = ex[locale];
  if (!text) return [`manca la traduzione`];
  const missing = TEXT_FIELDS.filter((f) => text[f] === undefined);
  if (missing.length) return [`mancano i campi: ${missing.join(', ')}`];
  if (ex.tests.some((t) => expectedFor(t, locale) === undefined)) return ['output atteso non tradotto'];

  const problems = [];
  const lang = getLanguage(ex.language);

  // 1. Soluzione e codice iniziale
  const solution = await grade(lang, ex, text.solution, locale);
  if (!solution.passed) {
    const failed = solution.results.filter((r) => !r.passed).map((r) => r.name);
    problems.push(`la soluzione fallisce: ${failed.join(', ')}`);
  }
  if (text.starterCode.trim() && (await grade(lang, ex, text.starterCode, locale)).passed) {
    problems.push('il codice iniziale passa già i test');
  }

  // 2. Esempi eseguibili
  for (const [i, b] of text.brief.entries()) {
    if (typeof b === 'object' && b.code) problems.push(...(await checkSnippet(lang, b, `consegna, blocco ${i + 1}`)));
  }
  for (const [i, h] of text.hints.entries()) {
    if (h.code) problems.push(...(await checkSnippet(lang, h, `suggerimento ${i + 1}`)));
  }

  // 3. Le righe di testo attese devono comparire nella consegna
  const briefTargets = new Set(
    text.brief.flatMap((b) =>
      typeof b === 'string' ? inlineCode(b) : b.pre ? lines(b.pre) : b.list ? b.list.flatMap(inlineCode) : [],
    ).map((s) => pattern(s)),
  );
  const expectedLines = [];
  for (const test of ex.tests) {
    const stdinValues = (test.stdin ?? '').split('\n');
    for (const line of lines(expectedFor(test, locale))) {
      expectedLines.push(line);
      if (HAS_LETTER.test(line) && !briefTargets.has(pattern(line, stdinValues))) {
        problems.push(`l'output atteso «${line}» non è indicato nella consegna`);
      }
    }
  }

  // 4. Le stringhe negli hint e nel codice iniziale devono corrispondere all'output atteso
  const sources = [
    ...text.hints.flatMap((h, i) => [h.text, h.code].filter(Boolean).map((s) => [`suggerimento ${i + 1}`, s])),
    ['codice iniziale', text.starterCode],
  ];
  for (const [where, source] of sources) {
    for (const literal of quoted(source)) {
      // Nelle f-string contano solo le parti fisse, fuori dalle graffe.
      for (const piece of literal.split(/\{[^}]*\}/)) {
        if (HAS_LETTER.test(piece) && !expectedLines.some((l) => l.includes(piece))) {
          problems.push(`${where}: la stringa "${piece}" non compare nell'output atteso`);
        }
      }
    }
  }

  // 5. Niente output di altre lingue
  const visible = visibleText(text);
  for (const test of ex.tests) {
    if (typeof test.expected === 'string') continue;
    for (const other of LOCALES.filter((l) => l !== locale)) {
      if (test.expected[other] === test.expected[locale]) continue;
      for (const line of lines(test.expected[other])) {
        // parola intera: «euro» non deve scattare dentro «euros»
        const escaped = line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (HAS_LETTER.test(line) && new RegExp(`(?<!\\p{L})${escaped}(?!\\p{L})`, 'u').test(visible)) {
          problems.push(`il testo contiene «${line}», che è l'output atteso in "${other}"`);
        }
      }
    }
  }

  return [...new Set(problems)];
}

// 6. Traduzioni dei dizionari: stesse chiavi e stessi segnaposto in ogni lingua
function checkDictionary(name, dict) {
  const problems = [];
  const placeholders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
  const [first, ...rest] = LOCALES;
  for (const locale of LOCALES) {
    if (!dict[locale]) problems.push(`${name}: manca la lingua "${locale}"`);
  }
  for (const locale of rest) {
    if (!dict[first] || !dict[locale]) continue;
    const keys = new Set([...Object.keys(dict[first]), ...Object.keys(dict[locale])]);
    for (const key of keys) {
      const a = dict[first][key];
      const b = dict[locale][key];
      if (a === undefined || b === undefined) {
        problems.push(`${name}: la chiave "${key}" manca in "${a === undefined ? first : locale}"`);
      } else if (placeholders(a) !== placeholders(b)) {
        problems.push(`${name}: segnaposto diversi per "${key}" tra "${first}" e "${locale}"`);
      }
    }
  }
  return problems;
}

function checkCareer() {
  const problems = [];
  const translated = (value, where) => {
    for (const locale of LOCALES) if (!value?.[locale]) problems.push(`${where}: manca "${locale}"`);
  };
  for (const m of MODULES) translated(m.title, `modulo ${m.id}`);
  for (const [id, role] of Object.entries(ROLES)) translated(role, `ruolo ${id}`);
  for (const [id, contract] of Object.entries(CONTRACTS)) translated(contract, `contratto ${id}`);
  for (const [id, sender] of Object.entries(SENDERS)) translated(sender, `mittente ${id}`);
  for (const [i, level] of CAREER_LEVELS.entries()) {
    if (!ROLES[level.role]) problems.push(`grado ${level.id}: ruolo sconosciuto "${level.role}"`);
    if (!CONTRACTS[level.contract]) problems.push(`grado ${level.id}: contratto sconosciuto "${level.contract}"`);
    if (i > 0) {
      translated(level.message, `grado ${level.id}, messaggio`);
      if (!SENDERS[level.from]) problems.push(`grado ${level.id}: mittente sconosciuto "${level.from}"`);
    }
    for (const m of level.requires) {
      if (!EXERCISES.some((ex) => ex.module === m)) problems.push(`grado ${level.id}: nessun esercizio nel modulo "${m}"`);
    }
  }
  for (const ex of EXERCISES) {
    if (!MODULES.some((m) => m.id === ex.module)) problems.push(`${ex.id}: modulo sconosciuto "${ex.module}"`);
  }
  return problems;
}

function checkShop() {
  const problems = [];
  const EFFECTS = ['test-diff', 'big-monitor', 'reward-bonus'];
  const ids = new Set();
  for (const item of ITEMS) {
    if (ids.has(item.id)) problems.push(`oggetto duplicato "${item.id}"`);
    ids.add(item.id);
    if (!(item.price > 0)) problems.push(`${item.id}: prezzo non valido`);
    if (item.effect && !EFFECTS.includes(item.effect)) problems.push(`${item.id}: effetto sconosciuto "${item.effect}"`);
    if (!!item.effect !== !!item.effectText) problems.push(`${item.id}: effetto e descrizione dell'effetto non coincidono`);
    for (const field of ['name', 'description', ...(item.effectText ? ['effectText'] : [])]) {
      for (const locale of LOCALES) if (!item[field]?.[locale]) problems.push(`${item.id}: manca ${field} in "${locale}"`);
    }
  }
  return problems;
}

const LESSON_FIELDS = ['title', 'slides', 'quiz'];

async function checkLessonLocale(lesson, locale) {
  const text = lesson[locale];
  if (!text) return ['manca la traduzione'];
  const missing = LESSON_FIELDS.filter((f) => text[f] === undefined);
  if (missing.length) return [`mancano i campi: ${missing.join(', ')}`];
  const problems = [];
  const lang = getLanguage(lesson.language);

  for (const [i, slide] of text.slides.entries()) {
    if (!slide.title || !slide.blocks?.length) problems.push(`slide ${i + 1}: titolo o contenuto mancante`);
    for (const [j, b] of (slide.blocks ?? []).entries()) {
      if (typeof b === 'object' && b.code) problems.push(...(await checkSnippet(lang, b, `slide ${i + 1}, blocco ${j + 1}`)));
    }
  }

  for (const [i, q] of text.quiz.entries()) {
    const where = `quiz ${i + 1}`;
    if (!q.question || !q.explanation) problems.push(`${where}: domanda o spiegazione mancante`);
    if (!Array.isArray(q.options) || q.options.length < 2) {
      problems.push(`${where}: servono almeno due risposte`);
      continue;
    }
    if (new Set(q.options).size !== q.options.length) problems.push(`${where}: risposte duplicate`);
    if (!Number.isInteger(q.answer) || !q.options[q.answer]) problems.push(`${where}: indice della risposta giusta non valido`);
    if (q.type === 'output') {
      if (!q.code) {
        problems.push(`${where}: una domanda «cosa stampa?» deve avere il codice`);
        continue;
      }
      const run = await execute(lang, q.code, '');
      if (run.exitCode !== 0) {
        problems.push(`${where}: il codice termina con un errore: ${run.stderr.trim()}`);
        continue;
      }
      const out = normalize(run.stdout);
      if (normalize(q.options[q.answer] ?? '') !== out) {
        problems.push(`${where}: il codice stampa ${JSON.stringify(out)}, ma la risposta giusta è ${JSON.stringify(q.options[q.answer])}`);
      }
      q.options.forEach((opt, k) => {
        if (k !== q.answer && normalize(opt) === out) problems.push(`${where}: anche la risposta ${k + 1} coincide con l'output`);
      });
    } else if (q.type === 'choice') {
      if (q.code) {
        const run = await execute(lang, q.code, '');
        if (run.exitCode !== 0) problems.push(`${where}: il codice mostrato termina con un errore`);
      }
    } else {
      problems.push(`${where}: tipo di domanda sconosciuto "${q.type}"`);
    }
  }
  return problems;
}

// Collegamenti tra lezioni, esercizi e progetti, e parità tra le lingue.
function checkCourseStructure() {
  const problems = [];
  const seen = new Map();
  for (const lesson of LESSONS) {
    if (!MODULES.some((m) => m.id === lesson.module)) problems.push(`${lesson.id}: modulo sconosciuto "${lesson.module}"`);
    if (!lesson.exercises.length) problems.push(`${lesson.id}: nessun esercizio collegato`);
    for (const id of lesson.exercises) {
      const ex = EXERCISES.find((e) => e.id === id);
      if (!ex) problems.push(`${lesson.id}: esercizio sconosciuto "${id}"`);
      else if (ex.kind === 'project') problems.push(`${lesson.id}: "${id}" è un progetto, non va collegato a una lezione`);
      else if (ex.module !== lesson.module) problems.push(`${lesson.id}: "${id}" è di un altro modulo`);
      if (seen.has(id)) problems.push(`"${id}" è in due lezioni (${seen.get(id)} e ${lesson.id})`);
      seen.set(id, lesson.id);
    }
    const [first, ...rest] = LOCALES;
    for (const locale of rest) {
      if (!lesson[first] || !lesson[locale]) continue;
      if (lesson[first].slides.length !== lesson[locale].slides.length) problems.push(`${lesson.id}: numero di slide diverso tra "${first}" e "${locale}"`);
      if (lesson[first].quiz.length !== lesson[locale].quiz.length) problems.push(`${lesson.id}: numero di domande diverso tra "${first}" e "${locale}"`);
      lesson[first].quiz.forEach((q, i) => {
        const other = lesson[locale].quiz[i];
        if (other && (other.answer !== q.answer || other.type !== q.type)) problems.push(`${lesson.id}: la domanda ${i + 1} non corrisponde tra le lingue`);
      });
    }
  }
  for (const ex of EXERCISES) {
    if (ex.kind !== 'project' && !seen.has(ex.id)) problems.push(`"${ex.id}" non è in nessuna lezione`);
  }
  for (const m of MODULES) {
    const inModule = EXERCISES.filter((ex) => ex.module === m.id);
    const projects = inModule.filter((ex) => ex.kind === 'project');
    if (projects.length !== 1) problems.push(`modulo "${m.id}": servono esattamente un progetto finale (ne ha ${projects.length})`);
    else if (inModule.at(-1) !== projects[0]) problems.push(`modulo "${m.id}": il progetto deve essere l'ultimo esercizio del modulo`);
  }
  return problems;
}

let failures = 0;
function report(label, problems) {
  if (problems.length) failures++;
  console.log(`${problems.length ? 'FAIL' : 'OK  '} ${label}`);
  for (const p of problems) console.log(`       - ${p}`);
}

for (const ex of EXERCISES) {
  for (const locale of LOCALES) report(`${ex.id} [${locale}]`, await checkExerciseLocale(ex, locale));
}
for (const lesson of LESSONS) {
  for (const locale of LOCALES) report(`${lesson.id} [${locale}]`, await checkLessonLocale(lesson, locale));
}
report('lezioni, esercizi e progetti', checkCourseStructure());
report('carriera e moduli', checkCareer());
report('negozio', checkShop());
report('posta', checkDictionary('mail', MAIL_TEXT));
report('messaggi del server', checkDictionary('server', MESSAGES));
report('testi del client', checkDictionary('client', STRINGS));

console.log(failures ? `\n${failures} controlli con problemi` : '\nTutti i contenuti sono coerenti');
process.exitCode = failures ? 1 : 0;
