export default function LoginPromo() {
  return (
    <section className="hidden rounded-3xl border border-white/15 bg-white/5 p-10 text-white backdrop-blur-xl lg:block">
      <p className="mb-4 inline-flex rounded-full border border-white/30 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-200">
        Enterprise Security
      </p>
      <h1 className="max-w-md text-4xl font-extrabold leading-tight">
        User management built for strict access control and auditability.
      </h1>
      <p className="mt-5 max-w-md text-slate-200">
        Centralize identities with role-based access, object-level authorization,
        token revocation, and secure session handling.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
          JWT + Redis session lifecycle
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
          Admin/User strict RBAC model
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
          Object-level authorization
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
          Audit-focused API design
        </div>
      </div>
    </section>
  );
}
