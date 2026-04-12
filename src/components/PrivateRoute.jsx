import React from "react";
import { useAuth } from "../ContextApi/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { user } = useAuth();
  return !user ? <Navigate to={"/sign-in"} /> : <Outlet />;
};

export default PrivateRoute;
