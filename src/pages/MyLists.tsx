import { useState, useEffect } from 'react';
import ItemDetailModal from '../components/ItemDetailModal';
import libraryService from '../services/library.service';
import './MyLists.css';

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
  status?: string;
  
  // Book Progress
  currentPage?: number;
  totalPages?: number;
  
  // Movie Progress
  currentSecond?: number;
  totalSeconds?: number;
  
  // TV Series Progress
  currentSeason?: number;
  currentEpisode?: number;
  totalSeasons?: number;
  totalEpisodes?: number;
  
  // ✅ Music Progress - EKSİKTİ, EKLENDI!
  currentTrack?: number;      // ✅ EKLE
  totalTracks?: number;       // ✅ EKLE
  currentTrackSecond?: number;  // ✅ EKLE (Opsiyonel - şu an kullanılmıyor)
  totalTrackSeconds?: number;   // ✅ EKLE (Opsiyonel - şu an kullanılmıyor)
  
  // Common
  progress?: number;
  album?: string;
}

type ListType = 
  | 'currently-reading'
  | 'read-books'
  | 'currently-watching-movies'
  | 'watched-movies'
  | 'currently-watching-series'
  | 'watched-series'
  | 'currently-listening'
  | 'listened';

const MyLists = () => {
  const [activeList, setActiveList] = useState<ListType>('currently-reading');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [items, setItems] = useState<LibraryItem[]>([]);
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

      // Map backend status to frontend status
      const mapStatus = (backendStatus: string, type: string) => {
        if (backendStatus === 'IN_PROGRESS') {
          if (type === 'Book') return 'Reading';
          if (type === 'Movie') return 'Watching';
          if (type === 'TV Series') return 'Watching';
          if (type === 'Music') return 'Listening';
        }
        if (backendStatus === 'COMPLETED') {
          if (type === 'Book') return 'Read';
          if (type === 'Movie') return 'Watched';
          if (type === 'TV Series') return 'Completed';
          if (type === 'Music') return 'Listened';
        }
        return backendStatus;
      };

      const allItems: LibraryItem[] = [
        ...books.map((item: any) => ({
          ...item,
          type: 'Book' as const,
          icon: '📖',
          isFavorite: item.favorite || false,
          status: mapStatus(item.status || 'WISHLIST', 'Book'),
          totalPages: item.pageCount,
          currentPage: item.currentPage || undefined,
          progress: item.currentPage && item.pageCount 
            ? Math.round((item.currentPage / item.pageCount) * 100) 
            : undefined
        })),
        ...movies.map((item: any) => ({
          ...item,
          type: 'Movie' as const,
          icon: '🎥',
          isFavorite: item.favorite || false,
          status: mapStatus(item.status || 'WISHLIST', 'Movie'),
          totalSeconds: item.durationMinutes ? item.durationMinutes * 60 : undefined,
          currentSecond: item.currentSecond || undefined,
          progress: item.currentSecond && item.durationMinutes
            ? Math.round((item.currentSecond / (item.durationMinutes * 60)) * 100)
            : undefined
        })),
        ...series.map((item: any) => ({
          ...item,
          type: 'TV Series' as const,
          icon: '📺',
          isFavorite: item.favorite || false,
          status: mapStatus(item.status || 'WISHLIST', 'TV Series'),
          director: item.creator,
          totalSeasons: item.seasonCount,
          totalEpisodes: item.episodeCount,
          currentSeason: item.currentSeason || undefined,
          currentEpisode: item.currentEpisode || undefined,
          progress: item.progress || undefined
        })),
        ...music.map((item: any) => ({
          ...item,
          type: 'Music' as const,
          icon: '🎵',
          isFavorite: item.favorite || false,
          status: mapStatus(item.status || 'WISHLIST', 'Music'),
          totalTracks: item.trackCount,
          currentTrack: item.currentTrack || undefined,
          progress: item.currentTrack && item.trackCount
            ? Math.round((item.currentTrack / item.trackCount) * 100)
            : undefined
        }))
      ];

      console.log('All items loaded:', allItems.length);
      setItems(allItems);

    } catch (err: any) {
      console.error('Error loading items:', err);
      setError(err.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  // Format seconds to HH:MM:SS or MM:SS
  const formatTime = (seconds: number, includeHours: boolean = true): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (includeHours && hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter by status and type
  const currentlyReadingBooks = items.filter(i => i.type === 'Book' && i.status === 'Reading');
  const readBooks = items.filter(i => i.type === 'Book' && i.status === 'Read');
  
  const currentlyWatchingMovies = items.filter(i => i.type === 'Movie' && i.status === 'Watching');
  const watchedMovies = items.filter(i => i.type === 'Movie' && i.status === 'Watched');

  const currentlyWatchingSeries = items.filter(i => i.type === 'TV Series' && i.status === 'Watching');
  const watchedSeries = items.filter(i => i.type === 'TV Series' && i.status === 'Completed');

  const currentlyListening = items.filter(i => i.type === 'Music' && i.status === 'Listening');
  const listened = items.filter(i => i.type === 'Music' && i.status === 'Listened');

  // Lists configuration
  const lists = [
    {
      id: 'currently-reading',
      name: 'Currently Reading',
      icon: '📖',
      count: currentlyReadingBooks.length,
      color: '#48bb78',
      items: currentlyReadingBooks,
    },
    {
      id: 'read-books',
      name: 'Read Books',
      icon: '✅',
      count: readBooks.length,
      color: '#38a169',
      items: readBooks,
    },
    {
      id: 'currently-watching-movies',
      name: 'Watching Movies',
      icon: '🎥',
      count: currentlyWatchingMovies.length,
      color: '#4299e1',
      items: currentlyWatchingMovies,
    },
    {
      id: 'watched-movies',
      name: 'Watched Movies',
      icon: '✅',
      count: watchedMovies.length,
      color: '#3182ce',
      items: watchedMovies,
    },
    {
      id: 'currently-watching-series',
      name: 'Watching Series',
      icon: '📺',
      count: currentlyWatchingSeries.length,
      color: '#9f7aea',
      items: currentlyWatchingSeries,
    },
    {
      id: 'watched-series',
      name: 'Watched Series',
      icon: '✅',
      count: watchedSeries.length,
      color: '#805ad5',
      items: watchedSeries,
    },
    {
      id: 'currently-listening',
      name: 'Currently Listening',
      icon: '🎵',
      count: currentlyListening.length,
      color: '#f56565',
      items: currentlyListening,
    },
    {
      id: 'listened',
      name: 'Listened',
      icon: '✅',
      count: listened.length,
      color: '#ed8936',
      items: listened,
    },
  ];

  const activeListData = lists.find((list) => list.id === activeList);

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
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const toggleFavorite = async (id: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const previousFavoriteStatus = item.isFavorite;

    try {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        )
      );

      const response = await libraryService.toggleFavorite(id);
      
      if (response) {
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === id ? { 
              ...item, 
              isFavorite: response.favorite !== undefined ? response.favorite : response.isFavorite 
            } : item
          )
        );
      }

    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, isFavorite: previousFavoriteStatus } : item
        )
      );
      
      alert(error.message || 'Failed to toggle favorite. Please try again.');
    }
  };

  const renderStars = (rating: number): string => {
    return '⭐'.repeat(rating);
  };

  const renderProgressDetails = (item: LibraryItem) => {
    // BOOKS - Page Progress
    if (item.type === 'Book' && item.currentPage && item.totalPages) {
      const percentage = Math.round((item.currentPage / item.totalPages) * 100);
      return (
        <div className="progress-section">
          <div className="progress-details">
            <span className="progress-label">
              📄 Page {item.currentPage} / {item.totalPages}
            </span>
            <span className="progress-percentage">{percentage}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
      );
    }

    // MOVIES - Time Progress
    if (item.type === 'Movie' && item.currentSecond !== undefined && item.totalSeconds) {
      const percentage = Math.round((item.currentSecond / item.totalSeconds) * 100);
      const currentTime = formatTime(item.currentSecond, true);
      const totalTime = formatTime(item.totalSeconds, true);
      
      return (
        <div className="progress-section">
          <div className="progress-details">
            <span className="progress-label">
              ⏱️ {currentTime} / {totalTime}
            </span>
            <span className="progress-percentage">{percentage}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
      );
    }

    // TV SERIES - Season/Episode Progress
    if (item.type === 'TV Series' && item.currentSeason && item.currentEpisode) {
      const percentage = item.progress || 0;
      
      return (
        <div className="progress-section">
          <div className="progress-details">
            <span className="progress-label">
              📺 Season {item.currentSeason} Episode {item.currentEpisode}
              {item.totalSeasons && ` (Total ${item.totalSeasons} seasons)`}
            </span>
            <span className="progress-percentage">{percentage}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
      );
    }

    // MUSIC - Track Progress
    if (item.type === 'Music' && item.currentTrack && item.totalTracks) {
      const percentage = item.progress || Math.round((item.currentTrack / item.totalTracks) * 100);
      
      return (
        <div className="progress-section">
          <div className="progress-details">
            <span className="progress-label">
              🎵 Track {item.currentTrack} / {item.totalTracks}
            </span>
            <span className="progress-percentage">{percentage}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="my-lists-content">
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
          <p style={{ color: '#718096', fontSize: '14px' }}>Loading your lists...</p>
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
      <div className="my-lists-content">
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
            Error Loading Lists
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
    <div className="my-lists-content">
      <div className="lists-header">
        <h1>My Lists</h1>
        <p>Track what you're currently watching, listening to, and reading</p>
      </div>

      {/* Lists Navigation */}
      <div className="lists-navigation">
        <div className="lists-grid">
          {lists.map((list) => (
            <button
              key={list.id}
              className={`list-card ${activeList === list.id ? 'active' : ''}`}
              onClick={() => setActiveList(list.id as ListType)}
              style={{
                borderColor: activeList === list.id ? list.color : undefined,
              }}
            >
              <div className="list-icon" style={{ background: list.color }}>
                {list.icon}
              </div>
              <div className="list-info">
                <div className="list-name">{list.name}</div>
                <div className="list-count">{list.count} items</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active List Items */}
      <div className="list-items-section">
        <div className="section-header">
          <h2>
            {activeListData?.icon} {activeListData?.name}
          </h2>
          <span className="item-count">{activeListData?.count} items</span>
        </div>

        {activeListData && activeListData.items.length === 0 ? (
          <div className="empty-list">
            <div className="empty-icon">📭</div>
            <h3>This list is empty</h3>
            <p>Start adding items from your library!</p>
          </div>
        ) : (
          <div className="items-grid">
            {activeListData?.items.map((item) => (
              <div 
                key={item.id} 
                className="list-item-card"
                onClick={() => setSelectedItem(item)}
              >
                <div className="item-header">
                  <div className="item-icon-wrapper">
                    <span className="item-icon-large">{item.icon}</span>
                    <span className="item-type-badge">{item.type}</span>
                  </div>
                  <button
                    className={`btn-favorite-small ${item.isFavorite ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    {item.isFavorite ? '❤️' : '🤍'}
                  </button>
                </div>

                <div className="item-body">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-meta">
                    {item.author && `${item.author}`}
                    {item.director && `${item.director}`}
                    {item.artist && `${item.artist}`}
                    {item.creator && `${item.creator}`}
                    {item.year && ` • ${item.year}`}
                  </p>
                  {item.genre && <span className="item-genre">{item.genre}</span>}
                  <div className="item-rating">{renderStars(item.rating)}</div>
                </div>

                {renderProgressDetails(item)}
              </div>
            ))}
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

export default MyLists;