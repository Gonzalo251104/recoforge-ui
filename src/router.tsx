import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { ItemsPage } from "./features/items/ItemsPage";
import { UsersPage } from "./features/users/UsersPage";
import { UserProfilePage } from "./features/users/UserProfilePage";
import { RecommendationsPage } from "./features/recommendations/RecommendationsPage";
import { ItemDetailPage } from "./features/items/ItemDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout>
        <Navigate to="/catalog" replace />
      </AppLayout>
    ),
  },
  {
    path: "/catalog",
    element: (
      <AppLayout>
        <ItemsPage />
      </AppLayout>
    ),
  },
  {
    path: "/items/:id",
    element: (
      <AppLayout>
        <ItemDetailPage />
      </AppLayout>
    ),
  },
  {
    path: "/users",
    element: (
      <AppLayout>
        <UsersPage />
      </AppLayout>
    ),
  },
  {
    path: "/users/:id",
    element: (
      <AppLayout>
        <UserProfilePage />
      </AppLayout>
    ),
  },
  {
    path: "/recommendations",
    element: (
      <AppLayout>
        <RecommendationsPage />
      </AppLayout>
    ),
  },
]);
