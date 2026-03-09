export default function AuditSection({
  loadingAudit,
  loadAuditTrail,
  auditEvents,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-ink-900">Audit Trail</h2>
          <button
            onClick={loadAuditTrail}
            disabled={loadingAudit}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {loadingAudit ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                Loading...
              </span>
            ) : (
              "Refresh"
            )}
          </button>
        </div>
        <p className="text-sm text-slate-500">
          Demo data showing security-sensitive activities and outcomes.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left">
          <thead>
            <tr className="bg-slate-50 text-sm uppercase tracking-wider text-slate-500">
              <th className="px-6 py-3 font-semibold">Event ID</th>
              <th className="px-6 py-3 font-semibold">Timestamp</th>
              <th className="px-6 py-3 font-semibold">Actor</th>
              <th className="px-6 py-3 font-semibold">Action</th>
              <th className="px-6 py-3 font-semibold">Target</th>
              <th className="px-6 py-3 font-semibold">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditEvents.map((event) => (
              <tr key={event.id} className="hover:bg-slate-50/80">
                <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                  {event.id}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {event.timestamp}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-ink-900">
                  {event.actor}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {event.action}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {event.target}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                      event.outcome === "Success"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {event.outcome}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
