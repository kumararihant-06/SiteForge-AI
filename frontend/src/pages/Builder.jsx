import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getSingleProjectAPI,
  makeRevisionAPI,
  rollbackAPI,
  saveProjectAPI,
  togglePublishAPI,
} from "../api";

export default function Builder() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [revising, setRevising] = useState(false);
  const [saving, setSaving] = useState(false);
  const [device, setDevice] = useState("desktop");
  const [versions, setVersions] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [showCode, setShowCode] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  async function fetchProject() {
    try {
      const res = await getSingleProjectAPI(projectId);
      setProject(res.data);
      setCode(res.data.current_code);
      setVersions(res.data.versions);
      setConversation(res.data.conversation);
    } catch (err) {
      toast.error("Failed to load project");
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  }

  async function handleRevision() {
    if (!prompt.trim()) return;
    const userMessage = prompt;
    setPrompt("");
    setRevising(true);

    // Optimistically add user message to chat
    setConversation((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    try {
      const res = await makeRevisionAPI(projectId, {prompt: userMessage});
      setCode(res.data.code);
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I've updated your website based on your request!",
        },
      ]);
      // Refresh versions list
      const updated = await getSingleProjectAPI(projectId);
      setVersions(updated.data.versions);
      toast.success("Website updated!");
    } catch (err) {
      console.log("revision error:", err.response?.data);
      toast.error(err.response?.data?.error || "Failed to update website");
      // Remove the optimistic message on error
      setConversation((prev) => prev.slice(0, -1));
    } finally {
      setRevising(false);
    }
  }

  async function handleRollback(versionId) {
    try {
      const res = await rollbackAPI(projectId, versionId);
      setCode(res.data.code);
      toast.success("Rolled back successfully!");
    } catch (err) {
      toast.error("Failed to rollback");
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveProjectAPI(projectId, { code });
      toast.success("Project saved!");
    } catch (err) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish() {
    try {
      const res = await togglePublishAPI(projectId);
      setProject((prev) => ({ ...prev, isPublished: res.data.isPublished }));
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Failed to toggle publish");
    }
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
    if (htmlCode.includes("</body>")) {
      return htmlCode.replace("</body>", interceptorScript + "</body>");
    }

    // If no </body> tag just append it
    return htmlCode + interceptorScript;
  }

  const deviceWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Top navbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/projects")}
            className="p-2 rounded-lg hover:bg-white/10 transition"
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
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-sm font-medium text-white truncate max-w-[200px]">
              {project?.name}
            </h1>
            <p className="text-xs text-slate-500">
              {project?.isPublished ? "🟢 Published" : "⚫ Draft"}
            </p>
          </div>
        </div>

        {/* Center — device toggle */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
          {[
            {
              key: "desktop",
              icon: (
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
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              ),
            },
            {
              key: "tablet",
              icon: (
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
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12" y2="18" />
                </svg>
              ),
            },
            {
              key: "mobile",
              icon: (
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
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12" y2="18" />
                </svg>
              ),
            },
          ].map(({ key, icon }) => (
            <button
              key={key}
              onClick={() => setDevice(key)}
              className={`p-2 rounded-full transition ${device === key ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
            >
              {icon}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Version selector */}
          <select
            onChange={(e) => e.target.value && handleRollback(e.target.value)}
            className="hidden sm:block bg-white/5 border border-white/10 text-white text-xs px-3 py-2 rounded-full outline-none cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>
              Versions
            </option>
            {versions.map((v, i) => (
              <option key={v.id} value={v.id} className="bg-gray-900">
                v{versions.length - i} — {v.description || "Auto save"}
              </option>
            ))}
          </select>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs transition disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {saving ? "Saving..." : "Save"}
          </button>

          {/* View Code button */}
          <button
            onClick={() => setShowCode(true)}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Code
          </button>

          {/* Publish */}
          <button
            onClick={handleTogglePublish}
            className={`px-4 py-2 rounded-full text-xs font-medium transition ${
              project?.isPublished
                ? "bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/30"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
          >
            {project?.isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — Chat */}
        <div className="w-80 flex-shrink-0 border-r border-white/10 flex flex-col">
          {/* Conversation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-400"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Ask AI to make changes to your website
                </p>
              </div>
            ) : (
              conversation.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium ${
                      msg.role === "user" ? "bg-indigo-600" : "bg-white/10"
                    }`}
                  >
                    {msg.role === "user" ? "U" : "AI"}
                  </div>
                  {/* Message */}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-sm"
                        : "bg-white/5 border border-white/10 text-slate-300 rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}

            {/* Typing indicator */}
            {revising && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-xs">
                  AI
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1 items-center h-4">
                    <div
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !revising && handleRevision()
                }
                placeholder="Make changes..."
                disabled={revising}
                className="flex-1 bg-white/5 border border-white/10 text-white text-xs placeholder-white/30 px-4 py-2.5 rounded-full outline-none focus:border-indigo-500 transition disabled:opacity-50"
              />
              
              <button
                onClick={handleRevision}
                disabled={revising || !prompt.trim()}
                className="w-9 h-9 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition flex-shrink-0"
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
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right — Preview */}
        <div className="flex-1 bg-slate-950 flex flex-col overflow-hidden">
          <div className="flex-1 flex items-start justify-center overflow-auto p-4">
            <div
              className="bg-white rounded-lg overflow-hidden transition-all duration-300 h-full"
              style={{ width: deviceWidths[device], minHeight: "100%" }}
            >
              <iframe
                srcDoc={injectLinkInterceptor(code)}
                title="preview"
                className="w-full h-full border-0"
                style={{ minHeight: "600px" }}
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Code Modal */}
      {showCode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h2 className="text-white font-medium text-sm">Source Code</h2>
              <div className="flex items-center gap-2">
                {/* Download button */}
                <button
                  onClick={() => {
                    const blob = new Blob([code], { type: "text/html" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${project?.name || "website"}.html`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success("Downloaded!");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 transition rounded-full text-xs font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download HTML
                </button>

                {/* Copy button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    toast.success("Copied to clipboard!");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 transition rounded-full text-xs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </button>

                {/* Close button */}
                <button
                  onClick={() => setShowCode(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition"
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
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Code content */}
            <div className="flex-1 overflow-auto p-5">
              <pre className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap break-words font-mono">
                {code}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
