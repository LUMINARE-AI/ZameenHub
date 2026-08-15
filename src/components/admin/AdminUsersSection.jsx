"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Button from "@/components/ui/Button";
import StatusBanner from "@/components/StatusBanner";
import useDbUser from "@/hooks/useDbUser";

export default function AdminUsersSection() {
  const { user: currentUser } = useDbUser();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ tone: "info", message: "" });
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        const response = await API.get("/admin/users");
        if (!active) return;
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        if (!active) return;
        setStatus({
          tone: "error",
          message: error.response?.data?.message || "Unable to load users.",
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadUsers();

    return () => {
      active = false;
    };
  }, []);

  async function refreshUsers(nextSearch = search) {
    try {
      setLoading(true);
      const response = await API.get("/admin/users", {
        params: { search: nextSearch || undefined },
      });
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Unable to load users.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(user, nextRole) {
    if (user.role === nextRole) {
      return;
    }

    try {
      setBusyId(user._id);
      const response = await API.put(`/admin/users/${user._id}/role`, { role: nextRole });
      setStatus({
        tone: "success",
        message: response.data?.message || "Role updated.",
      });
      await refreshUsers();
    } catch (error) {
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Unable to update role.",
      });
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="space-y-4">
      <StatusBanner tone={status.tone} message={status.message} />

      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          void refreshUsers(search);
        }}
      >
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email or phone…"
          className="min-h-11 w-full flex-1 rounded-xl border border-brand/15 bg-white px-3 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
        />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <p className="text-sm text-brand-muted">
        Roles sync to Clerk public metadata. You cannot change your own role, and the last admin
        cannot be demoted.
      </p>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-2xl bg-white" />
          ))
        ) : users.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand/20 bg-white px-6 py-10 text-center">
            <p className="font-semibold text-brand-ink">No users found</p>
          </div>
        ) : (
          users.map((user) => {
            const isSelf =
              currentUser?._id && String(user._id) === String(currentUser._id);

            return (
              <div
                key={user._id}
                className="flex flex-col gap-3 rounded-2xl border border-brand/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-brand-ink">{user.name}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                        user.role === "admin"
                          ? "bg-brand-light text-brand-dark"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.role}
                    </span>
                    {isSelf ? (
                      <span className="text-xs font-semibold text-brand-muted">You</span>
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-sm text-brand-muted">
                    {user.email || "No email"}
                    {user.phone ? ` · ${user.phone}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={user.role}
                    disabled={Boolean(isSelf) || busyId === user._id}
                    onChange={(event) => void changeRole(user, event.target.value)}
                    className="min-h-10 rounded-xl border border-brand/15 bg-white px-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    title={isSelf ? "You cannot change your own role" : undefined}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
