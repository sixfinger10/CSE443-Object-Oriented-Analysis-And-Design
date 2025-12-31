import api from '../config/api.config';

/**
 * Library Item Types
 */
export interface BookRequest {
  title?: string;
  author?: string;
  isbn?: string;
  publisher?: string;
  publicationYear?: number;
  pageCount?: number;
  genre?: string;
  language?: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  favorite?: boolean;
}

export interface MovieRequest {
  title: string;
  director?: string;
  durationMinutes?: number;
  releaseYear?: number;
  genre?: string;
  imdbId?: string;
  imdbScore?: number;
  castMembers?: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  favorite?: boolean;
}

export interface TVSeriesRequest {
  title: string;
  creator?: string;
  seasonCount?: number;
  episodeCount?: number;
  network?: string;
  startYear?: number;
  endYear?: number;
  genre?: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  favorite?: boolean;
}

export interface MusicRequest {
  title: string;
  artist?: string;
  album?: string;
  genre?: string;
  durationSeconds?: number;
  trackCount?: number;
  releaseYear?: number;
  description?: string;
  imageUrl?: string;
  rating?: number;
  favorite?: boolean;
}

export interface DashboardStats {
  totalItems: number;
  totalBooks: number;
  totalMovies: number;
  totalSeries: number;
  totalMusic: number;
  totalFavorites: number;
}

/**
 * Helper - Auth headers oluştur
 */
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('No authentication token found. Please login.');
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Library Service
 */
class LibraryService {
  // ==================== CREATE (POST) ====================

  async createBook(book: BookRequest) {
    try {
      const response = await api.post('/books', book, {
        headers: getAuthHeaders()
      });
      console.log('SUCCESS: Book created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Creating book:', error);
      throw new Error(error.response?.data?.message || 'Failed to create book');
    }
  }

  async createMovie(movie: MovieRequest) {
    try {
      const response = await api.post('/movies', movie, {
        headers: getAuthHeaders()
      });
      console.log('SUCCESS: Movie created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Creating movie:', error);
      throw new Error(error.response?.data?.message || 'Failed to create movie');
    }
  }

  addMovie(movie: MovieRequest) {
    return this.createMovie(movie);
  }

  async createTVSeries(series: TVSeriesRequest) {
    try {
      const response = await api.post('/tv-series', series, {
        headers: getAuthHeaders()
      });
      console.log('SUCCESS: TV Series created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Creating TV series:', error);
      throw new Error(error.response?.data?.message || 'Failed to create TV series');
    }
  }

  async createMusic(music: MusicRequest) {
    try {
      const response = await api.post('/music', music, {
        headers: getAuthHeaders()
      });
      console.log('SUCCESS: Music created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Creating music:', error);
      throw new Error(error.response?.data?.message || 'Failed to create music');
    }
  }

  // ==================== READ (GET) ====================

