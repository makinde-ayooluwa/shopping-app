import { useState } from "react";
import { Link } from "react-router-dom";

const categories = [
  { id: "all", name: "All", icon: "bi bi-grid", color: "#1e1b4b" },
  { id: "electronics", name: "Electronics", icon: "bi bi-laptop", color: "#3b82f6" },
  { id: "fashion", name: "Fashion", icon: "bi bi-bag", color: "#ec4899" },
  { id: "home", name: "Home", icon: "bi bi-house-door", color: "#f59e0b" },
  { id: "sports", name: "Sports", icon: "bi bi-bicycle", color: "#10b981" },
  { id: "beauty", name: "Beauty", icon: "bi bi-heart", color: "#8b5cf6" },
];

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 79.99,
    rating: 4.5,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    price: 199.99,
    rating: 4.8,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    tag: "New",
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 89.99,
    rating: 4.3,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    tag: "Sale",
  },
  {
    id: 4,
    name: "Denim Jacket",
    price: 59.99,
    rating: 4.6,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop",
    tag: "",
  },
  {
    id: 5,
    name: "Cozy Sofa",
    price: 499.99,
    rating: 4.7,
    category: "Home",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    tag: "Popular",
  },
  {
    id: 6,
    name: "Face Serum",
    price: 34.99,
    rating: 4.4,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    tag: "",
  },
  {
    id: 7,
    name: "Gaming Mouse",
    price: 49.99,
    rating: 4.2,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    tag: "Hot",
  },
  {
    id: 8,
    name: "Yoga Mat",
    price: 29.99,
    rating: 4.5,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    tag: "",
  },
  {
    id: 9,
    name: "Leather Handbag",
    price: 129.99,
    rating: 4.7,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
    tag: "New",
  },
  {
    id: 10,
    name: "Table Lamp",
    price: 45.99,
    rating: 4.3,
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    tag: "",
  },
  {
    id: 11,
    name: "Basketball",
    price: 24.99,
    rating: 4.6,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1519861531473-92002639313f?w=400&h=400&fit=crop",
    tag: "",
  },
  {
    id: 12,
    name: "Lipstick Set",
    price: 19.99,
    rating: 4.5,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
    tag: "Sale",
  },
];

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<i key={`full-${i}`} className="bi bi-star-fill star-filled"></i>);
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

export default function Categories() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const getProductCount = (catName) => {
    if (catName === "All") return products.length;
    return products.filter((p) => p.category === catName).length;
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="categories-page">
      {/* Header */}
      <div className="categories-header">
        <Link to="/" className="back-btn">
          <i className="bi bi-arrow-left"></i>
        </Link>
        <h1 className="categories-title">Categories</h1>
        <div className="header-spacer"></div>
      </div>

      {/* Search */}
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

      {/* Category Cards */}
      <section className="category-cards-section">
        <div className="category-cards-grid">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-card ${activeCategory === cat.name ? "active" : ""}`}
              onClick={() => {
                setActiveCategory(cat.name);
                setSearchQuery("");
              }}
              style={{
                "--cat-color": cat.color,
              }}
            >
              <div className="category-card-icon">
                <i className={cat.icon}></i>
              </div>
              <span className="category-card-name">{cat.name}</span>
              <span className="category-card-count">
                {getProductCount(cat.name)} items
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Results Info */}
      <div className="results-info">
        <h2 className="section-title">{activeCategory}</h2>
        <span className="results-count">
          {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Products */}
      <section className="products-section">
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              {product.tag && <span className="product-tag">{product.tag}</span>}
              <div className="product-image-wrapper">
                <img src={product.image} alt={product.name} loading="lazy" />
                <button className="product-wishlist">
                  <i className="bi bi-heart"></i>
                </button>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <StarRating rating={product.rating} />
                <div className="product-footer">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <button className="product-add-btn">
                    <i className="bi bi-cart-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="no-results">
            <i className="bi bi-search"></i>
            <p>No products found in {activeCategory}</p>
          </div>
        )}
      </section>
    </div>
  );
}

