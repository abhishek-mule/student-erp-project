"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { setTokens } from "@/lib/auth";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const { accessToken, refreshToken, user } = await res.json();
                setTokens(accessToken, refreshToken);
                
                // Redirect based on role and tenant
                if (user.tenant) {
                    router.push(`/${user.tenant.slug}`);
                } else {
                    router.push("/admin");
                }
            } else {
                const data = await res.json();
                setError(data.message || "Invalid credentials. Please try again.");
            }
        } catch (e) {
            setError("Something went wrong. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                        <LogIn className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">College ERP Portal</h1>
                    <p className="text-slate-400 text-sm">Welcome back. Enter your credentials to access your dashboard.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input 
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-10 py-3 text-white placeholder:text-slate-600 outline-none transition-all"
                                placeholder="name@college.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input 
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-10 py-3 text-white placeholder:text-slate-600 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>Sign In</>
                        )}
                    </button>
                    
                    <div className="text-center mt-6">
                        <p className="text-slate-500 text-xs">
                           Don&apos;t have access? <span className="text-indigo-400 hover:underline cursor-pointer">Contact Administration</span>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
