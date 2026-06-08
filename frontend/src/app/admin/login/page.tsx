"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Newspaper, Eye, EyeOff } from "lucide-react";
import { useLogin } from "@/lib/hooks/useAuth";
import { useAuthStore } from "@/store/useStore";
import { useEffect } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const login = useLogin();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.push("/admin");
        },
        onError: (err) => {
          const message =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Invalid credentials. Please try again.";
          setError(message);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-2">
            <Newspaper className="w-10 h-10 text-red-500" />
            <span className="text-3xl font-bold text-white tracking-tight">IndoTimesMedia</span>
          </div>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Admin Panel</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-6">Sign in</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@indotimesmedia.com"
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg uppercase tracking-widest text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {login.isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          © {new Date().getFullYear()} IndoTimesMedia. All rights reserved.
        </p>
      </div>
    </div>
  );
}
