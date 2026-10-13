import { render, screen, fireEvent } from '@testing-library/react';
import App from './App.jsx';
import { criarRepositorio } from './doacoes.js';

describe('App', () => {
  it('registra uma doação válida e a mostra na lista', async () => {
    render(<App repositorio={criarRepositorio(undefined, '')} />);

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Carla' } });
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'carla@ong.org' } });
    fireEvent.change(screen.getByLabelText('Valor (R$)'), { target: { value: '30' } });
    fireEvent.click(screen.getByRole('button', { name: 'Doar' }));

    expect(await screen.findByText(/Obrigado!/)).toBeInTheDocument();
    expect(screen.getByText(/Carla/)).toBeInTheDocument();
  });

  it('mostra erros quando o formulário está vazio', () => {
    render(<App repositorio={criarRepositorio(undefined, '')} />);
    fireEvent.click(screen.getByRole('button', { name: 'Doar' }));
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
  });
});
