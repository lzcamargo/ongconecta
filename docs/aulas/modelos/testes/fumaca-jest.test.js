// Teste de fumaça: troque o caminho e a função por uma função real do seu app.
const { somar } = require('../src/util');

test('a função principal do app responde', () => {
  expect(somar(2, 3)).toBe(5);
});
