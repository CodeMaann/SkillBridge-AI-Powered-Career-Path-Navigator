"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, AlertCircle, FileSearch } from "lucide-react";
import { initializeFirebase } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface ATSResult {
  overallScore: number; atsCompatibilityScore: number; contentScore: number; keywordScore: number;
  formatScore: number; readabilityScore?: number; verdict: string; summary: string;
  strengths: string[]; criticalIssues: { issue: string; description: string; priority: string; fix?: string }[];
  missingKeywords: string[]; presentKeywords: string[];
  sectionAnalysis: { section: string; score: number; feedback: string; suggestion?: string }[];
  improvements: { area: string; priority?: string; suggestion: string; example?: string }[];
  formattingIssues: string[];
  quantificationOpportunities?: string[];
  topRecommendation: string;
  rewriteSuggestions?: { original: string; improved: string; reason: string }[];
  industryFit?: string; estimatedInterviewChance?: string; nextSteps?: string[];
}

const sc = (s: number) => s >= 80
  ? { bar:"#22c55e", text:"#86efac", bg:"rgba(34,197,94,0.07)", border:"rgba(34,197,94,0.2)" }
  : s >= 60
  ? { bar:"#eab308", text:"#fde68a", bg:"rgba(234,179,8,0.07)", border:"rgba(234,179,8,0.2)" }
  : { bar:"#ef4444", text:"#fca5a5", bg:"rgba(239,68,68,0.07)", border:"rgba(239,68,68,0.2)" };

function Ring({ score, label, large }: { score:number; label:string; large?:boolean }) {
  const c = sc(score); const sz = large ? 110 : 60;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div style={{ position:"relative", width:sz, height:sz }}>
        <svg viewBox="0 0 36 36" style={{ width:sz, height:sz, transform:"rotate(-90deg)" }}>
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3"/>
          <circle cx="18" cy="18" r="15.9" fill="none" stroke={c.bar} strokeWidth="3"
            strokeDasharray={`${score} ${100-score}`} strokeLinecap="round" style={{ transition:"stroke-dasharray 1s ease" }}/>
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyItems:"center" }}>
          <span style={{ fontWeight:700, color:c.text, fontSize:large?20:12 }}>{score}</span>
          {!large && <span style={{ fontSize:9, color:"rgba(255,255,255,0.4)" }}>/100</span>}
        </div>
      </div>
      <span style={{ fontSize:10, color:"rgba(255,255,255,0.6)", textAlign:"center", maxWidth:72 }}>{label}</span>
    </div>
  );
}

