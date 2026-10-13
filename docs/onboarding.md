# Guia de onboarding — ONGConecta

Bem-vindo(a) à squad! Este guia é suficiente para abrir seu primeiro Pull
Request sem precisar perguntar nada a ninguém (PGC 12).

## 1. Ambiente

- Node.js 22 (`node -v`)
- Git
- No laboratório: leia antes [laboratorio-rede-restrita.md](laboratorio-rede-restrita.md)

```bash
git clone https://github.com/<organizacao-ou-usuario>/ongconecta.git
cd ongconecta

cd api    && npm ci && npm test && cd ..
cd web    && npm ci && npm test && cd ..
cd mobile && npm ci && npm test && cd ..
```

Rodar localmente:

```bash
cd api && npm run dev        # http://localhost:3000/health
cd web && npm run dev        # http://localhost:5173
```

## 2. Seu primeiro Pull Request

1. Pegue uma Issue no quadro (GitHub Projects) e atribua a você.
2. Crie a branch a partir da main atualizada:
   ```bash
   git switch main && git pull
   git switch -c feature/42-cadastro-de-doacoes
   ```
3. Faça commits pequenos no padrão Conventional Commits:
   `feat(web): adiciona campo de telefone`
4. Envie e abra o PR:
   ```bash
   git push -u origin feature/42-cadastro-de-doacoes
   ```
5. **Título do PR** também em Conventional Commits — ele vira o commit na main e
   decide a próxima versão (`feat` → 1.**3**.0, `fix` → 1.2.**1**).
6. Preencha o template (Contexto / Decisão / Como testar) e peça revisão.

## 3. Lendo o resultado do pipeline

| Check | O que verifica | Se ficar vermelho |
|---|---|---|
| `titulo-pr` | título em Conventional Commits | edite o título do PR |
| `api` / `web` / `mobile` | lint, testes, cobertura ≥ 60%, vulnerabilidades críticas, build | clique em **Details** e leia o passo que falhou |
| `ci-ok` | resumo: todos os anteriores passaram ou foram pulados | veja qual job falhou acima dele |

Jobs aparecem como *skipped* quando a pasta deles não mudou — isso é normal.

## 4. Depois do merge

O CD publica em **staging** automaticamente:
`https://<usuario>.github.io/ongconecta/staging/`.
A produção espera a aprovação do Desenvolvedor Líder na aba **Actions**.

## 5. Onde pedir ajuda

- Canal do time: `<link do Discord/Slack>`
- Prazo de resposta a PRs: até 3 dias úteis (PGC 2.1)
- Produção fora do ar: marque o Desenvolvedor Líder no canal `#incidentes`
