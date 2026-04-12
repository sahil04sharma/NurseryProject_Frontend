import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { CartProvider } from "./ContextApi/CartContext.jsx";
import { WishlistProvider } from "./ContextApi/WishlistContext.jsx";
import { AuthProvider } from "./ContextApi/AuthContext.jsx";
import { OrderProvider } from "./ContextApi/OrderContext.jsx";
import ErrorBoundary from "./components/ErrorBoundaries.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Slide, ToastContainer } from "react-toastify";
import { AddressProvider } from "./ContextApi/AddressContext.jsx";
import { AppProvider } from "./ContextApi/AppContext.jsx";

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <ToastContainer
      position="top-right"
      autoClose={1200}
      hideProgressBar
      closeOnClick
      pauseOnHover={false}
      draggable={false}
      transition={Slide}
      gutter={2}
    />
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AppProvider>
          <AuthProvider>
            <AddressProvider>
              <CartProvider>
                <OrderProvider>
                  <WishlistProvider>
                    <StrictMode>
                      <App />
                    </StrictMode>
                  </WishlistProvider>
                </OrderProvider>
              </CartProvider>
            </AddressProvider>
          </AuthProvider>
        </AppProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
