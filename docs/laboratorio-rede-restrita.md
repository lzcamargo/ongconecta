# Trabalhando na rede restrita do laboratório

A rede do laboratório usa proxy/firewall. Isso **não impede o CI/CD**: build,
testes, análise de dependências e deploy rodam nos servidores do GitHub
(runners), que têm acesso livre à internet. Na máquina do laboratório você só
precisa de **HTTPS (porta 443) para github.com**.

## 1. Descubra o que a sua máquina acessa

```bash
node scripts/diagnostico-rede.mjs
```

O script testa GitHub, npm, Codespaces, GitHub Pages, Expo e as portas de SSH,
e diz qual dos caminhos abaixo usar. Não precisa de `npm install`.

## 2. Escolha o caminho de trabalho

| Caminho | Quando usar | O que você faz localmente | O que o GitHub faz |
|---|---|---|---|
| **A — Local completo** | npm acessível (direto ou via proxy) | clona, roda `npm test`, faz commits | CI/CD completo |
| **B — Codespaces / github.dev** | npm bloqueado, mas `github.dev` acessível | nada: edita e testa no navegador | CI/CD completo |
| **C — Só navegador** | apenas github.com acessível | edita arquivos e abre PRs pelo site | CI/CD completo — **o CI testa por você** |

O caminho C é suficiente para todos os exercícios de GCS: o pipeline é quem
garante a qualidade, não a máquina do aluno.

## 3. Configurar o proxy (caminho A)

Peça à TI o endereço do proxy (ex.: `http://proxy.instituicao.br:3128`).

**Git**

```bash
git config --global http.proxy  http://proxy.instituicao.br:3128
git config --global https.proxy http://proxy.instituicao.br:3128
# para remover depois (em casa):
git config --global --unset http.proxy
git config --global --unset https.proxy
```

**npm**

```bash
npm config set proxy       http://proxy.instituicao.br:3128
npm config set https-proxy http://proxy.instituicao.br:3128
```

Se o proxy inspeciona HTTPS e o npm reclamar de certificado
(`SELF_SIGNED_CERT_IN_CHAIN`), peça à TI o certificado raiz da instituição e use
`npm config set cafile caminho/do/certificado.pem`.
**Não use `strict-ssl=false`**: desliga a verificação de segurança.

**GitHub CLI (`gh`)** usa as variáveis de ambiente:

```powershell
# Windows PowerShell (vale só para a janela aberta)
$env:HTTPS_PROXY = "http://proxy.instituicao.br:3128"
```

```bash
# Linux / Git Bash
export HTTPS_PROXY=http://proxy.instituicao.br:3128
```

## 4. Clonar sem SSH (porta 22 costuma estar bloqueada)

Use **HTTPS**:

```bash
git clone https://github.com/<seu-usuario>/ongconecta.git
```

Na primeira operação de push, o Git Credential Manager (instalado com o Git
for Windows) abre o navegador para você entrar no GitHub. Em máquinas
compartilhadas, **saia da conta ao final da aula**:

```bash
git credential-manager github logout <seu-usuario>   # ou: Gerenciador de Credenciais do Windows
```

Alternativa, se você já usa chave SSH: SSH pela porta 443. Crie/edite `~/.ssh/config`:

```
Host github.com
  Hostname ssh.github.com
  Port 443
  User git
```

## 5. Domínios a liberar (para enviar à TI)

| Domínio | Para quê | Necessário? |
|---|---|---|
| `github.com`, `*.github.com` | site, API, gh CLI | **sim** |
| `*.githubusercontent.com` | downloads, avatares, artefatos | **sim** |
| `*.github.io` | ver o site publicado (staging/produção) | recomendado |
| `github.dev`, `*.app.github.dev` | Codespaces | recomendado |
| `registry.npmjs.org` | `npm install` local | opcional |
| `*.expo.dev`, `exp.host` | rodar o app mobile no celular | opcional |

## 6. Se `*.github.io` estiver bloqueado

O site publicado não abre na máquina do laboratório, mas o pipeline continua
funcionando. Para ver o resultado: aba **Actions** → execução do CD → seção
**Artifacts** → baixe `web-dist`, descompacte e abra `index.html`. Ou acesse
o link de staging pelo celular (rede móvel).
