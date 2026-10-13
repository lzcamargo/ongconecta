import { validarDoacao, validarEmail } from '../src/validacao.js';

describe('validarEmail', () => {
  test('aceita e-mail válido', () => {
    expect(validarEmail('voluntaria@ong.org.br')).toBe(true);
  });

  test('rejeita e-mail sem @', () => {
    expect(validarEmail('voluntaria.ong.org.br')).toBe(false);
  });

  test('rejeita valores que não são texto', () => {
    expect(validarEmail(undefined)).toBe(false);
  });
});

describe('validarDoacao', () => {
  const valida = { nome: 'Ana', email: 'ana@ong.org', valor: 50, forma: 'pix' };

  test('doação válida não tem erros', () => {
    expect(validarDoacao(valida)).toEqual([]);
  });

  test('valor zero é rejeitado', () => {
    expect(validarDoacao({ ...valida, valor: 0 })).toContain(
      'valor deve ser um número maior que zero',
    );
  });

  test('doação de itens dispensa valor', () => {
    expect(validarDoacao({ ...valida, forma: 'item', valor: undefined })).toEqual([]);
  });

  test('forma de pagamento desconhecida é rejeitada', () => {
    const erros = validarDoacao({ ...valida, forma: 'bitcoin' });
    expect(erros[0]).toMatch(/forma deve ser uma de/);
  });

  test('corpo ausente é rejeitado', () => {
    expect(validarDoacao(null)).toEqual(['corpo da requisição inválido']);
  });
});
