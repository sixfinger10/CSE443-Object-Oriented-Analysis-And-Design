import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

const FAVORITES = [
  { title: "Atomic Habits", type: "Book", status: "Physical" },
  { title: "Inception", type: "Movie", status: "Digital" },
  { title: "Breaking Bad", type: "TV Series", status: "Completed" },
  { title: "The Great Gatsby", type: "Book", status: "Classic" },
  { title: "The Dark Knight", type: "Movie", status: "Watched" },
];

type ListType = "favorites" | "reading" | "watching";

export default function FavoritesScreen() {
  const [active, setActive] = useState<ListType>("favorites");

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Favorites & Lists</Text>

      {/* Selector */}
      <View style={styles.selector}>
        <SelectorButton
          label="Favorites"
          count={42}
          active={active === "favorites"}
          onPress={() => setActive("favorites")}
        />
        <SelectorButton
          label="Reading"
          count={15}
          active={active === "reading"}
          onPress={() => setActive("reading")}
        />
        <SelectorButton
          label="Watching"
          count={8}
          active={active === "watching"}
          onPress={() => setActive("watching")}
        />
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <Stat label="Total Favorites" value="42" />
        <Stat label="This Month" value="28" />
        <Stat label="Books" value="85%" />
      </View>

      {/* List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Favorite Items</Text>

        {FAVORITES.map((item) => (
          <FavoriteItem key={item.title} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

/* ───────── Components ───────── */

function SelectorButton({ label, count, active, onPress }: any) {
  return (
    <TouchableOpacity
      style={[styles.selectorBtn, active && styles.selectorActive]}
      onPress={onPress}
    >
      <Text style={active ? styles.selectorTextActive : styles.selectorText}>
        {label}
      </Text>
      <Text style={active ? styles.countActive : styles.count}>{count}</Text>
    </TouchableOpacity>
  );
}

function Stat({ label, value }: any) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function FavoriteItem({ item }: any) {
  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemMeta}>
          {item.type} • {item.status}
        </Text>
      </View>

      <View style={styles.actions}>
        <Action label="View" />
        <Action label="Edit" />
        <Action label="Remove" />
      </View>
    </View>
  );
}

function Action({ label }: any) {
  return (
    <TouchableOpacity style={styles.actionBtn}>
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ───────── Styles ───────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  selector: {
    flexDirection: "row",
    marginBottom: 16,
  },
  selectorBtn: {
    flex: 1,
    backgroundColor: "#E5E7FF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  selectorActive: {
    backgroundColor: "#6A7DFF",
  },
  selectorText: {
    fontWeight: "600",
    color: "#444",
  },
  selectorTextActive: {
    fontWeight: "600",
    color: "#fff",
  },
  count: {
    color: "#444",
    fontSize: 12,
  },
  countActive: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 12,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemTitle: {
    fontWeight: "600",
  },
  itemMeta: {
    fontSize: 12,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
  },
  actionBtn: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

