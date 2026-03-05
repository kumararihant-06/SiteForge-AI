import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { updateNameAPI, updatePasswordAPI, deleteAccountAPI, logoutAPI } from "../api";

export default function Settings(){
  const navigate = useNavigate();

  const { user, logout, updateUser } = useAuth();

  const [showNameModal, setShowNameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [nameLoading, setNameLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleUpdateName(){
    if(!newName.trim()) return toast.error("Name cannot be empty");
    setNameLoading(true);
    try {
      const res = await updateNameAPI({newName: newName});
      console.log(res);
      updateUser({name: res.data.user.name});
      toast.success("Name updated successfully.");
      setShowNameModal(false);
      setNewName("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update name.");
    } finally {
      setNameLoading(false);
    }
  }

  async function handleUpdatePassword(){
    if(!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword){
      return toast.error("Please fill in all fields.")
    }
    if(passwordForm.newPassword !== passwordForm.confirmPassword){
      return toast.error("New password do not match.");
    }
    if(passwordForm.newPassword.length < 6 ){
      return toast.error("Password must be at least 6 characters long.");
    }

    setPasswordLoading(true);
    try {
      await updatePasswordAPI({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success("Password updated successfully.");
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword:"",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong.")
    } finally {
      setPasswordLoading(false);
    }

  }

  async function handleDeleteAccount() {
    if(deleteConfirm !== "DELETE") {
      return toast.error('Please type "DELETE" to confirm.');
    }
    setDeleteLoading(true);
    try {
      await deleteAccountAPI();
      logout();
      toast.success("Account deleted.")
      navigate("/login");
    } catch (error) {
      toast.error("Failed to delete the account.");
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleLogout(){
    try {
      await logoutAPI();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      logout();
      navigate("/login")
    }
  }

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0,2);
    return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-8">

          {/* Top row — back + logout */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-white/10 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-white/10 hover:bg-white/10 rounded-full text-sm transition"
            >
              Logout
            </button>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-semibold mb-3">
              {initials}
            </div>
            <p className="text-white font-medium">{user?.name}</p>
            <p className="text-slate-400 text-sm">{user?.email}</p>
          </div>

          {/* Fields */}
          <div className="space-y-4">

            {/* Name field */}
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Name</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white">
                  {user?.name}
                </div>
                <button
                  onClick={() => {
                    setNewName(user?.name || "");
                    setShowNameModal(true);
                  }}
                  className="w-10 h-10 flex-shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Password</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white tracking-widest">
                  ••••••••
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-10 h-10 flex-shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Email field — read only */}
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Email</label>
              <div className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-slate-400">
                {user?.email}
              </div>
              <p className="text-slate-600 text-xs mt-1.5 pl-2">Email cannot be changed</p>
            </div>

          </div>

          {/* Delete account */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="mt-8 w-full py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-full text-sm transition"
          >
            Delete my account
          </button>
        </div>
      </div>

      {/* Name Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-white/10 rounded-2xl w-full max-w-sm p-6">
            <h2 className="text-white font-medium mb-5">Change Name</h2>

            <div className="flex items-center bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-5 gap-2 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdateName()}
                placeholder="Enter new name"
                autoFocus
                className="w-full bg-transparent text-white placeholder-white/40 border-none outline-none text-sm"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleUpdateName}
                disabled={nameLoading}
                className="flex-1 h-11 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-sm transition"
              >
                {nameLoading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setShowNameModal(false)}
                className="flex-1 h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-white/10 rounded-2xl w-full max-w-sm p-6">
            <h2 className="text-white font-medium mb-5">Change Password</h2>

            <div className="space-y-3">
              {[
                { key: "currentPassword", placeholder: "Current password" },
                { key: "newPassword", placeholder: "New password" },
                { key: "confirmPassword", placeholder: "Confirm new password" },
              ].map(({ key, placeholder }) => (
                <div key={key} className="flex items-center bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-5 gap-2 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/60 flex-shrink-0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type="password"
                    value={passwordForm[key]}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-transparent text-white placeholder-white/40 border-none outline-none text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleUpdatePassword}
                disabled={passwordLoading}
                className="flex-1 h-11 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-sm transition"
              >
                {passwordLoading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
                className="flex-1 h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-white/10 rounded-2xl w-full max-w-sm p-6">
            <h2 className="text-white font-medium mb-2">Delete Account</h2>
            <p className="text-slate-400 text-sm mb-5 leading-relaxed">
              This action is permanent and cannot be undone. All your projects will be deleted.
              Type <span className="text-red-400 font-medium">DELETE</span> to confirm.
            </p>

            <div className="flex items-center bg-white/5 ring-2 ring-white/10 focus-within:ring-red-500/60 h-12 rounded-full overflow-hidden pl-5 gap-2 transition-all mb-4">
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder='Type "DELETE"'
                className="w-full bg-transparent text-white placeholder-white/40 border-none outline-none text-sm"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading || deleteConfirm !== "DELETE"}
                className="flex-1 h-11 rounded-full bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition"
              >
                {deleteLoading ? "Deleting..." : "Delete Account"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                }}
                className="flex-1 h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[980px] h-[460px] bg-gradient-to-tr from-indigo-800/20 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );               

}