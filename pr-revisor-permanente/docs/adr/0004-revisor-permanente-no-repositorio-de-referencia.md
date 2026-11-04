# 0004 — Revisor permanente no repositório de referência

- Status: aceito (substitui o [ADR 0003](0003-revisao-por-pares-no-repositorio-de-referencia.md))
- Data: 04/11/2026

## Contexto

O ADR 0003 deixou a `main` da ONGConecta com 0 aprovações, porque o professor era o
único mantenedor, e previu adotar um revisor permanente quando houvesse alguém
disponível. Agora há: o usuário **@dsp789** foi adicionado como colaborador com
permissão de escrita.

## Decisão

1. A `main` volta a exigir **1 aprovação** de outra pessoa, além dos checks `ci-ok`
   e `titulo-pr`, como o PGC (3.3 e 5.2) determina
   (`bash scripts/configurar-repositorio.sh lzcamargo 1`).
2. **@dsp789** é chamado automaticamente em todo PR pelo `CODEOWNERS`.
3. O repositório permite **merge automático**: o PR é mesclado sozinho quando os
   checks passam e a aprovação chega. A liberação das aulas (`docs(aulas): libera
   aula N`) usa esse recurso e é aberta com antecedência, para dar tempo à revisão.
4. O deploy em produção continua exigindo aprovação do professor no Environment
   `production`.

## Alternativas consideradas

- **Manter 0 aprovações** (ADR 0003). Descartada: com um revisor disponível, o
  desvio em relação ao PGC deixa de ter justificativa.
- **Exigir aprovação só em código, não em `docs`.** A proteção clássica de branch não
  distingue pastas, e a liberação das aulas também é mudança de configuração;
  mantém-se a mesma regra para tudo.

## Consequências

- Todo merge na `main` passa a ter revisão humana de outra pessoa: o repositório de
  referência mostra aos alunos exatamente o processo que eles seguem com o par.
- A liberação de cada aula depende do revisor: ela é aberta na véspera da aula.
- A demonstração com aluno revisor (Aula 2) continua possível sem mexer na regra:
  basta adicionar o aluno como colaborador durante a aula.
