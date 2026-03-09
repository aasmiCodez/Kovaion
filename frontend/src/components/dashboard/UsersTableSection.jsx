export default function UsersTableSection({
  user,
  users,
  loadingUsers,
  loadUsers,
  setEditForm,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-bold text-ink-900">
          {user?.role === "admin" ? "All Users" : "My Profile"}
        </h2>
        <button
          onClick={loadUsers}
          disabled={loadingUsers}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {loadingUsers ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
              Refreshing...
            </span>
          ) : (
            "Refresh"
          )}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="bg-slate-50 text-sm uppercase tracking-wider text-slate-500">
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Email</th>
              <th className="px-6 py-3 font-semibold">Role</th>
              {user?.role === "admin" ? (
                <th className="px-6 py-3 font-semibold">Action</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50/80">
                <td className="px-6 py-4 text-sm font-semibold text-ink-900">
                  {u.name}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">{u.email}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700">
                    {u.role}
                  </span>
                </td>
                {user?.role === "admin" ? (
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        setEditForm({
                          id: u._id,
                          name: u.name,
                          email: u.email,
                          role: u.role,
                        })
                      }
                      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Edit
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
