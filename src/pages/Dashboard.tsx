import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemDetailModal from '../components/ItemDetailModal';
import libraryService from '../services/library.service';
import './Dashboard.css';

interface DashboardItem {
  id: number;
  type: 'Book' | 'Movie' | 'TV Series' | 'Music';
  icon: string;
  title: string;
  author?: string;
  director?: string;
  artist?: string;
  creator?: string;
  year?: number;
  rating: number;
  isFavorite: boolean;
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

interface DashboardStats {
  totalItems: number;
  totalBooks: number;
  totalMovies: number;
  totalSeries: number;
  totalMusic: number;
  totalFavorites: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { username: 'User' };
  
  console.log('👤 Dashboard - Logged in user:', user);
  
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    totalBooks: 0,
    totalMovies: 0,
    totalSeries: 0,
    totalMusic: 0,
    totalFavorites: 0,
  });
  
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📦 Loading dashboard data...');
      
      // Stats yükle
      const statsData = await libraryService.getDashboardStats();
      console.log('✅ Stats loaded:', statsData);
      setStats(statsData);
      
      // ✅ Backend'den tüm itemları çek (MyLibrary gibi)
      try {
        console.log('📚 Fetching all items from backend...');
        
        const [books, movies, series, music] = await Promise.all([
          libraryService.getAllBooks().catch(() => []),
          libraryService.getAllMovies().catch(() => []),
          libraryService.getAllTVSeries().catch(() => []),
          libraryService.getAllMusic().catch(() => [])
        ]);
        
        console.log('📖 Books:', books);
        console.log('🎥 Movies:', movies);
        console.log('📺 TV Series:', series);
        console.log('🎵 Music:', music);
        
        // Tüm itemları birleştir ve type ekle
        const allItems = [
          ...books.map((item: any) => ({ 
            ...item, 
            type: 'BOOK',
            icon: '📖'
          })),
          ...movies.map((item: any) => ({ 
            ...item, 
            type: 'MOVIE',
            icon: '🎥'
          })),
          ...series.map((item: any) => ({ 
            ...item, 
            type: 'TV_SERIES',
            icon: '📺'
          })),
          ...music.map((item: any) => ({ 
            ...item, 
            type: 'MUSIC',
            icon: '🎵'
          }))
        ];
        
        console.log('📋 All items combined:', allItems);
        console.log('🔢 Total items count:', allItems.length);
        
        if (allItems.length > 0) {
          console.log('📝 First item sample:', JSON.stringify(allItems[0], null, 2));
          
          // Son 4 item'ı al (createdAt veya dateAdded'a göre sırala)
          const sortedItems = allItems
            .sort((a: any, b: any) => {
              // Backend'den gelen timestamp field'ını kontrol et
              const dateA = new Date(a.createdAt || a.dateAdded || a.created_at || 0).getTime();
              const dateB = new Date(b.createdAt || b.dateAdded || b.created_at || 0).getTime();
              console.log(`⚖️ Sorting: "${a.title}" (${new Date(dateA).toISOString()}) vs "${b.title}" (${new Date(dateB).toISOString()})`);
              return dateB - dateA; // En yeniler önce
            })
            .slice(0, 4); // İlk 4'ünü al
          
          console.log('✅ Recent items (sorted, top 4):', sortedItems);
          setRecentItems(sortedItems);
        } else {
          console.log('⚠️ No items found in backend response');
          setRecentItems([]);
        }
      } catch (itemsError: any) {
        console.error('❌ Error loading items:', itemsError);
        console.error('❌ Error details:', itemsError.response?.data || itemsError.message);
        setRecentItems([]);
      }
      
    } catch (err: any) {
      console.error('❌ Error loading dashboard:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
      console.log('✅ Dashboard loading complete');
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'BOOK': return '📖';
      case 'MOVIE': return '🎥';
      case 'TV_SERIES': return '📺';
      case 'MUSIC': return '🎵';
      default: return '📄';
    }
  };

  const formatItemType = (type: string) => {
    switch (type) {
      case 'BOOK': return 'Book';
      case 'MOVIE': return 'Movie';
      case 'TV_SERIES': return 'TV Series';
      case 'MUSIC': return 'Music';
      default: return type;
    }
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleUpdateItem = (updatedItem: DashboardItem) => {
    console.log('Updated:', updatedItem);
    setSelectedItem(null);
    loadDashboardData();
  };

  const handleDeleteItem = (id: number) => {
    console.log('Deleted:', id);
    setSelectedItem(null);
    loadDashboardData();
  };

  const toggleFavorite = (id: number) => {
    console.log('Toggle favorite:', id);
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="dashboard-content">
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
          <p style={{ color: '#718096', fontSize: '14px' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-content">
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>
            Error Loading Dashboard
          </h3>
          <p style={{ color: '#718096', marginBottom: '24px' }}>{error}</p>
          <button 
            onClick={loadDashboardData}
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
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div>
          <h1>Welcome Back, {user.username}! 👋</h1>
          <p>Here's what's happening with your library today</p>
        </div>
        <button className="btn-add-new" onClick={() => navigate('/add-item')}>
          + Add New Item
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalItems}</div>
            <div className="stat-label">Total Items</div>
          </div>
          <div className="stat-trend positive">
            {stats.totalItems > 0 ? `${stats.totalItems} items` : 'Start adding items'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📖</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalBooks}</div>
            <div className="stat-label">Books</div>
          </div>
          <div className="stat-trend positive">
            {stats.totalBooks > 0 ? `${stats.totalBooks} books` : 'No books yet'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalMovies}</div>
            <div className="stat-label">Movies</div>
          </div>
          <div className="stat-trend positive">
            {stats.totalMovies > 0 ? `${stats.totalMovies} movies` : 'No movies yet'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalFavorites}</div>
            <div className="stat-label">Favorites</div>
          </div>
          <div className="stat-trend neutral">
            {stats.totalFavorites > 0 ? `${stats.totalFavorites} favorites` : 'No favorites yet'}
          </div>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Recent Additions</h2>
          <button className="view-all-btn" onClick={() => navigate('/my-library')}>View All →</button>
        </div>
        
        {recentItems.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '60px 20px',
            textAlign: 'center',
            border: '2px dashed #e2e8f0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>
              No Items Yet
            </h3>
            <p style={{ color: '#718096', marginBottom: '24px' }}>
              Start building your library by adding your first item!
            </p>
            <button 
              onClick={() => navigate('/add-item')}
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
              + Add First Item
            </button>
          </div>
        ) : (
          <div className="recent-items-grid">
            {recentItems.map((item) => (
              <div 
                key={item.id} 
                className="recent-item"
                onClick={() => setSelectedItem(item)}
              >
                <div className="item-icon">{getItemIcon(item.type)}</div>
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p>
                    {item.author && `${item.author}`}
                    {item.director && `${item.director}`}
                    {item.artist && `${item.artist}`}
                    {item.creator && `${item.creator}`}
                    {(item.publicationYear || item.releaseYear) && ` • ${item.publicationYear || item.releaseYear}`}
                  </p>
                  <span className="item-type">{formatItemType(item.type)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={handleCloseModal}
          onUpdate={handleUpdateItem}
          onDelete={handleDeleteItem}
          onToggleFavorite={toggleFavorite}
        />
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;