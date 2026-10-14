# DevCareer

**Learn to code by building a career.** You start as an intern in a 3D office, sit down at your desk and write real Python code. Every exercise you solve earns you money and moves you up the ladder: intern → junior on a fixed-term contract → junior on a permanent contract → mid developer.

> This is a playable prototype. Its goal is to find out whether the loop *write real code → earn → progress* is fun and actually teaches. Expect rough edges.

## Features

- **Real code, really executed.** Your code runs in a [Piston](https://github.com/engineer-man/piston) sandbox, not in a simulation, and is checked against visible and hidden tests.
- **A 3D office** built with Three.js: walk around with WASD or by clicking, see your colleagues typing at their PCs, and sit at your own desk.
- **A PC with a desktop.** When you sit down, the camera frames your desk and the monitor shows a working desktop. Opening an app zooms in on the screen. The apps are:
  - **Courses**: one lesson per topic, with slides, runnable examples and an optional mini-quiz;
  - **Editor**: the exercises, using the Monaco editor;
  - **Shop**, **Mail** and **Profile**.
- **Lessons → exercises → final project.** Each module ends with a longer project (a canteen receipt, a bonus calculator, a ticket report, a warehouse manager). Completing it earns you the promotion.
- **A shop for your desk.** You spend your earnings on items that appear on your 3D desk. Three of them also change the game:
  - a bigger monitor gives you more room for code;
  - a rubber duck shows line by line where your output differs from the expected one;
  - an espresso machine adds +10% to your rewards.
- **Two languages.** Italian and English, chosen at start-up. Briefs, hints, lessons and even the expected outputs are translated.
- **Consistent content.** An automated checker guarantees, for every language, that briefs, hints, examples, quiz answers and tests agree with each other (see [Content checks](#content-checks)).

Only Python is available for now, but exercises and lessons are organised so that more languages can be added.

## Requirements

- Node.js 22 or later (the server uses the built-in `node:sqlite` module)
- Docker, to run the Piston sandbox locally (the public Piston API is now whitelist-only)

## Getting started

```bash
npm install
npm run piston:up        # start the Piston container on port 2000
npm run piston:install   # install the runtimes listed in server/src/languages.js (first time only)
npm run dev              # server on :3001, client on http://localhost:5173
```

Your progress is saved in `server/data/devcareer.db`. Delete that file to start over.

## How to play

| Where | Controls |
|---|---|
| Office | WASD or arrow keys to move, or click on the floor. Your desk is the one with the green arrow. |
| Your desk | **E** (or click the desk) to sit down. Open an app on the monitor to start working. |
| Leaving | **Esc** closes the open app; a second **Esc** makes you stand up. |

If your browser doesn't support WebGL, the desktop simply fills the whole page.

## Project structure

```
server/   Express API, Piston client, grader, game state (SQLite)
  src/lessons/      lessons: slides, runnable examples, quizzes
  src/exercises/    exercises and final projects, one file per language track
  src/career.js     modules, roles, contracts and promotion rules
  src/shop.js       shop catalogue and item effects
  scripts/          content checker, runtime installer
client/   React + Vite
  src/office/       the 3D office (Three.js, procedural models and textures)
  src/desktop/      the in-game PC and its apps
  src/i18n/         interface strings (Italian, English)
```

Comments in the source code are written in Italian.

## Content checks

After changing exercises, lessons or translations, run:

```bash
npm run check-exercises -w server
```

It checks every language and fails if anything is inconsistent:

- every reference solution passes all tests, and no starter code passes them on its own;
- every code example (in briefs, hints and slides) prints exactly the output it claims;
- every expected output line that contains text is stated in the brief;
- strings printed in hints and starter code match the expected output, so no hint prints `"Hello"` when the test wants `"Ciao"`;
- no text contains the expected output of another language;
- in "what does this print?" quiz questions, the correct answer is the real output of the code and no wrong answer matches it;
- every exercise belongs to one lesson, and every module has exactly one final project, placed last;
- all interface, server and career texts have the same keys and placeholders in every language.

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Piston and runtime status |
| POST | `/api/run` | free execution `{ language, code, stdin }` |
| GET | `/api/player` | balance, rank, progress, desk items |
| GET | `/api/exercises` | exercise list with completed/unlocked state |
| GET | `/api/exercises/:id` | exercise detail (without hidden tests or solution) |
| POST | `/api/exercises/:id/submit` | grades `{ code }`, pays the reward, handles promotions |
| GET | `/api/lessons` | lesson list with progress |
| GET | `/api/lessons/:id` | slides and quiz of a lesson |
| POST | `/api/lessons/:id/progress` | `{ viewed }` or `{ quizScore }` |
| GET | `/api/shop` | catalogue, with owned and equipped items |
| POST | `/api/shop/:id/buy` | buys an item and places it on the desk |
| POST | `/api/shop/:id/equip` | `{ equipped }`: on the desk or in the drawer |
| GET | `/api/mail` | company mail |

The client sends the chosen interface language in the `X-Locale` header.

## Credits

Created by **Flavio Ruggiero**, with the help of **Claude** (Anthropic's AI assistant) through Claude Code. Flavio designed the game, set its direction and made the decisions along the way; Claude helped write the code, the lessons and the exercises.

## License

[MIT](LICENSE) © 2026 Flavio Ruggiero
