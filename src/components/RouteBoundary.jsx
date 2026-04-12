import ErrorBoundary from "../components/ErrorBoundaries";

export default function RouteBoundary({ element }) {
  return <ErrorBoundary>{element}</ErrorBoundary>;
}
