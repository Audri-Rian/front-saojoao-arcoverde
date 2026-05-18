import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { FestaChrome } from '@/components/festa-chrome';

type HubItem = {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  emphatic?: boolean;
};

const HUB_ITEMS: HubItem[] = [
  { label: 'Favoritos', icon: 'favorite', emphatic: true },
  { label: 'Turismo e cultura', icon: 'landscape', emphatic: true },
  { label: 'Gastronomia', icon: 'restaurant', emphatic: true },
  { label: 'Sobre o evento', icon: 'info', emphatic: true },
  { label: 'Configuracoes', icon: 'settings' },
  { label: 'Ajuda e informacoes uteis', icon: 'help-center' },
];

export default function MaisScreen() {
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const handleNotImplemented = (itemName: string) => {
    Alert.alert('Em breve', `${itemName} sera disponibilizado nas proximas telas.`);
  };

  return (
    <FestaChrome activeTab="mais">
      <View style={styles.titleWrap}>
        <View style={styles.titleAccent} />
        <Text style={styles.title}>Mais</Text>
      </View>

      <View style={styles.syncCard}>
        <View style={styles.syncHeader}>
          <MaterialIcons name="cloud-done" size={24} color="#B12401" />
          <Text style={styles.syncTitle}>Sincronizado</Text>
        </View>
        <Text style={styles.syncDescription}>
          Acesso Offline Ativo. Ultima atualizacao: Hoje, 14:30.
        </Text>

        <Pressable
          style={({ pressed }) => [styles.syncButton, pressed ? styles.pressedButton : undefined]}
          onPress={() => handleNotImplemented('Sincronizacao manual')}
        >
          <MaterialIcons name="sync" size={20} color="#FFF" />
          <Text style={styles.syncButtonText}>Sincronizar agora</Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        {HUB_ITEMS.map((item, index) => {
          const isSoftSection = !item.emphatic;
          const needsGap = index === 4;

          return (
            <View key={item.label} style={needsGap ? styles.sectionGap : undefined}>
              <Pressable
                style={({ pressed }) => [
                  styles.itemRow,
                  item.emphatic ? styles.itemRowEmphatic : styles.itemRowSoft,
                  pressed ? styles.pressedButton : undefined,
                ]}
                onPress={() => handleNotImplemented(item.label)}
              >
                <View style={styles.itemLeft}>
                  <MaterialIcons
                    name={item.icon}
                    size={22}
                    color={item.emphatic ? '#815600' : '#5B403A'}
                  />
                  <Text style={isSoftSection ? styles.itemTextSoft : styles.itemTextEmphatic}>
                    {item.label}
                  </Text>
                </View>
                <MaterialIcons
                  name={item.emphatic ? 'arrow-forward' : 'chevron-right'}
                  size={20}
                  color="#8F7069"
                />
              </Pressable>
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Text style={styles.versionText}>Versao {appVersion}</Text>
      </View>
    </FestaChrome>
  );
}

const styles = StyleSheet.create({
  titleWrap: {
    borderBottomWidth: 2,
    borderBottomColor: '#8F7069',
    paddingBottom: 8,
    marginBottom: 2,
  },
  titleAccent: {
    position: 'absolute',
    left: 0,
    bottom: -2,
    width: '34%',
    height: 4,
    backgroundColor: '#B12401',
  },
  title: { fontSize: 40, lineHeight: 48, fontWeight: '800', color: '#1C1C17' },
  syncCard: {
    borderWidth: 2,
    borderColor: '#8F7069',
    backgroundColor: '#FFF',
    padding: 16,
    gap: 8,
    shadowColor: '#8F7069',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  syncHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  syncTitle: { fontSize: 24, lineHeight: 32, fontWeight: '700', color: '#1C1C17' },
  syncDescription: { fontSize: 16, lineHeight: 24, color: '#5B403A' },
  syncButton: {
    marginTop: 8,
    minHeight: 46,
    borderWidth: 2,
    borderColor: '#8F7069',
    backgroundColor: '#B12401',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    shadowColor: '#8F7069',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  syncButtonText: {
    color: '#FFF',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  list: { gap: 8 },
  sectionGap: { marginTop: 16 },
  itemRow: {
    minHeight: 64,
    borderWidth: 2,
    borderColor: '#8F7069',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemRowEmphatic: {
    backgroundColor: '#F1EEE5',
    shadowColor: '#8F7069',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  itemRowSoft: {
    backgroundColor: '#FCF9F0',
    borderStyle: 'dashed',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 8 },
  itemTextEmphatic: { fontSize: 24, lineHeight: 32, color: '#1C1C17', fontWeight: '700' },
  itemTextSoft: { fontSize: 18, lineHeight: 28, color: '#5B403A', fontWeight: '400' },
  footer: { marginTop: 12, alignItems: 'center', paddingBottom: 4 },
  versionText: {
    color: '#5B403A',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  pressedButton: { transform: [{ translateX: 2 }, { translateY: 2 }] },
});
