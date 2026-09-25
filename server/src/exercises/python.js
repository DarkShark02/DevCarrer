// Percorso Python. L'ordine dell'array è l'ordine didattico.
//
// Struttura di un esercizio:
//   module: id del modulo didattico (career.js), comune a tutti i linguaggi
//   tests:  stdin → expected. `expected` è una stringa se l'output non dipende dalla lingua,
//           altrimenti { it, en }. I test "hidden" non vengono mostrati al giocatore.
//   it/en:  tutto ciò che il giocatore legge, nella sua lingua:
//     brief:  paragrafi (stringhe, `codice` inline), esempi eseguibili { code, stdin?, output }
//             e blocchi di testo { pre } (es. l'output da riprodurre)
//     hints:  suggerimenti progressivi { text, code?, stdin?, output? }
//     starterCode, solution (la soluzione resta sul server)
//
// Dopo ogni modifica: `npm run check-exercises -w server` (vedi scripts/check-exercises.js).
// I progetti finali di modulo (kind: 'project') sono in python-projects.js.

import { receipt, bonus, tickets, warehouse } from './python-projects.js';

export default [
  {
    id: 'py-hello',
    module: 'basics',
    reward: 50,
    tests: [{ expected: 'Hello, World!' }],
    it: {
      topic: 'Output',
      title: 'Hello, World!',
      brief: [
        'Primo giorno da stagista. Il team lead vuole verificare che il tuo ambiente funzioni e, per tradizione, il primo programma saluta il mondo.',
        'La funzione `print()` scrive a schermo il testo che metti tra le parentesi, racchiuso tra virgolette.',
        'Stampa esattamente: `Hello, World!` (con la virgola, la W maiuscola e il punto esclamativo).',
      ],
      hints: [
        { text: 'Il testo va tra virgolette doppie, dentro le parentesi di `print()`.' },
        { text: 'Ecco la riga completa:', code: 'print("Hello, World!")', output: 'Hello, World!' },
      ],
      starterCode: '# Scrivi il tuo codice qui sotto\n',
      solution: 'print("Hello, World!")',
    },
    en: {
      topic: 'Output',
      title: 'Hello, World!',
      brief: [
        'First day as an intern. The team lead wants to check that your setup works and, by tradition, your first program greets the world.',
        'The `print()` function writes to the screen the text you put between its parentheses, wrapped in quotes.',
        'Print exactly: `Hello, World!` (with the comma, the capital W and the exclamation mark).',
      ],
      hints: [
        { text: 'The text goes between double quotes, inside the parentheses of `print()`.' },
        { text: 'Here is the whole line:', code: 'print("Hello, World!")', output: 'Hello, World!' },
      ],
      starterCode: '# Write your code below\n',
      solution: 'print("Hello, World!")',
    },
  },
  {
    id: 'py-multiline',
    module: 'basics',
    reward: 50,
    tests: [
      {
        expected: {
          it: 'Ciao team!\nOggi è il mio primo giorno.\nPronto a scrivere codice!',
          en: 'Hi team!\nToday is my first day.\nReady to write code!',
        },
      },
    ],
    it: {
      topic: 'Output',
      title: 'Presentati al team',
      brief: [
        'Al daily stand-up tocca a te presentarti. Ogni chiamata a `print()` va a capo da sola, quindi per scrivere più righe basta usare più `print()`:',
        { code: 'print("Riga uno")\nprint("Riga due")', output: 'Riga uno\nRiga due' },
        'Stampa queste tre righe, in quest’ordine:',
        { pre: 'Ciao team!\nOggi è il mio primo giorno.\nPronto a scrivere codice!' },
      ],
      hints: [
        { text: 'Servono tre `print()`, uno per riga, ognuno con il suo testo tra virgolette.' },
        { text: 'La prima riga è:', code: 'print("Ciao team!")', output: 'Ciao team!' },
      ],
      starterCode: '',
      solution:
        'print("Ciao team!")\nprint("Oggi è il mio primo giorno.")\nprint("Pronto a scrivere codice!")',
    },
    en: {
      topic: 'Output',
      title: 'Introduce yourself',
      brief: [
        'It’s your turn to introduce yourself at the daily stand-up. Every `print()` call ends its own line, so to write several lines you just use several `print()` calls:',
        { code: 'print("Line one")\nprint("Line two")', output: 'Line one\nLine two' },
        'Print these three lines, in this order:',
        { pre: 'Hi team!\nToday is my first day.\nReady to write code!' },
      ],
      hints: [
        { text: 'You need three `print()` calls, one per line, each with its own text in quotes.' },
        { text: 'The first line is:', code: 'print("Hi team!")', output: 'Hi team!' },
      ],
      starterCode: '',
      solution: 'print("Hi team!")\nprint("Today is my first day.")\nprint("Ready to write code!")',
    },
  },
  {
    id: 'py-input',
    module: 'basics',
    reward: 75,
    tests: [
      { stdin: 'Ada', expected: { it: 'Badge attivato per Ada', en: 'Badge activated for Ada' } },
      {
        stdin: 'Linus',
        expected: { it: 'Badge attivato per Linus', en: 'Badge activated for Linus' },
        hidden: true,
      },
      {
        stdin: 'Grace Hopper',
        expected: { it: 'Badge attivato per Grace Hopper', en: 'Badge activated for Grace Hopper' },
        hidden: true,
      },
    ],
    it: {
      topic: 'Variabili e input',
      title: 'Il badge d’ingresso',
      brief: [
        'La reception ti chiede lo script che attiva i badge. Il nome del dipendente arriva dall’input.',
        '`input()` legge una riga di testo; con `=` la salvi in una variabile per usarla dopo. `print()` accetta più valori separati da virgole e li stampa separati da uno spazio:',
        { code: 'citta = input()\nprint("Benvenuto a", citta)', stdin: 'Roma', output: 'Benvenuto a Roma' },
        'Leggi un nome e stampa `Badge attivato per <nome>`. Esempio: con input `Ada` devi stampare `Badge attivato per Ada`.',
        'Per provarlo, scrivi il nome nel riquadro «Input» prima di premere Esegui.',
      ],
      hints: [
        { text: 'Prima salva il nome in una variabile con `input()`, poi passalo a `print()` insieme al testo fisso.' },
        { text: 'Tra il testo e la variabile serve una virgola: `print("Badge attivato per", nome)`.' },
      ],
      starterCode: '',
      solution: 'nome = input()\nprint("Badge attivato per", nome)',
    },
    en: {
      topic: 'Variables and input',
      title: 'The entry badge',
      brief: [
        'Reception needs the script that activates employee badges. The employee’s name comes from the input.',
        '`input()` reads one line of text; with `=` you store it in a variable to use later. `print()` accepts several values separated by commas and prints them separated by a space:',
        { code: 'city = input()\nprint("Welcome to", city)', stdin: 'Rome', output: 'Welcome to Rome' },
        'Read a name and print `Badge activated for <name>`. Example: with input `Ada` you must print `Badge activated for Ada`.',
        'To try it, type the name in the Input box before pressing Run.',
      ],
      hints: [
        { text: 'First store the name in a variable with `input()`, then pass it to `print()` together with the fixed text.' },
        { text: 'You need a comma between the text and the variable: `print("Badge activated for", name)`.' },
      ],
      starterCode: '',
      solution: 'name = input()\nprint("Badge activated for", name)',
    },
  },
  {
    id: 'py-sum',
    module: 'basics',
    reward: 75,
    tests: [
      { stdin: '3\n4', expected: '7' },
      { stdin: '0\n0', expected: '0', hidden: true },
      { stdin: '12\n30', expected: '42', hidden: true },
    ],
    it: {
      topic: 'Numeri',
      title: 'Il contatore dei caffè',
      brief: [
        'L’ufficio vuole sapere quanti caffè consuma il team. Riceverai due numeri interi, uno per riga: i caffè di lunedì e quelli di martedì.',
        'Attenzione: `input()` restituisce sempre del testo, e sommare due testi li attacca uno all’altro. Per fare calcoli devi convertirlo in numero con `int()`:',
        { code: 'print("3" + "4")\nprint(int("3") + int("4"))', output: '34\n7' },
        'Stampa la somma dei due numeri.',
      ],
      hints: [
        { text: 'Leggi i due numeri in due variabili, convertendoli subito con `int()`: `a = int(input())`.' },
        { text: 'Poi basta stampare `a + b`.' },
      ],
      starterCode: '',
      solution: 'a = int(input())\nb = int(input())\nprint(a + b)',
    },
    en: {
      topic: 'Numbers',
      title: 'The coffee counter',
      brief: [
        'The office wants to know how many coffees the team drinks. You’ll receive two whole numbers, one per line: Monday’s coffees and Tuesday’s coffees.',
        'Careful: `input()` always returns text, and adding two texts glues them together. To do maths you have to convert it to a number with `int()`:',
        { code: 'print("3" + "4")\nprint(int("3") + int("4"))', output: '34\n7' },
        'Print the sum of the two numbers.',
      ],
      hints: [
        { text: 'Read the two numbers into two variables, converting them right away with `int()`: `a = int(input())`.' },
        { text: 'Then just print `a + b`.' },
      ],
      starterCode: '',
      solution: 'a = int(input())\nb = int(input())\nprint(a + b)',
    },
  },
  {
    id: 'py-pay',
    module: 'basics',
    reward: 100,
    tests: [
      { stdin: '8\n5', expected: { it: 'Totale: 40 euro', en: 'Total: 40 euros' } },
      { stdin: '10\n0', expected: { it: 'Totale: 0 euro', en: 'Total: 0 euros' }, hidden: true },
      { stdin: '12\n7', expected: { it: 'Totale: 84 euro', en: 'Total: 84 euros' }, hidden: true },
    ],
    it: {
      topic: 'Operatori e f-string',
      title: 'Il calcolo della paga',
      brief: [
        'L’amministrazione ti affida il calcolo dei compensi. Riceverai la tariffa oraria e poi le ore lavorate (due interi, uno per riga).',
        'Le f-string permettono di inserire valori dentro un testo, mettendo le espressioni tra graffe:',
        { code: 'x = 5\nprint(f"Il doppio è {x * 2}")', output: 'Il doppio è 10' },
        'Stampa `Totale: <tariffa × ore> euro`. Esempio: tariffa `8` e ore `5` stampano `Totale: 40 euro`.',
      ],
      hints: [
        { text: 'Moltiplica le due variabili con `*` e metti il risultato dentro una f-string.' },
        { text: 'La riga da stampare ha questa forma: `print(f"Totale: {...} euro")`, dove al posto dei puntini va il calcolo.' },
      ],
      starterCode: 'tariffa = int(input())\nore = int(input())\n',
      solution: 'tariffa = int(input())\nore = int(input())\nprint(f"Totale: {tariffa * ore} euro")',
    },
    en: {
      topic: 'Operators and f-strings',
      title: 'Payroll',
      brief: [
        'Accounting asks you to compute pay. You’ll receive the hourly rate and then the hours worked (two whole numbers, one per line).',
        'f-strings let you put values inside a text by writing expressions between curly braces:',
        { code: 'x = 5\nprint(f"Twice is {x * 2}")', output: 'Twice is 10' },
        'Print `Total: <rate × hours> euros`. Example: rate `8` and hours `5` print `Total: 40 euros`.',
      ],
      hints: [
        { text: 'Multiply the two variables with `*` and put the result inside an f-string.' },
        { text: 'The line to print looks like this: `print(f"Total: {...} euros")`, where the dots are replaced by the calculation.' },
      ],
      starterCode: 'rate = int(input())\nhours = int(input())\n',
      solution: 'rate = int(input())\nhours = int(input())\nprint(f"Total: {rate * hours} euros")',
    },
  },
  receipt,
  {
    id: 'py-if',
    module: 'conditions',
    reward: 100,
    tests: [
      { stdin: '5', expected: { it: 'Accesso consentito', en: 'Access granted' } },
      { stdin: '1', expected: { it: 'Accesso negato', en: 'Access denied' } },
      { stdin: '3', expected: { it: 'Accesso consentito', en: 'Access granted' }, hidden: true },
      { stdin: '2', expected: { it: 'Accesso negato', en: 'Access denied' }, hidden: true },
    ],
    it: {
      topic: 'Condizioni',
      title: 'La sala server',
      brief: [
        'La porta della sala server deve aprirsi solo per chi ha un livello di autorizzazione pari o superiore a 3.',
        'Con `if` esegui del codice solo se una condizione è vera; `else` gestisce il caso contrario. Il blocco va rientrato:',
        { code: 'x = 12\nif x > 10:\n    print("grande")\nelse:\n    print("piccolo")', output: 'grande' },
        'Leggi il livello (un intero). Se è almeno 3 stampa `Accesso consentito`, altrimenti `Accesso negato`.',
      ],
      hints: [
        { text: '«Almeno 3» vuol dire maggiore o uguale a 3: in Python si scrive `>=`.' },
        {
          text: 'Il codice dentro `if` ed `else` va rientrato di 4 spazi. Il ramo `if` è così:',
          code: 'livello = 5\nif livello >= 3:\n    print("Accesso consentito")',
          output: 'Accesso consentito',
        },
      ],
      starterCode: 'livello = int(input())\n',
      solution:
        'livello = int(input())\nif livello >= 3:\n    print("Accesso consentito")\nelse:\n    print("Accesso negato")',
    },
    en: {
      topic: 'Conditions',
      title: 'The server room',
      brief: [
        'The server room door must open only for people with a clearance level of 3 or higher.',
        'With `if` you run some code only when a condition is true; `else` handles the opposite case. The block must be indented:',
        { code: 'x = 12\nif x > 10:\n    print("big")\nelse:\n    print("small")', output: 'big' },
        'Read the level (a whole number). If it is at least 3 print `Access granted`, otherwise `Access denied`.',
      ],
      hints: [
        { text: '“At least 3” means greater than or equal to 3: in Python you write `>=`.' },
        {
          text: 'The code inside `if` and `else` is indented by 4 spaces. The `if` branch looks like this:',
          code: 'level = 5\nif level >= 3:\n    print("Access granted")',
          output: 'Access granted',
        },
      ],
      starterCode: 'level = int(input())\n',
      solution:
        'level = int(input())\nif level >= 3:\n    print("Access granted")\nelse:\n    print("Access denied")',
    },
  },
  {
    id: 'py-elif',
    module: 'conditions',
    reward: 125,
    tests: [
      { stdin: '2', expected: { it: 'Bassa', en: 'Low' } },
      { stdin: '9', expected: { it: 'Alta', en: 'High' } },
      { stdin: '3', expected: { it: 'Bassa', en: 'Low' }, hidden: true },
      { stdin: '4', expected: { it: 'Media', en: 'Medium' }, hidden: true },
      { stdin: '7', expected: { it: 'Media', en: 'Medium' }, hidden: true },
      { stdin: '8', expected: { it: 'Alta', en: 'High' }, hidden: true },
    ],
    it: {
      topic: 'Condizioni',
      title: 'Triage dei bug',
      brief: [
        'Arrivano bug con una gravità da 1 a 10 e vanno smistati. Quando i casi sono più di due, usa `elif`: Python controlla le condizioni in ordine e si ferma alla prima vera.',
        {
          code: 'x = 0\nif x < 0:\n    print("negativo")\nelif x == 0:\n    print("zero")\nelse:\n    print("positivo")',
          output: 'zero',
        },
        'Leggi la gravità e stampa `Bassa` (da 1 a 3), `Media` (da 4 a 7) o `Alta` (da 8 a 10).',
      ],
      hints: [
        { text: 'Le condizioni si controllano in ordine: se arrivi all’`elif`, sai già che la gravità è maggiore di 3.' },
        { text: 'Una struttura possibile: `if gravita <= 3:` … `elif gravita <= 7:` … `else:` …' },
      ],
      starterCode: 'gravita = int(input())\n',
      solution:
        'gravita = int(input())\nif gravita <= 3:\n    print("Bassa")\nelif gravita <= 7:\n    print("Media")\nelse:\n    print("Alta")',
    },
    en: {
      topic: 'Conditions',
      title: 'Bug triage',
      brief: [
        'Bugs come in with a severity from 1 to 10 and need sorting. When there are more than two cases, use `elif`: Python checks the conditions in order and stops at the first true one.',
        {
          code: 'x = 0\nif x < 0:\n    print("negative")\nelif x == 0:\n    print("zero")\nelse:\n    print("positive")',
          output: 'zero',
        },
        'Read the severity and print `Low` (1 to 3), `Medium` (4 to 7) or `High` (8 to 10).',
      ],
      hints: [
        { text: 'Conditions are checked in order: if you reach the `elif`, you already know the severity is greater than 3.' },
        { text: 'One possible structure: `if severity <= 3:` … `elif severity <= 7:` … `else:` …' },
      ],
      starterCode: 'severity = int(input())\n',
      solution:
        'severity = int(input())\nif severity <= 3:\n    print("Low")\nelif severity <= 7:\n    print("Medium")\nelse:\n    print("High")',
    },
  },
  bonus,
  {
    id: 'py-for',
    module: 'loops',
    reward: 125,
    tests: [
      { stdin: '3', expected: '1\n2\n3' },
      { stdin: '1', expected: '1', hidden: true },
      { stdin: '6', expected: '1\n2\n3\n4\n5\n6', hidden: true },
    ],
    it: {
      topic: 'Cicli for',
      title: 'Numerare i ticket',
      brief: [
        'Il sistema di ticketing deve generare i numeri progressivi. Un ciclo `for` ripete un blocco per ogni valore di una sequenza; `range(a, b)` produce i numeri da `a` a `b` escluso:',
        { code: 'for i in range(0, 3):\n    print(i)', output: '0\n1\n2' },
        'Leggi un intero N e stampa i numeri da 1 a N, uno per riga.',
      ],
      hints: [
        { text: 'Dentro il ciclo basta stampare la variabile del ciclo.' },
        { text: '`range(1, n)` si ferma a `n - 1`: per includere N ti serve `range(1, n + 1)`.' },
      ],
      starterCode: 'n = int(input())\n',
      solution: 'n = int(input())\nfor i in range(1, n + 1):\n    print(i)',
    },
    en: {
      topic: 'For loops',
      title: 'Numbering tickets',
      brief: [
        'The ticketing system needs to generate sequential numbers. A `for` loop repeats a block for every value in a sequence; `range(a, b)` produces the numbers from `a` up to `b`, excluded:',
        { code: 'for i in range(0, 3):\n    print(i)', output: '0\n1\n2' },
        'Read a whole number N and print the numbers from 1 to N, one per line.',
      ],
      hints: [
        { text: 'Inside the loop you just print the loop variable.' },
        { text: '`range(1, n)` stops at `n - 1`: to include N you need `range(1, n + 1)`.' },
      ],
      starterCode: 'n = int(input())\n',
      solution: 'n = int(input())\nfor i in range(1, n + 1):\n    print(i)',
    },
  },
  {
    id: 'py-timesheet',
    module: 'loops',
    reward: 150,
    tests: [
      { stdin: '3\n8\n7\n9', expected: '24' },
      { stdin: '1\n5', expected: '5', hidden: true },
      { stdin: '5\n8\n8\n8\n8\n4', expected: '36', hidden: true },
      { stdin: '0', expected: '0', hidden: true },
    ],
    it: {
      topic: 'Cicli e accumulatori',
      title: 'Il foglio ore',
      brief: [
        'Fine settimana: bisogna sommare le ore del foglio presenze. La prima riga contiene N, il numero di giorni; seguono N righe, ognuna con le ore di un giorno.',
        'Lo schema classico è l’accumulatore: una variabile che parte da 0 e viene aggiornata a ogni giro del ciclo.',
        { code: 'totale = 0\nfor _ in range(3):\n    totale = totale + 1\nprint(totale)', output: '3' },
        'Stampa il totale delle ore.',
      ],
      hints: [
        { text: 'Il ciclo deve girare N volte: `for _ in range(n):`. A ogni giro leggi una riga con `int(input())`.' },
        { text: 'Aggiungi ogni valore letto al totale e stampa il totale solo dopo il ciclo, cioè in una riga non rientrata.' },
      ],
      starterCode: 'n = int(input())\n',
      solution: 'n = int(input())\ntotale = 0\nfor _ in range(n):\n    totale += int(input())\nprint(totale)',
    },
    en: {
      topic: 'Loops and accumulators',
      title: 'The timesheet',
      brief: [
        'End of the week: the hours on the timesheet need adding up. The first line contains N, the number of days; then come N lines, each with the hours of one day.',
        'The classic pattern is the accumulator: a variable that starts at 0 and is updated on every pass of the loop.',
        { code: 'total = 0\nfor _ in range(3):\n    total = total + 1\nprint(total)', output: '3' },
        'Print the total number of hours.',
      ],
      hints: [
        { text: 'The loop has to run N times: `for _ in range(n):`. On each pass read a line with `int(input())`.' },
        { text: 'Add each value you read to the total, and print the total only after the loop, on a line that is not indented.' },
      ],
      starterCode: 'n = int(input())\n',
      solution: 'n = int(input())\ntotal = 0\nfor _ in range(n):\n    total += int(input())\nprint(total)',
    },
  },
  {
    id: 'py-while',
    module: 'loops',
    reward: 150,
    tests: [
      { stdin: '3', expected: '3\n2\n1\nDeploy!' },
      { stdin: '1', expected: '1\nDeploy!', hidden: true },
      { stdin: '0', expected: 'Deploy!', hidden: true },
      { stdin: '5', expected: '5\n4\n3\n2\n1\nDeploy!', hidden: true },
    ],
    it: {
      topic: 'Cicli while',
      title: 'Countdown al deploy',
      brief: [
        'Il rilascio in produzione ha un rituale: il conto alla rovescia. Il ciclo `while` ripete il suo blocco finché la condizione resta vera. Ricordati di cambiare la variabile, altrimenti il ciclo non finisce mai (e la sandbox lo interrompe dopo 3 secondi).',
        { code: 'x = 3\nwhile x > 0:\n    x = x - 1\nprint(x)', output: '0' },
        'Leggi N, stampa i numeri da N a 1 (uno per riga) e infine `Deploy!`.',
      ],
      hints: [
        { text: 'Dentro il ciclo stampa `n` e poi diminuiscilo di 1 con `n -= 1`.' },
        { text: '`Deploy!` va stampato una volta sola, dopo il ciclo: quella riga non deve essere rientrata.' },
      ],
      starterCode: 'n = int(input())\n',
      solution: 'n = int(input())\nwhile n > 0:\n    print(n)\n    n -= 1\nprint("Deploy!")',
    },
    en: {
      topic: 'While loops',
      title: 'Deploy countdown',
      brief: [
        'Releasing to production has a ritual: the countdown. A `while` loop repeats its block as long as the condition stays true. Remember to change the variable, or the loop never ends (and the sandbox stops it after 3 seconds).',
        { code: 'x = 3\nwhile x > 0:\n    x = x - 1\nprint(x)', output: '0' },
        'Read N, print the numbers from N down to 1 (one per line) and finally `Deploy!`.',
      ],
      hints: [
        { text: 'Inside the loop print `n` and then decrease it by 1 with `n -= 1`.' },
        { text: '`Deploy!` is printed only once, after the loop: that line must not be indented.' },
      ],
      starterCode: 'n = int(input())\n',
      solution: 'n = int(input())\nwhile n > 0:\n    print(n)\n    n -= 1\nprint("Deploy!")',
    },
  },
  {
    id: 'py-fizzbuzz',
    module: 'loops',
    reward: 200,
    tests: [
      { stdin: '5', expected: '1\n2\nFizz\n4\nBuzz' },
      { stdin: '1', expected: '1', hidden: true },
      {
        stdin: '15',
        expected: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz',
        hidden: true,
      },
    ],
    it: {
      topic: 'Cicli e condizioni',
      title: 'Il colloquio tecnico',
      brief: [
        'Il team lead ti prepara al colloquio tecnico con un classico che esce sempre: FizzBuzz.',
        'L’operatore `%` restituisce il resto della divisione: `x % 3 == 0` è vero quando `x` è divisibile per 3.',
        { code: 'print(10 % 3)\nprint(9 % 3 == 0)', output: '1\nTrue' },
        'Leggi N e stampa i numeri da 1 a N, uno per riga, ma: al posto dei multipli di 3 scrivi `Fizz`, al posto dei multipli di 5 `Buzz`, al posto dei multipli di entrambi `FizzBuzz`.',
      ],
      hints: [
        { text: 'Controlla per primo il caso «multiplo di entrambi», cioè di 15: se controlli prima il 3, per 15 stamperesti solo `Fizz`.' },
        { text: 'Struttura: un `for` da 1 a N e, dentro, una catena `if` / `elif` / `elif` / `else`.' },
      ],
      starterCode: 'n = int(input())\n',
      solution:
        'n = int(input())\nfor i in range(1, n + 1):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)',
    },
    en: {
      topic: 'Loops and conditions',
      title: 'The technical interview',
      brief: [
        'The team lead is preparing you for the technical interview with a classic that always comes up: FizzBuzz.',
        'The `%` operator returns the remainder of a division: `x % 3 == 0` is true when `x` is divisible by 3.',
        { code: 'print(10 % 3)\nprint(9 % 3 == 0)', output: '1\nTrue' },
        'Read N and print the numbers from 1 to N, one per line, but: instead of multiples of 3 write `Fizz`, instead of multiples of 5 `Buzz`, instead of multiples of both `FizzBuzz`.',
      ],
      hints: [
        { text: 'Check the “multiple of both” case first, that is multiples of 15: if you check 3 first, for 15 you would only print `Fizz`.' },
        { text: 'Structure: a `for` from 1 to N and, inside it, an `if` / `elif` / `elif` / `else` chain.' },
      ],
      starterCode: 'n = int(input())\n',
      solution:
        'n = int(input())\nfor i in range(1, n + 1):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)',
    },
  },
  tickets,
  {
    id: 'py-function',
    module: 'functions',
    reward: 200,
    tests: [
      { stdin: '3\n4', expected: '12' },
      { stdin: '10\n10', expected: '100', hidden: true },
      { stdin: '0\n5', expected: '0', hidden: true },
      { stdin: '7\n3', expected: '21', hidden: true },
    ],
    it: {
      topic: 'Funzioni',
      title: 'La tua prima funzione',
      brief: [
        'Il team sta calcolando lo spazio per le nuove scrivanie e ti chiede una funzione riutilizzabile. Una funzione si definisce con `def`, riceve parametri e restituisce un risultato con `return`:',
        { code: 'def doppio(x):\n    return x * 2\n\nprint(doppio(4))', output: '8' },
        'Completa `area_rettangolo(base, altezza)` in modo che restituisca l’area. La parte che legge l’input e stampa il risultato è già pronta.',
      ],
      hints: [
        { text: '`pass` non fa niente: sostituiscilo con un `return` seguito dal calcolo.' },
        { text: 'L’area è base per altezza: `return base * altezza`.' },
      ],
      starterCode:
        "def area_rettangolo(base, altezza):\n    # Restituisci l'area del rettangolo\n    pass\n\n\nb = int(input())\nh = int(input())\nprint(area_rettangolo(b, h))\n",
      solution:
        'def area_rettangolo(base, altezza):\n    return base * altezza\n\nb = int(input())\nh = int(input())\nprint(area_rettangolo(b, h))',
    },
    en: {
      topic: 'Functions',
      title: 'Your first function',
      brief: [
        'The team is working out the space for the new desks and asks you for a reusable function. A function is defined with `def`, takes parameters and gives back a result with `return`:',
        { code: 'def double(x):\n    return x * 2\n\nprint(double(4))', output: '8' },
        'Complete `rectangle_area(width, height)` so that it returns the area. The part that reads the input and prints the result is already there.',
      ],
      hints: [
        { text: '`pass` does nothing: replace it with a `return` followed by the calculation.' },
        { text: 'The area is width times height: `return width * height`.' },
      ],
      starterCode:
        'def rectangle_area(width, height):\n    # Return the area of the rectangle\n    pass\n\n\nw = int(input())\nh = int(input())\nprint(rectangle_area(w, h))\n',
      solution:
        'def rectangle_area(width, height):\n    return width * height\n\nw = int(input())\nh = int(input())\nprint(rectangle_area(w, h))',
    },
  },
  {
    id: 'py-average',
    module: 'functions',
    reward: 250,
    tests: [
      { stdin: '3\n6\n7\n8', expected: '7.00' },
      { stdin: '2\n9\n10', expected: '9.50', hidden: true },
      { stdin: '4\n1\n2\n3\n4', expected: '2.50', hidden: true },
      { stdin: '1\n5', expected: '5.00', hidden: true },
    ],
    it: {
      topic: 'Funzioni e liste',
      title: 'La media delle code review',
      brief: [
        'Ogni code review riceve un voto e il manager vuole la media. I voti arrivano in una lista: `sum(lista)` somma gli elementi, `len(lista)` li conta.',
        { code: 'numeri = [2, 4, 6]\nprint(sum(numeri), len(numeri))', output: '12 3' },
        'Completa `media(voti)` in modo che restituisca la media della lista. La lettura dei voti e la stampa con due decimali sono già pronte.',
      ],
      hints: [
        { text: 'La media è la somma degli elementi divisa per quanti sono.' },
        { text: 'Basta una riga: `return sum(voti) / len(voti)`.' },
      ],
      starterCode:
        'def media(voti):\n    # Restituisci la media dei numeri nella lista voti\n    pass\n\n\nn = int(input())\nvoti = []\nfor _ in range(n):\n    voti.append(int(input()))\n\nprint(f"{media(voti):.2f}")\n',
      solution:
        'def media(voti):\n    return sum(voti) / len(voti)\n\nn = int(input())\nvoti = []\nfor _ in range(n):\n    voti.append(int(input()))\n\nprint(f"{media(voti):.2f}")',
    },
    en: {
      topic: 'Functions and lists',
      title: 'Average code review score',
      brief: [
        'Every code review gets a score and the manager wants the average. The scores arrive in a list: `sum(list)` adds up the items, `len(list)` counts them.',
        { code: 'numbers = [2, 4, 6]\nprint(sum(numbers), len(numbers))', output: '12 3' },
        'Complete `average(scores)` so that it returns the average of the list. Reading the scores and printing with two decimals are already there.',
      ],
      hints: [
        { text: 'The average is the sum of the items divided by how many there are.' },
        { text: 'One line is enough: `return sum(scores) / len(scores)`.' },
      ],
      starterCode:
        'def average(scores):\n    # Return the average of the numbers in the scores list\n    pass\n\n\nn = int(input())\nscores = []\nfor _ in range(n):\n    scores.append(int(input()))\n\nprint(f"{average(scores):.2f}")\n',
      solution:
        'def average(scores):\n    return sum(scores) / len(scores)\n\nn = int(input())\nscores = []\nfor _ in range(n):\n    scores.append(int(input()))\n\nprint(f"{average(scores):.2f}")',
    },
  },
  warehouse,
];
