import { MaterialIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FestaChrome } from '@/components/festa-chrome';

type MapPoint = {
  id: string;
  name: string;
  category: 'Palco' | 'Comida' | 'Apoio' | 'Turismo';
  description: string;
  distance: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  left: `${number}%`;
  top: `${number}%`;
};

const MAP_POINTS: MapPoint[] = [
  {
    id: 'praca-estacao',
    name: 'Praca da Estacao',
    category: 'Palco',
    description: 'Palco principal, abertura do arraia e maior fluxo de shows.',
    distance: 'Centro',
    icon: 'festival',
    left: '18%',
    top: '28%',
  },
  {
    id: 'polo-multicultural',
    name: 'Polo Multicultural',
    category: 'Palco',
    description: 'Programacao regional, forro pe de serra e apresentacoes especiais.',
    distance: '8 min a pe',
    icon: 'music-note',
    left: '62%',
    top: '36%',
  },
  {
    id: 'alto-cruzeiro',
    name: 'Alto do Cruzeiro',
    category: 'Turismo',
    description: 'Vista da cidade e encontros de grupos tradicionais de coco.',
    distance: '12 min a pe',
    icon: 'terrain',
    left: '42%',
    top: '68%',
  },
  {
    id: 'feira-gastronomica',
    name: 'Feira Gastronomica',
    category: 'Comida',
    description: 'Comidas tipicas, milho, bolos, bebidas e artesanato local.',
    distance: 'Ao lado da praca',
    icon: 'restaurant',
    left: '30%',
    top: '48%',
  },
  {
    id: 'posto-apoio',
    name: 'Posto de Apoio',
    category: 'Apoio',
    description: 'Informacoes, saude, seguranca e achados e perdidos.',
    distance: 'Proximo aos polos',
    icon: 'health-and-safety',
    left: '72%',
    top: '60%',
  },
];

const categories = ['Todos', 'Palco', 'Comida', 'Apoio', 'Turismo'];

export default function MapaScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedPointId, setSelectedPointId] = useState(MAP_POINTS[0].id);

  const filteredPoints = useMemo(
    () =>
      MAP_POINTS.filter(
        (point) => selectedCategory === 'Todos' || point.category === selectedCategory
      ),
    [selectedCategory]
  );

  const selectedPoint =
    MAP_POINTS.find((point) => point.id === selectedPointId) ?? filteredPoints[0] ?? MAP_POINTS[0];

  return (
    <FestaChrome activeTab="mapa">
      <View style={styles.header}>
        <Text style={styles.kicker}>Localize-se</Text>
        <Text style={styles.title}>Mapa do Sao Joao</Text>
        <Text style={styles.subtitle}>
          Pontos principais, polos e servicos em uma visao simples para usar mesmo sem internet.
        </Text>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusIcon}>
          <MaterialIcons name="offline-bolt" size={22} color="#000" />
        </View>
        <View style={styles.statusTextWrap}>
          <Text style={styles.statusTitle}>Mapa offline disponivel</Text>
          <Text style={styles.statusText}>
            Marcadores e referencias carregam a partir dos dados locais.
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
      >
        {categories.map((category) => (
          <MapFilter
            key={category}
            label={category}
            active={selectedCategory === category}
            onPress={() => {
              setSelectedCategory(category);
              const nextPoint = MAP_POINTS.find(
                (point) => category === 'Todos' || point.category === category
              );
              if (nextPoint) {
                setSelectedPointId(nextPoint.id);
              }
            }}
          />
        ))}
      </ScrollView>

      <View style={styles.mapWrap}>
        <View pointerEvents="none" style={styles.mapShadow} />
        <View style={styles.mapCanvas}>
          <View style={[styles.routeLine, styles.routeLineOne]} />
          <View style={[styles.routeLine, styles.routeLineTwo]} />
          <View style={[styles.routeLine, styles.routeLineThree]} />

          <View style={[styles.mapZone, styles.zoneOne]}>
            <Text style={styles.zoneText}>Centro</Text>
          </View>
          <View style={[styles.mapZone, styles.zoneTwo]}>
            <Text style={styles.zoneText}>Cultura</Text>
          </View>

          {filteredPoints.map((point) => (
            <Pressable
              key={point.id}
              onPress={() => setSelectedPointId(point.id)}
              style={[
                styles.marker,
                { left: point.left, top: point.top },
                selectedPoint.id === point.id ? styles.markerActive : null,
              ]}
            >
              <MaterialIcons
                name={point.icon}
                size={18}
                color={selectedPoint.id === point.id ? '#FFF' : '#000'}
              />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.detailHeader}>
          <View style={styles.detailIcon}>
            <MaterialIcons name={selectedPoint.icon} size={24} color="#000" />
          </View>
          <View style={styles.detailTextWrap}>
            <Text style={styles.detailCategory}>{selectedPoint.category}</Text>
            <Text style={styles.detailTitle}>{selectedPoint.name}</Text>
          </View>
        </View>
        <Text style={styles.detailDescription}>{selectedPoint.description}</Text>
        <View style={styles.detailMeta}>
          <MaterialIcons name="directions-walk" size={16} color="#8F7069" />
          <Text style={styles.detailMetaText}>{selectedPoint.distance}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pontos no mapa</Text>
        <View style={styles.pointList}>
          {filteredPoints.map((point) => (
            <Pressable
              key={point.id}
              onPress={() => setSelectedPointId(point.id)}
              style={({ pressed }) => [
                styles.pointRow,
                selectedPoint.id === point.id ? styles.pointRowActive : null,
                pressed ? styles.pressed : null,
              ]}
            >
              <View style={styles.pointIcon}>
                <MaterialIcons name={point.icon} size={18} color="#000" />
              </View>
              <View style={styles.pointInfo}>
                <Text style={styles.pointName}>{point.name}</Text>
                <Text style={styles.pointDescription}>
                  {point.category} - {point.distance}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#3D2B1F" />
            </Pressable>
          ))}
        </View>
      </View>
    </FestaChrome>
  );
}

