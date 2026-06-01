import { useState } from "react";
import { useItemsQuery } from "./items.queries";
import { ItemsList } from "./ItemsList";

export function ItemsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useItemsQuery({
    page,
    pageSize: 20,
  });

  if (isLoading) {
    return (
      <p className="animate-pulse py-12 text-center opacity-60">
        Loading items...
      </p>
    );
  }

  if (isError) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return (
      <div className="py-12 text-center">
        <p className="font-semibold text-red-400">Failed to load items</p>
        <p className="mt-1 text-sm opacity-70">{msg}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-sm transition hover:bg-zinc-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 20;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="grid gap-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Items Catalog</h2>
        <span className="text-sm opacity-70">
          {total} items &middot; Page {page}/{totalPages}
        </span>
      </div>

      <ItemsList items={data?.results ?? []} />

      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm transition hover:bg-zinc-700 disabled:pointer-events-none disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-sm tabular-nums opacity-70">
          {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm transition hover:bg-zinc-700 disabled:pointer-events-none disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
