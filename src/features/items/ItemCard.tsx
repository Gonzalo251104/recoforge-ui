import { useNavigate } from "react-router-dom";
import { useActiveUser } from "@/features/users/UserContext";
import { useCreateEventMutation } from "./events.queries";
import { MapPin, DollarSign, Heart, Check, Eye } from "lucide-react";
import type { ItemDTO } from "../../api/types";
import { useState } from "react";

type Props = {
  item: ItemDTO;
  onEdit?: () => void;
  onDelete?: () => void;
  showAdminActions?: boolean;
};

export function ItemCard({ item, onEdit, onDelete, showAdminActions = false }: Props) {
  const navigate = useNavigate();
  const { activeUserId } = useActiveUser();
  const recordEvent = useCreateEventMutation();
  const [liked, setLiked] = useState(false);
  const [visited, setVisited] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeUserId) {
      alert("Please select a Persona from the navigation bar to track interactions.");
      return;
    }
    if (recordEvent.isPending) return;
    recordEvent.mutate(
      {
        userId: activeUserId,
        itemId: item.id,
        eventType: "save",
      },
      {
        onSuccess: () => setLiked(true),
      }
    );
  };

  const handleVisited = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeUserId) {
      alert("Please select a Persona from the navigation bar to track interactions.");
      return;
    }
    if (recordEvent.isPending) return;
    recordEvent.mutate(
      {
        userId: activeUserId,
        itemId: item.id,
        eventType: "click",
      },
      {
        onSuccess: () => setVisited(true),
      }
    );
  };

  return (
    <article
      onClick={() => navigate(`/items/${item.id}`)}
      className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-md transition-all duration-300 hover:shadow-xl hover:border-zinc-700 hover:scale-[1.01] flex flex-col justify-between h-full cursor-pointer relative overflow-hidden backdrop-blur-sm"
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <h2 className="text-md font-bold text-zinc-100 group-hover:text-teal-400 transition-colors tracking-wide line-clamp-1">
            {item.title}
          </h2>
          <span className="text-[10px] font-mono text-zinc-600 shrink-0">ID: {item.id}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-zinc-500" />
            {item.city}
          </span>
          <span className="flex items-center">
            <DollarSign className="h-3.5 w-3.5 text-zinc-500" />
            S/ {item.priceMin.toFixed(2)} - S/ {item.priceMax.toFixed(2)}
          </span>
        </div>

        {item.description && (
          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 pt-1">
          {(item.tags ?? []).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-zinc-400 bg-zinc-950 border border-zinc-800/80 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Action buttons */}
      <div className="mt-5 pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            disabled={liked || !activeUserId}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              liked
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 disabled:opacity-40 disabled:hover:text-zinc-400 disabled:hover:border-zinc-800 cursor-pointer"
            }`}
            title={liked ? "Liked!" : "Like & Save"}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-rose-400" : ""}`} />
          </button>

          <button
            onClick={handleVisited}
            disabled={visited || !activeUserId}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              visited
                ? "bg-teal-500/10 border-teal-500/30 text-teal-400"
                : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-teal-400 hover:border-teal-500/30 disabled:opacity-40 disabled:hover:text-zinc-400 disabled:hover:border-zinc-800 cursor-pointer"
            }`}
            title={visited ? "Visited!" : "Mark Visited"}
          >
            <Check className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {showAdminActions && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className="text-xs text-zinc-400 hover:text-teal-400 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-md hover:border-teal-500/30 transition-all cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                className="text-xs text-zinc-400 hover:text-rose-400 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-md hover:border-rose-500/30 transition-all cursor-pointer"
              >
                Delete
              </button>
            </>
          )}
          <span className="text-[11px] text-teal-500 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold pl-1 shrink-0">
            View <Eye className="h-3 w-3" />
          </span>
        </div>
      </div>
    </article>
  );
}
