import { StyleSheet, Text, View } from 'react-native';

import { FestaChrome } from '@/components/festa-chrome';

export default function MaisScreen() {
  return (
    <FestaChrome activeTab="mais">
      <Text style={styles.title}>Mais</Text>
      <View style={styles.card}>
        <Text style={styles.item}>• Perfil</Text>
        <Text style={styles.item}>• Favoritos</Text>
        <Text style={styles.item}>• Configuracoes</Text>
        <Text style={styles.item}>• Sobre o evento</Text>
      </View>
    </FestaChrome>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '900', color: '#000', marginBottom: 16 },
  card: { borderWidth: 2, borderColor: '#000', backgroundColor: '#FFF', padding: 16, gap: 10 },
  item: { fontSize: 15, color: '#111' },
});
