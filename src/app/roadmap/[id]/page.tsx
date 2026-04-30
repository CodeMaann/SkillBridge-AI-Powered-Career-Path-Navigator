"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Loader2, CheckCircle2, Target, Code2,
  GraduationCap, Clock, ChevronRight, Zap, AlertCircle
} from "lucide-react";

// Types
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

const PHASE_META = {
  Foundation: { color: "#ffffff", label: "01", emoji: "🏗️" },
  Ascent:     { color: "#f8fafc", label: "02", emoji: "⚡" },
  Mastery:    { color: "#f1f5f9", label: "03", emoji: "🎯" },
};

export default function ViewSavedRoadmap() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [dbRecord, setDbRecord] = useState<any>(null);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [openSection, setOpenSection] = useState<string>("milestones");

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`/api/roadmaps/single/${id}`); 
        if (res.ok) {
          const data = await res.json();
          setDbRecord(data);
          
          // Safely parse the JSON data from your database
          let parsedData = data.roadmapData;
          if (typeof parsedData === 'string') {
            parsedData = JSON.parse(parsedData);
          }
          
          // Fallback just in case the data is structured slightly differently
          if (!parsedData && data.roadmap) parsedData = data;
          
          setRoadmapData(parsedData);
        }
      } catch (error) {
        console.error("Error fetching roadmap:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRoadmap();
  }, [id]);

  const SectionToggle = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden mb-4 shadow-lg">
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

      {/* ══ EXACT SAME BACKGROUND FROM GENERATOR ══════════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop')" }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0510]/80 via-[#0A0510]/50 to-[#0A0510]/95" />
      </div>

      <div className="relative z-10 pt-10 px-6 max-w-4xl mx-auto">
        {/* Fixed the 404 Bug here by routing to /user-dashboard */}
        <button onClick={() => router.push("/user-dashboard")}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md w-max shadow-lg">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
            <Loader2 className="w-10 h-10 animate-spin text-white mb-4" />
            <p className="text-white/70 font-medium">Loading saved roadmap...</p>
          </div>
        ) : !roadmapData ? (
          <div className="flex flex-col items-center justify-center py-40 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl text-center px-6">
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Data Missing or Corrupted</h2>
            <p className="text-white/60">We could not parse the saved data for this roadmap.</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} className="pb-10 pt-4">
              
              {/* Hero header */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-5 mb-10">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 bg-white/10 border border-white/20 text-white shadow-sm">
                    ✦ Saved Career Roadmap
                  </div>
                  <h1 className="text-4xl font-headline font-bold text-white mb-3 tracking-tight">→ {roadmapData.target_role || dbRecord?.targetRole}</h1>
                  <p className="text-sm leading-relaxed pl-4 max-w-3xl text-white/80 border-l-2 border-white/40 mb-5">
                    {roadmapData.baseline_recognized || "Your customized AI-generated career path."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {roadmapData.estimated_timeline && <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white font-medium">⏱ {roadmapData.estimated_timeline}</span>}
                    {roadmapData.salary_range     && <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 font-medium">💰 {roadmapData.salary_range}</span>}
                    {roadmapData.weekly_plan      && <span className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium">📅 {roadmapData.weekly_plan}</span>}
                  </div>
                </div>
              </div>

              {/* Skill Gaps */}
              {roadmapData.skill_gaps && roadmapData.skill_gaps.length > 0 && (
                <div className="bg-red-500/5 border border-red-500/10 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-lg">
                  <p className="text-xs font-bold uppercase tracking-widest mb-4 text-red-300 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Skill Gaps to Bridge</p>
                  <div className="flex flex-wrap gap-2">
                    {roadmapData.skill_gaps.map((g, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-200">{g}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Phase timeline (Exact Match from Generator) */}
              {roadmapData.roadmap && (
                <div className="relative mb-10 mt-12">
                  <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/40 via-white/10 to-transparent" />

                  {(["Foundation","Ascent","Mastery"] as const).map((phase, pi) => {
                    const steps = roadmapData.roadmap[phase] || [];
                    if (steps.length === 0) return null;
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
              )}

              {/* Monthly Milestones */}
              {roadmapData.monthly_milestones && roadmapData.monthly_milestones.length > 0 && (
                <SectionToggle id="milestones" title="📅 Monthly Milestones">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {roadmapData.monthly_milestones.map((m, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-sm">
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
                      <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start justify-between gap-4 shadow-sm">
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
                        {roadmapData.interview_prep.topics?.map((t, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 border border-white/10 text-white">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-3 text-white/50 uppercase tracking-widest">Resources</p>
                      {roadmapData.interview_prep.resources?.map((r, i) => <p key={i} className="text-sm mb-2 text-white/80">→ {r}</p>)}
                      <p className="text-xs font-medium mt-4 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white inline-block">⏰ Timeline: {roadmapData.interview_prep.timeline}</p>
                    </div>
                  </div>
                </SectionToggle>
              )}

              {/* Resources + Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                {roadmapData.top_resources && roadmapData.top_resources.length > 0 && (
                  <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg">
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
                  <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg">
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
                    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                      <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-white">🤝 Networking Tips</h3>
                      <ul className="space-y-3">
                        {roadmapData.networking_tips.map((t, i) => <li key={i} className="flex gap-3 text-sm text-white/80 leading-relaxed"><span className="text-white/40">→</span>{t}</li>)}
                      </ul>
                    </div>
                  )}
                  {roadmapData.common_mistakes && roadmapData.common_mistakes.length > 0 && (
                    <div className="bg-red-500/5 border border-red-500/10 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                      <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-red-300">⚠ Mistakes to Avoid</h3>
                      <ul className="space-y-3">
                        {roadmapData.common_mistakes.map((m, i) => <li key={i} className="flex gap-3 text-sm text-red-200/80 leading-relaxed"><span className="text-red-400/50">✗</span>{m}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}

            </motion.div>
          </AnimatePresence>
        )}

      </main>
    </div>
  );
}