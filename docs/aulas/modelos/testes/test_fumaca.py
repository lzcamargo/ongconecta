# Teste de fumaça: troque o import e a função por uma função real do seu app.
from app.util import somar


def test_funcao_principal_responde():
    assert somar(2, 3) == 5
