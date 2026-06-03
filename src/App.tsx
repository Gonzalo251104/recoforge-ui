import { RouterProvider } from "react-router-dom";
import { UserProvider } from "@/features/users/UserContext";
import { router } from "./router";

export default function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}
