// Regras de versionamento do app mobile (PGC 3.3 e 4.2).
// O número semântico (MAJOR.MINOR.PATCH) é a fonte única; o versionCode
// do Android e o buildNumber do iOS são derivados dele.

const SEMVER_RE = /^v?(\d+)\.(\d+)\.(\d+)$/;

export function analisarVersao(versao) {
  const m = SEMVER_RE.exec(String(versao).trim());
  if (!m) throw new Error(`Versão inválida: ${versao} (esperado X.Y.Z)`);
  return { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]) };
}

/**
 * Converte 1.2.3 em 10203 — sempre crescente enquanto MINOR e PATCH < 100.
 * As lojas exigem que o versionCode/buildNumber só aumente.
 */
export function calcularVersionCode(versao) {
  const { major, minor, patch } = analisarVersao(versao);
  if (minor > 99 || patch > 99) {
    throw new Error('MINOR e PATCH devem ser menores que 100');
  }
  return major * 10000 + minor * 100 + patch;
}

/** Nome do build no padrão <plataforma>-<versão>-<build> (PGC 4.2). */
export function nomeDoBuild(plataforma, versao, build) {
  if (!['android', 'ios'].includes(plataforma)) {
    throw new Error(`Plataforma desconhecida: ${plataforma}`);
  }
  const { major, minor, patch } = analisarVersao(versao);
  return `${plataforma}-${major}.${minor}.${patch}-${build}`;
}
