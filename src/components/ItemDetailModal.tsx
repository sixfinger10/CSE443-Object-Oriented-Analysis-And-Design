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
  const [isSaving, setIsSaving] = useState(false);

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
      
      // Backend'e göndereceğimiz data
      const updateData: any = {
        title: editedItem.title,
        rating: editedItem.rating,
        favorite: editedItem.isFavorite,
      };

      // Type'a göre field'ları ekle
      if (item.type === 'Book') {
        updateData.author = editedItem.author;
        updateData.isbn = editedItem.isbn;
        updateData.pageCount = editedItem.pages;
        updateData.genre = editedItem.genre;
        updateData.publisher = editedItem.publisher;
        
        // Backend'i çağır
        const updatedBook = await libraryService.updateBook(item.id, updateData);
        
        // Parent'a güncel item'ı gönder
        onUpdate({
          ...editedItem,
          ...updatedBook
        });
      } else if (item.type === 'Movie') {
        updateData.director = editedItem.director;
        updateData.durationMinutes = editedItem.duration;
        updateData.genre = editedItem.genre;
        updateData.releaseYear = editedItem.year;
        
        const updatedMovie = await libraryService.updateMovie(item.id, updateData);
        onUpdate({
          ...editedItem,
          ...updatedMovie
        });
      } else {
        // Diğer tipler için generic update
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
            <span className="modal-icon">{item.icon}</span>
            <div>
              <h2>{item.title}</h2>
              <span className="modal-type-badge">{item.type}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {!isEditing ? (
          // VIEW MODE
          <div className="modal-body">
            <div className="detail-section">
              <h3>Details</h3>
              <div className="detail-grid">
                {/* Book Details */}
                {item.type === 'Book' && (
                  <>
                    {item.author && (
                      <div className="detail-item">
                        <span className="detail-label">Author:</span>
                        <span className="detail-value">{item.author}</span>
                      </div>
                    )}
                    {item.isbn && (
                      <div className="detail-item">
                        <span className="detail-label">ISBN:</span>
                        <span className="detail-value">{item.isbn}</span>
                      </div>
                    )}
                    {item.publisher && (
                      <div className="detail-item">
                        <span className="detail-label">Publisher:</span>
                        <span className="detail-value">{item.publisher}</span>
                      </div>
                    )}
                    {item.pages && (
                      <div className="detail-item">
                        <span className="detail-label">Pages:</span>
                        <span className="detail-value">{item.pages}</span>
                      </div>
                    )}
                    {item.format && (
                      <div className="detail-item">
                        <span className="detail-label">Format:</span>
                        <span className="detail-value">{item.format}</span>
                      </div>
                    )}
                  </>
                )}

                {/* Movie Details */}
                {item.type === 'Movie' && (
                  <>
                    {item.director && (
                      <div className="detail-item">
                        <span className="detail-label">Director:</span>
                        <span className="detail-value">{item.director}</span>
                      </div>
                    )}
                    {item.duration && (
                      <div className="detail-item">
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">{item.duration} min</span>
                      </div>
                    )}
                  </>
                )}

                {/* TV Series Details */}
                {item.type === 'TV Series' && (
                  <>
                    {item.director && (
                      <div className="detail-item">
                        <span className="detail-label">Creator:</span>
                        <span className="detail-value">{item.director}</span>
                      </div>
                    )}
                    {item.seasons && (
                      <div className="detail-item">
                        <span className="detail-label">Seasons:</span>
                        <span className="detail-value">{item.seasons}</span>
                      </div>
                    )}
                  </>
                )}

                {/* Music Details */}
                {item.type === 'Music' && (
                  <>
                    {item.artist && (
                      <div className="detail-item">
                        <span className="detail-label">Artist:</span>
                        <span className="detail-value">{item.artist}</span>
                      </div>
                    )}
                    {item.album && (
                      <div className="detail-item">
                        <span className="detail-label">Album:</span>
                        <span className="detail-value">{item.album}</span>
                      </div>
                    )}
                  </>
                )}

                {/* Common Details */}
                {item.year && (
                  <div className="detail-item">
                    <span className="detail-label">Year:</span>
                    <span className="detail-value">{item.year}</span>
                  </div>
                )}
                {item.genre && (
                  <div className="detail-item">
                    <span className="detail-label">Genre:</span>
                    <span className="detail-value">{item.genre}</span>
                  </div>
                )}
                {item.language && (
                  <div className="detail-item">
                    <span className="detail-label">Language:</span>
                    <span className="detail-value">{item.language}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Rating:</span>
                  <span className="detail-value">{renderStars(item.rating)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Favorite:</span>
                  <span className="detail-value">{item.isFavorite ? '❤️ Yes' : '🤍 No'}</span>
                </div>
              </div>
            </div>

            {item.notes && (
              <div className="detail-section">
                <h3>Notes</h3>
                <p className="notes-text">{item.notes}</p>
              </div>
            )}
          </div>
        ) : (
          // EDIT MODE
          <div className="modal-body">
            <div className="edit-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={editedItem.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {item.type === 'Book' && (
                <>
                  <div className="form-group">
                    <label>Author</label>
                    <input
                      type="text"
                      name="author"
                      value={editedItem.author || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>ISBN</label>
                    <input
                      type="text"
                      name="isbn"
                      value={editedItem.isbn || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Publisher</label>
                    <input
                      type="text"
                      name="publisher"
                      value={editedItem.publisher || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Pages</label>
                    <input
                      type="number"
                      name="pages"
                      value={editedItem.pages || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Genre</label>
                    <input
                      type="text"
                      name="genre"
                      value={editedItem.genre || ''}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {item.type === 'Movie' && (
                <>
                  <div className="form-group">
                    <label>Director</label>
                    <input
                      type="text"
                      name="director"
                      value={editedItem.director || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration (min)</label>
                    <input
                      type="number"
                      name="duration"
                      value={editedItem.duration || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Genre</label>
                    <input
                      type="text"
                      name="genre"
                      value={editedItem.genre || ''}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  name="year"
                  value={editedItem.year || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Rating (1-5)</label>
                <input
                  type="number"
                  name="rating"
                  value={editedItem.rating}
                  onChange={handleChange}
                  min="1"
                  max="5"
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={editedItem.notes || ''}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        <div className="modal-footer">
          {!isEditing ? (
            <>
              <button className="btn-favorite-modal" onClick={() => onToggleFavorite(item.id)}>
                {item.isFavorite ? 'Remove Favorite' : 'Add Favorite'}
              </button>
              <div className="footer-actions">
                <button className="btn-delete" onClick={handleDelete}>
                  Delete
                </button>
                <button className="btn-edit" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
              </div>
            </>
          ) : (
            <>
              <button 
                className="btn-cancel-edit" 
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                className="btn-save-edit" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;