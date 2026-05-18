import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { EventAttractionCard } from '@/components/event-attraction-card';
import { FestaChrome } from '@/components/festa-chrome';
import { FESTA_EVENTS } from '@/constants/festa-data';

export default function EventosScreen() {
  const router = useRouter();

  return (
    <FestaChrome activeTab="eventos">
      <Text style={styles.title}>Programacao de Eventos</Text>
      <View style={styles.list}>
        {FESTA_EVENTS.map((event) => (
          <EventAttractionCard
            key={event.id}
            event={event}
            onPress={() => router.push(`/evento/${event.id}`)}
          />
        ))}
      </View>
    </FestaChrome>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '900', color: '#000', marginBottom: 16 },
  list: { gap: 4, paddingBottom: 24 },
});
