import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from "react-native";
import { useEffect, useState } from "react";
import { apiPostJson } from "@/lib/api";
import { getUserIdOrDefault } from "@/lib/auth";

export default function SyncScreen() {
  const [autoSync, setAutoSync] = useState(true);
  const [syncOnMobile, setSyncOnMobile] = useState(false);
  const [lastSynced, setLastSynced] = useState("Never");
  const [userId, setUserId] = useState<number>(1);

  useEffect(() => {
    (async () => setUserId(await getUserIdOrDefault(1)))();
  }, []);

  const syncNow = async () => {
    try {
      const result = await apiPostJson<any>(`/api/library/sync/${userId}`, []);
      setLastSynced("Just now");
      Alert.alert("Sync", result?.message || "Sync completed");
    } catch {
      Alert.alert("Sync", "Sync failed");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sync Status</Text>
      <Text style={styles.subtitle}>Keep your library synchronized across all your devices</Text>

      <View style={styles.banner}>
        <Text style={styles.bannerCheck}>✓</Text>
        <Text style={styles.bannerTitle}>Sync Ready</Text>
        <Text style={styles.bannerSub}>Tap sync to send operations to server</Text>
        <Text style={styles.bannerSmall}>Last synced: {lastSynced}</Text>

        <TouchableOpacity style={styles.bannerBtn} onPress={syncNow}>
          <Text style={styles.bannerBtnText}>Sync Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Sync Settings</Text>
        <Toggle label="Automatic Sync" value={autoSync} onChange={setAutoSync} />
        <Toggle label="Sync on Mobile Data" value={syncOnMobile} onChange={setSyncOnMobile} />
      </View>
    </ScrollView>
  );
}

function Toggle({ label, value, onChange }: any) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleText}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB", padding: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 13, color: "#666", marginBottom: 16 },
  banner: { backgroundColor: "#6A7DFF", borderRadius: 16, padding: 18, marginBottom: 16 },
  bannerCheck: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 6 },
  bannerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  bannerSub: { color: "#E9ECFF", fontSize: 12, marginTop: 4 },
  bannerSmall: { color: "#E9ECFF", fontSize: 12, marginTop: 10 },
  bannerBtn: { backgroundColor: "#fff", borderRadius: 10, paddingVertical: 10, alignItems: "center", marginTop: 12 },
  bannerBtnText: { color: "#6A7DFF", fontWeight: "700" },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 16 },
  sectionTitle: { fontWeight: "600", marginBottom: 12 },
  toggleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  toggleText: { flex: 1, marginRight: 12 },
});

