// Testes com o runner nativo do Node (sem dependências): node --test scripts/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  classificarCommit,
  gerarNotas,
  incrementar,
  tipoDeIncremento,
} from './proxima-versao.mjs';

test('notas agrupam por tipo e omitem grupos vazios', () => {
  const notas = gerarNotas('1.1.0', ['feat(web): doação', 'fix(api): e-mail']);
  assert.match(notas, /## v1\.1\.0/);
  assert.match(notas, /### Funcionalidades\n- feat\(web\): doação/);
  assert.match(notas, /### Correções\n- fix\(api\): e-mail/);
  assert.doesNotMatch(notas, /Outros/);
});

test('feat gera MINOR', () => {
  assert.equal(classificarCommit('feat(web): adiciona formulário'), 'minor');
});

test('fix gera PATCH', () => {
  assert.equal(classificarCommit('fix(api): corrige validação'), 'patch');
});

test('exclamação ou BREAKING CHANGE geram MAJOR', () => {
  assert.equal(classificarCommit('feat(api)!: remove rota antiga'), 'major');
  assert.equal(classificarCommit('refactor: x\n\nBREAKING CHANGE: muda contrato'), 'major');
});

test('docs e chore não geram release', () => {
  assert.equal(classificarCommit('docs: atualiza README'), 'none');
  assert.equal(classificarCommit('chore(deps): bump vite'), 'none');
});

test('vale o maior incremento do conjunto', () => {
  assert.equal(tipoDeIncremento(['fix: a', 'feat: b', 'docs: c']), 'minor');
});

test('incrementa corretamente', () => {
  assert.equal(incrementar('1.2.3', 'major'), '2.0.0');
  assert.equal(incrementar('1.2.3', 'minor'), '1.3.0');
  assert.equal(incrementar('1.2.3', 'patch'), '1.2.4');
  assert.equal(incrementar('1.2.3', 'none'), '1.2.3');
});
