import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { FESTA_EVENTS } from '@/constants/festa-data';

type ArtistCard = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
};

type RelatedEventCard = {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  imageUrl: string;
};

const ARTISTS: ArtistCard[] = [
  {
    id: 'mestre-coco',
    name: 'Mestres do Coco',
    role: 'Principal',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCsUFbLYhX-hHn20mv9PdoZFsq564m_yWjC0qv2XjEkM0Q_TEJa41Ej6ofXkdeIh9Ty1OLs0aCCKtP2K_jjh2k2KSHaM9bJtP_dmW6_UyBBv78vPku3xgdkEsvaDUYSVqo0hx2brTcn8Aw59l1BumSLQEhxGZ8iALTe0QQKIwF9opqESfgwmeSPfqs3cH-oHBdQ3Fxai7athfY8lQagWHq_Uk5JZBYJfew14GG2qRxtauwPUOKuEY7x1rT-QK26Mab81TWuzTpyDso',
  },
  {
    id: 'irmas-lopes',
    name: 'Irmas Lopes',
    role: 'Convidada',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBRMeqqiNBzFyyO63dOh8BEpCHt6hZTYtfoNTWV_vQln1Qe9pWtvSnJhYky_CItfCQr8Mahsg0oUlwKZqOFiRWVH3ayYh_jMoqi47ySQqdSxBSOR0r4nmx4G1jBzCxmnF5fGbqq4M_vr_zEBkQfbm3ZKbNH1f09kBA0rRHLWmgnxAgANLMR2YL7EEd6PbjGrV9ZhXdByZ8MqKJCjd8WM8Osu6Xok1x68zbY__8Zwn5lIqOHOLVriz0gE5Rn1P0KjUoEeIhFZc08faA',
  },
  {
    id: 'trio-viva',
    name: 'Trio Forro Viva',
    role: 'Abertura',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAkPdbjxss8bvDDE8UFVsBUv9xx28yrtQ4sMBtyyEFEvZn17gz_FIKaMHvi4_QWArTWZ5WQWVkSp9b5q8IEmOrLe9usoHGxEhnbL9w56tX_gjWTfBma_Y6t0dVUr187SWASWBkq6FNgRS6wRdDoJLwWIOs7WG36pnnmPcVtuge_q2pPEBtQ6Jtw7WzvbADbrAVmF87_PYD6QB8dwNYW4WWOyTK5UG_nq3wyOudATyVkFpY8HxUP1PlOMv5Lzp6IeN0UzPjC7ew3MZU',
  },
  {
    id: 'raizes-sertao',
    name: 'Raizes do Sertao',
    role: 'Participacao',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDzRfuqmRnOv8C4XBswt3q97_U2rHFGFlCDjaogrO1ZF4c9-KKvX4fp16q0sG39neBorf6uxyEiuGj3efRpbRXuL6I14BDASCJAw7VCwZumMvY5zIBb-VVpy0vQHsSuA1YYZc3n_V8sUBJPBFDwWGAA87EoigsllPFfD4_LIGXV0r4LmAkBTzp3DF_D6k2xhtkeMXFdCYWQicMpNnzLRpsVAHpRJfVGIWTQmBfMj43s46xCPXGh0e3fnCAHctTc1dOcDaPML2Grlw',
  },
];

const RELATED_EVENTS: RelatedEventCard[] = [
  {
    id: 'orquestra-sertao',
    title: 'Orquestra Sertao',
    subtitle: 'Frevo e Forro',
    dateLabel: '23 Jun • 20:00',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD738-TyJ9oEO_i_ffMbWPQFbcfVAQbMPRslr6iJ_It5sA-gAj3xo3oZyGE0-WDFcbnjPi_YqSsOKYqxZBGaW91WEH_uR4zs3cxWEVq44CJRaU0RdCjfRQFmm9Agx2nzCAIW_aSfj-Bly59-jLfnNkXDFp5hZ3R_3nrf2fBBvZiKcOo6TgEs9ctZCv9oaZ4yabhxhkv-STigDPieUGq5h6w3DYxtE3bNVKVI-JWppjhawZ7BRSmGw-0qn287YVyPtdhYiqSu6uPbPs',
  },
  {
    id: 'quadrilha-junina',
    title: 'Quadrilha Junina',
    subtitle: 'Espetaculo Regional',
    dateLabel: '24 Jun • 19:00',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBmPLB_J6ixnxhY3uxgduOFo49e_CYVAoLK5S5a5CdE3igPBeYVveR4QhquYUABi0KWD539rfHLMMQkAg3_5TsdfLVxMPZoog9wxZkgXwvfHHstqvZyrRxKD1c49VpkXtJxrwejWjnSakYTVHOIbe9M8n072Mp8ieNbup8p60KyNM7M4Y3Lv_euIce4QuiRCJlI9UXdoSfLa2teibMTxLvD611cQ30BvxFPotEYZcLcpDpMnFZ3LrkWa8cbJPGWKIbV84bRgkRM-N0',
  },
];

