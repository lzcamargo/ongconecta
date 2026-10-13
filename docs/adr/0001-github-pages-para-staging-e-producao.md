# 0001 — GitHub Pages para staging e produção da web

- Status: aceito
- Data: 07/10/2026

## Contexto

O PGC (3.1) indica Vercel/Netlify para o frontend. No laboratório, cada aluno
trabalha com a própria conta GitHub e a rede é restrita; criar e conectar
contas em vários serviços externos consome a aula e depende de domínios que a
TI pode bloquear.

## Decisão

Publicar a web no **GitHub Pages**, na branch `gh-pages`:

- staging em `/<repo>/staging/`
- produção em `/<repo>/`

O build usa caminhos relativos (`base: './'` no Vite), então **o mesmo
artefato** validado em staging é promovido para produção sem recompilar (PGC 6).
O ambiente exibido na tela é detectado pela URL.

A API continua apontando para o Render (PGC 3.1), de forma **opcional**: se os
secrets `RENDER_DEPLOY_HOOK_*` não existirem, o pipeline pula o passo e o
frontend roda em modo demonstração.

## Alternativas consideradas

- **Vercel/Netlify**: preview por PR é excelente, mas exige conta e token por
  aluno. Fica como evolução (basta trocar o passo de publicação no `cd.yml`).
- **actions/deploy-pages** (Pages via Actions): publica um site inteiro por vez,
  o que impede staging e produção conviverem no mesmo repositório.

## Consequências

- Zero contas extras: só GitHub.
- O repositório precisa ser **público** (Pages e aprovação em Environments são
  gratuitos apenas para repositórios públicos no plano Free).
- Arquivos antigos de assets se acumulam na `gh-pages` (`keep_files`); aceitável
  pelo porte do projeto.
