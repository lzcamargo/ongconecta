import { detectarAmbiente } from './ambiente.js';

describe('detectarAmbiente', () => {
  it('reconhece execução local', () => {
    expect(detectarAmbiente({ hostname: 'localhost', pathname: '/' })).toBe('local');
  });

  it('reconhece staging pelo caminho', () => {
    expect(
      detectarAmbiente({ hostname: 'aluno.github.io', pathname: '/ongconecta/staging/' }),
    ).toBe('staging');
  });

  it('demais URLs são produção', () => {
    expect(detectarAmbiente({ hostname: 'aluno.github.io', pathname: '/ongconecta/' })).toBe(
      'produção',
    );
  });

  it('sem location assume local', () => {
    expect(detectarAmbiente(null)).toBe('local');
  });
});