export default function EventoDetalheScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = FESTA_EVENTS.find((item) => item.id === id);
  const [isFavorite, setIsFavorite] = useState(false);

  const headline = useMemo(() => {
    if (!event) return 'Evento nao encontrado';
    return `Grande Show: ${event.title}`;
  }, [event]);

  const metaDate = event ? `${event.day} ${event.month}` : '--';
  const metaTime = event?.time ?? '--';
  const tagLabel = event?.tag ?? 'Cultura Popular';
  const location = event?.location ?? 'Polo Multicultural';

  const descriptionParagraphs = event
    ? [
        event.description,
        'Venha vivenciar a batida do surdo e o balanco do ganza nesta noite historica no coracao da nossa cidade. Uma celebracao da nossa identidade que promete emocionar turistas e moradores.',
      ]
    : [
        'Este evento nao esta mais disponivel. Atualize o aplicativo para ver a programacao mais recente.',
      ];

  const handleShare = async () => {
    await Share.share({
      message: event
        ? `${event.title} - ${metaDate} as ${metaTime}, em ${location}.`
        : 'Confira a programacao do Sao Joao de Arcoverde.',
    });
  };

  if (!event) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.topBar}>
          <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#B12401" />
          </Pressable>
          <Text style={styles.topBarTitle}>Detalhes</Text>
          <View style={styles.iconButton} />
        </View>
        <View style={styles.notFoundWrap}>
          <Text style={styles.notFoundTitle}>Evento nao encontrado</Text>
          <Text style={styles.notFoundText}>
            O evento pode ter sido removido ou ainda nao foi sincronizado.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.textureGrid} />

      <View style={styles.topBar}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#B12401" />
        </Pressable>
        <Text style={styles.topBarTitle}>Detalhes</Text>
        <Pressable style={styles.iconButton} onPress={() => setIsFavorite((prev) => !prev)}>
          <MaterialIcons
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={24}
            color="#B12401"
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.buntingRow}>
          {Array.from({ length: 7 }).map((_, index) => (
            <View
              key={`b-${index}`}
              style={[
                styles.bunting,
                {
                  borderTopColor:
                    index % 3 === 0 ? '#B12401' : index % 3 === 1 ? '#FFB229' : '#305C9C',
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.heroWrap}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBxtph5bnd9zAWIjw1q7MOtWAvUcHUK8woss-vUJsCSn8Zuhbjz1TEYGRaZWBX9BK1ujSbUH0vNzXHGbimtmSzexWwy35dL3pvueYyfREE0DwhSABagU9yW5Ahuj0VDk9yGcWU9OoFuLq91iUYzKWwuNnpijMKn61VtuuIt7jGIl9YTPiY2HkRLegv1zESkgO38doIyrC-KtODJcV2JxtIyu-8THe2jhPBs7vu9_P-2Sa_V1rKg1_punRNk32-KEEENS-RAk09sdc',
              }}
              contentFit="cover"
              style={styles.heroImage}
            />
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>{tagLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.eventTitle}>{headline}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <MaterialIcons name="calendar-month" size={18} color="#815600" />
              <Text style={styles.metaChipText}>{metaDate}</Text>
            </View>
            <View style={styles.metaChip}>
              <MaterialIcons name="schedule" size={18} color="#815600" />
              <Text style={styles.metaChipText}>{metaTime}</Text>
            </View>
            <View style={styles.metaChip}>
              <MaterialIcons name="confirmation-number" size={18} color="#815600" />
              <Text style={styles.metaChipText}>Gratuito</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.alertBox}>
            <MaterialIcons name="info" size={20} color="#815600" />
            <View style={styles.alertTextWrap}>
              <Text style={styles.alertTitle}>Acessibilidade no local</Text>
              <Text style={styles.alertText}>
                Area reservada para PCD e banheiros adaptados disponiveis proximos ao palco.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionWideTop}>
          <Text style={styles.sectionTitle}>Sobre o Evento</Text>
          <View style={styles.descriptionWrap}>
            {descriptionParagraphs.map((paragraph) => (
              <Text key={paragraph} style={styles.descriptionText}>
                {paragraph}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.sectionWideTop}>
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <View>
                <Text style={styles.locationTitle}>{location}</Text>
                <Text style={styles.locationSubtitle}>Praca da Bandeira, Centro</Text>
              </View>
              <View style={styles.locationIconWrap}>
                <MaterialIcons name="location-on" size={22} color="#B12401" />
              </View>
            </View>

            <View style={styles.mapMock}>
              <View style={styles.mapTexture} />
              <View style={styles.mapPin}>
                <MaterialIcons name="location-on" size={22} color="#FFF" />
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.mapButton, pressed ? styles.buttonPressed : null]}
            >
              <MaterialIcons name="map" size={18} color="#B12401" />
              <Text style={styles.mapButtonText}>Ver no mapa</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.sectionWideTop}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Atracoes</Text>
            <Text style={styles.counterText}>{ARTISTS.length} Artistas</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.artistList}
          >
            {ARTISTS.map((artist) => (
              <View key={artist.id} style={styles.artistCard}>
                <View style={styles.artistImageWrap}>
                  <Image
                    source={{ uri: artist.imageUrl }}
                    contentFit="cover"
                    style={styles.artistImage}
                  />
                </View>
                <Text style={styles.artistName}>{artist.name}</Text>
                <Text style={styles.artistRole}>{artist.role}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>Tambem no Polo Multicultural</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedList}
          >
            {RELATED_EVENTS.map((related) => (
              <View key={related.id} style={styles.relatedCard}>
                <View style={styles.relatedCardBody}>
                  <View style={styles.relatedThumbWrap}>
                    <Image
                      source={{ uri: related.imageUrl }}
                      contentFit="cover"
                      style={styles.relatedThumb}
                    />
                  </View>
                  <View style={styles.relatedMeta}>
                    <Text style={styles.relatedDate}>{related.dateLabel}</Text>
                    <Text style={styles.relatedName}>{related.title}</Text>
                    <Text style={styles.relatedSubtitle}>{related.subtitle}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={[styles.actionBar, { paddingBottom: 12 + insets.bottom }]}>
        <Pressable style={styles.actionIconButton} onPress={handleShare}>
          <MaterialIcons name="share" size={22} color="#5B403A" />
        </Pressable>
        <Pressable style={styles.actionIconButton}>
          <MaterialIcons name="notification-add" size={22} color="#5B403A" />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.routeButton, pressed ? styles.buttonPressed : null]}
        >
          <MaterialIcons name="directions" size={20} color="#FFF" />
          <Text style={styles.routeButtonText}>Abrir rota</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#FCF9F0' },
  textureGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.06,
    backgroundColor: '#8F7069',
  },
  topBar: {
    zIndex: 3,
    height: 64,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#8F7069',
    backgroundColor: '#FCF9F0',
    shadowColor: '#815600',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarTitle: { fontSize: 24, lineHeight: 32, color: '#B12401', fontWeight: '700' },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  notFoundWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  notFoundTitle: { fontSize: 24, lineHeight: 32, color: '#1C1C17', fontWeight: '800' },
  notFoundText: { fontSize: 16, lineHeight: 24, color: '#5B403A', textAlign: 'center' },
  scrollContent: { paddingTop: 8 },
  buntingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    opacity: 0.8,
  },
  bunting: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  section: { paddingHorizontal: 20, marginTop: 16 },
  sectionWideTop: { paddingHorizontal: 20, marginTop: 32 },
  heroWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#815600',
    shadowColor: '#815600',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  heroImage: { width: '100%', height: '100%' },
  heroTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#B12401',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  heroTagText: {
    color: '#FFF',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  eventTitle: {
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -1,
    color: '#1C1C17',
    fontWeight: '800',
  },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EBE8DF',
    borderWidth: 1,
    borderColor: '#E3BEB6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  metaChipText: { color: '#5B403A', fontSize: 12, lineHeight: 16, fontWeight: '600' },
  alertBox: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#815600',
    backgroundColor: 'rgba(255,178,41,0.2)',
    borderRadius: 8,
    padding: 16,
  },
  alertTextWrap: { flex: 1, gap: 4 },
  alertTitle: { color: '#6C4700', fontSize: 12, lineHeight: 16, fontWeight: '600' },
  alertText: { color: '#5B403A', fontSize: 12, lineHeight: 16 },
  sectionTitle: {
    color: '#B12401',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    marginBottom: 12,
  },
  descriptionWrap: { gap: 12 },
  descriptionText: { color: '#5B403A', fontSize: 16, lineHeight: 24 },
  locationCard: {
    borderWidth: 2,
    borderColor: '#815600',
    borderRadius: 12,
    backgroundColor: '#F6F3EA',
    padding: 20,
    shadowColor: '#815600',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    gap: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  locationTitle: { color: '#1C1C17', fontSize: 20, lineHeight: 28, fontWeight: '700' },
  locationSubtitle: { color: '#5B403A', fontSize: 16, lineHeight: 24 },
  locationIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: 'rgba(177,36,1,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapMock: {
    height: 128,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E3BEB6',
    backgroundColor: '#E5E2DA',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapTexture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
    backgroundColor: '#B12401',
  },
  mapPin: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: '#B12401',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapButton: {
    minHeight: 48,
    borderWidth: 2,
    borderColor: '#B12401',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B12401',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  mapButtonText: {
    color: '#B12401',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  counterText: { color: '#5B403A', fontSize: 12, lineHeight: 16, fontWeight: '600' },
  artistList: { gap: 16, paddingRight: 20 },
  artistCard: { width: 160 },
  artistImageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#815600',
    shadowColor: '#815600',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    marginBottom: 8,
  },
  artistImage: { width: '100%', height: '100%' },
  artistName: {
    color: '#1C1C17',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  artistRole: {
    color: '#5B403A',
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 12,
    textTransform: 'uppercase',
  },
  relatedSection: {
    marginTop: 32,
    paddingVertical: 32,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderTopColor: '#E3BEB6',
    borderBottomColor: '#E3BEB6',
    backgroundColor: '#F1EEE5',
    paddingLeft: 20,
  },
  relatedTitle: {
    color: '#1C1C17',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    marginBottom: 16,
  },
  relatedList: { gap: 16, paddingRight: 20 },
  relatedCard: {
    width: 280,
    borderWidth: 2,
    borderColor: '#815600',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFF',
    shadowColor: '#815600',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  relatedCardBody: { flexDirection: 'row', gap: 12 },
  relatedThumbWrap: {
    width: 80,
    height: 80,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#E5E2DA',
  },
  relatedThumb: { width: '100%', height: '100%' },
  relatedMeta: { flex: 1, justifyContent: 'center', gap: 2 },
  relatedDate: {
    color: '#B12401',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  relatedName: { color: '#1C1C17', fontSize: 12, lineHeight: 16, fontWeight: '600' },
  relatedSubtitle: { color: '#5B403A', fontSize: 12, lineHeight: 16 },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 2,
    borderTopColor: '#E3BEB6',
    backgroundColor: '#F6F3EA',
    paddingHorizontal: 20,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  actionIconButton: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: '#8F7069',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeButton: {
    flex: 1,
    height: 48,
    borderWidth: 0,
    backgroundColor: '#B12401',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#815600',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  routeButtonText: {
    color: '#FFF',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  buttonPressed: { transform: [{ translateX: 2 }, { translateY: 2 }] },
});
