import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function Search() {
  return (
    <>
      <Header />
      <div className="placeholder-page">
        <div className="placeholder-content">
          <i className="bi bi-search placeholder-icon"></i>
          <h2 className="placeholder-title">Search</h2>
          <p className="placeholder-text">
            Explore products by name, category, or brand. Advanced search
            filters coming soon!
          </p>
          <Link to="/" className="placeholder-btn">
            <i className="bi bi-arrow-left"></i> Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