  async getAllItems() {
    try {
      const response = await api.get('/items', {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Loading library items:', error);
      throw new Error(error.response?.data?.message || 'Failed to load library items');
    }
  }

  async getAllBooks() {
    try {
      const response = await api.get('/books', {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Loading books:', error);
      throw new Error(error.response?.data?.message || 'Failed to load books');
    }
  }

  async getAllMovies() {
    try {
      const response = await api.get('/movies', {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Loading movies:', error);
      throw new Error(error.response?.data?.message || 'Failed to load movies');
    }
  }

  async getAllTVSeries() {
    try {
      const response = await api.get('/series', {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Loading TV series:', error);
      throw new Error(error.response?.data?.message || 'Failed to load TV series');
    }
  }

  async getAllMusic() {
    try {
      const response = await api.get('/music', {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Loading music:', error);
      throw new Error(error.response?.data?.message || 'Failed to load music');
    }
  }

  async getFavorites() {
    try {
      const response = await api.get('/favorites', {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Loading favorites:', error);
      throw new Error(error.response?.data?.message || 'Failed to load favorites');
    }
  }

  async getItemById(id: number) {
    try {
      const response = await api.get(`/items/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Loading item:', error);
      throw new Error(error.response?.data?.message || 'Failed to load item');
    }
  }

  async getBookById(id: number) {
    try {
      const response = await api.get(`/books/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Loading book:', error);
      throw new Error(error.response?.data?.message || 'Failed to load book');
    }
  }

  async getMovieById(id: number) {
    try {
      const response = await api.get(`/movies/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Loading movie:', error);
      throw new Error(error.response?.data?.message || 'Failed to load movie');
    }
  }

  // ==================== UPDATE (PUT/PATCH) ====================

  async updateItem(id: number, data: any) {
    try {
      const response = await api.put(`/items/${id}`, data, {
        headers: getAuthHeaders()
      });
      console.log('SUCCESS: Item updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Updating item:', error);
      throw new Error(error.response?.data?.message || 'Failed to update item');
    }
  }

  async updateBook(id: number, book: BookRequest) {
    try {
      const response = await api.put(`/books/${id}`, book, {
        headers: getAuthHeaders()
      });
      console.log('SUCCESS: Book updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Updating book:', error);
      throw new Error(error.response?.data?.message || 'Failed to update book');
    }
  }

  async updateMovie(id: number, movie: MovieRequest) {
    try {
      const response = await api.put(`/movies/${id}`, movie, {
        headers: getAuthHeaders()
      });
      console.log('SUCCESS: Movie updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Updating movie:', error);
      throw new Error(error.response?.data?.message || 'Failed to update movie');
    }
  }

  // ✅ YENİ - UPDATE STATUS METODLARI
  async updateBookStatus(id: number, status: string) {
    try {
      console.log('Updating book status:', id, status);
      
      const response = await api.patch(`/books/${id}/status`, 
        { status }, 
        { headers: getAuthHeaders() }
      );
      
      console.log('Book status updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating book status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update book status');
    }
  }

  async updateMovieStatus(id: number, status: string) {
    try {
      console.log('Updating movie status:', id, status);
      
      const response = await api.patch(`/movies/${id}/status`, 
        { status }, 
        { headers: getAuthHeaders() }
      );
      
      console.log('Movie status updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating movie status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update movie status');
    }
  }

  async toggleFavorite(id: number) {
    try {
      console.log('🔄 Calling backend PATCH /api/items/' + id + '/favorite');
      
      const response = await api.patch(`/items/${id}/favorite`, {}, {
        headers: getAuthHeaders()
      });
      
      console.log('✅ Backend response:', response.data);
      
      if (response.data) {
        return {
          ...response.data,
          isFavorite: response.data.favorite !== undefined ? response.data.favorite : response.data.isFavorite
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ ERROR: Toggling favorite:', error);
      console.error('Error details:', error.response);
      throw new Error(error.response?.data?.message || 'Failed to toggle favorite');
    }
  }

  // ==================== DELETE ====================

  async deleteItem(id: number) {
    try {
      const response = await api.delete(`/items/${id}`, {
        headers: getAuthHeaders()
      });
      console.log('SUCCESS: Item deleted');
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Deleting item:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete item');
    }
  }

  async deleteBook(id: number) {
    try {
      const response = await api.delete(`/books/${id}`, {
        headers: getAuthHeaders()
      });
      console.log('SUCCESS: Book deleted');
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Deleting book:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete book');
    }
  }

  async deleteMovie(id: number) {
    try {
      const response = await api.delete(`/movies/${id}`, {
        headers: getAuthHeaders()
      });
      console.log('SUCCESS: Movie deleted');
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Deleting movie:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete movie');
    }
  }

  // ==================== DASHBOARD & STATS ====================

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<DashboardStats>('/stats', {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Loading dashboard stats:', error);
      throw new Error('Failed to load dashboard statistics');
    }
  }

  async searchItems(query: string) {
    try {
      const response = await api.get('/search', {
        params: { q: query },
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Searching items:', error);
      throw new Error(error.response?.data?.message || 'Failed to search items');
    }
  }

  async getItemsByType(type: 'BOOK' | 'MOVIE' | 'TV_SERIES' | 'MUSIC') {
    try {
      const response = await api.get('/items', {
        params: { type },
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Filtering items:', error);
      throw new Error(error.response?.data?.message || 'Failed to filter items');
    }
  }

  async getItemsByStatus(status: 'WISHLIST' | 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED') {
    try {
      const response = await api.get('/items', {
        params: { status },
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      console.error('ERROR: Filtering items by status:', error);
      throw new Error(error.response?.data?.message || 'Failed to filter items');
    }
  }
}

export default new LibraryService();