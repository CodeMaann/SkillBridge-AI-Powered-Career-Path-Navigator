"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Loader2, Save, CheckCircle2, Target, Code2,
  GraduationCap, Clock, ChevronRight, Zap, AlertCircle
} from "lucide-react";
import { initializeFirebase } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface RoadmapStep {
  step: string; description?: string; skills: string[]; duration?: string;
  resources?: string[]; project?: string; checkpoint?: string;
}
interface Certification { name: string; provider: string; cost: string; timeline: string; value: string; }
interface Milestone { month: number; focus: string; goal: string; deliverable: string; }
interface RoadmapData {
  baseline_recognized: string; target_role: string; estimated_timeline?: string; salary_range?: string;
  skill_gaps?: string[]; weekly_plan?: string;
  roadmap: { Foundation: RoadmapStep[]; Ascent: RoadmapStep[]; Mastery: RoadmapStep[] };
  certifications?: Certification[]; monthly_milestones?: Milestone[];
  interview_prep?: { topics: string[]; resources: string[]; timeline: string };
  success_tips?: string[]; top_resources?: { name: string; type: string; platform: string; reason: string }[];
  networking_tips?: string[]; common_mistakes?: string[];
}

const STEPS = ["Background", "Skills", "Goal", "Timeline"];
const QUICK_SKILLS = ["Python","JavaScript","React","Node.js","SQL","Machine Learning","Data Analysis","Java","AWS","Docker","TypeScript","Django","Excel","Communication","Problem Solving"];
const QUICK_ROLES  = ["Full Stack Developer","Data Scientist","ML Engineer","DevOps Engineer","Product Manager","UI/UX Designer","Cloud Architect","Cybersecurity Analyst"];
const PHASE_META = {
  Foundation: { color: "#ffffff", label: "01", emoji: "🏗️" },
  Ascent:     { color: "#f8fafc", label: "02", emoji: "⚡" },
  Mastery:    { color: "#f1f5f9", label: "03", emoji: "🎯" },
};

