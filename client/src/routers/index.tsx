import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "../pages/auth/layout/AuthLayout";
import { LoginPage, RegisterPage } from "../pages/auth";
import MainLayout from "../pages/home/layout/MainLayout";
import Home from "../pages/home/components/Home";
import Foods from "../pages/home/components/Foods";
import Recipes from "../pages/home/components/Recipes";
import DetailRecipe from "../pages/home/components/DetailRecipe";
import NotFoundPage from "../components/error/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";
import RecipeInformation from "../pages/home/components/RecipeInformation";
import DetailRecipeUi from "../pages/home/ui/DetailRecipeUi";
import RecipeInformationUi from "@/pages/home/ui/RecipeInformationUi";

export const routers = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "login", index: true, element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", element: <Home /> },
      { path: "food", element: <Foods /> },
      {
        path: "recipe",
        children: [
          { index: true, element: <Navigate to="render" replace /> },
          { path: "render", element: <Recipes /> },
          { path: "render/:id", element: <DetailRecipe /> },
          { path: "effect/:id", element: <DetailRecipeUi /> },
          { path: "infor", element: <RecipeInformation /> },
          { path: "effects", element: <RecipeInformationUi /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
