import { StatusBar } from 'expo-status-bar';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {
  CAMPANHAS_EXEMPLO,
  ordenarPorUrgencia,
  percentualArrecadado,
} from './src/campanhas';

export default function App() {
  const campanhas = ordenarPorUrgencia(CAMPANHAS_EXEMPLO);

  return (
    <SafeAreaView style={estilos.tela}>
      <Text style={estilos.titulo}>ONGConecta</Text>
      <Text style={estilos.subtitulo}>Campanhas abertas</Text>
      <FlatList
        data={campanhas}
        keyExtractor={(c) => String(c.id)}
        renderItem={({ item }) => {
          const pct = percentualArrecadado(item.arrecadado, item.meta);
          return (
            <View style={estilos.cartao}>
              <Text style={estilos.nome}>{item.titulo}</Text>
              <View style={estilos.barraFundo}>
                <View style={[estilos.barra, { width: `${pct}%` }]} />
              </View>
              <Text>{pct}% da meta · prazo {item.prazo}</Text>
            </View>
          );
        }}
      />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#f7f6f2', padding: 16 },
  titulo: { fontSize: 28, fontWeight: '700', color: '#2f6f4f', marginTop: 24 },
  subtitulo: { fontSize: 16, marginBottom: 12 },
  cartao: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 10 },
  nome: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  barraFundo: { height: 8, backgroundColor: '#e3e0d6', borderRadius: 4, marginBottom: 6 },
  barra: { height: 8, backgroundColor: '#2f6f4f', borderRadius: 4 },
});
