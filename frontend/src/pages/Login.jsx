import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import AuthModeTabs from "../components/login/AuthModeTabs";
import LoginForm from "../components/login/LoginForm";
import LoginPromo from "../components/login/LoginPromo";
import ResetForms from "../components/login/ResetForms";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [forgotForm, setForgotForm] = useState({ email: "" });
  const [resetForm, setResetForm] = useState({
    token: "",
    password: "",
    confirmPassword: "",
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showConfirmResetPassword, setShowConfirmResetPassword] =
    useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setInfo("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  }

  async function requestReset(event) {
    event.preventDefault();
    setError("");
    setInfo("");
    try {
      const response = await api.post("/auth/forgot-password", forgotForm);
      const tokenInfo = response?.data?.resetToken
        ? ` Dev token: ${response.data.resetToken} (valid ${response.data.expiresInMinutes} mins)`
        : "";
      setInfo(
        `${response?.data?.message || "Reset request submitted."}${tokenInfo}`,
      );
      setAuthMode("reset");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to process reset request",
      );
    }
  }

  async function resetPassword(event) {
    event.preventDefault();
    setError("");
    setInfo("");

    if (resetForm.password !== resetForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await api.post("/auth/reset-password", {
        token: resetForm.token,
        password: resetForm.password,
      });
      setInfo(response?.data?.message || "Password reset successful");
      setResetForm({ token: "", password: "", confirmPassword: "" });
      setAuthMode("login");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset password");
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 px-6 py-10">
      <div className="pointer-events-none absolute -left-28 -top-20 h-72 w-72 rounded-full bg-cyan-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative mx-auto mt-8 grid w-full max-w-6xl gap-8 lg:grid-cols-2">
        <LoginPromo />

        <section className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/40 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
            Secure UMS
          </p>
          <h2 className="mt-2 text-3xl font-bold text-ink-900">
            {authMode === "login"
              ? "Sign in to your workspace"
              : "Reset your password"}
          </h2>
          <p className="mt-2 text-base text-slate-600">
            {authMode === "login"
              ? "Use your organization credentials to continue."
              : "Request a reset token, then set a new secure password."}
          </p>

          <AuthModeTabs authMode={authMode} setAuthMode={setAuthMode} />

          {authMode === "login" ? (
            <LoginForm
              form={form}
              setForm={setForm}
              onSubmit={onSubmit}
              showLoginPassword={showLoginPassword}
              setShowLoginPassword={setShowLoginPassword}
              setAuthMode={setAuthMode}
              error={error}
              info={info}
            />
          ) : (
            <ResetForms
              requestReset={requestReset}
              forgotForm={forgotForm}
              setForgotForm={setForgotForm}
              resetPassword={resetPassword}
              resetForm={resetForm}
              setResetForm={setResetForm}
              showResetPassword={showResetPassword}
              setShowResetPassword={setShowResetPassword}
              showConfirmResetPassword={showConfirmResetPassword}
              setShowConfirmResetPassword={setShowConfirmResetPassword}
              error={error}
              info={info}
            />
          )}

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Access is controlled by RBAC and object-level authorization
            policies.
          </div>
        </section>
      </div>
    </div>
  );
}
