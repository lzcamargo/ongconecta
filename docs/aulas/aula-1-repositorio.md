# Aula 1 — Preparar o repositório do seu projeto

**Objetivo:** ao final desta aula, o repositório do **seu** projeto estará organizado
como item de configuração e protegido: ninguém (nem você) altera a `main` sem
Pull Request revisado por outra pessoa.

**Seções do PGC aplicadas:** 2 (papéis), 3.2 (ambientes), 3.3 (branching), 4.1 (itens de configuração).

**Referência:** a ONGConecta já tem tudo o que você vai fazer hoje. Sempre que tiver
dúvida, abra o arquivo correspondente neste repositório e compare.

> Você vai aplicar o plano no **seu app/projeto**, não na ONGConecta. Onde o PGC diz
> "Desenvolvedor Líder", leia "você"; onde diz "revisor", leia "seu par de revisão".

---

## 0. Antes de começar

- [ ] Conta GitHub com e-mail verificado e verificação em duas etapas (2FA) ativa.
- [ ] Seu app em um repositório **público** no seu usuário GitHub.
      No plano gratuito, a aprovação de deploy (Aula 3) e a análise de dependências (Aula 2)
      só funcionam em repositórios públicos. **Não deixe senhas ou chaves no código** (passo 1).
- [ ] Um colega definido como seu **par de revisão** (você também será o par dele).

Ainda não tem o app/projeto no GitHub? Crie o repositório vazio pelo site (botão **New**) e envie
o código por HTTPS:

```bash
cd pasta-do-seu-app
git init -b main
git add .
git commit -m "chore: versão inicial do projeto"
git remote add origin https://github.com/<seu-usuario>/<seu-repo>.git
git push -u origin main
```

### Rede do laboratório

A rede do laboratório bloqueia algumas coisas (a porta 22 do SSH costuma estar fechada).
Leia [o guia da rede restrita](../laboratorio-rede-restrita.md) e, se tiver Node instalado,
rode o diagnóstico a partir de uma cópia deste repositório:

```bash
node scripts/diagnostico-rede.mjs
```

Ele indica qual caminho usar: **A** (tudo local), **B** (Codespaces) ou **C** (só pelo site
do GitHub). Todas as aulas podem ser feitas pelo caminho C: o pipeline roda nos servidores
do GitHub, não na sua máquina.

---

## 1. Itens de configuração básicos (PGC 4.1)

Faça estes commits **antes** do passo 6. Depois dele, a `main` só aceita Pull Requests.

