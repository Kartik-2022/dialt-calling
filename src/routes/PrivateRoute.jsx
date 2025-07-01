// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../http/token-interceptor";

const PrivateRoute = () => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
 }

  return <Outlet />;
};

export default PrivateRoute;
