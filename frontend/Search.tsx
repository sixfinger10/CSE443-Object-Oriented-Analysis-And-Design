import { useState, useEffect } from 'react';
import ItemDetailModal from '../components/ItemDetailModal';
import './Search.css';

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
  genre?: string;
  isbn?: string;
  publisher?: string;
  pages?: number;
  language?: string;
  format?: string;
  duration?: number;
  seasons?: number;
  album?: string;
  notes?: string;
}

interface Filter {
  id: string;
  label: string;
  type: 'genre' | 'year' | 'type';
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([
    { id: '1', label: 'Genre: Sci-Fi', type: 'genre' },
    { id: '2', label: 'Year: 2008-2020', type: 'year' },
  ]);

  // Dummy data - gerçekte backend'den gelecek
  const [allItems] = useState<LibraryItem[]>([
    { 
      id: 1, 
      type: 'Movie', 
      title: 'Inception', 
      director: 'Christopher Nolan', 
      year: 2010, 
      rating: 5, 
      isFavorite: false, 
      icon: '🎥',
      genre: 'Sci-Fi',
      duration: 148,
      notes: 'Mind-bending thriller!'
    },
    { 
      id: 2, 
      type: 'Movie', 
      title: 'The Dark Knight', 
      director: 'Christopher Nolan', 
      year: 2008, 
      rating: 5, 
      isFavorite: false, 
      icon: '🎥',
      genre: 'Action',
      duration: 152
    },
    { 
      id: 3, 
      type: 'Movie', 
      title: 'Interstellar', 
      director: 'Christopher Nolan', 
      year: 2014, 
      rating: 5, 
      isFavorite: true, 
      icon: '🎥',
      genre: 'Sci-Fi',
      duration: 169
    },
  ]);

  const [searchResults, setSearchResults] = useState<LibraryItem[]>(allItems);

  useEffect(() => {
    // Search ve filter logic - gerçekte backend'de olacak
    let filtered = allItems;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.director?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artist?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setSearchResults(filtered);
  }, [searchQuery, allItems]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveFilters([]);
  };

  const removeFilter = (id: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== id));
  };

  const handleView = (item: LibraryItem) => {
    setSelectedItem(item);
  };

  const handleEdit = (item: LibraryItem) => {
    // Edit functionality - modal'da edit mode açılacak
    setSelectedItem(item);
  };

  const toggleFavorite = (id: number) => {
    setSearchResults(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleUpdateItem = (updatedItem: LibraryItem) => {
    setSearchResults(prev =>
      prev.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    setSelectedItem(null);
  };

  const handleDeleteItem = (id: number) => {
    setSearchResults(prev => prev.filter(item => item.id !== id));
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  return (
    <div className="search-content">
      <div className="search-header">
        <h1>Search Results</h1>
        <button className="btn-clear-search" onClick={handleClearSearch}>
          ✕ Clear Search
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M14 14L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, author, director..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>Found <strong>{searchResults.length}</strong> results matching your search criteria</p>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="active-filters">
          <span className="filters-label">Active Filters:</span>
          {activeFilters.map((filter) => (
            <button
              key={filter.id}
              className="filter-chip"
              onClick={() => removeFilter(filter.id)}
            >
              {filter.label}
              <span className="chip-close">✕</span>
            </button>
          ))}
        </div>
      )}

      {/* Search Results */}
      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map((item) => (
            <div key={item.id} className="result-item">
              <div className="result-icon-container">
                <div className="result-icon">{item.icon}</div>
              </div>
              <div className="result-content">
                <div className="result-header">
                  <h3>{item.title}</h3>
                  <span className="result-type-badge">{item.type}</span>
                </div>
                <p className="result-meta">
                  {item.director && `Director: ${item.director}`}
                  {item.author && `Author: ${item.author}`}
                  {item.artist && `Artist: ${item.artist}`}
                  {item.year && ` • ${item.year}`}
                  {item.duration && ` • ${item.duration} min`}
                </p>
                <p className="result-genre">
                  {item.genre && `Genre: ${item.genre}`}
                  {item.rating && ` • Rating: ${renderStars(item.rating)}`}
                </p>
              </div>
              <div className="result-actions">
                <button className="btn-action" onClick={() => handleView(item)}>
                  👁️ View
                </button>
                <button className="btn-action" onClick={() => handleEdit(item)}>
                  ✏️ Edit
                </button>
                <button
                  className={`btn-action ${item.isFavorite ? 'favorite-active' : ''}`}
                  onClick={() => toggleFavorite(item.id)}
                >
                  {item.isFavorite ? '❤️ Favorite' : '🤍 Favorite'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>🔍 No results found. Try adjusting your search or filters.</p>
          </div>
        )}
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

export default Search;