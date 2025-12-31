import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      console.log('Password reset email sent to:', email);
    }, 1500);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (isSuccess) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-background"></div>
        
        <div className="forgot-password-card">
          <div className="success-icon">✓</div>
          <h1>Check Your Email</h1>
          <p className="success-message">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="helper-text">
            Please check your inbox and click on the link to reset your password. 
            If you don't see the email, check your spam folder.
          </p>
          
          <button className="btn-back-to-login" onClick={handleBackToLogin}>
            ← Back to Login
          </button>

          <div className="resend-section">
            <p>Didn't receive the email?</p>
            <button className="btn-resend" onClick={() => setIsSuccess(false)}>
              Resend Link
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <p>No worries! Enter your email and we'll send you reset instructions.</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <button type="submit" className="btn-send-link" disabled={isLoading}>
            {isLoading ? 'Sending...' : '📧 Send Reset Link'}
          </button>
        </form>

        <div className="forgot-password-footer">
          <button className="btn-back-link" onClick={handleBackToLogin}>
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