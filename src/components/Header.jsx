import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="header">
      <Link to="/" className="logo">
        <i className="bi bi-bag-check"></i>
        ShopNow
      </Link>
      <Link to="/profile" className="profile-link">
        <i className="bi bi-person-circle"></i>
      </Link>
    </div>
  );
}
