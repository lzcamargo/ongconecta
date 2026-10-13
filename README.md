# ONGConecta

Plataforma web e mobile para gestão de voluntários e doações — projeto-exemplo
da disciplina de Gerência de Configuração e Processos de Software, implementando
o **Plano de Gerenciamento de Configuração — Enfoque DevOps (CI/CD)**.

| Pasta | Conteúdo | Stack |
|---|---|---|
| `api/` | API de doações | Node 22 + Express, Jest |
| `web/` | Site da ONG | React + Vite, Vitest |
| `mobile/` | App de campanhas | Expo (React Native), Jest |
| `.github/workflows/` | Pipelines CI/CD | GitHub Actions |
| `scripts/` | Versão semântica, smoke test, configuração, diagnóstico de rede | Node, Bash |
| `docs/` | Onboarding, ADRs, guia do laboratório | Markdown |

## Atividades práticas

As atividades das aulas, em que você aplica este plano no **seu próprio projeto**, estão em
[docs/aulas](docs/aulas/README.md). Cada aula aparece lá quando é liberada.

## Pipeline

```
PR aberto ──► CI: titulo-pr · api · web · mobile ──► ci-ok ──► revisão (1 aprovação)
                                                                     │ squash merge
                                                                     ▼
main ──► CD: versão SemVer + build ──► staging (automático) ──► produção (aprovação do líder)
                                   └─► pacote de teste mobile          └─► tag vX.Y.Z + Release
```

| Workflow | Gatilho | Seção do PGC |
|---|---|---|
| `ci.yml` | Pull Request para main | 5.1, 5.2, 5.3, 13 |
| `pr-titulo.yml` | Pull Request (inclusive edição do título) | 3.3, 4.2 |
| `cd.yml` | push na main | 6, 9, 14 |
| `rollback.yml` | manual (Actions → Run workflow) | 6.4 |

## Primeiros passos

1. Faça um **fork** (ou use o repositório da sua equipe) — deixe-o **público**.
2. Na aba **Actions** do fork, clique em *I understand… enable them*.
3. Configure o repositório — pelo site (roteiro da Aula 1) ou com o script:
   ```bash
   gh auth login
   bash scripts/configurar-repositorio.sh <usuario-do-dev-lider> [aprovacoes]
   ```
4. Leia o [guia de onboarding](docs/onboarding.md).
5. No laboratório: [docs/laboratorio-rede-restrita.md](docs/laboratorio-rede-restrita.md)
   e `node scripts/diagnostico-rede.mjs`.

## Ambientes

| Ambiente | URL | Promoção |
|---|---|---|
| Revisão de PR | artefato `web-pr-<n>` na aba Actions | a cada push no PR |
| Staging | `https://<usuario>.github.io/ongconecta/staging/` | merge na main |
| Produção | `https://<usuario>.github.io/ongconecta/` | aprovação no Environment `production` |

## Secrets e variáveis (todos opcionais)

| Nome | Tipo | Uso |
|---|---|---|
| `RENDER_DEPLOY_HOOK_STAGING` | Secret (Environment staging ou repositório) | deploy da API em staging |
| `RENDER_DEPLOY_HOOK_PRODUCTION` | Secret | deploy da API em produção |
| `API_URL` | Variable | URL da API usada pelo site; sem ela o site roda em modo demonstração |
| `EXPO_TOKEN` | Secret | build real do app no EAS; sem ele gera só o bundle JS |

## Comunicação da equipe

- Canal: `<link do Discord/Slack>`
- Prazo de resposta a Pull Requests: até 3 dias úteis
