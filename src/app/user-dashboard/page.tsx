"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Compass, LogOut, Loader2, FileSearch, BookOpen, Map, Sparkles } from "lucide-react";
import { initializeFirebase } from "@/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

interface SavedRoadmap {
  id: string;
  targetRole: string;
  createdAt: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [savedRoadmaps, setSavedRoadmaps] = useState<SavedRoadmap[]>([]);

  useEffect(() => {
    const { auth } = initializeFirebase();
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);
        // Load saved roadmaps if user is synced
        try {
          const syncRes = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: u.email })
          });
          if (syncRes.ok) {
            const dbUser = await syncRes.json();
            const roadmapsRes = await fetch(`/api/roadmaps/${dbUser.id}`);
            if (roadmapsRes.ok) setSavedRoadmaps(await roadmapsRes.json());
          }
        } catch (err) {
          console.error("Failed to load roadmaps:", err);
        }
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    const { auth } = initializeFirebase();
    await signOut(auth);
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 p-8 relative overflow-hidden">
      
      {/* ══ BRIGHT DAYTIME LANDSCAPE BACKGROUND ══════════════════ */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-slate-50">
        <img 
          src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop" 
          alt="Inspiring Educational Landscape"
          className="absolute inset-0 w-full h-full object-cover opacity-100" 
        />
        {/* Light gradient overlay to keep the white glassmorphism perfectly readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/60" />
      </div>

      <nav className="flex justify-between items-center mb-16 max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-2">
          {/* Enhanced Nav Glass */}
          <div className="w-8 h-8 rounded-lg bg-white/70 backdrop-blur-md border border-white flex items-center justify-center shadow-sm">
            <Compass className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800 drop-shadow-sm">SkillBridge</span>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              {user.photoURL && <img src={user.photoURL} alt="Avatar" className="w-7 h-7 rounded-full border-2 border-white shadow-sm" />}
              <span className="text-slate-800 font-bold text-sm hidden sm:block drop-shadow-sm">{user.displayName || user.email}</span>
            </div>
          )}
          <button onClick={handleSignOut} className="text-slate-700 font-bold hover:text-slate-900 flex items-center gap-2 text-sm transition-colors bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white hover:bg-white/90 shadow-sm">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-bold mb-2 tracking-tight text-slate-800 drop-shadow-sm">Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}.</h1>
          <p className="text-slate-700 mb-12 font-medium drop-shadow-sm">Ready to map out your next career move?</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* Roadmap Generator - Large Card (Enhanced Glassmorphism) */}
            <div
              onClick={() => router.push("/roadmap-generator")}
              className="col-span-1 md:col-span-2 bg-white/60 backdrop-blur-2xl border border-white/80 rounded-3xl p-8 cursor-pointer hover:bg-white/80 transition-all group relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 group-hover:bg-blue-400/20 transition-colors" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white border border-white/80 flex items-center justify-center mb-5 shadow-sm">
                  <Map className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-slate-800">Generate Roadmap</h2>
                <p className="text-slate-700 mb-8 max-w-md text-sm leading-relaxed font-medium">
                  Tell us your background, skills, and target role. Our AI generates a step-by-step personalized career path with resources, timelines, and salary info.
                </p>
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                  Start Generator <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* ATS Checker (Enhanced Glassmorphism) */}
            <div
              onClick={() => router.push("/ats-checker")}
              className="col-span-1 bg-white/60 backdrop-blur-2xl border border-white/80 rounded-3xl p-8 cursor-pointer hover:bg-white/80 transition-all group relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
            >
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 group-hover:bg-indigo-400/20 transition-colors" />
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-white border border-white/80 flex items-center justify-center mb-5 shadow-sm">
                  <FileSearch className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-800">ATS Resume Checker</h3>
                <p className="text-slate-700 text-sm mb-6 leading-relaxed font-medium">
                  Analyze your resume for ATS compatibility. Get scores, keyword gaps, and actionable improvements.
                </p>
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mt-auto pt-4">
                  Check Resume <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Resume Builder - Full Width Banner (Enhanced Glassmorphism) */}
            <div
              onClick={() => router.push("/resume-builder")}
              className="col-span-1 md:col-span-3 bg-white/60 backdrop-blur-2xl border border-white/80 rounded-3xl p-8 cursor-pointer hover:bg-white/80 transition-all group relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
            >
              <div className="absolute top-1/2 left-1/2 w-[500px] h-40 bg-emerald-400/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 group-hover:bg-emerald-400/20 transition-colors pointer-events-none" />
              <div className="relative z-10 flex-1">
                <div className="w-10 h-10 rounded-xl bg-white border border-white/80 flex items-center justify-center mb-4 shadow-sm">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-slate-800">Resume Builder</h3>
                <p className="text-slate-700 text-sm max-w-3xl leading-relaxed font-medium">
                  Craft a professional, ATS-optimized resume from scratch. Input your raw experience and let Gemini 3 format, quantify, and polish it into a hiring-ready document tailored to your target role.
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-emerald-700 font-bold text-sm whitespace-nowrap mt-4 md:mt-0 bg-white/80 px-5 py-3 rounded-xl border border-white shadow-sm group-hover:bg-white transition-colors">
                Build Resume <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

          {/* Saved Roadmaps (Enhanced Glassmorphism) */}
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-5 h-5 text-slate-600" />
              <h2 className="text-lg font-bold text-slate-800">Saved Roadmaps</h2>
            </div>

            {savedRoadmaps.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {savedRoadmaps.map((roadmap) => (
                  <div 
                    key={roadmap.id} 
                    onClick={() => router.push(`/roadmap/${roadmap.id}`)} 
                    className="bg-white/70 border border-white/80 rounded-2xl p-4 hover:bg-white transition-colors cursor-pointer shadow-sm backdrop-blur-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center mb-3 shadow-sm">
                      <Map className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="font-bold text-sm text-slate-800 mb-1">{roadmap.targetRole}</p>
                    <p className="text-xs text-slate-600 font-medium">{new Date(roadmap.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-white border border-white shadow-sm flex items-center justify-center mb-4">
                  <span className="text-2xl">🗺️</span>
                </div>
                <p className="text-slate-800 font-bold text-sm">No saved roadmaps yet.</p>
                <p className="text-slate-600 font-medium text-xs mt-1">Generate your first roadmap to get started.</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}