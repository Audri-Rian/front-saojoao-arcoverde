import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ReactNode } from 'react';

import { EventAttractionCard } from '@/components/event-attraction-card';
import { FestaChrome } from '@/components/festa-chrome';
import { FESTA_EVENTS, type FestaEvent } from '@/constants/festa-data';

type FilterPillProps = { label: string; active?: boolean };
type CultureCardProps = { title: string; description: string; imageUrl: string };
type NeoCardProps = {
  children: ReactNode;
  cardStyle?: object;
  wrapperStyle?: object;
  shadow?: number;
};

const filters = ['Sao Joao', 'Quadrilhas', 'Forro', 'Coco', 'Feiras'];

const events: FestaEvent[] = FESTA_EVENTS;

const cultureCards: CultureCardProps[] = [
  {
    title: 'Raizes do Sertao',
    description: 'Conheca a historia dos mestres do Coco de Arcoverde.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCV-Spnx2S-mQzQWdOFlwPWY7cokM8B0QEqhVjhSUP9nHlFgk39sQmmiF9vznpsLkDSSZ2lflcmae90KxhkGENRt9cndgHFLfriqkARnF7e2JBkL2CS-S8-7QZNOLTGbc47V5N3LTTL7Zl7VMW3Uar05M8__IafVAdpmUBzEUAvg7Fy5248fg1xQJsKCholu29fSeNLA6stNocue7g-7urm7NDBXpHyK194JWtVO-yip5u0kZmGUacu5oblnvURvcs85ECj8Cu0JA',
  },
  {
    title: 'Artesanato Local',
    description: 'Onde encontrar as melhores pecas em madeira e couro.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDzRfuqmRnOv8C4XBswt3q97_U2rHFGFlCDjaogrO1ZF4c9-KKvX4fp16q0sG39neBorf6uxyEiuGj3efRpbRXuL6I14BDASCJAw7VCwZumMvY5zIBb-VVpy0vQHsSuA1YYZc3n_V8sUBJPBFDwWGAA87EoigsllPFfD4_LIGXV0r4LmAkBTzp3DF_D6k2xhtkeMXFdCYWQicMpNnzLRpsVAHpRJfVGIWTQmBfMj43s46xCPXGh0e3fnCAHctTc1dOcDaPML2Grlw',
  },
];

function NeoCard({ children, cardStyle, wrapperStyle, shadow = 8 }: NeoCardProps) {
  return (
    <View style={[{ marginRight: shadow, marginBottom: shadow }, wrapperStyle]}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: shadow,
          left: shadow,
          right: -shadow,
          bottom: -shadow,
          backgroundColor: '#000',
          zIndex: 0,
        }}
      />
      <View style={[styles.baseCard, cardStyle]}>{children}</View>
    </View>
  );
}

function HeroCard() {
  return (
    <View style={styles.sectionGap}>
      <View>
        <Text style={styles.kicker}>Viva a cultura do sertao</Text>
        <View style={styles.rowCenter}>
          <MaterialIcons name="location-on" size={16} color="#8F7069" />
          <Text style={styles.locationText}>Arcoverde - PE</Text>
        </View>
      </View>

      <NeoCard cardStyle={styles.heroCard}>
        <View style={styles.heroFocusIcon}>
          <MaterialIcons name="whatshot" size={104} color="#000" />
        </View>
        <Text style={styles.heroTitle}>Sao Joao na Praca</Text>
        <Text style={styles.heroDescription}>
          Shows, comidas tipicas, coco e quadrilhas nesta semana.
        </Text>
        <Pressable style={styles.ctaButton}>
          <Text style={styles.ctaText}>Ver evento</Text>
        </Pressable>
      </NeoCard>
    </View>
  );
}

function SearchAndFilters() {
  return (
    <View style={styles.sectionGap}>
      <NeoCard cardStyle={styles.searchBoxWrap}>
        <MaterialIcons name="search" size={20} color="#3D2B1F" style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar festas, shows ou tradicoes"
          placeholderTextColor="#5B403A"
          style={styles.searchInput}
        />
      </NeoCard>
    </View>
  );
}

