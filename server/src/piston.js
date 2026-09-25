const PISTON_URL = process.env.PISTON_URL ?? 'http://localhost:2000/api/v2';

const LIMITS = {
  run_timeout: 3000, // ms
  compile_timeout: 10000,
  run_memory_limit: 128 * 1024 * 1024, // byte
};

export async function execute(lang, code, stdin = '') {
  const res = await fetch(`${PISTON_URL}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: lang.piston.language,
      version: lang.piston.version,
      files: [{ name: lang.filename, content: code }],
      stdin,
      ...LIMITS,
    }),
    signal: AbortSignal.timeout(15000),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message ?? `Piston HTTP ${res.status}`);
  }

  // Normalizziamo la risposta: il client non deve conoscere il formato Piston.
  const run = body.run ?? {};
  const compile = body.compile;
  return {
    stdout: run.stdout ?? '',
    stderr: (compile?.stderr ?? '') + (run.stderr ?? ''),
    exitCode: run.code ?? null,
    signal: run.signal ?? null, // es. SIGKILL se supera tempo/memoria
  };
}

export async function runtimes() {
  const res = await fetch(`${PISTON_URL}/runtimes`, { signal: AbortSignal.timeout(3000) });
  if (!res.ok) throw new Error(`Piston HTTP ${res.status}`);
  return res.json();
}

export { PISTON_URL };
