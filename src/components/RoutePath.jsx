import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./Layout/Layout";
import HomePage from "../pages/HomePage";
const CreateAccount = lazy(() => import("../pages/Account/CreateAccount"));
const VerifyOTP = lazy(() => import("../pages/Account/VerifyOTP"));
const SetPassword = lazy(() => import("../pages/Account/SetPass"));
const SignIn = lazy(() => import("../pages/Account/SignIn"));
const ForgotPassword = lazy(() => import("../pages/Account/ForgotPass"));
const ResetPassword = lazy(() => import("../pages/Account/ResetPass"));

const MyProfile = lazy(() => import("../pages/MyProfile/MyProfile"));
const ProductDetail = lazy(() =>
  import("../pages/ProductDetails/ProductDetail")
);
const PlantDetail = lazy(() => import("../pages/ProductDetails/PlantDetail"));
const AddAddress = lazy(() => import("../components/address/AddAddress"));
const UpdateAddress = lazy(() => import("../components/address/UpdateAddress"));
const AddCard = lazy(() => import("../components/AddCard"));
const ContactUs = lazy(() => import("../components/ContactUs"));
const AboutUs = lazy(() => import("../pages/AboutUs/AboutUs"));
const WishlistPage = lazy(() => import("../components/homepage/WhishlistPage"));
const ReviewOrderPage = lazy(() => import("../pages/Checkout/ReviewOrderPage"));
const SelectAddressPage = lazy(() =>
  import("../pages/Checkout/SelectAddressPage")
);
const PaymentMethodPage = lazy(() =>
  import("../pages/Checkout/PaymentMethodPage")
);
const OrderSuccessPage = lazy(() =>
  import("../pages/Checkout/OrderSuccessPage")
);
const EditCartItem = lazy(() => import("../pages/Cart/EditCartItem"));
const OrderDetails = lazy(() => import("./orders/OrderDetails"));
const Wallet = lazy(() => import("./MyProfile/Wallet"));
const AddressesList = lazy(() => import("./MyProfile/AddressesList"));
const NotificationsPanel = lazy(() => import("./MyProfile/NotificationsPanel"));
const MyProfileNavigation = lazy(() =>
  import("./navigation/MyProfileNavigation")
);
const MyOrders = lazy(() => import("../pages/MyProfile/MyOrders/MyOrders"));
const ChangePassword = lazy(() => import("../components/MyProfile/ResetPass"));
const ChatSupport = lazy(() => import("../pages/ChatSupport"));
const AddReview = lazy(() => import("../components/AddReview"));
const BlogDetail = lazy(() => import("../components/Blogs/BlogDetail"));
const BlogPage = lazy(() => import("../components/Blogs/BlogPage"));
const RouteBoundary = lazy(() => import("./RouteBoundary"));
const OrderReview = lazy(() => import("./OrderwithReview/Rating"));
const RatingDetails = lazy(() =>
  import("../components/OrderwithReview/RatingDetail")
);
const DeleteAccount = lazy(() => import("../pages/Account/DeleteAccount"));
const NotificationsPage = lazy(() => import("./Notification/NotificationPage"));
const ProductsPage = lazy(() => import("../pages/ProductDetails/ProductsPage"));
import PrivateRoute from "./PrivateRoute";
import ProductDetailByQR from "../pages/ProductDetails/ProductDetailByQR";
const Support = lazy(() => import("../pages/Support"));

