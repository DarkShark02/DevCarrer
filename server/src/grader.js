import { execute } from './piston.js';
import { expectedFor } from './exercises/index.js';

// Confronto tollerante: ignora \r, spazi a fine riga e righe vuote finali.
export function normalize(text) {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trimEnd();
}

// L'output atteso dipende dalla lingua scelta (es. "Accesso negato" / "Access denied").
export async function grade(lang, exercise, code, locale) {
  const results = await Promise.all(
    exercise.tests.map(async (test, i) => {
      const expected = expectedFor(test, locale);
      const run = await execute(lang, code, test.stdin ?? '');
      const timedOut = run.signal === 'SIGKILL';
      const crashed = !timedOut && run.exitCode !== 0;
      const passed = !timedOut && !crashed && normalize(run.stdout) === normalize(expected);
      const base = { name: `Test ${i + 1}`, hidden: !!test.hidden, passed, timedOut, crashed };

      // Dei test nascosti non riveliamo né input né output atteso.
      if (test.hidden) return base;
      return {
        ...base,
        stdin: test.stdin ?? '',
        expected,
        actual: run.stdout,
        stderr: run.stderr,
      };
    }),
  );
  return { passed: results.every((r) => r.passed), results };
}
