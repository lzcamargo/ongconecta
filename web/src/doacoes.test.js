import { criarRepositorio, formatarValor, validarFormulario } from './doacoes.js';

describe('validarFormulario', () => {
  const ok = { nome: 'Ana', email: 'ana@ong.org', valor: '10', forma: 'pix' };

  it('aceita formulário válido', () => {
    expect(validarFormulario(ok)).toEqual({});
  });

  it('exige valor quando não é doação de itens', () => {
    expect(validarFormulario({ ...ok, valor: '' }).valor).toBeDefined();
  });

  it('dispensa valor para doação de itens', () => {
    expect(validarFormulario({ ...ok, valor: '', forma: 'item' })).toEqual({});
  });

  it('rejeita e-mail inválido', () => {
    expect(validarFormulario({ ...ok, email: 'ana' }).email).toBeDefined();
  });
});

describe('formatarValor', () => {
  it('mostra traço quando não há valor', () => {
    expect(formatarValor(null)).toBe('—');
  });

  it('formata em reais', () => {
    expect(formatarValor(10)).toMatch(/R\$\s?10,00/);
  });
});

describe('criarRepositorio', () => {
  it('em modo demonstração guarda em memória', async () => {
    const repo = criarRepositorio(undefined, '');
    expect(repo.modoDemo).toBe(true);
    await repo.criar({ nome: 'Ana', email: 'a@b.c', valor: '5', forma: 'pix' });
    expect(await repo.listar()).toHaveLength(1);
  });

  it('com API configurada chama o endpoint correto', async () => {
    const fetchFalso = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    const repo = criarRepositorio(fetchFalso, 'https://api.exemplo');
    await repo.listar();
    expect(fetchFalso).toHaveBeenCalledWith('https://api.exemplo/api/doacoes');
  });

  it('propaga erro quando a API falha', async () => {
    const fetchFalso = vi.fn().mockResolvedValue({ ok: false });
    const repo = criarRepositorio(fetchFalso, 'https://api.exemplo');
    await expect(repo.criar({ forma: 'pix', valor: '1' })).rejects.toThrow();
  });
});
