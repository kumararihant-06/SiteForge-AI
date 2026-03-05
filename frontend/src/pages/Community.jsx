import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPublishedProjectsAPI } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Community() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await getPublishedProjectsAPI();
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to load community projects");
    } finally {
      setLoading(false);
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
              <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-semibold text-base">SiteForge AI</span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate("/projects")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-5 py-2 rounded-full transition"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm px-5 py-2 rounded-full border border-white/10 hover:bg-white/10 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-5 py-2 rounded-full transition"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 pt-14 pb-20">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-white to-[#748298] text-transparent bg-clip-text mb-4">
            Community Gallery
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Explore websites built by our community using AI. Get inspired and start building your own.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse">
                <div className="w-full h-40 rounded-xl bg-white/5 mb-4" />
                <div className="h-3 bg-white/5 rounded-full w-3/4 mb-2" />
                <div className="h-3 bg-white/5 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h3 className="text-white font-medium text-lg mb-2">No published projects yet</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              Be the first to publish your AI generated website to the community!
            </p>
            <button
              onClick={() => navigate(user ? "/projects" : "/signup")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 transition rounded-full text-sm font-medium"
            >
              {user ? "Go to Dashboard" : "Get Started Free"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/preview/${project.id}`)}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-indigo-500/40 transition group"
              >
                {/* Preview thumbnail */}
                <div className="w-full h-44 bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border-b border-white/5 flex items-center justify-center relative overflow-hidden">
                  <iframe
                    srcDoc={project.current_code}
                    className="w-full h-full border-0 pointer-events-none"
                    style={{ transform: "scale(0.5)", transformOrigin: "top left", width: "200%", height: "200%" }}
                    sandbox="allow-scripts"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition text-white text-xs font-medium bg-indigo-600 px-4 py-2 rounded-full">
                      View Site
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-white text-sm font-medium truncate mb-1">
                    {project.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-slate-500 text-xs">
                      by {project.user?.name || "Anonymous"}
                    </p>
                    <p className="text-slate-600 text-xs">
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
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