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

export default function Search({
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
  user,
  setUser
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartFilter, setCartFilter] = useState("All");
  const [animationKey, setAnimationKey] = useState(0);

  const getCount = (cn) =>
    cn === "All"
      ? products.length
      : products.filter((p) => p.category === cn).length;

  const changeCat = (cn) => {
    setActiveCategory(cn);
    setAnimationKey((k) => k + 1);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="search-page">
      <Header user={user} />
      <CartToast cartToast={cartToast} />

      {/* Hero Search Bar */}
      <section className="hero-search-section">
        <div className="search-hero-content">
          <h1 className="search-hero-title">Search Products</h1>
          <p className="search-hero-subtitle">Find exactly what you're looking for</p>
        </div>
        <div className="hero-search-bar">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="hero-search-input"
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Category Filters */}
      <section className="categories-section">
        <h2 className="section-title">Filter by Category</h2>
        <div className="categories-scroll">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-chip ${activeCategory === cat.name ? "active" : ""}`}
              style={{
                backgroundColor: activeCategory === cat.name ? cat.color : "#ffffff",
                borderColor: activeCategory === cat.name ? cat.color : "#e2e8f0",
              }}
              onClick={() => changeCat(cat.name)}
            >
              <i className={cat.icon}></i>
              <span>{cat.name}</span>
              <span className="category-count">({getCount(cat.name)})</span>
            </button>
          ))}
        </div>
      </section>

      {/* Search Results */}
      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">
            {activeCategory} Products
          </h2>
          <span className="results-count">
            {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="products-grid" key={animationKey}>
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
            <p>
              No products found for "{searchQuery}"{activeCategory !== "All" ? ` in ${activeCategory}` : ""}
            </p>
            <Link to="/" className="placeholder-btn">
              Back to Home
            </Link>
          </div>
        )}
      </section>

      {/* Cart Section */}
      {cart && cart.length > 0 && (
        <section className="cart-section">
          <div className="section-header">
            <h2 className="section-title">Your Cart ({cart.length} items)</h2>
          </div>
          <div className="categories-scroll">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-chip ${cartFilter === cat.name ? "active" : ""}`}
                style={{
                  backgroundColor: cartFilter === cat.name ? cat.color : "#ffffff",
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
    </div>
  );
}
