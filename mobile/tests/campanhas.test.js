import {
  CAMPANHAS_EXEMPLO,
  ordenarPorUrgencia,
  percentualArrecadado,
} from '../src/campanhas';

describe('campanhas', () => {
  test('calcula percentual arredondado', () => {
    expect(percentualArrecadado(320, 500)).toBe(64);
  });

  test('limita percentual a 100', () => {
    expect(percentualArrecadado(900, 500)).toBe(100);
  });

  test('meta zero retorna 0', () => {
    expect(percentualArrecadado(10, 0)).toBe(0);
  });

  test('ordena pela data de prazo mais próxima', () => {
    const ordenadas = ordenarPorUrgencia(CAMPANHAS_EXEMPLO, new Date('2026-10-01'));
    expect(ordenadas[0].titulo).toBe('Cestas básicas');
  });
});
