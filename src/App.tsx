import AppLayout from "./components/layout/AppLayout";
import { ItemsPage } from "./features/items/ItemsPage";

export default function App() {
  return (
    <AppLayout>
      <ItemsPage />
    </AppLayout>
  );
}
