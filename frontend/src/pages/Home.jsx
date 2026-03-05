import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");

  const handleGetStarted = () => {
    if (user) {
      navigate("/projects", { state: { prompt } });
    } else {
      navigate("/signup", { state: { prompt } });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <div className="px-4 pt-6">
        <nav className="flex items-center justify-between border border-slate-700 px-6 py-3 rounded-full text-white max-w-4xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#4F46E5" />
              <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-white font-semibold text-base">SiteForge AI</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1 text-sm">
            <a href="#features" className="px-4 py-2 hover:text-indigo-400 transition">Features</a>
            <a href="#how-it-works" className="px-4 py-2 hover:text-indigo-400 transition">How it works</a>
            <a href="/community" className="px-4 py-2 hover:text-indigo-400 transition">Community</a>
            <a href="/pricing" className="px-4 py-2 hover:text-indigo-400 transition">Pricing</a>
          </div>

          {/* CTA Button */}
          {user ? (
            <button
              onClick={() => navigate("/projects")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-5 py-2 rounded-full transition"
            >
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-5 py-2 rounded-full transition"
            >
              Get Started
            </button>
          )}
        </nav>
      </div>

      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center px-4 pt-20 pb-32"
        style={{
          backgroundImage: "url(https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/green-gradient-bg.svg)",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-900 bg-indigo-700/15 text-xs mb-8">
          <div className="flex items-center">
            <img className="w-7 h-7 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50" alt="u1" />
            <img className="w-7 h-7 rounded-full border-2 border-white -ml-2" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50" alt="u2" />
            <img className="w-7 h-7 rounded-full border-2 border-white -ml-2" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50" alt="u3" />
          </div>
          <span className="ml-1 text-white/70">Join 10,000+ builders already creating with AI</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl text-center font-semibold max-w-3xl leading-tight bg-gradient-to-r from-white to-[#748298] text-transparent bg-clip-text">
          Build Stunning Websites with Just a Prompt
        </h1>

        <p className="text-slate-400 text-sm md:text-base text-center max-w-xl mt-5 leading-relaxed">
          Describe your dream website and watch AI bring it to life in seconds. No coding required. Edit, publish and share with the world.
        </p>

        {/* Prompt Input */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-10 w-full max-w-2xl">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGetStarted()}
            placeholder="Describe your website... e.g. a landing page for a coffee shop"
            className="w-full px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 outline-none focus:border-indigo-500 transition"
          />
          <button
            onClick={handleGetStarted}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 transition rounded-full text-sm font-medium whitespace-nowrap"
          >
            Generate Free
          </button>
        </div>

        <p className="text-white/25 text-xs mt-3">
          No credit card required · 20 free credits on signup
        </p>

        {/* Features */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-28 max-w-4xl w-full">
          {[
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              ),
              title: "AI Powered Generation",
              desc: "Describe your website in plain English and get a fully functional site in seconds.",
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              ),
              title: "Edit with AI Chat",
              desc: "Simply chat to make changes. Say 'make the navbar sticky' and watch it update instantly.",
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              ),
              title: "One Click Publish",
              desc: "Publish your site and share it with the world. Get a public URL instantly.",
            },
          ].map((feature, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 hover:border-indigo-500/30 transition">
              <div className="text-indigo-400">{feature.icon}</div>
              <h3 className="text-white font-medium text-sm">{feature.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div id="how-it-works" className="mt-28 max-w-4xl w-full">
          <h2 className="text-3xl md:text-4xl font-semibold text-center bg-gradient-to-r from-white to-[#748298] text-transparent bg-clip-text mb-14">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Describe your site",
                desc: "Type a prompt describing what you want. Be as detailed or as simple as you like.",
              },
              {
                step: "02",
                title: "AI generates it",
                desc: "Our AI enhances your prompt and generates a complete, beautiful website in seconds.",
              },
              {
                step: "03",
                title: "Edit and publish",
                desc: "Refine with chat, switch versions, and publish your site with one click.",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-3">
                <span className="text-5xl font-bold text-indigo-600/30">{item.step}</span>
                <h3 className="text-white font-medium text-sm">{item.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech logos */}
        <div className="flex flex-wrap items-center justify-center gap-12 mt-28 opacity-30">
          {["React", "Tailwind CSS", "Node.js", "PostgreSQL", "OpenRouter","Prisma"].map((tech) => (
            <span key={tech} className="text-white font-semibold text-sm">{tech}</span>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-16 text-white/20 text-xs">
          © 2025 SiteForge AI. All rights reserved.
        </p>
      </section>

      {/* Backdrop */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[980px] h-[460px] bg-gradient-to-tr from-indigo-800/35 to-transparent rounded-full blur-3xl" />
        <div className="absolute right-12 bottom-10 w-[420px] h-[220px] bg-gradient-to-bl from-indigo-700/35 to-transparent rounded-full blur-2xl" />
      </div>
    </div>
  );
}