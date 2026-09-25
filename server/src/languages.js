// Registro dei linguaggi supportati. Il resto dell'app parla solo di id
// ("python"), mai di dettagli Piston: aggiungere un linguaggio = aggiungere una voce.
export const LANGUAGES = {
  python: {
    id: 'python',
    label: 'Python',
    monaco: 'python',
    piston: { language: 'python', version: '3.12.0' },
    filename: 'main.py',
  },
};

export function getLanguage(id) {
  return LANGUAGES[id] ?? null;
}
