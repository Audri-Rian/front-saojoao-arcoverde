import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { FESTA_EVENTS } from '@/constants/festa-data';

export default function EventoDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = FESTA_EVENTS.find((item) => item.id === id);

  if (!event) {
    return (
      <View style={styles.page}>
        <Text style={styles.title}>Evento nao encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <Text style={styles.title}>{event.title}</Text>
      <View style={styles.card}>
        <Text style={styles.meta}>
          {event.day} {event.month} • {event.time}
        </Text>
        <Text style={styles.meta}>{event.location}</Text>
        <Text style={styles.tag}>{event.tag}</Text>
        <Text style={styles.description}>{event.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#FCF9F0', padding: 20, paddingTop: 42 },
  title: { fontSize: 28, fontWeight: '900', color: '#000', marginBottom: 16 },
  card: { borderWidth: 2, borderColor: '#000', backgroundColor: '#FFF', padding: 16, gap: 8 },
  meta: { fontSize: 14, color: '#222' },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#0066FF',
    color: '#FFF',
    fontWeight: '800',
    fontSize: 10,
    textTransform: 'uppercase',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  description: { fontSize: 15, color: '#111', lineHeight: 22, marginTop: 4 },
});
