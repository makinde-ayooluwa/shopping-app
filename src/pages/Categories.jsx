import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import CartToast from "../components/CartToast";
const sortOptions = [
  { id: "default", label: "Default", icon: "bi bi-arrow-down-up" },
  {
    id: "price-low",
    label: "Price: Low to High",
    icon: "bi bi-sort-numeric-down",
  },
  {
    id: "price-high",
    label: "Price: High to Low",
    icon: "bi bi-sort-numeric-down-alt",
  },
  { id: "rating", label: "Highest Rated", icon: "bi bi-star-fill" },
];

const priceRanges = [
  { id: "all", label: "All", max: Infinity },
  { id: "under50", label: "Under $50", max: 50 },
  { id: "under100", label: "Under $100", max: 100 },
  { id: "under200", label: "Under $200", max: 200 },
];

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  const stars = [];
  for (let i = 0; i < fullStars; i++)
    stars.push(<i key={`f${i}`} className="bi bi-star-fill star-filled"></i>);
  if (hasHalf)
    stars.push(<i key="h" className="bi bi-star-half star-filled"></i>);
  const empty = 5 - fullStars - (hasHalf ? 1 : 0);
  for (let i = 0; i < empty; i++)
    stars.push(<i key={`e${i}`} className="bi bi-star star-empty"></i>);
  return <div className="star-rating">{stars}</div>;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "30, 27, 75";
}

export default function Categories({
  cartToast,
  setCartToast,
  addToCart,
  cart,
  removeFromCart,
  inWish,
  toggleWish,
  wishlist,
  categories,
  products,
}) {
  const [cartFilter, setCartFilter] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activePriceRange, setActivePriceRange] = useState("all");
  const [animationKey, setAnimationKey] = useState(0);
  const sortRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("shopping_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    function handle(e) {
      if (sortRef.current && !sortRef.current.contains(e.target))
        setShowSortMenu(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const getCount = (cn) =>
    cn == "All"
      ? products.length
      : products.filter((p) => p.category == cn).length;

  const changeCat = (cn) => {
    setActiveCategory(cn);
    setSearchQuery("");
    setAnimationKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const changeSort = (sid) => {
    setSortBy(sid);
    setShowSortMenu(false);
    setAnimationKey((k) => k + 1);
  };
  const changePrice = (pid) => {
    setActivePriceRange(pid);
    setAnimationKey((k) => k + 1);
  };

  const pmax =
    priceRanges.find((r) => r.id == activePriceRange)?.max ?? Infinity;
  let filtered = products.filter(
    (p) =>
      (activeCategory == "All" || p.category == activeCategory) &&
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (pmax == Infinity || p.price <= pmax),
  );
  console.log(filtered);
  if (sortBy == "price-low")
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy == "price-high")
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy == "rating")
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const sortLabel = sortOptions.find((o) => o.id == sortBy)?.label ?? "Default";

  return (
    <div className="categories-page">
      <Header />

      <CartToast cartToast={cartToast} />

      <div className="categories-header">
        <Link to="/" className="back-btn">
          <i className="bi bi-arrow-left"></i>
        </Link>
        <h1 className="categories-title">Categories</h1>
        <div className="header-spacer"></div>
      </div>
      <div className="search-section">
        <div className="search-bar">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            placeholder={`Search in ${activeCategory}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <section className="category-cards-section">
        <div className="category-cards-grid">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-card ${activeCategory == cat.name ? "active" : ""}`}
              onClick={() => changeCat(cat.name)}
              style={{
                "--cat-color": cat.color,
                "--cat-color-rgb": hexToRgb(cat.color),
              }}
            >
              <div className="category-card-icon">
                <i className={cat.icon}></i>
              </div>
              <span className="category-card-name">{cat.name}</span>
              <span className="category-card-count">
                {getCount(cat.name)} items
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="filters-bar">
        <div className="sort-dropdown" ref={sortRef}>
          <button
            className={`sort-btn ${showSortMenu ? "active" : ""}`}
            onClick={() => setShowSortMenu((v) => !v)}
          >
            <i className="bi bi-funnel"></i>
            <span>{sortLabel}</span>
            <i className={`bi bi-chevron-${showSortMenu ? "up" : "down"}`}></i>
          </button>
          {showSortMenu && (
            <div className="sort-menu">
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  className={`sort-option ${sortBy == opt.id ? "active" : ""}`}
                  onClick={() => changeSort(opt.id)}
                >
                  <i className={opt.icon}></i>
                  <span>{opt.label}</span>
                  {sortBy == opt.id && (
                    <i className="bi bi-check2 sort-check"></i>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="price-chips">
          {priceRanges.map((r) => (
            <button
              key={r.id}
              className={`price-chip ${activePriceRange == r.id ? "active" : ""}`}
              onClick={() => changePrice(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="results-info">
          <h2 className="section-title">{activeCategory}</h2>
          <span className="results-count">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <section className="products-section">
          <div className="products-grid" key={animationKey}>
            {filtered.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                inWish={inWish}
                toggleWish={toggleWish}
                addToCart={addToCart}
                StarRating={StarRating}
              />
            ))}
          </div>
          {filtered.length == 0 ? (
            <>
              <div className="no-results">
                <i className="bi bi-search"></i>
                <p>No products found in {activeCategory}</p>
                {activePriceRange !== "all" ? (
                  <p>Try adjusting your price filter</p>
                ) : (
                  ""
                )}
              </div>
            </>
          ) : (
            <></>
          )}
        </section>
      </div>

      {/* Cart Section */}
      {cart && cart.length > 0 && (
        <section className="cart-section">
          <div className="section-header">
            <h2 className="section-title">Your Cart ({cart.length} items)</h2>
            <Link to="/profile" className="view-all">
              View Full Cart <i className="bi bi-chevron-right"></i>
            </Link>
          </div>
          <div className="categories-scroll">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-chip ${cartFilter === cat.name ? "active" : ""}`}
                style={{
                  backgroundColor:
                    cartFilter === cat.name ? cat.color : "#ffffff",
                  borderColor: cartFilter === cat.name ? cat.color : "#e2e8f0",
                }}
                onClick={() => setCartFilter(cat.name)}
              >
                <i className={cat.icon}></i>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
          <div className="products-grid">
            {cart
              .filter(
                (item) => cartFilter === "All" || item.category === cartFilter,
              )
              .map((item, index) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  index={index}
                  inWish={inWish}
                  toggleWish={toggleWish}
                  addToCart={addToCart}
                  StarRating={StarRating}
                  cartItemMode={true}
                  quantity={item.quantity}
                  onRemove={removeFromCart}
                />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
