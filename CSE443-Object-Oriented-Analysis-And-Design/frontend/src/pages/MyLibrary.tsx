import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemDetailModal from '../components/ItemDetailModal';
import './MyLibrary.css';

interface LibraryItem {
  id: number;
  type: 'Book' | 'Movie' | 'TV Series' | 'Music';
  title: string;
  author?: string;
  director?: string;
  artist?: string;
  year?: number;
  rating: number;
  isFavorite: boolean;
  icon: string;
  // Additional fields for modal
  isbn?: string;
  publisher?: string;
  pages?: number;
  genre?: string;
  language?: string;
  format?: string;
  duration?: number;
  seasons?: number;
  album?: string;
  notes?: string;
}

const MyLibrary = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('All');
  const [activeFavoriteFilter, setActiveFavoriteFilter] = useState<string>('All Items');
  const itemsPerPage = 8;

  // Dummy data - Backend'den gelecek
  const [items, setItems] = useState<LibraryItem[]>([
    { 
      id: 1, 
      type: 'Book', 
      title: 'Atomic Habits', 
      author: 'James Clear', 
      year: 2018, 
      rating: 5, 
      isFavorite: false, 
      icon: '📖',
      isbn: '978-0-7352-1129-2',
      publisher: 'Avery',
      pages: 320,
      genre: 'Self-Help',
      language: 'English',
      format: 'Physical',
      notes: 'Great book about building habits!'
    },
    { 
      id: 2, 
      type: 'Movie', 
      title: 'Inception', 
      director: 'Christopher Nolan', 
      year: 2010, 
      rating: 5, 
      isFavorite: false, 
      icon: '🎥',
      duration: 148,
      genre: 'Sci-Fi',
      notes: 'Mind-bending thriller!'
    },
    { 
      id: 3, 
      type: 'TV Series', 
      title: 'Breaking Bad', 
      director: 'Vince Gilligan', 
      year: 2008, 
      rating: 5, 
      isFavorite: true, 
      icon: '📺',
      seasons: 5,
      genre: 'Crime',
      notes: 'Best TV series ever!'
    },
    { 
      id: 4, 
      type: 'Music', 
      title: 'Abbey Road', 
      artist: 'The Beatles', 
      year: 1969, 
      rating: 5, 
      isFavorite: false, 
      icon: '🎵',
      album: 'Abbey Road',
      genre: 'Rock',
      notes: 'Classic album!'
    },
    { 
      id: 5, 
      type: 'Book', 
      title: 'The Great Gatsby', 
      author: 'F. Scott Fitzgerald', 
      year: 1925, 
      rating: 4, 
      isFavorite: false, 
      icon: '📖',
      pages: 180,
      genre: 'Fiction',
      language: 'English'
    },
    { 
      id: 6, 
      type: 'Movie', 
      title: 'The Dark Knight', 
      director: 'Christopher Nolan', 
      year: 2008, 
      rating: 5, 
      isFavorite: false, 
      icon: '🎥',
      duration: 152,
      genre: 'Action'
    },
    { 
      id: 7, 
      type: 'Book', 
      title: '1984', 
      author: 'George Orwell', 
      year: 1949, 
      rating: 5, 
      isFavorite: true, 
      icon: '📖',
      pages: 328,
      genre: 'Fiction',
      language: 'English'
    },
    { 
      id: 8, 
      type: 'TV Series', 
      title: 'Game of Thrones', 
      director: 'David Benioff', 
      year: 2011, 
      rating: 4, 
      isFavorite: false, 
      icon: '📺',
      seasons: 8,
      genre: 'Fantasy'
    },
  ]);

  // Apply filters
  const filteredItems = items.filter(item => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(query);
      const authorMatch = item.author?.toLowerCase().includes(query);
      const directorMatch = item.director?.toLowerCase().includes(query);
      const artistMatch = item.artist?.toLowerCase().includes(query);
      const genreMatch = item.genre?.toLowerCase().includes(query);
      
      if (!titleMatch && !authorMatch && !directorMatch && !artistMatch && !genreMatch) {
        return false;
      }
    }

    // Type filter
    if (activeTypeFilter !== 'All') {
      const typeMap: { [key: string]: string } = {
        '📖 Books': 'Book',
        '🎥 Movies': 'Movie',
        '📺 TV Series': 'TV Series',
        '🎵 Music': 'Music',
      };
      if (item.type !== typeMap[activeTypeFilter]) return false;
    }

    // Favorite filter
    if (activeFavoriteFilter === '❤️ Favorites Only' && !item.isFavorite) {
      return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleExport = () => {
    // JSON formatında export
    const dataStr = JSON.stringify(items, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-library-export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAddNew = () => {
    navigate('/add-item');
  };

  const handleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleTypeFilter = (type: string) => {
    setActiveTypeFilter(type);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleFavoriteFilter = (filter: string) => {
    setActiveFavoriteFilter(filter);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const toggleFavorite = (id: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleUpdateItem = (updatedItem: LibraryItem) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    setSelectedItem(null);
  };

  const handleDeleteItem = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  return (
    <div className="my-library-content">
      <div className="library-header">
        <div className="header-left">
          <h1>My Library</h1>
          <div className="search-bar">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M14 14L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search your library"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-export" onClick={handleExport}>
            📤 Export
          </button>
          <button className="btn-add-new" onClick={handleAddNew}>
            + Add New Item
          </button>
          <button className="btn-filters" onClick={handleFilters}>
            🔍 Filters
          </button>
        </div>
      </div>

      {/* Filters Panel (collapsible) */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Type:</label>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${activeTypeFilter === 'All' ? 'active' : ''}`}
                onClick={() => handleTypeFilter('All')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${activeTypeFilter === '📖 Books' ? 'active' : ''}`}
                onClick={() => handleTypeFilter('📖 Books')}
              >
                📖 Books
              </button>
              <button 
                className={`filter-btn ${activeTypeFilter === '🎥 Movies' ? 'active' : ''}`}
                onClick={() => handleTypeFilter('🎥 Movies')}
              >
                🎥 Movies
              </button>
              <button 
                className={`filter-btn ${activeTypeFilter === '📺 TV Series' ? 'active' : ''}`}
                onClick={() => handleTypeFilter('📺 TV Series')}
              >
                📺 TV Series
              </button>
              <button 
                className={`filter-btn ${activeTypeFilter === '🎵 Music' ? 'active' : ''}`}
                onClick={() => handleTypeFilter('🎵 Music')}
              >
                🎵 Music
              </button>
            </div>
          </div>
          <div className="filter-group">
            <label>Show:</label>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${activeFavoriteFilter === 'All Items' ? 'active' : ''}`}
                onClick={() => handleFavoriteFilter('All Items')}
              >
                All Items
              </button>
              <button 
                className={`filter-btn ${activeFavoriteFilter === '❤️ Favorites Only' ? 'active' : ''}`}
                onClick={() => handleFavoriteFilter('❤️ Favorites Only')}
              >
                ❤️ Favorites Only
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="library-controls">
        <div className="view-toggle">
          <button className="view-btn active">📋</button>
          <button className="view-btn">📊</button>
        </div>
        <div className="sort-by">
          <label>Sort by:</label>
          <select>
            <option>Date Added (newest)</option>
            <option>Date Added (oldest)</option>
            <option>Title (A-Z)</option>
            <option>Title (Z-A)</option>
            <option>Rating (highest)</option>
            <option>Rating (lowest)</option>
          </select>
        </div>
      </div>

      <div className="library-grid">
        {currentItems.map((item) => (
          <div 
            key={item.id} 
            className="library-item"
            onClick={() => setSelectedItem(item)}
          >
            <div className="item-background">
              <div className="item-icon">{item.icon}</div>
            </div>
            <div className="item-badge">{item.type}</div>
            <div className="item-content">
              <h3>{item.title}</h3>
              <p className="item-meta">
                {item.author && `by ${item.author}`}
                {item.director && `by ${item.director}`}
                {item.artist && `by ${item.artist}`}
                {item.year && ` • ${item.year}`}
              </p>
              <div className="item-footer">
                <span className="item-rating">{renderStars(item.rating)}</span>
                <button
                  className={`btn-favorite ${item.isFavorite ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {item.isFavorite ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ← Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next →
        </button>
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

export default MyLibrary;