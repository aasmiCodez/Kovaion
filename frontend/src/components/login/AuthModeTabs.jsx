export default function AuthModeTabs({ authMode, setAuthMode }) {
  return (
    <div className="mt-5 flex gap-2 rounded-xl bg-slate-100 p-1">
      <button
        type="button"
        onClick={() => setAuthMode("login")}
        className={`h-10 flex-1 rounded-lg text-sm font-semibold ${authMode === "login" ? "bg-white text-ink-900 shadow" : "text-slate-600"}`}
      >
        Login
      </button>
      <button
        type="button"
        onClick={() => setAuthMode("forgot")}
        className={`h-10 flex-1 rounded-lg text-sm font-semibold ${authMode !== "login" ? "bg-white text-ink-900 shadow" : "text-slate-600"}`}
      >
        Forgot Password
      </button>
    </div>
  );
}
