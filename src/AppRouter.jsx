import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { userLocalStorage } from "./hooks/useLocalStorage";

export default function AppRouter() {
  const [user,setUser] = userLocalStorage();
  const categories = [
    { id: "all", name: "All", icon: "bi bi-grid", color: "#1e1b4b" },
    {
      id: "electronics",
      name: "Electronics",
      icon: "bi bi-laptop",
      color: "#3b82f6",
    },
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
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      tag: "Best Seller",
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      price: 199.99,
      rating: 4.8,
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      tag: "New",
    },
    {
      id: 3,
      name: "Running Shoes",
      price: 89.99,
      rating: 4.3,
      category: "Sports",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      tag: "Sale",
    },
    {
      id: 4,
      name: "Denim Jacket",
      price: 59.99,
      rating: 4.6,
      category: "Fashion",
      image:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop",
      tag: "",
    },
    {
      id: 5,
      name: "Cozy Sofa",
      price: 499.99,
      rating: 4.7,
      category: "Home",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      tag: "Popular",
    },
    {
      id: 6,
      name: "Face Serum",
      price: 34.99,
      rating: 4.4,
      category: "Beauty",
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
      tag: "",
    },
    {
      id: 7,
      name: "Gaming Mouse",
      price: 49.99,
      rating: 4.2,
      category: "Electronics",
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
      tag: "Hot",
    },
    {
      id: 8,
      name: "Yoga Mat",
      price: 29.99,
      rating: 4.5,
      category: "Sports",
      image:
        "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
      tag: "",
    },
    {
      id: 9,
      name: "Leather Handbag",
      price: 129.99,
      rating: 4.7,
      category: "Fashion",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
      tag: "New",
    },
    {
      id: 10,
      name: "Table Lamp",
      price: 45.99,
      rating: 4.3,
      category: "Home",
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
      tag: "",
    },
    {
      id: 11,
      name: "Basketball",
      price: 24.99,
      rating: 4.6,
      category: "Sports",
      image:
        "https://images.unsplash.com/photo-1519861531473-92002639313f?w=400&h=400&fit=crop",
      tag: "",
    },
    {
      id: 12,
      name: "Lipstick Set",
      price: 19.99,
      rating: 4.5,
      category: "Beauty",
      image:
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
      tag: "Sale",
    },
  ];
  const [cartToast, setCartToast] = useState({ show: false, message: "" });
  const [wishlist, setWishlist] = useState(() => {
    try {
      const s = localStorage.getItem("shopping_wishlist");
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const [cart, setCart] = useState(() => {
    try {
      const s = localStorage.getItem("shopping_cart");
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let message;
    if (existingItem) {
      message = `${product.name} already in cart - quantity incremented!`;
      setCart(prevCart => prevCart.map(item =>
        item.id === product.id 
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      ));
    } else {
      message = `Added ${product.name} to cart!`;
      setCart(prevCart => [...prevCart, { ...product, quantity: 1 }]);
    }
    setCartToast({ show: true, message });
    setTimeout(() => setCartToast({ show: false, message: "" }), 2200);
  };
  const inWish = (id) => wishlist.includes(id);
  const toggleWish = (id, ev) => {
    ev.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  useEffect(() => {
    localStorage.setItem("shopping_cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login user={user} setUser={setUser} />} />
        <Route path="/signup" element={<SignUp user={user} setUser={setUser} />} />
        <Route
          path="/"
          element={
            <>
              <Home
                cartToast={cartToast}
                setCartToast={setCartToast}
                addToCart={addToCart}
                cart={cart}
                removeFromCart={removeFromCart}
                inWish={inWish}
                toggleWish={toggleWish}
                wishlist={wishlist}
                categories={categories}
                products={products}
              />
              <Footer />
            </>
          }
        />
        <Route
          path="/categories"
          element={
            <>
              <Categories
                cartToast={cartToast}
                setCartToast={setCartToast}
                addToCart={addToCart}
                cart={cart}
                removeFromCart={removeFromCart}
                inWish={inWish}
                toggleWish={toggleWish}
                wishlist={wishlist}
                categories={categories}
                products={products}
              />
              <Footer />
            </>
          }
        />
        <Route
          path="/search"
          element={
            <>
              <Search
                cartToast={cartToast}
                setCartToast={setCartToast}
                addToCart={addToCart}
                cart={cart}
                removeFromCart={removeFromCart}
                inWish={inWish}
                toggleWish={toggleWish}
                wishlist={wishlist}
                categories={categories}
                products={products}
              />
              <Footer />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Profile 
                cartToast={cartToast}
                setCartToast={setCartToast}
                addToCart={addToCart}
                cart={cart}
                removeFromCart={removeFromCart}
                inWish={inWish}
                toggleWish={toggleWish}
                wishlist={wishlist}
                categories={categories}
                products={products}
                user={user}
                setUser={setUser}
              />
              <Footer />
            </>
          }
        />
        <Route
          path="*"
          element={
            <>
              <NotFound />
              <Footer />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