function FilterPill({ label, active }: FilterPillProps) {
  return (
    <Pressable
      style={[styles.filterPill, active ? styles.filterPillActive : styles.filterPillIdle]}
    >
      <Text style={[styles.filterPillText, active ? styles.filterPillTextActive : undefined]}>
        {label}
      </Text>
    </Pressable>
  );
}

function EventItem({ event }: { event: FestaEvent }) {
  const router = useRouter();

  return <EventAttractionCard event={event} onPress={() => router.push(`/evento/${event.id}`)} />;
}

function UpcomingEvents() {
  return (
    <View style={styles.sectionGap}>
      <Text style={styles.sectionTitle}>Categorias</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
      >
        {filters.map((filter, index) => (
          <FilterPill key={filter} label={filter} active={index === 0} />
        ))}
      </ScrollView>
      <Text style={styles.sectionTitle}>Proximos eventos</Text>
      <View style={styles.listGap}>
        {events.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </View>
    </View>
  );
}

function CultureCard({ title, description, imageUrl }: CultureCardProps) {
  return (
    <NeoCard cardStyle={styles.cultureCard} wrapperStyle={{ width: 256 }}>
      <Image source={{ uri: imageUrl }} style={styles.cultureImage} contentFit="cover" />
      <View style={styles.cultureBody}>
        <Text style={styles.cultureTitle}>{title}</Text>
        <Text style={styles.cultureDescription}>{description}</Text>
      </View>
    </NeoCard>
  );
}

function CultureSection() {
  return (
    <View style={styles.sectionGap}>
      <Text style={styles.sectionTitle}>Destaques da regiao</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cultureList}
      >
        {cultureCards.map((card) => (
          <CultureCard key={card.title} {...card} />
        ))}
      </ScrollView>
    </View>
  );
}

export function SaoJoaoScreen() {
  return (
    <FestaChrome activeTab="inicio">
      <HeroCard />
      <SearchAndFilters />
      <UpcomingEvents />
      <CultureSection />
    </FestaChrome>
  );
}

const styles = StyleSheet.create({
  baseCard: { borderWidth: 2, borderColor: '#000', position: 'relative', zIndex: 1 },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 4 },

  sectionGap: { gap: 12 },
  kicker: { fontSize: 12, fontWeight: '700', color: '#B12401', textTransform: 'uppercase' },
  locationText: { fontSize: 14, color: '#8F7069', fontWeight: '700', marginLeft: 2 },

  heroCard: { backgroundColor: '#FF5A2A', padding: 16 },
  heroTitle: { color: '#FFF', fontSize: 34, lineHeight: 37, fontWeight: '800', marginBottom: 6 },
  heroDescription: {
    color: '#FFF',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
    maxWidth: '76%',
  },
  ctaButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFE07A',
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  heroFocusIcon: { position: 'absolute', right: 8, bottom: 6, opacity: 0.12 },
  ctaText: { fontSize: 12, fontWeight: '900', color: '#000', textTransform: 'uppercase' },

  searchBoxWrap: { backgroundColor: '#FFF', justifyContent: 'center' },
  searchIcon: { position: 'absolute', left: 12, zIndex: 1 },
  searchInput: {
    paddingVertical: 14,
    paddingLeft: 40,
    paddingRight: 12,
    fontSize: 16,
    color: '#3D2B1F',
  },

  sectionTitle: { fontSize: 24, fontWeight: '900', color: '#000' },
  filterList: { gap: 8, paddingRight: 8 },
  filterPill: {
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF',
  },
  filterPillActive: { backgroundColor: '#FF5A2A' },
  filterPillIdle: { backgroundColor: '#FFF' },
  filterPillText: { fontSize: 12, fontWeight: '900', color: '#000', textTransform: 'uppercase' },
  filterPillTextActive: { color: '#FFF' },

  listGap: { gap: 12 },
  eventCard: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },

  cultureList: { gap: 0, paddingRight: 8 },
  cultureCard: { backgroundColor: '#FFF' },
  cultureImage: { width: '100%', height: 128 },
  cultureBody: { padding: 12, gap: 6 },
  cultureTitle: { fontSize: 14, fontWeight: '900', color: '#000' },
  cultureDescription: { fontSize: 12, color: '#5B403A', lineHeight: 17 },
});
