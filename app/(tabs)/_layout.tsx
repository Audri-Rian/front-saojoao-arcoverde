import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="eventos" />
      <Tabs.Screen name="mapa" />
      <Tabs.Screen name="mais" />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
