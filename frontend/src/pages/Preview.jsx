import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublishedProjectAPI } from "../api";

export default function Preview() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  async function fetchProject() {
    try {
      console.log("fetching project:", projectId);
      const res = await getPublishedProjectAPI(projectId);
      setProject(res.data);
       console.log("project data:", res.data);
    } catch (err) {
      navigate("/community");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  function injectLinkInterceptor(htmlCode) {
  const interceptorScript = `
    <script>
      document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);
    </script>
  `;
  
  // Inject the script right before closing </body> tag
  if (htmlCode.includes('</body>')) {
    return htmlCode.replace('</body>', interceptorScript + '</body>');
  }
  
  // If no </body> tag just append it
  return htmlCode + interceptorScript;
}

  return (
    <div className="h-screen bg-black flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/community")}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-sm font-medium text-white truncate max-w-[200px]">
              {project?.name}
            </h1>
            <p className="text-xs text-slate-500">
              by {project?.user?.name || "Anonymous"}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Download button */}
          <button
            onClick={() => {
              const blob = new Blob([project?.current_code], { type: "text/html" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${project?.name || "website"}.html`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>

          {/* Build yours button */}
          <button
            onClick={() => navigate("/signup")}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-xs text-white transition"
          >
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="white" fillOpacity="0.2" />
              <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Build yours with SiteForge AI
          </button>
        </div>
      </div>

      {/* Full screen preview */}
      <div className="flex-1 overflow-hidden">
        <iframe
          srcDoc={injectLinkInterceptor(project?.current_code)}
          title={project?.name}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}