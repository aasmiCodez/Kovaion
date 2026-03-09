import EyeIcon from "../../assets/svg/EyeIcon";
import StatusMessage from "./StatusMessage";

export default function LoginForm({
  form,
  setForm,
  onSubmit,
  showLoginPassword,
  setShowLoginPassword,
  setAuthMode,
  error,
  info,
}) {
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Email
        </label>
        <input
          className="h-12 w-full rounded-xl border border-slate-300 px-4 text-base outline-none ring-brand-100 transition focus:border-brand-500 focus:ring-4"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Password
        </label>
        <div className="relative">
          <input
            className="h-12 w-full rounded-xl border border-slate-300 px-4 pr-12 text-base outline-none ring-brand-100 transition focus:border-brand-500 focus:ring-4"
            type={showLoginPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />
          <button
            type="button"
            onClick={() => setShowLoginPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            aria-label={showLoginPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon open={showLoginPassword} />
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setAuthMode("forgot")}
        className="text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        Forgot password?
      </button>
      <StatusMessage error={error} info={info} />
      <button
        type="submit"
        className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 text-base font-semibold text-white transition hover:from-brand-700 hover:to-cyan-600"
      >
        Continue to Dashboard
      </button>
    </form>
  );
}