type MapFilterProps = {
  active: boolean;
  label: string;
  onPress: () => void;
};

function MapFilter({ active, label, onPress }: MapFilterProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.filter,
        active ? styles.filterActive : styles.filterIdle,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.filterText, active ? styles.filterTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { gap: 6 },
  kicker: { color: '#B12401', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  title: { fontSize: 34, lineHeight: 38, fontWeight: '900', color: '#000' },
  subtitle: { color: '#5B403A', fontSize: 14, lineHeight: 20, fontWeight: '600' },
  pressed: { transform: [{ translateY: 1 }] },

  statusCard: {
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFE07A',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTextWrap: { flex: 1, gap: 2 },
  statusTitle: { color: '#000', fontSize: 14, fontWeight: '900' },
  statusText: { color: '#3D2B1F', fontSize: 12, lineHeight: 17, fontWeight: '700' },

  filterList: { gap: 8, paddingRight: 8 },
  filter: {
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterIdle: { backgroundColor: '#FFF' },
  filterActive: { backgroundColor: '#FF5A2A' },
  filterText: { color: '#000', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  filterTextActive: { color: '#FFF' },

  mapWrap: { marginRight: 8, marginBottom: 8 },
  mapShadow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: -8,
    bottom: -8,
    backgroundColor: '#000',
  },
  mapCanvas: {
    height: 280,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#F4E8C8',
    overflow: 'hidden',
  },
  routeLine: {
    position: 'absolute',
    height: 18,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFF6E2',
  },
  routeLineOne: { width: 320, left: -40, top: 88, transform: [{ rotate: '-12deg' }] },
  routeLineTwo: { width: 360, left: 18, top: 164, transform: [{ rotate: '24deg' }] },
  routeLineThree: { width: 220, right: -36, top: 52, transform: [{ rotate: '54deg' }] },
  mapZone: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFB229',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  zoneOne: { left: 14, bottom: 16 },
  zoneTwo: { right: 14, top: 16, backgroundColor: '#305C9C' },
  zoneText: { color: '#000', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  marker: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -21 }, { translateY: -21 }, { rotate: '45deg' }],
  },
  markerActive: { backgroundColor: '#D9411E' },

  detailCard: {
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFF',
    padding: 14,
    gap: 12,
  },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailIcon: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFB229',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTextWrap: { flex: 1 },
  detailCategory: { color: '#B12401', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  detailTitle: { color: '#000', fontSize: 20, lineHeight: 24, fontWeight: '900' },
  detailDescription: { color: '#3D2B1F', fontSize: 14, lineHeight: 20, fontWeight: '600' },
  detailMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailMetaText: { color: '#8F7069', fontSize: 13, fontWeight: '800' },

  section: { gap: 12, paddingBottom: 24 },
  sectionTitle: { color: '#000', fontSize: 22, fontWeight: '900' },
  pointList: { gap: 8 },
  pointRow: {
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFF',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pointRowActive: { backgroundColor: '#FFF6E2' },
  pointIcon: {
    width: 38,
    height: 38,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFE07A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointInfo: { flex: 1, gap: 2 },
  pointName: { color: '#000', fontSize: 15, fontWeight: '900' },
  pointDescription: { color: '#8F7069', fontSize: 12, fontWeight: '800' },
});
