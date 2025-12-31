import { useState, useEffect } from 'react';
import ItemDetailModal from '../components/ItemDetailModal';
import libraryService from '../services/library.service';
import './Search.css';

interface LibraryItem {
  id: number;
  type: 'Book' | 'Movie' | 'TV Series' | 'Music';
  title: string;
  author?: string;
  director?: string;
  artist?: string;
  creator?: string;
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
  value: string;
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [allItems, setAllItems] = useState<LibraryItem[]>([]);
  const [searchResults, setSearchResults] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all items from backend
  useEffect(() => {
    loadAllItems();
  }, []);

  const loadAllItems = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading all items from backend...');

      // Fetch all items from backend
      const [books, movies, series, music] = await Promise.all([
        libraryService.getAllBooks().catch(() => []),
        libraryService.getAllMovies().catch(() => []),
        libraryService.getAllTVSeries().catch(() => []),
        libraryService.getAllMusic().catch(() => [])
      ]);

      console.log('Books:', books);
      console.log('Movies:', movies);
      console.log('Series:', series);
      console.log('Music:', music);

      // Map all items to LibraryItem format
      const items: LibraryItem[] = [
        ...books.map((item: any) => ({
          ...item,
          type: 'Book' as const,
          icon: '📖',
          isFavorite: item.favorite || false
        })),
        ...movies.map((item: any) => ({
          ...item,
          type: 'Movie' as const,
          icon: '🎥',
          isFavorite: item.favorite || false
        })),
        ...series.map((item: any) => ({
          ...item,
          type: 'TV Series' as const,
          icon: '📺',
          isFavorite: item.favorite || false
        })),
        ...music.map((item: any) => ({
          ...item,
          type: 'Music' as const,
          icon: '🎵',
          isFavorite: item.favorite || false
        }))
      ];

      console.log('All items loaded:', items.length);
      setAllItems(items);
      setSearchResults(items); // Initially show all items

    } catch (err: any) {
      console.error('Error loading items:', err);
      setError(err.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  // Search and filter logic
  useEffect(() => {
    let filtered = [...allItems];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.author?.toLowerCase().includes(query) ||
        item.director?.toLowerCase().includes(query) ||
        item.artist?.toLowerCase().includes(query) ||
        item.creator?.toLowerCase().includes(query) ||
        item.genre?.toLowerCase().includes(query)
      );
    }

    // Apply active filters
    activeFilters.forEach(filter => {
      if (filter.type === 'genre') {
        filtered = filtered.filter(item => 
          item.genre?.toLowerCase() === filter.value.toLowerCase()
        );
      } else if (filter.type === 'year') {
        const [startYear, endYear] = filter.value.split('-').map(Number);
        filtered = filtered.filter(item => 
          item.year && item.year >= startYear && item.year <= endYear
        );
      } else if (filter.type === 'type') {
        filtered = filtered.filter(item => 
          item.type === filter.value
        );
      }
    });

    console.log('Filtered results:', filtered.length);
    setSearchResults(filtered);
  }, [searchQuery, activeFilters, allItems]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveFilters([]);
  };

  const addFilter = (label: string, type: 'genre' | 'year' | 'type', value: string) => {
    const newFilter: Filter = {
      id: Date.now().toString(),
      label,
      type,
      value
    };
    setActiveFilters(prev => [...prev, newFilter]);
  };

  const removeFilter = (id: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== id));
  };

  const handleView = (item: LibraryItem) => {
    setSelectedItem(item);
  };

  const handleEdit = (item: LibraryItem) => {
    setSelectedItem(item);
  };

  // Toggle favorite with backend
  const toggleFavorite = async (id: number) => {
    const item = allItems.find(i => i.id === id);
    if (!item) return;

    const previousFavoriteStatus = item.isFavorite;

    try {
      console.log('Toggle favorite for item:', id, 'Current status:', previousFavoriteStatus);

      // Optimistic update
      setAllItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        )
      );

      setSearchResults(prevResults =>
        prevResults.map(item =>
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        )
      );

      // Backend call
      const response = await libraryService.toggleFavorite(id);
      
      console.log('Backend response:', response);

      // Sync with backend response
      if (response) {
        const newFavoriteStatus = response.favorite !== undefined ? response.favorite : response.isFavorite;
        
        setAllItems(prevItems =>
          prevItems.map(item =>
            item.id === id ? { ...item, isFavorite: newFavoriteStatus } : item
          )
        );

        setSearchResults(prevResults =>
          prevResults.map(item =>
            item.id === id ? { ...item, isFavorite: newFavoriteStatus } : item
          )
        );

        console.log('Favorite toggled successfully');
      }

    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      
      // Rollback on error
      setAllItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, isFavorite: previousFavoriteStatus } : item
        )
      );

      setSearchResults(prevResults =>
        prevResults.map(item =>
          item.id === id ? { ...item, isFavorite: previousFavoriteStatus } : item
        )
      );
      
      alert(error.message || 'Failed to toggle favorite. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleUpdateItem = (updatedItem: LibraryItem) => {
    setAllItems(prevItems =>
      prevItems.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    setSearchResults(prevResults =>
      prevResults.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    setSelectedItem(null);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await libraryService.deleteItem(id);
      
      setAllItems(prevItems => prevItems.filter(item => item.id !== id));
      setSearchResults(prevResults => prevResults.filter(item => item.id !== id));
      
      console.log('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  // Loading state
  if (loading) {
    return (
      <div className="search-content">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#718096', fontSize: '14px' }}>Loading your library...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="search-content">
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          margin: '40px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>
            Error Loading Library
          </h3>
          <p style={{ color: '#718096', marginBottom: '24px' }}>{error}</p>
          <button 
            onClick={loadAllItems}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          placeholder="Search by title, author, director, artist, genre..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>Found <strong>{searchResults.length}</strong> results{searchQuery && ` for "${searchQuery}"`}</p>
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
                  {item.creator && `Creator: ${item.creator}`}
                  {item.year && ` • ${item.year}`}
                  {item.duration && ` • ${item.duration} min`}
                  {item.seasons && ` • ${item.seasons} seasons`}
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
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3>No results found</h3>
            <p>Try adjusting your search or filters</p>
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