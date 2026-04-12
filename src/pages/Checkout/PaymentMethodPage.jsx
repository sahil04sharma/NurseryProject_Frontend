import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Wallet,
  Banknote,
  Smartphone,
  CheckCircle,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { useOrder } from "../../ContextApi/OrderContext";
import { useCart } from "../../ContextApi/CartContext";
import gpay from "../../assets/Payment/gpay.png";
import phonepe from "../../assets/Payment/phonepe.png";
import paytm from "../../assets/Payment/paytm.png";
import bhimUPI from "../../assets/Payment/bhim.png";
import { toast } from "react-toastify";
import backend from "../../network/backend";

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedUPI, setSelectedUPI] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  const { orderData, setPaymentMethod, resetOrder } = useOrder();
  const { removeFromCart, cartProducts } = useCart();

  const savedCards = [
    { id: "card1", type: "Visa", last4: "4367" },
    { id: "card2", type: "MasterCard", last4: "0923" },
  ];

  const banks = [
    "SBI Bank",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Bank",
  ];

  console.log(orderData);
  const upiApps = [
    { id: "gpay", name: "Google Pay", icon: gpay },
    { id: "phonepe", name: "PhonePe", icon: phonepe },
    { id: "paytm", name: "Paytm", icon: paytm },
    { id: "bhim", name: "BHIM UPI", icon: bhimUPI },
  ];

  const getButtonText = () => {
    if (loading) return "Order Placing...";

    switch (orderData.paymentMethod) {
      case "upi":
        return selectedUPI ? `Pay & Place Order` : "Select UPI App";
      case "card":
        return selectedCard ? `Pay & Place Order` : "Select a Card";
      case "netbanking":
        return selectedBank ? `Pay & Place Order` : "Select Bank";
      case "COD":
        return "Place Order";
      default:
        return "Select Payment Method";
    }
  };

  const handlePlaceOrder = async () => {
    if (orderData.paymentMethod === "upi" && !selectedUPI)
      return toast.error("Please select a UPI app to continue");
    if (orderData.paymentMethod === "card" && !selectedCard)
      return toast.error("Please select or add a card to continue");
    if (orderData.paymentMethod === "netbanking" && !selectedBank)
      return toast.error("Please select your bank to continue");
    if (!orderData.address) return toast.error("Select shipping address");
    setLoading(true);
    try {
      const orderItems = orderData.items.map((item) => ({
        type: item.productType,
        quantity: item.quantity || 1,
        price:
          item?.offerPrice ||
          item?.sellingPrice ||
          item?.itemId?.variants?.[0]?.offerPrice ||
          item?.itemId?.variants?.[0]?.sellingPrice,
        itemDetails: {
          item: item?.itemId || item.itemId._id,
          selectedSize: item?.size || item?.itemId?.variants?.[0]?.label,
          selectedColor:
            item?.color ||
            item?.itemId?.variants?.[0]?.availableColors?.[0]?.color,
        },
      }));

      // Body for backend
      const payload = {
        orderItems,
        shippingAddress: orderData.address,
        paymentMethod: orderData.paymentMethod === "COD" ? "COD" : "Online",
        paymentStatus: orderData.paymentMethod === "COD" ? "pending" : "paid",
        totalPrice: orderData.total,
      };

      const { data } = await backend.post("/order/add", payload);

      if (data.success) {
        // Removing products from cart by CartID If exist
        orderData.items.forEach((item) => {
          const exist = cartProducts.some(
            (cartItem) => cartItem?._id === item._id
          );
          if (exist) {
            removeFromCart(item._id);
          }
        });
        backend.clearCache(`/order/user`);
        resetOrder();
        navigate("/checkout/success");
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error(
        error?.response?.data?.message || "Order placement failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b pt-26 sm:pt-8 md:pt-6 lg:pt-0 from-green-50 to-white px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-6">
        <h2 className="text-md sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-800 flex items-center justify-center gap-2">
          <CreditCard className="text-green-600 w-5 h-5 md:w-7 md:h-7" />
          Choose Payment Method
        </h2>
        <p className="text-gray-600 text-xs md:text-lg md:mt-1">
          Secure checkout — your details are protected with 256-bit encryption.
        </p>
      </div>

      {/* Payment Method Cards */}
      <div className="max-w-4xl mx-auto space-y-2">
        {/* UPI Section */}
        <div
          onClick={() => setPaymentMethod("upi")}
          className={`cursor-pointer bg-white px-5 py-2 rounded-2xl shadow-md hover:shadow-lg border-2 transition ${
            orderData.paymentMethod === "upi"
              ? "border-green-600"
              : "border-transparent"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Smartphone className="text-green-600 w-6 h-6" />
              <h3 className="text-sm md:text-lg font-semibold text-green-800">
                UPI
              </h3>
            </div>
            {orderData.paymentMethod === "upi" && (
              <CheckCircle className="text-green-600 w-6 h-6" />
            )}
          </div>

          {orderData.paymentMethod === "upi" && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {upiApps.map((upi) => (
                <div
                  key={upi.id}
                  onClick={() => setSelectedUPI(upi.id)}
                  className={`border rounded-xl p-1 md:p-3 flex sm:flex-col items-center justify-center cursor-pointer hover:shadow-md transition ${
                    selectedUPI === upi.id
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={upi.icon}
                    alt={upi.name}
                    className="w-10 h-10 object-contain"
                  />
                  <p className="text-sm hidden sm:flex font-medium">
                    {upi.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card Section */}
        <div
          onClick={() => setPaymentMethod("card")}
          className={`cursor-pointer bg-white px-5 py-2 rounded-2xl shadow-md hover:shadow-lg border-2 transition ${
            orderData.paymentMethod === "card"
              ? "border-green-600"
              : "border-transparent"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CreditCard className="text-green-600 w-6 h-6" />
              <h3 className="text-sm md:text-lg font-semibold text-green-800">
                Credit / Debit Card
              </h3>
            </div>
            {orderData.paymentMethod === "card" && (
              <CheckCircle className="text-green-600 w-6 h-6" />
            )}
          </div>

          {orderData.paymentMethod === "card" && (
            <div className="mt-4 space-y-3">
              {/* Saved Cards */}
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedCard(card.id)}
                  className={`flex justify-between items-center border rounded-xl p-3 cursor-pointer hover:shadow-sm ${
                    selectedCard === card.id
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <p className="text-sm font-medium">
                    {card.type} ending in {card.last4}
                  </p>
                  {selectedCard === card.id && (
                    <CheckCircle className="text-green-600 w-5 h-5" />
                  )}
                </div>
              ))}

              {/* Add new card */}
              <div
                onClick={() => setSelectedCard("new")}
                className={`flex justify-between items-center border rounded-xl p-3 cursor-pointer hover:shadow-sm ${
                  selectedCard === "new"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <p className="text-sm font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add New Card
                </p>
                {selectedCard === "new" && (
                  <CheckCircle className="text-green-600 w-5 h-5" />
                )}
              </div>

              {/* New card input */}
              {selectedCard === "new" && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    placeholder="Card Holder Name"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    placeholder="Expiry (MM/YY)"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Netbanking */}
        <div
          onClick={() => setPaymentMethod("netbanking")}
          className={`cursor-pointer bg-white px-5 py-2 rounded-2xl shadow-md hover:shadow-lg border-2 transition ${
            orderData.paymentMethod === "netbanking"
              ? "border-green-600"
              : "border-transparent"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Banknote className="text-green-600 w-6 h-6" />
              <h3 className="text-sm md:text-lg font-semibold text-green-800">
                Net Banking
              </h3>
            </div>
            {orderData.paymentMethod === "netbanking" && (
              <CheckCircle className="text-green-600 w-6 h-6" />
            )}
          </div>

          {orderData.paymentMethod === "netbanking" && (
            <div className="mt-2 md:mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {banks.map((bank) => (
                <div
                  key={bank}
                  onClick={() => setSelectedBank(bank)}
                  className={`border rounded-xl p-1 md:p-3 text-center cursor-pointer hover:shadow-md transition ${
                    selectedBank === bank
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <p className="text-sm font-medium">{bank}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COD */}
        <div
          onClick={() => setPaymentMethod("COD")}
          className={`cursor-pointer bg-white px-5 py-2 rounded-2xl shadow-md hover:shadow-lg border-2 transition ${
            orderData.paymentMethod === "COD"
              ? "border-green-600"
              : "border-transparent"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Wallet className="text-green-600 w-6 h-6" />
              <h3 className="text-sm md:text-lg font-semibold text-green-800">
                Cash on Delivery (COD)
              </h3>
            </div>
            {orderData.paymentMethod === "COD" && (
              <CheckCircle className="text-green-600 w-6 h-6" />
            )}
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="max-w-4xl mx-auto mt-6">
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full py-1 md:py-3 rounded-xl font-semibold text-white  md:text-lg bg-green-600 hover:bg-green-700 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-5 h-5" />
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}
