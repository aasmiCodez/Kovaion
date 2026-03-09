export default function DashboardHeader({ user, logout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            Secure UMS
          </p>
          <h1 className="text-xl font-bold text-ink-900">
            Identity Governance Console
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 sm:block">
            {user?.name} ({user?.role})
          </div>
          <button
            onClick={logout}
            className="h-11 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
