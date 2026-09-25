import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DB_PATH =
  process.env.DB_PATH ?? resolve(dirname(fileURLToPath(import.meta.url)), '../data/devcareer.db');

mkdirSync(dirname(DB_PATH), { recursive: true });
export const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS players (
    id         INTEGER PRIMARY KEY,
    name       TEXT    NOT NULL,
    balance    INTEGER NOT NULL DEFAULT 0,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS completions (
    player_id    INTEGER NOT NULL REFERENCES players(id),
    exercise_id  TEXT    NOT NULL,
    reward       INTEGER NOT NULL,
    code         TEXT    NOT NULL,
    completed_at TEXT    NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (player_id, exercise_id)
  );

  CREATE TABLE IF NOT EXISTS attempts (
    id          INTEGER PRIMARY KEY,
    player_id   INTEGER NOT NULL REFERENCES players(id),
    exercise_id TEXT    NOT NULL,
    passed      INTEGER NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  -- Oggetti comprati nel negozio. equipped = posato sulla scrivania (e con effetto attivo).
  CREATE TABLE IF NOT EXISTS inventory (
    player_id    INTEGER NOT NULL REFERENCES players(id),
    item_id      TEXT    NOT NULL,
    price        INTEGER NOT NULL,
    equipped     INTEGER NOT NULL DEFAULT 1,
    purchased_at TEXT    NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (player_id, item_id)
  );

  -- Lezioni: letta fino in fondo e miglior risultato del quiz (facoltativo).
  CREATE TABLE IF NOT EXISTS lesson_progress (
    player_id  INTEGER NOT NULL REFERENCES players(id),
    lesson_id  TEXT    NOT NULL,
    viewed     INTEGER NOT NULL DEFAULT 0,
    quiz_best  INTEGER,
    updated_at TEXT    NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (player_id, lesson_id)
  );

  -- MVP: un solo giocatore locale, senza login.
  INSERT OR IGNORE INTO players (id, name) VALUES (1, 'Giocatore');
`);

export const LOCAL_PLAYER_ID = 1;

export function transaction(fn) {
  db.exec('BEGIN');
  try {
    const out = fn();
    db.exec('COMMIT');
    return out;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}
