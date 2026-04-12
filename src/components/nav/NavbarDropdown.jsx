import { Link } from "react-router-dom";
import { slugify } from "../../utils/Slugify";

export default function NavbarDropdown({
  currentSubcategories,
  hoveredSubcategory,
  handleSubcategoryHover,
  currentDisplayImage,
  currentCategorySlug,
  setHoveredCategoryId,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <div
      className="hidden md:block bg-white border-t border-gray-200"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="px-6 py-4 flex justify-between">
        {/* LEFT */}
        <div className="max-w-xs flex flex-col gap-1">
          {currentSubcategories.map((subcat) => {
            const isHovered =
              hoveredSubcategory?.subCategory === subcat.subCategory;

            return (
              <Link
                key={subcat._id}
                to={`/ViewAll-Item?category=${currentCategorySlug}&sub=${slugify(
                  subcat.subCategory
                )}`}
                onMouseEnter={() => handleSubcategoryHover(subcat)}
                onClick={() => setHoveredCategoryId(null)}
                className={`px-3 py-1 text-sm border-b-2 ${
                  isHovered
                    ? "text-[#1a4122] border-[#1a4122]"
                    : "border-transparent text-gray-700 hover:text-[#0A6041] hover:border-[#0A6041]"
                }`}
              >
                {subcat.subCategory}
              </Link>
            );
          })}
        </div>

        {/* RIGHT */}
        <div className="max-w-sm">
          {currentDisplayImage ? (
            <img
              src={currentDisplayImage.url}
              alt={currentDisplayImage.itemName}
              className="aspect-square object-cover rounded-lg"
            />
          ) : (
            <div className="aspect-square bg-gray-100 flex items-center justify-center text-sm text-gray-500">
              No image
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
