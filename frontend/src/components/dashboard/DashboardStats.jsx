export default function DashboardStats({ user, usersCount }) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Role</p>
        <p className="mt-2 text-2xl font-bold capitalize text-ink-900">
          {user?.role}
        </p>
      </article>
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          {user?.role === "admin" ? "Managed Users" : "Visible Profiles"}
        </p>
        <p className="mt-2 text-2xl font-bold text-ink-900">{usersCount}</p>
      </article>
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Security Mode</p>
        <p className="mt-2 text-2xl font-bold text-emerald-600">Enforced</p>
      </article>
    </section>
  );
}
