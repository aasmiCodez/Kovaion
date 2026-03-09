import EyeIcon from "../../assets/svg/EyeIcon";

export default function AdminUserForms({
  createUser,
  createForm,
  setCreateForm,
  showCreatePassword,
  setShowCreatePassword,
  strongPasswordHint,
  updateUser,
  editForm,
  setEditForm,
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <form
        onSubmit={createUser}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-ink-900">Create User</h3>
        <p className="mt-1 text-sm text-slate-500">
          Provision new users with role assignment.
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Full Name
            </label>
            <input
              className="h-12 w-full rounded-xl border border-slate-300 px-4 text-base outline-none ring-brand-100 transition focus:border-brand-500 focus:ring-4"
              placeholder="Enter full name"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, name: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Work Email
            </label>
            <input
              className="h-12 w-full rounded-xl border border-slate-300 px-4 text-base outline-none ring-brand-100 transition focus:border-brand-500 focus:ring-4"
              placeholder="name@company.com"
              type="email"
              value={createForm.email}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, email: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Temporary Password
            </label>
            <div className="relative">
              <input
                className="h-12 w-full rounded-xl border border-slate-300 px-4 pr-12 text-base outline-none ring-brand-100 transition focus:border-brand-500 focus:ring-4"
                placeholder="Set secure password"
                type={showCreatePassword ? "text" : "password"}
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm((p) => ({ ...p, password: e.target.value }))
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowCreatePassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label={showCreatePassword ? "Hide password" : "Show password"}
              >
                <EyeIcon open={showCreatePassword} />
              </button>
            </div>
            <p className="mt-2 text-xs font-medium text-slate-500">
              Password policy: {strongPasswordHint}
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Role
            </label>
            <select
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none ring-brand-100 transition focus:border-brand-500 focus:ring-4"
              value={createForm.role}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, role: e.target.value }))
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 text-base font-semibold text-white transition hover:from-brand-700 hover:to-cyan-600"
          >
            Create User
          </button>
        </div>
      </form>

      <form
        onSubmit={updateUser}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-ink-900">Edit User</h3>
        <p className="mt-1 text-sm text-slate-500">
          Pick a user from the table and update identity details.
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Selected User ID
            </label>
            <input
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500"
              placeholder="Select user from table"
              value={editForm.id}
              disabled
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Full Name
            </label>
            <input
              className="h-12 w-full rounded-xl border border-slate-300 px-4 text-base outline-none ring-brand-100 transition focus:border-brand-500 focus:ring-4"
              placeholder="Update full name"
              value={editForm.name}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, name: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Work Email
            </label>
            <input
              className="h-12 w-full rounded-xl border border-slate-300 px-4 text-base outline-none ring-brand-100 transition focus:border-brand-500 focus:ring-4"
              placeholder="Update email"
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, email: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Role
            </label>
            <select
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none ring-brand-100 transition focus:border-brand-500 focus:ring-4"
              value={editForm.role}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, role: e.target.value }))
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={!editForm.id}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-slate-900 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Update User
          </button>
        </div>
      </form>
    </section>
  );
}
