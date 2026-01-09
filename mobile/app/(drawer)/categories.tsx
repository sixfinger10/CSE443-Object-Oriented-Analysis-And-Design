import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

const CATEGORY_STATS = {
  books: 142,
  movies: 58,
  tv: 29,
  music: 19,
};

const BOOK_GENRES = [
  { name: "Fiction", count: 45 },
  { name: "Science Fiction", count: 28 },
  { name: "Business", count: 23 },
  { name: "Self-Help", count: 18 },
  { name: "Biography", count: 15 },
  { name: "History", count: 14 },
];

const RECENT_BOOKS = [
  "Atomic Habits",
  "The Great Gatsby",
  "1984",
  "Dune",
  "Sapiens",
  "Thinking, Fast and Slow",
];

type Category = "books" | "movies" | "tv" | "music";

export default function CategoriesScreen() {
  const [active, setActive] = useState<Category>("books");

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Browse by Categories</Text>
      <Text style={styles.subtitle}>
        Organize and explore your collection
      </Text>

      {/* Category selector */}
      <View style={styles.categoryList}>
        <CategoryCard
          label="Books"
          count={CATEGORY_STATS.books}
          active={active === "books"}
          onPress={() => setActive("books")}
        />
        <CategoryCard
          label="Movies"
          count={CATEGORY_STATS.movies}
          active={active === "movies"}
          onPress={() => setActive("movies")}
        />
        <CategoryCard
          label="TV Series"
          count={CATEGORY_STATS.tv}
          active={active === "tv"}
          onPress={() => setActive("tv")}
        />
        <CategoryCard
          label="Music"
          count={CATEGORY_STATS.music}
          active={active === "music"}
          onPress={() => setActive("music")}
        />
      </View>

      {/* Subcategories */}
      {active === "books" && (
        <>
          <Section title="Book Genres">
            {BOOK_GENRES.map((g) => (
              <GenreRow key={g.name} name={g.name} count={g.count} />
            ))}
          </Section>

          <Section title="Recent in Books">
            {RECENT_BOOKS.map((title) => (
              <RecentItem key={title} title={title} />
            ))}
          </Section>
        </>
      )}

      {/* Placeholder for other categories */}
      {active !== "books" && (
        <Section title="Coming Soon">
          <Text style={styles.placeholder}>
            Category content will appear here.
          </Text>
        </Section>
      )}
    </ScrollView>
  );
}

/* ───────── Components ───────── */

function CategoryCard({ label, count, active, onPress }: any) {
  return (
    <TouchableOpacity
      style={[styles.categoryCard, active && styles.categoryActive]}
      onPress={onPress}
    >
      <Text style={active ? styles.categoryTextActive : styles.categoryText}>
        {label}
      </Text>
      <Text style={active ? styles.countActive : styles.count}>
        {count}
      </Text>
    </TouchableOpacity>
  );
}

function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function GenreRow({ name, count }: any) {
  return (
    <View style={styles.genreRow}>
      <Text>{name}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
    </View>
  );
}

function RecentItem({ title }: { title: string }) {
  return (
    <View style={styles.recentItem}>
      <Text>{title}</Text>
    </View>
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
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 16,
  },
  categoryList: {
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: "#E5E7FF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryActive: {
    backgroundColor: "#6A7DFF",
  },
  categoryText: {
    fontWeight: "600",
    color: "#444",
  },
  categoryTextActive: {
    fontWeight: "600",
    color: "#fff",
  },
  count: {
    color: "#444",
  },
  countActive: {
    color: "#fff",
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 12,
  },
  genreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  badge: {
    backgroundColor: "#6A7DFF",
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  recentItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  placeholder: {
    color: "#666",
    fontSize: 13,
  },
});

