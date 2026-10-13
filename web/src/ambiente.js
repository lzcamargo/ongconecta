// O mesmo artefato de build é promovido de staging para produção (PGC 6),
// então o ambiente não pode ser "gravado" no build: é detectado pela URL.

export function detectarAmbiente(local = globalThis.location) {
  if (!local) return 'local';
  const { hostname = '', pathname = '' } = local;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'local';
  if (/\/staging(\/|$)/.test(pathname)) return 'staging';
  return 'produção';
}
