import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6A7DFF",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

    <Tabs.Screen
	  name="add"
	  options={{
	    title: "Add Item",
	    tabBarIcon: ({ color, size }) => (
	      <Ionicons name="add-circle-outline" size={size} color={color} />
	    ),
	  }}
	/>

	<Tabs.Screen
	  name="search"
	  options={{
	    title: "Search",
	    tabBarIcon: ({ color, size }) => (
	      <Ionicons name="search-outline" size={size} color={color} />
	    ),
	  }}
	/>

	<Tabs.Screen
	  name="categories"
	  options={{
	    title: "Categories",
	    tabBarIcon: ({ color, size }) => (
	      <Ionicons name="grid-outline" size={size} color={color} />
	    ),
	  }}
	/>

	<Tabs.Screen
	  name="favorites"
	  options={{
	    title: "Favorites",
	    tabBarIcon: ({ color, size }) => (
	      <Ionicons name="heart-outline" size={size} color={color} />
	    ),
	  }}
	/>

	<Tabs.Screen
	  name="import-export"
	  options={{
	    title: "Import/Export",
	    tabBarIcon: ({ color, size }) => (
	      <Ionicons name="swap-horizontal-outline" size={size} color={color} />
	    ),
	  }}
	/>

	<Tabs.Screen
	  name="sync"
	  options={{
	    title: "Sync",
	    tabBarIcon: ({ color, size }) => (
	      <Ionicons name="sync-outline" size={size} color={color} />
	    ),
	  }}
	/>

    </Tabs>
  );
}
