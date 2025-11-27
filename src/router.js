// src/router.js
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Recipe from "./pages/Recipe";
import MyRecipes from "./pages/MyRecipes";
import ProtectedRoute from "./routes/ProtectedRoute";

export const router = createBrowserRouter(
  [
    { path: "/", element: <Navigate to="/login" replace /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/recipe",
      element: (
        <ProtectedRoute>
          <Recipe />
        </ProtectedRoute>
      ),
    },
    {
      path: "/my-recipes",
      element: (
        <ProtectedRoute>
          <MyRecipes />
        </ProtectedRoute>
      ),
    },
    { path: "*", element: <Navigate to="/login" replace /> },
  ],
  {
    future: { v7_startTransition: true },
  }
);
