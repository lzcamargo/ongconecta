# 0002 — Um único check obrigatório (`ci-ok`) com pipelines por pasta

- Status: aceito
- Data: 07/10/2026

## Contexto

O PGC (5) pede pipelines separados para web e mobile, disparados conforme a
pasta alterada. O Exercício 4.2 implementa isso com `paths:` em workflows
diferentes, e o 1.2 pede para marcar os checks como obrigatórios.

Essa combinação tem um defeito conhecido do GitHub: se `CI - Web` é
obrigatório e um PR altera só `/mobile`, o workflow web **nunca roda** e o
check fica "Expected — Waiting for status" para sempre. O PR não pode ser
mesclado.

## Decisão

Um único workflow `ci.yml`:

1. job `mudancas` detecta as pastas alteradas (`dorny/paths-filter`);
2. jobs `api`, `web`, `mobile` rodam só quando a pasta deles mudou;
3. job `ci-ok` roda **sempre** (`if: always()`) e falha se algum job falhou.

Apenas `ci-ok` (e `titulo-pr`) são obrigatórios na proteção da main.

## Consequências

- Mantém a economia de minutos do disparo por pasta.
- A proteção de branch não precisa mudar quando surgir uma nova pasta.
- Mudanças em `.github/` ou `scripts/` testam tudo: o pipeline também é item de
  configuração.
