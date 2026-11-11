# Aula 2 — Integração Contínua no seu projeto

**Objetivo:** ao final desta aula, todo Pull Request do seu projeto passa
automaticamente por lint, testes, quality gate de cobertura e análise de
dependências, e só entra na `main` com tudo verde e aprovado pelo seu par.

**Seções do PGC aplicadas:** 4.2 (nomenclatura), 5.1 (gatilhos), 5.2 (revisão), 5.3 (quality gates).

**Pré-requisito:** Aula 1 concluída (`main` protegida, par de revisão com acesso).

**Terminal no laboratório:** as máquinas são Windows. Use o **Git Bash** (botão direito
na pasta → *Open Git Bash here*); o PowerShell padrão não aceita `&&` e bloqueia o `npm`.
Detalhes na seção 0 do [guia do laboratório](../laboratorio-rede-restrita.md).

**Referência:** [.github/workflows/ci.yml](../../.github/workflows/ci.yml) da ONGConecta
(três pastas, cada uma testada só quando muda) e [ADR 0002](../adr/0002-check-agregador-ci-ok.md).

---

## 1. Descubra os comandos da sua stack

O pipeline só repete, no servidor do GitHub, o que você faria no terminal. Antes de
escrever YAML, anote os comandos do seu projeto:

| Etapa | Node | Python | Java Maven | .NET | PHP | Flutter |
|---|---|---|---|---|---|---|
| Instalar | `npm ci` | `pip install -r requirements.txt` | (automático) | `dotnet restore` | `composer install` | `flutter pub get` |
| Lint | `npm run lint` (ESLint) | `ruff check .` | `mvn compile` com avisos como erro | `dotnet format --verify-no-changes` | `vendor/bin/phpcs` | `flutter analyze` |
| Testes + cobertura | `npm test -- --coverage` | `python -m pytest --cov=. --cov-fail-under=60` | `mvn verify` (JaCoCo) | `dotnet test --collect:"XPlat Code Coverage"` | `vendor/bin/phpunit --coverage-text` | `flutter test --coverage` |
| Build | `npm run build` | — | `mvn package` | `dotnet build` | — | `flutter build web` |

## 2. Modelo de workflow

Escolha o modelo da sua stack. Para .NET, PHP ou Flutter, parta do modelo Node e troque
o passo `setup-node` por `actions/setup-dotnet`, `shivammathur/setup-php` ou
`subosito/flutter-action`, e os comandos pelos da tabela acima.

| Stack | Modelo |
|---|---|
| Node | [modelos/ci-node.yml](modelos/ci-node.yml) |
| Python | [modelos/ci-python.yml](modelos/ci-python.yml) |
| Java Maven | [modelos/ci-java-maven.yml](modelos/ci-java-maven.yml) |

Todos têm o mesmo formato da ONGConecta:

- job **`qualidade`**: lint, testes com cobertura e build da sua stack;
- job **`dependencias`**: o GitHub compara as dependências do PR com a `main` e bloqueia
  vulnerabilidade **crítica** (funciona para qualquer linguagem);
- job **`ci-ok`**: roda sempre e só fica verde se nenhum outro falhou. **É o único check de
  CI que você marca como obrigatório.**

## 3. Seu app precisa ter lint e testes

Sem testes, o CI não protege nada, e sem **nenhum** teste ele falha logo de saída
(Jest e Vitest: *"No tests found"*; pytest: *"no tests ran"*). Se o seu app ainda não tem:

- configure o linter da stack (tabela do passo 1);
- escreva **pelo menos 1 teste de fumaça**: um teste simples que chama uma função real do
  seu app (um cálculo, uma validação) e confere o resultado. Mais testes de regra de
  negócio contam mais na avaliação. Teste funções, não telas: é mais fácil e mais estável.

Modelos prontos para copiar, com uma linha a ajustar:

| Stack | Modelo | Instalar |
|---|---|---|
| Node com Jest (`require`) | [fumaca-jest.test.js](modelos/testes/fumaca-jest.test.js) | `npm install --save-dev jest`; script `"test": "jest"` |
| Node com Vitest (`import`) | [fumaca-vitest.test.js](modelos/testes/fumaca-vitest.test.js) | `npm install --save-dev vitest @vitest/coverage-v8`; script `"test": "vitest run"` |
| Python | [test_fumaca.py](modelos/testes/test_fumaca.py) | já vem no `ci-python.yml`; crie `__init__.py` na pasta do código |
| Java Maven | [FumacaTest.java](modelos/testes/FumacaTest.java) | dependência `org.junit.jupiter:junit-jupiter` (scope `test`) |

### Quality gate de cobertura (PGC 5.3: mínimo de 60%, opcional nesta aula)

Com poucos testes, a cobertura provavelmente fica abaixo de 60%. Nesta aula o limite é
**opcional**; se não chegar lá, siga o parágrafo "Seu projeto está abaixo de 60%?" no fim
desta seção. No Python, troque o `--cov-fail-under=60` do `ci.yml` pelo valor atual.

O limite fica na configuração do runner de testes, não no YAML:

**Jest** (`package.json`), igual a [api/package.json](../../api/package.json):

```json
"jest": {
  "coverageThreshold": { "global": { "lines": 60 } }
}
```

**Vitest** (`vite.config.js`), igual a [web/vite.config.js](../../web/vite.config.js):

```js
test: {
  coverage: { provider: 'v8', thresholds: { lines: 60 } },
}
```

**pytest**: já vem no modelo (`--cov-fail-under=60`).

**Java Maven**: dentro de `<build><plugins>` do `pom.xml`:

