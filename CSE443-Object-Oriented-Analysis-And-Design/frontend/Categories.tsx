import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemDetailModal from '../components/ItemDetailModal';
import './Categories.css';

interface CategoryCount {
  type: 'Books' | 'Movies' | 'TV Series' | 'Music';
  icon: string;
  count: number;
}

interface Genre {
  name: string;
  count: number;
}

interface RecentItem {
  id: number;
  type: 'Book' | 'Movie' | 'TV Series' | 'Music';
  icon: string;
  title: string;
  author?: string;
  director?: string;
  artist?: string;
  year?: number;
  rating: number;
  isFavorite: boolean;
  genre?: string;
  notes?: string;
  // Additional fields for modal compatibility
  isbn?: string;
  publisher?: string;
  pages?: number;
  language?: string;
  format?: string;
  duration?: number;
  seasons?: number;
  album?: string;
}

const Categories = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'Books' | 'Movies' | 'TV Series' | 'Music'>('Books');
  const [selectedItem, setSelectedItem] = useState<RecentItem | null>(null);

  // Category counts
  const categoryCounts: CategoryCount[] = [
    { type: 'Books', icon: '📖', count: 142 },
    { type: 'Movies', icon: '🎥', count: 58 },
    { type: 'TV Series', icon: '📺', count: 29 },
    { type: 'Music', icon: '🎵', count: 19 },
  ];

  // Book genres
  const bookGenres: Genre[] = [
    { name: 'Fiction', count: 45 },
    { name: 'Science Fiction', count: 32 },
    { name: 'Business', count: 28 },
    { name: 'Self-Help', count: 24 },
    { name: 'Biography', count: 18 },
    { name: 'History', count: 15 },
  ];

  // Movie genres
  const movieGenres: Genre[] = [
    { name: 'Action', count: 22 },
    { name: 'Comedy', count: 18 },
    { name: 'Drama', count: 15 },
    { name: 'Sci-Fi', count: 12 },
    { name: 'Thriller', count: 10 },
    { name: 'Romance', count: 8 },
  ];

  // TV Series genres
  const tvGenres: Genre[] = [
    { name: 'Drama', count: 12 },
    { name: 'Crime', count: 8 },
    { name: 'Comedy', count: 6 },
    { name: 'Sci-Fi', count: 5 },
    { name: 'Fantasy', count: 4 },
    { name: 'Documentary', count: 3 },
  ];

  // Music genres
  const musicGenres: Genre[] = [
    { name: 'Rock', count: 8 },
    { name: 'Pop', count: 6 },
    { name: 'Jazz', count: 4 },
    { name: 'Classical', count: 3 },
    { name: 'Hip Hop', count: 2 },
    { name: 'Electronic', count: 2 },
  ];

  // Recent items with full modal data
  const recentBooks: RecentItem[] = [
    { 
      id: 1, 
      type: 'Book', 
      icon: '📖', 
      title: 'Atomic Habits', 
      author: 'James Clear', 
      year: 2018, 
      rating: 5, 
      isFavorite: false, 
      genre: 'Self-Help',
      pages: 320,
      language: 'English',
      notes: 'Great book about building habits!'
    },
    { 
      id: 2, 
      type: 'Book', 
      icon: '📖', 
      title: 'The Great Gatsby', 
      author: 'F. Scott Fitzgerald', 
      year: 1925, 
      rating: 4, 
      isFavorite: false, 
      genre: 'Fiction',
      pages: 180,
      language: 'English'
    },
    { 
      id: 3, 
      type: 'Book', 
      icon: '📖', 
      title: '1984', 
      author: 'George Orwell', 
      year: 1949, 
      rating: 5, 
      isFavorite: true, 
      genre: 'Fiction',
      pages: 328,
      language: 'English'
    },
    { 
      id: 4, 
      type: 'Book', 
      icon: '📖', 
      title: 'Brave New World', 
      author: 'Aldous Huxley', 
      year: 1932, 
      rating: 4, 
      isFavorite: false, 
      genre: 'Fiction',
      pages: 268,
      language: 'English'
    },
    { 
      id: 5, 
      type: 'Book', 
      icon: '📖', 
      title: 'Sapiens', 
      author: 'Yuval Noah Harari', 
      year: 2011, 
      rating: 5, 
      isFavorite: false, 
      genre: 'History',
      pages: 443,
      language: 'English'
    },
    { 
      id: 6, 
      type: 'Book', 
      icon: '📖', 
      title: 'Thinking Fast and Slow', 
      author: 'Daniel Kahneman', 
      year: 2011, 
      rating: 5, 
      isFavorite: false, 
      genre: 'Psychology',
      pages: 499,
      language: 'English'
    },
  ];

  const recentMovies: RecentItem[] = [
    { 
      id: 7, 
      type: 'Movie', 
      icon: '🎥', 
      title: 'Inception', 
      director: 'Christopher Nolan', 
      year: 2010, 
      rating: 5, 
      isFavorite: false, 
      genre: 'Sci-Fi',
      duration: 148
    },
    { 
      id: 8, 
      type: 'Movie', 
      icon: '🎥', 
      title: 'The Dark Knight', 
      director: 'Christopher Nolan', 
      year: 2008, 
      rating: 5, 
      isFavorite: false, 
      genre: 'Action',
      duration: 152
    },
    { 
      id: 9, 
      type: 'Movie', 
      icon: '🎥', 
      title: 'Interstellar', 
      director: 'Christopher Nolan', 
      year: 2014, 
      rating: 5, 
      isFavorite: true, 
      genre: 'Sci-Fi',
      duration: 169
    },
    { 
      id: 10, 
      type: 'Movie', 
      icon: '🎥', 
      title: 'The Matrix', 
      director: 'Wachowskis', 
      year: 1999, 
      rating: 5, 
      isFavorite: false, 
      genre: 'Sci-Fi',
      duration: 136
    },
    { 
      id: 11, 
      type: 'Movie', 
      icon: '🎥', 
      title: 'Pulp Fiction', 
      director: 'Quentin Tarantino', 
      year: 1994, 
      rating: 5, 
      isFavorite: false, 
      genre: 'Crime',
      duration: 154
    },
    { 
      id: 12, 
      type: 'Movie', 
      icon: '🎥', 
      title: 'Fight Club', 
      director: 'David Fincher', 
      year: 1999, 
      rating: 5, 
      isFavorite: false, 
      genre: 'Drama',
      duration: 139
    },
  ];

  const recentTvSeries: RecentItem[] = [
    { 
      id: 13, 
      type: 'TV Series', 
      icon: '📺', 
      title: 'Breaking Bad', 
      director: 'Vince Gilligan', 
      year: 2008, 
      rating: 5, 
      isFavorite: true, 
      genre: 'Crime',
      seasons: 5
    },
    { 
      id: 14, 
      type: 'TV Series', 
      icon: '📺', 
      title: 'Game of Thrones', 
      director: 'D. Benioff', 
      year: 2011, 
      rating: 4, 
      isFavorite: false, 
      genre: 'Fantasy',
      seasons: 8
    },
    { 
      id: 15, 
      type: 'TV Series', 
      icon: '📺', 
      title: 'The Wire', 
      director: 'David Simon', 
      year: 2002, 
      rating: 5, 
      isFavorite: false, 
      genre: 'Crime',
      seasons: 5
    },
    { 
      id: 16, 
      type: 'TV Series', 
      icon: '📺', 
      title: 'The Sopranos', 
      director: 'David Chase', 
      year: 1999, 
      rating: 5, 
      isFavorite: false, 
      genre: 'Crime',
      seasons: 6
    },
    { 
      id: 17, 
      type: 'TV Series', 
      icon: '📺', 
      title: 'Better Call Saul', 
      director: 'Vince Gilligan', 
      year: 2015, 
      rating: 5, 
      isFavorite: false, 
      genre: 'Crime',
      seasons: 6
    },
    { 
      id: 18, 
      type: 'TV Series', 
      icon: '📺', 
      title: 'Stranger Things', 
      director: 'Duffer Brothers', 
      year: 2016, 
      rating: 4, 
      isFavorite: false, 
      genre: 'Sci-Fi',
      seasons: 4
    },
  ];

  const recentMusic: RecentItem[] = [
    { 
      id: 19, 
      type: 'Music', 
      icon: '🎵', 
      title: 'Abbey Road', 
      artist: 'The Beatles', 
      year: 1969, 
      rating: 5, 
      isFavorite: false, 
      genre: 'Rock',
      album: 'Abbey Road'
    },
    { 
      id: 20, 
      type: 'Music', 
      icon: '🎵', 
      title: 'Dark Side of the Moon', 
      artist: 'Pink Floyd', 
      year: 1973, 
      rating: 5, 
      isFavorite: false, 
      genre: 'Rock',
      album: 'Dark Side of the Moon'
    },
    { 
      id: 21, 
      type: 'Music', 
      icon: '🎵', 
      title: 'Thriller', 
      artist: 'Michael Jackson', 
      year: 1982, 
      rating: 5, 
      isFavorite: true, 
      genre: 'Pop',
      album: 'Thriller'
    },
    { 
      id: 22, 
      type: 'Music', 
      icon: '🎵', 
      title: 'Back in Black', 
      artist: 'AC/DC', 
      year: 1980, 
      rating: 5, 
      isFavorite: false, 
      genre: 'Rock',
      album: 'Back in Black'
    },
    { 
      id: 23, 
      type: 'Music', 
      icon: '🎵', 
      title: 'Rumours', 
      artist: 'Fleetwood Mac', 
      year: 1977, 
      rating: 5, 
      isFavorite: false, 
      genre: 'Rock',
      album: 'Rumours'
    },
    { 
      id: 24, 
      type: 'Music', 
      icon: '🎵', 
      title: 'Nevermind', 
      artist: 'Nirvana', 
      year: 1991, 
      rating: 5, 
      isFavorite: false, 
      genre: 'Rock',
      album: 'Nevermind'
    },
  ];

  const getGenres = () => {
    switch (selectedType) {
      case 'Books': return bookGenres;
      case 'Movies': return movieGenres;
      case 'TV Series': return tvGenres;
      case 'Music': return musicGenres;
      default: return bookGenres;
    }
  };

  const getRecentItems = () => {
    switch (selectedType) {
      case 'Books': return recentBooks;
      case 'Movies': return recentMovies;
      case 'TV Series': return recentTvSeries;
      case 'Music': return recentMusic;
      default: return recentBooks;
    }
  };

  const handleCategoryClick = (type: 'Books' | 'Movies' | 'TV Series' | 'Music') => {
    setSelectedType(type);
  };

  const handleGenreClick = (genre: string) => {
    // Navigate to filtered library view
    console.log('Filter by genre:', genre);
    navigate('/my-library');
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleUpdateItem = (updatedItem: RecentItem) => {
    // Update logic buraya gelecek - şimdilik sadece modal'ı kapat
    console.log('Updated:', updatedItem);
    setSelectedItem(null);
  };

  const handleDeleteItem = (id: number) => {
    console.log('Deleted:', id);
    setSelectedItem(null);
  };

  const toggleFavorite = (id: number) => {
    console.log('Toggle favorite:', id);
  };

  return (
    <div className="categories-content">
      <div className="categories-header">
        <h1>Browse by Categories</h1>
        <p>Organize and explore your collection by type and category</p>
      </div>

      {/* Category Types */}
      <div className="category-grid">
        {categoryCounts.map((category) => (
          <button
            key={category.type}
            className={`category-card ${selectedType === category.type ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.type)}
          >
            <div className="category-icon">{category.icon}</div>
            <div className="category-info">
              <div className="category-name">{category.type}</div>
              <div className="category-count">{category.count}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Genre Section */}
      <div className="genre-section">
        <h2>All Categories: {selectedType}</h2>
        
        <div className="genre-title">
          {selectedType === 'Books' && 'Book Genres'}
          {selectedType === 'Movies' && 'Movie Genres'}
          {selectedType === 'TV Series' && 'TV Series Genres'}
          {selectedType === 'Music' && 'Music Genres'}
        </div>

        <div className="genre-list">
          {getGenres().map((genre, index) => (
            <button
              key={index}
              className="genre-item"
              onClick={() => handleGenreClick(genre.name)}
            >
              <span className="genre-name">{genre.name}</span>
              <span className="genre-count">{genre.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Items */}
      <div className="recent-section">
        <div className="recent-header">
          <h2>Recent in {selectedType}</h2>
          <select className="sort-select">
            <option>Sort by: Date Added</option>
            <option>Sort by: Title (A-Z)</option>
            <option>Sort by: Year</option>
          </select>
        </div>

        <div className="recent-grid">
          {getRecentItems().map((item) => (
            <div key={item.id} className="recent-card" onClick={() => setSelectedItem(item)}>
              <div className="recent-icon">{item.icon}</div>
              <div className="recent-title">{item.title}</div>
              {item.author && (
                <div className="recent-author">{item.author}</div>
              )}
              {item.director && (
                <div className="recent-author">{item.director}</div>
              )}
              {item.artist && (
                <div className="recent-author">{item.artist}</div>
              )}
              {item.year && (
                <div className="recent-year">{item.year}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={handleCloseModal}
          onUpdate={handleUpdateItem}
          onDelete={handleDeleteItem}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
};

export default Categories;