// Progetti finali del percorso Python: uno per modulo, ultimo esercizio del modulo.
// Sono programmi più lunghi, con consegna a passi. Completarli chiude il modulo e
// quindi porta alla promozione. Stessa struttura degli esercizi (vedi python.js).

export const receipt = {
  id: 'py-project-receipt',
  kind: 'project',
  module: 'basics',
  reward: 300,
  tests: [
    {
      stdin: 'Ada\n4\n3',
      expected: {
        it: 'Cliente: Ada\nTotale: 3 x 4 euro = 12 euro\nGrazie e buon appetito!',
        en: 'Customer: Ada\nTotal: 3 x 4 euros = 12 euros\nThanks and enjoy your meal!',
      },
    },
    {
      stdin: 'Linus\n7\n1',
      expected: {
        it: 'Cliente: Linus\nTotale: 1 x 7 euro = 7 euro\nGrazie e buon appetito!',
        en: 'Customer: Linus\nTotal: 1 x 7 euros = 7 euros\nThanks and enjoy your meal!',
      },
      hidden: true,
    },
    {
      stdin: 'Grace Hopper\n5\n0',
      expected: {
        it: 'Cliente: Grace Hopper\nTotale: 0 x 5 euro = 0 euro\nGrazie e buon appetito!',
        en: 'Customer: Grace Hopper\nTotal: 0 x 5 euros = 0 euros\nThanks and enjoy your meal!',
      },
      hidden: true,
    },
    {
      stdin: 'Bob\n12\n10',
      expected: {
        it: 'Cliente: Bob\nTotale: 10 x 12 euro = 120 euro\nGrazie e buon appetito!',
        en: 'Customer: Bob\nTotal: 10 x 12 euros = 120 euros\nThanks and enjoy your meal!',
      },
      hidden: true,
    },
  ],
  it: {
    topic: 'Progetto finale · Le basi',
    title: 'Lo scontrino della mensa',
    brief: [
      'Ultima prova dello stage: la mensa aziendale ti chiede il programma che stampa gli scontrini.',
      'Il programma riceve tre righe di input: il nome del cliente, il prezzo di un piatto in euro (intero) e quante porzioni ha preso (intero). Deve stampare esattamente queste tre righe:',
      { pre: 'Cliente: <nome>\nTotale: <porzioni> x <prezzo> euro = <totale> euro\nGrazie e buon appetito!' },
      'Esempio: con input `Ada`, `4` e `3` il programma stampa:',
      { pre: 'Cliente: Ada\nTotale: 3 x 4 euro = 12 euro\nGrazie e buon appetito!' },
      {
        list: [
          'Passo 1: leggi i tre valori, convertendo prezzo e porzioni in numeri.',
          'Passo 2: calcola il totale.',
          'Passo 3: stampa le tre righe; per le prime due ti servono le f-string.',
        ],
      },
    ],
    hints: [
      { text: 'Ti servono tre variabili. Il nome resta testo, mentre prezzo e porzioni vanno convertiti con `int()`.' },
      { text: 'La seconda riga è la più lunga: `print(f"Totale: {porzioni} x {prezzo} euro = {totale} euro")`.' },
    ],
    starterCode: '# 1. Leggi nome, prezzo e porzioni\n\n# 2. Calcola il totale\n\n# 3. Stampa lo scontrino\n',
    solution:
      'nome = input()\nprezzo = int(input())\nporzioni = int(input())\ntotale = prezzo * porzioni\nprint(f"Cliente: {nome}")\nprint(f"Totale: {porzioni} x {prezzo} euro = {totale} euro")\nprint("Grazie e buon appetito!")',
  },
  en: {
    topic: 'Final project · The basics',
    title: 'The canteen receipt',
    brief: [
      'Last test of your internship: the company canteen needs the program that prints its receipts.',
      'The program receives three lines of input: the customer’s name, the price of a dish in euros (a whole number) and how many portions they took (a whole number). It must print exactly these three lines:',
      { pre: 'Customer: <name>\nTotal: <portions> x <price> euros = <total> euros\nThanks and enjoy your meal!' },
      'Example: with input `Ada`, `4` and `3` the program prints:',
      { pre: 'Customer: Ada\nTotal: 3 x 4 euros = 12 euros\nThanks and enjoy your meal!' },
      {
        list: [
          'Step 1: read the three values, converting price and portions to numbers.',
          'Step 2: compute the total.',
          'Step 3: print the three lines; for the first two you need f-strings.',
        ],
      },
    ],
    hints: [
      { text: 'You need three variables. The name stays text, while price and portions must be converted with `int()`.' },
      { text: 'The second line is the longest: `print(f"Total: {portions} x {price} euros = {total} euros")`.' },
    ],
    starterCode: '# 1. Read name, price and portions\n\n# 2. Compute the total\n\n# 3. Print the receipt\n',
    solution:
      'name = input()\nprice = int(input())\nportions = int(input())\ntotal = price * portions\nprint(f"Customer: {name}")\nprint(f"Total: {portions} x {price} euros = {total} euros")\nprint("Thanks and enjoy your meal!")',
  },
};