```xml
<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <version>0.8.12</version>
  <executions>
    <execution>
      <id>preparar</id>
      <goals><goal>prepare-agent</goal></goals>
    </execution>
    <execution>
      <id>quality-gate</id>
      <phase>verify</phase>
      <goals><goal>check</goal></goals>
      <configuration>
        <rules>
          <rule>
            <element>BUNDLE</element>
            <limits>
              <limit>
                <counter>LINE</counter>
                <value>COVEREDRATIO</value>
                <minimum>0.60</minimum>
              </limit>
            </limits>
          </rule>
        </rules>
      </configuration>
    </execution>
  </executions>
</plugin>
```

**Seu projeto está abaixo de 60%?** Configure o limite com o valor atual (arredondado para
baixo) e abra uma Issue *"Elevar cobertura para 60%"* com um prazo. Desvio registrado e com
plano é Gestão de Configuração; limite escondido não é.

## 4. Primeiro PR: o próprio pipeline

Como a `main` está protegida, o CI entra por Pull Request:

1. Crie uma Issue *"Configurar CI"* e uma branch `feature/<numero-da-issue>-ci`.
2. Copie o modelo para `.github/workflows/ci.yml` e ajuste as linhas `# <-- AJUSTE`.
3. Copie **sem alterações** [.github/workflows/pr-titulo.yml](../../.github/workflows/pr-titulo.yml)
   para a mesma pasta. Ele valida se o título do PR segue Conventional Commits.
4. Abra o PR com título no padrão, por exemplo `ci: adiciona pipeline de integração contínua`,
   e escreva `Closes #<numero>` na descrição.
5. Acompanhe na aba **Checks** do PR. Ficou vermelho? Clique em **Details**, ache o passo que
   falhou, corrija na mesma branch e envie de novo.

## 5. Checks obrigatórios

Depois que os checks rodarem uma vez, volte em **Settings → Branches → regra da `main`**:

- [ ] **Require status checks to pass before merging**
- [ ] *Require branches to be up to date before merging*
- [ ] Pesquise e adicione **`ci-ok`** e **`titulo-pr`**, somente esses dois

Não marque `qualidade` nem `dependencias`. Se um deles não rodar (o `dependencias`, por
exemplo, não roda em execuções manuais), o PR fica travado para sempre esperando por ele.

## 6. Quebre o pipeline de propósito

Ainda com o PR aberto, provoque **três** falhas, uma de cada vez, e corrija cada uma:

| Provoque | Check que deve falhar |
|---|---|
| Mude o título do PR para `ajustes` | `titulo-pr` |
| Deixe uma variável declarada e não usada | `qualidade` → Lint |
| Mude o valor esperado no seu teste (ex.: `5` vira `6`) | `qualidade` → Testes |

Guarde o link de cada execução que falhou (aba **Actions**): são evidências da entrega.

## 7. Revisão e merge

1. Peça a revisão ao seu par (**Reviewers**, à direita no PR).
2. O par revisa com o checklist do template, deixa **pelo menos um comentário** em uma linha
   do código e aprova (**Review changes → Approve**).
3. Você responde ao comentário e faz o **Squash and merge**.
4. Confira em **Commits** da `main` que a mensagem é exatamente o título do PR.

Faça o mesmo papel no repositório do seu par.

## Para discutir

O título do PR virou a mensagem do commit na `main`. Na Aula 3, o pipeline vai usar essa
mensagem para decidir a próxima versão. O que acontece se alguém aprovar um PR com o título
`feat: corrige botão`, que na verdade é uma correção?

---

## Entrega

1. Link do PR que adicionou o CI (mesclado).
2. Links das três execuções que falharam de propósito.
3. Link de um PR que você revisou no repositório do seu par.

## Critérios de conferência

- [ ] `ci.yml` com lint, testes, quality gate de cobertura e análise de dependências.
- [ ] `pr-titulo.yml` presente e funcionando.
- [ ] `ci-ok` e `titulo-pr` obrigatórios na proteção da `main`.
- [ ] Pelo menos 1 teste passando (de fumaça ou de regra de negócio); limite de 60% configurado, ou Issue registrando o desvio.
- [ ] Três falhas provocadas e corrigidas, com links.
- [ ] PR revisado pelo par, com comentário respondido, e mesclado por squash.
- [ ] Revisão feita no repositório do par.

## Problemas comuns

| Sintoma | Causa e solução |
|---|---|
| PR preso em *Expected — Waiting for status to be reported* | marcou como obrigatório um check que não rodou; deixe só `ci-ok` e `titulo-pr` |
| `ci-ok` não aparece na busca de checks | ele só existe depois de rodar uma vez; espere o primeiro PR terminar |
| `npm ci` falha: *package-lock.json not found* | rode `npm install` localmente e versione o `package-lock.json` |
| Python: `ModuleNotFoundError` nos testes | use `python -m pytest` (já está no modelo), não só `pytest` |
| `dependencias` falha: *Dependency review is not supported* | o repositório está privado; torne-o público |
| Lint reprova arquivos gerados (`dist/`, `build/`) | adicione a pasta aos `ignores` da configuração do linter |
| O ESLint reclama de `process`/`console` em `scripts/` | a configuração está só para navegador; inclua os globais do Node para essa pasta |
| *"O token '&&' não é um separador de instruções válido"* | você está no Windows PowerShell 5; use o Git Bash, ou rode um comando por linha |
| *"a execução de scripts foi desabilitada neste sistema"* ao rodar `npm` | use `npm.cmd` no lugar de `npm`, ou o Git Bash |
| `npm install` não funciona fora do laboratório (casa, trabalho) | configure o proxy dessa rede ([guia](../laboratorio-rede-restrita.md)) ou siga pelo caminho C: o CI roda os testes por você |
