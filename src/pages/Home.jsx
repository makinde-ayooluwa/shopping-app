import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import CartToast from "../components/CartToast";
function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <i key={`full-${i}`} className="bi bi-star-fill star-filled"></i>,
    );
  }
  if (hasHalf) {
    stars.push(<i key="half" className="bi bi-star-half star-filled"></i>);
  }
  const empty = 5 - fullStars - (hasHalf ? 1 : 0);
  for (let i = 0; i < empty; i++) {
    stars.push(<i key={`empty-${i}`} className="bi bi-star star-empty"></i>);
  }

  return <div className="star-rating">{stars}</div>;
}

export default function Home({
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
  user, setUser
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartFilter, setCartFilter] = useState("All");

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="home-page">
      <Header user={user} />
      <CartToast cartToast={cartToast} />
      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Summer Collection</h1>
          <p className="hero-subtitle">
            Discover the hottest deals up to 50% off on selected items
          </p>
          <Link to="/categories" className="hero-btn">
            Shop Now <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
        <div className="hero-badge">
          <span className="hero-discount">-50%</span>
          <span className="hero-off">OFF</span>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2 className="section-title">Categories</h2>
        <div className="categories-scroll">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-chip ${activeCategory === cat.name ? "active" : ""}`}
              style={{
                backgroundColor:
                  activeCategory === cat.name ? cat.color : "#ffffff",
                borderColor:
                  activeCategory === cat.name ? cat.color : "#e2e8f0",
              }}
              onClick={() => setActiveCategory(cat.name)}
            >
              <i className={cat.icon}></i>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/categories" className="view-all">
            View All <i className="bi bi-chevron-right"></i>
          </Link>
        </div>
        <div className="products-grid">
          {filteredProducts.map((product, index) => (
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
        {filteredProducts.length === 0 && (
          <div className="no-results">
            <i className="bi bi-search"></i>
            <p>No products found</p>
          </div>
        )}
      </section>

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
                  borderColor:
                    cartFilter === cat.name ? cat.color : "#e2e8f0",
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
              .filter((item) =>
                cartFilter === "All" || item.category === cartFilter
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

      {/* Promo Banner */}
      <section className="promo-section">
        <div className="promo-content">
          <i className="bi bi-lightning-charge promo-icon"></i>
          <div>
            <h3 className="promo-title">Flash Sale</h3>
            <p className="promo-text">Free shipping on orders over $50</p>
          </div>
        </div>
        <Link to="/categories" className="promo-btn">
          Explore
        </Link>
      </section>
    </div>
  );
}
