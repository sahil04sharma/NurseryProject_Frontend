import { createContext, useContext, useEffect, useState } from "react";
import backend from "../network/backend";
import { getWithExpiry, setWithExpiry } from "../utils/storageWithExpiry";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [orderData, setOrderData] = useState(() => {
    return (
      getWithExpiry("order-data") || {
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        address: null,
        paymentMethod: "COD",
      }
    );
  });

  const fetchOrders = async (pageNumber = 1) => {
    if (ordersLoading || !hasMore) return;
    try {
      setOrdersLoading(true);
      const { data } = await backend.get(
        `/order/user?page=${pageNumber}&limit=10`
      );
      const newOrders = data.orders;
      const { currentPage, totalPages } = data?.pagination;
      setTotalOrders(data?.pagination?.totalOrders);
      setOrders((prev) =>
        pageNumber === 1 ? newOrders : [...prev, ...newOrders]
      );
      setHasMore(currentPage < totalPages);
      setPage(currentPage);
    } catch (error) {
      console.log("Order fetch failed Error:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    setWithExpiry("order-data", orderData, 15 * 60 * 1000);
  }, [orderData]);

  useEffect(() => {
    if (!orderData.items.length) {
      localStorage.removeItem("order-data");
      return;
    }

    // subtotal: sum of discounted price * qty
    const subtotal = orderData.items.reduce((sum, item) => {
      const variant = item?.itemId?.variants?.[0];
      let priceAfterDiscount = 0;
      if (variant) {
        priceAfterDiscount = variant.offerPrice || variant.sellingPrice || 0;
      } else {
        priceAfterDiscount = item.offerPrice || item.sellingPrice || 0;
      }
      const quantity = item.quantity || 1;
      return sum + priceAfterDiscount * quantity;
    }, 0);

    // tax (e.g. 5%)
    const taxRate = 0.05;
    const tax = subtotal * taxRate;

    // shipping (₹99 unless free shipping)
    const shipping = subtotal > 1000 ? 0 : 40;

    // Total
    const total = subtotal + tax + shipping;

    setOrderData((prev) => ({
      ...prev,
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      shipping,
      total: Number(total.toFixed(2)),
    }));
  }, [orderData.items]);

  // helper functions
  const setOrderItems = (items) => {
    setOrderData((prev) => ({
      ...prev,
      items,
    }));
  };

  const setAddress = (address) => {
    setOrderData((prev) => ({ ...prev, address }));
  };

  const setPaymentMethod = (method) => {
    setOrderData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const resetOrder = () => {
    localStorage.removeItem("order-data");
    setOrderData({
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      address: null,
      paymentMethod: "",
    });
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        orderData,
        page,
        hasMore,
        ordersLoading,
        totalOrders,
        setOrders,
        setOrderItems,
        setAddress,
        setPaymentMethod,
        resetOrder,
        fetchOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
