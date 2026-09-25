# DevCareer

Impari a programmare facendo carriera: da stagista in su, un esercizio alla volta.

## Requisiti
- Node.js 20+
- Docker Desktop (per la sandbox Piston: l'API pubblica è solo su whitelist)

## Avvio
```bash
npm install
npm run piston:up        # avvia il container Piston (porta 2000)
npm run piston:install   # installa i runtime dichiarati in server/src/languages.js (solo la prima volta)
npm run dev              # server su :3001 e client su http://localhost:5173
```

## Come si gioca
Si parte nell'ufficio 3D: ci si muove con WASD o le frecce, oppure cliccando sul pavimento. La propria scrivania è quella con la freccia verde: ci si siede con E (o cliccandola). Da seduti si vede la scrivania con il PC; aprendo un'app sul desktop (Corsi, Editor, Negozio, Posta, Profilo) la camera si avvicina al monitor. Esc chiude l'app, un secondo Esc fa alzare. Se il browser non supporta WebGL, il desktop occupa tutta la pagina.

Il percorso è fatto così: ogni argomento ha una **lezione** nell'app Corsi (slide con esempi da eseguire con «Prova» e un mini-quiz facoltativo), seguita dai suoi esercizi nell'Editor. Ogni modulo si chiude con un **progetto finale**, un programma più lungo con consegna a passi: completarlo chiude il modulo e porta la promozione.

Il **Negozio** vende oggetti per la scrivania, ognuno con un posto fisso. Tre hanno un effetto, attivo solo quando sono sulla scrivania: monitor grande (schermo più grande da seduti), papera di gomma (differenze riga per riga nei test falliti), macchina espresso (+10% sulle ricompense).

## Struttura
- `server/src/languages.js`: registro dei linguaggi. Per aggiungerne uno basta una voce qui e poi `piston:install`.
- `server/src/piston.js`: client Piston con i limiti di tempo e memoria; normalizza la risposta.
- `server/src/lessons/`: le lezioni, un file per percorso (`python.js`): slide, esempi eseguibili, quiz ed esercizi collegati.
- `server/src/exercises/`: un file per percorso (`python.js`), più i progetti finali (`python-projects.js`, `kind: 'project'`). Ogni esercizio ha modulo, ricompensa, test (`stdin` → output atteso, eventualmente `hidden`) e, per ogni lingua dell'interfaccia (`it`, `en`), consegna, suggerimenti, codice iniziale e soluzione di riferimento. L'output atteso è una stringa se non dipende dalla lingua, altrimenti `{ it, en }`.
- `server/src/grader.js`: esegue il codice su ogni test e confronta l'output (ignora spazi a fine riga e righe vuote finali).
- `server/src/career.js`: moduli didattici e gradi di carriera (ruolo + contratto). Si sale completando moduli interi: Le basi → Junior a tempo determinato; Condizioni + Cicli → Junior a tempo indeterminato; Funzioni → Mid. Il saldo è solo valuta, non conta per le promozioni.
- `server/src/shop.js`: catalogo del negozio ed effetti degli oggetti. `server/src/mail.js`: posta aziendale, ricavata dal grado raggiunto (benvenuto + una mail per promozione).
- `server/src/locales.js`, `messages.js`: lingue dell'interfaccia e messaggi d'errore dell'API. Il client manda la lingua nell'header `X-Locale`.
- `server/src/db.js`, `player.js`: SQLite (modulo `node:sqlite` integrato), file in `server/data/`. Un solo giocatore locale.
- `client/src/office/`: ufficio 3D in Three.js (caricato a parte). `OfficeScene.js` gestisce stanza, luci, movimento, collisioni e le inquadrature da seduti (lo schermo resta parallelo alla camera, così il desktop HTML ci si sovrappone esattamente); `deskItems.js` gli oggetti del negozio e i loro posti; `models.js` costruisce arredi e personaggi con le primitive di Three.js; `textures.js` disegna su canvas pavimento, panorama, lavagna e schermi. Nessun file esterno da scaricare.
- `client/src/desktop/`: il desktop del PC (`Desktop.jsx`) e le sue app: `EditorApp`, `ShopApp`, `MailApp`, `ProfileApp`.
- `client/`: React + Vite + Monaco Editor. Il proxy di Vite inoltra `/api` al server. I testi dell'interfaccia sono in `client/src/i18n/strings.js`; la lingua scelta all'avvio resta nel localStorage del browser.

## Aggiungere o modificare esercizi
Dopo ogni modifica lancia `npm run check-exercises -w server`. Per ogni lingua verifica che:
- la soluzione di riferimento superi tutti i test e il codice iniziale no;
- ogni esempio di codice nella consegna e nei suggerimenti stampi davvero l'`output` dichiarato;
- ogni riga di output attesa che contiene testo compaia nella consegna (numeri e valori letti dall'input possono essere scritti come `<segnaposto>`);
- le stringhe tra virgolette nei suggerimenti e nel codice iniziale facciano parte dell'output atteso;
- nessun testo contenga l'output atteso di un'altra lingua;
- ogni esempio nelle slide stampi quello che dichiara; nelle domande «cosa stampa?» la risposta giusta sia proprio l'output del codice e nessuna sbagliata lo sia;
- ogni esercizio stia in una sola lezione del suo modulo, e ogni modulo abbia un solo progetto finale, come ultimo esercizio;
- i testi di client, server e carriera abbiano le stesse chiavi in tutte le lingue.

Per ricominciare da zero, cancella `server/data/devcareer.db`.

## API
| Metodo | Percorso | Descrizione |
|---|---|---|
| GET | `/api/health` | stato di Piston e dei runtime |
| POST | `/api/run` | esecuzione libera `{ language, code, stdin }` |
| GET | `/api/player` | saldo, grado, progressi |
| GET | `/api/exercises` | elenco con stato completato/sbloccato |
| GET | `/api/exercises/:id` | dettaglio (senza test nascosti né soluzione) |
| POST | `/api/exercises/:id/submit` | verifica `{ code }`, assegna ricompensa e promozioni |
| GET | `/api/shop` | catalogo con oggetti posseduti e posati sulla scrivania |
| POST | `/api/shop/:id/buy` | compra un oggetto (lo posa subito sulla scrivania) |
| POST | `/api/shop/:id/equip` | `{ equipped }`: sulla scrivania o nel cassetto |
| GET | `/api/mail` | posta aziendale |
| GET | `/api/lessons` | elenco delle lezioni con avanzamento |
| GET | `/api/lessons/:id` | slide e quiz di una lezione |
| POST | `/api/lessons/:id/progress` | `{ viewed }` o `{ quizScore }` |
