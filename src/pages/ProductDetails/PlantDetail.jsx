import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import useProductDetail from "../../components/ProductDetails/useProductDetail";
import ProductDetailUI from "../../components/ProductDetails/PlantDetailUi";
import { fetchPlantById } from "../../components/ProductDetails/api/usePlantApi";
import PlantCareGuide from "../../components/ProductDetails/PlantCareGuide";
import AllProduct2 from "../../components/homepage/PlantwithPots";
import ClientReview from "../../components/ProductDetails/ClientReview";
import ProductFAQ from "../../components/ProductDetails/ProductFAQ";
import ErrorBoundary from "../../components/ErrorBoundaries";
const PlantDetail = () => {
  const { id } = useParams();

  const fetchFn = useMemo(() => (signal) => fetchPlantById(id, signal), [id]);
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

export default PlantDetail;
