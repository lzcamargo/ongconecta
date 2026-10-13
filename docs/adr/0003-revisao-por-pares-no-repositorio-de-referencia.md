# 0003 — Revisão por pares no repositório de referência

- Status: aceito
- Data: 13/10/2026

## Contexto

O PGC (3.3 e 5.2) exige que todo Pull Request seja aprovado por outra pessoa antes
do merge. Nos projetos dos alunos isso é atendido pelo **par de revisão**: cada aluno
adiciona um colega como colaborador.

A ONGConecta, porém, tem um único mantenedor (o professor). O GitHub não permite
aprovar o próprio PR, então exigir 1 aprovação travaria todo merge, inclusive a
liberação das aulas (`docs(aulas): libera aula N`).

## Decisão

1. A `main` da ONGConecta exige Pull Request e os checks `ci-ok` e `titulo-pr`, mas
   **0 aprovações** (`bash scripts/configurar-repositorio.sh lzcamargo 0`).
2. O deploy em produção continua exigindo aprovação no Environment `production`.
3. Nas demonstrações em aula, a regra passa **temporariamente** para 1 aprovação e um
   aluno, adicionado como colaborador, revisa e aprova o PR do professor ao vivo.
   Depois a regra volta para 0 e o colaborador é removido.

## Alternativas consideradas

- **Uma segunda conta do próprio professor como revisor.** Descartada por dois
  motivos: os Termos de Serviço do GitHub permitem só uma conta gratuita por pessoa
  (além de uma conta de máquina, restrita a tarefas automatizadas), e a "revisão"
  violaria a separação de funções que o próprio PGC defende, cumprindo a regra só no
  papel.
- **Revisor permanente (monitor ou outro professor).** Válida; adotar quando houver
  alguém disponível. Basta adicioná-lo como colaborador e voltar a regra para 1.

## Consequências

- Os merges do professor não têm revisão humana. O risco é aceitável porque o
  repositório é de referência, as mudanças são pequenas (principalmente `docs`) e os
  checks automáticos continuam obrigatórios.
- O desvio em relação ao PGC fica registrado aqui, e não escondido numa configuração.
- A demonstração com aluno revisor mostra, na prática, por que a aprovação precisa
  vir de outra pessoa.
