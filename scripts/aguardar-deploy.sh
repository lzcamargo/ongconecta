#!/usr/bin/env bash
# Smoke test pós-deploy (PGC 6.1: "verificação de saúde pós-deploy").
#
# O GitHub Pages leva de alguns segundos a ~2 minutos para publicar.
# Este script espera até que a página publicada contenha o arquivo JS do
# build que acabou de ser enviado — ou seja, confirma que a versão NOVA
# está no ar, e não apenas que o site responde.
#
# Uso: scripts/aguardar-deploy.sh <url> <pasta-do-build> [tentativas]

set -euo pipefail

URL="$1"
BUILD_DIR="$2"
TENTATIVAS="${3:-30}"

# Nome do bundle JS com hash, ex.: assets/index-DJwY9lO2.js
ESPERADO=$(grep -oE 'assets/index-[A-Za-z0-9_-]+\.js' "$BUILD_DIR/index.html" | head -1)
if [ -z "$ESPERADO" ]; then
  echo "::error::Não encontrei o bundle JS em $BUILD_DIR/index.html"
  exit 1
fi

echo "Aguardando $URL servir $ESPERADO ..."
for i in $(seq 1 "$TENTATIVAS"); do
  if curl -fsS --max-time 10 "$URL" 2>/dev/null | grep -q "$ESPERADO"; then
    echo "OK na tentativa $i: versão nova publicada em $URL"
    # O bundle também precisa responder (evita página quebrada).
    curl -fsS --max-time 10 -o /dev/null "${URL%/}/$ESPERADO"
    echo "Bundle JS acessível."
    exit 0
  fi
  echo "Tentativa $i/$TENTATIVAS: ainda não publicado, aguardando 10s..."
  sleep 10
done

echo "::error::A versão nova não apareceu em $URL. Verifique Settings -> Pages."
exit 1