// Valutazione per voto; bonus in base a voto e anni di servizio.
const rating = (it, en) => ({ it: `Valutazione: ${it}`, en: `Rating: ${en}` });
const bonusLine = (amount) =>
  amount ? { it: `Bonus: ${amount} euro`, en: `Bonus: ${amount} euros` } : { it: 'Nessun bonus', en: 'No bonus' };
const bonusCase = (years, score, ratingText, amount, hidden) => ({
  stdin: `${years}\n${score}`,
  expected: {
    it: `${ratingText.it}\n${bonusLine(amount).it}`,
    en: `${ratingText.en}\n${bonusLine(amount).en}`,
  },
  ...(hidden ? { hidden: true } : {}),
});
const EXCELLENT = rating('eccellente', 'excellent');
const GOOD = rating('buona', 'good');
const FAIR = rating('sufficiente', 'fair');
const POOR = rating('da migliorare', 'needs improvement');

export const bonus = {
  id: 'py-project-bonus',
  kind: 'project',
  module: 'conditions',
  reward: 400,
  tests: [
    bonusCase(5, 5, EXCELLENT, 1000),
    bonusCase(1, 4, GOOD, 500),
    bonusCase(10, 3, FAIR, 200, true),
    bonusCase(2, 2, POOR, 0, true),
    bonusCase(3, 4, GOOD, 1000, true),
    bonusCase(0, 1, POOR, 0, true),
    bonusCase(2, 5, EXCELLENT, 500, true),
  ],
  it: {
    topic: 'Progetto finale · Condizioni',
    title: 'Il calcolatore dei bonus',
    brief: [
      'Fine anno: l’ufficio HR ti affida il programma che calcola i bonus dei dipendenti.',
      'Riceverai due interi, uno per riga: gli anni di servizio e il voto della valutazione annuale (da 1 a 5). Il programma stampa due righe.',
      'Prima riga, la valutazione, in base al voto:',
      {
        list: [
          'voto 5: `Valutazione: eccellente`',
          'voto 4: `Valutazione: buona`',
          'voto 3: `Valutazione: sufficiente`',
          'voto 1 o 2: `Valutazione: da migliorare`',
        ],
      },
      'Seconda riga, il bonus:',
      {
        list: [
          'voto 4 o 5 e almeno 3 anni di servizio: 1000 euro',
          'voto 4 o 5 con meno di 3 anni: 500 euro',
          'voto 3: 200 euro',
          'altrimenti nessun bonus',
        ],
      },
      'Se c’è un bonus stampa `Bonus: <importo> euro` (esempio: `Bonus: 500 euro`), altrimenti `Nessun bonus`.',
    ],
    hints: [
      { text: 'Separa i due problemi: prima una catena `if`/`elif`/`else` per la valutazione, poi un’altra per il bonus.' },
      { text: 'Per il bonus più alto servono due condizioni insieme: `if voto >= 4 and anni >= 3:`. Salva l’importo in una variabile e decidi alla fine cosa stampare.' },
    ],
    starterCode: 'anni = int(input())\nvoto = int(input())\n\n# 1. Stampa la valutazione\n\n# 2. Calcola il bonus\n\n# 3. Stampa il bonus\n',
    solution:
      'anni = int(input())\nvoto = int(input())\nif voto == 5:\n    print("Valutazione: eccellente")\nelif voto == 4:\n    print("Valutazione: buona")\nelif voto == 3:\n    print("Valutazione: sufficiente")\nelse:\n    print("Valutazione: da migliorare")\nif voto >= 4 and anni >= 3:\n    bonus = 1000\nelif voto >= 4:\n    bonus = 500\nelif voto == 3:\n    bonus = 200\nelse:\n    bonus = 0\nif bonus > 0:\n    print(f"Bonus: {bonus} euro")\nelse:\n    print("Nessun bonus")',
  },
  en: {
    topic: 'Final project · Conditions',
    title: 'The bonus calculator',
    brief: [
      'End of the year: HR hands you the program that calculates employee bonuses.',
      'You’ll receive two whole numbers, one per line: years of service and the annual review score (from 1 to 5). The program prints two lines.',
      'First line, the rating, based on the score:',
      {
        list: [
          'score 5: `Rating: excellent`',
          'score 4: `Rating: good`',
          'score 3: `Rating: fair`',
          'score 1 or 2: `Rating: needs improvement`',
        ],
      },
      'Second line, the bonus:',
      {
        list: [
          'score 4 or 5 and at least 3 years of service: 1000 euros',
          'score 4 or 5 with fewer than 3 years: 500 euros',
          'score 3: 200 euros',
          'otherwise no bonus',
        ],
      },
      'If there is a bonus print `Bonus: <amount> euros` (for example `Bonus: 500 euros`), otherwise `No bonus`.',
    ],
    hints: [
      { text: 'Split the two problems: first an `if`/`elif`/`else` chain for the rating, then another one for the bonus.' },
      { text: 'The highest bonus needs two conditions together: `if score >= 4 and years >= 3:`. Store the amount in a variable and decide at the end what to print.' },
    ],
    starterCode: 'years = int(input())\nscore = int(input())\n\n# 1. Print the rating\n\n# 2. Compute the bonus\n\n# 3. Print the bonus\n',
    solution:
      'years = int(input())\nscore = int(input())\nif score == 5:\n    print("Rating: excellent")\nelif score == 4:\n    print("Rating: good")\nelif score == 3:\n    print("Rating: fair")\nelse:\n    print("Rating: needs improvement")\nif score >= 4 and years >= 3:\n    bonus = 1000\nelif score >= 4:\n    bonus = 500\nelif score == 3:\n    bonus = 200\nelse:\n    bonus = 0\nif bonus > 0:\n    print(f"Bonus: {bonus} euros")\nelse:\n    print("No bonus")',
  },
};

