export default function DashboardSidebar({ user, activeSection, setActiveSection }) {
  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Navigation
      </p>
      <div className="mt-4 space-y-3">
        <button
          type="button"
          onClick={() => setActiveSection("users")}
          className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
            activeSection === "users"
              ? "bg-slate-900 text-white"
              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          User Management
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("audit")}
          className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
            activeSection === "audit"
              ? "bg-slate-900 text-white"
              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Audit Trail
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("policies")}
          className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
            activeSection === "policies"
              ? "bg-slate-900 text-white"
              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Access Policies
        </button>
      </div>
      <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-ink-800">
        Signed in as <span className="font-semibold">{user?.email}</span>
      </div>
    </aside>
  );
}
