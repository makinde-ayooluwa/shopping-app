import { useEffect, useState } from "react";
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

export default function Profile({
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
  setUser,
  orders,
  setOrders
}) {
  const [activeTab, setActiveTab] = useState("cart");
  // const [user, setUser] = useState({
  //   name: "John Doe",
  //   email: "john@example.com",
  //   phone: "+1 (555) 123-4567",
  //   address: "123 Main St, City, State 12345",
  //   orders: 12,
  //   totalSpent: "1,245.67",
  //   currency: "$",
  // });

  const updateQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
          : item,
      ),
    );
  };

  const clearCart = () => {
    if (cart.length > 0 && confirm("Clear entire cart?")) {
      cart.forEach((item) => removeFromCart(item.id));
    }
  };


  // Wishlist products
  const wishlistProducts = products.filter((p) => inWish(p.id));

  return (
    <>
      {user ? (
        <>
          <div className="profile-page">
            <Header user={user} />
            <CartToast cartToast={cartToast}/>
            <div className="profile-container">
              {/* Profile Header */}
              <div className="profile-header">
                <div className="profile-avatar-section">
                  <div className="profile-avatar">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <div>
                    <h1 className="profile-name">{user.fullname}</h1>
                    <p className="profile-id">
                      ID: USER{Date.now().toString().slice(-6)}
                    </p>
                  </div>
                </div>
                <div className="profile-stats">
                  <div className="stat-card">
                    <div className="stat-number">{user.orders}</div>
                    <div className="stat-label">Orders</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">
                      {user.currency}
                      {user.totalSpent}
                    </div>
                    <div className="stat-label">Spent</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{cart.length}</div>
                    <div className="stat-label">Cart</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{wishlistProducts.length}</div>
                    <div className="stat-label">Wishlist</div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="profile-tabs">
                <button
                  className={`tab-btn ${activeTab === "cart" ? "active" : ""}`}
                  onClick={() => setActiveTab("cart")}
                >
                  <i className="bi bi-cart"></i> Cart ({cart.length})
                </button>
                <button
                  className={`tab-btn ${activeTab === "wishlist" ? "active" : ""}`}
                  onClick={() => setActiveTab("wishlist")}
                >
                  <i className="bi bi-heart"></i> Wishlist (
                  {wishlistProducts.length})
                </button>
                <button
                  className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
                  onClick={() => setActiveTab("orders")}
                >
                  <i className="bi bi-box"></i> Orders ({orders.length})
                </button>
                <button
                  className={`tab-btn ${activeTab === "account" ? "active" : ""}`}
                  onClick={() => setActiveTab("account")}
                >
                  <i className="bi bi-gear"></i> Account
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === "cart" && (
                  <section className="profile-section">
                    <div className="section-header">
                      <h2 className="section-title">Shopping Cart</h2>
                      {cart.length > 0 && (
                        <div className="section-actions">
                          <button className="clear-btn" onClick={clearCart}>
                            Clear All
                          </button>
                          <Link to="/checkout" className="checkout-btn">
                            Checkout <i className="bi bi-arrow-right"></i>
                          </Link>
                        </div>
                      )}
                    </div>
                    {cart.length === 0 ? (
                      <div className="empty-state">
                        <i className="bi bi-cart-x empty-icon"></i>
                        <h3>Your cart is empty</h3>
                        <Link to="/" className="empty-btn">
                          Start Shopping
                        </Link>
                      </div>
                    ) : (
                      <div className="products-grid">
                        {cart.map((item, index) => (
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
                    )}
                  </section>
                )}

                {activeTab === "wishlist" && (
                  <section className="profile-section">
                    <h2 className="section-title">Wishlist</h2>
                    {wishlistProducts.length === 0 ? (
                      <div className="empty-state">
                        <i className="bi bi-heart empty-icon"></i>
                        <h3>No items in wishlist</h3>
                        <p>Browse products and add favorites</p>
                        <Link to="/" className="empty-btn">
                          Shop Now
                        </Link>
                      </div>
                    ) : (
                      <div className="products-grid">
                        {wishlistProducts.map((product, index) => (
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
                    )}
                  </section>
                )}

                {activeTab === "orders" && (
                  <section className="profile-section">
                    <h2 className="section-title">Order History</h2>
                    <div className="orders-list">
                      {orders.map((order) => (
                        <div key={order.id} className="order-card">
                          <div className="order-header">
                            <div>
                              <span className="order-id">
                                #{order.tracking}
                              </span>
                              <span className="order-date">{order.date}</span>
                            </div>
                            <span
                              className={`order-status ${order.status.toLowerCase()}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="order-items">
                            {order.items.slice(0, 2).map((item, index) => (
                              <div key={index} className="order-item-mini">
                                <img src={item.image} alt={item.name} />
                                <div>
                                  <div className="item-name">{item.name}</div>
                                  <div className="item-price">
                                    Qty {item.quantity} x ${item.price}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="more-items">
                                +{order.items.length - 2} more
                              </div>
                            )}
                          </div>
                          <div className="order-footer">
                            <span className="order-total">
                              Total: ${order.total}
                            </span>
                            {order.status === "Pending" && (
                              <button className="track-btn">Track Order</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {orders.length === 0 && (
                      <div className="empty-state">
                        <i className="bi bi-box-seam empty-icon"></i>
                        <h3>No orders yet</h3>
                        <p>Your shopping journey starts here</p>
                        <Link to="/" className="empty-btn">
                          Shop Now
                        </Link>
                      </div>
                    )}
                  </section>
                )}

                {activeTab === "account" && (
                  <section className="profile-section">
                    <div className="section-header">
                      <h2 className="section-title">Account Settings</h2>
                    </div>
                    <div className="account-form">
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          value={user.fullname}
                          onChange={(e) =>
                            setUser({ ...user, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          value={user.email}
                          onChange={(e) =>
                            setUser({ ...user, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="tel"
                          value={user.phone}
                          onChange={(e) =>
                            setUser({ ...user, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Address</label>
                        <textarea
                          value={user.address}
                          onChange={(e) =>
                            setUser({ ...user, address: e.target.value })
                          }
                        />
                      </div>
                      <button className="save-btn">Save Changes</button>
                    </div>
                    <div className="account-actions">
                      <Link to="/forgot-password" className="action-btn secondary">
                        Change Password
                      </Link>
                      <button className="action-btn danger">
                        Delete Account
                      </button>
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
        <h1>Login to access your profile</h1>
        </>
      )}
    </>
  );
}
