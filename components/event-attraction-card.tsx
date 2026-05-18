import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { FestaEvent } from '@/constants/festa-data';

type EventAttractionCardProps = {
  event: FestaEvent;
  onPress: () => void;
};

export function EventAttractionCard({ event, onPress }: EventAttractionCardProps) {
  const shadow = 8;

  return (
    <Pressable onPress={onPress} style={{ marginRight: shadow, marginBottom: shadow }}>
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            top: shadow,
            left: shadow,
            right: -shadow,
            bottom: -shadow,
            backgroundColor: '#000',
            zIndex: 0,
          },
        ]}
      />

      <View style={styles.card}>
        <View style={styles.dateBox}>
          <Text style={styles.day}>{event.day}</Text>
          <Text style={styles.month}>{event.month}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.metaRow}>
            <MaterialIcons name="location-on" size={14} color="#8F7069" />
            <Text style={styles.meta}>{event.location}</Text>
          </View>
          <Text style={styles.tag}>{event.tag}</Text>
        </View>

        <Text style={styles.action}>Detalhes</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFF',
    position: 'relative',
    zIndex: 1,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  dateBox: {
    width: 64,
    height: 64,
    backgroundColor: '#FFB229',
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  day: { fontSize: 20, fontWeight: '900', lineHeight: 20, color: '#000' },
  month: { fontSize: 10, fontWeight: '900', color: '#000', textTransform: 'uppercase' },
  info: { flex: 1, gap: 6 },
  title: { fontSize: 16, fontWeight: '900', color: '#000' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { fontSize: 12, color: '#8F7069' },
  tag: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#0066FF',
    color: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  action: {
    fontSize: 11,
    color: '#000',
    fontWeight: '900',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
});
