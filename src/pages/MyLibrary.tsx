import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemDetailModal from '../components/ItemDetailModal';
import libraryService from '../services/library.service';
import './MyLibrary.css';

// Import offline libraries
import { Document, Paragraph, TextRun, Packer, HeadingLevel, AlignmentType } from 'docx';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('All');
  const [activeFavoriteFilter, setActiveFavoriteFilter] = useState<string>('All Items');
  const [sortBy, setSortBy] = useState<string>('date-newest');
  const itemsPerPage = 8;

  // Backend Integration
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<LibraryItem[]>([]);

  // Backend'den tüm itemları yükle
  useEffect(() => {
    loadLibraryItems();
  }, []);

  const loadLibraryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading all library items...');

      // Tüm item tiplerini çek
      const [books, movies, series, music] = await Promise.all([
        libraryService.getAllBooks().catch(() => []),
        libraryService.getAllMovies().catch(() => []),
        libraryService.getAllTVSeries().catch(() => []),
        libraryService.getAllMusic().catch(() => [])
      ]);
      
      console.log('Books:', books);
      console.log('Movies:', movies);
      console.log('TV Series:', series);
      console.log('Music:', music);

      // Icon'ları ekle ve birleştir
      const allItems: LibraryItem[] = [
        ...books.map((book: any) => ({
          ...book,
          type: 'Book' as const,
          icon: '📖',
          isFavorite: book.favorite || false  // Backend'den gelen favorite'i isFavorite'a map et
        })),
        ...movies.map((movie: any) => ({
          ...movie,
          type: 'Movie' as const,
          icon: '🎥',
          isFavorite: movie.favorite || false
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
      
      console.log('All items loaded:', allItems);
      setItems(allItems);
      
    } catch (err: any) {
      console.error('Error loading library:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load library');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const filteredItems = items.filter(item => {
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

    if (activeTypeFilter !== 'All') {
      const typeMap: { [key: string]: string } = {
        '📖 Books': 'Book',
        '🎥 Movies': 'Movie',
        '📺 TV Series': 'TV Series',
        '🎵 Music': 'Music',
      };
      if (item.type !== typeMap[activeTypeFilter]) return false;
    }

    if (activeFavoriteFilter === '❤️ Favorites Only' && !item.isFavorite) {
      return false;
    }

    return true;
  });

  // Sort items
  const sortItems = (items: LibraryItem[]) => {
    const sorted = [...items];
    switch (sortBy) {
      case 'date-newest': return sorted.sort((a, b) => b.id - a.id);
      case 'date-oldest': return sorted.sort((a, b) => a.id - b.id);
      case 'title-asc': return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc': return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'rating-high': return sorted.sort((a, b) => b.rating - a.rating);
      case 'rating-low': return sorted.sort((a, b) => a.rating - b.rating);
      default: return sorted;
    }
  };

  const sortedItems = sortItems(filteredItems);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const currentItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  // IMPORT
  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        if (Array.isArray(jsonData)) {
          const validItems = jsonData.filter(item => 
            item.title && item.type && item.rating
          );
          if (validItems.length > 0) {
            setItems(validItems);
          }
        }
      } catch (error) {
        console.error('Import error:', error);
      }
    };
    
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // EXPORT JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    saveAs(dataBlob, `library-export-${new Date().toISOString().split('T')[0]}.json`);
    setShowExportMenu(false);
  };

  // EXPORT WORD
  const handleExportWord = async () => {
    try {
      const paragraphs: Paragraph[] = [];

      paragraphs.push(
        new Paragraph({
          text: 'MY LIBRARY EXPORT',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 }
        })
      );

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Exported on: ${new Date().toLocaleDateString()}`,
              bold: true,
              size: 24
            })
          ],
          spacing: { after: 200 }
        })
      );

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Total Items: ${items.length}`,
              bold: true,
              size: 24
            })
          ],
          spacing: { after: 400 }
        })
      );

      paragraphs.push(
        new Paragraph({
          text: '═'.repeat(50),
          spacing: { after: 300 }
        })
      );

      items.forEach((item, index) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. ${item.title}`,
                bold: true,
                size: 28,
                color: '667eea'
              })
            ],
            spacing: { before: 200, after: 150 }
          })
        );

        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Type: ', bold: true }),
              new TextRun({ text: item.type })
            ],
            spacing: { after: 100 }
          })
        );

        if (item.author) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Author: ', bold: true }),
                new TextRun({ text: item.author })
              ],
              spacing: { after: 100 }
            })
          );
        }
        if (item.director) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Director: ', bold: true }),
                new TextRun({ text: item.director })
              ],
              spacing: { after: 100 }
            })
          );
        }
        if (item.artist) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Artist: ', bold: true }),
                new TextRun({ text: item.artist })
              ],
              spacing: { after: 100 }
            })
          );
        }

        if (item.year) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Year: ', bold: true }),
                new TextRun({ text: item.year.toString() })
              ],
              spacing: { after: 100 }
            })
          );
        }

        if (item.genre) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Genre: ', bold: true }),
                new TextRun({ text: item.genre })
              ],
              spacing: { after: 100 }
            })
          );
        }

        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Rating: ', bold: true }),
              new TextRun({ text: '⭐'.repeat(item.rating) + ` (${item.rating}/5)` })
            ],
            spacing: { after: 100 }
          })
        );

        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Favorite: ', bold: true }),
              new TextRun({ 
                text: item.isFavorite ? '❤️ Yes' : 'No',
                color: item.isFavorite ? 'ff0000' : '000000'
              })
            ],
            spacing: { after: 100 }
          })
        );

        if (item.notes) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Notes: ', bold: true }),
                new TextRun({ text: item.notes })
              ],
              spacing: { after: 100 }
            })
          );
        }

        paragraphs.push(
          new Paragraph({
            text: '─'.repeat(50),
            spacing: { before: 200, after: 200 }
          })
        );
      });

      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs
        }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `library-export-${new Date().toISOString().split('T')[0]}.docx`);
      
      setShowExportMenu(false);
    } catch (error) {
      console.error('Word export error:', error);
    }
  };

  // EXPORT PDF
  const handleExportPDF = async () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('MY LIBRARY EXPORT', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 20, 35);
      doc.text(`Total Items: ${items.length}`, 20, 45);
      
      let yPosition = 60;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      
      items.forEach((item, index) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${item.title}`, margin, yPosition);
        yPosition += 7;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        doc.text(`Type: ${item.type}`, margin + 5, yPosition);
        yPosition += 5;
        
        if (item.author) {
          doc.text(`Author: ${item.author}`, margin + 5, yPosition);
          yPosition += 5;
        }
        if (item.director) {
          doc.text(`Director: ${item.director}`, margin + 5, yPosition);
          yPosition += 5;
        }
        if (item.artist) {
          doc.text(`Artist: ${item.artist}`, margin + 5, yPosition);
          yPosition += 5;
        }
        
        if (item.year) {
          doc.text(`Year: ${item.year}`, margin + 5, yPosition);
          yPosition += 5;
        }
        
        if (item.genre) {
          doc.text(`Genre: ${item.genre}`, margin + 5, yPosition);
          yPosition += 5;
        }
        
        doc.text(`Rating: ${'*'.repeat(item.rating)} (${item.rating}/5)`, margin + 5, yPosition);
        yPosition += 5;
        
        doc.text(`Favorite: ${item.isFavorite ? 'Yes' : 'No'}`, margin + 5, yPosition);
        yPosition += 5;
        
        if (item.notes) {
          const splitNotes = doc.splitTextToSize(`Notes: ${item.notes}`, 170);
          doc.text(splitNotes, margin + 5, yPosition);
          yPosition += (splitNotes.length * 5);
        }
        
        yPosition += 8;
      });
      
      doc.save(`library-export-${new Date().toISOString().split('T')[0]}.pdf`);
      
      setShowExportMenu(false);
    } catch (error) {
      console.error('PDF export error:', error);
    }
  };

  const handleAddNew = () => {
    navigate('/add-item');
  };

  const handleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleTypeFilter = (type: string) => {
    setActiveTypeFilter(type);
    setCurrentPage(1);
  };

  const handleFavoriteFilter = (filter: string) => {
    setActiveFavoriteFilter(filter);
    setCurrentPage(1);
  };

  // TOGGLE FAVORITE - UPDATED WITH ERROR HANDLING
  const toggleFavorite = async (id: number) => {
  const item = items.find(i => i.id === id);
  if (!item) return;

  const previousFavoriteStatus = item.isFavorite;

  try {
    console.log('🔄 Toggle favorite for item:', id, 'Current status:', previousFavoriteStatus);

    // 1. Optimistic update - UI'ı hemen güncelle
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );

    // 2. Backend'i çağır
    const response = await libraryService.toggleFavorite(id);
    
    console.log('✅ Backend response:', response);

    // 3. Backend response ile state'i güncelle
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
    
    // HATA OLURSA GERİ AL!
    setItems(prevItems =>
      prevItems.map(item =>
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

  // LOADING STATE
  if (loading) {
    return (
      <div className="my-library-content">
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
          <p style={{ color: '#718096', fontSize: '14px' }}>Loading library...</p>
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

  // ERROR STATE
  if (error) {
    return (
      <div className="my-library-content">
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>
            Error Loading Library
          </h3>
          <p style={{ color: '#718096', marginBottom: '24px' }}>{error}</p>
          <button 
            onClick={loadLibraryItems}
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
    <div className="my-library-content">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

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
          <button className="btn-import" onClick={handleImport}>
            Import
          </button>
          
          <div className="export-dropdown" style={{ position: 'relative' }}>
            <button 
              className="btn-export" 
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              Export
            </button>
            
            {showExportMenu && (
              <div className="export-menu" style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                zIndex: 1000,
                minWidth: '180px'
              }}>
                <button
                  onClick={handleExportJSON}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#2d3748',
                    borderBottom: '1px solid #e2e8f0'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f7fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  Export as JSON
                </button>
                <button
                  onClick={handleExportWord}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#2d3748',
                    borderBottom: '1px solid #e2e8f0'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f7fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  Export as Word
                </button>
                <button
                  onClick={handleExportPDF}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#2d3748',
                    borderRadius: '0 0 8px 8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f7fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  Export as PDF
                </button>
              </div>
            )}
          </div>
          
          <button className="btn-add-new" onClick={handleAddNew}>
            + Add New Item
          </button>
          <button className="btn-filters" onClick={handleFilters}>
            Filters
          </button>
        </div>
      </div>

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
          <select value={sortBy} onChange={handleSortChange}>
            <option value="date-newest">Date Added (newest)</option>
            <option value="date-oldest">Date Added (oldest)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="rating-high">Rating (highest)</option>
            <option value="rating-low">Rating (lowest)</option>
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

      {totalPages > 1 && (
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
      )}

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