const RoutePath = () => {
  return (
    <Suspense fallback={null}>
      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route
          path="/create-account"
          element={<RouteBoundary element={<CreateAccount />} />}
        />
        <Route
          path="/verify-otp"
          element={<RouteBoundary element={<VerifyOTP />} />}
        />
        <Route
          path="/set-pass"
          element={<RouteBoundary element={<SetPassword />} />}
        />

        <Route
          path="/forgot-pass"
          element={<RouteBoundary element={<ForgotPassword />} />}
        />

        <Route
          path="/reset-password"
          element={<RouteBoundary element={<ResetPassword />} />}
        />
        <Route
          path="/sign-in"
          element={<RouteBoundary element={<SignIn />} />}
        />

        <Route path="/plant-detail/:id" element={<ProductDetailByQR />} />

        {/* ---------- MAIN LAYOUT ---------- */}
        <Route path="/" element={<Layout />}>
          {/* HOME */}
          <Route index element={<RouteBoundary element={<HomePage />} />} />

          {/* BLOGS */}
          <Route
            path="/blogs"
            element={<RouteBoundary element={<BlogPage />} />}
          />
          <Route
            path="/blogs/:slug"
            element={<RouteBoundary element={<BlogDetail />} />}
          />

          {/* ADDRESS ROUTES */}
          <Route
            path="/add-address"
            element={<RouteBoundary element={<AddAddress />} />}
          />
          <Route
            path="update-address/:id"
            element={<RouteBoundary element={<UpdateAddress />} />}
          />

          {/* ADD CARD */}
          <Route
            path="/add-card"
            element={<RouteBoundary element={<AddCard />} />}
          />

          {/* PRODUCT DETAIL */}
          <Route path="/product">
            <Route
              path="item/:id"
              element={<RouteBoundary element={<ProductDetail />} />}
            />
            <Route
              path="plant/:id"
              element={<RouteBoundary element={<PlantDetail />} />}
            />
          </Route>

          {/* ALL PRODUCTS */}
          <Route
            path="/ViewAll-Item"
            element={<RouteBoundary element={<ProductsPage />} />}
          />

          {/* CONTACT US & ABOUT US */}
          <Route
            path="/Contact-us"
            element={<RouteBoundary element={<ContactUs />} />}
          />
          <Route
            path="/about-us"
            element={<RouteBoundary element={<AboutUs />} />}
          />

          {/* ADD REVIEW */}
          <Route
            path="/Add-Review"
            element={<RouteBoundary element={<AddReview />} />}
          />

          {/* ORDERS WITH REVIEWS */}

          <Route path="/notifications" element={<NotificationsPage />} />

          {/* Private Routes goes here */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/wishlist"
              element={<RouteBoundary element={<WishlistPage />} />}
            />

            {/* CHECKOUT */}
            <Route
              path="/checkout/review"
              element={<RouteBoundary element={<ReviewOrderPage />} />}
            />
            <Route
              path="/checkout/address"
              element={<RouteBoundary element={<SelectAddressPage />} />}
            />
            <Route
              path="/checkout/payment"
              element={<RouteBoundary element={<PaymentMethodPage />} />}
            />
            <Route
              path="/checkout/success"
              element={<RouteBoundary element={<OrderSuccessPage />} />}
            />

            {/* MY PROFILE ROUTES */}
            <Route
              path="/my-profile"
              element={<RouteBoundary element={<MyProfileNavigation />} />}
            >
              <Route
                index
                element={<RouteBoundary element={<MyProfile />} />}
              />
              <Route
                path="wallet"
                element={<RouteBoundary element={<Wallet />} />}
              />
              <Route
                path="support"
                element={<RouteBoundary element={<Support />} />}
              />
              <Route
                path="resetPass"
                element={<RouteBoundary element={<ChangePassword />} />}
              />
              <Route
                path="my-addresses"
                element={<RouteBoundary element={<AddressesList />} />}
              />
              <Route
                path="notifications"
                element={<RouteBoundary element={<NotificationsPanel />} />}
              />
              <Route
                path="my-orders"
                element={<RouteBoundary element={<MyOrders />} />}
              />

              <Route
                path="delete-account"
                element={<RouteBoundary element={<DeleteAccount />} />}
              />
              <Route
                path="my-orders/:orderId"
                element={<RouteBoundary element={<OrderDetails />} />}
              />

              <Route
                path="my-ratings"
                element={<RouteBoundary element={<OrderReview />} />}
              />

              <Route
                path="my-ratings/:orderId"
                element={<RouteBoundary element={<RatingDetails />} />}
              />
            </Route>
          </Route>

          {/* CHAT SUPPORT */}
          <Route
            path="/support/chat"
            element={<RouteBoundary element={<ChatSupport />} />}
          />

          {/* CART */}
          <Route
            path="/edit-cart"
            element={<RouteBoundary element={<EditCartItem />} />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RoutePath;
