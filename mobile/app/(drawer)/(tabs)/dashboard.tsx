import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { apiFetch } from "@/lib/api";
import { getStoredAuth } from "@/lib/auth";

/* ======================================
   Dashboard Screen
====================================== */

export default function DashboardScreen() {
  const [stats, setStats] = useState({
    total: 0,
    moviesSeries: 0,
    favorites: 0,
    reading: 0,
  });

  /* 🔹 Frontend-only mock data */
  const recentItems = [
    { id: 1, title: "Spooks Run Wild", type: "MOVIE" },
    { id: 2, title: "Etkili İnsanların 7 Alışkanlığı", type: "BOOK" },
    { id: 3, title: "Atomic Habits", type: "BOOK" },
    { id: 4, title: "Interstellar", type: "MOVIE" },
  ];

  const loadStats = async () => {
    try {
      const auth = await getStoredAuth();
      if (!auth?.userId) return;

      const headers = { "X-User-Id": String(auth.userId) };

      const endpoints = [
        "/api/dashboard/total-items",
        "/api/dashboard/total-movies",
        "/api/dashboard/total-series",
        "/api/dashboard/total-favorites",
      ];

      const results = await Promise.all(
        endpoints.map(async (url) => {
          try {
            const res = await apiFetch(url, { headers });
            if (!res.ok) return 0;
            const data = await res.json();
            return Number(data) || 0;
          } catch {
            return 0;
          }
        })
      );

      const [total, movies, series, favorites] = results;

      setStats({
        total,
        moviesSeries: movies + series,
        favorites,
        reading: 0,
      });
    } catch (err) {
      console.error("🔥 DASHBOARD ERROR:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>Welcome back 👋</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard title="Total Items" value={stats.total} />
        <StatCard title="Movies & Series" value={stats.moviesSeries} />
        <StatCard title="Favorites" value={stats.favorites} />
        <StatCard title="Reading List" value={stats.reading} />
      </View>

      {/* Recent Additions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Additions</Text>
          <TouchableOpacity
            onPress={() => router.push("/(drawer)/(tabs)/library")}
          >
            <Text style={styles.viewAll}>View All →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentItems.map((item) => (
            <View key={item.id} style={styles.recentCard}>
              <Text style={styles.recentType}>{item.type}</Text>
              <Text style={styles.recentTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <ActionButton
            label="Add Item"
            onPress={() => router.push("/(drawer)/(tabs)/add")}
          />
          <ActionButton
            label="Open Library"
            onPress={() => router.push("/(drawer)/(tabs)/library")}
          />
        </View>
      </View>
    </ScrollView>
  );
}

/* ======================================
   Components
====================================== */

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{String(value)}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

function ActionButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ======================================
   Styles
====================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    padding: 16,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },

  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
  },
  statTitle: {
    fontSize: 13,
    color: "#666",
  },

  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  viewAll: {
    fontSize: 13,
    color: "#6A7DFF",
    fontWeight: "500",
  },

  recentCard: {
    width: 160,
    backgroundColor: "#F6F7FB",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
  },
  recentType: {
    fontSize: 11,
    color: "#6A7DFF",
    fontWeight: "700",
    marginBottom: 6,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: "600",
  },

  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    width: "48%",
    paddingVertical: 14,
    backgroundColor: "#6A7DFF",
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
  },
});

