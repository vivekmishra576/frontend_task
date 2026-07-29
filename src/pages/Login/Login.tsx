import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import loginImage from '../../assests/loginimage.png';
import logoImage from '../../assests/logo.png';
import './Login.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  
  // Form State
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  
  // Validation Errors
  const [userIdError, setUserIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated on component mount
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setUserIdError('');
    setPasswordError('');

    let isValid = true;

    if (!userId.trim()) {
      setUserIdError('User ID is required');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (!isValid) return;

    try {
      setIsLoading(true);
      await authService.login({ userId: userId.trim(), password });
      navigate('/dashboard');
    } catch (err: any) {
      setApiError(
        err.response?.data?.message || err.message || 'Invalid User ID or Password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="figma-login-container">
      <div className="figma-login-wrapper">
        <div className="figma-login-left">
          <img
            src={loginImage}
            alt="PrepRoute Mascot Illustration"
            className="login-mascot-image"
          />
        </div>
        <div className="figma-login-right">
          <div className="figma-login-card">
            <div className="login-brand-header">
              <img src={logoImage} alt="PrepRoute Logo" className="preproute-logo-img" />
            </div>
            <h1 className="login-heading">Login</h1>
            <p className="login-subtext">Use your company provided Login credentials</p>
            {apiError && <div className="login-api-error">{apiError}</div>}
            <form onSubmit={handleSubmit} className="figma-login-form">
              <div className={`form-field-group ${userIdError ? 'field-error' : ''}`}>
                <label htmlFor="userIdInput" className="form-field-label">
                  User ID
                </label>
                <input
                  id="userIdInput"
                  type="text"
                  className="form-field-input"
                  placeholder="Enter User ID"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    if (userIdError) setUserIdError('');
                  }}
                />
                {userIdError && <span className="error-text-msg">{userIdError}</span>}
              </div>
              <div className={`form-field-group ${passwordError ? 'field-error' : ''}`}>
                <label htmlFor="passwordInput" className="form-field-label">
                  Password
                </label>
                <input
                  id="passwordInput"
                  type="password"
                  className="form-field-input"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                />
                {passwordError && <span className="error-text-msg">{passwordError}</span>}
              </div>
              <div className="forgot-password-row">
                <a
                  href="#forgot"
                  className="forgot-password-link"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Please contact your administrator to reset your credentials.');
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="figma-login-btn"
                disabled={isLoading}
              >
                {isLoading ? <span className="btn-spinner" /> : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
