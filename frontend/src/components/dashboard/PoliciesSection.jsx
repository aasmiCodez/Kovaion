export default function PoliciesSection({
  loadingPolicies,
  loadAccessPolicies,
  accessPolicies,
}) {
  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-ink-900">Access Policies</h2>
          <button
            onClick={loadAccessPolicies}
            disabled={loadingPolicies}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {loadingPolicies ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                Loading...
              </span>
            ) : (
              "Refresh"
            )}
          </button>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Demo policy catalog representing RBAC and object-level authorization
          controls.
        </p>
      </div>
      <div className="grid gap-4">
        {accessPolicies.map((policy) => (
          <article
            key={policy.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {policy.id}
                </p>
                <h3 className="mt-1 text-lg font-bold text-ink-900">
                  {policy.policy}
                </h3>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">
                {policy.status}
              </span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Scope
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {policy.scope}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Rule
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {policy.rule}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
