# Aula 4 — Governança: dependências, mudanças de alto risco e rastreabilidade

**Objetivo:** ao final desta aula, o seu projeto mantém as dependências atualizadas de
forma controlada, leva mudanças de alto risco a um comitê, registra as decisões de
arquitetura e permite seguir qualquer versão até a Issue que a originou.

**Seções do PGC aplicadas:** 8.2 (CCM), 10 (auditoria e rastreabilidade), 12 (onboarding), 13 (dependências).

**Pré-requisito:** Aula 3 concluída (Releases sendo geradas pelo pipeline).

**Referência:** [.github/dependabot.yml](../../.github/dependabot.yml),
[.github/ISSUE_TEMPLATE/mudanca-alto-risco.yml](../../.github/ISSUE_TEMPLATE/mudanca-alto-risco.yml),
[docs/adr/](../adr/) e [docs/onboarding.md](../onboarding.md) da ONGConecta.

---

## 1. Dependências como itens de configuração (PGC 13)

### 1.1 Ative os alertas

**Settings → Code security** (ou *Advanced Security*):

- [ ] **Dependabot alerts**
- [ ] **Dependabot security updates**

### 1.2 Atualizações controladas

Crie `.github/dependabot.yml` a partir do [exemplo da ONGConecta](../../.github/dependabot.yml),
trocando o `package-ecosystem` e o `directory` pelos do seu projeto:

| Stack | `package-ecosystem` | `directory` (onde está o arquivo) |
|---|---|---|
| Node | `npm` | pasta do `package.json` |
| Python | `pip` | pasta do `requirements.txt` |
| Java Maven / Gradle | `maven` / `gradle` | pasta do `pom.xml` / `build.gradle` |
| .NET | `nuget` | pasta do `.csproj` |
| PHP | `composer` | pasta do `composer.json` |
| Flutter / Dart | `pub` | pasta do `pubspec.yaml` |
| Workflows do GitHub Actions | `github-actions` | `/` |

Mantenha `commit-message: prefix: 'chore(deps)'`. Assim o título dos PRs do Dependabot
passa no check `titulo-pr`, e atualizações de dependência não geram versão nova sozinhas.

Inclua sempre o bloco `github-actions`: as actions usadas nos workflows também são
dependências e também ficam desatualizadas.

### 1.3 Revise um PR do Dependabot

Os PRs chegam no dia agendado. Para não esperar: **Insights → Dependency graph →
Dependabot → Check for updates** (ou o botão *Last checked* ao lado do arquivo).

Em um dos PRs:

1. Leia as notas da nova versão (link *Release notes* na descrição do PR).
2. Confira se o CI ficou verde. Se quebrou, o Dependabot encontrou uma mudança
   incompatível: comente no PR o que quebrou e feche **sem** mesclar.
3. Se passou, peça a revisão do seu par e faça o merge.

## 2. Aceitação de risco registrada

O seu CI bloqueia só vulnerabilidades **críticas** (PGC 5.3). Abra **Security →
Dependabot alerts** e veja o que existe abaixo disso.

Decida, para o seu projeto:

- manter o limite em `critical`, ou subir para `high` no `ci.yml`?
- os alertas `high` que existem hoje são de dependências que vão para produção, ou só de
  ferramentas de desenvolvimento?

Registre a decisão no passo 4, com um **prazo de revisão**. Risco aceito e documentado é
gestão; alerta ignorado não é.

## 3. Comitê de Controle de Mudanças (PGC 8.2)

1. Copie [.github/ISSUE_TEMPLATE/mudanca-alto-risco.yml](../../.github/ISSUE_TEMPLATE/mudanca-alto-risco.yml)
   para a mesma pasta do seu repositório.
2. Escolha uma mudança de **alto risco que faça sentido no seu app**, por exemplo:
   - passar a guardar um dado pessoal (CPF, endereço, dado de saúde) → LGPD;
   - alterar a estrutura do banco de dados com dados já existentes;
   - corrigir um defeito direto em produção, fora do fluxo normal (hotfix).
3. Abra uma Issue com o formulário **Mudança de alto risco (CCM)**. O **plano de rollback**
   precisa citar uma tag real do seu projeto (ex.: "voltar para v1.1.0 pelo workflow Rollback").
