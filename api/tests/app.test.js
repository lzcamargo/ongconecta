import request from 'supertest';
import { criarApp } from '../src/app.js';

describe('API de doações', () => {
  let app;
  beforeEach(() => {
    app = criarApp();
  });

  test('GET /health responde ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('POST /api/doacoes cria uma doação válida', async () => {
    const res = await request(app)
      .post('/api/doacoes')
      .send({ nome: 'Bruno', email: 'Bruno@Ong.org', valor: 25, forma: 'pix' });
    expect(res.status).toBe(201);
    expect(res.body.email).toBe('bruno@ong.org');

    const lista = await request(app).get('/api/doacoes');
    expect(lista.body).toHaveLength(1);
  });

  test('POST /api/doacoes rejeita doação inválida com 400', async () => {
    const res = await request(app).post('/api/doacoes').send({ nome: 'X' });
    expect(res.status).toBe(400);
    expect(res.body.erros.length).toBeGreaterThan(0);
  });

  test('OPTIONS responde 204 (CORS)', async () => {
    const res = await request(app).options('/api/doacoes');
    expect(res.status).toBe(204);
  });
});
