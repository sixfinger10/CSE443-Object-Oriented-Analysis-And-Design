import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { getStoredAuth } from "@/lib/auth";
import { useFocusEffect } from "expo-router";

type Book = {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publicationYear?: number;
  notes?: string;
};

export default function LibraryScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const loadBooks = async () => {
    console.log("📚 LIBRARY: loadBooks called");

    try {
      setLoading(true);

      const auth = await getStoredAuth();
      console.log("🔐 LIBRARY: stored auth =", auth);

      if (!auth?.userId) {
        console.warn("❌ LIBRARY: missing userId");
        setBooks([]);
        return;
      }

      const headers = {
        "X-User-Id": String(auth.userId),
      };

      console.log("📨 LIBRARY: request headers =", headers);

      const res = await apiFetch("/api/books", { headers });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      console.log(
        "📥 LIBRARY RESPONSE:",
        "status =", res.status,
        "body =", data
      );

      if (!res.ok) {
        throw new Error("Library request failed");
      }

      setBooks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("🔥 LIBRARY ERROR:", e);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Reload whenever screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [])
  );

  const filtered = books.filter((b) =>
    (b.title || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>My Library</Text>
        <TouchableOpacity style={styles.reloadBtn} onPress={loadBooks}>
          <Text style={styles.reloadText}>
            {loading ? "..." : "Reload"}
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Search your library..."
        style={styles.search}
        value={query}
        onChangeText={setQuery}
      />

      <View style={styles.grid}>
        {filtered.map((book) => (
          <View key={book.id} style={styles.card}>
            <Text style={styles.cardIcon}>📘</Text>
            <Text style={styles.cardTitle}>{book.title}</Text>
            <Text style={styles.cardType}>{book.author}</Text>
          </View>
        ))}

        {!loading && filtered.length === 0 && (
          <Text style={styles.emptyText}>
            No books found for this user.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  reloadBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#EEF0FF",
  },
  reloadText: {
    color: "#6A7DFF",
    fontWeight: "700",
  },
  search: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#6A7DFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "600",
    marginBottom: 4,
  },
  cardType: {
    color: "#E0E0FF",
    fontSize: 12,
  },
  emptyText: {
    marginTop: 20,
    color: "#666",
    fontSize: 13,
  },
});

