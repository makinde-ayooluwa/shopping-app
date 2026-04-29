import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function Profile() {
  return (
    <>
    <Header/>
    <div className="placeholder-page">
      <div className="placeholder-content">
        <i className="bi bi-person-circle placeholder-icon"></i>
        <h2 className="placeholder-title">Profile</h2>
        <p className="placeholder-text">
          Manage your account, orders, wishlist,cart and preferences. Your personal dashboard is under construction.
        </p>
        <Link to="/" className="placeholder-btn">
          <i className="bi bi-arrow-left"></i> Back to Home
        </Link>
      </div>
    </div>
    </>
  );
}

