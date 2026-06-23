"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Loader2, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (isSignUp) {
        // Auto pick display name from the email prefix
        const autoDisplayName = email.split('@')[0];
        
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              display_name: autoDisplayName,
            }
          }
        });
        
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 bg-[#131B23] border border-white/10 rounded-2xl shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center mb-4">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isSignUp ? "Create an Account" : "Welcome to FitForge"}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {isSignUp ? "Start scaling your business today." : "Sign in to manage your coaching business."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4" autoComplete="off">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Email Address</label>
            <input 
              name="email"
              type="email" 
              autoComplete="off"
              required 
              placeholder="coach@fitforge.ai"
              className="w-full px-4 py-3 bg-[#1E293B] border border-white/5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white flex justify-between">
              Password
              {!isSignUp && <span className="text-primary text-xs cursor-pointer hover:underline">Forgot?</span>}
            </label>
            <div className="relative">
              <input 
                name="password"
                type={showPassword ? "text" : "password"} 
                autoComplete="new-password"
                required 
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#1E293B] border border-white/5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-black transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isSignUp ? "Sign Up" : "Sign In to Dashboard")}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-medium cursor-pointer hover:underline">
            {isSignUp ? "Sign In" : "Start free trial"}
          </span>
        </p>
      </motion.div>
    </div>
  );
}
