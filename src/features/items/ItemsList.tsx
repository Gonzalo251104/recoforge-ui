import type { ItemDTO } from "../../api/types";
import { ItemCard } from "./ItemCard";

type Props = { items: ItemDTO[] };

export function ItemsList({ items }: Props) {
  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm opacity-60">
        No items found.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <ItemCard key={it.id} item={it} />
      ))}
    </div>
  );
}
