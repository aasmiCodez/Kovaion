import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import AdminUserForms from "../components/dashboard/AdminUserForms";
import AuditSection from "../components/dashboard/AuditSection";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardStats from "../components/dashboard/DashboardStats";
import PoliciesSection from "../components/dashboard/PoliciesSection";
import UsersTableSection from "../components/dashboard/UsersTableSection";

const strongPasswordHint = "10+ chars, upper, lower, number, symbol";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("users");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [loadingPolicies, setLoadingPolicies] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [auditEvents, setAuditEvents] = useState([]);
  const [accessPolicies, setAccessPolicies] = useState([]);
  const [error, setError] = useState("");
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    email: "",
    role: "user",
  });

  async function loadUsers() {
    setLoadingUsers(true);
    setError("");
    try {
      const response = await api.get("/users");
      setUsers(response.data.users || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function createUser(event) {
    event.preventDefault();
    try {
      await api.post("/users", createForm);
      setCreateForm({ name: "", email: "", password: "", role: "user" });
      loadUsers();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create user");
    }
  }

  async function updateUser(event) {
    event.preventDefault();
    try {
      await api.put(`/users/${editForm.id}`, {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
      });
      setEditForm({ id: "", name: "", email: "", role: "user" });
      loadUsers();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update user");
    }
  }

  async function loadAuditTrail() {
    setLoadingAudit(true);
    setError("");
    try {
      const response = await api.get("/security/audit-trail");
      setAuditEvents(response.data.events || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load audit trail");
    } finally {
      setLoadingAudit(false);
    }
  }

  async function loadAccessPolicies() {
    setLoadingPolicies(true);
    setError("");
    try {
      const response = await api.get("/security/access-policies");
      setAccessPolicies(response.data.policies || []);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load access policies",
      );
    } finally {
      setLoadingPolicies(false);
    }
  }

  useEffect(() => {
    if (activeSection === "audit" && auditEvents.length === 0) {
      loadAuditTrail();
    }
    if (activeSection === "policies" && accessPolicies.length === 0) {
      loadAccessPolicies();
    }
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <DashboardHeader user={user} logout={logout} />

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <DashboardSidebar
          user={user}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <main className="space-y-6">
          <DashboardStats user={user} usersCount={users.length} />

          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </p>
          ) : null}

          {activeSection === "users" ? (
            <>
              <UsersTableSection
                user={user}
                users={users}
                loadingUsers={loadingUsers}
                loadUsers={loadUsers}
                setEditForm={setEditForm}
              />

              {user?.role === "admin" ? (
                <AdminUserForms
                  createUser={createUser}
                  createForm={createForm}
                  setCreateForm={setCreateForm}
                  showCreatePassword={showCreatePassword}
                  setShowCreatePassword={setShowCreatePassword}
                  strongPasswordHint={strongPasswordHint}
                  updateUser={updateUser}
                  editForm={editForm}
                  setEditForm={setEditForm}
                />
              ) : null}
            </>
          ) : null}

          {activeSection === "audit" ? (
            <AuditSection
              loadingAudit={loadingAudit}
              loadAuditTrail={loadAuditTrail}
              auditEvents={auditEvents}
            />
          ) : null}

          {activeSection === "policies" ? (
            <PoliciesSection
              loadingPolicies={loadingPolicies}
              loadAccessPolicies={loadAccessPolicies}
              accessPolicies={accessPolicies}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}
