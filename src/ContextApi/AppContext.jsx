import React, { useCallback, useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { getWithExpiry, setWithExpiry } from "../utils/storageWithExpiry";
import backend from "../network/backend";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [categories, setCategroies] = useState([]);
  const [contact, setContact] = useState({
    address: "C87 Second Floor, Sector 63, Noida, India",
    alternateNumber: 9876543212,
    email: "info@plantv.in",
    phoneNumber: 9876543210,
    supportEmail: "support@plantv.in",
  });

  const fetchCategories = async () => {
    const savedCategories = getWithExpiry("categories");
    if (savedCategories) {
      setCategroies(savedCategories);
      return;
    }
    try {
      const { data: categoryRes } = await backend(`/product/category-all`); // Fetching category

      //Subcategories of category
      const categoriesWithSubs = await Promise.all(
        categoryRes.data.map(async (cat) => {
          const { data: subRes } = await backend.get(
            `/product/sub-category/get-subImg/${cat._id}`
          );

          return {
            ...cat,
            subCategories: subRes.data || [],
          };
        })
      );
      setCategroies(categoriesWithSubs);
      setWithExpiry("categories", categoriesWithSubs, 24 * 60 * 60 * 1000);
    } catch (error) {}
  };

  const fetchContact = async () => {
    const savedContact = getWithExpiry("contact");
    if (savedContact) {
      setContact(savedContact);
      return;
    }
    try {
      const { data } = await backend.cachedGet("/contact/get-contact");
      const doc = data?.contact?.[0];
      setContact({
        address: doc.address || "",
        phoneNumber: doc.phoneNumber ?? "",
        alternateNumber: doc.alternateNumber ?? "",
        email: doc.email || "",
        supportEmail: doc.supportEmail || "",
      });
      setWithExpiry(
        "contact",
        {
          address: doc.address || "",
          phoneNumber: doc.phoneNumber ?? "",
          alternateNumber: doc.alternateNumber ?? "",
          email: doc.email || "",
          supportEmail: doc.supportEmail || "",
        },
        24 * 60 * 60 * 1000
      );
    } catch (error) {
      console.log("Contact fetch failed", error);
    }
  };

  /* ---------- helpers ---------- */
  const getSubcategories = useCallback(
    (categoryId) => {
      const category = categories.find((c) => c._id === categoryId);
      return category?.subCategories || [];
    },
    [categories]
  );

  const getSubcategoryImages = useCallback(
    (categoryId) => {
      const category = categories.find((c) => c._id === categoryId);

      if (!category?.subCategories) return [];

      return category.subCategories
        .filter((s) => s.itemBanner)
        .map((s) => ({
          url: s.itemBanner,
          subCategory: s.subCategory,
          itemName: s.itemDetails?.name,
        }));
    },
    [categories]
  );

  useEffect(() => {
    fetchCategories();
    fetchContact();
  }, []);
  return (
    <AppContext.Provider
      value={{ categories, contact, getSubcategories, getSubcategoryImages }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);
export default useApp;
