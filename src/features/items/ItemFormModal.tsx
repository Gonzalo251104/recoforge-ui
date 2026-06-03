import { useEffect, useState } from "react";
import type { ItemDTO, CreateItemRequestDTO } from "@/api/types";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateItemRequestDTO) => void;
  initialData: ItemDTO | null;
  isPending: boolean;
};

export function ItemFormModal({ isOpen, onClose, onSubmit, initialData, isPending }: Props) {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCity(initialData.city);
      setPriceMin(initialData.priceMin);
      setPriceMax(initialData.priceMax);
      setDescription(initialData.description || "");
      setTagsInput((initialData.tags ?? []).join(", "));
    } else {
      setTitle("");
      setCity("");
      setPriceMin(0);
      setPriceMax(0);
      setDescription("");
      setTagsInput("");
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !city.trim()) {
      setError("Title and City are required.");
      return;
    }
    if (priceMin < 0 || priceMax < 0) {
      setError("Prices must be positive numbers.");
      return;
    }
    if (priceMin > priceMax) {
      setError("Minimum price cannot be greater than maximum price.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    onSubmit({
      title: title.trim(),
      city: city.trim(),
      priceMin,
      priceMax,
      description: description.trim(),
      tags,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <h3 className="text-lg font-bold text-white">
            {initialData ? "Edit Activity" : "Create New Activity"}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Activity Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
              placeholder="e.g. Traditional Cooking Masterclass"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="e.g. Cusco"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="e.g. adventure, culinary, history"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Price Min (S/) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={priceMin || ""}
                onChange={(e) => setPriceMin(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Price Max (S/) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={priceMax || ""}
                onChange={(e) => setPriceMax(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors resize-none"
              placeholder="Provide a detailed description of the traveler experience..."
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800 bg-zinc-900/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-zinc-950 font-semibold rounded-lg text-sm transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isPending && (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
              )}
              {initialData ? "Save Changes" : "Create Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
