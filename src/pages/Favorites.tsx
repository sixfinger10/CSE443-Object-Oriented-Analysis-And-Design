import { useState, useEffect } from 'react';
import ItemDetailModal from '../components/ItemDetailModal';
import libraryService from '../services/library.service';
import './Favorites.css';

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
  notes?: string;
  isbn?: string;
  publisher?: string;
  pages?: number;
  language?: string;
  format?: string;
  duration?: number;
  seasons?: number;
  album?: string;
}

const Favorites = () => {
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [sortBy, setSortBy] = useState('date');
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading all items from backend...');

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

      const allItems: LibraryItem[] = [
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

      console.log('All items:', allItems);
      setItems(allItems);

    } catch (err: any) {
      console.error('Error loading favorites:', err);
      setError(err.message || 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  // Sadece favorileri filtrele
  const favoriteItems = items.filter(item => item.isFavorite);

  console.log('Favorite items:', favoriteItems);

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

  const handleDeleteItem = async (id: number) => {
    try {
      await libraryService.deleteItem(id);
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  // TOGGLE FAVORITE - UPDATED WITH ERROR HANDLING
  const toggleFavorite = async (id: number) => {
  const item = items.find(i => i.id === id);
  if (!item) return;

  const previousFavoriteStatus = item.isFavorite;

  try {
    console.log('🔄 Toggle favorite for item:', id, 'Current status:', previousFavoriteStatus);

    // 1. Optimistic update
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );

    // 2. Backend call
    const response = await libraryService.toggleFavorite(id);
    
    console.log('✅ Backend response:', response);

    // 3. Backend response ile güncelle
    if (response) {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { 
            ...item, 
            isFavorite: response.favorite !== undefined ? response.favorite : response.isFavorite 
          } : item
        )
      );
      console.log('✅ Favorite toggled successfully');
    }

  } catch (error: any) {
    console.error('❌ Error toggling favorite:', error);
    
    // Geri al
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isFavorite: previousFavoriteStatus } : item
      )
    );
    
    alert(error.message || 'Failed to toggle favorite. Please try again.');
  }
};

  const sortFavorites = (items: LibraryItem[]) => {
    const sorted = [...items];
    
    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => b.id - a.id);
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'type':
        return sorted.sort((a, b) => a.type.localeCompare(b.type));
      default:
        return sorted;
    }
  };

  const sortedFavorites = sortFavorites(favoriteItems);

  const booksPercentage = favoriteItems.length > 0 
    ? Math.round((favoriteItems.filter(i => i.type === 'Book').length / favoriteItems.length) * 100)
    : 0;

  const renderStars = (rating: number): string => {
    return '⭐'.repeat(rating);
  };

  if (loading) {
    return (
      <div className="favorites-content">
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
          <p style={{ color: '#718096', fontSize: '14px' }}>Loading favorites...</p>
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

  if (error) {
    return (
      <div className="favorites-content">
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
            Error Loading Favorites
          </h3>
          <p style={{ color: '#718096', marginBottom: '24px' }}>{error}</p>
          <button 
            onClick={loadFavorites}
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
    <div className="favorites-content">
      <div className="favorites-header">
        <h1>My Favorites ❤️</h1>
        <p>Your most loved items from your library</p>
      </div>

      <div className="favorites-stats">
        <div className="stat-box">
          <div className="stat-icon">❤️</div>
          <div className="stat-info">
            <div className="stat-value">{favoriteItems.length}</div>
            <div className="stat-label">Total Favorites</div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <div className="stat-value">{favoriteItems.length}</div>
            <div className="stat-label">This Month</div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <div className="stat-value">{booksPercentage}%</div>
            <div className="stat-label">Books</div>
          </div>
        </div>
      </div>

      <div className="favorites-controls">
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Date Added</option>
          <option value="title">Title (A-Z)</option>
          <option value="rating">Rating (highest)</option>
          <option value="type">Type</option>
        </select>
      </div>

      <div className="favorites-list">
        {sortedFavorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💔</div>
            <h3>No favorites yet</h3>
            <p>Start adding items to your favorites from My Library!</p>
          </div>
        ) : (
          sortedFavorites.map((item) => (
            <div key={item.id} className="favorite-item">
              <div className="item-icon-container">
                <div className="item-icon">{item.icon}</div>
              </div>
              <div className="item-details">
                <h3>{item.title}</h3>
                <p className="item-meta">
                  {item.author && `by ${item.author}`}
                  {item.director && `by ${item.director}`}
                  {item.artist && `by ${item.artist}`}
                  {item.creator && `by ${item.creator}`}
                  {item.year && ` • ${item.year}`}
                </p>
                <div className="item-tags">
                  <span className="type-tag">{item.type}</span>
                  {item.genre && <span className="genre-tag">{item.genre}</span>}
                  <span className="rating-tag">{renderStars(item.rating)}</span>
                </div>
              </div>
              <div className="item-actions">
                <button 
                  className="action-icon-btn favorite-btn active"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  title="Remove from favorites"
                >
                  ❤️
                </button>
                <button 
                  className="action-icon-btn"
                  onClick={() => setSelectedItem(item)}
                  title="View details"
                >
                  👁️
                </button>
                <button 
                  className="action-icon-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
                      handleDeleteItem(item.id);
                    }
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

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

export default Favorites;