import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import useProductDetail from "../../components/ProductDetails/useProductDetail";
import ProductDetailUI from "../../components/ProductDetails/ProductDetailUI";
import { fetchItemById } from "../../components/ProductDetails/api/useItemApi";
import PlantCareGuide from "../../components/ProductDetails/PlantCareGuide";
import ClientReview from "../../components/ProductDetails/ClientReview";
import ProductFAQ from "../../components/ProductDetails/ProductFAQ";
import ErrorBoundary from "../../components/ErrorBoundaries";
import AllProduct2 from "../../components/homepage/Allproduct2";

const ProductDetail = () => {
  const { id } = useParams();

  const fetchFn = useMemo(() => (signal) => fetchItemById(id, signal), [id]);
  const { product, loading, error } = useProductDetail(id, fetchFn);

  return (
    <>
    <ErrorBoundary>
      <ProductDetailUI
        product={product}
        loading={loading}
        error={error}
      />
      </ErrorBoundary>

      <ErrorBoundary>
      <PlantCareGuide />
      </ErrorBoundary>

      <ErrorBoundary>
      <AllProduct2 />
      </ErrorBoundary>

      <ErrorBoundary>
      <ClientReview itemId={id} />
      </ErrorBoundary>

      <ErrorBoundary>
      <ProductFAQ />
      </ErrorBoundary>
    </>
  );
};

export default ProductDetail;
