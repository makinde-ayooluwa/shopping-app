import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { userLocalStorage } from '../hooks/useLocalStorage';
import { backendUrl } from '../constants/backendUrl';

// Countries data with country codes and phone number lengths
const countriesData = {
  'United States': { code: '+1', phoneLength: 10 },
  'United Kingdom': { code: '+44', phoneLength: 10 },
  'Canada': { code: '+1', phoneLength: 10 },
  'Australia': { code: '+61', phoneLength: 9 },
  'Germany': { code: '+49', phoneLength: 11 },
  'France': { code: '+33', phoneLength: 9 },
  'India': { code: '+91', phoneLength: 10 },
  'Japan': { code: '+81', phoneLength: 10 },
  'China': { code: '+86', phoneLength: 11 },
  'Nigeria': { code: '+234', phoneLength: 10 },
  'Mexico': { code: '+52', phoneLength: 10 },
  'Brazil': { code: '+55', phoneLength: 11 },
  'Italy': { code: '+39', phoneLength: 10 },
  'Spain': { code: '+34', phoneLength: 9 },
  'Netherlands': { code: '+31', phoneLength: 9 },
  'South Korea': { code: '+82', phoneLength: 10 },
  'Singapore': { code: '+65', phoneLength: 8 },
  'United Arab Emirates': { code: '+971', phoneLength: 9 },
  'South Africa': { code: '+27', phoneLength: 9 },
  'New Zealand': { code: '+64', phoneLength: 9 },
};

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
  const [user_id] = useState(Math.random().toString(36).substr(2, 9));
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [picture, setPicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [currency, setCurrency] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCountryCode = () => {
    return country ? countriesData[country]?.code || '' : '';
  };

  const getPhoneLength = () => {
    return country ? countriesData[country]?.phoneLength || 0 : 0;
  };
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
    if (!address.trim()) {
      setError('Address is required');
      return false;
    }
    if (!country.trim()) {
      setError('Country is required');
      return false;
    }
    if (!phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    const expectedLength = getPhoneLength();
    if (phoneDigits.length !== expectedLength) {
      setError(`Phone number must be ${expectedLength} digits for ${country}`);
      return false;
    }
    if (!picture) {
      setError('Profile picture is required');
      return false;
    }
    if (!currency.trim()) {
      setError('Currency is required');
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

    try {
      // First, upload the image to the backend
      let pictureUrl = '';
      if (picture) {
        const formData = new FormData();
        formData.append('picture', picture);

        const uploadResponse = await fetch(`${backendUrl}/upload-picture.php`, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload picture');
        }

        const uploadData = await uploadResponse.json();
        pictureUrl = uploadData['url'];
        console.log(uploadData)
      }

      // Create user object with all form inputs
      const userObject = {
        fullname,
        user_id,
        email,
        address,
        picture: pictureUrl, // Use the URL from backend
        phone,
        password,
        country,
        currency,
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
      setAddress('');
      setPicture(null);
      setPicturePreview('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
      setCountry('');
      setCurrency('');

      // Redirect to home after successful signup
      // setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError('Failed to create account. Please try again.');
      setLoading(false);
      console.log(err)
    }
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
          user_id: Math.random().toString(36).substr(2, 9),
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

            {/* Country Field */}
            <div className="form-field">
              <label htmlFor="country" className="form-label">
                <i className="bi bi-globe"></i>
                Country
              </label>
              <select
                id="country"
                className="form-input"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setPhone(''); // Reset phone when country changes
                }}
              >
                <option value="">Select Country</option>
                {Object.keys(countriesData).map((countryName) => (
                  <option key={countryName} value={countryName}>
                    {countryName}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone Field */}
            {country && (
              <div className="form-field">
                <label htmlFor="phone" className="form-label">
                  <i className="bi bi-telephone"></i>
                  Phone Number
                </label>
                <div className="phone-input-wrapper">
                  <span className="country-code">{getCountryCode()}</span>
                  <input
                    type="tel"
                    id="phone"
                    className="form-input phone-input"
                    placeholder={`Enter ${getPhoneLength()} digit number`}
                    value={phone}
                    onChange={(e) => {
                      // Only allow digits
                      const digitsOnly = e.target.value.replace(/\D/g, '');
                      setPhone(digitsOnly);
                    }}
                    maxLength={getPhoneLength()}
                  />
                </div>
                <small className="phone-hint">
                  {phone.length}/{getPhoneLength()} digits
                </small>
              </div>
            )}

            {/* Address Field */}
            <div className="form-field">
              <label htmlFor="address" className="form-label">
                <i className="bi bi-geo-alt"></i>
                Address
              </label>
              <input
                type="text"
                id="address"
                className="form-input"
                placeholder="123 Main St, City, State"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Picture Field */}
            <div className="form-field">
              <label htmlFor="picture" className="form-label">
                <i className="bi bi-image"></i>
                Profile Picture
              </label>
              <input
                type="file"
                id="picture"
                className="form-input"
                accept="image/*"
                onChange={handlePictureChange}
              />
              {picturePreview && (
                <div className="picture-preview">
                  <img src={picturePreview} alt="Profile Preview" />
                </div>
              )}
            </div>

            {/* Currency Field */}
            <div className="form-field">
              <label htmlFor="currency" className="form-label">
                <i className="bi bi-currency-dollar"></i>
                Currency
              </label>
              <select
                id="currency"
                className="form-input"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="">Select Currency</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="CHF">CHF - Swiss Franc</option>
                <option value="CNY">CNY - Chinese Yuan</option>
                <option value="NGN">NGN - Nigerian Naira</option>
              </select>
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