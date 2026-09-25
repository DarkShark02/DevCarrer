// Installa su Piston le versioni dei linguaggi dichiarate in languages.js.
import { LANGUAGES } from '../src/languages.js';
import { PISTON_URL } from '../src/piston.js';

for (const lang of Object.values(LANGUAGES)) {
  const { language, version } = lang.piston;
  process.stdout.write(`Installo ${language} ${version}... `);
  const res = await fetch(`${PISTON_URL}/packages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language, version }),
  });
  const body = await res.json().catch(() => ({}));
  if (res.ok) console.log('ok');
  else if (body.message?.includes('already installed')) console.log('già installato');
  else {
    console.log('ERRORE');
    console.error(body);
    process.exitCode = 1;
  }
}
