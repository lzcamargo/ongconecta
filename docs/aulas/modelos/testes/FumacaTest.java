package seu.pacote; // o mesmo pacote da classe testada

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

// Teste de fumaça: troque Calculadora.somar por uma classe e um método reais do seu app.
// Requer a dependência org.junit.jupiter:junit-jupiter (scope test) no pom.xml.
class FumacaTest {
    @Test
    void funcaoPrincipalResponde() {
        assertEquals(5, Calculadora.somar(2, 3));
    }
}
