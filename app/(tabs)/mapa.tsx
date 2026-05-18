import { StyleSheet, Text, View } from 'react-native';

import { FestaChrome } from '@/components/festa-chrome';

export default function MapaScreen() {
  return (
    <FestaChrome activeTab="mapa">
      <Text style={styles.title}>Mapa do Sao Joao</Text>
      <View style={styles.mapMock}>
        <Text style={styles.mapLabel}>Pontos principais</Text>
        <Text style={styles.item}>• Praca da Estacao</Text>
        <Text style={styles.item}>• Polo Multicultural</Text>
        <Text style={styles.item}>• Alto do Cruzeiro</Text>
      </View>
    </FestaChrome>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '900', color: '#000', marginBottom: 16 },
  mapMock: { borderWidth: 2, borderColor: '#000', backgroundColor: '#FFF', padding: 16, gap: 8 },
  mapLabel: { fontSize: 16, fontWeight: '900' },
  item: { fontSize: 14, color: '#222' },
});
