import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.forgotPassword({ email });
      
      if (response.success) {
        console.log('✅ Reset code sent:', response);
        // Kod gönderildi, verify sayfasına git
        alert('Reset code sent to your email! Please check your inbox.');
        navigate('/verify-code', { state: { email } });
      } else {
        setError(response.message || 'Failed to send reset code');
      }
    } catch (err: any) {
      console.error('❌ Forgot password error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-background"></div>
      
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <div className="logo">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <rect x="12" y="8" width="24" height="32" rx="2" stroke="white" strokeWidth="2"/>
              <line x1="16" y1="14" x2="32" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="20" x2="32" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="26" x2="28" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1>Forgot Password?</h1>
          <p>No worries! Enter your email and we'll send you a reset code.</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter your email address"
              disabled={isLoading}
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <button type="submit" className="btn-send-link" disabled={isLoading}>
            {isLoading ? 'Sending...' : '📧 Send Reset Code'}
          </button>
        </form>

        <div className="forgot-password-footer">
          <button 
            className="btn-back-link" 
            onClick={handleBackToLogin}
            disabled={isLoading}
          >
            ← Back to Login
          </button>
        </div>
      </div>

      <div className="forgot-password-info">
        <p>© 2025 VisionSoft - All rights reserved</p>
      </div>
    </div>
  );
};

export default ForgotPassword;