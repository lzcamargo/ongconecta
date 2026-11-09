// Teste de fumaça: troque o caminho e a função por uma função real do seu app.
import { describe, it, expect } from 'vitest';
import { somar } from '../src/util.js';

describe('fumaça', () => {
  it('a função principal do app responde', () => {
    expect(somar(2, 3)).toBe(5);
  });
});
