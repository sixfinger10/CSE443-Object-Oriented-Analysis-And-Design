import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/login';

interface LoginFormData {
  usernameOrEmail: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<LoginFormData>({
    usernameOrEmail: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.usernameOrEmail || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    // TEST KULLANICISI - Hard-coded kontrol
    if (
      formData.usernameOrEmail === 'test@plms.com' && 
      formData.password === 'Test1234!'
    ) {
      // Test kullanıcısı başarılı
      localStorage.setItem('authToken', 'test-token-123');
      localStorage.setItem('userName', 'Sarah Johnson');
      localStorage.setItem('userEmail', 'test@plms.com');
      
      setIsLoading(false);
      navigate('/dashboard');
      return;
    }

    // Gerçek backend çağrısı (test kullanıcısı değilse)
    try {
      const response = await axios.post(API_URL, {
        usernameOrEmail: formData.usernameOrEmail,
        password: formData.password,
      });

      console.log('Login successful:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userName', response.data.user?.name || 'User');
        localStorage.setItem('userEmail', response.data.user?.email || '');
      }
      
      navigate('/dashboard');
      
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response) {
        setError(err.response.data.message || 'Login failed. Please check your credentials.');
      } else {
        setError('Invalid username/email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
  navigate('/forgot-password');
};

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <rect x="12" y="8" width="24" height="32" rx="2" stroke="white" strokeWidth="2"/>
              <line x1="16" y1="14" x2="32" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="20" x2="32" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="26" x2="28" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your PLMS account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="usernameOrEmail">Username or Email</label>
            <div className="input-with-icon">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M17 18C17 14.134 13.866 11 10 11C6.13401 11 3 14.134 3 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <input
                type="text"
                id="usernameOrEmail"
                name="usernameOrEmail"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                placeholder="Enter your username or email"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M15 8H5C3.89543 8 3 8.89543 3 10V16C3 17.1046 3.89543 18 5 18H15C16.1046 18 17 17.1046 17 16V10C17 8.89543 16.1046 8 15 8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M6 8V5C6 3.93913 6.42143 2.92172 7.17157 2.17157C7.92172 1.42143 8.93913 1 10 1C11.0609 1 12.0783 1.42143 12.8284 2.17157C13.5786 2.92172 14 3.93913 14 5V8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <div className="forgot-password-link">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="create-account-link"
              onClick={handleCreateAccount}
              disabled={isLoading}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>

      <div className="login-info">
        <p>© 2025 VisionSoft - All rights reserved</p>
      </div>
    </div>
  );
};

export default Login;