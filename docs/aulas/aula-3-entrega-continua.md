# Aula 3 — Entrega Contínua: staging, aprovação, baseline e rollback

**Objetivo:** ao final desta aula, cada merge na `main` do seu projeto gera **um** pacote
versionado que passa por staging, espera a sua aprovação e vira uma **baseline**
(tag `vX.Y.Z` + Release com notas e pacote anexado). Você também saberá voltar a
uma versão anterior com um clique.

**Seções do PGC aplicadas:** 6.1 (CD e gates), 6.4 (rollback), 9 (baselines e releases), 3.3 (SemVer).

**Pré-requisito:** Aula 2 concluída (CI obrigatório na `main`).

**Terminal no laboratório:** use o **Git Bash**, como na Aula 2.

**Referência:** [.github/workflows/cd.yml](../../.github/workflows/cd.yml) e
[.github/workflows/rollback.yml](../../.github/workflows/rollback.yml) da ONGConecta.

---

## Como o PGC se traduz no seu projeto

Seu app pode ser site, API, desktop ou mobile, e nem todo app tem onde ser hospedado de
graça. Por isso, o modelo desta aula usa o próprio GitHub como "ambiente":

| PGC | No seu projeto |
|---|---|
| Build único promovido entre ambientes | o job `preparar` gera o pacote **uma vez**; staging e produção usam o mesmo arquivo |
| Staging | o pacote candidato, disponível para download e teste na execução (e o site em `/staging/`, se você usar o GitHub Pages) |
| Gate de aprovação | o Environment `production`, que você criou na Aula 1, pausa o pipeline até você aprovar |
| Produção / baseline | tag `vX.Y.Z` + **Release** com as notas e o pacote anexado (e o site na raiz, se usar Pages) |
| Rollback | marca uma Release anterior como a versão oficial e republica o site dela, **sem recompilar** |

**A versão é calculada pelos títulos dos PRs** (Conventional Commits) desde a última tag:

| Título do PR mesclado | Efeito |
|---|---|
| `feat: ...` | MINOR: 1.2.0 → **1.3.0** |
| `fix: ...` ou `perf: ...` | PATCH: 1.2.0 → **1.2.1** |
| `feat!: ...` ou `BREAKING CHANGE:` na descrição | MAJOR: 1.2.0 → **2.0.0** |
| `docs`, `chore`, `ci`, `test`, `refactor`, `style` | sem versão nova; produção não roda |
| primeiro merge, sem nenhuma tag | **1.0.0** |

## 1. Copie os arquivos (um PR)

Em uma branch `feature/<issue>-cd`:

| Copiar | Para | Ajuste |
|---|---|---|
| [scripts/proxima-versao.mjs](../../scripts/proxima-versao.mjs) | `scripts/proxima-versao.mjs` | nenhum; roda com o Node que já existe no servidor, em qualquer stack |
| [modelos/cd-modelo.yml](modelos/cd-modelo.yml) | `.github/workflows/cd.yml` | no job `preparar`, deixe **uma** opção de build (Node, Java ou código-fonte) e apague as outras |
| [modelos/rollback-modelo.yml](modelos/rollback-modelo.yml) | `.github/workflows/rollback.yml` | nenhum |

A opção de build escolhida precisa deixar o resultado na pasta `pacote/`:

- **Node com build** (React, Vue, Angular): ajuste `cp -r dist pacote` para a pasta que o seu build gera.
- **Java Maven**: o `.jar` de `target/` vai para `pacote/`.
- **Código-fonte** (Python, PHP, API Node sem build): o pacote é o código daquela versão.

Abra o PR com título `ci: adiciona entrega contínua`. Como é `ci:`, ele não gera versão
sozinho; mas, por ser o primeiro merge e ainda não haver tag, o pipeline cria a **1.0.0**.

### Opcional: publicar o site no GitHub Pages

Só para app com **site estático** (HTML ou build de React, Vue, Angular):

1. **Settings → Secrets and variables → Actions → Variables → New repository variable**:
   `PUBLICAR_PAGES` = `true`.
2. O build precisa usar **caminhos relativos**, para funcionar em `/staging/` e na raiz:
   Vite → `base: './'` no `vite.config`; Create React App → `"homepage": "."` no `package.json`;
   Angular → `ng build --base-href ./`.
