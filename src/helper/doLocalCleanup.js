import backend from "../network/backend";

export const doLocalCleanup = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("user-cart");
  localStorage.removeItem("my-orders");
  localStorage.removeItem("wishlist");

  // If your backend helper exposes cache clear, call it
  backend?.clearCache?.();
};
