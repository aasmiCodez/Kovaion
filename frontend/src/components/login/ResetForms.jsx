import EyeIcon from "../../assets/svg/EyeIcon";
import StatusMessage from "./StatusMessage";

export default function ResetForms({
  requestReset,
  forgotForm,
  setForgotForm,
  resetPassword,
  resetForm,
  setResetForm,
  showResetPassword,
  setShowResetPassword,
  showConfirmResetPassword,
  setShowConfirmResetPassword,
  error,
  info,
}) {
  return (
    <div className="mt-8 space-y-6">
      <form
        onSubmit={requestReset}
        className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
      >
        <p className="text-sm font-semibold text-ink-900">
          Step 1: Request reset token
        </p>
        <input
          className="h-12 w-full rounded-xl border border-slate-300 px-4 text-base outline-none ring-brand-100 transition focus:border-brand-500 focus:ring-4"
          type="email"
          placeholder="your.email@company.com"
          value={forgotForm.email}
          onChange={(e) => setForgotForm({ email: e.target.value })}
          required
        />
        <button
          type="submit"
          className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Generate Reset Token
        </button>
      </form>

      <form
        onSubmit={resetPassword}
        className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
      >
        <p className="text-sm font-semibold text-ink-900">
          Step 2: Reset password
        </p>
        <input
          className="h-12 w-full rounded-xl border border-slate-300 px-4 text-base outline-none ring-brand-100 transition focus:border-brand-500 focus:ring-4"
          placeholder="Paste reset token"
          value={resetForm.token}
          onChange={(e) =>
            setResetForm((prev) => ({ ...prev, token: e.target.value }))
          }
          required
        />
        <div className="relative">
          <input
            className="h-12 w-full rounded-xl border border-slate-300 px-4 pr-12 text-base outline-none ring-brand-100 transition focus:border-brand-500 focus:ring-4"
            type={showResetPassword ? "text" : "password"}
            placeholder="New password"
            value={resetForm.password}
            onChange={(e) =>
              setResetForm((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            required
          />
          <button
            type="button"
            onClick={() => setShowResetPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            aria-label={showResetPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon open={showResetPassword} />
          </button>
        </div>
        <div className="relative">
          <input
            className="h-12 w-full rounded-xl border border-slate-300 px-4 pr-12 text-base outline-none ring-brand-100 transition focus:border-brand-500 focus:ring-4"
            type={showConfirmResetPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={resetForm.confirmPassword}
            onChange={(e) =>
              setResetForm((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmResetPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            aria-label={
              showConfirmResetPassword ? "Hide password" : "Show password"
            }
          >
            <EyeIcon open={showConfirmResetPassword} />
          </button>
        </div>
        <StatusMessage error={error} info={info} />
        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 text-base font-semibold text-white transition hover:from-brand-700 hover:to-cyan-600"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