4. Seu par atua como segundo membro do comitê: comenta com perguntas e registra a decisão
   (*Aprovada*, *Aprovada com ressalvas* ou *Rejeitada*) com justificativa.

Você não precisa implementar a mudança; o exercício é a decisão registrada.

## 4. Registros de decisão de arquitetura (ADR)

Crie a pasta `docs/adr/` e escreva **dois** ADRs sobre o seu pipeline, no formato dos da
ONGConecta ([0001](../adr/0001-github-pages-para-staging-e-producao.md),
[0002](../adr/0002-check-agregador-ci-ok.md)):

```markdown
# 0001 — <decisão em uma frase>

- Status: aceito
- Data: <dd/mm/aaaa>

## Contexto
<o problema e as restrições: laboratório, contas, stack>

## Decisão
<o que foi decidido>

## Alternativas consideradas
<o que mais foi avaliado e por que não>

## Consequências
<o que melhora, o que piora, o que fica pendente>
```

Sugestões: "Produção = Release do GitHub", "Limite de vulnerabilidades no CI" (passo 2),
"Limite de cobertura" (se você registrou um desvio na Aula 2).

Envie por PR com título `docs: registra decisões de arquitetura`. Repare que ele não gera
versão nem dispara o CD.

## 5. Onboarding testado (PGC 12)

Escreva `docs/onboarding.md` no seu projeto (veja o [da ONGConecta](../onboarding.md)):
como instalar, rodar, testar, criar branch, abrir PR e ler o resultado do pipeline.

**Teste de verdade:** seu par segue o seu guia, **sem perguntar nada a você**, e abre um PR
`docs: ...` no seu repositório corrigindo algo que ficou confuso no próprio guia.

## 6. Rastreabilidade de ponta a ponta (PGC 10)

Escolha a sua Release **v1.1.0** e reconstrua o caminho completo dela, só com links:

| Elo | Onde encontrar |
|---|---|
| Release v1.1.0 | **Releases** |
| Commit da tag | clique na tag dentro da Release |
| Pull Request que gerou o commit | página do commit → link do PR (`#numero`) |
| Revisão e aprovação do par | aba **Conversation** do PR |
| Execução do CI que liberou o merge | aba **Checks** do PR |
| Issue de origem | `Closes #` na descrição do PR |
| Quem aprovou a produção, e quando | **Settings → Environments → production**, ou a execução do CD |

Se algum elo não existir (um PR sem Issue, por exemplo), anote: essa é a falha de processo
que uma auditoria encontraria.

---

## Entrega

1. Link do `dependabot.yml` e de um PR do Dependabot revisado (mesclado ou fechado com justificativa).
2. Link da Issue do CCM com a decisão registrada.
3. Links dos dois ADRs.
4. Link do PR que o seu par abriu seguindo o onboarding.
5. A tabela de rastreabilidade do passo 6 preenchida com os links da sua v1.1.0.

## Critérios de conferência

- [ ] Alertas e atualizações de segurança do Dependabot ativos.
- [ ] `dependabot.yml` com o ecossistema da stack e com `github-actions`, prefixo `chore(deps)`.
- [ ] PR do Dependabot tratado com revisão e justificativa.
- [ ] Issue de CCM com critério de risco, plano de rollback citando uma tag real e decisão do par.
- [ ] Dois ADRs completos (contexto, decisão, alternativas, consequências), um deles sobre o risco aceito.
- [ ] Onboarding seguido pelo par sem ajuda, com PR de melhoria.
- [ ] Cadeia Release → commit → PR → revisão → CI → Issue → aprovação completa, ou falhas apontadas.

## Problemas comuns

| Sintoma | Causa e solução |
|---|---|
| Nenhum PR do Dependabot aparece | as dependências já estão atualizadas, ou o `directory` está errado; confira em **Insights → Dependency graph → Dependabot** |
| PR do Dependabot falha no `titulo-pr` | falta `commit-message: prefix: 'chore(deps)'` no bloco daquele ecossistema |
| PR do Dependabot não roda o CI | PRs do Dependabot não recebem os *secrets* do repositório; se o seu CI usa algum, ele precisa funcionar sem |
| O formulário de CCM não aparece em *New issue* | o arquivo não está em `.github/ISSUE_TEMPLATE/` na `main`, ou o YAML tem erro (valores com `:` precisam de aspas) |
