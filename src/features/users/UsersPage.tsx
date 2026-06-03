import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useUsersQuery, useCreateUserMutation } from "./users.queries";
import { useActiveUser } from "./UserContext";
import {
  UserPlus,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowRight,
} from "lucide-react";

export function UsersPage() {
  const [page, setPage] = useState(1);
  const [newUsername, setNewUsername] = useState("");
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();
  const { activeUserId, setActiveUser } = useActiveUser();

  const { data, isLoading, isError } = useUsersQuery(page, 12);
  const createUserMutation = useCreateUserMutation();

  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    const trimmed = newUsername.trim();
    if (!trimmed) return;
    if (trimmed.length < 3) {
      setFormError("Username must be at least 3 characters");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      setFormError(
        "Only alphanumeric characters, underscores, and dashes allowed"
      );
      return;
    }

    try {
      const newUser = await createUserMutation.mutateAsync(trimmed);
      setNewUsername("");
      setActiveUser(newUser.id, newUser.username);
      navigate(`/users/${newUser.id}`);
    } catch (err: any) {
      setFormError(
        err.response?.data?.detail ?? "Error creating user"
      );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title block */}
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Simulated Personas
        </h1>
        <p className="mt-2 text-zinc-400 text-sm max-w-3xl">
          Select a persona below to simulate their user profile, view their
          interaction history, and explore recommendation engines customized to
          their individual tastes.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Personas listing */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-zinc-200">
            Available Personas
          </h2>

          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
            </div>
          ) : isError ? (
            <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-xl text-red-400 text-sm">
              Failed to load personas. Ensure your backend is running at
              http://127.0.0.1:8000.
            </div>
          ) : !data || data.results.length === 0 ? (
            <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400">
              No personas found. Create one using the form on the right!
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {data.results.map((user) => {
                  const isActive = activeUserId === user.id;
                  return (
                    <div
                      key={user.id}
                      className={`p-5 rounded-xl border transition-all flex flex-col justify-between h-40 ${
                        isActive
                          ? "bg-teal-950/10 border-teal-500/50 shadow-md shadow-teal-500/5"
                          : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500 font-mono">
                            ID: {user.id}
                          </span>
                          {isActive && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-teal-400 bg-teal-900/40 px-2 py-0.5 rounded-full border border-teal-500/20">
                              <UserCheck className="h-3 w-3" /> Active
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2 text-lg font-bold text-white tracking-wide truncate">
                          {user.username}
                        </h3>
                      </div>

                      <button
                        onClick={() => {
                          setActiveUser(user.id, user.username);
                          navigate(`/users/${user.id}`);
                        }}
                        className={`mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                          isActive
                            ? "bg-teal-500 hover:bg-teal-600 text-zinc-950"
                            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                        }`}
                      >
                        <span>
                          {isActive ? "View Profile" : "Simulate Persona"}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Pagination controls */}
              {data.total > 12 && (
                <div className="flex items-center justify-between border-t border-zinc-800 pt-4 text-sm text-zinc-400">
                  <span>
                    Showing{" "}
                    <span className="font-semibold text-white">
                      {(page - 1) * 12 + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-white">
                      {Math.min(page * 12, data.total)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-white">
                      {data.total}
                    </span>{" "}
                    personas
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setPage((p) =>
                          p * 12 < data.total ? p + 1 : p
                        )
                      }
                      disabled={page * 12 >= data.total}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create new user block */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-200">New Persona</h2>
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-lg">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Create Simulation Persona
                </h3>
                <p className="text-xs text-zinc-400">
                  Add a custom username to test tastes
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 pt-2">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="e.g. food_lover, history_explorer"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 transition-all"
                />
              </div>

              {formError && (
                <p className="text-xs text-red-400">{formError}</p>
              )}

              <button
                type="submit"
                disabled={createUserMutation.isPending}
                className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-zinc-950 font-bold py-2 rounded-lg text-xs tracking-wide transition-all hover:shadow-md hover:shadow-teal-500/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                {createUserMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span>Create & Activate</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
