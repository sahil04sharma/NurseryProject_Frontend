import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../../ContextApi/CartContext";
import { toast } from "react-toastify";
import backend from "../../network/backend";

const EditCartItem = () => {
  const [searchParams] = useSearchParams();
  const cartId = searchParams.get("cartId");
  const productId = searchParams.get("productId");
  const navigate = useNavigate();
  const { cartProducts, updateCartProduct } = useCart();

  const [product, setProduct] = useState({variants:[]});
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await backend.get(`/item/get-id/${productId}`);
        setProduct(data.item);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch product details.");
      }
    };
    getProduct();
  }, []);

  useEffect(() => {
    if (product?.variants?.length) {
      setAvailableSizes(product.variants);
      const firstVariant = product.variants[0];
      setAvailableColors(firstVariant.availableColors || []);
      setSelectedSize(firstVariant.label || "");
      setSelectedColor(firstVariant.availableColors?.[0]?.color || "");
    }
  }, [product]);

  const validateFields = () => {
    const newErrors = {};
    if (quantity < 1) newErrors.quantity = "Quantity must be at least 1.";
    if (!selectedColor.trim()) newErrors.color = "Please select a color.";
    if (!selectedSize.trim()) newErrors.size = "Please select a variant.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateFields()) {
      toast.error("Please correct all highlighted errors.");
      return;
    }
    updateCartProduct(cartId, {
      quantity,
      color: selectedColor,
      size: selectedSize,
    });
    toast.success("Cart item updated successfully!");
    navigate(-1);
  };

  if (!product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50">
        <h2 className="heading-2 text-gray-800 mb-2">
          Product not found
        </h2>
        <p className="text-gray-500 mb-6">
          The product you’re looking for isn’t in your cart anymore.
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 pb-6">
      <h2 className="heading-2 mb-4">Edit Cart Item</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Preview */}
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
          <img
            src={product.bannerImg?.[0]}
            alt={product.name}
            className="max-w-64 max-h-64 rounded-md object-cover"
          />
          <div className="mt-4 text-center">
            <p className="font-medium text-gray-800">{product.name}</p>
            <p className="text-sm text-gray-500">
              ₹{product?.variants[0]?.offerPrice ?? product?.variants[0]?.sellingPrice ?? 0}
            </p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSave}>
          {/* Quantity */}
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full mb-3 border rounded-md px-3 py-2"
          />
          {errors.quantity && (
            <p className="text-red-500 text-xs mb-2">{errors.quantity}</p>
          )}

          {/* Size */}
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Variant / Size
          </label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full mb-3 border rounded-md px-3 py-2"
          >
            <option value="">Select a size</option>
            {availableSizes.map((variant, index) => (
              <option key={index} value={variant.label}>
                {variant.label}
              </option>
            ))}
          </select>
          {errors.size && (
            <p className="text-red-500 text-xs mb-2">{errors.size}</p>
          )}

          {/* Color */}
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Color
          </label>
          <div className="flex flex-wrap gap-3 mb-3">
            {availableColors.map((c, index) => (
              <div
                key={index}
                onClick={() => setSelectedColor(c.color)}
                className={`relative w-20 h-20 rounded-full cursor-pointer border-2 overflow-visible ${
                  selectedColor === c.color
                    ? "border-green-600"
                    : "border-gray-300"
                } transition-transform duration-200`}
                title={c.color}
              >
                <img
                  src={c.image}
                  alt={c.color}
                  className="w-full h-full object-cover rounded-full"
                />
                {selectedColor === c.color && (
                  <div className="absolute inset-0 rounded-full border-4 border-green-600"></div>
                )}
              </div>
            ))}
          </div>
          {errors.color && (
            <p className="text-red-500 text-xs mb-2">{errors.color}</p>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-green-700 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCartItem;
