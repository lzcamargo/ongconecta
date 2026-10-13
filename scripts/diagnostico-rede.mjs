#!/usr/bin/env node
/* global process, console */
// Diagnóstico de rede do laboratório.
// Mostra o que a máquina consegue acessar e qual caminho de trabalho usar.
//
// Uso:  node scripts/diagnostico-rede.mjs
// Não precisa de npm install: usa só módulos nativos do Node.
//
// Se o laboratório usa proxy, defina antes (Windows PowerShell):
//   $env:HTTPS_PROXY = "http://proxy.instituicao.br:3128"
// O script avisa, mas não usa o proxy nos testes TCP (eles medem acesso direto).

import net from 'node:net';
import https from 'node:https';

const TESTES_HTTPS = [
  { nome: 'GitHub (site)', url: 'https://github.com', essencial: true },
  { nome: 'GitHub API (gh CLI)', url: 'https://api.github.com', essencial: false },
  { nome: 'Download de código (clone/zip)', url: 'https://codeload.github.com', essencial: false },
  { nome: 'GitHub Pages (ver o site publicado)', url: 'https://pages.github.com', essencial: false },
  { nome: 'Registro npm (npm install)', url: 'https://registry.npmjs.org/react', essencial: false },
  { nome: 'Codespaces / github.dev', url: 'https://github.dev', essencial: false },
  { nome: 'Expo (app mobile no celular)', url: 'https://exp.host', essencial: false },
];

const TESTES_TCP = [
  { nome: 'SSH padrão (github.com:22)', host: 'github.com', porta: 22 },
  { nome: 'SSH pela porta 443 (ssh.github.com:443)', host: 'ssh.github.com', porta: 443 },
];

function testarHttps(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 8000 }, (res) => {
      res.resume();
      resolve(res.statusCode < 500 ? 'ok' : `HTTP ${res.statusCode}`);
    });
    req.on('timeout', () => req.destroy(new Error('tempo esgotado')));
    req.on('error', (e) => resolve(e.message.slice(0, 40)));
  });
}

function testarTcp(host, porta) {
  return new Promise((resolve) => {
    const s = net.connect({ host, port: porta, timeout: 6000 });
    s.on('connect', () => { s.destroy(); resolve('ok'); });
    s.on('timeout', () => { s.destroy(); resolve('tempo esgotado'); });
    s.on('error', (e) => resolve(e.code || e.message));
  });
}

const r = {};
console.log('\nDiagnóstico de rede — ONGConecta\n');
if (process.env.HTTPS_PROXY || process.env.https_proxy) {
  console.log(`Proxy definido: ${process.env.HTTPS_PROXY || process.env.https_proxy}`);
  console.log('(os testes abaixo são de acesso direto; git/npm podem funcionar via proxy)\n');
}

for (const t of TESTES_HTTPS) {
  r[t.url] = await testarHttps(t.url);
  console.log(`${r[t.url] === 'ok' ? 'OK   ' : 'FALHA'}  ${t.nome}${r[t.url] === 'ok' ? '' : `  (${r[t.url]})`}`);
}
for (const t of TESTES_TCP) {
  r[t.nome] = await testarTcp(t.host, t.porta);
  console.log(`${r[t.nome] === 'ok' ? 'OK   ' : 'FALHA'}  ${t.nome}${r[t.nome] === 'ok' ? '' : `  (${r[t.nome]})`}`);
}

const ok = (k) => r[k] === 'ok';
console.log('\nRecomendação:');
if (!ok('https://github.com')) {
  console.log('  • github.com inacessível. Peça liberação à TI (domínios em docs/laboratorio-rede-restrita.md).');
} else {
  if (!ok('SSH padrão (github.com:22)')) {
    console.log('  • Porta 22 bloqueada: clone por HTTPS (recomendado) ou SSH pela porta 443.');
  }
  if (ok('https://registry.npmjs.org/react')) {
    console.log('  • npm acessível: dá para rodar testes localmente (Caminho A do guia).');
  } else if (ok('https://github.dev')) {
    console.log('  • npm bloqueado: use Codespaces/github.dev (Caminho B) — o CI no GitHub testa por você.');
  } else {
    console.log('  • npm e Codespaces bloqueados: edite e faça commits pelo site do GitHub (Caminho C).');
  }
  if (!ok('https://pages.github.com')) {
    console.log('  • *.github.io bloqueado: baixe o build na aba Actions (artefato web-dist) para ver o site.');
  }
}
console.log('\nO pipeline CI/CD roda nos servidores do GitHub: ele funciona mesmo que a rede local bloqueie npm.\n');
