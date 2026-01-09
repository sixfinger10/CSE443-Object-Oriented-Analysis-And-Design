import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  View,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { apiPostJson } from "@/lib/api";
import { getStoredAuth } from "@/lib/auth";

type ItemType = "book" | "movie" | "series" | "music";

export default function AddItemScreen() {
  const [type, setType] = useState<ItemType>("book");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(""); // book / music artist
  const [year, setYear] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setYear("");
    setNotes("");
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }

    if (type === "book" && !author.trim()) {
      Alert.alert("Error", "Author is required for books");
      return;
    }

    const auth = await getStoredAuth();
    if (!auth?.userId) {
      Alert.alert("Error", "User session not found. Please log in again.");
      return;
    }

    const y = Number(year);
    const publicationYear =
      year.trim() && Number.isFinite(y) ? y : undefined;

    try {
      setSaving(true);

      // ================= BOOK =================
      if (type === "book") {
        await apiPostJson(
          "/api/books",
          {
            title: title.trim(),
            author: author.trim(),
            publicationYear,
            notes: notes.trim() || undefined,
          },
          { withUserId: true }
        );
      }

      // ================= MOVIE =================
      if (type === "movie") {
        await apiPostJson(
          "/api/movies",
          {
            title: title.trim(),
            releaseYear: publicationYear,
            notes: notes.trim() || undefined,
          },
          { withUserId: true }
        );
      }

      // ================= SERIES =================
      if (type === "series") {
        await apiPostJson(
          "/api/series",
          {
            title: title.trim(),
            releaseYear: publicationYear,
            notes: notes.trim() || undefined,
          },
          { withUserId: true }
        );
      }

      // ================= MUSIC =================
      if (type === "music") {
        await apiPostJson(
          "/api/music",
          {
            title: title.trim(),
            artist: author.trim() || undefined,
            releaseYear: publicationYear,
            notes: notes.trim() || undefined,
          },
          { withUserId: true }
        );
      }

      Alert.alert("Success", "Item added successfully", [
        {
          text: "OK",
          onPress: () => {
            resetForm();
            router.replace("/(drawer)/(tabs)/library");
          },
        },
      ]);
    } catch (e) {
      console.error("ADD ITEM ERROR", e);
      Alert.alert("Error", "Could not add item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Item</Text>

      {/* TYPE SELECTOR */}
      <View style={styles.selectorRow}>
        {(["book", "movie", "series", "music"] as ItemType[]).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setType(t)}
            style={[
              styles.selectorBtn,
              type === t && styles.selectorActive,
            ]}
          >
            <Text
              style={[
                styles.selectorText,
                type === t && styles.selectorTextActive,
              ]}
            >
              {t.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* FORM */}
      <View style={styles.card}>
        <Input label="Title" value={title} onChange={setTitle} />

        {(type === "book" || type === "music") && (
          <Input
            label={type === "book" ? "Author" : "Artist"}
            value={author}
            onChange={setAuthor}
          />
        )}

        <Input
          label="Year"
          value={year}
          onChange={setYear}
          keyboardType="numeric"
        />

        <Input label="Notes" value={notes} onChange={setNotes} />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveText}>
          {saving ? "Saving..." : "Save"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Input({ label, value, onChange, keyboardType }: any) {
  return (
    <>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
        keyboardType={keyboardType}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB", padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },

  selectorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  selectorBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#EDEFFF",
    alignItems: "center",
  },
  selectorActive: {
    backgroundColor: "#6A7DFF",
  },
  selectorText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6A7DFF",
  },
  selectorTextActive: {
    color: "#fff",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
  },
  saveButton: {
    backgroundColor: "#6A7DFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
  },
});

