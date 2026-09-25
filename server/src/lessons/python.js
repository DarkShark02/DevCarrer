// Lezioni del percorso Python: una per argomento, seguita dai suoi esercizi.
//
// Struttura di una lezione:
//   exercises: id degli esercizi che mettono in pratica la lezione (nello stesso modulo)
//   it/en:
//     title
//     slides: [{ title, blocks }]. Blocchi come nelle consegne: paragrafi (`codice` inline),
//             esempi eseguibili { code, stdin?, output }, { pre }, elenchi { list: [...] }
//     quiz:   [{ type, question, code?, options, answer, explanation }]
//             type 'output': «cosa stampa?». check-exercises esegue `code` e verifica che
//             options[answer] sia proprio l'output (e che nessun'altra opzione lo sia).
//             type 'choice': domanda di teoria; se c'è `code` deve almeno girare senza errori.
//
// Il quiz è facoltativo: non blocca niente.

export default [
  {
    id: 'py-l-output',
    module: 'basics',
    exercises: ['py-hello', 'py-multiline'],
    it: {
      title: 'Stampare a schermo',
      slides: [
        {
          title: 'Il tuo primo programma',
          blocks: [
            'Un programma è una lista di istruzioni che il computer esegue una dopo l’altra, dall’alto verso il basso.',
            'In Python l’istruzione più semplice è `print()`: scrive a schermo quello che metti tra le parentesi.',
            { code: 'print("Buongiorno!")', output: 'Buongiorno!' },
            'Premi «▶ Prova» per eseguirlo davvero.',
          ],
        },
        {
          title: 'Le stringhe',
          blocks: [
            'Il testo tra virgolette si chiama stringa. Puoi usare virgolette doppie o singole, purché apertura e chiusura siano uguali.',
            { code: 'print("Ciao")\nprint(\'Ciao\')', output: 'Ciao\nCiao' },
            'Senza virgolette Python pensa che la parola sia il nome di qualcosa e, se non la trova, si ferma con un errore.',
          ],
        },
        {
          title: 'Più righe',
          blocks: [
            'Ogni `print()` va a capo da solo, e le istruzioni vengono eseguite nell’ordine in cui le scrivi:',
            { code: 'print("Uno")\nprint("Due")\nprint("Tre")', output: 'Uno\nDue\nTre' },
          ],
        },
        {
          title: 'Stampare numeri',
          blocks: [
            '`print()` stampa anche i numeri, che si scrivono senza virgolette. E può fare calcoli:',
            { code: 'print(42)\nprint(2 + 3)\nprint("2 + 3")', output: '42\n5\n2 + 3' },
            'Nota la differenza: tra virgolette è testo e viene stampato così com’è; senza virgolette è un calcolo.',
          ],
        },
        {
          title: 'I commenti',
          blocks: [
            'Tutto quello che segue `#` su una riga è un commento: Python lo ignora. Serve a chi legge il codice.',
            { code: '# Questa riga non viene eseguita\nprint("Questa sì")', output: 'Questa sì' },
          ],
        },
      ],
      quiz: [
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'print("5 + 5")',
          options: ['10', '5 + 5', '55'],
          answer: 1,
          explanation: 'Tra virgolette è testo: viene stampato così com’è, senza fare il calcolo.',
        },
        {
          type: 'output',
          question: 'E questo?',
          code: 'print(5 + 5)',
          options: ['10', '5 + 5', '55'],
          answer: 0,
          explanation: 'Senza virgolette `5 + 5` è un calcolo, e `print()` stampa il risultato.',
        },
        {
          type: 'choice',
          question: 'Quante righe stampa questo codice?',
          code: 'print("A")\nprint("B")\n# print("C")',
          options: ['1', '2', '3'],
          answer: 1,
          explanation: 'La terza riga inizia con `#`: è un commento e non viene eseguita.',
        },
      ],
    },
    en: {
      title: 'Printing to the screen',
      slides: [
        {
          title: 'Your first program',
          blocks: [
            'A program is a list of instructions that the computer runs one after another, from top to bottom.',
            'In Python the simplest instruction is `print()`: it writes to the screen whatever you put between its parentheses.',
            { code: 'print("Good morning!")', output: 'Good morning!' },
            'Press “▶ Try” to really run it.',
          ],
        },
        {
          title: 'Strings',
          blocks: [
            'Text between quotes is called a string. You can use double or single quotes, as long as the opening and closing ones match.',
            { code: 'print("Hello")\nprint(\'Hello\')', output: 'Hello\nHello' },
            'Without quotes Python thinks the word is the name of something and, if it can’t find it, stops with an error.',
          ],
        },
        {
          title: 'Several lines',
          blocks: [
            'Every `print()` ends its own line, and instructions run in the order you write them:',
            { code: 'print("One")\nprint("Two")\nprint("Three")', output: 'One\nTwo\nThree' },
          ],
        },
        {
          title: 'Printing numbers',
          blocks: [
            '`print()` also prints numbers, which are written without quotes. And it can do maths:',
            { code: 'print(42)\nprint(2 + 3)\nprint("2 + 3")', output: '42\n5\n2 + 3' },
            'Note the difference: between quotes it’s text and is printed as it is; without quotes it’s a calculation.',
          ],
        },
        {
          title: 'Comments',
          blocks: [
            'Everything after `#` on a line is a comment: Python ignores it. It’s there for whoever reads the code.',
            { code: '# This line does not run\nprint("This one does")', output: 'This one does' },
          ],
        },
      ],
      quiz: [
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'print("5 + 5")',
          options: ['10', '5 + 5', '55'],
          answer: 1,
          explanation: 'Between quotes it’s text: it is printed as it is, without doing the calculation.',
        },
        {
          type: 'output',
          question: 'And this one?',
          code: 'print(5 + 5)',
          options: ['10', '5 + 5', '55'],
          answer: 0,
          explanation: 'Without quotes `5 + 5` is a calculation, and `print()` prints the result.',
        },
        {
          type: 'choice',
          question: 'How many lines does this code print?',
          code: 'print("A")\nprint("B")\n# print("C")',
          options: ['1', '2', '3'],
          answer: 1,
          explanation: 'The third line starts with `#`: it’s a comment and does not run.',
        },
      ],
    },
  },
  {
    id: 'py-l-variables',
    module: 'basics',
    exercises: ['py-input'],
    it: {
      title: 'Variabili e input',
      slides: [
        {
          title: 'Le variabili',
          blocks: [
            'Una variabile è un nome che contiene un valore. Si crea con `=`: a sinistra il nome, a destra il valore.',
            { code: 'nome = "Ada"\nprint(nome)', output: 'Ada' },
            'Attenzione: in Python `=` non vuol dire «uguale», vuol dire «metti questo valore in questa variabile».',
          ],
        },
        {
          title: 'Cambiare valore',
          blocks: [
            'Una variabile può cambiare valore: conta sempre l’ultimo assegnato.',
            { code: 'stato = "in corso"\nstato = "completato"\nprint(stato)', output: 'completato' },
          ],
        },
        {
          title: 'I nomi delle variabili',
          blocks: [
            {
              list: [
                'Possono contenere lettere, numeri e `_`, ma non iniziare con un numero.',
                'Maiuscole e minuscole contano: `nome` e `Nome` sono due variabili diverse.',
                'Meglio nomi che spiegano cosa contengono: `prezzo` è meglio di `p`.',
              ],
            },
          ],
        },
        {
          title: 'Leggere l’input',
          blocks: [
            '`input()` legge una riga scritta dall’utente. Il risultato va salvato in una variabile per usarlo dopo.',
            { code: 'citta = input()\nprint("Vivi a", citta)', stdin: 'Torino', output: 'Vivi a Torino' },
            'Negli esercizi il testo da leggere si scrive nel riquadro «Input» dell’Editor. Qui l’esempio usa `Torino`.',
          ],
        },
        {
          title: 'print con più valori',
          blocks: [
            '`print()` accetta più valori separati da virgole e li stampa separati da uno spazio:',
            { code: 'nome = "Ada"\ncognome = "Lovelace"\nprint(nome, cognome)\nprint("Ciao,", nome)', output: 'Ada Lovelace\nCiao, Ada' },
          ],
        },
      ],
      quiz: [
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'x = "rosso"\nx = "blu"\nprint(x)',
          options: ['rosso', 'blu', 'rosso blu'],
          answer: 1,
          explanation: 'Il secondo assegnamento sostituisce il primo: conta l’ultimo valore.',
        },
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'a = "Buon"\nb = "giorno"\nprint(a, b)',
          options: ['Buongiorno', 'Buon giorno', 'a b'],
          answer: 1,
          explanation: 'Con la virgola `print()` separa i valori con uno spazio.',
        },
        {
          type: 'choice',
          question: 'Quale di questi è un nome di variabile valido?',
          options: ['2prezzo', 'prezzo_finale', 'prezzo finale'],
          answer: 1,
          explanation: 'Non si può iniziare con un numero né usare spazi: al loro posto si usa `_`.',
        },
      ],
    },
    en: {
      title: 'Variables and input',
      slides: [
        {
          title: 'Variables',
          blocks: [
            'A variable is a name that holds a value. You create it with `=`: the name on the left, the value on the right.',
            { code: 'name = "Ada"\nprint(name)', output: 'Ada' },
            'Careful: in Python `=` doesn’t mean “equals”, it means “put this value in this variable”.',
          ],
        },
        {
          title: 'Changing a value',
          blocks: [
            'A variable can change value: only the last one assigned counts.',
            { code: 'status = "in progress"\nstatus = "done"\nprint(status)', output: 'done' },
          ],
        },
        {
          title: 'Variable names',
          blocks: [
            {
              list: [
                'They can contain letters, digits and `_`, but can’t start with a digit.',
                'Upper and lower case matter: `name` and `Name` are two different variables.',
                'Prefer names that explain what they hold: `price` is better than `p`.',
              ],
            },
          ],
        },
        {
          title: 'Reading input',
          blocks: [
            '`input()` reads one line typed by the user. Store the result in a variable to use it later.',
            { code: 'city = input()\nprint("You live in", city)', stdin: 'Turin', output: 'You live in Turin' },
            'In the exercises the text to read goes in the Editor’s Input box. Here the example uses `Turin`.',
          ],
        },
        {
          title: 'print with several values',
          blocks: [
            '`print()` accepts several values separated by commas and prints them separated by a space:',
            { code: 'name = "Ada"\nsurname = "Lovelace"\nprint(name, surname)\nprint("Hi,", name)', output: 'Ada Lovelace\nHi, Ada' },
          ],
        },
      ],
      quiz: [
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'x = "red"\nx = "blue"\nprint(x)',
          options: ['red', 'blue', 'red blue'],
          answer: 1,
          explanation: 'The second assignment replaces the first: the last value counts.',
        },
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'a = "Good"\nb = "morning"\nprint(a, b)',
          options: ['Goodmorning', 'Good morning', 'a b'],
          answer: 1,
          explanation: 'With a comma `print()` separates the values with a space.',
        },
        {
          type: 'choice',
          question: 'Which of these is a valid variable name?',
          options: ['2price', 'final_price', 'final price'],
          answer: 1,
          explanation: 'You can’t start with a digit or use spaces: use `_` instead.',
        },
      ],
    },
  },
  {
    id: 'py-l-numbers',
    module: 'basics',
    exercises: ['py-sum', 'py-pay'],
    it: {
      title: 'Numeri e operatori',
      slides: [
        {
          title: 'Gli operatori',
          blocks: [
            'Python fa i calcoli con gli operatori `+`, `-`, `*` (per) e `/` (diviso):',
            { code: 'print(7 + 3)\nprint(7 - 3)\nprint(7 * 3)\nprint(7 / 2)', output: '10\n4\n21\n3.5' },
          ],
        },
        {
          title: 'Interi e decimali',
          blocks: [
            'I numeri senza virgola sono interi (`int`), quelli con la virgola sono decimali (`float`). In Python la virgola decimale si scrive con il punto: `3.5`.',
            '`//` fa la divisione intera, `%` dà il resto:',
            { code: 'print(17 // 5)\nprint(17 % 5)', output: '3\n2' },
          ],
        },
        {
          title: 'Testo o numero?',
          blocks: [
            '`input()` restituisce sempre testo, anche se scrivi un numero. Sommare due testi li attacca uno all’altro:',
            { code: 'a = input()\nb = input()\nprint(a + b)', stdin: '3\n4', output: '34' },
            'Per fare calcoli converti il testo in numero con `int()`:',
            { code: 'a = int(input())\nprint(a * 2)', stdin: '21', output: '42' },
          ],
        },
        {
          title: 'Aggiornare una variabile',
          blocks: [
            '`x = x + 1` prende il valore di `x`, aggiunge 1 e lo rimette in `x`. La forma breve è `x += 1`.',
            { code: 'punti = 10\npunti = punti + 5\npunti += 5\nprint(punti)', output: '20' },
          ],
        },
        {
          title: 'Le f-string',
          blocks: [
            'Per mettere dei valori dentro un testo usa una f-string: una `f` prima delle virgolette e le espressioni tra graffe.',
            { code: 'nome = "Ada"\nanni = 36\nprint(f"{nome} ha {anni} anni")\nprint(f"Tra un anno: {anni + 1}")', output: 'Ada ha 36 anni\nTra un anno: 37' },
          ],
        },
      ],
      quiz: [
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'print(10 / 4)',
          options: ['2', '2.5', '2.4'],
          answer: 1,
          explanation: '`/` fa la divisione con i decimali. Per la divisione intera serve `//`.',
        },
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'print(10 % 4)',
          options: ['2', '2.5', '0'],
          answer: 0,
          explanation: '10 diviso 4 fa 2 con resto 2, e `%` restituisce il resto.',
        },
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'x = "5"\nprint(x * 2)',
          options: ['10', '55', '5 5'],
          answer: 1,
          explanation: '`x` è testo (è tra virgolette): moltiplicare un testo per 2 lo ripete due volte.',
        },
      ],
    },
    en: {
      title: 'Numbers and operators',
      slides: [
        {
          title: 'Operators',
          blocks: [
            'Python does maths with the operators `+`, `-`, `*` (times) and `/` (divided by):',
            { code: 'print(7 + 3)\nprint(7 - 3)\nprint(7 * 3)\nprint(7 / 2)', output: '10\n4\n21\n3.5' },
          ],
        },
        {
          title: 'Integers and decimals',
          blocks: [
            'Numbers without a decimal point are integers (`int`), those with one are decimals (`float`): `3.5`.',
            '`//` does integer division, `%` gives the remainder:',
            { code: 'print(17 // 5)\nprint(17 % 5)', output: '3\n2' },
          ],
        },
        {
          title: 'Text or number?',
          blocks: [
            '`input()` always returns text, even if you type a number. Adding two texts glues them together:',
            { code: 'a = input()\nb = input()\nprint(a + b)', stdin: '3\n4', output: '34' },
            'To do maths, convert the text to a number with `int()`:',
            { code: 'a = int(input())\nprint(a * 2)', stdin: '21', output: '42' },
          ],
        },
        {
          title: 'Updating a variable',
          blocks: [
            '`x = x + 1` takes the value of `x`, adds 1 and puts it back in `x`. The short form is `x += 1`.',
            { code: 'points = 10\npoints = points + 5\npoints += 5\nprint(points)', output: '20' },
          ],
        },
        {
          title: 'f-strings',
          blocks: [
            'To put values inside a text use an f-string: an `f` before the quotes and the expressions between curly braces.',
            { code: 'name = "Ada"\nage = 36\nprint(f"{name} is {age} years old")\nprint(f"In a year: {age + 1}")', output: 'Ada is 36 years old\nIn a year: 37' },
          ],
        },
      ],
      quiz: [
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'print(10 / 4)',
          options: ['2', '2.5', '2.4'],
          answer: 1,
          explanation: '`/` divides with decimals. For integer division you need `//`.',
        },
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'print(10 % 4)',
          options: ['2', '2.5', '0'],
          answer: 0,
          explanation: '10 divided by 4 is 2 with a remainder of 2, and `%` returns the remainder.',
        },
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'x = "5"\nprint(x * 2)',
          options: ['10', '55', '5 5'],
          answer: 1,
          explanation: '`x` is text (it’s between quotes): multiplying a text by 2 repeats it twice.',
        },
      ],
    },
  },
  {
    id: 'py-l-conditions',
    module: 'conditions',
    exercises: ['py-if', 'py-elif'],
    it: {
      title: 'Condizioni: if, elif, else',
      slides: [
        {
          title: 'Decidere',
          blocks: [
            'Con `if` il programma esegue un blocco solo se una condizione è vera. La riga dell’`if` finisce con `:` e il blocco va rientrato di 4 spazi.',
            { code: 'temperatura = 30\nif temperatura > 25:\n    print("Fa caldo")\nprint("Fine")', output: 'Fa caldo\nFine' },
            '`print("Fine")` non è rientrato: fa parte del programma principale e viene eseguito comunque.',
          ],
        },
        {
          title: 'Gli operatori di confronto',
          blocks: [
            {
              list: [
                '`==` uguale (due segni: uno solo assegna!)',
                '`!=` diverso',
                '`<` e `>` minore e maggiore',
                '`<=` e `>=` minore o uguale, maggiore o uguale',
              ],
            },
            'Un confronto vale `True` (vero) o `False` (falso):',
            { code: 'print(3 == 3)\nprint(3 != 3)\nprint(5 >= 7)', output: 'True\nFalse\nFalse' },
          ],
        },
        {
          title: 'else',
          blocks: [
            '`else` gestisce il caso in cui la condizione è falsa:',
            { code: 'eta = 16\nif eta >= 18:\n    print("Maggiorenne")\nelse:\n    print("Minorenne")', output: 'Minorenne' },
          ],
        },
        {
          title: 'elif',
          blocks: [
            'Con più di due casi si usa `elif` («altrimenti se»). Python controlla le condizioni in ordine e si ferma alla prima vera:',
            {
              code: 'voto = 7\nif voto >= 9:\n    print("Ottimo")\nelif voto >= 6:\n    print("Sufficiente")\nelse:\n    print("Insufficiente")',
              output: 'Sufficiente',
            },
          ],
        },
        {
          title: 'and, or, not',
          blocks: [
            'Puoi combinare più condizioni: `and` (vere entrambe), `or` (vera almeno una), `not` (il contrario).',
            { code: 'ora = 10\nweekend = False\nif ora >= 9 and not weekend:\n    print("In ufficio")', output: 'In ufficio' },
          ],
        },
      ],
      quiz: [
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'x = 5\nif x > 3:\n    print("A")\nelse:\n    print("B")',
          options: ['A', 'B', 'A B'],
          answer: 0,
          explanation: '5 è maggiore di 3: viene eseguito solo il blocco dell’`if`.',
        },
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'x = 10\nif x > 5:\n    print("grande")\nelif x > 8:\n    print("enorme")',
          options: ['grande', 'enorme', 'grande enorme'],
          answer: 0,
          explanation: 'Anche `x > 8` è vero, ma Python si ferma alla prima condizione vera.',
        },
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'print(4 > 2 and 1 > 3)',
          options: ['True', 'False', '4 > 2'],
          answer: 1,
          explanation: 'Con `and` devono essere vere entrambe, ma `1 > 3` è falso.',
        },
      ],
    },
    en: {
      title: 'Conditions: if, elif, else',
      slides: [
        {
          title: 'Making decisions',
          blocks: [
            'With `if` the program runs a block only when a condition is true. The `if` line ends with `:` and the block is indented by 4 spaces.',
            { code: 'temperature = 30\nif temperature > 25:\n    print("It’s hot")\nprint("The end")', output: 'It’s hot\nThe end' },
            '`print("The end")` isn’t indented: it belongs to the main program and runs anyway.',
          ],
        },
        {
          title: 'Comparison operators',
          blocks: [
            {
              list: [
                '`==` equal (two signs: a single one assigns!)',
                '`!=` not equal',
                '`<` and `>` less than and greater than',
                '`<=` and `>=` less or equal, greater or equal',
              ],
            },
            'A comparison is either `True` or `False`:',
            { code: 'print(3 == 3)\nprint(3 != 3)\nprint(5 >= 7)', output: 'True\nFalse\nFalse' },
          ],
        },
        {
          title: 'else',
          blocks: [
            '`else` handles the case where the condition is false:',
            { code: 'age = 16\nif age >= 18:\n    print("Adult")\nelse:\n    print("Minor")', output: 'Minor' },
          ],
        },
        {
          title: 'elif',
          blocks: [
            'With more than two cases use `elif` (“else if”). Python checks the conditions in order and stops at the first true one:',
            {
              code: 'grade = 7\nif grade >= 9:\n    print("Excellent")\nelif grade >= 6:\n    print("Pass")\nelse:\n    print("Fail")',
              output: 'Pass',
            },
          ],
        },
        {
          title: 'and, or, not',
          blocks: [
            'You can combine conditions: `and` (both true), `or` (at least one true), `not` (the opposite).',
            { code: 'hour = 10\nweekend = False\nif hour >= 9 and not weekend:\n    print("At the office")', output: 'At the office' },
          ],
        },
      ],
      quiz: [
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'x = 5\nif x > 3:\n    print("A")\nelse:\n    print("B")',
          options: ['A', 'B', 'A B'],
          answer: 0,
          explanation: '5 is greater than 3: only the `if` block runs.',
        },
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'x = 10\nif x > 5:\n    print("big")\nelif x > 8:\n    print("huge")',
          options: ['big', 'huge', 'big huge'],
          answer: 0,
          explanation: '`x > 8` is true as well, but Python stops at the first true condition.',
        },
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'print(4 > 2 and 1 > 3)',
          options: ['True', 'False', '4 > 2'],
          answer: 1,
          explanation: 'With `and` both must be true, but `1 > 3` is false.',
        },
      ],
    },
  },
  {
    id: 'py-l-for',
    module: 'loops',
    exercises: ['py-for', 'py-timesheet'],
    it: {
      title: 'Il ciclo for',
      slides: [
        {
          title: 'Ripetere',
          blocks: [
            'Un ciclo ripete un blocco di codice. Il ciclo `for` lo ripete per ogni valore di una sequenza:',
            { code: 'for i in range(3):\n    print("Ciao")', output: 'Ciao\nCiao\nCiao' },
          ],
        },
        {
          title: 'range',
          blocks: [
            '`range(n)` produce i numeri da 0 a n-1. `range(a, b)` va da `a` a `b` escluso, e un terzo numero indica il passo:',
            { code: 'for i in range(2, 5):\n    print(i)\nfor i in range(0, 10, 3):\n    print(i)', output: '2\n3\n4\n0\n3\n6\n9' },
          ],
        },
        {
          title: 'La variabile del ciclo',
          blocks: [
            'A ogni giro la variabile del ciclo (qui `i`) prende il valore successivo, e puoi usarla nel blocco:',
            { code: 'for i in range(1, 4):\n    print(f"Giro numero {i}")', output: 'Giro numero 1\nGiro numero 2\nGiro numero 3' },
          ],
        },
        {
          title: 'Gli accumulatori',
          blocks: [
            'Per sommare valori durante un ciclo si usa un accumulatore: una variabile che parte da 0 e cresce a ogni giro.',
            { code: 'somma = 0\nfor i in range(1, 5):\n    somma += i\nprint(somma)', output: '10' },
            'Attenzione al rientro: il `print` fuori dal ciclo viene eseguito una volta sola, alla fine.',
          ],
        },
        {
          title: 'Leggere N valori',
          blocks: [
            'Uno schema molto comune: la prima riga dice quanti valori seguono, poi li leggi uno per giro. `_` è il nome di solito usato per una variabile del ciclo che non ti serve, e `.upper()` trasforma un testo in maiuscolo.',
            { code: 'n = int(input())\nfor _ in range(n):\n    parola = input()\n    print(parola.upper())', stdin: '2\nciao\nmondo', output: 'CIAO\nMONDO' },
          ],
        },
      ],
      quiz: [
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'for i in range(3):\n    print(i)',
          options: ['0\n1\n2', '1\n2\n3', '0\n1\n2\n3'],
          answer: 0,
          explanation: '`range(3)` parte da 0 e si ferma prima di 3.',
        },
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'totale = 0\nfor i in range(4):\n    totale += 2\nprint(totale)',
          options: ['6', '8', '2'],
          answer: 1,
          explanation: 'Il ciclo gira 4 volte e ogni volta aggiunge 2.',
        },
        {
          type: 'choice',
          question: 'Quante volte viene eseguito il blocco di `for i in range(2, 7)`?',
          options: ['5', '6', '7'],
          answer: 0,
          explanation: 'I valori sono 2, 3, 4, 5, 6: il 7 è escluso.',
        },
      ],
    },
    en: {
      title: 'The for loop',
      slides: [
        {
          title: 'Repeating',
          blocks: [
            'A loop repeats a block of code. The `for` loop repeats it for every value in a sequence:',
            { code: 'for i in range(3):\n    print("Hello")', output: 'Hello\nHello\nHello' },
          ],
        },
        {
          title: 'range',
          blocks: [
            '`range(n)` produces the numbers from 0 to n-1. `range(a, b)` goes from `a` up to `b` excluded, and a third number sets the step:',
            { code: 'for i in range(2, 5):\n    print(i)\nfor i in range(0, 10, 3):\n    print(i)', output: '2\n3\n4\n0\n3\n6\n9' },
          ],
        },
        {
          title: 'The loop variable',
          blocks: [
            'On every pass the loop variable (here `i`) takes the next value, and you can use it in the block:',
            { code: 'for i in range(1, 4):\n    print(f"Pass number {i}")', output: 'Pass number 1\nPass number 2\nPass number 3' },
          ],
        },
        {
          title: 'Accumulators',
          blocks: [
            'To add up values during a loop you use an accumulator: a variable that starts at 0 and grows on every pass.',
            { code: 'total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)', output: '10' },
            'Mind the indentation: the `print` outside the loop runs only once, at the end.',
          ],
        },
        {
          title: 'Reading N values',
          blocks: [
            'A very common pattern: the first line says how many values follow, then you read one per pass. `_` is the usual name for a loop variable you don’t need, and `.upper()` turns a text into upper case.',
            { code: 'n = int(input())\nfor _ in range(n):\n    word = input()\n    print(word.upper())', stdin: '2\nhello\nworld', output: 'HELLO\nWORLD' },
          ],
        },
      ],
      quiz: [
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'for i in range(3):\n    print(i)',
          options: ['0\n1\n2', '1\n2\n3', '0\n1\n2\n3'],
          answer: 0,
          explanation: '`range(3)` starts at 0 and stops before 3.',
        },
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'total = 0\nfor i in range(4):\n    total += 2\nprint(total)',
          options: ['6', '8', '2'],
          answer: 1,
          explanation: 'The loop runs 4 times and adds 2 each time.',
        },
        {
          type: 'choice',
          question: 'How many times does the block of `for i in range(2, 7)` run?',
          options: ['5', '6', '7'],
          answer: 0,
          explanation: 'The values are 2, 3, 4, 5, 6: 7 is excluded.',
        },
      ],
    },
  },
  {
    id: 'py-l-while',
    module: 'loops',
    exercises: ['py-while', 'py-fizzbuzz'],
    it: {
      title: 'Il ciclo while',
      slides: [
        {
          title: 'Finché è vero',
          blocks: [
            '`while` ripete il blocco finché la condizione resta vera. Si usa quando non sai in anticipo quante volte ripetere.',
            { code: 'n = 1\nwhile n < 50:\n    n = n * 2\nprint(n)', output: '64' },
          ],
        },
        {
          title: 'Il ciclo infinito',
          blocks: [
            'Se la condizione non diventa mai falsa, il ciclo non finisce: nel blocco devi cambiare qualcosa che prima o poi la renda falsa. La sandbox ferma comunque i programmi dopo 3 secondi.',
            { code: 'x = 0\nwhile x < 6:\n    x += 2\n    print(x)', output: '2\n4\n6' },
          ],
        },
        {
          title: 'break',
          blocks: [
            '`break` esce subito dal ciclo. `while True` con un `break` dentro è il modo classico di leggere finché non arriva un valore speciale:',
            {
              code: 'while True:\n    parola = input()\n    if parola == "stop":\n        break\n    print("Letto:", parola)',
              stdin: 'uno\ndue\nstop\ntre',
              output: 'Letto: uno\nLetto: due',
            },
          ],
        },
        {
          title: 'Il resto: %',
          blocks: [
            '`%` dà il resto della divisione, ed è perfetto per capire se un numero è divisibile per un altro: `x % 3 == 0` è vero se `x` è multiplo di 3.',
            {
              code: 'for n in range(1, 5):\n    if n % 2 == 0:\n        print(n, "pari")\n    else:\n        print(n, "dispari")',
              output: '1 dispari\n2 pari\n3 dispari\n4 pari',
            },
          ],
        },
      ],
      quiz: [
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'x = 10\nwhile x > 3:\n    x -= 3\nprint(x)',
          options: ['1', '4', '-2'],
          answer: 0,
          explanation: 'x passa da 10 a 7, poi 4, poi 1: a quel punto `x > 3` è falso e il ciclo finisce.',
        },
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'print(14 % 5)',
          options: ['4', '2', '2.8'],
          answer: 0,
          explanation: '14 diviso 5 fa 2 con resto 4.',
        },
        {
          type: 'choice',
          question: 'Cosa succede se nel blocco del `while` non cambi mai la variabile della condizione?',
          options: ['Il ciclo viene saltato', 'Il ciclo non finisce mai', 'Python dà subito errore'],
          answer: 1,
          explanation: 'La condizione resta sempre vera, quindi il ciclo si ripete all’infinito.',
        },
      ],
    },
    en: {
      title: 'The while loop',
      slides: [
        {
          title: 'As long as it’s true',
          blocks: [
            '`while` repeats its block as long as the condition stays true. Use it when you don’t know in advance how many times to repeat.',
            { code: 'n = 1\nwhile n < 50:\n    n = n * 2\nprint(n)', output: '64' },
          ],
        },
        {
          title: 'The infinite loop',
          blocks: [
            'If the condition never becomes false, the loop never ends: inside the block you must change something that eventually makes it false. The sandbox stops programs after 3 seconds anyway.',
            { code: 'x = 0\nwhile x < 6:\n    x += 2\n    print(x)', output: '2\n4\n6' },
          ],
        },
        {
          title: 'break',
          blocks: [
            '`break` leaves the loop immediately. `while True` with a `break` inside is the classic way to read until a special value arrives:',
            {
              code: 'while True:\n    word = input()\n    if word == "stop":\n        break\n    print("Read:", word)',
              stdin: 'one\ntwo\nstop\nthree',
              output: 'Read: one\nRead: two',
            },
          ],
        },
        {
          title: 'The remainder: %',
          blocks: [
            '`%` gives the remainder of a division, and it’s perfect to check whether a number is divisible by another: `x % 3 == 0` is true when `x` is a multiple of 3.',
            {
              code: 'for n in range(1, 5):\n    if n % 2 == 0:\n        print(n, "even")\n    else:\n        print(n, "odd")',
              output: '1 odd\n2 even\n3 odd\n4 even',
            },
          ],
        },
      ],
      quiz: [
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'x = 10\nwhile x > 3:\n    x -= 3\nprint(x)',
          options: ['1', '4', '-2'],
          answer: 0,
          explanation: 'x goes from 10 to 7, then 4, then 1: at that point `x > 3` is false and the loop ends.',
        },
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'print(14 % 5)',
          options: ['4', '2', '2.8'],
          answer: 0,
          explanation: '14 divided by 5 is 2 with a remainder of 4.',
        },
        {
          type: 'choice',
          question: 'What happens if the `while` block never changes the variable in the condition?',
          options: ['The loop is skipped', 'The loop never ends', 'Python raises an error right away'],
          answer: 1,
          explanation: 'The condition stays true forever, so the loop repeats endlessly.',
        },
      ],
    },
  },
  {
    id: 'py-l-functions',
    module: 'functions',
    exercises: ['py-function'],
    it: {
      title: 'Le funzioni',
      slides: [
        {
          title: 'Perché le funzioni',
          blocks: [
            'Una funzione è un pezzo di codice con un nome, che puoi riusare quante volte vuoi. `print()`, `input()` e `int()` sono funzioni già pronte.',
            'Le tue funzioni si definiscono con `def`, e si eseguono chiamandole per nome:',
            { code: 'def saluta():\n    print("Ciao dal team!")\n\nsaluta()\nsaluta()', output: 'Ciao dal team!\nCiao dal team!' },
          ],
        },
        {
          title: 'I parametri',
          blocks: [
            'Tra le parentesi della definizione metti i parametri: i valori che la funzione riceve quando la chiami.',
            { code: 'def saluta(nome):\n    print(f"Ciao {nome}!")\n\nsaluta("Ada")\nsaluta("Linus")', output: 'Ciao Ada!\nCiao Linus!' },
          ],
        },
        {
          title: 'return',
          blocks: [
            '`return` restituisce un risultato a chi ha chiamato la funzione, e la termina. Il risultato si può salvare in una variabile o usare subito.',
            { code: 'def quadrato(x):\n    return x * x\n\nrisultato = quadrato(4)\nprint(risultato)\nprint(quadrato(3) + 1)', output: '16\n10' },
          ],
        },
        {
          title: 'print o return?',
          blocks: [
            '`print` scrive a schermo, `return` restituisce un valore. Una funzione senza `return` restituisce `None`, cioè «niente»:',
            { code: 'def doppio_sbagliato(x):\n    print(x * 2)\n\nvalore = doppio_sbagliato(5)\nprint(valore)', output: '10\nNone' },
            'Se una funzione deve calcolare qualcosa, usa `return`: sarà chi la chiama a decidere se stamparlo.',
          ],
        },
      ],
      quiz: [
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'def f(x):\n    return x + 1\n\nprint(f(f(1)))',
          options: ['2', '3', 'f(f(1))'],
          answer: 1,
          explanation: '`f(1)` vale 2, e `f(2)` vale 3.',
        },
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'def g():\n    return 5\n    print("fine")\n\nprint(g())',
          options: ['5', 'fine', 'None'],
          answer: 0,
          explanation: 'Dopo `return` la funzione termina: la riga con `print("fine")` non viene mai eseguita.',
        },
        {
          type: 'choice',
          question: 'Con quale parola chiave si definisce una funzione in Python?',
          options: ['function', 'def', 'return'],
          answer: 1,
          explanation: '`def` definisce la funzione; `return` serve dentro, per restituire il risultato.',
        },
      ],
    },
    en: {
      title: 'Functions',
      slides: [
        {
          title: 'Why functions',
          blocks: [
            'A function is a piece of code with a name, which you can reuse as many times as you like. `print()`, `input()` and `int()` are ready-made functions.',
            'You define your own functions with `def`, and run them by calling their name:',
            { code: 'def greet():\n    print("Hello from the team!")\n\ngreet()\ngreet()', output: 'Hello from the team!\nHello from the team!' },
          ],
        },
        {
          title: 'Parameters',
          blocks: [
            'Between the parentheses of the definition you put the parameters: the values the function receives when you call it.',
            { code: 'def greet(name):\n    print(f"Hi {name}!")\n\ngreet("Ada")\ngreet("Linus")', output: 'Hi Ada!\nHi Linus!' },
          ],
        },
        {
          title: 'return',
          blocks: [
            '`return` gives a result back to whoever called the function, and ends it. You can store the result in a variable or use it right away.',
            { code: 'def square(x):\n    return x * x\n\nresult = square(4)\nprint(result)\nprint(square(3) + 1)', output: '16\n10' },
          ],
        },
        {
          title: 'print or return?',
          blocks: [
            '`print` writes to the screen, `return` gives back a value. A function without `return` returns `None`, meaning “nothing”:',
            { code: 'def wrong_double(x):\n    print(x * 2)\n\nvalue = wrong_double(5)\nprint(value)', output: '10\nNone' },
            'If a function has to compute something, use `return`: the caller decides whether to print it.',
          ],
        },
      ],
      quiz: [
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'def f(x):\n    return x + 1\n\nprint(f(f(1)))',
          options: ['2', '3', 'f(f(1))'],
          answer: 1,
          explanation: '`f(1)` is 2, and `f(2)` is 3.',
        },
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'def g():\n    return 5\n    print("end")\n\nprint(g())',
          options: ['5', 'end', 'None'],
          answer: 0,
          explanation: 'After `return` the function ends: the `print("end")` line never runs.',
        },
        {
          type: 'choice',
          question: 'Which keyword defines a function in Python?',
          options: ['function', 'def', 'return'],
          answer: 1,
          explanation: '`def` defines the function; `return` is used inside it to give back the result.',
        },
      ],
    },
  },
  {
    id: 'py-l-lists',
    module: 'functions',
    exercises: ['py-average'],
    it: {
      title: 'Le liste',
      slides: [
        {
          title: 'Tanti valori in una variabile',
          blocks: [
            'Una lista contiene più valori, in ordine, tra parentesi quadre e separati da virgole. `len()` dice quanti sono:',
            { code: 'linguaggi = ["Python", "Java", "Go"]\nprint(linguaggi)\nprint(len(linguaggi))', output: "['Python', 'Java', 'Go']\n3" },
          ],
        },
        {
          title: 'Gli indici',
          blocks: [
            'Ogni elemento ha una posizione, l’indice, che parte da 0. Gli indici negativi contano dalla fine: `[-1]` è l’ultimo.',
            { code: 'linguaggi = ["Python", "Java", "Go"]\nprint(linguaggi[0])\nprint(linguaggi[-1])', output: 'Python\nGo' },
          ],
        },
        {
          title: 'Aggiungere e scorrere',
          blocks: [
            '`append()` aggiunge un elemento in fondo. Con `for` scorri tutti gli elementi, uno per giro:',
            { code: 'voti = []\nvoti.append(7)\nvoti.append(9)\nfor v in voti:\n    print("Voto:", v)', output: 'Voto: 7\nVoto: 9' },
          ],
        },
        {
          title: 'Funzioni utili',
          blocks: [
            '`sum()` somma gli elementi, `max()` e `min()` trovano il più grande e il più piccolo:',
            { code: 'numeri = [4, 8, 15, 16, 23, 42]\nprint(sum(numeri))\nprint(max(numeri), min(numeri))', output: '108\n42 4' },
          ],
        },
      ],
      quiz: [
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'x = [10, 20, 30]\nprint(x[1])',
          options: ['10', '20', '30'],
          answer: 1,
          explanation: 'Gli indici partono da 0: `x[1]` è il secondo elemento.',
        },
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'x = [3, 1, 2]\nx.append(5)\nprint(len(x))',
          options: ['3', '4', '5'],
          answer: 1,
          explanation: 'Dopo `append` la lista ha 4 elementi.',
        },
        {
          type: 'output',
          question: 'Cosa stampa questo codice?',
          code: 'x = [2, 4, 6]\nprint(x[-1])',
          options: ['2', '6', '-1'],
          answer: 1,
          explanation: '`[-1]` è l’ultimo elemento della lista.',
        },
      ],
    },
    en: {
      title: 'Lists',
      slides: [
        {
          title: 'Many values in one variable',
          blocks: [
            'A list holds several values, in order, between square brackets and separated by commas. `len()` tells you how many there are:',
            { code: 'languages = ["Python", "Java", "Go"]\nprint(languages)\nprint(len(languages))', output: "['Python', 'Java', 'Go']\n3" },
          ],
        },
        {
          title: 'Indexes',
          blocks: [
            'Each item has a position, its index, starting from 0. Negative indexes count from the end: `[-1]` is the last one.',
            { code: 'languages = ["Python", "Java", "Go"]\nprint(languages[0])\nprint(languages[-1])', output: 'Python\nGo' },
          ],
        },
        {
          title: 'Adding and looping',
          blocks: [
            '`append()` adds an item at the end. With `for` you go through all the items, one per pass:',
            { code: 'scores = []\nscores.append(7)\nscores.append(9)\nfor s in scores:\n    print("Score:", s)', output: 'Score: 7\nScore: 9' },
          ],
        },
        {
          title: 'Handy functions',
          blocks: [
            '`sum()` adds up the items, `max()` and `min()` find the largest and the smallest:',
            { code: 'numbers = [4, 8, 15, 16, 23, 42]\nprint(sum(numbers))\nprint(max(numbers), min(numbers))', output: '108\n42 4' },
          ],
        },
      ],
      quiz: [
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'x = [10, 20, 30]\nprint(x[1])',
          options: ['10', '20', '30'],
          answer: 1,
          explanation: 'Indexes start at 0: `x[1]` is the second item.',
        },
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'x = [3, 1, 2]\nx.append(5)\nprint(len(x))',
          options: ['3', '4', '5'],
          answer: 1,
          explanation: 'After `append` the list has 4 items.',
        },
        {
          type: 'output',
          question: 'What does this code print?',
          code: 'x = [2, 4, 6]\nprint(x[-1])',
          options: ['2', '6', '-1'],
          answer: 1,
          explanation: '`[-1]` is the last item of the list.',
        },
      ],
    },
  },
];
