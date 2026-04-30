import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CartToast from "../components/CartToast";

export default function Checkout({
  cartToast,
  setCartToast,
  cart,
  removeFromCart,
  user,
  setUser,
  products,
  orders,
  setOrders,
  addOrder
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
//   const [orders, setorders] = useState(null);
  const [adminNotificationSent, setAdminNotificationSent] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardInfo, setCardInfo] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product?.price || 0) * (item.quantity || 1);
  }, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleCardChange = (e) => {
    setCardInfo({
      ...cardInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleFlutterWavePayment = async (total) => {
    setLoading(true);

    // Simulate Flutterwave payment processing
    setTimeout(() => {
      // Create order object
      const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        status: "Processing",
        total: total,
        items: cart.map(item => {
          const product = products.find(p => p.id === item.id);
          return {
            ...product,
            quantity: item.quantity || 1,
          };
        }),
        shipping: shippingInfo,
        paymentMethod: "flutterwave",
        tracking: `#ORD-${Date.now().toString().slice(-6)}`,
        paymentDetails: null
      };

      // Update user orders (simulate)
      const updatedUser = {
        ...user,
        orders: (user?.orders || 0) + 1,
        totalSpent: ((parseFloat(user?.totalSpent?.replace(',', '') || 0) + parseFloat(total))).toFixed(2),
      };
      setUser(updatedUser);

      // Clear cart
      cart.forEach(item => removeFromCart(item.id));

      // Store order data and show receipt
      setOrders([...orders, order]);
      setShowReceipt(true);
      setLoading(false);

      setCartToast({
        show: true,
        message: "Flutterwave payment successful! Please review your receipt.",
        type: "success",
      });
    }, 2000);
  };
const sendReceiptToAdmin = () => {
    // Simulate sending receipt to admin
    setAdminNotificationSent(true);
    setCartToast({
      show: true,
      message: "Receipt sent to admin for confirmation! Your order will be confirmed once payment is confirmed.",
      type: "success",
    });
    setTimeout(() => {
      navigate("/profile");
    }, 2000);
  };

  const downloadReceipt = () => {
    // Create a simple text receipt for download
    const receiptText = generateReceiptText();
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${orders.tracking}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReceiptText = () => {
    return `
SHOPNOW - PAYMENT RECEIPT
==========================

Order ID: ${orders.tracking}
Date: ${new Date(orders.date).toLocaleDateString()} ${new Date(orders.date).toLocaleTimeString()}
Status: ${orders.status}

CUSTOMER INFORMATION
--------------------
Name: ${orders.shipping.fullname}
Email: ${orders.shipping.email}
Phone: ${orders.shipping.phone}
Address: ${orders.shipping.address}, ${orders.shipping.city}, ${orders.shipping.state} ${orders.shipping.zipCode}, ${orders.shipping.country}

PAYMENT INFORMATION
-------------------
Method: ${orders.paymentMethod.toUpperCase()}
${orders.paymentDetails ? `Card ending in: ****${orders.paymentDetails.lastFour}
Cardholder: ${orders.paymentDetails.cardholderName}` : ''}

ORDER ITEMS
-----------
${orders.items.map(item => `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

ORDER SUMMARY
-------------
Subtotal: $${(parseFloat(orders.total) - 9.99 - (parseFloat(orders.total) - 9.99) * 0.08).toFixed(2)}
Shipping: $9.99
Tax (8%): $${((parseFloat(orders.total) - 9.99) * 0.08).toFixed(2)}
TOTAL: $${orders.total}

==========================
Thank you for shopping with ShopNow!
For any questions, contact: admin@shopnow.com
==========================
    `.trim();
  };

  // Receipt Modal Component
  const ReceiptModal = ({ order, onClose, onSendToAdmin, onDownload }) => (
    <div className="receipt-modal-overlay">
      <div className="receipt-modal">
        <div className="receipt-header">
          <h2>Payment Receipt</h2>
          <button className="receipt-close-btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="receipt-content">
          <div className="receipt-brand">
            <i className="bi bi-bag-check"></i>
            <h3>ShopNow</h3>
          </div>

          <div className="receipt-order-info">
            <div className="receipt-row">
              <span>Order ID:</span>
              <strong>{order.tracking}</strong>
            </div>
            <div className="receipt-row">
              <span>Date:</span>
              <span>{new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div className="receipt-row">
              <span>Status:</span>
              <span className="status-processing">{order.status}</span>
            </div>
          </div>

          <div className="receipt-section">
            <h4>Customer Information</h4>
            <div className="receipt-details">
              <p><strong>{order.shipping.fullname}</strong></p>
              <p>{order.shipping.email}</p>
              <p>{order.shipping.phone}</p>
              <p>{order.shipping.address}</p>
              <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</p>
              <p>{order.shipping.country}</p>
            </div>
          </div>

          <div className="receipt-section">
            <h4>Payment Information</h4>
            <div className="receipt-details">
              <p><strong>{order.paymentMethod.toUpperCase()}</strong></p>
              {order.paymentDetails && (
                <p>Card ending in: ****{order.paymentDetails.lastFour}</p>
              )}
            </div>
          </div>

          <div className="receipt-section">
            <h4>Order Items</h4>
            <div className="receipt-items">
              {order.items.map((item, index) => (
                <div key={index} className="receipt-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">x{item.quantity}</span>
                  </div>
                  <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="receipt-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${(parseFloat(order.total) - 9.99 - (parseFloat(order.total) - 9.99) * 0.08).toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>$9.99</span>
            </div>
            <div className="total-row">
              <span>Tax (8%):</span>
              <span>${((parseFloat(order.total) - 9.99) * 0.08).toFixed(2)}</span>
            </div>
            <div className="total-row total">
              <span>TOTAL:</span>
              <span>${order.total}</span>
            </div>
          </div>
        </div>

        <div className="receipt-actions">
          <button className="btn-secondary" onClick={onDownload}>
            <i className="bi bi-download"></i>
            Download Receipt
          </button>
          <button
            className="btn-primary"
            onClick={onSendToAdmin}
            disabled={adminNotificationSent}
          >
            <i className="bi bi-send"></i>
            {adminNotificationSent ? "Sent to Admin" : "Send to Admin"}
          </button>
        </div>

        <div className="receipt-footer">
          <p>Thank you for shopping with ShopNow!</p>
          <p>For questions: <a href="mailto:admin@shopnow.com">admin@shopnow.com</a></p>
        </div>
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Create order object
      const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        status: "Processing",
        total: total.toFixed(2),
        items: cart.map(item => {
          const product = products.find(p => p.id === item.id);
          return {
            ...product,
            quantity: item.quantity || 1,
          };
        }),
        shipping: shippingInfo,
        paymentMethod,
        tracking: `#ORD-${Date.now().toString().slice(-6)}`,
        paymentDetails: paymentMethod === "card" ? {
          lastFour: cardInfo.number.slice(-4),
          cardholderName: cardInfo.name
        } : null
      };

      // Update user orders (simulate)
      const updatedUser = {
        ...user,
        orders: (user?.orders || 0) + 1,
        totalSpent: ((parseFloat(user?.totalSpent?.replace(',', '') || 0) + total)).toFixed(2),
      };
      setUser(updatedUser);

      // Clear cart
      cart.forEach(item => removeFromCart(item.id));

      // Store order data and show receipt
      setorders(order);
      setShowReceipt(true);
      setLoading(false);

      setCartToast({
        show: true,
        message: "Order placed successfully! Please review your receipt.",
        type: "success",
      });
    }, 2000);
  };

  // Show receipt modal if order was placed
  if (showReceipt && orders) {
    return (
      <div className="checkout-page">
        <Header user={user} />
        <CartToast cartToast={cartToast} />
        <ReceiptModal
          order={orders}
          onClose={() => setShowReceipt(false)}
          onSendToAdmin={sendReceiptToAdmin}
          onDownload={downloadReceipt}
        />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <Header user={user} />
      <CartToast cartToast={cartToast} />
        <div className="empty-cart">
          <i className="bi bi-cart-x"></i>
          <h2>Your cart is empty</h2>
          <p>Add some products to proceed to checkout</p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Header user={user} />
      <CartToast cartToast={cartToast} />

      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cart.map((item) => {
                const product = products.find(p => p.id === item.id);
                if (!product) return null;
                return (
                  <div key={item.id} className="order-item">
                    <img src={product.image} alt={product.name} />
                    <div className="item-details">
                      <h4>{product.name}</h4>
                      <p>Qty: {item.quantity || 1}</p>
                      <p>${(product.price * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="total-row">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            {/* Shipping Information */}
            <div className="form-section">
              <h2>Shipping Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullname"
                    value={shippingInfo.fullname}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <select
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleShippingChange}
                  >
                    <option value="USA">United States</option>
                    <option value="CAN">Canada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Credit/Debit Card</span>
                  <i className="bi bi-credit-card"></i>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>PayPal</span>
                  <i className="bi bi-paypal"></i>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="flutterwave"
                    checked={paymentMethod === "flutterwave"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Flutterwave</span>
                  <i className="bi bi-flutterwave"></i>
                </label>
              </div>

              {paymentMethod === "card" && (
                <div className="card-details">
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Card Number</label>
                      <input
                        type="text"
                        name="number"
                        placeholder="1234 5678 9012 3456"
                        value={cardInfo.number}
                        onChange={handleCardChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        value={cardInfo.expiry}
                        onChange={handleCardChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        placeholder="123"
                        value={cardInfo.cvv}
                        onChange={handleCardChange}
                        required
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Name on Card</label>
                      <input
                        type="text"
                        name="name"
                        value={cardInfo.name}
                        onChange={handleCardChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type={paymentMethod == "flutterwave" ? "button" : "submit"}
              className="checkout-btn"
              disabled={loading}
              onClick={paymentMethod == "flutterwave" ? ()=>handleFlutterWavePayment(total.toFixed(2)) : undefined}
            >
              {loading ? (
                <>
                  <i className="bi bi-arrow-repeat spinning"></i>
                  Processing...
                </>
              ) : (
                <>
                  Place Order - ${total.toFixed(2)}
                </>
              )}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}