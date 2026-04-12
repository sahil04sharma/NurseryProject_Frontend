import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
  if (this.state.hasError) {
    return (
      this.props.fallback || (
        <div className="flex items-center justify-center w-full py-16">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Oops!! Something went wrong
            </h2>
            <p className="text-gray-500 text-sm">
              Please try reloading the page.
            </p>
          </div>
        </div>
      )
    );
  }
  return this.props.children;
}

}

export default ErrorBoundary;
