import express from 'express';
import { validarDoacao } from './validacao.js';

/**
 * Cria a aplicação Express. Separada de server.js para que os testes
 * possam usá-la sem abrir uma porta de rede.
 */
export function criarApp() {
  const app = express();
  app.use(express.json());

  // CORS mínimo para o frontend publicado no GitHub Pages / Vercel.
  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  // Armazenamento em memória: suficiente para a aula (sem banco de dados).
  const doacoes = [];

  // Health check usado pelo pipeline de CD após o deploy (PGC 6.1).
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      versao: process.env.APP_VERSION || 'dev',
      commit: process.env.GIT_SHA || 'local',
    });
  });

  app.get('/api/doacoes', (req, res) => {
    res.json(doacoes);
  });

  app.post('/api/doacoes', (req, res) => {
    const erros = validarDoacao(req.body);
    if (erros.length > 0) {
      return res.status(400).json({ erros });
    }
    const { nome, email, valor, forma } = req.body;
    const nova = {
      id: doacoes.length + 1,
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      valor: forma === 'item' ? null : valor,
      forma,
      criadaEm: new Date().toISOString(),
    };
    doacoes.push(nova);
    return res.status(201).json(nova);
  });

  return app;
}
