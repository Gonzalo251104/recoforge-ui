import { useState } from "react";
import { Link } from "react-router-dom";
import { useActiveUser } from "@/features/users/UserContext";
import { useRecommendationsQuery } from "./recommendations.queries";
import RecommendationCard from "./RecommendationCard";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  Sliders,
  ArrowRight,
} from "lucide-react";

export function RecommendationsPage() {
  const { activeUserId, activeUsername } = useActiveUser();
  const [strategy, setStrategy] = useState("content");
  const [contentWeight, setContentWeight] = useState(0.5);

  const userWeight = 1 - contentWeight;

  const { data, isLoading, isError } = useRecommendationsQuery(
    activeUserId,
    strategy,
    12,
    contentWeight,
    userWeight
  );

  if (!activeUserId) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl mx-auto space-y-6 animate-fadeIn">
        <div className="p-4 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-full animate-bounce">
          <Sparkles className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            No Simulation Persona Active
          </h2>
          <p className="text-zinc-400 text-sm max-w-md">
            Personalized recommendation engines require traveler history to
            compute similarity. Select or create a simulated traveler to get
            started.
          </p>
        </div>
        <Link
          to="/users"
          className="bg-teal-500 hover:bg-teal-600 text-zinc-950 px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Select Persona</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentWeight(parseFloat(e.target.value));
  };

  const strategies = [
    {
      id: "content",
      name: "Content-Based (TF-IDF)",
      desc: "Matches item tags to your past activities using term frequencies.",
    },
    {
      id: "user",
      name: "Collaborative (User)",
      desc: "Matches you with travelers sharing similar tastes, recommending what they liked.",
    },
    {
      id: "hybrid",
      name: "Hybrid (Weighted)",
      desc: "Balances content tagging overlap with global peer traveler trends.",
    },
    {
      id: "popular",
      name: "Popular / Trending",
      desc: "Showcases globally trending activities (decayed by time).",
    },
  ];

  const fellBackToPopular =
    data && data.strategy === "popular" && strategy !== "popular";

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <span>Recommendations Explorer</span>
        </h1>
        <p className="mt-2 text-zinc-400 text-sm max-w-3xl">
          Explore and compare recommendation engines for active simulated
          traveler:{" "}
          <span className="text-teal-400 font-semibold">
            {activeUsername}
          </span>
          .
        </p>
      </div>

      {/* Strategies Grid Selector */}
      <div className="grid gap-4 md:grid-cols-4">
        {strategies.map((s) => {
          const isSelected = strategy === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setStrategy(s.id)}
              className={`p-5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer h-36 ${
                isSelected
                  ? "bg-teal-950/10 border-teal-500/50 shadow-md shadow-teal-500/5"
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div>
                <h3
                  className={`text-sm font-bold ${
                    isSelected ? "text-teal-400" : "text-white"
                  }`}
                >
                  {s.name}
                </h3>
                <p className="mt-1.5 text-zinc-400 text-[11px] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Hybrid Weight Sliders */}
      {strategy === "hybrid" && (
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4 max-w-xl animate-fadeIn">
          <div className="flex items-center gap-2.5 text-sm font-bold text-zinc-200">
            <Sliders className="h-4 w-4 text-teal-400" />
            <span>Tune Hybrid Balance</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-zinc-400">
              <span>Content Weight: {Math.round(contentWeight * 100)}%</span>
              <span>Collaborative Weight: {Math.round(userWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={contentWeight}
              onChange={handleWeightChange}
              className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-teal-400 outline-none"
            />
          </div>
        </div>
      )}

      {/* Recommendations Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-200 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-400" />
            Personalized Feed Suggestions
          </h2>
        </div>

        {fellBackToPopular && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs flex items-center gap-3">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <div>
              <span className="font-bold">Cold Start Triggered:</span> Fell
              back to popular activities. This user persona has limited
              interaction history for custom collaborative calculations.
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
          </div>
        ) : isError ? (
          <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-xl text-red-400 text-sm">
            Failed to fetch recommendations. Ensure backend is running.
          </div>
        ) : !data || data.results.length === 0 ? (
          <div className="p-12 text-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 text-sm">
            No recommendations generated. Add traveler actions (clicks/views) in
            Catalog first!
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.results.map((item) => (
              <RecommendationCard
                key={item.id}
                item={item}
                strategy={data.strategy}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
