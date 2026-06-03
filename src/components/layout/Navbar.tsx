import { NavLink } from "react-router-dom";
import { useActiveUser } from "@/features/users/UserContext";
import { User, LogOut, Compass, History, Users, Sparkles, BarChart3 } from "lucide-react";

export default function Navbar() {
  const { activeUserId, activeUsername, clearActiveUser } = useActiveUser();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-zinc-800 text-teal-400"
        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
    }`;

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <NavLink
              to="/"
              className="text-xl font-bold tracking-wider text-teal-400 flex items-center gap-2"
            >
              <Compass className="h-6 w-6 text-teal-400" />
              <span>RecoForge</span>
            </NavLink>
            <div className="flex items-center gap-2">
              <NavLink to="/catalog" className={linkClass}>
                <Compass className="h-4 w-4" />
                Catalog
              </NavLink>
              <NavLink to="/users" className={linkClass}>
                <Users className="h-4 w-4" />
                Personas
              </NavLink>
              <NavLink to="/recommendations" className={linkClass}>
                <Sparkles className="h-4 w-4" />
                Recommendations
              </NavLink>
              <NavLink to="/metrics" className={linkClass}>
                <BarChart3 className="h-4 w-4" />
                Metrics
              </NavLink>
              {activeUserId && (
                <NavLink to={`/users/${activeUserId}`} className={linkClass}>
                  <History className="h-4 w-4" />
                  My Profile & History
                </NavLink>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {activeUserId ? (
              <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-full text-xs">
                <span className="flex items-center gap-1 text-zinc-400">
                  <User className="h-3 w-3 text-teal-500" />
                  Simulating:
                </span>
                <span className="font-semibold text-teal-400">
                  {activeUsername}
                </span>
                <button
                  onClick={clearActiveUser}
                  className="text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                  title="Switch Persona"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <NavLink
                to="/users"
                className="bg-teal-500 hover:bg-teal-600 text-zinc-950 font-semibold px-4 py-1.5 rounded-full text-xs transition-all hover:scale-105"
              >
                Select Persona
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
