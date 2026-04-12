import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../nav/Navbar";
const Footer = lazy(() => import("./Footer"));
import WhatsAppButton from "../WhatsAppButton";
import Loader from "../Loader/Loader";

export default function Layout() {
  const heroRef = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <div className="min-h-screen flex flex-col relative">
        <header>
          <Navbar onSearch={setSearchText} heroRef={isHome ? heroRef : null} />
        </header>

        <main className="md:mt-[130px] sm:mt-20">
          <Outlet context={{ heroRef, searchText }} />
        </main>

        <Suspense fallback={null}>
          <footer>
            <Footer />
          </footer>
        </Suspense>

        {/* WhatsApp floating btn */}
        <WhatsAppButton isHome={isHome} />

        {/* Loader overlay*/}
        {isLoading && (
          <div className="fixed inset-0 z-9999 bg-white backdrop-blur-sm flex items-center justify-center">
            <Loader />
          </div>
        )}
      </div>
    </>
  );
}