| Item | O que deve ter | Exemplo na ONGConecta |
|---|---|---|
| `README.md` | o que o app faz, stack, como instalar e rodar, como rodar os testes | [README.md](../../README.md) |
| `.gitignore` | dependências, builds, `.env`; modelos por linguagem em [github/gitignore](https://github.com/github/gitignore) | [.gitignore](../../.gitignore) |
| `.gitattributes` | `* text=auto eol=lf`, para o Windows do laboratório não quebrar scripts | [.gitattributes](../../.gitattributes) |
| Lockfile de dependências | versões exatas e versionadas (tabela abaixo) | `web/package-lock.json` |
| `.env.example` | nomes das variáveis de ambiente, **sem valores reais** | — |

| Stack | Lockfile que precisa estar no repositório |
|---|---|
| Node (npm) | `package-lock.json` (gerado por `npm install`) |
| Python | `requirements.txt` com versões fixas (`flask==3.0.3`), gerado por `pip freeze` |
| Java Maven / Gradle | `pom.xml` com versões explícitas / `gradle.lockfile` ou versões fixas no `build.gradle` |
| .NET | `packages.lock.json` (`<RestorePackagesWithLockFile>true</RestorePackagesWithLockFile>`) |
| PHP | `composer.lock` |
| Flutter / Dart | `pubspec.lock` |

**Segredos:** se algum dia uma senha, token ou chave de API foi commitada, ela continua no
histórico mesmo que você apague o arquivo. Troque a senha no serviço de origem; depois,
use variáveis de ambiente e, no pipeline, **GitHub Secrets** (Aula 3).

## 2. Modelos de colaboração (PGC 4.2 e 5.2)

Copie da ONGConecta para o seu repositório, mantendo as mesmas pastas:

| Copiar | Ajuste |
|---|---|
| [.github/pull_request_template.md](../../.github/pull_request_template.md) | nenhum |
| [.github/CODEOWNERS](../../.github/CODEOWNERS) | troque `@lzcamargo` pelo **seu** usuário e as pastas pelas do seu projeto |
| [.github/ISSUE_TEMPLATE/funcionalidade.yml](../../.github/ISSUE_TEMPLATE/funcionalidade.yml) | troque as opções de "Área" pelas partes do seu app |
| [.github/ISSUE_TEMPLATE/defeito.yml](../../.github/ISSUE_TEMPLATE/defeito.yml) | nenhum |

Pelo site: no seu repositório, **Add file → Create new file**, digite o caminho completo
(ex.: `.github/CODEOWNERS`) e cole o conteúdo.

## 3. Par de revisão

O GitHub não deixa ninguém aprovar o próprio Pull Request. Por isso cada estudante revisa o
projeto de um colega, e o colega revisa o seu.

1. **Settings → Collaborators → Add people** → usuário do seu par (permissão *Write*).
2. Seu par aceita o convite (chega por e-mail ou em `github.com/notifications`).
3. Faça o mesmo no repositório dele.

## 4. Merge e branches (PGC 3.3)

**Settings → General → Pull Requests**:

- [ ] Desmarcar *Allow merge commits* e *Allow rebase merging*; deixar só **Allow squash merging**.
- [ ] Em *Default commit message* (do squash), escolher **Pull request title and description**.
- [ ] Marcar **Automatically delete head branches**.

Por quê: cada PR vira **um** commit na `main`, com o título do PR como mensagem.
Na Aula 3, é desse título que o pipeline calcula a versão.

## 5. Ambientes (PGC 3.2 e 6.1)

**Settings → Environments → New environment**:

| Environment | Configuração |
|---|---|
| `staging` | *Deployment branches and tags* → **Protected branches only** |
| `production` | **Required reviewers** → você; **desmarcar** *Prevent self-review*; *Deployment branches* → **Protected branches only** |

Crie os dois **agora**. Se o pipeline da Aula 3 rodar antes, o GitHub cria o `production`
sozinho, sem aprovação, e publica direto.

## 6. Proteção da `main` (PGC 3.3 e 5.2)

**Settings → Branches → Add classic branch protection rule** → *Branch name pattern*: `main`

- [ ] **Require a pull request before merging** → *Required approvals*: **1**
- [ ] *Dismiss stale pull request approvals when new commits are pushed*
- [ ] **Require linear history**
- [ ] **Do not allow bypassing the above settings**
- [ ] *Require status checks to pass*: **deixe para a Aula 2** (os checks ainda não existem)

**Teste:** faça um commit qualquer direto na `main` e tente enviar (`git push`, ou
*Commit changes* pelo site). O GitHub deve recusar com *protected branch*.

---

## Entrega

Envie no ambiente da disciplina:

1. Link do seu repositório.
2. Usuário GitHub do seu par de revisão.
3. Print (ou texto copiado) da recusa do push direto na `main`.

## Critérios de conferência

- [ ] Repositório público, com README que permite rodar o app e os testes.
- [ ] `.gitignore`, `.gitattributes` e lockfile presentes; nenhum segredo visível no código.
- [ ] Template de PR, CODEOWNERS (com o seu usuário) e templates de Issue copiados e ajustados.
- [ ] Par de revisão com acesso de escrita.
- [ ] Somente *squash merge*, com o título do PR como mensagem.
- [ ] Environments `staging` e `production`, este com você como revisor obrigatório.
- [ ] `main` protegida: PR obrigatório, 1 aprovação, histórico linear, sem exceções.

## Problemas comuns

| Sintoma | Solução |
|---|---|
| `git push` pede senha e recusa | o GitHub não aceita a senha da conta no Git; deixe o Git Credential Manager abrir o navegador para o login |
| `git clone`/`push` por SSH fica parado | porta 22 bloqueada: use a URL `https://` |
| Não aparece *Required reviewers* no Environment | o repositório está privado; torne-o público (Settings → General → Danger Zone) |
| Seu par não consegue aprovar seu PR | ele ainda não aceitou o convite de colaborador |
| Terminou a aula em máquina compartilhada | saia da conta: `git credential-manager github logout <usuario>` |
