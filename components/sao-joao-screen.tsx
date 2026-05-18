import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FilterPillProps = { label: string; active?: boolean };
type EventItemProps = { day: string; month: string; title: string; location: string; tag: string };
type CultureCardProps = { title: string; description: string; imageUrl: string };
type NeoCardProps = {
  children: ReactNode;
  cardStyle?: object;
  wrapperStyle?: object;
  shadow?: number;
};

const filters = ['Sao Joao', 'Quadrilhas', 'Forro', 'Coco', 'Feiras'];

const events: EventItemProps[] = [
  {
    day: '20',
    month: 'Jun',
    title: 'Arraia da Estacao',
    location: 'Praca da Estacao',
    tag: 'Forro',
  },
  {
    day: '21',
    month: 'Jun',
    title: 'Noite de Forro Pe de Serra',
    location: 'Polo Multicultural',
    tag: 'Forro',
  },
  {
    day: '22',
    month: 'Jun',
    title: 'Festival de Coco',
    location: 'Alto do Cruzeiro',
    tag: 'Tradicional',
  },
];

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

function TopBar({ insetTop }: { insetTop: number }) {
  return (
    <View style={[styles.topBar, { paddingTop: insetTop + 8 }]}>
      <View style={styles.topBarContent}>
        <View style={styles.rowCenter}>
          <Pressable style={styles.iconButton}>
            <MaterialIcons name="menu" size={22} color="#D9411E" />
          </Pressable>
          <Text style={styles.brand}>Sao Joao Arcoverde</Text>
        </View>
        <Pressable style={styles.iconButton}>
          <MaterialIcons name="search" size={22} color="#D9411E" />
        </Pressable>
      </View>
      <View style={styles.flagsBar}>
        <View style={[styles.flag, { backgroundColor: '#D9411E' }]} />
        <View style={[styles.flag, { backgroundColor: '#305C9C' }]} />
        <View style={[styles.flag, { backgroundColor: '#FFB229' }]} />
        <View style={[styles.flag, { backgroundColor: '#D9411E' }]} />
        <View style={[styles.flag, { backgroundColor: '#305C9C' }]} />
      </View>
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

function EventItem({ day, month, title, location, tag }: EventItemProps) {
  return (
    <NeoCard cardStyle={styles.eventCard}>
      <View style={styles.dateBox}>
        <Text style={styles.dateDay}>{day}</Text>
        <Text style={styles.dateMonth}>{month}</Text>
      </View>
      <View style={styles.eventBody}>
        <Text style={styles.eventTitle}>{title}</Text>
        <View style={styles.rowCenter}>
          <MaterialIcons name="location-on" size={14} color="#8F7069" />
          <Text style={styles.eventLocation}>{location}</Text>
        </View>
        <Text style={styles.eventTag}>{tag}</Text>
      </View>
      <Pressable>
        <Text style={styles.eventAction}>Detalhes</Text>
      </Pressable>
    </NeoCard>
  );
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
          <EventItem key={`${event.day}-${event.title}`} {...event} />
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

function BottomNavigation() {
  const router = useRouter();

  return (
    <View style={styles.bottomNav}>
      <Pressable
        style={[styles.bottomItem, styles.bottomItemActive]}
        onPress={() => router.push('/')}
      >
        <MaterialIcons name="home" size={20} color="#FFF" />
        <Text style={styles.bottomItemActiveText}>Inicio</Text>
      </Pressable>
      <Pressable style={styles.bottomItem}>
        <MaterialIcons name="calendar-month" size={20} color="#3D2B1F" />
        <Text style={styles.bottomItemText}>Eventos</Text>
      </Pressable>
      <Pressable style={styles.bottomItem}>
        <MaterialIcons name="map" size={20} color="#3D2B1F" />
        <Text style={styles.bottomItemText}>Mapa</Text>
      </Pressable>
      <Pressable style={styles.bottomItem} onPress={() => router.push('/explore')}>
        <MaterialIcons name="more-horiz" size={20} color="#3D2B1F" />
        <Text style={styles.bottomItemText}>Mais</Text>
      </Pressable>
    </View>
  );
}

export function SaoJoaoScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.safeArea}>
      <TopBar insetTop={insets.top} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HeroCard />
        <SearchAndFilters />
        <UpcomingEvents />
        <CultureSection />
      </ScrollView>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCF9F0' },
  content: { paddingHorizontal: 20, paddingTop: 24, gap: 24, paddingBottom: 110 },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  baseCard: {
    borderWidth: 2,
    borderColor: '#000',
    position: 'relative',
    zIndex: 1,
  },

  topBar: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    minHeight: 72,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF6E2',
  },
  topBarContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    color: '#C93312',
    fontWeight: '900',
    fontSize: 25,
    letterSpacing: -0.4,
    marginLeft: 8,
  },
  flagsBar: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#FFB229',
    flexDirection: 'row',
  },
  flag: {
    width: 10,
    height: 10,
    transform: [{ rotate: '45deg' }],
    marginTop: -5,
    marginLeft: 10,
    opacity: 0.9,
  },

  sectionGap: { gap: 12 },
  kicker: { fontSize: 12, fontWeight: '700', color: '#B12401', textTransform: 'uppercase' },
  locationText: { fontSize: 14, color: '#8F7069', fontWeight: '700', marginLeft: 2 },

  heroCard: {
    backgroundColor: '#FF5A2A',
    padding: 16,
  },
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
  heroFocusIcon: {
    position: 'absolute',
    right: 8,
    bottom: 6,
    opacity: 0.12,
  },
  ctaText: { fontSize: 12, fontWeight: '900', color: '#000', textTransform: 'uppercase' },

  searchBoxWrap: {
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
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
  dateBox: {
    width: 64,
    height: 64,
    backgroundColor: '#FFB229',
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateDay: { fontSize: 20, fontWeight: '900', lineHeight: 20, color: '#000' },
  dateMonth: { fontSize: 10, fontWeight: '900', color: '#000', textTransform: 'uppercase' },
  eventBody: { flex: 1, gap: 6 },
  eventTitle: { fontSize: 16, fontWeight: '900', color: '#000' },
  eventLocation: { fontSize: 12, color: '#8F7069', marginLeft: 2 },
  eventTag: {
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
  eventAction: {
    fontSize: 11,
    color: '#000',
    fontWeight: '900',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },

  cultureList: { gap: 0, paddingRight: 8 },
  cultureCard: {
    backgroundColor: '#FFF',
  },
  cultureImage: { width: '100%', height: 128 },
  cultureBody: { padding: 12, gap: 6 },
  cultureTitle: { fontSize: 14, fontWeight: '900', color: '#000' },
  cultureDescription: { fontSize: 12, color: '#5B403A', lineHeight: 17 },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 2,
    borderTopColor: '#000',
    backgroundColor: '#FFF8E7',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bottomItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 70,
    gap: 2,
  },
  bottomItemActive: {
    backgroundColor: '#FF5A2A',
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 8,
  },
  bottomItemText: { fontSize: 10, color: '#000', fontWeight: '900', textTransform: 'uppercase' },
  bottomItemActiveText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
