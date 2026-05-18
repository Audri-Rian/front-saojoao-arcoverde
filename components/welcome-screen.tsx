import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BUNTING_COLORS = ['#D53E1B', '#FFB229', '#4C75B6'];

type WelcomeScreenProps = {
  onExplore?: () => void;
};

export function WelcomeScreen({ onExplore }: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View pointerEvents="none" style={styles.noiseLayer} />

      <View style={styles.buntingRow}>
        {Array.from({ length: 12 }).map((_, index) => (
          <View
            key={`bunting-${index}`}
            style={[
              styles.bunting,
              { borderTopColor: BUNTING_COLORS[index % BUNTING_COLORS.length] },
            ]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerWrap}>
          <Text style={styles.brand}>Sao Joao em Arcoverde</Text>
        </View>

        <View style={styles.illustrationWrap}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6R-bEOkwV6rteMQv3ZdHjIS7OhrseEoen1B2ZbnaYOucnyz3jsECO3UO8Q5f7cCnV-QARHUaJNizphSL-CvRVUYe9yITC0iVy5OoEnGvZu0G3RL_7Oc38CZN4Ep-Kl86ichoQ0FkEUgawruhppS4Xs1HgdNwPtwAoSHZFHKK5ZvTQFdRsi_ymlwdumrxf4iKS77MVxlsNeUrSG0YzFd3H0UT6v-tsn5CLQBzQ17tIeX2X8j1xPcEoRJC4IzFmBid7geVcWQAwDw',
            }}
            contentFit="cover"
            style={styles.illustration}
          />
          <View pointerEvents="none" style={styles.illustrationOverlay} />
        </View>

        <View style={styles.copyBlock}>
          <Text style={styles.title}>
            Descubra eventos, tradicoes e a cultura que faz o coracao do sertao bater mais forte.
          </Text>
          <Text style={styles.subtitle}>
            Viva o forro, as quadrilhas, o coco e as festas que transformam Arcoverde em um grande
            arraial.
          </Text>
        </View>

        <View style={styles.actionsWrap}>
          <Pressable
            style={({ pressed }) => [styles.ctaButton, pressed ? styles.ctaButtonPressed : null]}
            onPress={onExplore}
          >
            <Text style={styles.ctaText}>Explorar eventos</Text>
            <MaterialIcons name="arrow-forward" size={22} color="#FFF" />
          </Pressable>

          <View style={styles.pagination}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
      </ScrollView>

      <View pointerEvents="none" style={styles.campfireWrap}>
        <View style={styles.logRow}>
          <View style={[styles.log, styles.logLeft]} />
          <View style={[styles.log, styles.logRight]} />
        </View>
        <MaterialIcons
          name="local-fire-department"
          size={46}
          color="#D53E1B"
          style={styles.flame}
        />
      </View>

      <View pointerEvents="none" style={styles.stripedDivider}>
        {Array.from({ length: 24 }).map((_, index) => (
          <View
            key={`stripe-${index}`}
            style={[styles.stripe, { backgroundColor: index % 2 === 0 ? '#D9411E' : '#FFB229' }]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCF9F0' },
  noiseLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
    backgroundColor: '#1C1C17',
  },
  buntingRow: {
    position: 'absolute',
    top: 6,
    left: 0,
    right: 0,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 2,
  },
  bunting: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderTopWidth: 34,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  headerWrap: { paddingTop: 24 },
  brand: {
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -1,
    color: '#B12401',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '800',
    textShadowColor: '#3D2B1F',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  illustrationWrap: {
    width: '100%',
    maxWidth: 320,
    aspectRatio: 1,
    borderWidth: 3,
    borderColor: '#3D2B1F',
    backgroundColor: '#EBE8DF',
    shadowColor: '#3D2B1F',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    overflow: 'hidden',
  },
  illustration: { width: '100%', height: '100%' },
  illustrationOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 4,
    borderColor: 'rgba(61,43,31,0.2)',
    backgroundColor: 'rgba(181,39,3,0.06)',
  },
  copyBlock: { width: '100%', maxWidth: 320, alignItems: 'center', gap: 12 },
  title: {
    fontSize: 24,
    lineHeight: 32,
    color: '#1C1C17',
    textAlign: 'center',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5B403A',
    textAlign: 'center',
  },
  actionsWrap: { width: '100%', alignItems: 'center', gap: 24, marginTop: 8 },
  ctaButton: {
    width: '100%',
    maxWidth: 280,
    borderRadius: 999,
    backgroundColor: '#D53E1B',
    minHeight: 56,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#3D2B1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  ctaButtonPressed: { transform: [{ translateY: 1 }] },
  ctaText: { color: '#FFF', fontSize: 24, lineHeight: 32, fontWeight: '700' },
  pagination: { flexDirection: 'row', gap: 8 },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#3D2B1F',
    backgroundColor: '#E5E2DA',
  },
  dotActive: { backgroundColor: '#B12401' },
  campfireWrap: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    alignItems: 'center',
    opacity: 0.92,
  },
  logRow: { flexDirection: 'row', gap: 6 },
  log: {
    width: 48,
    height: 12,
    borderWidth: 2,
    borderColor: '#3D2B1F',
    backgroundColor: '#5D4037',
  },
  logLeft: { transform: [{ rotate: '15deg' }] },
  logRight: { transform: [{ rotate: '-15deg' }] },
  flame: { position: 'absolute', top: -40 },
  stripedDivider: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    height: 4,
    flexDirection: 'row',
    opacity: 0.2,
  },
  stripe: { flex: 1 },
});
