import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { userLocalStorage } from '../hooks/useLocalStorage';

// Decode JWT token to get user data
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export default function SignUp({user,setUser}) {
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
if (user != null) {
    navigate("/");
  }
  const validateForm = () => {
    if (!fullname.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      try {
        // Create user object with all form inputs
        const userObject = {
          fullname,
          email,
          password,
          confirmPassword,
          agreeTerms,
          provider: 'email',
          createdAt: new Date().toISOString(),
        };

        // Save to localStorage as 'user'
        setUser(userObject)
        console.log('User registered successfully:', userObject);

        setSuccess('Account created successfully! Redirecting to login...');
        setLoading(false);

        // Clear form
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        // Redirect to home after successful signup
        setTimeout(() => navigate('/'), 1500);
      } catch (err) {
        setError('Failed to create account. Please try again.');
        setLoading(false);
        console.log(err)
      }
    }, 1000);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      if (!window.google) {
        throw new Error('Google SDK not loaded');
      }

      window.google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google Client ID
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignUpButton'),
        { theme: 'outline', size: 'large' }
      );

      window.google.accounts.id.prompt();
    } catch (err) {
      console.error('Google Sign-Up Error:', err);
      setError('Failed to initialize Google Sign-Up');
      setLoading(false);
    }
  };

  const handleGoogleResponse = (response) => {
    try {
      console.log('Google Response:', response);

      if (response.credential) {
        const decodedToken = decodeToken(response.credential);

        console.log('Decoded User Data:', {
          email: decodedToken?.email,
          name: decodedToken?.name,
          picture: decodedToken?.picture,
        });

        // Create user object with Google data
        const userObject = {
          fullname: decodedToken?.name,
          email: decodedToken?.email,
          picture: decodedToken?.picture,
          agreeTerms: true,
          provider: 'google',
          createdAt: new Date().toISOString(),
        };

        // Save to localStorage as 'user'
setUser(userObject)
        console.log('User signed up successfully with Google:', userObject);

        setLoading(false);
        setSuccess('Account created successfully! Redirecting...');

        setTimeout(() => navigate('/'), 500);
      }
    } catch (error) {
      console.error('Error handling Google response:', error);
      setError('Failed to process Google sign-up');
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-box">
          {/* Header Section */}
          <div className="signup-header">
            <div className="signup-icon">
              <i className="bi bi-person-plus"></i>
            </div>
            <h1 className="signup-title">Join ShopNow</h1>
            <p className="signup-subtitle">Create your account and start shopping</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="signup-success">
              <i className="bi bi-check-circle"></i>
              <span>{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="signup-error">
              <i className="bi bi-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Sign Up Form */}
          <form className="signup-form" onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="form-field">
              <label htmlFor="fullName" className="form-label">
                <i className="bi bi-person"></i>
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                className="form-input"
                placeholder="John Doe"
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Email Field */}
            <div className="form-field">
              <label htmlFor="email" className="form-label">
                <i className="bi bi-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="form-field">
              <label htmlFor="password" className="form-label">
                <i className="bi bi-lock"></i>
                Password
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi bi-eye${!showPassword ? '-slash' : ''}`}></i>
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="form-field">
              <label htmlFor="confirmPassword" className="form-label">
                <i className="bi bi-lock-check"></i>
                Confirm Password
              </label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i
                    className={`bi bi-eye${!showConfirmPassword ? '-slash' : ''}`}
                  ></i>
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="form-field terms-field">
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="terms-link">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="privacy-link">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className={`signup-btn ${loading ? 'loading' : ''}`}>
              {loading ? (
                <>
                  <i className="bi bi-arrow-repeat spinner"></i>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus"></i>
                  Sign Up
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="signup-divider">
            <span>or sign up with</span>
          </div>

          {/* Social Sign Up */}
          <div className="social-signup">
            <button
              type="button"
              className="social-btn google"
              onClick={handleGoogleSignUp}
              disabled={loading}
            >
              <i className="bi bi-google"></i>
              Google
            </button>
            <button type="button" className="social-btn facebook" disabled={loading}>
              <i className="bi bi-facebook"></i>
              Facebook
            </button>
          </div>

          {/* Hidden Google Sign-Up Button */}
          <div id="googleSignUpButton" style={{ display: 'none' }}></div>

          {/* Sign In Link */}
          <div className="signup-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="signup-decoration decoration-1"></div>
        <div className="signup-decoration decoration-2"></div>
        <div className="signup-decoration decoration-3"></div>
      </div>

      {/* Google SDK Script */}
      <script src="https://accounts.google.com/gsi/client" async defer></script>
    </div>
  );
}