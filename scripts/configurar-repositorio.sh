#!/usr/bin/env bash
# Configura o repositório no GitHub conforme o PGC, usando o GitHub CLI (gh).
# Tudo aqui também pode ser feito pela interface web (veja docs/roteiro — Aula 1).
#
# Usa apenas HTTPS (porta 443) para api.github.com: funciona na rede do laboratório.
#
# Pré-requisitos:
#   - gh instalado e autenticado:  gh auth login   (escolha HTTPS)
#   - executar dentro do clone do repositório
#   - repositório PÚBLICO (no plano gratuito, Environments com aprovação
#     e GitHub Pages só funcionam em repositórios públicos)
#
# Uso:
#   bash scripts/configurar-repositorio.sh <usuario-do-dev-lider> [aprovacoes]
#
#   aprovacoes = 1 (padrão) -> equipe: todo PR precisa de 1 aprovação de OUTRA pessoa
#   aprovacoes = 0          -> aluno trabalhando sozinho (o GitHub não deixa
#                              aprovar o próprio PR; com 1, o merge fica impossível)

set -euo pipefail

LIDER="${1:?Informe o usuário GitHub do Desenvolvedor Líder}"
APROVACOES="${2:-1}"
REPO=$(gh repo view --json nameWithOwner --jq .nameWithOwner)

echo "Configurando $REPO (líder: $LIDER, aprovações por PR: $APROVACOES)"
echo

passo() { echo "==> $1"; }

# 1. Merge apenas por squash: o título do PR vira o commit na main (Conventional Commits).
passo "Merge somente por squash, título do PR como mensagem, apagar branch após merge"
gh api -X PATCH "repos/$REPO" \
  -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false \
  -f squash_merge_commit_title=PR_TITLE -f squash_merge_commit_message=PR_BODY \
  -F delete_branch_on_merge=true > /dev/null

# 2. Habilitar Actions (em forks elas vêm DESLIGADAS por padrão).
passo "Habilitando GitHub Actions"
gh api -X PUT "repos/$REPO/actions/permissions" -F enabled=true -f allowed_actions=all > /dev/null

# 3. Branch gh-pages vazia + GitHub Pages servindo a partir dela.
passo "Criando branch gh-pages (se não existir) e ativando GitHub Pages"
if ! git ls-remote --exit-code --heads origin gh-pages > /dev/null 2>&1; then
  ARVORE_VAZIA=$(git hash-object -t tree /dev/null)
  COMMIT=$(git commit-tree "$ARVORE_VAZIA" -m "chore: inicia branch gh-pages")
  git push origin "$COMMIT:refs/heads/gh-pages"
fi
if gh api "repos/$REPO/pages" > /dev/null 2>&1; then
  gh api -X PUT "repos/$REPO/pages" -f 'source[branch]=gh-pages' -f 'source[path]=/' > /dev/null
else
  gh api -X POST "repos/$REPO/pages" -f 'source[branch]=gh-pages' -f 'source[path]=/' > /dev/null
fi

# 4. Environments: staging (livre) e production (aprovação do Dev. Líder).
passo "Criando Environments staging e production"
LIDER_ID=$(gh api "users/$LIDER" --jq .id)

gh api -X PUT "repos/$REPO/environments/staging" --input - > /dev/null <<JSON
{ "deployment_branch_policy": { "protected_branches": true, "custom_branch_policies": false } }
JSON

# prevent_self_review=false: permite que o líder aprove deploys que ele mesmo disparou
# (necessário em equipes pequenas e para o aluno que treina sozinho).
gh api -X PUT "repos/$REPO/environments/production" --input - > /dev/null <<JSON
{
  "wait_timer": 0,
  "prevent_self_review": false,
  "reviewers": [ { "type": "User", "id": $LIDER_ID } ],
  "deployment_branch_policy": { "protected_branches": true, "custom_branch_policies": false }
}
JSON

# 5. Proteção da main (PGC 3.3 e 5.2).
passo "Protegendo a branch main (PR obrigatório, checks ci-ok e titulo-pr)"
gh api -X PUT "repos/$REPO/branches/main/protection" --input - > /dev/null <<JSON
{
  "required_status_checks": { "strict": true, "contexts": ["ci-ok", "titulo-pr"] },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": $APROVACOES,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON

# 6. Alertas e correções automáticas do Dependabot (PGC 13).
passo "Ativando alertas e atualizações de segurança do Dependabot"
gh api -X PUT "repos/$REPO/vulnerability-alerts" > /dev/null
gh api -X PUT "repos/$REPO/automated-security-fixes" > /dev/null || \
  echo "   (atualizações automáticas de segurança: ative manualmente em Settings -> Code security)"

echo
echo "Pronto. Confira em: https://github.com/$REPO/settings"
echo "Site (após o primeiro deploy): https://${REPO%%/*}.github.io/${REPO##*/}/"
echo
echo "Atenção: os checks ci-ok e titulo-pr só aparecem para seleção depois de rodarem"
echo "pela primeira vez. Se o GitHub reclamar, abra um PR qualquer e rode o script de novo."
