import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/auth.service';
import './Login.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const resetCode = location.state?.resetCode || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Email veya code yoksa login'e yönlendir (useEffect içinde)
  useEffect(() => {
    if (!email || !resetCode) {
      navigate('/login', { replace: true });
    }
  }, [email, resetCode, navigate]);

  // Email veya code yoksa hiçbir şey render etme
  if (!email || !resetCode) {
    return null;
  }

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Şifre validasyonu
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Şifre eşleşme kontrolü
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword({
        email,
        resetCode,
        newPassword,
      });
      
      if (response.success) {
        console.log('✅ Password reset successful:', response);
        alert('Password reset successful! You can now login with your new password.');
        navigate('/login');
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err: any) {
      console.error('❌ Reset password error:', err);
      setError(err.message || 'Reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
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
          <h1>Set New Password</h1>
          <p>Create a strong password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
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
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter new password"
                disabled={isLoading}
                required
                autoFocus
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
            <p style={{ 
              fontSize: '12px', 
              color: '#718096', 
              margin: '4px 0 0 0'
            }}>
              At least 8 characters with uppercase, lowercase, number, and special character
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
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
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Confirm new password"
                disabled={isLoading}
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

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            onClick={handleBackToLogin}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px',
              padding: '0',
              fontFamily: 'inherit'
            }}
          >
            ← Back to Login
          </button>
        </div>
      </div>

      <div className="login-info">
        <p>© 2025 VisionSoft - All rights reserved</p>
      </div>
    </div>
  );
};

export default ResetPassword;