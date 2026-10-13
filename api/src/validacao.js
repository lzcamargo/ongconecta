// Regras de negócio puras (sem Express) — fáceis de testar.

export const FORMAS_PAGAMENTO = ['pix', 'boleto', 'cartao', 'item'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarEmail(email) {
  return typeof email === 'string' && EMAIL_RE.test(email.trim());
}

/**
 * Valida uma doação recebida pela API.
 * @returns {string[]} lista de erros (vazia quando a doação é válida)
 */
export function validarDoacao(doacao) {
  const erros = [];
  if (!doacao || typeof doacao !== 'object') {
    return ['corpo da requisição inválido'];
  }

  const { nome, email, valor, forma } = doacao;

  if (typeof nome !== 'string' || nome.trim().length < 2) {
    erros.push('nome é obrigatório (mínimo 2 caracteres)');
  }
  if (!validarEmail(email)) {
    erros.push('e-mail inválido');
  }
  if (!FORMAS_PAGAMENTO.includes(forma)) {
    erros.push(`forma deve ser uma de: ${FORMAS_PAGAMENTO.join(', ')}`);
  }
  // Doação de itens (roupas, alimentos) não exige valor em dinheiro.
  if (forma !== 'item') {
    if (typeof valor !== 'number' || !Number.isFinite(valor) || valor <= 0) {
      erros.push('valor deve ser um número maior que zero');
    }
  }
  return erros;
}
