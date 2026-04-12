import { useEffect, useMemo, useState } from "react";

export function useProductSelection(product, bannerImg) {
  const variants = product?.variants ?? [];

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // init
  useEffect(() => {
    if (!variants.length) return;

    const variant = variants[0];
    const color =
      variant.colors?.find((c) => c.stock > 0) || variant.colors?.[0] || null;

    setSelectedVariant(variant);
    setSelectedColor(color);
    setQuantity(1);
  }, [variants]);

  const selectedVariantColor = useMemo(() => {
    if (!selectedVariant || !selectedColor) return null;
    return selectedVariant.colors?.find((c) => c.color === selectedColor.color);
  }, [selectedVariant, selectedColor]);

  const availableStock = selectedVariantColor?.stock ?? product?.stock ?? 0;
  const isOutOfStock = availableStock <= 0 && product?.stock <= 0;

  const prices = useMemo(
    () => ({
      selling: selectedVariant?.sellingPrice ?? product?.sellingPrice ?? 0,
      offer: selectedVariant?.offerPrice ?? product?.offerPrice ?? 0,
    }),
    [selectedVariant, product]
  );

  return {
    variants,
    selectedVariant,
    setSelectedVariant,
    selectedColor,
    setSelectedColor,
    quantity,
    setQuantity,
    prices,
    availableStock,
    isOutOfStock,
  };
}
