import { useState, useEffect, memo } from "react";
import { Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const SEARCH_TEXTS = [
  "Searching for plants...",
  "Searching for pots...",
  "Searching for seeds...",
];

const NavbarSearchBar = memo(({ className = "", onClose }) => {
  const [placeholder, setPlaceholder] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const hasSearch = params.get("search");

  // 🔥 If search param is removed → clear input
  if (!hasSearch) {
    setSearchText("");
  }
}, [location.search]);


  useEffect(() => {
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId;

    const animate = () => {
      const currentText = SEARCH_TEXTS[currentIndex];

      if (!isDeleting && charIndex <= currentText.length) {
        setPlaceholder(currentText.substring(0, charIndex));
        charIndex++;
        timeoutId = setTimeout(animate, 100);
      } else if (!isDeleting && charIndex > currentText.length) {
        timeoutId = setTimeout(() => {
          isDeleting = true;
          animate();
        }, 2000);
      } else if (isDeleting && charIndex >= 0) {
        setPlaceholder(currentText.substring(0, charIndex));
        charIndex--;
        timeoutId = setTimeout(animate, 50);
      } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        setCurrentIndex((prev) => (prev + 1) % SEARCH_TEXTS.length);
        charIndex = 0;
        timeoutId = setTimeout(animate, 500);
      }
    };

    animate();
    return () => clearTimeout(timeoutId);
  }, [currentIndex]);

  // const handleInput = (e) => {
  //   const value = e.target.value;
  //   setSearchText(value);
  //   if (location.pathname === "/ViewAll-Item") {
  //     onSearch?.(value);
  //   }
  // };

  const handleInput = (e) => {
  const value = e.target.value;
  setSearchText(value);

  // 🔥 Update URL instead of calling onSearch
  if (location.pathname === "/ViewAll-Item") {
    const params = new URLSearchParams(location.search);

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    navigate(
      {
        pathname: "/ViewAll-Item",
        search: params.toString(),
      },
      { replace: true }
    );
  }
};


  const handleSearch = () => {
    if (!searchText.trim()) return;
    if (window.innerWidth < 768) {
      onClose();
    }
    navigate(`/ViewAll-Item?search=${encodeURIComponent(searchText)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleInput}
        value={searchText}
        onKeyDown={handleKeyDown}
        className="w-full pl-9 pr-4 py-1.5 text-sm rounded-full border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none"
      />
      <Search
        size={16}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
      <button
        onClick={handleSearch}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-r-full text-white bg-green-700 px-4 py-2 cursor-pointer"
      >
        Search
      </button>
    </div>
  );
});

export default NavbarSearchBar;
