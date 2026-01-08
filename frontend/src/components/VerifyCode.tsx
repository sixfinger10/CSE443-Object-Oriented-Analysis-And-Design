import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/auth.service';
import './Login.css';

const VerifyCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [resetCode, setResetCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Email yoksa login'e yönlendir (useEffect içinde)
  useEffect(() => {
    if (!email) {
      navigate('/login', { replace: true });
    }
  }, [email, navigate]);

  // Email yoksa hiçbir şey render etme
  if (!email) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!resetCode || resetCode.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.verifyResetCode({ email, resetCode });
      
      if (response.success) {
        console.log('✅ Code verified:', response);
        // Kod doğrulandı, reset password sayfasına git
        navigate('/reset-password', { state: { email, resetCode } });
      } else {
        setError(response.message || 'Invalid or expired code');
      }
    } catch (err: any) {
      console.error('❌ Verify code error:', err);
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    
    try {
      const response = await authService.forgotPassword({ email });
      if (response.success) {
        alert('New code sent to your email!');
      } else {
        alert('Failed to resend code. Please try again.');
      }
    } catch (err: any) {
      alert('Failed to resend code.');
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
          <h1>Verify Reset Code</h1>
          <p>Enter the 6-digit code sent to <strong>{email}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="resetCode">Reset Code</label>
            <input
              type="text"
              id="resetCode"
              name="resetCode"
              value={resetCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Sadece rakam
                if (value.length <= 6) {
                  setResetCode(value);
                }
                if (error) setError('');
              }}
              placeholder="Enter 6-digit code"
              maxLength={6}
              disabled={isLoading}
              required
              autoFocus
              style={{ 
                fontSize: '24px', 
                textAlign: 'center', 
                letterSpacing: '8px',
                fontFamily: 'monospace',
                padding: '16px 14px'
              }}
            />
            <p style={{ 
              fontSize: '12px', 
              color: '#718096', 
              margin: '8px 0 0 0',
              textAlign: 'center'
            }}>
              Code expires in 15 minutes
            </p>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        <div className="login-footer">
          <p style={{ marginBottom: '12px', color: '#718096', fontSize: '14px' }}>
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px',
              padding: '0',
              marginBottom: '16px',
              fontFamily: 'inherit'
            }}
          >
            Resend Code
          </button>
          <br />
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

export default VerifyCode;