// Report dei ticket: conteggi per priorità (1 alta, 2 media, 3 bassa) fino allo 0.
function ticketCase(stdin, hidden) {
  const values = stdin.split('\n').map(Number);
  const list = values.slice(0, values.indexOf(0));
  const count = (p) => list.filter((v) => v === p).length;
  const [high, medium, low] = [count(1), count(2), count(3)];
  const urgent = high > 0;
  return {
    stdin,
    expected: {
      it: `Alta: ${high}\nMedia: ${medium}\nBassa: ${low}\nTotale: ${list.length}\n${urgent ? 'Attenzione: ci sono ticket urgenti!' : 'Tutto sotto controllo.'}`,
      en: `High: ${high}\nMedium: ${medium}\nLow: ${low}\nTotal: ${list.length}\n${urgent ? 'Warning: there are urgent tickets!' : 'Everything under control.'}`,
    },
    ...(hidden ? { hidden: true } : {}),
  };
}

export const tickets = {
  id: 'py-project-tickets',
  kind: 'project',
  module: 'loops',
  reward: 500,
  tests: [
    ticketCase('1\n3\n3\n2\n1\n0'),
    ticketCase('3\n2\n0'),
    ticketCase('0', true),
    ticketCase('1\n0', true),
    ticketCase('2\n2\n2\n2\n3\n0', true),
    ticketCase('3\n1\n2\n1\n3\n3\n1\n0', true),
  ],
  it: {
    topic: 'Progetto finale · Cicli',
    title: 'Colloquio tecnico: il report dei ticket',
    brief: [
      'È il giorno del colloquio per il contratto a tempo indeterminato. La prova: un programma che riassume i ticket di supporto della settimana.',
      'L’input contiene una priorità per riga: `1` (alta), `2` (media) o `3` (bassa). La sequenza finisce con uno `0`, che non è un ticket. Non sai in anticipo quanti ticket arrivano.',
      'Il programma stampa:',
      { pre: 'Alta: <quanti ticket 1>\nMedia: <quanti ticket 2>\nBassa: <quanti ticket 3>\nTotale: <tutti i ticket>' },
      'e infine `Attenzione: ci sono ticket urgenti!` se c’è almeno un ticket ad alta priorità, altrimenti `Tutto sotto controllo.`',
      {
        list: [
          'Passo 1: prepara un contatore per ogni priorità.',
          'Passo 2: leggi le priorità con un ciclo `while` finché non arriva lo 0, aggiornando il contatore giusto.',
          'Passo 3: stampa il report e il messaggio finale.',
        ],
      },
    ],
    hints: [
      { text: 'Leggi la prima priorità prima del ciclo e la successiva alla fine di ogni giro, così la condizione `while priorita != 0:` funziona anche con input vuoto.' },
      { text: 'Il totale è la somma dei tre contatori. Il messaggio finale dipende solo dal contatore dei ticket ad alta priorità.' },
    ],
    starterCode: '# Un contatore per ogni priorità\nalta = 0\nmedia = 0\nbassa = 0\n\n# Leggi le priorità finché non arriva 0\n\n# Stampa il report\n',
    solution:
      'alta = 0\nmedia = 0\nbassa = 0\npriorita = int(input())\nwhile priorita != 0:\n    if priorita == 1:\n        alta += 1\n    elif priorita == 2:\n        media += 1\n    else:\n        bassa += 1\n    priorita = int(input())\nprint(f"Alta: {alta}")\nprint(f"Media: {media}")\nprint(f"Bassa: {bassa}")\nprint(f"Totale: {alta + media + bassa}")\nif alta > 0:\n    print("Attenzione: ci sono ticket urgenti!")\nelse:\n    print("Tutto sotto controllo.")',
  },
  en: {
    topic: 'Final project · Loops',
    title: 'Technical interview: the ticket report',
    brief: [
      'It’s interview day for the permanent contract. The test: a program that summarises the week’s support tickets.',
      'The input contains one priority per line: `1` (high), `2` (medium) or `3` (low). The sequence ends with a `0`, which is not a ticket. You don’t know in advance how many tickets will arrive.',
      'The program prints:',
      { pre: 'High: <how many 1 tickets>\nMedium: <how many 2 tickets>\nLow: <how many 3 tickets>\nTotal: <all tickets>' },
      'and finally `Warning: there are urgent tickets!` if there is at least one high-priority ticket, otherwise `Everything under control.`',
      {
        list: [
          'Step 1: set up a counter for each priority.',
          'Step 2: read the priorities with a `while` loop until the 0 arrives, updating the right counter.',
          'Step 3: print the report and the final message.',
        ],
      },
    ],
    hints: [
      { text: 'Read the first priority before the loop and the next one at the end of each pass, so the condition `while priority != 0:` works even with empty input.' },
      { text: 'The total is the sum of the three counters. The final message depends only on the high-priority counter.' },
    ],
    starterCode: '# One counter per priority\nhigh = 0\nmedium = 0\nlow = 0\n\n# Read priorities until 0 arrives\n\n# Print the report\n',
    solution:
      'high = 0\nmedium = 0\nlow = 0\npriority = int(input())\nwhile priority != 0:\n    if priority == 1:\n        high += 1\n    elif priority == 2:\n        medium += 1\n    else:\n        low += 1\n    priority = int(input())\nprint(f"High: {high}")\nprint(f"Medium: {medium}")\nprint(f"Low: {low}")\nprint(f"Total: {high + medium + low}")\nif high > 0:\n    print("Warning: there are urgent tickets!")\nelse:\n    print("Everything under control.")',
  },
};

