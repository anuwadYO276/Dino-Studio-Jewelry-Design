"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Step = "identifier" | "otp";
type OtpType = "email" | "phone";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/admin";
  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otpType, setOtpType] = useState<OtpType>("email");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, type: otpType }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error.message);
        return;
      }

      setStep("otp");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, code: otp, type: otpType }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error.message);
        return;
      }

      // Store tokens
      localStorage.setItem("access_token", data.data.accessToken);
      localStorage.setItem("refresh_token", data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      // Set cookie for middleware
      document.cookie = `access_token=${data.data.accessToken}; path=/; max-age=3600`;

      if (data.data.user.role !== "admin") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        document.cookie = "access_token=; path=/; max-age=0";
        setError("Admin access only. Contact your administrator.");
        return;
      }

      const dest =
        nextPath.startsWith("/admin") && !nextPath.startsWith("//")
          ? nextPath
          : "/admin";
      router.push(dest);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="w-full max-w-md px-8">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <h1 className="mt-3 font-display text-3xl font-light tracking-widest text-stone-800 uppercase">
            Dino Studio
          </h1>
          <p className="mt-2 text-sm text-stone-500 tracking-wide">
            Admin Panel
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 p-8 border border-stone-100">
          {step === "identifier" ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Sign in method
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setOtpType("email")}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      otpType === "email"
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpType("phone")}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      otpType === "phone"
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    Phone
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="identifier"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  {otpType === "email" ? "Email address" : "Phone number"}
                </label>
                <input
                  id="identifier"
                  type={otpType === "email" ? "email" : "tel"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    otpType === "email" ? "you@company.com" : "0812345678"
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 outline-none transition-all text-stone-800 placeholder:text-stone-400"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm" role="alert">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-stone-600">
                  We sent a code to{" "}
                  <span className="font-medium text-stone-800">
                    {identifier}
                  </span>
                </p>
              </div>

              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Verification code
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 outline-none transition-all text-center text-2xl tracking-[0.5em] font-mono text-stone-800 placeholder:text-stone-300"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm" role="alert">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & Sign In"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("identifier");
                  setOtp("");
                  setError("");
                }}
                className="w-full text-sm text-stone-500 hover:text-stone-700 transition-colors"
              >
                ← Back to sign in
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-stone-400">
          Authorized administrators only
        </p>
      </div>
    </div>
  );
}
