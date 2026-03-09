import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-700 shadow-sm">
          Loading secure workspace...
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
