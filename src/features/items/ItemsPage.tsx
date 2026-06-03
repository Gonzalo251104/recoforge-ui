import { useState } from "react";
import {
  useItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from "./items.queries";
import { ItemCard } from "./ItemCard";
import { ItemFormModal } from "./ItemFormModal";
import type { ItemDTO, CreateItemRequestDTO } from "@/api/types";
import { Search, MapPin, Tag, Plus, Shield, SlidersHorizontal, RefreshCw } from "lucide-react";

export function ItemsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [tag, setTag] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemDTO | null>(null);

  // Queries and Mutations
  const { data, isLoading, isError, error, refetch, isFetching } = useItemsQuery({
    page,
    pageSize: 12,
    q: search || undefined,
    city: city || undefined,
    tag: tag || undefined,
  });

  const createMutation = useCreateItemMutation();
  const updateMutation = useUpdateItemMutation();
  const deleteMutation = useDeleteItemMutation();

  const handleCreateOrUpdate = (payload: CreateItemRequestDTO) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingItem(null);
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
    }
  };

  const handleDelete = (item: ItemDTO) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      deleteMutation.mutate(item.id);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ItemDTO) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearch("");
    setCity("");
    setTag("");
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-teal-400" />
        <p className="text-sm opacity-60">Loading activities catalog...</p>
      </div>
    );
  }

  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 12;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <SlidersHorizontal className="h-6 w-6 text-teal-400" />
            Activities Catalog
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Browse, filter, and manage standard traveler activities in the system.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Admin Switch */}
          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              isAdminMode
                ? "bg-teal-500/10 border-teal-500/30 text-teal-400"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            {isAdminMode ? "Admin Mode Active" : "Enable Admin Actions"}
          </button>

          {/* Add Activity Button */}
          {isAdminMode && (
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-500 hover:bg-teal-600 text-zinc-950 font-bold text-xs transition-transform hover:scale-105 cursor-pointer ml-auto md:ml-0"
            >
              <Plus className="h-4 w-4" /> Add Activity
            </button>
          )}
        </div>
      </div>

      {/* Filters Form Panel */}
      <div className="grid gap-4 md:grid-cols-4 bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-xl backdrop-blur-md">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search title..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-950/70 border border-zinc-850 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        {/* City Filter */}
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setPage(1);
            }}
            placeholder="Filter by City..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-950/70 border border-zinc-850 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        {/* Tag Filter */}
        <div className="relative">
          <Tag className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={tag}
            onChange={(e) => {
              setTag(e.target.value);
              setPage(1);
            }}
            placeholder="Filter by Tag..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-950/70 border border-zinc-850 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleResetFilters}
            className="flex-1 py-2 bg-zinc-950/50 hover:bg-zinc-950 border border-zinc-850 hover:border-zinc-800 rounded-lg text-xs text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            Clear Filters
          </button>
          <button
            disabled={isFetching}
            onClick={() => refetch()}
            className="p-2 bg-zinc-950/50 hover:bg-zinc-950 border border-zinc-850 hover:border-zinc-800 rounded-lg text-xs text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center justify-center disabled:opacity-55"
            title="Refresh database results"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin text-teal-400" : ""}`} />
          </button>
        </div>
      </div>

      {isError && (
        <div className="py-12 text-center max-w-lg mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="font-semibold text-red-400 font-sans">Failed to load activities catalog</p>
          <p className="mt-1 text-xs opacity-70">{error instanceof Error ? error.message : "Unknown error"}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-zinc-850 px-4 py-2 text-xs font-semibold transition hover:bg-zinc-800 cursor-pointer text-zinc-200 border border-zinc-800"
          >
            Retry Catalog Query
          </button>
        </div>
      )}

      {/* Item List Grid */}
      {!isError && (
        <>
          {data?.results.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
              <p className="text-sm text-zinc-500 italic">No activities found matching filters.</p>
              {(search || city || tag) && (
                <button
                  onClick={handleResetFilters}
                  className="mt-3 text-xs text-teal-400 hover:underline cursor-pointer"
                >
                  Clear search parameters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(data?.results ?? []).map((it) => (
                <ItemCard
                  key={it.id}
                  item={it}
                  showAdminActions={isAdminMode}
                  onEdit={() => handleOpenEditModal(it)}
                  onDelete={() => handleDelete(it)}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <button
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs font-semibold hover:border-zinc-700 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer text-zinc-300"
              >
                Previous
              </button>
              <span className="text-xs text-zinc-500 font-mono">
                Page {page} of {totalPages} &middot; ({total} total items)
              </span>
              <button
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs font-semibold hover:border-zinc-700 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer text-zinc-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Form Modal (Add / Edit) */}
      <ItemFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingItem}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
