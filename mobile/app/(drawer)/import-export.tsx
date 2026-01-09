import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from "react-native";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getUserIdOrDefault } from "@/lib/auth";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

type Format = "csv" | "json";

export default function ImportExportScreen() {
  const [format, setFormat] = useState<Format>("csv");
  const [meta, setMeta] = useState(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState<number>(1);

  useEffect(() => {
    (async () => setUserId(await getUserIdOrDefault(1)))();
  }, []);

  const handleExport = async () => {
    try {
      setProgress(20);

      const path = format === "csv"
        ? `/api/library/export/${userId}/csv`
        : `/api/library/export/${userId}/json`;

      const res = await apiFetch(path, { method: "GET" });
      if (!res.ok) throw new Error("Export failed");
      const text = await res.text();

      setProgress(70);

      const filename = `library_${userId}.${format}`;
      const uri = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(uri, text, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      setProgress(90);

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Export Ready", `Saved to cache:\n${uri}`);
      }

      setProgress(100);
      setTimeout(() => setProgress(0), 800);
    } catch (e) {
      setProgress(0);
      Alert.alert("Error", "Export failed");
    }
  };

  const handleImportJson = async () => {
    try {
      const pick = await DocumentPicker.getDocumentAsync({
        type: ["application/json", "text/json", "application/*"],
        copyToCacheDirectory: true,
      });

      if (pick.canceled) return;

      const file = pick.assets?.[0];
      if (!file?.uri) return;

      setProgress(20);

      const form = new FormData();
      form.append("file", {
        uri: file.uri,
        name: file.name || "library.json",
        type: file.mimeType || "application/json",
      } as any);

      const res = await apiFetch(`/api/library/import/${userId}/json`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Import failed");

      setProgress(90);
      Alert.alert("Success", "Import successful");
      setProgress(100);
      setTimeout(() => setProgress(0), 800);
    } catch (e) {
      setProgress(0);
      Alert.alert("Error", "Import failed");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Import & Export Data</Text>
      <Text style={styles.subtitle}>Backup or migrate your library between devices</Text>

      <View style={styles.cardCenter}>
        <Text style={styles.cardTitle}>Import Data (JSON)</Text>
        <Text style={styles.cardDesc}>Upload JSON to add items to your collection</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleImportJson}>
          <Text style={styles.primaryText}>Import Library</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardCenter}>
        <Text style={styles.cardTitle}>Export Data</Text>
        <Text style={styles.cardDesc}>Download your library to backup or transfer data</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleExport}>
          <Text style={styles.primaryText}>Export Library</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Export Library Data</Text>

        <Text style={styles.label}>Select Export Format</Text>
        <FormatOption label="CSV Format" desc="Excel / Google Sheets" active={format === "csv"} onPress={() => setFormat("csv")} />
        <FormatOption label="JSON Format" desc="Backups / migrations" active={format === "json"} onPress={() => setFormat("json")} />

        <Text style={styles.label}>Export Options (UI-only for now)</Text>
        <Toggle label="Include all metadata" value={meta} onChange={setMeta} />
        <Toggle label="Include favorites and lists" value={favoritesOnly} onChange={setFavoritesOnly} />

        <TouchableOpacity style={styles.primaryBtn} onPress={handleExport}>
          <Text style={styles.primaryText}>Download Export File</Text>
        </TouchableOpacity>
      </View>

      {progress > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>Processing… {progress}%</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

function FormatOption({ label, desc, active, onPress }: any) {
  return (
    <TouchableOpacity style={[styles.formatOption, active && styles.formatActive]} onPress={onPress}>
      <Text style={active ? styles.formatTextActive : styles.formatText}>{label}</Text>
      <Text style={styles.formatDesc}>{desc}</Text>
    </TouchableOpacity>
  );
}

function Toggle({ label, value, onChange }: any) {
  return (
    <View style={styles.toggleRow}>
      <Text>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB", padding: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 13, color: "#666", marginBottom: 16 },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 16 },
  cardCenter: { backgroundColor: "#fff", borderRadius: 14, padding: 20, alignItems: "center", marginBottom: 16 },
  cardTitle: { fontWeight: "700", marginBottom: 6 },
  cardDesc: { fontSize: 12, color: "#666", textAlign: "center", marginBottom: 12 },
  sectionTitle: { fontWeight: "600", marginBottom: 12 },
  label: { fontSize: 12, color: "#666", marginBottom: 6 },
  primaryBtn: { backgroundColor: "#6A7DFF", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, marginTop: 8 },
  primaryText: { color: "#fff", fontWeight: "600" },
  formatOption: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 10 },
  formatActive: { borderColor: "#6A7DFF", backgroundColor: "#EEF0FF" },
  formatText: { fontWeight: "600" },
  formatTextActive: { fontWeight: "600", color: "#6A7DFF" },
  formatDesc: { fontSize: 12, color: "#666" },
  toggleRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  progressBar: { height: 8, backgroundColor: "#eee", borderRadius: 4, overflow: "hidden", marginBottom: 6 },
  progressFill: { height: "100%", backgroundColor: "#6A7DFF" },
  progressText: { fontSize: 12, color: "#666" },
});

