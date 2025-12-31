import { useState } from 'react';
import ItemDetailModal from '../components/ItemDetailModal';
import './Favorites.css';

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
  status?: string;
}

const Favorites = () => {
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [activeTab, setActiveTab] = useState<'favorites' | 'reading' | 'watching'>('favorites');

  // Dummy data - Backend'den gelecek
  const [items, setItems] = useState<LibraryItem[]>([
    { 
      id: 1, 
      type: 'Book', 
      title: 'Atomic Habits', 
      author: 'James Clear', 
      year: 2018, 
      rating: 5, 
      isFavorite: true, 
      icon: '📖',
      genre: 'Self-Help',
      status: 'Read'
    },
    { 
      id: 2, 
      type: 'Movie', 
      title: 'Inception', 
      director: 'Christopher Nolan', 
      year: 2010, 
      rating: 5, 
      isFavorite: true, 
      icon: '🎥',
      genre: 'Sci-Fi',
      status: 'Watched'
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
      status: 'Completed'
    },
    { 
      id: 4, 
      type: 'Book', 
      title: 'The Great Gatsby', 
      author: 'F. Scott Fitzgerald', 
      year: 1925, 
      rating: 4, 
      isFavorite: true, 
      icon: '📖',
      genre: 'Fiction',
      status: 'Read'
    },
    { 
      id: 5, 
      type: 'Movie', 
      title: 'The Dark Knight', 
      director: 'Christopher Nolan', 
      year: 2008, 
      rating: 5, 
      isFavorite: true, 
      icon: '🎥',
      genre: 'Action',
      status: 'Watched'
    },
  ]);

  const favoriteItems = items.filter(item => item.isFavorite);
  const readingList = items.filter(item => item.type === 'Book' && item.status !== 'Read');
  const watchingList = items.filter(item => (item.type === 'Movie' || item.type === 'TV Series') && item.status !== 'Completed');

  const bookCount = favoriteItems.filter(item => item.type === 'Book').length;
  const bookPercentage = favoriteItems.length > 0 ? Math.round((bookCount / favoriteItems.length) * 100) : 0;

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

  const toggleFavorite = (id: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const statusColors: { [key: string]: string } = {
      'Read': 'status-read',
      'Watched': 'status-watched',
      'Completed': 'status-completed',
      'Reading': 'status-reading',
      'Watching': 'status-watching',
    };

    return <span className={`status-badge ${statusColors[status] || ''}`}>{status}</span>;
  };

  return (
    <div className="favorites-content">
      <h1>Favorites & Lists</h1>

      {/* Tabs */}
      <div className="favorites-tabs">
        <button 
          className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          ❤️ Favorites
          <span className="tab-count">{favoriteItems.length}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reading' ? 'active' : ''}`}
          onClick={() => setActiveTab('reading')}
        >
          📖 Reading List
          <span className="tab-count">{readingList.length}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'watching' ? 'active' : ''}`}
          onClick={() => setActiveTab('watching')}
        >
          📺 Watching List
          <span className="tab-count">{watchingList.length}</span>
        </button>
      </div>

      {/* Stats */}
      {activeTab === 'favorites' && (
        <div className="favorites-stats">
          <div className="stat-box">
            <div className="stat-number">{favoriteItems.length}</div>
            <div className="stat-label">Total Favorites</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">28</div>
            <div className="stat-label">This Month</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{bookPercentage}%</div>
            <div className="stat-label">Books</div>
          </div>
        </div>
      )}

      {/* Items List Header */}
      <div className="list-header">
        <h2>
          {activeTab === 'favorites' && 'My Favorite Items'}
          {activeTab === 'reading' && 'My Reading List'}
          {activeTab === 'watching' && 'My Watching List'}
        </h2>
        <div className="sort-control">
          <label>Sort by:</label>
          <select>
            <option>Date Added</option>
            <option>Title (A-Z)</option>
            <option>Rating (highest)</option>
            <option>Type</option>
          </select>
        </div>
      </div>

      {/* Items List */}
      <div className="favorites-list">
        {activeTab === 'favorites' && favoriteItems.map((item) => (
          <div key={item.id} className="favorite-item">
            <div className="item-icon-container">
              <div className="item-icon">{item.icon}</div>
            </div>
            <div className="item-details">
              <h3>{item.title}</h3>
              <p className="item-meta">
                {item.author && `${item.author}`}
                {item.director && `${item.director}`}
                {item.artist && `${item.artist}`}
                {item.year && ` • ${item.year}`}
              </p>
              <div className="item-tags">
                {item.genre && <span className="genre-tag">{item.genre}</span>}
                {item.type && <span className="type-tag">{item.type}</span>}
                {getStatusBadge(item.status)}
              </div>
            </div>
            <div className="item-actions">
              <button 
                className="action-icon-btn favorite-btn active"
                onClick={() => toggleFavorite(item.id)}
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
                onClick={() => handleDeleteItem(item.id)}
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        {activeTab === 'reading' && readingList.length > 0 && readingList.map((item) => (
          <div key={item.id} className="favorite-item">
            <div className="item-icon-container">
              <div className="item-icon">{item.icon}</div>
            </div>
            <div className="item-details">
              <h3>{item.title}</h3>
              <p className="item-meta">
                {item.author && `${item.author}`}
                {item.year && ` • ${item.year}`}
              </p>
              <div className="item-tags">
                {item.genre && <span className="genre-tag">{item.genre}</span>}
                {getStatusBadge(item.status)}
              </div>
            </div>
            <div className="item-actions">
              <button 
                className="action-icon-btn"
                onClick={() => setSelectedItem(item)}
                title="View details"
              >
                👁️
              </button>
            </div>
          </div>
        ))}

        {activeTab === 'watching' && watchingList.length > 0 && watchingList.map((item) => (
          <div key={item.id} className="favorite-item">
            <div className="item-icon-container">
              <div className="item-icon">{item.icon}</div>
            </div>
            <div className="item-details">
              <h3>{item.title}</h3>
              <p className="item-meta">
                {item.director && `${item.director}`}
                {item.year && ` • ${item.year}`}
              </p>
              <div className="item-tags">
                {item.genre && <span className="genre-tag">{item.genre}</span>}
                {item.type && <span className="type-tag">{item.type}</span>}
                {getStatusBadge(item.status)}
              </div>
            </div>
            <div className="item-actions">
              <button 
                className="action-icon-btn"
                onClick={() => setSelectedItem(item)}
                title="View details"
              >
                👁️
              </button>
            </div>
          </div>
        ))}

        {/* Empty States */}
        {activeTab === 'favorites' && favoriteItems.length === 0 && (
          <div className="empty-state">
            <p>❤️ No favorite items yet. Start adding items to your favorites!</p>
          </div>
        )}

        {activeTab === 'reading' && readingList.length === 0 && (
          <div className="empty-state">
            <p>📖 Your reading list is empty. Add books you want to read!</p>
          </div>
        )}

        {activeTab === 'watching' && watchingList.length === 0 && (
          <div className="empty-state">
            <p>📺 Your watching list is empty. Add movies or TV series to watch!</p>
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

export default Favorites;