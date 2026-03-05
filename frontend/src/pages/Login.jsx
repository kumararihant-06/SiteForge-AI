import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { loginAPI } from "../api";
export default function Login()  {
    const navigate = useNavigate();
    const {login} = useAuth();
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginAPI({
                email: formData.email,
                password: formData.password
            });
            login(res.data.token, res.data.user);
            toast.success("Welcome back!");
            navigate("/")
        } catch (error) {
            toast.error(error.response?.data?.error || "Something went wrong.");
        }finally{
            setLoading(false);
        }

    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-87.5 text-center bg-white/6 border border-white/10 rounded-2xl px-8"
      >
        <h1 className="text-white text-3xl mt-10 font-medium">Login</h1>
        <p className="text-gray-400 text-sm mt-2">Please sign in to continue</p>

        {/* Email */}
        <div className="flex items-center w-full mt-6 bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
            <rect x="2" y="4" width="20" height="16" rx="2" />
          </svg>
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center mt-4 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Please wait..." : "Login"}
        </button>

        <p
          onClick={() => navigate("/signup")}
          className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer"
        >
          Don't have an account?
          <span className="text-indigo-400 hover:underline ml-1">Sign up</span>
        </p>
      </form>

      {/* Backdrop */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[980px] h-[460px] bg-gradient-to-tr from-indigo-800/35 to-transparent rounded-full blur-3xl" />
        <div className="absolute right-12 bottom-10 w-[420px] h-[220px] bg-gradient-to-bl from-indigo-700/35 to-transparent rounded-full blur-2xl" />
      </div>
    </div>
    )
}