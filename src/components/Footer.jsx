import { Link, useLocation } from "react-router-dom";

export default function Footer({user,setUser}) {
  const location = useLocation();

  const isLoggedIn = !!user;

const footerLinks = [
  { id: 1, title: "Home", icon: "bi bi-house", link: "/" },
  { id: 2, title: "Categories", icon: "bi bi-grid-3x3-gap", link: "/categories" },
  {
    id: 4,
    title: isLoggedIn ? "Profile" : "Login",
    icon: "bi bi-person-circle",
    link: isLoggedIn ? "/profile" : "/login",
  },
];

  return (
    <div className="footer">
      {footerLinks.map((footerLink) => {
        const isActive = location.pathname === footerLink.link;
        return (
          <Link
            key={footerLink.id}
            to={footerLink.link}
            className={`footer-link ${isActive ? "active" : ""}`}
          >
            <i className={`${footerLink.icon} footer-icon`}></i>
            <span>{footerLink.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
