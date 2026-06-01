import type { ItemDTO } from "../../api/types";

type Props = { item: ItemDTO };

export function ItemCard({ item }: Props) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-md transition hover:shadow-lg hover:border-zinc-700">
      <h2 className="text-lg font-semibold">{item.title}</h2>
      <p className="mt-1 text-sm opacity-70">{item.city}</p>

      <p className="mt-2 text-sm">
        S/ {(item.priceMin ?? 0).toFixed(2)} &ndash; S/ {(item.priceMax ?? 0).toFixed(2)}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(item.tags ?? []).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
