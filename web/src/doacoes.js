// Camada de dados do frontend.
// Se VITE_API_URL estiver definida (ex.: API publicada no Render), usa a API real.
// Caso contrário, funciona em "modo demonstração", guardando as doações em memória —
// assim o site publicado no GitHub Pages funciona mesmo sem backend.

const API_URL = import.meta.env.VITE_API_URL || '';

export const FORMAS = [
  { valor: 'pix', rotulo: 'Pix' },
  { valor: 'boleto', rotulo: 'Boleto' },
  { valor: 'cartao', rotulo: 'Cartão' },
  { valor: 'item', rotulo: 'Doação de itens' },
];

export function formatarValor(valor) {
  if (valor === null || valor === undefined) return '—';
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function validarFormulario({ nome, email, valor, forma }) {
  const erros = {};
  if (!nome || nome.trim().length < 2) erros.nome = 'Informe seu nome.';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) erros.email = 'E-mail inválido.';
  if (forma !== 'item' && !(Number(valor) > 0)) erros.valor = 'Informe um valor maior que zero.';
  return erros;
}

export function criarRepositorio(fetchFn = globalThis.fetch, baseUrl = API_URL) {
  const memoria = [];

  return {
    modoDemo: !baseUrl,

    async listar() {
      if (!baseUrl) return [...memoria];
      const res = await fetchFn(`${baseUrl}/api/doacoes`);
      if (!res.ok) throw new Error('Falha ao carregar doações');
      return res.json();
    },

    async criar(doacao) {
      const corpo = {
        ...doacao,
        valor: doacao.forma === 'item' ? undefined : Number(doacao.valor),
      };
      if (!baseUrl) {
        const nova = { id: memoria.length + 1, ...corpo, valor: corpo.valor ?? null };
        memoria.push(nova);
        return nova;
      }
      const res = await fetchFn(`${baseUrl}/api/doacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
      });
      if (!res.ok) throw new Error('Falha ao registrar doação');
      return res.json();
    },
  };
}
