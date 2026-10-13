import { analisarVersao, calcularVersionCode, nomeDoBuild } from '../src/versao';

describe('versionamento do app', () => {
  test('aceita tag com prefixo v', () => {
    expect(analisarVersao('v1.2.3')).toEqual({ major: 1, minor: 2, patch: 3 });
  });

  test('rejeita versão fora do padrão SemVer', () => {
    expect(() => analisarVersao('1.2')).toThrow(/Versão inválida/);
  });

  test('versionCode cresce a cada release', () => {
    expect(calcularVersionCode('1.2.3')).toBe(10203);
    expect(calcularVersionCode('1.3.0')).toBeGreaterThan(calcularVersionCode('1.2.99'));
  });

  test('versionCode limita MINOR/PATCH a 99', () => {
    expect(() => calcularVersionCode('1.100.0')).toThrow();
  });

  test('nome do build segue o padrão do PGC', () => {
    expect(nomeDoBuild('android', 'v1.2.0', 45)).toBe('android-1.2.0-45');
  });

  test('rejeita plataforma desconhecida', () => {
    expect(() => nomeDoBuild('windows', '1.0.0', 1)).toThrow();
  });
});