// Magazzino: N quantità e una soglia; totale, massimo e quanti articoli sono sotto soglia.
function warehouseCase(quantities, threshold, hidden) {
  const total = quantities.reduce((a, b) => a + b, 0);
  const largest = Math.max(...quantities);
  const below = quantities.filter((q) => q < threshold).length;
  return {
    stdin: [quantities.length, ...quantities, threshold].join('\n'),
    expected: {
      it: `Pezzi totali: ${total}\nScorta massima: ${largest}\nArticoli sotto scorta: ${below}`,
      en: `Total pieces: ${total}\nLargest stock: ${largest}\nItems below threshold: ${below}`,
    },
    ...(hidden ? { hidden: true } : {}),
  };
}

export const warehouse = {
  id: 'py-project-warehouse',
  kind: 'project',
  module: 'functions',
  reward: 600,
  tests: [
    warehouseCase([10, 2, 7, 1], 5),
    warehouseCase([5, 5, 5], 5, true),
    warehouseCase([0], 1, true),
    warehouseCase([12, 3, 8, 3, 20], 4, true),
    warehouseCase([9, 1, 4, 6], 10, true),
  ],
  it: {
    topic: 'Progetto finale · Funzioni',
    title: 'Il magazzino',
    brief: [
      'Per diventare Mid Developer il CTO vuole vedere codice ben organizzato: ti chiede un piccolo gestionale del magazzino, diviso in funzioni.',
      'La lettura dell’input e le stampe sono già pronte. L’input è: il numero N di articoli, poi N righe con le quantità in magazzino, infine la soglia minima di scorta. Tu devi completare tre funzioni:',
      {
        list: [
          '`totale(quantita)`: restituisce la somma di tutte le quantità.',
          '`massimo(quantita)`: restituisce la quantità più grande.',
          '`sotto_scorta(quantita, soglia)`: restituisce quanti articoli hanno una quantità minore della soglia.',
        ],
      },
      'Il programma stampa:',
      { pre: 'Pezzi totali: <totale>\nScorta massima: <massimo>\nArticoli sotto scorta: <quanti>' },
      'Esempio: quantità `10`, `2`, `7`, `1` e soglia `5` danno `Pezzi totali: 20`, `Scorta massima: 10` e `Articoli sotto scorta: 2`.',
    ],
    hints: [
      { text: 'Una funzione alla volta: completa `totale` e prova con Esegui prima di passare alle altre. `sum()` e `max()` ti possono aiutare.' },
      { text: 'Per `sotto_scorta` usa un contatore: scorri la lista con `for` e aggiungi 1 per ogni quantità minore della soglia. Ricorda di restituirlo con `return`.' },
    ],
    starterCode:
      'def totale(quantita):\n    # Restituisci la somma delle quantità\n    pass\n\n\ndef massimo(quantita):\n    # Restituisci la quantità più grande\n    pass\n\n\ndef sotto_scorta(quantita, soglia):\n    # Restituisci quanti articoli sono sotto la soglia\n    pass\n\n\nn = int(input())\nquantita = []\nfor _ in range(n):\n    quantita.append(int(input()))\nsoglia = int(input())\n\nprint(f"Pezzi totali: {totale(quantita)}")\nprint(f"Scorta massima: {massimo(quantita)}")\nprint(f"Articoli sotto scorta: {sotto_scorta(quantita, soglia)}")\n',
    solution:
      'def totale(quantita):\n    return sum(quantita)\n\n\ndef massimo(quantita):\n    return max(quantita)\n\n\ndef sotto_scorta(quantita, soglia):\n    conta = 0\n    for q in quantita:\n        if q < soglia:\n            conta += 1\n    return conta\n\n\nn = int(input())\nquantita = []\nfor _ in range(n):\n    quantita.append(int(input()))\nsoglia = int(input())\n\nprint(f"Pezzi totali: {totale(quantita)}")\nprint(f"Scorta massima: {massimo(quantita)}")\nprint(f"Articoli sotto scorta: {sotto_scorta(quantita, soglia)}")',
  },
  en: {
    topic: 'Final project · Functions',
    title: 'The warehouse',
    brief: [
      'To become a Mid Developer the CTO wants to see well-organised code: you’re asked for a small warehouse manager, split into functions.',
      'Reading the input and printing are already done. The input is: the number N of items, then N lines with the stock quantities, and finally the minimum stock threshold. You have to complete three functions:',
      {
        list: [
          '`total(quantities)`: returns the sum of all quantities.',
          '`largest(quantities)`: returns the largest quantity.',
          '`below_threshold(quantities, threshold)`: returns how many items have a quantity lower than the threshold.',
        ],
      },
      'The program prints:',
      { pre: 'Total pieces: <total>\nLargest stock: <largest>\nItems below threshold: <how many>' },
      'Example: quantities `10`, `2`, `7`, `1` and threshold `5` give `Total pieces: 20`, `Largest stock: 10` and `Items below threshold: 2`.',
    ],
    hints: [
      { text: 'One function at a time: complete `total` and try it with Run before moving on. `sum()` and `max()` can help you.' },
      { text: 'For `below_threshold` use a counter: go through the list with `for` and add 1 for every quantity lower than the threshold. Remember to give it back with `return`.' },
    ],
    starterCode:
      'def total(quantities):\n    # Return the sum of the quantities\n    pass\n\n\ndef largest(quantities):\n    # Return the largest quantity\n    pass\n\n\ndef below_threshold(quantities, threshold):\n    # Return how many items are below the threshold\n    pass\n\n\nn = int(input())\nquantities = []\nfor _ in range(n):\n    quantities.append(int(input()))\nthreshold = int(input())\n\nprint(f"Total pieces: {total(quantities)}")\nprint(f"Largest stock: {largest(quantities)}")\nprint(f"Items below threshold: {below_threshold(quantities, threshold)}")\n',
    solution:
      'def total(quantities):\n    return sum(quantities)\n\n\ndef largest(quantities):\n    return max(quantities)\n\n\ndef below_threshold(quantities, threshold):\n    count = 0\n    for q in quantities:\n        if q < threshold:\n            count += 1\n    return count\n\n\nn = int(input())\nquantities = []\nfor _ in range(n):\n    quantities.append(int(input()))\nthreshold = int(input())\n\nprint(f"Total pieces: {total(quantities)}")\nprint(f"Largest stock: {largest(quantities)}")\nprint(f"Items below threshold: {below_threshold(quantities, threshold)}")',
  },
};
