import React, { createContext, useContext } from "react";
import useAddresses from "../hooks/useAddresses";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const useAddressStates = useAddresses();
  return (
    <AddressContext.Provider value={useAddressStates}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);
