import { useState, useEffect } from "react";

const userLocalStorage = function () {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return [user, setUser];
};
const ordersLocalStorage = function () {
  const [orders, setOrdersState] = useState(() => {
    try {
      const stored = localStorage.getItem("orders");
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // ✅ Safe setter (always keeps array)
  const setOrders = (value) => {
    if (typeof value === "function") {
      setOrdersState((prev) => {
        const result = value(prev);
        return Array.isArray(result) ? result : [result];
      });
    } else {
      setOrdersState(Array.isArray(value) ? value : [value]);
    }
  };

  // ✅ Append helper (best way)
  const addOrder = (newOrder) => {
    setOrdersState((prev) => [...prev, newOrder]);
  };

  return [orders, setOrders];
};
export { userLocalStorage, ordersLocalStorage };
