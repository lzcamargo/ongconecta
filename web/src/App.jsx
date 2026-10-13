import { useEffect, useMemo, useState } from 'react';
import { FORMAS, criarRepositorio, formatarValor, validarFormulario } from './doacoes.js';
import { detectarAmbiente } from './ambiente.js';

const VAZIO = { nome: '', email: '', valor: '', forma: 'pix' };
const VERSAO = import.meta.env.VITE_APP_VERSION || 'dev';
const AMBIENTE = detectarAmbiente();

export default function App({ repositorio }) {
  const repo = useMemo(() => repositorio || criarRepositorio(), [repositorio]);
  const [form, setForm] = useState(VAZIO);
  const [erros, setErros] = useState({});
  const [doacoes, setDoacoes] = useState([]);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    repo.listar().then(setDoacoes).catch(() => setMensagem('Não foi possível carregar as doações.'));
  }, [repo]);

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function enviar(e) {
    e.preventDefault();
    const encontrados = validarFormulario(form);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) return;
    try {
      const nova = await repo.criar(form);
      setDoacoes((atual) => [...atual, nova]);
      setForm(VAZIO);
      setMensagem('Obrigado! Doação registrada.');
    } catch {
      setMensagem('Erro ao registrar a doação. Tente novamente.');
    }
  }

  return (
    <main>
      <header>
        <h1>ONGConecta</h1>
        <p className="ambiente">
          Ambiente: <strong>{AMBIENTE}</strong> · versão {VERSAO}
          {repo.modoDemo && ' · modo demonstração'}
        </p>
      </header>

      <section>
        <h2>Registrar doação</h2>
        <form onSubmit={enviar} noValidate>
          <label>
            Nome
            <input name="nome" value={form.nome} onChange={alterar} />
          </label>
          {erros.nome && <span role="alert">{erros.nome}</span>}

          <label>
            E-mail
            <input name="email" type="email" value={form.email} onChange={alterar} />
          </label>
          {erros.email && <span role="alert">{erros.email}</span>}

          <label>
            Forma
            <select name="forma" value={form.forma} onChange={alterar}>
              {FORMAS.map((f) => (
                <option key={f.valor} value={f.valor}>
                  {f.rotulo}
                </option>
              ))}
            </select>
          </label>

          {form.forma !== 'item' && (
            <label>
              Valor (R$)
              <input name="valor" type="number" min="1" value={form.valor} onChange={alterar} />
            </label>
          )}
          {erros.valor && <span role="alert">{erros.valor}</span>}

          <button type="submit">Doar</button>
        </form>
        {mensagem && <p className="mensagem">{mensagem}</p>}
      </section>

      <section>
        <h2>Doações recebidas ({doacoes.length})</h2>
        <ul>
          {doacoes.map((d) => (
            <li key={d.id}>
              {d.nome} — {formatarValor(d.valor)} ({d.forma})
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
