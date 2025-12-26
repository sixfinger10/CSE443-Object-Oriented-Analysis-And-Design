import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemDetailModal from '../components/ItemDetailModal';
import './Dashboard.css';

interface DashboardItem {
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
  // Additional fields for modal
  isbn?: string;
  publisher?: string;
  pages?: number;
  language?: string;
  format?: string;
  duration?: number;
  seasons?: number;
  album?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);

  // Recent items with full data for modal
  const recentItems: DashboardItem[] = [
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
      type: 'Movie',
      icon: '🎥',
      title: 'Inception',
      director: 'Christopher Nolan',
      year: 2010,
      rating: 5,
      isFavorite: false,
      genre: 'Sci-Fi',
      duration: 148,
      notes: 'Mind-bending thriller!'
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
      notes: 'Best TV series ever!'
    },
    {
      id: 4,
      type: 'Music',
      icon: '🎵',
      title: 'Abbey Road',
      artist: 'The Beatles',
      year: 1969,
      rating: 5,
      isFavorite: false,
      genre: 'Rock',
      album: 'Abbey Road',
      notes: 'Classic album!'
    },
  ];

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleUpdateItem = (updatedItem: DashboardItem) => {
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
    <div className="dashboard-content">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome Back, Sarah! 👋</h1>
          <p>Here's what's happening with your library today</p>
        </div>
        <button className="btn-add-new" onClick={() => navigate('/add-item')}>
          + Add New Item
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <div className="stat-value">248</div>
            <div className="stat-label">Total Items</div>
          </div>
          <div className="stat-trend positive">+12 this month</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📖</div>
          <div className="stat-info">
            <div className="stat-value">142</div>
            <div className="stat-label">Books</div>
          </div>
          <div className="stat-trend positive">+8 this month</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎥</div>
          <div className="stat-info">
            <div className="stat-value">58</div>
            <div className="stat-label">Movies</div>
          </div>
          <div className="stat-trend positive">+3 this month</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-info">
            <div className="stat-value">42</div>
            <div className="stat-label">Favorites</div>
          </div>
          <div className="stat-trend neutral">Same as last month</div>
        </div>
      </div>

      {/* Recent Additions */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Recent Additions</h2>
          <button className="view-all-btn" onClick={() => navigate('/my-library')}>View All →</button>
        </div>
        <div className="recent-items-grid">
          {recentItems.map((item) => (
            <div 
              key={item.id} 
              className="recent-item"
              onClick={() => setSelectedItem(item)}
            >
              <div className="item-icon">{item.icon}</div>
              <div className="item-details">
                <h3>{item.title}</h3>
                <p>
                  {item.author && `${item.author}`}
                  {item.director && `${item.director}`}
                  {item.artist && `${item.artist}`}
                  {item.year && ` • ${item.year}`}
                </p>
                <span className="item-type">{item.type}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-action-grid">
          <button className="quick-action-card" onClick={() => navigate('/add-item')}>
            <span className="quick-icon">📖</span>
            <span className="quick-label">Add Book</span>
          </button>
          <button className="quick-action-card" onClick={() => navigate('/add-item')}>
            <span className="quick-icon">🎥</span>
            <span className="quick-label">Add Movie</span>
          </button>
          <button className="quick-action-card" onClick={() => navigate('/add-item')}>
            <span className="quick-icon">📺</span>
            <span className="quick-label">Add TV Series</span>
          </button>
          <button className="quick-action-card" onClick={() => navigate('/add-item')}>
            <span className="quick-icon">🎵</span>
            <span className="quick-label">Add Music</span>
          </button>
        </div>
      </section>

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

export default Dashboard;