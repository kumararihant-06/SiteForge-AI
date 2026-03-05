import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { createOrderAPI, verifyPaymentAPI } from "../api";

export default function Pricing() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "₹499",
      credits: 100,
      description: "Perfect for trying out SiteForge AI",
      features: [
        "100 credits",
        "20 website generations",
        "AI chat revisions",
        "Version history",
        "Download HTML",
      ],
      highlighted: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹1899",
      credits: 400,
      description: "Best for freelancers and small projects",
      features: [
        "400 credits",
        "80 website generations",
        "AI chat revisions",
        "Version history",
        "Download HTML",
        "Community publishing",
      ],
      highlighted: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "₹4999",
      credits: 1000,
      description: "For power users and agencies",
      features: [
        "1000 credits",
        "200 website generations",
        "AI chat revisions",
        "Version history",
        "Download HTML",
        "Community publishing",
        "Priority support",
      ],
      highlighted: false,
    },
  ];

  async function handleBuy(planId) {
    if (!user) {
      navigate("/signup");
      return;
    }

    setLoadingPlan(planId);
    try {
      // 1. Create order on backend
      const res = await createOrderAPI({ planId });
      const { orderId, amount, currency, keyId } = res.data;

      // 2. Open Razorpay popup
      const options = {
        key: keyId,
        amount,
        currency,
        name: "SiteForge AI",
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
        order_id: orderId,
        handler: async function (response) {
          // 3. Verify payment on backend
          try {
            const verifyRes = await verifyPaymentAPI({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            // 4. Update credits in context
            updateUser({ credits: user.credits + verifyRes.data.credits });
            toast.success(`${verifyRes.data.credits} credits added!`);
            navigate("/projects");
          } catch (err) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#4F46E5",
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
            setLoadingPlan(null);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to initiate payment");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <div className="px-4 pt-6">
        <nav className="flex items-center justify-between border border-slate-700 px-6 py-3 rounded-full max-w-6xl mx-auto">
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

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <span className="text-white/70 text-xs">{user.credits} credits</span>
                </div>
                <button
                  onClick={() => navigate("/projects")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-5 py-2 rounded-full transition"
                >
                  Dashboard
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-5 py-2 rounded-full transition"
              >
                Get Started
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 pt-14 pb-20">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-white to-[#748298] text-transparent bg-clip-text mb-4">
            Simple Pricing
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Buy credits once, use them anytime. No subscriptions, no hidden fees.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 flex flex-col gap-5 transition ${
                plan.highlighted
                  ? "bg-indigo-600/10 border-2 border-indigo-500/50"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              {/* Most popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-xs font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan info */}
              <div>
                <h2 className="text-white font-semibold text-lg">{plan.name}</h2>
                <p className="text-slate-400 text-xs mt-1">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-400 text-sm mb-1">one time</span>
              </div>

              {/* Credits highlight */}
              <div className="bg-white/5 rounded-xl px-4 py-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span className="text-white font-medium text-sm">{plan.credits} credits included</span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-300 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 flex-shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Buy button */}
              <button
                onClick={() => handleBuy(plan.id)}
                disabled={loadingPlan === plan.id}
                className={`w-full py-3 rounded-full text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.highlighted
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                }`}
              >
                {loadingPlan === plan.id ? "Processing..." : `Buy ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* Free credits note */}
        <p className="text-center text-slate-500 text-xs mt-10">
          New accounts get 20 free credits. 1 generation = 5 credits. 1 revision = 1 credit.
        </p>
      </div>

      {/* Backdrop */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[980px] h-[460px] bg-gradient-to-tr from-indigo-800/20 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );
}