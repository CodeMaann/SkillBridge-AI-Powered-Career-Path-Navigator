"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { initializeFirebase } from "@/firebase";
import { Lock, Mail, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Register

  useEffect(() => {
    setIsClient(true);
  }, []);

 const handleGoogleSignIn = async () => {
    try {
      const { auth } = initializeFirebase();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Changed from "/user-dashboard" to "/"
      router.push("/"); 
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError(err.message || "Failed to sign in with Google.");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // --- ADMIN CHECK ---
    if (!isSignUp && email === "admin@skillbridge.com" && password === "AdminSecret123!") {
      sessionStorage.setItem("isAdmin", "true");
      router.push("/admin-dashboard");
      return;
    }

    // --- REGULAR USER AUTH ---
    try {
      const { auth } = initializeFirebase();
      
    if (isSignUp) {
        // Create new account
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Log in existing account
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      // Changed from "/user-dashboard" to "/"
      router.push("/");
      
      // If successful, redirect to user dashboard
      router.push("/user-dashboard");
    } catch (err: any) {
      console.error("Auth Error:", err);
      // Simplify common Firebase error messages
      if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("An account with this email already exists.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message || "Authentication failed.");
      }
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.15)] mb-6"
          >
            <Sparkles className="w-8 h-8 text-purple-400" />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">SkillBridge</h1>
          <p className="text-gray-400 font-light">AI-Powered Career Navigation</p>
        </div>

        <div className="bg-[#1c1c1e]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-3.5 rounded-xl font-medium hover:bg-gray-100 transition-colors mb-8"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center py-4 mb-4">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-gray-500 uppercase tracking-wider">
              Or {isSignUp ? "Sign Up" : "Sign In"} with Email
            </span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>
            
            {error && (
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3.5 rounded-xl font-medium transition-colors group border border-purple-500/50"
            >
              {isSignUp ? "Create Account" : "Access Dashboard"}
              <ArrowRight className="w-4 h-4 text-purple-200 group-hover:text-white transition-colors group-hover:translate-x-1" />
            </button>
          </form>

          {/* Toggle between Login and Sign Up */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(""); // clear errors when switching
                }} 
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}