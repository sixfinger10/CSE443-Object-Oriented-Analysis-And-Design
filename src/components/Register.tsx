import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import authService from '../services/auth.service';
import { RegisterRequest } from '../types/auth.types';

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    // Boş alan kontrolü
    if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.');
      return false;
    }

    // Email formatı
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    // Username uzunluğu (backend validation: 3-50)
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return false;
    }

    if (formData.username.length > 50) {
      setError('Username must be at most 50 characters long.');
      return false;
    }

    // Password uzunluğu (backend validation: min 8)
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }

    // Password karmaşıklığı
    const hasUppercase = /[A-Z]/.test(formData.password);
    const hasLowercase = /[a-z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(formData.password);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      setError('Password must contain uppercase, lowercase, number, and special character.');
      return false;
    }

    // Password eşleşmesi
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Form validasyonu
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Backend'e sadece email, username, password gönder
      const registerData: RegisterRequest = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      };

      // AuthService kullanarak kayıt yap
      const response = await authService.register(registerData);
      
      // Backend'den success:true geldi mi?
      if (response.success) {
        console.log('✅ Registration successful:', response);
        
        // Başarı mesajı
        alert('Registration successful! Please login with your credentials.');
        
        // Login sayfasına yönlendir
        navigate('/login');
      } else {
        // success:false ise hata mesajını göster
        setError(response.message || 'Registration failed');
      }
      
    } catch (err: any) {
      console.error('❌ Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/login');
  };

  const handleSignInClick = () => {
    navigate('/login');
  };

  return (
    <div className="register-container">
      <div className="register-background"></div>
      
      <div className="register-card">
        <div className="register-header">
          <div className="logo">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <rect x="12" y="8" width="24" height="32" rx="2" stroke="white" strokeWidth="2"/>
              <line x1="16" y1="14" x2="32" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="20" x2="32" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="26" x2="28" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1>Create Account</h1>
          <p>Join PLMS to manage your library</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username (3-50 characters)"
              disabled={isLoading}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              disabled={isLoading}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a strong password"
                disabled={isLoading}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <p className="password-hint">
              Must be at least 8 characters with uppercase, lowercase, number, and special character
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                disabled={isLoading}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <button type="button" className="cancel-button" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="signin-link"
              onClick={handleSignInClick}
              disabled={isLoading}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;