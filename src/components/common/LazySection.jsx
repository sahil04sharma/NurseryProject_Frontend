import { Suspense } from "react";
import PageLoader from "../Loader/PageLoader";
import { useLazyLoad } from "../../hooks/useLazyLoad";

export const LazySection = ({
  children,
  fallback = <PageLoader />,
  threshold = 0.1,
}) => {
  const [ref, isVisible] = useLazyLoad(threshold);

  return (
    <div ref={ref}>
      {isVisible ? (
        <Suspense fallback={fallback}>{children}</Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};
