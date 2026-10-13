# Atividades práticas — implementando o PGC no seu projeto

Nestas aulas você aplica o **Plano de Gerenciamento de Configuração — Enfoque DevOps**
no **seu próprio app**, no seu repositório GitHub. A ONGConecta (este repositório) é o
exemplo de referência: tudo o que as atividades pedem já está implementado aqui.

Cada aula é liberada pelo professor na data dela. Quando uma aula for liberada, o link
aparece na tabela abaixo.

| Aula | Tema | Seções do PGC | Situação |
|---|---|---|---|
| 1 | Preparar o repositório do seu projeto | 2, 3.2, 3.3, 4.1 | <!-- aula-1 --> em breve |
| 2 | Integração Contínua no seu projeto | 4.2, 5 | <!-- aula-2 --> em breve |
| 3 | Entrega Contínua: staging, aprovação, baseline e rollback | 3.3, 6, 9 | <!-- aula-3 --> em breve |
| 4 | Governança: dependências, mudanças de alto risco e rastreabilidade | 8.2, 10, 12, 13 | <!-- aula-4 --> em breve |

## Como trabalhar

- **Seu projeto, sua stack.** As atividades valem para Node, Python, Java e outras; os
  modelos de workflow de cada aula indicam o que ajustar.
- **Par de revisão.** Você revisa os Pull Requests de um colega e ele revisa os seus.
  O GitHub não deixa ninguém aprovar o próprio PR.
- **Laboratório com rede restrita.** Leia [o guia da rede](../laboratorio-rede-restrita.md).
  O pipeline roda nos servidores do GitHub; se nada instalar na sua máquina, faça tudo
  pelo site do GitHub.
- **Dúvida sobre como algo funciona?** Abra o arquivo equivalente na ONGConecta: o
  [README](../../README.md) explica a organização do repositório.

## Material de apoio (já disponível)

- [Guia da rede restrita do laboratório](../laboratorio-rede-restrita.md)
- [Guia de onboarding da ONGConecta](../onboarding.md)
- [Decisões de arquitetura (ADRs)](../adr/)
- Workflows de referência: [CI](../../.github/workflows/ci.yml) ·
  [título do PR](../../.github/workflows/pr-titulo.yml) ·
  [CD](../../.github/workflows/cd.yml) · [Rollback](../../.github/workflows/rollback.yml)