export default function ATSChecker() {
  const router    = useRouter();
  const fileRef   = useRef<HTMLInputElement>(null);
  const [resumeText, setResumeText] = useState("");
  const [resumePdfBase64, setResumePdfBase64] = useState("");
  const [jobDesc,    setJobDesc]    = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [result,     setResult]     = useState<ATSResult | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [tab,        setTab]        = useState<"paste"|"upload">("paste");
  const [fileName,   setFileName]   = useState("");
  const [open,       setOpen]       = useState<string>("sections");

  useEffect(() => {
    const { auth } = initializeFirebase();
    const unsub = onAuthStateChanged(auth, u => { if (!u) router.push("/login"); });
    return () => unsub();
  }, [router]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setFileName(f.name);
    
    if (f.name.toLowerCase().endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = ev => {
        const base64 = (ev.target?.result as string).split(',')[1];
        setResumePdfBase64(base64);
        setResumeText(""); 
      };
      reader.readAsDataURL(f);
    } else {
      const reader = new FileReader();
      reader.onload = ev => {
         setResumeText(ev.target?.result as string || "");
         setResumePdfBase64(""); 
      };
      reader.readAsText(f);
    }
  };

  const analyze = async () => {
    if (!resumeText.trim() && !resumePdfBase64) { setError("Please provide your resume."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/ats-check", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ resumeText, resumePdfBase64, jobDescription:jobDesc, targetRole }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed");
      setResult(data);
    } catch (e: any) { setError(e.message || "Analysis failed. Check your API configuration."); }
    finally { setLoading(false); }
  };

  const reset = () => { setResult(null); setResumeText(""); setResumePdfBase64(""); setJobDesc(""); setTargetRole(""); setFileName(""); setError(""); };

  const gStyle = { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:24, backdropFilter:"blur(24px)" as any };
  const inStyle = { background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"12px 16px", color:"#fff", width:"100%", fontSize:14, outline:"none" };

  const Collapse = ({ id, title, children }: { id:string; title:string; children:React.ReactNode }) => (
    <div style={{ ...gStyle, overflow:"hidden", marginBottom:14 }}>
      <button onClick={() => setOpen(open === id ? "" : id)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/10 transition-colors text-left"
        style={{ borderBottom: open === id ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
        <span className="font-semibold text-white text-sm">{title}</span>
        {open === id ? <ChevronUp className="w-4 h-4 text-white/50" /> : <ChevronDown className="w-4 h-4 text-white/50"/>}
      </button>
      {open === id && <div className="px-5 pb-5 pt-4">{children}</div>}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0A0510] text-white">

      {/* ══ STATIC BACKGROUND IMAGE ══════════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?q=80&w=2042&auto=format&fit=crop')" }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0510]/80 via-[#0A0510]/50 to-[#0A0510]/95" />
      </div>

      <div className="relative z-10 pt-10 px-6 max-w-3xl mx-auto">
        <button onClick={() => result ? reset() : router.push("/user-dashboard")}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md w-max">
          <ArrowLeft className="w-4 h-4" />{result ? "Analyze Another" : "Back to Dashboard"}
        </button>
      </div>

      <main className="relative z-10 max-w-3xl mx-auto px-6 pb-16">
        <AnimatePresence mode="wait">

          {!result && !loading && (
            <motion.div key="form" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }} transition={{ duration:0.4 }}>
              
              <div className="glass-panel border border-white/20 p-8 rounded-3xl bg-white/5 backdrop-blur-xl shadow-2xl">
                <div className="text-center pb-8">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4">
                    <FileSearch className="text-white w-6 h-6" />
                  </div>
                  <h1 className="text-4xl font-headline font-bold text-white mb-2 tracking-tight">ATS Resume Checker</h1>
                  <p className="text-sm text-white/60">Upload your PDF or paste your resume for instant AI analysis</p>
                </div>

                <div className="space-y-5">
                  <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background:"rgba(255,255,255,0.05)" }}>
                    {(["paste","upload"] as const).map(t => (
                      <button key={t} onClick={() => setTab(t)}
                        className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all"
                        style={tab === t ? { background:"rgba(255,255,255,0.15)", color:"#fff" } : { background:"transparent", color:"rgba(255,255,255,0.5)" }}>
                        {t === "paste" ? "📝 Paste Text" : "📄 Upload File"}
                      </button>
                    ))}
                  </div>

                  {tab === "paste" ? (
                    <div>
                      <label className="block text-sm mb-2 text-white/90">Resume Text <span className="text-red-400">*</span></label>
                      <textarea rows={10} className="resize-none font-mono text-sm focus:outline-none focus:border-white/40 transition-colors"
                        style={{ ...inStyle, color:"rgba(255,255,255,0.9)", lineHeight:1.7 }}
                        placeholder={"Paste your full resume text here...\n\nJohn Doe | john@email.com\n\nEXPERIENCE\nSoftware Engineer | Company | 2022-Present\n• Built REST APIs using Node.js\n\nEDUCATION\nB.Tech CS | University | 2022\n\nSKILLS\nPython, JavaScript, React, SQL..."}
                        value={resumeText} onChange={e => { setResumeText(e.target.value); setResumePdfBase64(""); }} />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm mb-2 text-white/90">Upload Resume (.pdf, .txt, or .md) <span className="text-red-400">*</span></label>
                      <div onClick={() => fileRef.current?.click()}
                        className="rounded-xl p-10 text-center cursor-pointer transition-all hover:bg-white/10"
                        style={{ border:"2px dashed rgba(255,255,255,0.3)", background:"rgba(255,255,255,0.05)" }}>
                        <Upload className="w-8 h-8 mx-auto mb-3 text-white/50" />
                        <p className="font-medium text-white text-sm">{fileName || "Click to upload your resume"}</p>
                        <p className="text-xs mt-1 text-white/40">Supports .pdf, .txt, .md files</p>
                        <input ref={fileRef} type="file" accept=".pdf,.txt,.md" onChange={handleFile} className="hidden"/>
                      </div>
                      {resumeText && <p className="text-sm mt-2 text-green-400">✓ Text loaded — {resumeText.split(" ").length} words</p>}
                      {resumePdfBase64 && <p className="text-sm mt-2 text-green-400">✓ PDF securely loaded for analysis</p>}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm mb-2 text-white/90">Job Description <span className="text-white/40 text-xs">(optional — improves accuracy)</span></label>
                    <textarea rows={4} className="resize-none text-sm focus:outline-none focus:border-white/40 transition-colors" style={{ ...inStyle, color:"rgba(255,255,255,0.9)" }}
                      placeholder="Paste the job description you're applying to..." value={jobDesc} onChange={e => setJobDesc(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-white/90">Target Role <span className="text-white/40 text-xs">(optional)</span></label>
                    <input className="focus:outline-none text-sm focus:border-white/40 transition-colors" style={{ ...inStyle, color:"rgba(255,255,255,0.9)" }}
                      placeholder="e.g. Full Stack Developer, Data Scientist" value={targetRole} onChange={e => setTargetRole(e.target.value)} />
                  </div>

                  {error && <p className="text-sm px-4 py-3 rounded-xl flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0"/>{error}
                  </p>}

                  <button onClick={analyze} disabled={!resumeText.trim() && !resumePdfBase64}
                    className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-40 bg-white/20 hover:bg-white/30 border border-white/30 shadow-lg mt-4">
                    <span className="w-2 h-2 rounded-full bg-white"/>
                    Analyze My Resume
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {loading && (
            <motion.div key="loading" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="flex flex-col items-center justify-center py-40 bg-[#0F0A15]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 rounded-full animate-spin border-2 border-transparent border-t-white" />
                <div className="absolute inset-2 rounded-full animate-spin border-2 border-transparent border-r-white/40" style={{ animationDuration:"1.5s" }}/>
                <Loader2 className="absolute inset-0 m-auto w-6 h-6 animate-pulse text-white"/>
              </div>
              <h2 className="text-2xl font-headline font-bold text-white mb-2">Analyzing Resume</h2>
              <p className="text-sm animate-pulse text-white/60">Deep ATS analysis in progress...</p>
              <p className="text-xs mt-1 text-white/40">This takes 15-25 seconds for a detailed report</p>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div key="result" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} className="space-y-4 pb-16 pt-2">
              {/* Scores */}
              <div style={{ ...gStyle, padding:28 }}>
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-2xl font-headline font-bold text-white">Analysis Results</h2>
                    {result.estimatedInterviewChance && <p className="text-sm mt-1 text-white/60">Estimated Interview Chance: <strong className="text-white">{result.estimatedInterviewChance}</strong></p>}
                  </div>
                  <button onClick={reset} className="text-sm px-4 py-2 rounded-xl transition-all hover:bg-white/10 border border-white/20 text-white font-medium">
                    New Analysis
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center justify-around gap-5 mb-8">
                  <Ring score={result.overallScore} label="Overall Score" large />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <Ring score={result.atsCompatibilityScore} label="ATS Compat." />
                    <Ring score={result.contentScore} label="Content" />
                    <Ring score={result.keywordScore} label="Keywords" />
                    <Ring score={result.formatScore} label="Format" />
                  </div>
                </div>

                <div style={{ background:sc(result.overallScore).bg, border:`1px solid ${sc(result.overallScore).border}`, borderRadius:16, padding:20 }}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                    <span className="font-bold text-lg" style={{ color:sc(result.overallScore).text }}>{result.verdict}</span>
                    <span className="hidden sm:inline" style={{ color:"rgba(255,255,255,0.2)" }}>|</span>
                    <span className="text-sm text-white/80 leading-relaxed">{result.summary}</span>
                  </div>
                  <p className="text-sm font-medium mt-3 pt-3 border-t border-white/10" style={{ color:"#fde68a" }}>
                    ⭐ <strong>Top Recommendation:</strong> {result.topRecommendation}
                  </p>
                </div>
                
                {result.industryFit && <p className="text-sm mt-4 text-white/60">🏢 <strong>Industry Fit:</strong> {result.industryFit}</p>}
              </div>

              {/* Section Analysis */}
              <Collapse id="sections" title="📊 Section-by-Section Analysis">
                <div className="space-y-6">
                  {result.sectionAnalysis?.map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-white">{s.section}</span>
                        <span className="text-sm font-bold" style={{ color:sc(s.score).text }}>{s.score}/100</span>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden mb-2 bg-white/10">
                        <div className="h-full rounded-full" style={{ width:`${s.score}%`, background:sc(s.score).bar, transition:"width 0.8s ease" }}/>
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">{s.feedback}</p>
                      {s.suggestion && <p className="text-sm mt-2 px-3 py-2 rounded-lg bg-white/5 text-white/80 border border-white/10">💡 {s.suggestion}</p>}
                    </div>
                  ))}
                </div>
              </Collapse>

              {/* Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.presentKeywords?.length > 0 && (
                  <div style={{ ...gStyle, padding:20 }}>
                    <h3 className="font-bold text-sm mb-4 text-white border-b border-white/10 pb-2">✅ Keywords Found</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.presentKeywords.map((k, i) => <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-300">{k}</span>)}
                    </div>
                  </div>
                )}
                {result.missingKeywords?.length > 0 && (
                  <div style={{ ...gStyle, padding:20 }}>
                    <h3 className="font-bold text-sm mb-4 text-white border-b border-white/10 pb-2">❌ Missing Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.map((k, i) => <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-300">{k}</span>)}
                    </div>
                  </div>
                )}
              </div>

              {/* Strengths */}
              {result.strengths?.length > 0 && (
                <div style={{ ...gStyle, padding:20 }}>
                  <h3 className="font-bold text-sm mb-4 text-white border-b border-white/10 pb-2">💪 Resume Strengths</h3>
                  <ul className="space-y-3">
                    {result.strengths.map((s, i) => <li key={i} className="flex gap-3 text-sm items-start text-white/80"><CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-400"/>{s}</li>)}
                  </ul>
                </div>
              )}

              {/* Issues */}
              <Collapse id="issues" title={`⚠️ Critical Issues (${result.criticalIssues?.length || 0})`}>
                <div className="space-y-4">
                  {result.criticalIssues?.map((issue, i) => (
                    <div key={i} className="rounded-xl p-5"
                      style={issue.priority === "High" ? { background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)" } : issue.priority === "Medium" ? { background:"rgba(234,179,8,0.1)", border:"1px solid rgba(234,179,8,0.2)" } : { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)" }}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                          style={issue.priority === "High" ? { background:"rgba(239,68,68,0.2)", color:"#fca5a5" } : issue.priority === "Medium" ? { background:"rgba(234,179,8,0.2)", color:"#fde68a" } : { background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.8)" }}>
                          {issue.priority}
                        </span>
                        <span className="text-base font-bold text-white">{issue.issue}</span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed mb-3">{issue.description}</p>
                      {issue.fix && <p className="text-sm px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/90"><strong>Fix:</strong> {issue.fix}</p>}
                    </div>
                  ))}
                </div>
              </Collapse>

              {/* Improvements */}
              <Collapse id="improvements" title="🚀 Improvement Suggestions">
                <div className="space-y-4">
                  {result.improvements?.map((imp, i) => (
                    <div key={i} className="rounded-xl p-5 bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm font-bold text-white uppercase tracking-wider">{imp.area}</p>
                        {imp.priority && <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">{imp.priority}</span>}
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed">{imp.suggestion}</p>
                      {imp.example && <p className="text-sm mt-3 px-4 py-3 rounded-lg font-mono bg-black/30 border border-white/5 text-white/60">{imp.example}</p>}
                    </div>
                  ))}
                </div>
              </Collapse>

              {/* Rewrite Suggestions */}
              {result.rewriteSuggestions && result.rewriteSuggestions.length > 0 && (
                <Collapse id="rewrites" title="✍️ Bullet Point Rewrites">
                  <div className="space-y-6">
                    {result.rewriteSuggestions.map((r, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
                        <div className="px-5 py-4 bg-red-500/10 border-b border-white/5">
                          <p className="text-xs text-red-300 font-bold tracking-wider mb-1">BEFORE</p>
                          <p className="text-sm text-white/80">{r.original}</p>
                        </div>
                        <div className="px-5 py-4 bg-green-500/10">
                          <p className="text-xs text-green-300 font-bold tracking-wider mb-1">AFTER</p>
                          <p className="text-sm font-medium text-green-100">{r.improved}</p>
                          <p className="text-xs mt-3 text-white/50 border-t border-white/5 pt-3"><strong>Why it's better:</strong> {r.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Collapse>
              )}

              {/* Footer grids for minor issues */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.quantificationOpportunities && result.quantificationOpportunities.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-sm mb-4 text-white border-b border-white/10 pb-2">📈 Add Metrics Here</h3>
                    <ul className="space-y-3">
                      {result.quantificationOpportunities.map((q, i) => <li key={i} className="text-sm text-white/70 flex gap-2"><span className="text-white/40">→</span> {q}</li>)}
                    </ul>
                  </div>
                )}

                {result.formattingIssues?.length > 0 && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
                    <h3 className="font-bold text-sm mb-4 text-orange-200 border-b border-orange-500/20 pb-2">📐 Formatting Checks</h3>
                    <ul className="space-y-3">
                      {result.formattingIssues.map((f, i) => <li key={i} className="flex gap-3 items-start text-sm text-orange-100"><AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-orange-300"/>{f}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              {/* Next Steps */}
              {result.nextSteps && result.nextSteps.length > 0 && (
                <div style={{ ...gStyle, padding:24, marginTop:16 }}>
                  <h3 className="font-bold text-lg mb-4 text-white">🎯 Action Plan</h3>
                  <ol className="space-y-4">
                    {result.nextSteps.map((s, i) => (
                      <li key={i} className="flex gap-4 text-sm text-white/90 items-center bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold bg-white/10 text-white">{i+1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="flex justify-center pt-8">
                <button onClick={reset} className="px-10 py-4 rounded-xl text-white font-bold transition-all bg-white/20 hover:bg-white/30 border border-white/30 shadow-lg flex items-center gap-2">
                  <Upload className="w-5 h-5"/> Check Another Resume
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}