import { useItems } from "../../hooks/useItems";

export default function ItemsList() {
  const { data, isLoading, isError } = useItems();

  if (isLoading) {
    return <div className="opacity-60">Loading items...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Failed to load items</div>;
  }

  return (
    <div className="mt-6 space-y-4">
      {data?.results.map((item) => (
        <div key={item.id} className="rounded-lg border border-zinc-800 p-4">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm opacity-70">{item.city}</p>

          <p className="mt-1 text-sm">
            ${item.priceMin} – ${item.priceMax}
          </p>

          <p className="mt-2 text-xs opacity-60">
            Tags: {item.tags.join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
}
