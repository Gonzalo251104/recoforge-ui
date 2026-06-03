import { useParams, useNavigate } from "react-router-dom";
import { useUserProfileQuery, useUserHistoryQuery } from "./users.queries";
import { useActiveUser } from "./UserContext";
import {
  ArrowLeft,
  Eye,
  MousePointer,
  Bookmark,
  Tag,
  MapPin,
  DollarSign,
  Calendar,
  Loader2,
  UserCheck,
} from "lucide-react";

export function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const navigate = useNavigate();
  const { activeUserId, setActiveUser } = useActiveUser();

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useUserProfileQuery(userId);
  const { data: history, isLoading: isHistoryLoading } =
    useUserHistoryQuery(userId, 50);

  if (isProfileLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
      </div>
    );
  }

  if (isProfileError || !profile) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/users")}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Personas
        </button>
        <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-xl text-red-400 text-sm">
          User profile not found.
        </div>
      </div>
    );
  }

  const isSimulating = activeUserId === profile.id;

  const eventBadge = (type: string) => {
    switch (type) {
      case "view":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "click":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "save":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      default:
        return "bg-zinc-800 text-zinc-400";
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back button and Simulating trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="space-y-1">
          <button
            onClick={() => navigate("/users")}
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 text-xs transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Personas
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>{profile.username}</span>
            {isSimulating && (
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-teal-400 bg-teal-900/40 px-2 py-0.5 rounded-full border border-teal-500/20">
                <UserCheck className="h-3 w-3" /> Active Simulation
              </span>
            )}
          </h1>
        </div>

        {!isSimulating && (
          <button
            onClick={() => setActiveUser(profile.id, profile.username)}
            className="bg-teal-500 hover:bg-teal-600 text-zinc-950 px-5 py-2 rounded-lg text-xs font-bold tracking-wide transition-all hover:scale-105 cursor-pointer"
          >
            Simulate this Persona
          </button>
        )}
      </div>

      {/* Profile statistics cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* Total views */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/10">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {profile.stats.totalViews}
            </div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
              Views
            </div>
          </div>
        </div>

        {/* Total clicks */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/10">
            <MousePointer className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {profile.stats.totalClicks}
            </div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
              Clicks
            </div>
          </div>
        </div>

        {/* Total saves */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/10">
            <Bookmark className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {profile.stats.totalSaves}
            </div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
              Saves
            </div>
          </div>
        </div>

        {/* Favorite tags */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex flex-col justify-center gap-2">
          <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium flex items-center gap-1">
            <Tag className="h-3.5 w-3.5 text-teal-400" />
            Top Interests
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {profile.stats.favoriteTags.length > 0 ? (
              profile.stats.favoriteTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-700"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-zinc-500 italic">
                No tags associated yet
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-zinc-200 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-teal-400" />
          Persona Activity History
        </h2>

        {isHistoryLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
          </div>
        ) : !history || history.results.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400">
            This user has no interaction timeline. Visit the catalog to
            simulate views or saves!
          </div>
        ) : (
          <div className="relative border-l border-zinc-800 ml-3 pl-6 space-y-6">
            {history.results.map((entry) => (
              <div key={entry.eventId} className="relative">
                {/* Timeline node */}
                <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      entry.eventType === "view"
                        ? "bg-blue-400"
                        : entry.eventType === "click"
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                  />
                </div>

                {/* Content card */}
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl hover:border-zinc-700 transition-all space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${eventBadge(
                          entry.eventType
                        )}`}
                      >
                        {entry.eventType}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {entry.ts
                          ? new Date(entry.ts).toLocaleString()
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-bold text-white tracking-wide">
                      {entry.item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                        {entry.item.city}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="h-3.5 w-3.5 text-zinc-500" />
                        {entry.item.priceMin} - {entry.item.priceMax}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1 border-t border-zinc-800/50">
                    {entry.item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-zinc-400 bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
