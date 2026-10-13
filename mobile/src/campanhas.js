// Lógica de exibição das campanhas da ONG no app.

export function percentualArrecadado(arrecadado, meta) {
  if (!(meta > 0)) return 0;
  const pct = Math.round((arrecadado / meta) * 100);
  return Math.min(Math.max(pct, 0), 100);
}

export function ordenarPorUrgencia(campanhas, hoje = new Date()) {
  return [...campanhas].sort((a, b) => {
    const diasA = (new Date(a.prazo) - hoje) / 86400000;
    const diasB = (new Date(b.prazo) - hoje) / 86400000;
    return diasA - diasB;
  });
}

export const CAMPANHAS_EXEMPLO = [
  { id: 1, titulo: 'Agasalhos de inverno', arrecadado: 320, meta: 500, prazo: '2026-12-15' },
  { id: 2, titulo: 'Cestas básicas', arrecadado: 1800, meta: 2000, prazo: '2026-11-20' },
  { id: 3, titulo: 'Material escolar', arrecadado: 90, meta: 600, prazo: '2027-01-31' },
];
