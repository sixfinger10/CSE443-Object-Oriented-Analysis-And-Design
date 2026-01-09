import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

const MOCK_RESULTS = [
  {
    id: 1,
    title: "Inception",
    director: "Christopher Nolan",
    year: "2010",
    genre: "Sci-Fi, Thriller",
  },
  {
    id: 2,
    title: "The Dark Knight",
    director: "Christopher Nolan",
    year: "2008",
    genre: "Action, Crime, Drama",
  },
  {
    id: 3,
    title: "Interstellar",
    director: "Christopher Nolan",
    year: "2014",
    genre: "Sci-Fi, Drama",
  },
];

export default function SearchScreen() {
  const [query, setQuery] = useState("Nolan");

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Search</Text>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search your library..."
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.clearBtn}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Result count */}
      <Text style={styles.resultInfo}>
        Found <Text style={styles.bold}>3 results</Text> matching your search
      </Text>

      {/* Active filters */}
      <View style={styles.filters}>
        <FilterChip label="Genre: Sci-Fi" />
        <FilterChip label="Year: 2008-2020" />
      </View>

      {/* Results */}
      {MOCK_RESULTS.map((item) => (
        <ResultCard key={item.id} item={item} query={query} />
      ))}
    </ScrollView>
  );
}

/* ───────── Components ───────── */

function FilterChip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

function ResultCard({ item, query }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {highlight(item.title, query)}
      </Text>

      <Text style={styles.meta}>
        Director: {highlight(item.director, query)}
      </Text>
      <Text style={styles.meta}>Year: {item.year}</Text>
      <Text style={styles.meta}>Genre: {item.genre}</Text>

      <View style={styles.actions}>
        <Action label="View" />
        <Action label="Edit" />
        <Action label="Favorite" />
      </View>
    </View>
  );
}

function Action({ label }: { label: string }) {
  return (
    <TouchableOpacity style={styles.actionBtn}>
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ───────── Highlight helper ───────── */

function highlight(text: string, query: string) {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, "gi"));

  return (
    <Text>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <Text key={i} style={styles.highlight}>
            {part}
          </Text>
        ) : (
          part
        )
      )}
    </Text>
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
  searchRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginRight: 8,
  },
  clearBtn: {
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  clearText: {
    color: "#6A7DFF",
    fontWeight: "600",
  },
  resultInfo: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  bold: {
    fontWeight: "600",
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  chip: {
    backgroundColor: "#E5E7FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
    color: "#555",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  meta: {
    fontSize: 12,
    color: "#555",
    marginBottom: 2,
  },
  highlight: {
    backgroundColor: "#FFE066",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

