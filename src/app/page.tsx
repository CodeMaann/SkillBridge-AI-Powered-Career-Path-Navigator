"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowDown, LogIn, Map, FileSearch, TrendingUp, Menu, X,
  Zap, BarChart3, Shield, Sparkles, ArrowRight,
  CheckCircle, Clock, Award, ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";

// NAV_LINKS
const NAV_LINKS = [
  { label: "Resume Builder",    href: "/resume-builder",    external: true  },
  { label: "How It Works",      href: "#how",               external: false },
  { label: "Roadmap Generator", href: "/roadmap-generator", external: true  },
  { label: "ATS Checker",       href: "/ats-checker",       external: true  },
  { label: "Market Trends",     href: "/market-trends",     external: true  },
];

export default function SkillBridgeLanding() {
  const router    = useRouter();
  const [scrolled,       setScrolled]       = useState(false);
  const [menuOpen,       setMenuOpen]       = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNav = (href: string, external: boolean) => {
    setMenuOpen(false);
    if (external) { router.push(href); return; }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative bg-[#0A0510] min-h-screen">

      {/* ══ STATIC BACKGROUND IMAGE (VIBRANT TEAL LAKE & MOUNTAINS) ══════════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop')" }} 
        />
        {/* Balanced overlay: keeps the daytime colors vibrant while ensuring your white glassmorphism stays perfectly readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0510]/70 via-[#0A0510]/30 to-[#0A0510]/90" />
      </div>

      {/* ══ NAVIGATION ══════════════════════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-[#0A0510]/85 backdrop-blur-xl border-b border-white/5"
          : "py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-headline font-bold text-xl text-white tracking-tight flex-shrink-0"
          >
            SkillBridge
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => handleNav(link.href, link.external)}
                className="text-white/80 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-white/10"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/login")}
              className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-all"
            >
              <LogIn className="w-4 h-4" /> Login / Get Started
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden bg-white/10 border border-white/20 text-white p-2 rounded-full"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-0 right-0 bg-[#0A0510]/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 space-y-1"
            >
              {NAV_LINKS.map(link => (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.href, link.external)}
                  className="w-full text-left text-white/70 hover:text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/5 transition-all"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => router.push("/login")}
                className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl text-sm font-medium mt-2"
              >
                <LogIn className="w-4 h-4" /> Login / Get Started
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══ CONTENT SECTIONS ════════════════════════════════════════════════ */}
      <div className="relative z-10">
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
          <div className="max-w-4xl text-center space-y-8">
            <h1 className="text-7xl md:text-9xl font-headline font-extrabold tracking-tighter text-white">
              Bridge the <br />
              <span className="text-primary purple-glow">Career Path</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
              Navigate your professional trajectory with high-fidelity <br /> skill-gap visualization.
            </p>
            <div className="pt-12 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
                <ArrowDown className="text-white/80 w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/60">Scroll to Explore</span>
            </div>
          </div>
        </section>

        {/* Quick-access tool strip */}
        <div
          className="relative z-10 border-y border-white/5"
          style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)" }}
        >
          <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="text-white/60 text-[10px] uppercase tracking-[0.25em] font-bold">Jump to</span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { label: "AI Roadmap",        icon: Map,        href: "/roadmap-generator", ext: true,  color: "#93c5fd" },
                { label: "ATS Checker",       icon: FileSearch, href: "/ats-checker",       ext: true,  color: "#c4b5fd" },
                { label: "Resume Builder",    icon: Sparkles,   href: "/resume-builder",    ext: true,  color: "#fde68a" },
                { label: "Market Trends",     icon: TrendingUp, href: "/market-trends",     ext: true,  color: "#86efac" },
              ].map(tool => (
                <button
                  key={tool.label}
                  onClick={() => handleNav(tool.href, tool.ext)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 hover:brightness-125"
                  style={{ background: tool.color + "1a", border: `1px solid ${tool.color}4d`, color: tool.color }}
                >
                  <tool.icon className="w-4 h-4" />
                  {tool.label}
                  <ChevronRight className="w-3 h-3 opacity-60" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Three Questions */}
        <section className="relative z-10 py-28 px-6 overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(147,51,234,0.1) 0%, transparent 70%)" }}
          />
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-white/50 mb-4">The Foundation</p>
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter mb-5">
                Three Questions. <span className="text-primary purple-glow">One Platform.</span>
              </h2>
              <p className="text-white/60 max-w-xl mx-auto leading-relaxed text-sm">
                SkillBridge answers the questions every student and professional asks — with AI precision and real-time market data.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { num:"01", q:"Where am I now?",            a:"AI extracts your skills from your resume or LinkedIn and benchmarks them against real market demand using transformer-based NER with 92% accuracy.",           icon:"🔍", accent:"#93c5fd" },
                { num:"02", q:"Where can I thrive?",        a:"Our gradient-boosted role-matching model maps your unique skill set to hundreds of roles, factoring in supply-demand ratios, salary data, and your personal goals.",  icon:"🎯", accent:"#c4b5fd" },
                { num:"03", q:"How do I get there fastest?", a:"A reinforcement-learning agent sequences the optimal courses, projects, and certifications to maximize your career-value reward — updated weekly as markets shift.", icon:"🚀", accent:"#86efac" },
              ].map(card => (
                <div key={card.num} className="glass-panel silver-border rounded-2xl p-7 hover:bg-white/[0.07] transition-all duration-300">
                  <div className="flex items-start justify-between mb-5">
                    <span className="text-3xl">{card.icon}</span>
                    <span className="text-[10px] font-bold tracking-widest" style={{ color: card.accent + "99" }}>{card.num}</span>
                  </div>
                  <h3 className="text-lg font-headline font-bold text-white mb-3 tracking-tight">{card.q}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{card.a}</p>
                  <div className="mt-5 h-px" style={{ background: `linear-gradient(to right, ${card.accent}33, transparent)` }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <div className="relative z-10 border-y border-white/5" style={{ background: "rgba(147,51,234,0.06)" }}>
          <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "92%",    label: "Skill Extraction Accuracy",    icon: Award  },
              { value: "<200ms", label: "API Response Time",            icon: Zap    },
              { value: "50K+",   label: "ATS Outcomes Trained On",      icon: Shield },
              { value: "~3 min", label: "Career Discovery Time",        icon: Clock  },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <stat.icon className="w-5 h-5 text-primary mb-3 opacity-90" />
                <span className="text-3xl md:text-4xl font-headline font-extrabold text-white tracking-tighter">{stat.value}</span>
                <span className="text-white/60 text-xs mt-2 leading-snug max-w-[120px]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <section id="features" className="relative z-10 py-28 px-6 overflow-hidden">
          <div
            className="absolute bottom-0 right-0 w-[600px] h-[600px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)" }}
          />
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-white/50 mb-4">Platform Capabilities</p>
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter mb-5">
                Everything You Need to <span className="text-accent">Navigate Your Career</span>
              </h2>
              <p className="text-white/60 max-w-xl mx-auto leading-relaxed text-sm">
                Five intelligent modules working together to compress the career-discovery cycle from months to minutes.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon:Zap,        title:"AI Skill Gap Analyzer",    badge:"Core Feature", color:"#93c5fd", action:null,                desc:"Transformer-based NER extracts your skills from resumes or LinkedIn and benchmarks them against role-specific competency matrices in real time." },
                { icon:Map,        title:"Dynamic Roadmap Generator",badge:"Try It Now",   color:"#c4b5fd", action:"/roadmap-generator", desc:"A reinforcement-learning agent sequences courses, projects, and certifications for maximum ROI — updating weekly as market data shifts." },
                { icon:BarChart3,  title:"Real-Time Market Dashboard",badge:"Live Data",  color:"#86efac", action:"/market-trends",     desc:"Visualize trending roles, live salary ranges, and regional demand across industries. Know where the market is heading before it gets there." },
                { icon:FileSearch, title:"ATS Resume Optimizer",     badge:"Try It Now",  color:"#fda4af", action:"/ats-checker",       desc:"Trained on 50,000+ anonymized ATS outcomes, the model predicts your resume's percentile rank and surfaces the exact keywords you're missing." },
                { icon:Sparkles,   title:"Adaptive Onboarding",      badge:"Smart UX",    color:"#fde68a", action:null,                desc:"A dialog-style Q&A that adjusts depth based on your familiarity — 8–12 smart questions replace hours of form fatigue to build your personalized baseline." },
                { icon:Sparkles,   title:"AI Resume Builder",        badge:"Try It Now",  color:"#a5f3fc", action:"/resume-builder",    desc:"Craft a professional, ATS-optimized resume from scratch. Let the AI format, quantify, and polish your raw experience into a hiring-ready document." },
              ].map(feat => (
                <div
                  key={feat.title}
                  className="glass-panel silver-border rounded-2xl p-6 group hover:bg-white/[0.07] transition-all duration-300 relative flex flex-col"
                  style={{ cursor: feat.action ? "pointer" : "default" }}
                  onClick={() => feat.action && router.push(feat.action)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-xl" style={{ background: feat.color + "18", border: `1px solid ${feat.color}30` }}>
                      <feat.icon className="w-5 h-5" style={{ color: feat.color }} />
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{ background: feat.color + "15", color: feat.color, border: `1px solid ${feat.color}25` }}
                    >
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="font-headline font-bold text-white text-base mb-2 tracking-tight">{feat.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed flex-1">{feat.desc}</p>
                  {feat.action && (
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-medium" style={{ color: feat.color }}>
                      Open Tool <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how" className="relative z-10 py-28 px-6 overflow-hidden" style={{ background: "rgba(255,255,255,0.015)" }}>
          <div
            className="absolute top-0 left-1/4 w-[500px] h-[400px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(147,51,234,0.08) 0%, transparent 70%)" }}
          />
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-white/50 mb-4">The Journey</p>
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter mb-5">
                From Zero to Career-Ready <br /><span className="text-primary purple-glow">in 6 Simple Steps</span>
              </h2>
            </div>
            <div className="relative">
              <div
                className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(147,51,234,0.3), rgba(147,51,234,0.3), transparent)" }}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                  { step:"01", title:"Sign Up",       desc:"OAuth via Google or GitHub. Frictionless entry — your profile generates in seconds.",             accent:"text-primary"  },
                  { step:"02", title:"Onboarding",    desc:"Answer 8–12 adaptive questions. The system captures your goals, skills, and constraints.",         accent:"text-primary"  },
                  { step:"03", title:"Resume Upload", desc:"Drag & drop your PDF. AI parses skills and experience to instantly enrich your profile.",           accent:"text-primary"  },
                ].map(s => (
                  <div key={s.step} className="flex flex-col items-center text-center z-10">
                    <div className="w-20 h-20 rounded-full glass-panel silver-border flex items-center justify-center mb-5 shadow-lg">
                      <span className={`${s.accent} font-headline font-bold text-lg`}>{s.step}</span>
                    </div>
                    <h3 className="font-headline font-bold text-white mb-2 tracking-tight">{s.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed max-w-[200px] font-medium">{s.desc}</p>
                  </div>
                ))}
              </div>
              <div
                className="hidden md:block absolute bottom-10 left-[10%] right-[10%] h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(99,102,241,0.5), rgba(99,102,241,0.5), transparent)" }}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 z-10 relative">
                {[
                  { step:"04", title:"Dashboard", desc:"View your role-match fit-score heatmap. See exactly where you stand against hundreds of careers.",    accent:"text-accent" },
                  { step:"05", title:"Roadmap",   desc:"Click 'View Path' to receive your AI-generated step-by-step learning plan with resources and timelines.", accent:"text-accent" },
                  { step:"06", title:"Iterate",   desc:"Mark tasks complete. The system recomputes recommendations as you grow — continuous, adaptive guidance.", accent:"text-accent" },
                ].map(s => (
                  <div key={s.step} className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full glass-panel silver-border flex items-center justify-center mb-5 shadow-lg">
                      <span className={`${s.accent} font-headline font-bold text-lg`}>{s.step}</span>
                    </div>
                    <h3 className="font-headline font-bold text-white mb-2 tracking-tight">{s.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed max-w-[200px] font-medium">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Market Opportunity */}
        <section id="market" className="relative z-10 py-28 px-6 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.08) 0%, transparent 60%)" }}
          />
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-white/50 mb-4">Market Opportunity</p>
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter mb-6">
                A <span className="text-primary purple-glow">$65 Billion</span><br />Market by 2028
              </h2>
              <p className="text-white/80 font-medium leading-relaxed mb-8 text-sm">
                The global ed-tech and career-navigation segment is underserved by outdated tools. SkillBridge is the first AI-native platform to close the gap between individual learning and dynamic employer demand.
              </p>
              <div className="space-y-4">
                {[
                  { label:"Live Labor Data",           sub:"vs. annual reports used by incumbents"      },
                  { label:"Full-Stack Personalization", sub:"skills, goals, and constraints combined"   },
                  { label:"Resume-to-Roadmap Loop",    sub:"tightest feedback cycle in the market"     },
                  { label:"Daily Market Updates",      sub:"vs. monthly or quarterly for competitors"  },
                ].map(pt => (
                  <div key={pt.label} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-white text-sm font-bold">{pt.label}</span>
                      <span className="text-white/70 text-sm font-medium"> — {pt.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitive table */}
            <div className="glass-panel silver-border rounded-2xl overflow-hidden shadow-2xl">
              <div className="px-5 py-4 border-b border-white/10">
                <span className="text-white/50 text-xs uppercase tracking-wider font-bold">Competitive Snapshot</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                    {["Platform","Personalization","Live Data","ATS Score"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-white/40 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name:"LinkedIn Learning", p:"Medium", d:"Monthly",   a:"✗",     hi:false },
                    { name:"Pathrise",          p:"High",   d:"Weekly",    a:"Manual", hi:false },
                    { name:"ReSkillium",        p:"Low",    d:"Quarterly", a:"✗",     hi:false },
                    { name:"SkillBridge",       p:"High",   d:"Daily",     a:"✓ AI",  hi:true  },
                  ].map(row => (
                    <tr
                      key={row.name}
                      className="border-t border-white/5"
                      style={row.hi ? { background: "rgba(147,51,234,0.08)" } : {}}
                    >
                      <td className="px-4 py-3">
                        <span className={`font-bold ${row.hi ? "text-primary" : "text-white"}`}>{row.name}</span>
                        {row.hi && <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded-full bg-primary/30 text-white font-bold uppercase tracking-wide">You</span>}
                      </td>
                      <td className={`px-4 py-3 font-medium ${row.hi ? "text-white" : "text-white/70"}`}>{row.p}</td>
                      <td className={`px-4 py-3 font-medium ${row.hi ? "text-primary" : "text-white/70"}`}>{row.d}</td>
                      <td className={`px-4 py-3 font-bold ${row.hi ? "text-primary" : row.a === "✗" ? "text-white/40" : "text-white/80"}`}>{row.a}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="relative z-10 py-20 px-6 overflow-hidden" style={{ background: "rgba(255,255,255,0.015)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-white/50 mb-4">Built By</p>
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-white tracking-tighter">
                The Creator Behind <span className="text-accent">SkillBridge</span>
              </h2>
            </div>
            <div className="flex justify-center">
              {[
                { name:"Maneesh Kumar", role:"Founder & Lead Developer", super_:"Full-Stack Engineering & AI Architecture", emoji:"👨‍💻" },
              ].map(m => (
                <div key={m.name} className="w-full max-w-sm glass-panel silver-border rounded-2xl p-8 text-center hover:bg-white/[0.07] transition-all">
                  <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center mx-auto mb-4 text-2xl">{m.emoji}</div>
                  <p className="font-headline font-bold text-white text-lg">{m.name}</p>
                  <p className="text-primary text-sm mt-1 mb-3 font-medium">{m.role}</p>
                  <p className="text-white/80 text-sm leading-snug font-medium">{m.super_}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 py-32 px-6 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(147,51,234,0.12) 0%, transparent 65%)" }}
          />
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-white/50 mb-6">Get Started</p>
            <h2 className="text-5xl md:text-6xl font-headline font-extrabold text-white tracking-tighter mb-6">
              Your Career,<br /><span className="text-primary purple-glow">Mapped in Minutes.</span>
            </h2>
            <p className="text-white/90 text-lg leading-relaxed mb-10 max-w-xl mx-auto font-medium">
              Stop guessing. Join SkillBridge and get an AI-powered roadmap from where you are today to where you want to be.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20">
              <button
                onClick={() => router.push("/login")}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white tracking-wide transition-all hover:scale-105 w-full sm:w-auto"
                style={{ background: "linear-gradient(135deg, hsl(270,70%,60%), hsl(240,60%,65%))", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <Sparkles className="w-4 h-4" />
                Start for Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push("/roadmap-generator")}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white transition-all glass-panel hover:bg-white/10 border border-white/20 shadow-xl w-full sm:w-auto"
              >
                <Map className="w-4 h-4" />
                Try Roadmap Generator
              </button>
            </div>
            <p className="text-white/60 text-xs mt-8 font-bold">No credit card required · Free tier available</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/20 bg-[#0A0510]/80 backdrop-blur-xl pt-20 pb-10">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              <div className="col-span-2 md:col-span-1">
                <p className="font-headline font-bold text-white text-lg mb-3 tracking-tight">SkillBridge</p>
                <p className="text-white/70 text-sm leading-relaxed max-w-[180px] font-medium">AI-powered career path navigation for the modern professional.</p>
              </div>
              {[
                { heading:"Platform",  links:[
                  { name: "Roadmap Generator", route: "/roadmap-generator" },
                  { name: "ATS Checker", route: "/ats-checker" },
                  { name: "Resume Builder", route: "/resume-builder" },
                  { name: "Dashboard", route: "/dashboard" }
                ]},
                { heading:"Company",   links:[
                  { name: "About", route: "#" },
                  { name: "Creator", route: "#team" },
                  { name: "Blog", route: "#" }
                ]},
                { heading:"Resources", links:[
                  { name: "Documentation", route: "#" },
                  { name: "API", route: "#" },
                  { name: "Contact", route: "#" }
                ]},
              ].map(col => (
                <div key={col.heading}>
                  <p className="text-white/70 text-xs uppercase tracking-widest font-bold mb-4">{col.heading}</p>
                  <ul className="space-y-2.5">
                    {col.links.map(l => (
                      <li key={l.name}>
                        <button 
                          onClick={() => {
                            if (l.route.startsWith("#")) {
                              document.querySelector(l.route)?.scrollIntoView({ behavior: "smooth" });
                            } else {
                              router.push(l.route);
                            }
                          }} 
                          className="text-white/60 hover:text-white text-sm font-medium transition-colors text-left"
                        >
                          {l.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase">SkillBridge © 2026</p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}