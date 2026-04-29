export default function ProductCard({
  product,
  index,
  inWish,
  toggleWish,
  addToCart,
  StarRating,
  cartItemMode = false,
  quantity = 1,
  onRemove = () => {},
}) {
  return (
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
          {!cartItemMode ? (
            <button
              className="product-add-btn"
              onClick={() => addToCart(product)}
              aria-label="Add to cart"
            >
              <i className="bi bi-cart-plus"></i>
            </button>
          ) : (
            <>
              <span className="product-qty">Qty: {quantity}</span>
              <button
                className="product-remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(product.id);
                }}
                aria-label="Remove from cart"
              >
                <i className="bi bi-trash"></i>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
