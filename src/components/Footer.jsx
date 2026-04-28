import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();

  const footerLinks = [
    { id: 1, title: "Home", icon: "bi bi-house", link: "/" },
    { id: 2, title: "Categories", icon: "bi bi-bookmarks", link: "/categories" },
    { id: 3, title: "Search", icon: "bi bi-search", link: "/search" },
    { id: 4, title: "Me", icon: "bi bi-person", link: "/profile" },
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
