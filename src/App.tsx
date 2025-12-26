import AppLayout from "./components/layout/AppLayout";
import ItemsList from "./features/items/ItemsList";

export default function App() {
  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold">Recoforge UI</h1>
      <p className="mt-2 opacity-80">Frontend for the Recoforge API</p>
      <ItemsList />
    </AppLayout>
  );
}
