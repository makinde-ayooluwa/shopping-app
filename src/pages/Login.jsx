import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { userLocalStorage } from "../hooks/useLocalStorage";

// Decode JWT token to get user data
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export default function Login({user,setUser}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  if (user != null) {
    navigate("/");
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        // Create user object with all form inputs
        const userObject = {
          email,
          password,
          rememberMe,
          provider: "email",
          loginTime: new Date().toISOString(),
        };

        // Save to localStorage as 'user'
        setUser(userObject);
        console.log("User logged in successfully:", userObject);

        setLoading(false);
        navigate("/");
      } else {
        setError("Please fill in all fields");
        setLoading(false);
      }
    }, 1000);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Initialize Google Sign-In
      if (!window.google) {
        throw new Error("Google SDK not loaded");
      }

      // Use Google Sign-In API
      window.google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with your Google Client ID
        callback: handleGoogleResponse,
      });

      // Trigger the One Tap UI or Sign-In Button
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        { theme: "outline", size: "large" },
      );

      // Show the One Tap prompt
      window.google.accounts.id.prompt();
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      setError("Failed to initialize Google Sign-In");
      setLoading(false);
    }
  };

  const handleGoogleResponse = (response) => {
    try {
      console.log("Google Response:", response);

      if (response.credential) {
        // Decode the JWT token to get user data
        const decodedToken = decodeToken(response.credential);

        console.log("Decoded User Data:", {
          email: decodedToken?.email,
          name: decodedToken?.name,
          picture: decodedToken?.picture,
          given_name: decodedToken?.given_name,
          family_name: decodedToken?.family_name,
          aud: decodedToken?.aud,
          iss: decodedToken?.iss,
        });

        // Log all available data
        console.log("Full Token Data:", decodedToken);

        // Create user object with Google data
        const userObject = {
          email: decodedToken?.email,
          name: decodedToken?.name,
          picture: decodedToken?.picture,
          rememberMe: false,
          provider: "google",
          loginTime: new Date().toISOString(),
        };

        // Save to localStorage as 'user'
        setUser(userObject);
        console.log("User logged in successfully with Google:", userObject);

        setLoading(false);

        // Redirect to home after successful login
        setTimeout(() => navigate("/"), 500);
      }
    } catch (error) {
      console.error("Error handling Google response:", error);
      setError("Failed to process Google login");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          {/* Header Section */}
          <div className="login-header">
            <div className="login-icon">
              <i className="bi bi-door-open"></i>
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your ShopNow account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="login-error">
              <i className="bi bi-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="login-form" onSubmit={handleSubmit}>
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
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`bi bi-eye${!showPassword ? "-slash" : ""}`}
                  ></i>
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="form-footer">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`login-btn ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <>
                  <i className="bi bi-arrow-repeat spinner"></i>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider">
            <span>or continue with</span>
          </div>

          {/* Social Login */}
          <div className="social-login">
            <button
              type="button"
              className="social-btn google"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <i className="bi bi-google"></i>
              Google
            </button>
            <button
              type="button"
              className="social-btn facebook"
              disabled={loading}
            >
              <i className="bi bi-facebook"></i>
              Facebook
            </button>
          </div>

          {/* Hidden Google Sign-In Button */}
          <div id="googleSignInButton" style={{ display: "none" }}></div>

          {/* Sign Up Link */}
          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="signup-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="login-decoration decoration-1"></div>
        <div className="login-decoration decoration-2"></div>
        <div className="login-decoration decoration-3"></div>
      </div>

      {/* Google SDK Script */}
      <script src="https://accounts.google.com/gsi/client" async defer></script>
    </div>
  );
}
