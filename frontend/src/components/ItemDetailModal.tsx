import { useState } from 'react';
import libraryService from '../services/library.service';
import './ItemDetailModal.css';

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

interface ItemDetailModalProps {
  item: LibraryItem;
  onClose: () => void;
  onUpdate: (updatedItem: LibraryItem) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

const ItemDetailModal = ({ item, onClose, onUpdate, onDelete, onToggleFavorite }: ItemDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<LibraryItem>(item);
  const [isSaving, setIsSaving] = useState(false); // ✅ ZATEN VAR

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      const numValue = value === '' ? undefined : Number(value);
      setEditedItem(prev => ({ ...prev, [name]: numValue }));
    } else {
      setEditedItem(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updateData: any = {
        title: editedItem.title,
        rating: editedItem.rating,
        favorite: editedItem.isFavorite,
        description: editedItem.notes,
      };

      if (item.type === 'Book') {
        updateData.author = editedItem.author;
        updateData.isbn = editedItem.isbn;
        updateData.pageCount = editedItem.pages;
        updateData.genre = editedItem.genre;
        updateData.publisher = editedItem.publisher;
        
        const updatedBook = await libraryService.updateBook(item.id, updateData);
        onUpdate({ ...editedItem, ...updatedBook });
      } else if (item.type === 'Movie') {
        updateData.director = editedItem.director;
        updateData.durationMinutes = editedItem.duration;
        updateData.genre = editedItem.genre;
        updateData.releaseYear = editedItem.year;
        
        const updatedMovie = await libraryService.updateMovie(item.id, updateData);
        onUpdate({ ...editedItem, ...updatedMovie });
      } else if (item.type === 'TV Series') {
        updateData.creator = editedItem.creator;
        updateData.seasonCount = editedItem.seasons;
        updateData.genre = editedItem.genre;
        updateData.startYear = editedItem.year;
        
        const updatedSeries = await libraryService.updateTVSeries(item.id, updateData);
        onUpdate({ ...editedItem, ...updatedSeries });
      } else if (item.type === 'Music') {
        updateData.artist = editedItem.artist;
        updateData.album = editedItem.album;
        updateData.genre = editedItem.genre;
        updateData.releaseYear = editedItem.year;
        
        const updatedMusic = await libraryService.updateMusic(item.id, updateData);
        onUpdate({ ...editedItem, ...updatedMusic });
      } else {
        await libraryService.updateItem(item.id, updateData);
        onUpdate(editedItem);
      }
      
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating item:', error);
      alert(error.message || 'Failed to update item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      onDelete(item.id);
      onClose();
    }
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <span className="item-type-badge">{item.icon} {item.type}</span>
            <h2>{item.title}</h2>
            {!isEditing && (
              <div className="item-meta">
                {item.author && <span>by {item.author}</span>}
                {item.director && <span>directed by {item.director}</span>}
                {item.artist && <span>by {item.artist}</span>}
                {item.creator && <span>created by {item.creator}</span>}
                {item.year && <span> • {item.year}</span>}
              </div>
            )}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {!isEditing ? (
          // ============================================
          // VIEW MODE - DEĞİŞMEZ
          // ============================================
          <div className="modal-body">
            <div className="item-details">
              <div className="detail-row">
                <span className="detail-label">Rating:</span>
                <span className="detail-value">{renderStars(item.rating)}</span>
              </div>
              
              {item.type === 'Book' && (
                <>
                  {item.author && (
                    <div className="detail-row">
                      <span className="detail-label">Author:</span>
                      <span className="detail-value">{item.author}</span>
                    </div>
                  )}
                  {item.isbn && (
                    <div className="detail-row">
                      <span className="detail-label">ISBN:</span>
                      <span className="detail-value">{item.isbn}</span>
                    </div>
                  )}
                  {item.publisher && (
                    <div className="detail-row">
                      <span className="detail-label">Publisher:</span>
                      <span className="detail-value">{item.publisher}</span>
                    </div>
                  )}
                  {item.pages && (
                    <div className="detail-row">
                      <span className="detail-label">Pages:</span>
                      <span className="detail-value">{item.pages}</span>
                    </div>
                  )}
                </>
              )}

              {item.type === 'Movie' && (
                <>
                  {item.director && (
                    <div className="detail-row">
                      <span className="detail-label">Director:</span>
                      <span className="detail-value">{item.director}</span>
                    </div>
                  )}
                  {item.duration && (
                    <div className="detail-row">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{item.duration} min</span>
                    </div>
                  )}
                </>
              )}

              {item.type === 'TV Series' && (
                <>
                  {item.creator && (
                    <div className="detail-row">
                      <span className="detail-label">Creator:</span>
                      <span className="detail-value">{item.creator}</span>
                    </div>
                  )}
                  {item.seasons && (
                    <div className="detail-row">
                      <span className="detail-label">Seasons:</span>
                      <span className="detail-value">{item.seasons}</span>
                    </div>
                  )}
                </>
              )}

              {item.type === 'Music' && (
                <>
                  {item.artist && (
                    <div className="detail-row">
                      <span className="detail-label">Artist:</span>
                      <span className="detail-value">{item.artist}</span>
                    </div>
                  )}
                  {item.album && (
                    <div className="detail-row">
                      <span className="detail-label">Album:</span>
                      <span className="detail-value">{item.album}</span>
                    </div>
                  )}
                </>
              )}

              {item.genre && (
                <div className="detail-row">
                  <span className="detail-label">Genre:</span>
                  <span className="detail-value">{item.genre}</span>
                </div>
              )}
              
              {item.notes && (
                <div className="detail-row">
                  <span className="detail-label">Notes:</span>
                  <span className="detail-value">{item.notes}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          // ============================================
          // ✅ EDIT MODE - TÜM INPUT'LARA disabled={isSaving} EKLENDİ
          // ============================================
          <div className="modal-body">
            <div className="edit-form">
              {/* TITLE - TÜM TİPLER */}
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={editedItem.title}
                  onChange={handleChange}
                  disabled={isSaving}
                  required
                />
              </div>

              {/* BOOK ALANLARI */}
              {item.type === 'Book' && (
                <>
                  <div className="form-group">
                    <label>Author</label>
                    <input
                      type="text"
                      name="author"
                      value={editedItem.author || ''}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="form-group">
                    <label>ISBN</label>
                    <input
                      type="text"
                      name="isbn"
                      value={editedItem.isbn || ''}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="form-group">
                    <label>Publisher</label>
                    <input
                      type="text"
                      name="publisher"
                      value={editedItem.publisher || ''}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="form-group">
                    <label>Pages</label>
                    <input
                      type="number"
                      name="pages"
                      value={editedItem.pages || ''}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="form-group">
                    <label>Genre</label>
                    <input
                      type="text"
                      name="genre"
                      value={editedItem.genre || ''}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                </>
              )}

              {/* MOVIE ALANLARI */}
              {item.type === 'Movie' && (
                <>
                  <div className="form-group">
                    <label>Director</label>
                    <input
                      type="text"
                      name="director"
                      value={editedItem.director || ''}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration (min)</label>
                    <input
                      type="number"
                      name="duration"
                      value={editedItem.duration || ''}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="form-group">
                    <label>Genre</label>
                    <input
                      type="text"
                      name="genre"
                      value={editedItem.genre || ''}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                </>
              )}

              {/* TV SERIES ALANLARI */}
              {item.type === 'TV Series' && (
                <>
                  <div className="form-group">
                    <label>Creator</label>
                    <input
                      type="text"
                      name="creator"
                      value={editedItem.creator || ''}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="form-group">
                    <label>Seasons</label>
                    <input
                      type="number"
                      name="seasons"
                      value={editedItem.seasons || ''}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="form-group">
                    <label>Genre</label>
                    <input
                      type="text"
                      name="genre"
                      value={editedItem.genre || ''}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                </>
              )}

              {/* MUSIC ALANLARI */}
              {item.type === 'Music' && (
                <>
                  <div className="form-group">
                    <label>Artist</label>
                    <input
                      type="text"
                      name="artist"
                      value={editedItem.artist || ''}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="form-group">
                    <label>Album</label>
                    <input
                      type="text"
                      name="album"
                      value={editedItem.album || ''}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="form-group">
                    <label>Genre</label>
                    <input
                      type="text"
                      name="genre"
                      value={editedItem.genre || ''}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                </>
              )}

              {/* YEAR - TÜM TİPLER */}
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  name="year"
                  value={editedItem.year || ''}
                  onChange={handleChange}
                  disabled={isSaving}
                />
              </div>

              {/* RATING - TÜM TİPLER */}
              <div className="form-group">
                <label>Rating (1-5)</label>
                <input
                  type="number"
                  name="rating"
                  value={editedItem.rating}
                  onChange={handleChange}
                  min="1"
                  max="5"
                  disabled={isSaving}
                />
              </div>

              {/* NOTES - TÜM TİPLER */}
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={editedItem.notes || ''}
                  onChange={handleChange}
                  rows={4}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* FOOTER - BUTONLAR ZATEN DOĞRU */}
        {/* ============================================ */}
        <div className="modal-footer">
          {!isEditing ? (
            <div className="modal-actions">
              <button 
                className="btn-favorite" 
                onClick={() => onToggleFavorite(item.id)}
              >
                {item.isFavorite ? '❤️ Unfavorite' : '🤍 Favorite'}
              </button>
              <button 
                className="btn-edit" 
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit
              </button>
              <button 
                className="btn-delete" 
                onClick={handleDelete}
              >
                🗑️ Delete
              </button>
            </div>
          ) : (
            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={() => {
                  setEditedItem(item);
                  setIsEditing(false);
                }}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                className="btn-save" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;

/*
============================================
📝 UYGULAMA TALİMATI
============================================

Bu dosyayı mevcut ItemDetailModal.tsx ile karşılaştır:

✅ ZATEN DOĞRU:
- isSaving state var (satır 39)
- handleSave fonksiyonu doğru
- Butonlarda disabled={isSaving} var

❌ EKSİK OLAN (DÜZELTİLDİ):
- Tüm input/textarea elementlerine disabled={isSaving} eklendi
- Book, Movie, TV Series, Music için tüm alanlar düzeltildi

TOPLAM DEĞİŞİKLİK: ~15 input'a disabled={isSaving} eklendi
*/