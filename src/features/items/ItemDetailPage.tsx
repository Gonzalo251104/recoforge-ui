import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useItemQuery, useSimilarItemsQuery } from "./items.queries";
import { useCreateEventMutation } from "./events.queries";
import { useActiveUser } from "@/features/users/UserContext";
import RecommendationCard from "@/features/recommendations/RecommendationCard";
import {
  MapPin,
  DollarSign,
  Heart,
  CheckCircle,
  ArrowLeft,
  Tag,
  Compass,
  FileText,
} from "lucide-react";

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const itemId = id ? parseInt(id, 10) : NaN;
  const navigate = useNavigate();
  const { activeUserId } = useActiveUser();

  const { data: item, isLoading, isError, error } = useItemQuery(itemId);
  const { data: similarItems = [] } = useSimilarItemsQuery(itemId, 6);
  const recordEvent = useCreateEventMutation();

  const [hasLiked, setHasLiked] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);

  // Auto-record a "view" event when this item detail page is loaded
  useEffect(() => {
    if (!isNaN(itemId) && activeUserId) {
      recordEvent.mutate({
        userId: activeUserId,
        itemId: itemId,
        eventType: "view",
      });
    }
    // Reset local button states on item change
    setHasLiked(false);
    setHasVisited(false);
  }, [itemId, activeUserId]);

  const handleLike = () => {
    if (!activeUserId) {
      alert("Please select a Persona from the navigation bar to track interactions.");
      return;
    }
    if (recordEvent.isPending) return;
    recordEvent.mutate({
      userId: activeUserId,
      itemId: itemId,
      eventType: "save",
    }, {
      onSuccess: () => {
        setHasLiked(true);
      }
    });
  };

  const handleVisited = () => {
    if (!activeUserId) {
      alert("Please select a Persona from the navigation bar to track interactions.");
      return;
    }
    if (recordEvent.isPending) return;
    recordEvent.mutate({
      userId: activeUserId,
      itemId: itemId,
      eventType: "click",
    }, {
      onSuccess: () => {
        setHasVisited(true);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-teal-400" />
        <p className="text-sm opacity-60">Loading activity details...</p>
      </div>
    );
  }

  if (isError || !item) {
    const msg = error instanceof Error ? error.message : "Activity not found";
    return (
      <div className="py-12 text-center max-w-lg mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-8">
        <p className="font-semibold text-red-400">Failed to load activity</p>
        <p className="mt-2 text-sm opacity-70">{msg}</p>
        <button
          onClick={() => navigate("/catalog")}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium transition hover:bg-zinc-700 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate("/catalog")}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </button>
      </div>

      {/* Main details card */}
      <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 md:p-8 relative overflow-hidden backdrop-blur-md">
        {/* Glowing badge */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {item.title}
            </h1>

            {/* Tags and Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
              <span className="flex items-center gap-1 bg-zinc-800/60 px-3 py-1 rounded-full text-xs">
                <MapPin className="h-3.5 w-3.5 text-teal-400" />
                {item.city}
              </span>
              <span className="flex items-center gap-1 bg-zinc-800/60 px-3 py-1 rounded-full text-xs">
                <DollarSign className="h-3.5 w-3.5 text-teal-400" />
                S/ {item.priceMin} - S/ {item.priceMax}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="pt-6 space-y-2 border-t border-zinc-800/60">
              <h3 className="text-zinc-300 font-semibold flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-teal-400" /> Description
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                {item.description ||
                  "No detailed description provided for this activity. A beautiful experience awaits you in this city. Feel free to mark it as visited or save it to your persona favorites to customize your future recommendations!"}
              </p>
            </div>
          </div>

          {/* User simulation action panel */}
          <div className="w-full md:w-64 bg-zinc-950/80 border border-zinc-800/60 p-6 rounded-xl flex flex-col justify-between gap-6 h-fit shrink-0">
            <div>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-teal-400 animate-pulse" />
                Simulate Tastes
              </h4>
              <p className="mt-2 text-[11px] text-zinc-500 leading-relaxed">
                {activeUserId
                  ? "Perform actions as your active Persona to feed the recommendation models instantly in real time."
                  : "Select a Persona at the top right to start tracking interactions."}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                disabled={!activeUserId || hasLiked}
                onClick={handleLike}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border cursor-pointer ${
                  hasLiked
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:bg-zinc-850 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                <Heart className={`h-4 w-4 ${hasLiked ? "fill-rose-400 text-rose-400" : "text-zinc-400"}`} />
                {hasLiked ? "Saved to Profile!" : "Like & Save"}
              </button>

              <button
                disabled={!activeUserId || hasVisited}
                onClick={handleVisited}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border cursor-pointer ${
                  hasVisited
                    ? "bg-teal-500/10 border-teal-500/30 text-teal-400"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:bg-zinc-850 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                <CheckCircle className={`h-4 w-4 ${hasVisited ? "text-teal-400 fill-teal-500/10" : "text-zinc-400"}`} />
                {hasVisited ? "Marked as Visited!" : "Mark Visited"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Activities Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="h-5 w-5 text-teal-400" />
            Similar Activities
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Other destinations matching tags and attributes computed via content similarity.
          </p>
        </div>

        {similarItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similarItems.map((simItem) => (
              <div
                key={simItem.id}
                onClick={() => navigate(`/items/${simItem.id}`)}
                className="cursor-pointer hover:scale-[1.01] transition-transform duration-200"
              >
                <RecommendationCard item={simItem} strategy="content" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 italic py-6">
            No similar activities found with matching tags.
          </p>
        )}
      </div>
    </div>
  );
}
