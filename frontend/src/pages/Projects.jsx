import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  getProjectsAPI,
  createProjectAPI,
  deleteProjectsAPI,
} from "../api";

export default function Projects() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [showPromptInput, setShowPromptInput] = useState(false);

  useEffect(() => {
    fetchProjects();
   
    const promptFromHome = location.state?.prompt;
    if (promptFromHome) {
      setPrompt(promptFromHome);
      setShowPromptInput(true);

      window.history.replaceState({}, "");
    }
  }, []);


  async function fetchProjects() {
    try {
      const res = await getProjectsAPI();
      setProjects(res.data);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject() {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    if (user.credits < 5) {
      toast.error("Not enough credits. Please purchase more.");
      navigate("/pricing");
      return;
    }

    setCreating(true);
    try {
      const res = await createProjectAPI({prompt});
      toast.success("Website generated successfully.");
      navigate(`/builder/${res.data.project.id}`);
    } catch (error) {
      console.log("full error:", error.response?.status, error.response?.data);
      toast.error(error.response?.data?.error || "Something went wrong.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(e, projectId) {
    e.stopPropagation();
    try {
      await deleteProjectsAPI(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast.success("Project deleted.");
    } catch (error) {
      toast.error("failed to delete project.");
    }
  }
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <div className="px-4 pt-6">
        <nav className="flex items-center justify-between border border-slate-700 px-6 py-3 rounded-full max-w-6xl mx-auto">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#4F46E5" />
              <path
                d="M8 16L14 22L24 10"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-semibold text-base">SiteForge AI</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4 cursor-pointer">
            {/* Credits */}
            <div
              className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm"
              onClick={() => navigate("/pricing")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-indigo-400"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span className="text-white/70">
                {user?.credits ?? 0} credits
              </span>
            </div>

            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold cursor-pointer"
              onClick={() => navigate("/settings")}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">My Projects</h1>
            <p className="text-slate-400 text-sm mt-1">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowPromptInput(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition px-5 py-2.5 rounded-full text-sm font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Project
          </button>
        </div>

        {/* Prompt input — shows when New Project is clicked */}
        {showPromptInput && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-white font-medium mb-4">
              Describe your website
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
                placeholder="e.g. a landing page for a coffee shop with dark theme"
                className="flex-1 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 outline-none focus:border-indigo-500 transition"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateProject}
                  disabled={creating}
                  className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition rounded-full text-sm font-medium whitespace-nowrap"
                >
                  {creating ? "Generating..." : "Generate"}
                </button>
                <button
                  onClick={() => {
                    setShowPromptInput(false);
                    setPrompt("");
                  }}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 transition rounded-full text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
            {creating && (
              <div className="mt-4 flex items-center gap-3 text-sm text-slate-400">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span>
                  AI is generating your website, this may take a few seconds...
                </span>
              </div>
            )}
          </div>
        )}

        {/* Projects grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-indigo-400"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <h3 className="text-white font-medium text-lg mb-2">
              No projects yet
            </h3>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              Create your first AI-generated website in seconds
            </p>
            <button
              onClick={() => setShowPromptInput(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 transition rounded-full text-sm font-medium"
            >
              Create your first project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/builder/${project.id}`)}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-indigo-500/40 hover:bg-white/8 transition group"
              >
                {/* Project preview placeholder */}
                <div className="w-full h-36 rounded-xl bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-white/5 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-400/50"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                </div>

                {/* Project info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-sm font-medium truncate">
                      {project.name}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    {/* Published badge */}
                    {project.isPublished && (
                      <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                        Live
                      </span>
                    )}
                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDelete(e, project.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Backdrop */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[980px] h-[460px] bg-gradient-to-tr from-indigo-800/20 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );
}
