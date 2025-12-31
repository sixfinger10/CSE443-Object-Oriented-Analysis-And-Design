import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddItem.css';

type ItemType = 'Book' | 'Movie' | 'TV Series' | 'Music' | null;

interface FormData {
  // Common fields
  title: string;
  isFavorite: boolean;
  
  // Book fields
  author: string;
  isbn: string;
  publisher: string;
  publicationYear: string;
  numberOfPages: string;
  genre: string;
  language: string;
  format: 'Physical' | 'Digital' | 'Both';
  notes: string;
  
  // Movie/TV fields
  director: string;
  year: string;
  duration: string;
  rating: string;
  
  // TV Series fields
  creator: string;
  seasons: string;
  
  // Music fields
  artist: string;
  album: string;
}

const AddItem = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<ItemType>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    isFavorite: false,
    author: '',
    isbn: '',
    publisher: '',
    publicationYear: '',
    numberOfPages: '',
    genre: '',
    language: '',
    format: 'Physical',
    notes: '',
    director: '',
    year: '',
    duration: '',
    rating: '',
    creator: '',
    seasons: '',
    artist: '',
    album: '',
  });

  const itemTypes = [
    { type: 'Book' as ItemType, icon: '📖', label: 'Book' },
    { type: 'Movie' as ItemType, icon: '🎥', label: 'Movie' },
    { type: 'TV Series' as ItemType, icon: '📺', label: 'TV Series' },
    { type: 'Music' as ItemType, icon: '🎵', label: 'Music' },
  ];

  const handleTypeSelect = (type: ItemType) => {
    setSelectedType(type);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value, type } = e.target;
  
  if (type === 'checkbox') {
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: checked }));
  } else if (type === 'radio') {
    setFormData(prev => ({ ...prev, [name]: value as 'Physical' | 'Digital' | 'Both' }));
  } else if (type === 'number') {
    // Number input'ları number'a çevir
    const numValue = value === '' ? '' : Number(value);
    setFormData(prev => ({ ...prev, [name]: numValue }));
  } else {
    setFormData(prev => ({ ...prev, [name]: value }));
  }
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting:', {
      type: selectedType,
      ...formData,
    });

    alert(`${selectedType} added successfully!`);
    navigate('/my-library');
  };

  const handleCancel = () => {
    navigate('/my-library');
  };

  return (
    <div className="add-item-content">
      <h1>Add New Item to Library</h1>

      {/* Item Type Selection */}
      <section className="type-selection">
        <h2>Select Item Type</h2>
        <div className="type-buttons">
          {itemTypes.map((item) => (
            <button
              key={item.type}
              className={`type-btn ${selectedType === item.type ? 'active' : ''}`}
              onClick={() => handleTypeSelect(item.type)}
            >
              <span className="type-icon">{item.icon}</span>
              <span className="type-label">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* BOOK FORM */}
      {selectedType === 'Book' && (
        <form onSubmit={handleSubmit} className="item-form">
          <h2>Book Details</h2>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="isbn">ISBN</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="978-0-123456-78-9"
            />
          </div>

          <div className="form-group">
            <label htmlFor="publisher">Publisher</label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="Publisher name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="publicationYear">Publication Year</label>
            <input
              type="number"
              id="publicationYear"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleChange}
              placeholder="2024"
              min="1000"
              max="2100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="numberOfPages">Number of Pages</label>
            <input
              type="number"
              id="numberOfPages"
              name="numberOfPages"
              value={formData.numberOfPages}
              onChange={handleChange}
              placeholder="350"
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
            >
              <option value="">Select a genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Mystery">Mystery</option>
              <option value="Thriller">Thriller</option>
              <option value="Romance">Romance</option>
              <option value="Biography">Biography</option>
              <option value="Self-Help">Self-Help</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="">Select language</option>
              <option value="English">English</option>
              <option value="Turkish">Turkish</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>

          <div className="form-group">
            <label>Format *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="format"
                  value="Physical"
                  checked={formData.format === 'Physical'}
                  onChange={handleChange}
                />
                <span>Physical</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="format"
                  value="Digital"
                  checked={formData.format === 'Digital'}
                  onChange={handleChange}
                />
                <span>Digital</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="format"
                  value="Both"
                  checked={formData.format === 'Both'}
                  onChange={handleChange}
                />
                <span>Both</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes or comments about this book..."
              rows={4}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isFavorite"
                checked={formData.isFavorite}
                onChange={handleChange}
              />
              <span>Mark as Favorite</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">
              📚 Save to Library
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* MOVIE FORM */}
      {selectedType === 'Movie' && (
        <form onSubmit={handleSubmit} className="item-form">
          <h2>Movie Details</h2>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter movie title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="director">Director *</label>
            <input
              type="text"
              id="director"
              name="director"
              value={formData.director}
              onChange={handleChange}
              placeholder="Enter director name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Release Year</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="2024"
              min="1888"
              max="2100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="120"
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
            >
              <option value="">Select a genre</option>
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Horror">Horror</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Thriller">Thriller</option>
              <option value="Romance">Romance</option>
              <option value="Documentary">Documentary</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rating">Your Rating (1-5)</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="5"
              min="1"
              max="5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes or comments about this movie..."
              rows={4}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isFavorite"
                checked={formData.isFavorite}
                onChange={handleChange}
              />
              <span>Mark as Favorite</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">
              🎥 Save to Library
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* TV SERIES FORM */}
      {selectedType === 'TV Series' && (
        <form onSubmit={handleSubmit} className="item-form">
          <h2>TV Series Details</h2>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter TV series title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="creator">Creator/Director *</label>
            <input
              type="text"
              id="creator"
              name="creator"
              value={formData.creator}
              onChange={handleChange}
              placeholder="Enter creator name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Start Year</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="2020"
              min="1950"
              max="2100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="seasons">Number of Seasons</label>
            <input
              type="number"
              id="seasons"
              name="seasons"
              value={formData.seasons}
              onChange={handleChange}
              placeholder="5"
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
            >
              <option value="">Select a genre</option>
              <option value="Drama">Drama</option>
              <option value="Comedy">Comedy</option>
              <option value="Action">Action</option>
              <option value="Crime">Crime</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Thriller">Thriller</option>
              <option value="Documentary">Documentary</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rating">Your Rating (1-5)</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="5"
              min="1"
              max="5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes or comments about this TV series..."
              rows={4}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isFavorite"
                checked={formData.isFavorite}
                onChange={handleChange}
              />
              <span>Mark as Favorite</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">
              📺 Save to Library
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* MUSIC FORM */}
      {selectedType === 'Music' && (
        <form onSubmit={handleSubmit} className="item-form">
          <h2>Music Details</h2>

          <div className="form-group">
            <label htmlFor="title">Title/Album Name *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter music/album title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="artist">Artist/Band *</label>
            <input
              type="text"
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              placeholder="Enter artist or band name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="album">Album</label>
            <input
              type="text"
              id="album"
              name="album"
              value={formData.album}
              onChange={handleChange}
              placeholder="Album name (if applicable)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Release Year</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="2024"
              min="1900"
              max="2100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
            >
              <option value="">Select a genre</option>
              <option value="Rock">Rock</option>
              <option value="Pop">Pop</option>
              <option value="Jazz">Jazz</option>
              <option value="Classical">Classical</option>
              <option value="Hip Hop">Hip Hop</option>
              <option value="Electronic">Electronic</option>
              <option value="Country">Country</option>
              <option value="R&B">R&B</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rating">Your Rating (1-5)</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="5"
              min="1"
              max="5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes or comments about this music..."
              rows={4}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isFavorite"
                checked={formData.isFavorite}
                onChange={handleChange}
              />
              <span>Mark as Favorite</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">
              🎵 Save to Library
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Message if no type selected */}
      {!selectedType && (
        <div className="no-selection">
          <p>👆 Please select an item type above to continue</p>
        </div>
      )}
    </div>
  );
};

export default AddItem;