export default function RoadmapGenerator() {
  const router = useRouter();
  const [user, setUser]                   = useState<User | null>(null);
  const [prismaUserId, setPrismaUserId]   = useState<string | null>(null);
  const [currentStep, setCurrentStep]     = useState(0);
  const [form, setForm] = useState({ education:"", field:"", experience:"", currentSkills:"", targetRole:"", goalIndustry:"", timeline:"", hoursPerWeek:"" });
  const [isComputing, setIsComputing]     = useState(false);
  const [roadmapData, setRoadmapData]     = useState<RoadmapData | null>(null);
  const [isSaving,    setIsSaving]        = useState(false);
  const [isSaved,     setIsSaved]         = useState(false);
  const [error,       setError]           = useState("");
  const [openSection, setOpenSection]     = useState<string>("milestones");

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const activeSkills = form.currentSkills ? form.currentSkills.split(",").map(s => s.trim()).filter(Boolean) : [];
  const toggleSkill = (s: string) => {
    if (activeSkills.includes(s)) update("currentSkills", activeSkills.filter(x => x !== s).join(", "));
    else update("currentSkills", [...activeSkills, s].join(", "));
  };
  const canNext = () => {
    if (currentStep === 0) return !!(form.education && form.field && form.experience);
    if (currentStep === 1) return form.currentSkills.trim().length > 0;
    if (currentStep === 2) return form.targetRole.trim().length > 0;
    if (currentStep === 3) return !!(form.timeline && form.hoursPerWeek);
    return false;
  };

  useEffect(() => {
    const { auth } = initializeFirebase();
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u?.email) {
        setUser(u);
        try {
          const r = await fetch("/api/users", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ email: u.email }) });
          if (r.ok) { const d = await r.json(); setPrismaUserId(d.id); }
        } catch {}
      } else { router.push("/login"); }
    });
    return () => unsub();
  }, [router]);

  const handleGenerate = async () => {
    setIsComputing(true); setError(""); setRoadmapData(null); setIsSaved(false);
    try {
      const res = await fetch("/api/generate-roadmap", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ currentSkills:form.currentSkills, targetRole:form.targetRole, education:form.education, field:form.field, experience:form.experience, goalIndustry:form.goalIndustry, timeline:form.timeline, hoursPerWeek:form.hoursPerWeek }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed");
      setRoadmapData(data);
    } catch (e: any) {
      setError(e.message || "Generation failed. Check your API configuration.");
    } finally { setIsComputing(false); }
  };

  const handleSave = async () => {
    if (!roadmapData || !prismaUserId) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/roadmaps", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ userId:prismaUserId, currentSkillset:form.currentSkills, targetRole:form.targetRole, roadmapData }) });
      if (!res.ok) throw new Error("Failed");
      setIsSaved(true);
    } catch { setError("Failed to save."); }
    finally { setIsSaving(false); }
  };

  const SectionToggle = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden mb-4">
      <button onClick={() => setOpenSection(openSection === id ? "" : id)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/10 transition-colors border-b border-white/5">
        <span className="font-bold text-white text-sm tracking-wide">{title}</span>
        <span className="text-white/50 text-xs">{openSection === id ? "▲ collapse" : "▼ expand"}</span>
      </button>
      {openSection === id && <div className="px-6 pb-5 pt-4">{children}</div>}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0A0510] text-white">

      {/* ══ STATIC BACKGROUND IMAGE ══════════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop')" }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0510]/80 via-[#0A0510]/50 to-[#0A0510]/95" />
      </div>

      <div className="relative z-10 pt-10 px-6 max-w-4xl mx-auto">
        <button onClick={() => roadmapData ? (setRoadmapData(null), setCurrentStep(0)) : router.push("/user-dashboard")}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md w-max">
          <ArrowLeft className="w-4 h-4" />
          {roadmapData ? "Generate New Roadmap" : "Back to Dashboard"}
        </button>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">

          {!roadmapData && !isComputing && (
            <motion.div key="form" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }} transition={{ duration:0.4 }}>

              <div className="text-center pb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5 bg-white/10 border border-white/20 text-white tracking-widest uppercase">
                  ✦ AI-Powered
                </div>
                <h1 className="text-4xl md:text-5xl font-headline font-bold text-white mb-3 tracking-tight">Career Roadmap Generator</h1>
                <p className="text-sm text-white/60">Tell us about yourself and get a personalized learning path</p>
              </div>

              <div className="flex items-center justify-center gap-0 mb-10 flex-wrap gap-y-2">
                {STEPS.map((s, i) => (
                  <div key={i} className="flex items-center">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                      style={i <= currentStep ? { background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.4)", color:"#fff" } : { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)" }}>
                      <span>{i < currentStep ? "✓" : i + 1}</span><span>{s}</span>
                    </div>
                    {i < 3 && <div className="w-6 h-px mx-1" style={{ background: i < currentStep ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)" }} />}
                  </div>
                ))}
              </div>

              <div className="glass-panel border border-white/20 p-8 md:p-10 rounded-3xl bg-white/5 backdrop-blur-xl shadow-2xl">
                <AnimatePresence mode="wait">

                  {currentStep === 0 && (
                    <motion.div key="s0" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:0.25 }}>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 rounded-xl bg-white/10 border border-white/20"><GraduationCap className="w-5 h-5 text-white" /></div>
                        <h2 className="text-2xl font-headline font-bold text-white tracking-tight">Educational Background</h2>
                      </div>
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm mb-2 text-white/80">Highest Education Level</label>
                          <select className="w-full bg-white/10 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-white/40 transition-colors appearance-none" value={form.education} onChange={e => update("education", e.target.value)}>
                            <option value="" className="bg-[#0A0510]">Select education level</option>
                            {["High School / 12th","Diploma / Polytechnic","Bachelor's (B.Tech/BCA/B.Sc)","Bachelor's (Non-Tech)","Master's (M.Tech/MCA/M.Sc)","MBA","PhD","Self-Taught / Bootcamp"].map(o => <option key={o} value={o} className="bg-[#0A0510]">{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm mb-2 text-white/80">Field / Branch of Study</label>
                          <input className="w-full bg-white/10 border border-white/10 rounded-xl p-3.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors" placeholder="e.g. Computer Science, Electronics, Commerce" value={form.field} onChange={e => update("field", e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm mb-3 text-white/80">Experience Level</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {["Fresher","1-2 years","3-5 years","5+ years"].map(lvl => (
                              <button key={lvl} onClick={() => update("experience", lvl)} 
                                className={`py-3 rounded-xl text-sm font-medium transition-all ${form.experience === lvl ? 'bg-white/30 border-white/50 text-white border shadow-lg' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'}`}>
                                {lvl}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 1 && (
                    <motion.div key="s1" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:0.25 }}>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 rounded-xl bg-white/10 border border-white/20"><Code2 className="w-5 h-5 text-white" /></div>
                        <h2 className="text-2xl font-headline font-bold text-white tracking-tight">Your Current Skills</h2>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm mb-2 text-white/80">List your skills (comma-separated)</label>
                          <textarea rows={4} className="w-full bg-white/10 border border-white/10 rounded-xl p-3.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors resize-none leading-relaxed"
                            placeholder="e.g. Python, HTML, CSS, basic SQL, Excel, problem solving, communication..."
                            value={form.currentSkills} onChange={e => update("currentSkills", e.target.value)} />
                          <p className="text-xs mt-2 text-white/40">Include both technical and soft skills. The more you share, the better the roadmap.</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {QUICK_SKILLS.map(skill => (
                            <button key={skill} onClick={() => toggleSkill(skill)}
                              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${activeSkills.includes(skill) ? 'bg-white/30 border-white/50 text-white border shadow-md' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'}`}>
                              {activeSkills.includes(skill) ? "✓ " : "+ "}{skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div key="s2" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:0.25 }}>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 rounded-xl bg-white/10 border border-white/20"><Target className="w-5 h-5 text-white" /></div>
                        <h2 className="text-2xl font-headline font-bold text-white tracking-tight">Your Career Goal</h2>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm mb-2 text-white/80">Target Role / Job Title</label>
                          <input className="w-full bg-white/10 border border-white/10 rounded-xl p-3.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors" placeholder="e.g. Full Stack Developer, Data Scientist" value={form.targetRole} onChange={e => update("targetRole", e.target.value)} />
                          <div className="flex flex-wrap gap-2 mt-4">
                            {QUICK_ROLES.map(role => (
                              <button key={role} onClick={() => update("targetRole", role)}
                                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${form.targetRole === role ? 'bg-white/30 border-white/50 text-white border shadow-md' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'}`}>
                                {role}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm mb-2 text-white/80">Target Industry <span className="text-white/40 text-xs">(optional)</span></label>
                          <input className="w-full bg-white/10 border border-white/10 rounded-xl p-3.5 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors" placeholder="e.g. Fintech, Healthcare AI, E-commerce" value={form.goalIndustry} onChange={e => update("goalIndustry", e.target.value)} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div key="s3" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:0.25 }}>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 rounded-xl bg-white/10 border border-white/20"><Clock className="w-5 h-5 text-white" /></div>
                        <h2 className="text-2xl font-headline font-bold text-white tracking-tight">Your Timeline & Commitment</h2>
                      </div>
                      <div className="space-y-8">
                        <div>
                          <label className="block text-sm mb-3 text-white/80">Goal Achievement Timeline</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {["3 months","6 months","1 year","2 years"].map(t => (
                              <button key={t} onClick={() => update("timeline", t)} 
                                className={`py-3 rounded-xl text-sm font-medium transition-all ${form.timeline === t ? 'bg-white/30 border-white/50 text-white border shadow-lg' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'}`}>
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm mb-3 text-white/80">Hours available per week for learning</label>
                          <div className="grid grid-cols-3 gap-3">
                            {["5-10 hrs","10-20 hrs","20-30 hrs","30-40 hrs","40+ hrs"].map(h => (
                              <button key={h} onClick={() => update("hoursPerWeek", h)} 
                                className={`py-3 rounded-xl text-sm font-medium transition-all ${form.hoursPerWeek === h ? 'bg-white/30 border-white/50 text-white border shadow-lg' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'}`}>
                                {h}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>

                <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/10">
                  <button onClick={() => currentStep > 0 ? setCurrentStep(s => s - 1) : router.push("/user-dashboard")}
                    className="text-sm font-medium transition-colors text-white/50 hover:text-white">
                    ← {currentStep === 0 ? "Dashboard" : "Back"}
                  </button>
                  {error && (
                    <p className="text-xs px-4 py-2 rounded-xl flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-200 mx-4">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />{error}
                    </p>
                  )}
                  {currentStep < 3 ? (
                    <button onClick={() => setCurrentStep(s => s + 1)} disabled={!canNext()}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-30 transition-all bg-white/20 hover:bg-white/30 border border-white/30 shadow-lg">
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={handleGenerate} disabled={!canNext() || isComputing}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-30 transition-all bg-white/20 hover:bg-white/30 border border-white/30 shadow-lg">
                      <Zap className="w-4 h-4" /> Generate My Roadmap
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {isComputing && (
            <motion.div key="computing" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="flex flex-col items-center justify-center py-40 bg-[#0F0A15]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full animate-spin border-2 border-transparent border-t-white" />
                <div className="absolute inset-2 rounded-full animate-spin border-2 border-transparent border-r-white/50" style={{ animationDuration:"1.5s" }} />
                <div className="absolute inset-4 rounded-full animate-spin border-2 border-transparent border-b-white/20" style={{ animationDuration:"2s" }} />
                <Loader2 className="absolute inset-0 m-auto w-8 h-8 animate-pulse text-white" />
              </div>
              <h2 className="text-3xl font-headline font-bold text-white mb-2">Computing Trajectory</h2>
              <p className="text-sm animate-pulse text-white/60">AI is building your detailed personalized roadmap...</p>
              <p className="text-xs mt-2 text-white/40">This takes 15-30 seconds for a full analysis</p>
            </motion.div>
          )}

          {roadmapData && !isComputing && (
            <motion.div key="result" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} className="pb-24 pt-8">
              {/* Hero header */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-5 mb-10">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 bg-white/10 border border-white/20 text-white">
                    ✦ Your Personalized Career Roadmap
                  </div>
                  <h1 className="text-4xl font-headline font-bold text-white mb-3 tracking-tight">→ {roadmapData.target_role}</h1>
                  <p className="text-sm leading-relaxed pl-4 max-w-3xl text-white/80 border-l-2 border-white/40 mb-5">
                    {roadmapData.baseline_recognized}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {roadmapData.estimated_timeline && <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white font-medium">⏱ {roadmapData.estimated_timeline}</span>}
                    {roadmapData.salary_range     && <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 font-medium">💰 {roadmapData.salary_range}</span>}
                    {roadmapData.weekly_plan      && <span className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium">📅 {roadmapData.weekly_plan}</span>}
                  </div>
                </div>
                <button onClick={handleSave} disabled={isSaving || isSaved}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 whitespace-nowrap bg-white/10 hover:bg-white/20 border border-white/20 shadow-lg">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : isSaved ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Save className="w-4 h-4" />}
                  {isSaved ? "Saved!" : "Save to Profile"}
                </button>
              </div>

              {/* Skill Gaps */}
              {roadmapData.skill_gaps && roadmapData.skill_gaps.length > 0 && (
                <div className="bg-red-500/5 border border-red-500/10 backdrop-blur-md rounded-2xl p-6 mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest mb-4 text-red-300 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Skill Gaps to Bridge</p>
                  <div className="flex flex-wrap gap-2">
                    {roadmapData.skill_gaps.map((g, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-200">{g}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Phase timeline */}
              <div className="relative mb-10 mt-12">
                <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/40 via-white/10 to-transparent" />

                {(["Foundation","Ascent","Mastery"] as const).map((phase, pi) => {
                  const steps = roadmapData.roadmap[phase] || [];
                  const meta  = PHASE_META[phase];
                  return (
                    <div key={phase} className="mb-20">
                      <div className="sticky top-4 z-20 flex justify-start md:justify-center mb-10">
                        <div className="px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest flex items-center gap-3 shadow-xl"
                          style={{ background:"rgba(15,10,21,0.9)", border:"1px solid rgba(255,255,255,0.3)", color:"white", backdropFilter:"blur(12px)" }}>
                          <span className="text-lg">{meta.emoji}</span> {meta.label} — {phase} <span className="text-xs opacity-50 font-normal">({steps.length} steps)</span>
                        </div>
                      </div>
                      <div className="space-y-8">
                        {steps.map((step, si) => {
                          const isEven = si % 2 === 0;
                          return (
                            <motion.div key={si} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }} transition={{ duration:0.4, delay:si*0.05 }}
                              className={`relative flex flex-col md:flex-row items-start gap-6 ${isEven ? "md:flex-row-reverse" : ""}`}>
                              
                              <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 mt-6 z-10 bg-[#0A0510] border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                              
                              <div className="hidden md:block md:w-1/2" />
                              <div className="w-full pl-16 md:pl-0 md:w-1/2">
                                <div className={`bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 hover:bg-white/10 transition-colors shadow-xl ${isEven ? "md:mr-8" : "md:ml-8"}`}>
                                  <div className="flex items-start justify-between gap-3 mb-3">
                                    <h3 className="font-headline font-bold text-white text-lg leading-snug">{step.step}</h3>
                                    {step.duration && <span className="text-xs px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 bg-white/10 text-white/80 font-medium">{step.duration}</span>}
                                  </div>
                                  {step.description && <p className="text-sm mb-4 leading-relaxed text-white/70">{step.description}</p>}
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {step.skills?.map((sk, i) => (
                                      <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 border border-white/10 text-white/90">{sk}</span>
                                    ))}
                                  </div>
                                  {step.resources && step.resources.length > 0 && (
                                    <div className="mb-4 pt-3 border-t border-white/10">
                                      <p className="text-xs font-bold mb-2 tracking-wider text-white/50 uppercase">📚 Resources</p>
                                      {step.resources.map((r, i) => <p key={i} className="text-sm mb-1 text-white/80">→ {r}</p>)}
                                    </div>
                                  )}
                                  {step.project && (
                                    <div className="rounded-xl p-4 bg-white/5 border border-white/10 mt-2">
                                      <p className="text-xs font-bold mb-1 tracking-wider uppercase text-white/80">🛠 Build Project</p>
                                      <p className="text-sm font-medium text-white">{step.project}</p>
                                    </div>
                                  )}
                                  {step.checkpoint && (
                                    <p className="text-sm mt-3 pt-3 border-t border-white/10 text-green-300 font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> {step.checkpoint}</p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Monthly Milestones */}
              {roadmapData.monthly_milestones && roadmapData.monthly_milestones.length > 0 && (
                <SectionToggle id="milestones" title="📅 Monthly Milestones">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {roadmapData.monthly_milestones.map((m, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-white">Month {m.month}</span>
                          <span className="text-xs text-white/50 uppercase tracking-wider font-bold">{m.focus}</span>
                        </div>
                        <p className="text-sm font-medium text-white/90 mb-2">{m.goal}</p>
                        <p className="text-xs text-white/60 flex items-center gap-2">📦 {m.deliverable}</p>
                      </div>
                    ))}
                  </div>
                </SectionToggle>
              )}

              {/* Certifications */}
              {roadmapData.certifications && roadmapData.certifications.length > 0 && (
                <SectionToggle id="certs" title="🏆 Recommended Certifications">
                  <div className="space-y-4">
                    {roadmapData.certifications.map((c, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-white text-sm mb-1">{c.name}</p>
                          <p className="text-xs text-white/60 mb-2">{c.provider} · {c.timeline}</p>
                          <p className="text-xs text-white/80 bg-white/5 p-2 rounded-lg inline-block border border-white/5">{c.value}</p>
                        </div>
                        <span className="text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap bg-green-500/10 text-green-300 border border-green-500/20">{c.cost}</span>
                      </div>
                    ))}
                  </div>
                </SectionToggle>
              )}

              {/* Interview Prep */}
              {roadmapData.interview_prep && (
                <SectionToggle id="interview" title="🎤 Interview Preparation">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                    <div>
                      <p className="text-xs font-bold mb-3 text-white/50 uppercase tracking-widest">Key Topics</p>
                      <div className="flex flex-wrap gap-2">
                        {roadmapData.interview_prep.topics.map((t, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 border border-white/10 text-white">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-3 text-white/50 uppercase tracking-widest">Resources</p>
                      {roadmapData.interview_prep.resources.map((r, i) => <p key={i} className="text-sm mb-2 text-white/80">→ {r}</p>)}
                      <p className="text-xs font-medium mt-4 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white inline-block">⏰ Timeline: {roadmapData.interview_prep.timeline}</p>
                    </div>
                  </div>
                </SectionToggle>
              )}

              {/* Resources + Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                {roadmapData.top_resources && roadmapData.top_resources.length > 0 && (
                  <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-white">📚 Top Resources</h3>
                    <div className="space-y-4">
                      {roadmapData.top_resources.map((r, i) => (
                        <div key={i} className="flex items-start justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                          <div>
                            <p className="text-sm font-bold text-white mb-0.5">{r.name}</p>
                            <p className="text-xs text-white/50">{r.platform} · {r.reason}</p>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${r.type === "Free" ? "bg-green-500/10 text-green-300 border border-green-500/20" : "bg-white/10 text-white border border-white/20"}`}>{r.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {roadmapData.success_tips && roadmapData.success_tips.length > 0 && (
                  <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-white">💡 Success Tips</h3>
                    <ul className="space-y-3">
                      {roadmapData.success_tips.map((t, i) => <li key={i} className="flex gap-3 text-sm text-white/80 leading-relaxed"><span className="text-white/40">•</span>{t}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              {/* Networking + Common Mistakes */}
              {(roadmapData.networking_tips?.length || roadmapData.common_mistakes?.length) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roadmapData.networking_tips && roadmapData.networking_tips.length > 0 && (
                    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6">
                      <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-white">🤝 Networking Tips</h3>
                      <ul className="space-y-3">
                        {roadmapData.networking_tips.map((t, i) => <li key={i} className="flex gap-3 text-sm text-white/80 leading-relaxed"><span className="text-white/40">→</span>{t}</li>)}
                      </ul>
                    </div>
                  )}
                  {roadmapData.common_mistakes && roadmapData.common_mistakes.length > 0 && (
                    <div className="bg-red-500/5 border border-red-500/10 backdrop-blur-md rounded-2xl p-6">
                      <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-red-300">⚠ Mistakes to Avoid</h3>
                      <ul className="space-y-3">
                        {roadmapData.common_mistakes.map((m, i) => <li key={i} className="flex gap-3 text-sm text-red-200/80 leading-relaxed"><span className="text-red-400/50">✗</span>{m}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}

            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}