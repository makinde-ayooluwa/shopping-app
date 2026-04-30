import { Link, useNavigate } from "react-router-dom";

export default function Header({user}) {
  const navigate = useNavigate();
  return (
    <div className="header">
      <Link to="/" className="logo">
        <i className="bi bi-bag-check"></i>
        ShopNow
      </Link>
      {!user ? (<>
      <button onClick={()=>navigate("/login")}>Login</button>
      </>) : (<>
      <Link to="/profile" className="profile-link">
        <i className="bi bi-person-circle"></i>
      </Link>
      </>)}
    </div>
  );
}
