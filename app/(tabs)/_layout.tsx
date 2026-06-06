import { Tabs } from "expo-router";
import { Text, StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => (
            <Text style={[styles.icon, { color }]}>&#x1F525;</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Foto",
          tabBarIcon: ({ color }) => (
            <Text style={[styles.iconBig, { color }]}>&#x1F4F7;</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Text style={[styles.icon, { color }]}>&#x1F464;</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#111",
    borderTopColor: "#222",
    height: 85,
    paddingBottom: 20,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  icon: {
    fontSize: 22,
  },
  iconBig: {
    fontSize: 28,
  },
});
