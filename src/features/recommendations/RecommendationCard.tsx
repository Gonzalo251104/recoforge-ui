import type { RecommendedItemDTO } from "@/api/types";
import { MapPin, DollarSign, Sparkles } from "lucide-react";

type Props = {
  item: RecommendedItemDTO;
  strategy: string;
};

export default function RecommendationCard({ item, strategy }: Props) {
  // Compute display match percentage
  // Popular score is not standard 0-1, so we handle it differently
  const displayScore =
    strategy === "popular"
      ? `Trending: ${item.score.toFixed(1)}`
      : `${Math.round(item.score * 100)}% Match`;

  return (
    <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-5 rounded-xl transition-all flex flex-col justify-between gap-4 h-full relative overflow-hidden group">
      {/* Decorative background glow for high matches */}
      {strategy !== "popular" && item.score > 0.7 && (
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-teal-500/5 rounded-full blur-xl group-hover:bg-teal-500/10 transition-all" />
      )}

      <div className="space-y-3">
        {/* Match Score indicator */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950/40 border border-teal-500/20 px-2.5 py-1 rounded-full">
            <Sparkles className="h-3 w-3 text-teal-400" />
            {displayScore}
          </span>
          <span className="text-xs text-zinc-500 font-mono">ID: {item.id}</span>
        </div>

        {/* Item details */}
        <div>
          <h3 className="text-md font-bold text-white tracking-wide truncate group-hover:text-teal-400 transition-colors">
            {item.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-zinc-500" />
              {item.city}
            </span>
            <span className="flex items-center">
              <DollarSign className="h-3.5 w-3.5 text-zinc-500" />
              {item.priceMin} - {item.priceMax}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] text-zinc-400 bg-zinc-950 border border-zinc-800/80 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Explainability card */}
      <div className="bg-zinc-950/70 border border-zinc-800/80 p-3 rounded-lg text-[11px] text-zinc-400 leading-relaxed italic flex flex-col justify-center">
        {item.explanation}
      </div>
    </div>
  );
}
