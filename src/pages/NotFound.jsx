import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function NotFound({user,setUser}) {
  return (
    
    <>
    <Header user={user} />
    <div className="not-found-page">
      <div className="not-found-content">
        <i className="bi bi-exclamation-circle not-found-icon"></i>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Oops! Page Not Found</h2>
        <p className="not-found-text">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="not-found-btn">
          <i className="bi bi-house-door"></i> Go Back Home
        </Link>
      </div>
    </div>
    </>
  );
}
