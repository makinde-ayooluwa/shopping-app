export default function ProductCard({product,index, inWish, toggleWish, addToCart, StarRating}) {
  <div
    className="product-card animate-fade-in"
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    {product.tag && <span className="product-tag">{product.tag}</span>}
    <div className="product-image-wrapper">
      <img src={product.image} alt={product.name} loading="lazy" />
      <button
        className={`product-wishlist ${inWish(product.id) ? "active" : ""}`}
        onClick={(e) => toggleWish(product.id, e)}
        aria-label="Toggle wishlist"
      >
        <i
          className={inWish(product.id) ? "bi bi-heart-fill" : "bi bi-heart"}
        ></i>
      </button>
    </div>
    <div className="product-info">
      <h3 className="product-name">{product.name}</h3>
      <StarRating rating={product.rating} />
      <div className="product-footer">
        <span className="product-price">${product.price.toFixed(2)}</span>
        <button
          className="product-add-btn"
          onClick={() => addToCart(product.name)}
          aria-label="Add to cart"
        >
          <i className="bi bi-cart-plus"></i>
        </button>
      </div>
    </div>
  </div>;
}
