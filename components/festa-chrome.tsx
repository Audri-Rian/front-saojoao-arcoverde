import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabKey = 'inicio' | 'eventos' | 'mapa' | 'mais';

type FestaChromeProps = {
  activeTab: TabKey;
  children: ReactNode;
};

export function FestaChrome({ activeTab, children }: FestaChromeProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.safeArea}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable
          style={[styles.bottomItem, activeTab === 'inicio' ? styles.bottomItemActive : null]}
          onPress={() => router.replace('/')}
        >
          <MaterialIcons
            name="home"
            size={20}
            color={activeTab === 'inicio' ? '#FFF' : '#3D2B1F'}
          />
          <Text
            style={activeTab === 'inicio' ? styles.bottomItemActiveText : styles.bottomItemText}
          >
            Inicio
          </Text>
        </Pressable>
        <Pressable
          style={[styles.bottomItem, activeTab === 'eventos' ? styles.bottomItemActive : null]}
          onPress={() => router.replace('/eventos')}
        >
          <MaterialIcons
            name="calendar-month"
            size={20}
            color={activeTab === 'eventos' ? '#FFF' : '#3D2B1F'}
          />
          <Text
            style={activeTab === 'eventos' ? styles.bottomItemActiveText : styles.bottomItemText}
          >
            Eventos
          </Text>
        </Pressable>
        <Pressable
          style={[styles.bottomItem, activeTab === 'mapa' ? styles.bottomItemActive : null]}
          onPress={() => router.replace('/mapa')}
        >
          <MaterialIcons name="map" size={20} color={activeTab === 'mapa' ? '#FFF' : '#3D2B1F'} />
          <Text style={activeTab === 'mapa' ? styles.bottomItemActiveText : styles.bottomItemText}>
            Mapa
          </Text>
        </Pressable>
        <Pressable
          style={[styles.bottomItem, activeTab === 'mais' ? styles.bottomItemActive : null]}
          onPress={() => router.replace('/mais')}
        >
          <MaterialIcons
            name="more-horiz"
            size={20}
            color={activeTab === 'mais' ? '#FFF' : '#3D2B1F'}
          />
          <Text style={activeTab === 'mais' ? styles.bottomItemActiveText : styles.bottomItemText}>
            Mais
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCF9F0' },
  content: { paddingHorizontal: 20, paddingTop: 24, gap: 24, paddingBottom: 110 },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topBar: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    minHeight: 72,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    backgroundColor: '#FFF6E2',
  },
  topBarContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: { color: '#C93312', fontWeight: '900', fontSize: 25, letterSpacing: -0.4, marginLeft: 8 },
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
