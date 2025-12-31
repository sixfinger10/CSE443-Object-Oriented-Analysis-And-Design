import api from '../config/api.config';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  VerifyResetCodeRequest,
  ResetPasswordRequest,
} from '../types/auth.types';

/**
 * Authentication Service
 * Backend endpoint'leri: /signin, /signup
 */
class AuthService {
  /**
   * Kullanıcı girişi
   * Endpoint: POST /api/auth/signin
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('🔐 Login attempt:', credentials.usernameOrEmail);
      
      const response = await api.post<AuthResponse>('/auth/signin', credentials);
      
      console.log('📦 Backend response:', response.data);
      
      // Backend'den success:true gelirse ve data varsa
      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        
        console.log('✅ Saving auth data...');
        console.log('  Token:', token.substring(0, 20) + '...');
        console.log('  User:', user);
        
        // Token ve kullanıcı bilgilerini kaydet
        this.saveAuthData(token, user);
        
        // Kontrol
        console.log('✅ Auth data saved successfully');
        console.log('  Token in storage:', !!localStorage.getItem('authToken'));
        console.log('  User in storage:', !!localStorage.getItem('user'));
      }
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Kullanıcı kaydı
   * Endpoint: POST /api/auth/signup
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/signup', userData);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Şifremi unuttum - Email gönder
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/forgot-password', request);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Reset kodunu doğrula
   */
  async verifyResetCode(request: VerifyResetCodeRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/verify-reset-code', request);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Şifreyi sıfırla
   */
  async resetPassword(request: ResetPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/reset-password', request);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Çıkış yap
   */
  logout(): void {
    console.log('🚪 Logging out...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); // ✅ YENİ EKLE
    
    // Eski metodla uyumluluk için (opsiyonel)
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
    console.log('✅ Logout successful');
    window.location.href = '/login';
  }

  /**
   * Kullanıcı giriş yapmış mı?
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * ✅ GÜNCELLENECEK: Mevcut kullanıcı bilgilerini al
   */
  getCurrentUser(): { id: number; username: string; email: string } | null {
    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        
        // Fallback: Eski metod
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        
        if (userId && userName && userEmail) {
          return {
            id: parseInt(userId),
            username: userName,
            email: userEmail,
          };
        }
      }
    }
    
    return null;
  }

  /**
   * ✅ GÜNCELLENECEK: Auth data'yı kaydet
   */
  private saveAuthData(token: string, user: { id: number; username: string; email: string }): void {
    // ✅ YENİ METOD: User objesini JSON olarak kaydet
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    console.log('💾 Saved to localStorage:');
    console.log('  authToken:', token.substring(0, 20) + '...');
    console.log('  user:', JSON.stringify(user));
    
    // Eski metod (geriye dönük uyumluluk için - opsiyonel)
    localStorage.setItem('userId', user.id.toString());
    localStorage.setItem('userName', user.username);
    localStorage.setItem('userEmail', user.email);
  }

  /**
   * Hata mesajlarını işle
   */
  private handleError(error: any): Error {
    console.error('❌ Auth error:', error);
    
    if (error.response) {
      // Backend'den gelen hata
      const backendError = error.response.data;
      
      // Backend AuthResponse formatında hata dönüyorsa
      if (backendError.success === false) {
        return new Error(backendError.message || 'An error occurred');
      }
      
      // Diğer backend hataları
      return new Error(
        backendError.message || 
        backendError.error || 
        'Server error occurred'
      );
    } else if (error.request) {
      // Request gönderildi ama response gelmedi
      return new Error('Cannot connect to server. Please check if backend is running.');
    } else {
      // Request oluşturulurken hata
      return new Error('An unexpected error occurred');
    }
  }
}

// Singleton instance
export default new AuthService();