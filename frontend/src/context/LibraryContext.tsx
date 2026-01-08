import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LibraryItem {
  id: number;
  type: 'Book' | 'Movie' | 'TV Series' | 'Music';
  icon: string;
  title: string;
  
  // Creator fields
  author?: string;
  director?: string;
  artist?: string;
  
  // Common fields
  year?: number;
  rating: number;
  isFavorite: boolean;
  genre?: string;
  notes?: string;
  
  // Book fields
  isbn?: string;
  pages?: number;
  publisher?: string;
  language?: string;
  format?: string;
  
  // Movie fields
  duration?: number;
  
  // TV Series fields
  seasons?: number;
  
  // Music fields
  album?: string;
  
  // Status & Progress - YENİ! ✅
  status?: 'Read' | 'Reading' | 'Watched' | 'Watching' | 'Completed' | 'Listening' | 'Listened';
  
  // Progress tracking - YENİ! ✅
  currentPage?: number;
  totalPages?: number;
  currentMinute?: number;
  totalMinutes?: number;
  currentSeason?: number;
  currentEpisode?: number;
  totalSeasons?: number;
  progress?: number; // 0-100 percentage
  
  // Timestamp
  addedAt?: string;
}

interface LibraryContextType {
  items: LibraryItem[];
  addItem: (item: Omit<LibraryItem, 'id' | 'addedAt'>) => void;
  updateItem: (id: number, updates: Partial<LibraryItem>) => void;
  deleteItem: (id: number) => void;
  toggleFavorite: (id: number) => void;
  getStats: () => {
    totalItems: number;
    books: number;
    movies: number;
    tvSeries: number;
    music: number;
    favorites: number;
    thisMonth: number;
  };
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<LibraryItem[]>(() => {
    const saved = localStorage.getItem('plms-library');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialItems;
      }
    }
    return initialItems;
  });

  useEffect(() => {
    localStorage.setItem('plms-library', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<LibraryItem, 'id' | 'addedAt'>) => {
    const newItem: LibraryItem = {
      ...item,
      id: Date.now(),
      addedAt: new Date().toISOString(),
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const updateItem = (id: number, updates: Partial<LibraryItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFavorite = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const getStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return {
      totalItems: items.length,
      books: items.filter((i) => i.type === 'Book').length,
      movies: items.filter((i) => i.type === 'Movie').length,
      tvSeries: items.filter((i) => i.type === 'TV Series').length,
      music: items.filter((i) => i.type === 'Music').length,
      favorites: items.filter((i) => i.isFavorite).length,
      thisMonth: items.filter((i) => {
        if (!i.addedAt) return false;
        const itemDate = new Date(i.addedAt);
        return (
          itemDate.getMonth() === currentMonth &&
          itemDate.getFullYear() === currentYear
        );
      }).length,
    };
  };

  return (
    <LibraryContext.Provider
      value={{ items, addItem, updateItem, deleteItem, toggleFavorite, getStats }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within LibraryProvider');
  }
  return context;
};

// Initial dummy data - PROGRESS TRACKING İLE! ✅
const initialItems: LibraryItem[] = [
  {
    id: 1,
    type: 'Book',
    icon: '📖',
    title: 'Atomic Habits',
    author: 'James Clear',
    year: 2018,
    rating: 5,
    isFavorite: true,
    genre: 'Self-Help',
    isbn: '978-0735211292',
    pages: 320,
    totalPages: 320,
    status: 'Reading',
    currentPage: 144,
    progress: 45,
    addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    type: 'Movie',
    icon: '🎥',
    title: 'Inception',
    director: 'Christopher Nolan',
    year: 2010,
    rating: 5,
    isFavorite: false,
    genre: 'Sci-Fi',
    duration: 148,
    totalMinutes: 148,
    status: 'Watched',
    addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    type: 'TV Series',
    icon: '📺',
    title: 'Breaking Bad',
    director: 'Vince Gilligan',
    year: 2008,
    rating: 5,
    isFavorite: true,
    genre: 'Crime',
    seasons: 5,
    totalSeasons: 5,
    status: 'Watching',
    currentSeason: 3,
    currentEpisode: 7,
    progress: 60,
    addedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    type: 'Music',
    icon: '🎵',
    title: 'Abbey Road',
    artist: 'The Beatles',
    year: 1969,
    rating: 5,
    isFavorite: true,
    genre: 'Rock',
    album: 'Abbey Road',
    status: 'Listened',
    addedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    type: 'Book',
    icon: '📖',
    title: '1984',
    author: 'George Orwell',
    year: 1949,
    rating: 4,
    isFavorite: false,
    genre: 'Fiction',
    isbn: '978-0451524935',
    pages: 328,
    totalPages: 328,
    status: 'Read',
    addedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];