import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EventAttractionCard } from '@/components/event-attraction-card';
import { FestaChrome } from '@/components/festa-chrome';
import { FESTA_EVENTS } from '@/constants/festa-data';

const dayFilters = ['Todos', ...Array.from(new Set(FESTA_EVENTS.map((event) => event.day)))];
const categoryFilters = ['Todos', ...Array.from(new Set(FESTA_EVENTS.map((event) => event.tag)))];

export default function EventosScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState('Todos');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredEvents = useMemo(
    () =>
      FESTA_EVENTS.filter((event) => {
        const matchesDay = selectedDay === 'Todos' || event.day === selectedDay;
        const matchesCategory = selectedCategory === 'Todos' || event.tag === selectedCategory;

        return matchesDay && matchesCategory;
      }),
    [selectedCategory, selectedDay]
  );

  const firstEvent = FESTA_EVENTS[0];

  return (
    <FestaChrome activeTab="eventos">
      <View style={styles.header}>
        <Text style={styles.kicker}>Agenda oficial</Text>
        <Text style={styles.title}>Programacao</Text>
        <Text style={styles.subtitle}>
          Filtre por dia ou ritmo e encontre rapidamente os shows, rodas e festas nos polos.
        </Text>
      </View>

      <View style={styles.featuredWrap}>
        <View pointerEvents="none" style={styles.featuredShadow} />
        <Pressable
          style={({ pressed }) => [styles.featuredCard, pressed ? styles.pressed : null]}
          onPress={() => router.push(`/evento/${firstEvent.id}`)}
        >
          <View style={styles.featuredText}>
            <Text style={styles.featuredLabel}>Proximo destaque</Text>
            <Text style={styles.featuredTitle}>{firstEvent.title}</Text>
            <View style={styles.metaRow}>
              <MaterialIcons name="schedule" size={16} color="#FFF" />
              <Text style={styles.featuredMeta}>
                {firstEvent.day} {firstEvent.month} - {firstEvent.time}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <MaterialIcons name="location-on" size={16} color="#FFF" />
              <Text style={styles.featuredMeta}>{firstEvent.location}</Text>
            </View>
          </View>
          <View style={styles.featuredIcon}>
            <MaterialIcons name="music-note" size={48} color="#000" />
          </View>
        </Pressable>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dias</Text>
          <Text style={styles.counter}>{filteredEvents.length} eventos</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipList}
        >
          {dayFilters.map((day) => (
            <FilterChip
              key={day}
              label={day === 'Todos' ? day : `${day} Jun`}
              active={selectedDay === day}
              onPress={() => setSelectedDay(day)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipList}
        >
          {categoryFilters.map((category) => (
            <FilterChip
              key={category}
              label={category}
              active={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eventos encontrados</Text>
        {filteredEvents.length > 0 ? (
          <View style={styles.list}>
            {filteredEvents.map((event) => (
              <View key={event.id} style={styles.eventWrap}>
                <View style={styles.timeColumn}>
                  <Text style={styles.time}>{event.time}</Text>
                  <View style={styles.timelineDot} />
                </View>
                <View style={styles.cardWrap}>
                  <EventAttractionCard
                    event={event}
                    onPress={() => router.push(`/evento/${event.id}`)}
                  />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <MaterialIcons name="event-busy" size={28} color="#B12401" />
            <Text style={styles.emptyTitle}>Nenhum evento nesse filtro</Text>
            <Text style={styles.emptyText}>
              Tente trocar o dia ou a categoria para ver a agenda.
            </Text>
          </View>
        )}
      </View>
    </FestaChrome>
  );
}

type FilterChipProps = {
  active: boolean;
  label: string;
  onPress: () => void;
};

function FilterChip({ active, label, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active ? styles.chipActive : styles.chipIdle,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { gap: 6 },
  kicker: { color: '#B12401', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  title: { fontSize: 34, lineHeight: 38, fontWeight: '900', color: '#000' },
  subtitle: { color: '#5B403A', fontSize: 14, lineHeight: 20, fontWeight: '600' },
  pressed: { transform: [{ translateY: 1 }] },

  featuredWrap: { marginRight: 8, marginBottom: 8 },
  featuredShadow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: -8,
    bottom: -8,
    backgroundColor: '#000',
  },
  featuredCard: {
    minHeight: 156,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#D9411E',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  featuredText: { flex: 1, gap: 8 },
  featuredLabel: { color: '#FFE07A', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  featuredTitle: { color: '#FFF', fontSize: 26, lineHeight: 30, fontWeight: '900' },
  featuredMeta: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  featuredIcon: {
    width: 72,
    height: 72,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFB229',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-6deg' }],
  },

  section: { gap: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#000' },
  counter: { fontSize: 12, color: '#8F7069', fontWeight: '900', textTransform: 'uppercase' },
  chipList: { gap: 8, paddingRight: 8 },
  chip: {
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipIdle: { backgroundColor: '#FFF' },
  chipActive: { backgroundColor: '#FF5A2A' },
  chipText: { color: '#000', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  chipTextActive: { color: '#FFF' },

  list: { gap: 10, paddingBottom: 24 },
  eventWrap: { flexDirection: 'row', alignItems: 'stretch', gap: 10 },
  timeColumn: { width: 48, alignItems: 'center', paddingTop: 12 },
  time: { color: '#B12401', fontSize: 12, fontWeight: '900' },
  timelineDot: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFB229',
    marginTop: 8,
  },
  cardWrap: { flex: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  emptyCard: {
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFF',
    padding: 16,
    gap: 8,
  },
  emptyTitle: { color: '#000', fontSize: 18, fontWeight: '900' },
  emptyText: { color: '#5B403A', fontSize: 14, lineHeight: 20 },
});