3. Depois do primeiro deploy (que cria a branch `gh-pages`): **Settings → Pages** →
   *Deploy from a branch* → `gh-pages` / `(root)`.

Site: `https://<seu-usuario>.github.io/<seu-repo>/`, e staging em `.../staging/`.

## 2. Primeiro deploy e aprovação

Depois do merge, abra a aba **Actions** → workflow **CD**:

1. **Versão e pacote**: veja no log a versão calculada (`versao=1.0.0`).
2. **Staging**: abra o resumo da execução e baixe o artefato `pacote`. Confira se o
   conteúdo é o esperado (e abra o site de staging, se usar Pages).
3. **Produção** fica em *Waiting for review*. Clique em **Review deployments →
   production → Approve and deploy**.
4. Abra **Releases** no seu repositório: deve existir a **v1.0.0**, com as notas e o
   `.zip` anexado. Essa é a sua primeira baseline.

## 3. Versão semântica na prática

Faça três PRs pequenos no seu app, cada um revisado pelo seu par, e aprove os deploys:

| PR (título) | Versão esperada |
|---|---|
| `docs: ...` (só altera `.md`) | nenhuma; o CD nem roda |
| `fix(<parte>): ...` (uma correção real) | **v1.0.1** |
| `feat(<parte>): ...` (algo novo, mesmo pequeno) | **v1.1.0** |

Abra a Release v1.1.0 e confira se as notas separam *Funcionalidades* de *Correções*.

## 4. Rollback (PGC 6.4)

Simule que a v1.1.0 tem um defeito grave:

1. **Actions → Rollback → Run workflow** → tag `v1.0.0`.
2. Aprove em *Review deployments* (o rollback passa pelo mesmo gate).
3. Em **Releases**, a v1.0.0 volta a ter o selo **Latest** (e o site volta a ser o da v1.0.0, se usar Pages).
4. Leia o resumo da execução: ele registra quem pediu o rollback.

Depois, corrija a `main` do jeito certo: branch `revert/<descricao>`, `git revert` do
commit problemático e PR com título `revert: ...`. O rollback devolve a versão oficial
em minutos; o revert corrige o código e passa pelo registro de auditoria normal.

## Para discutir

Por que o pipeline gera o pacote uma única vez, em vez de compilar de novo para produção?
Que tipo de defeito apareceria se staging e produção fossem compilados separadamente?

---

## Entrega

1. Link da Release **v1.1.0** do seu projeto.
2. Link da execução do CD em que você aprovou a produção.
3. Link da execução do Rollback.
4. Link do PR `revert: ...`.

## Critérios de conferência

- [ ] `cd.yml`, `rollback.yml` e `scripts/proxima-versao.mjs` no repositório.
- [ ] Releases v1.0.0, v1.0.1 e v1.1.0 com notas e pacote anexado.
- [ ] Toda produção aprovada no Environment `production` (histórico em Settings → Environments).
- [ ] Rollback executado e aprovado; v1.0.0 marcada como *Latest* depois dele.
- [ ] Revert feito por PR, não por push direto.
- [ ] (Opcional) Site publicado no Pages em staging e produção.

## Problemas comuns

| Sintoma | Causa e solução |
|---|---|
| Produção publicou sem pedir aprovação | o Environment `production` não tinha *Required reviewers*; configure e rode de novo |
| *A pasta pacote/ não foi criada* | a opção de build não copiou nada para `pacote/`; confira o nome da pasta de saída |
| Job **Produção** aparece como *skipped* | não houve `feat`/`fix` desde a última tag; é o esperado |
| `npm ci` falha no CD | a opção Node exige `package-lock.json` na raiz; se o app estiver numa subpasta, adicione `working-directory` aos passos de build |
| *Resource not accessible by integration* ao criar a tag | **Settings → Actions → General → Workflow permissions** → *Read and write permissions* |
| Site do Pages em branco ou sem estilo | o build usa caminhos absolutos; veja o item 2 de "Publicar o site" |
| Pages retorna 404 | a fonte em **Settings → Pages** não está em `gh-pages` / `(root)` |
| `*.github.io` não abre no laboratório | o pipeline funciona mesmo assim; confira pelo celular ou baixe o artefato |
