"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Globe, MapPin, Briefcase, Award, Zap, Users, Clock } from "lucide-react";

// ── Static market data (research-based, 2025-26) ─────────────────────────────
const TOP_ROLES = [
  { rank:1,  title:"AI/ML Engineer",          demand:"🔥 Explosive", yoy:"+68%", salaryIN:"18-55 LPA",  salaryGlobal:"$120k-$200k", skills:["Python","PyTorch","LLMs","MLOps"],       trend:"up",   openings:"45,000+",  difficulty:"High"   },
  { rank:2,  title:"Full Stack Developer",     demand:"🚀 Very High", yoy:"+32%", salaryIN:"8-35 LPA",   salaryGlobal:"$80k-$150k",  skills:["React","Node.js","TypeScript","AWS"],   trend:"up",   openings:"180,000+", difficulty:"Medium" },
  { rank:3,  title:"DevOps / SRE Engineer",    demand:"🚀 Very High", yoy:"+41%", salaryIN:"12-45 LPA",  salaryGlobal:"$100k-$170k", skills:["Kubernetes","Docker","CI/CD","Terraform"], trend:"up", openings:"52,000+",  difficulty:"High"   },
  { rank:4,  title:"Data Scientist",           demand:"📈 High",      yoy:"+29%", salaryIN:"10-40 LPA",  salaryGlobal:"$95k-$160k",  skills:["Python","SQL","Statistics","Spark"],   trend:"up",   openings:"38,000+",  difficulty:"High"   },
  { rank:5,  title:"Cloud Architect",          demand:"📈 High",      yoy:"+37%", salaryIN:"20-65 LPA",  salaryGlobal:"$130k-$220k", skills:["AWS","Azure","GCP","Microservices"],    trend:"up",   openings:"28,000+",  difficulty:"High"   },
  { rank:6,  title:"Cybersecurity Analyst",    demand:"📈 High",      yoy:"+44%", salaryIN:"10-38 LPA",  salaryGlobal:"$90k-$150k",  skills:["SIEM","Pen Testing","ISO 27001","SAST"], trend:"up", openings:"35,000+",  difficulty:"High"   },
  { rank:7,  title:"Product Manager (Tech)",   demand:"📊 Steady",    yoy:"+18%", salaryIN:"15-50 LPA",  salaryGlobal:"$100k-$180k", skills:["Roadmapping","Agile","Analytics","SQL"], trend:"up", openings:"22,000+",  difficulty:"High"   },
  { rank:8,  title:"Frontend Developer",       demand:"📊 Steady",    yoy:"+22%", salaryIN:"6-28 LPA",   salaryGlobal:"$70k-$130k",  skills:["React","Next.js","CSS","Testing"],     trend:"up",   openings:"95,000+",  difficulty:"Medium" },
  { rank:9,  title:"Data Engineer",            demand:"📈 High",      yoy:"+35%", salaryIN:"12-42 LPA",  salaryGlobal:"$100k-$160k", skills:["Spark","Kafka","Airflow","dbt"],        trend:"up",   openings:"31,000+",  difficulty:"High"   },
  { rank:10, title:"Blockchain Developer",     demand:"📉 Volatile",  yoy:"-8%",  salaryIN:"12-50 LPA",  salaryGlobal:"$100k-$180k", skills:["Solidity","Web3","Smart Contracts"],   trend:"down", openings:"8,000+",   difficulty:"High"   },
  { rank:11, title:"UI/UX Designer",           demand:"📊 Steady",    yoy:"+15%", salaryIN:"5-22 LPA",   salaryGlobal:"$65k-$120k",  skills:["Figma","Research","Prototyping"],       trend:"up",   openings:"42,000+",  difficulty:"Medium" },
  { rank:12, title:"Prompt Engineer",          demand:"🔥 Explosive", yoy:"+120%", salaryIN:"8-30 LPA",  salaryGlobal:"$75k-$140k",  skills:["LLMs","Python","Chain-of-Thought"],     trend:"up",   openings:"15,000+",  difficulty:"Medium" },
];

const SKILL_TRENDS = [
  { skill:"Large Language Models (LLMs)", category:"AI",       growth:"+145%", hotness:98, color:"#ffffff" },
  { skill:"Kubernetes & Container Orch.", category:"DevOps",   growth:"+67%",  hotness:88, color:"#ffffff" },
  { skill:"Rust Programming",            category:"Systems",   growth:"+82%",  hotness:85, color:"#ffffff" },
  { skill:"TypeScript",                  category:"Frontend",  growth:"+54%",  hotness:90, color:"#ffffff" },
  { skill:"Apache Kafka",                category:"Data",      growth:"+48%",  hotness:80, color:"#ffffff" },
  { skill:"MLOps / LLMOps",             category:"AI",        growth:"+112%", hotness:92, color:"#ffffff" },
  { skill:"Terraform / IaC",             category:"DevOps",    growth:"+61%",  hotness:84, color:"#ffffff" },
  { skill:"Next.js / React Server Comp.",category:"Frontend",  growth:"+71%",  hotness:87, color:"#ffffff" },
  { skill:"Vector Databases",            category:"AI/Data",   growth:"+200%", hotness:95, color:"#ffffff" },
  { skill:"dbt (Data Build Tool)",       category:"Data",      growth:"+88%",  hotness:79, color:"#ffffff" },
  { skill:"Golang",                      category:"Backend",   growth:"+45%",  hotness:78, color:"#ffffff" },
  { skill:"Cybersecurity / Zero Trust",  category:"Security",  growth:"+55%",  hotness:82, color:"#ffffff" },
  { skill:"GraphQL & REST APIs",         category:"Backend",   growth:"+38%",  hotness:75, color:"#ffffff" },
  { skill:"Prompt Engineering",          category:"AI",        growth:"+320%", hotness:89, color:"#ffffff" },
];

const DECLINING = [
  { skill:"PHP (standalone)",           drop:"-34%", reason:"Replaced by modern full-stack frameworks" },
  { skill:"jQuery",                     drop:"-41%", reason:"Superseded by React, Vue, Angular" },
  { skill:"Manual QA Testing",          drop:"-28%", reason:"Automated testing, AI-powered QA" },
  { skill:"Hadoop MapReduce",           drop:"-52%", reason:"Spark and cloud-native pipelines dominate" },
  { skill:"Flash/ActionScript",         drop:"-95%", reason:"Fully discontinued" },
  { skill:"COBOL",                      drop:"-19%", reason:"Legacy maintenance only, no growth" },
];

const REGIONS = [
  { city:"Bengaluru",  country:"India",     avgSalary:"18-45 LPA",  growth:"+28%", hotRoles:["ML Engineer","SWE","Data Scientist"],    jobs:"85,000+", badge:"🏆 India's Silicon Valley" },
  { city:"Hyderabad",  country:"India",     avgSalary:"12-38 LPA",  growth:"+24%", hotRoles:["Cloud Architect","DevOps","Full Stack"],  jobs:"52,000+", badge:"📈 Fast Growing" },
  { city:"Pune",       country:"India",     avgSalary:"10-30 LPA",  growth:"+19%", hotRoles:["DevOps","QA","Data Engineer"],            jobs:"38,000+", badge:"🎓 College Hub" },
  { city:"Delhi NCR",  country:"India",     avgSalary:"12-40 LPA",  growth:"+22%", hotRoles:["PM","Full Stack","Cybersecurity"],        jobs:"48,000+", badge:"🏙️ Product Capital" },
  { city:"San Francisco", country:"USA",    avgSalary:"$130k-220k", growth:"+15%", hotRoles:["AI/ML","SWE","Cloud Architect"],          jobs:"120,000+", badge:"🌉 Tech Epicenter" },
  { city:"Remote / Global", country:"WFH", avgSalary:"$70k-$160k", growth:"+45%", hotRoles:["Full Stack","DevOps","Product Manager"],   jobs:"300,000+", badge:"🌐 Largest Pool" },
];

const CERTS = [
  { name:"AWS Solutions Architect",     provider:"Amazon",    cost:"~$300",  roi:"High",   salaryLift:"+20%",  time:"2-3 months", color:"#ffffff" },
  { name:"Google Cloud Professional",   provider:"Google",    cost:"~$200",  roi:"High",   salaryLift:"+18%",  time:"2-3 months", color:"#ffffff" },
  { name:"Kubernetes (CKA/CKAD)",       provider:"CNCF",      cost:"~$395",  roi:"High",   salaryLift:"+22%",  time:"3-4 months", color:"#ffffff" },
  { name:"TensorFlow Developer Cert.",  provider:"Google",    cost:"Free",   roi:"Medium", salaryLift:"+12%",  time:"1-2 months", color:"#ffffff" },
  { name:"Certified Ethical Hacker",    provider:"EC-Council",cost:"~$1,199",roi:"High",   salaryLift:"+25%",  time:"3-6 months", color:"#ffffff" },
  { name:"PMP Certification",           provider:"PMI",       cost:"~$555",  roi:"Medium", salaryLift:"+15%",  time:"4-6 months", color:"#ffffff" },
  { name:"Microsoft Azure Fundamentals",provider:"Microsoft", cost:"~$165",  roi:"Medium", salaryLift:"+10%",  time:"4-6 weeks",  color:"#ffffff" },
  { name:"Meta React Developer",        provider:"Meta/Coursera",cost:"~$50/mo",roi:"Medium",salaryLift:"+8%", time:"6-8 months", color:"#ffffff" },
];

const MARKET_STATS = [
  { label:"Tech jobs added globally in 2025",   value:"3.2M+",  icon:Briefcase,  color:"#ffffff" },
  { label:"AI-related roles growth YoY",         value:"+68%",   icon:TrendingUp, color:"#ffffff" },
  { label:"Average time to hire (tech)",         value:"34 days",icon:Clock,      color:"#ffffff" },
  { label:"Remote tech job share",               value:"41%",    icon:Globe,      color:"#ffffff" },
  { label:"Avg salary premium for AI skills",    value:"+42%",   icon:Zap,        color:"#ffffff" },
  { label:"Unfilled cybersecurity roles globally",value:"4M+",   icon:Users,      color:"#ffffff" },
];

const SALARY_PROGRESSION = [
  { level:"Fresher (0-1 yr)",   india:"3-6 LPA",   global:"$55k-75k",  symbol:"🌱" },
  { level:"Junior (1-3 yrs)",   india:"6-14 LPA",  global:"$75k-110k", symbol:"📈" },
  { level:"Mid-Level (3-6 yrs)",india:"14-30 LPA", global:"$110k-150k",symbol:"🚀" },
  { level:"Senior (6-10 yrs)",  india:"30-60 LPA", global:"$150k-200k",symbol:"⭐" },
  { level:"Lead / Architect",   india:"50-120 LPA",global:"$180k-280k",symbol:"👑" },
  { level:"Principal / Staff",  india:"80-200+ LPA",global:"$220k-400k",symbol:"🏆" },
];

export default function MarketTrends() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"roles"|"skills"|"regions"|"certs"|"salary">("roles");

  const glass = { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.2)", backdropFilter:"blur(24px)" as any, borderRadius:24 };

  const trendIcon = (t: string) =>
    t === "up"   ? <TrendingUp  className="w-3.5 h-3.5" style={{ color:"#86efac" }} /> :
    t === "down" ? <TrendingDown className="w-3.5 h-3.5" style={{ color:"#fca5a5" }} /> :
                   <Minus        className="w-3.5 h-3.5" style={{ color:"#fde68a" }} />;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0A0510] text-white">

      {/* ══ STATIC BACKGROUND IMAGE ══════════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop')" }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0510]/80 via-[#0A0510]/50 to-[#0A0510]/95" />
      </div>

      {/* Nav */}
      <div className="relative z-10 pt-10 px-6 max-w-6xl mx-auto">
        <button onClick={() => router.push("/")}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md w-max">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-20">

        {/* Header */}
        <div className="text-center pt-10 pb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5 bg-white/10 border border-white/20 text-white">
            📊 Live Market Intelligence · Updated 2025-26
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-white mb-3 tracking-tight">Tech Career Market Trends</h1>
          <p className="text-sm max-w-xl mx-auto text-white/60">
            Real-time insights into job demand, salary ranges, skill trends, and regional hotspots for tech careers globally.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {MARKET_STATS.map((s, i) => (
            <div key={i} style={{ ...glass, padding:16 }} className="text-center shadow-xl hover:bg-white/5 transition-colors">
              <s.icon className="w-5 h-5 mx-auto mb-2 text-white"/>
              <p className="text-xl font-headline font-bold text-white tracking-tight">{s.value}</p>
              <p className="text-xs mt-1 leading-snug text-white/50">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          {([
            { id:"roles",  label:"🔥 Hot Roles",       },
            { id:"skills", label:"⚡ Skill Trends",     },
            { id:"regions",label:"🗺️ Top Regions",      },
            { id:"certs",  label:"🏆 Certifications",   },
            { id:"salary", label:"💰 Salary Guide",     },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none"
              style={activeTab === t.id
                ? { background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.4)", color:"#fff", boxShadow:"0 4px 15px rgba(0,0,0,0.1)" }
                : { background:"transparent", color:"rgba(255,255,255,0.5)" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── HOT ROLES ── */}
        {activeTab === "roles" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-headline font-bold text-white">Most In-Demand Roles (2025-26)</h2>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white">12 roles ranked</span>
            </div>
            <div className="space-y-3">
              {TOP_ROLES.map((r) => (
                <div key={r.rank} style={{ ...glass, padding:20 }} className="hover:bg-white/10 transition-colors shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-2xl font-headline font-bold w-8 text-center flex-shrink-0 text-white/30">
                        {String(r.rank).padStart(2,"0")}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-white text-base">{r.title}</h3>
                          {trendIcon(r.trend)}
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-white/10 text-white/80 border border-white/10">{r.demand}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {r.skills.map((s, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-md font-medium bg-white/5 border border-white/10 text-white/70">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-center flex-shrink-0">
                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-0.5">YoY</p>
                        <p className="text-sm font-bold" style={{ color: r.trend === "up" ? "#86efac" : "#fca5a5" }}>{r.yoy}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-0.5">India</p>
                        <p className="text-xs font-bold text-white">{r.salaryIN}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-0.5">Global</p>
                        <p className="text-xs font-bold text-white/80">{r.salaryGlobal}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-0.5">Openings</p>
                        <p className="text-xs font-bold text-white">{r.openings}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SKILL TRENDS ── */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-headline font-bold text-white mb-4">🚀 Fast-Growing Skills (2025-26)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SKILL_TRENDS.map((s, i) => (
                  <div key={i} style={{ ...glass, padding:18 }} className="shadow-xl">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-bold text-white text-sm">{s.skill}</p>
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mt-1.5 inline-block bg-white/10 text-white/70">{s.category}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm text-green-300">{s.growth}</p>
                        <p className="text-xs text-white/40 font-medium">demand growth</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/10">
                        <div className="h-full rounded-full transition-all duration-1000 bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width:`${s.hotness}%` }}/>
                      </div>
                      <span className="text-xs font-bold flex-shrink-0 text-white">{s.hotness}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-headline font-bold text-white mb-4">📉 Declining Skills to Deprioritize</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {DECLINING.map((d, i) => (
                  <div key={i} className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-white text-sm">{d.skill}</p>
                      <span className="font-bold text-sm text-red-300">{d.drop}</span>
                    </div>
                    <p className="text-xs text-red-200/70 leading-relaxed">{d.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── REGIONS ── */}
        {activeTab === "regions" && (
          <div>
            <h2 className="text-xl font-headline font-bold text-white mb-4">🗺️ Top Tech Hiring Regions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {REGIONS.map((r, i) => (
                <div key={i} style={{ ...glass, padding:22 }} className="shadow-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-headline font-bold text-white text-lg">{r.city}</h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/50 mt-0.5">{r.country}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white">{r.badge}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                      <p className="text-xs font-bold text-white">{r.growth}</p>
                      <p className="text-[10px] uppercase font-bold tracking-wider mt-1 text-white/40">YoY growth</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                      <p className="text-xs font-bold text-white">{r.jobs}</p>
                      <p className="text-[10px] uppercase font-bold tracking-wider mt-1 text-white/40">Open roles</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                      <p className="text-xs font-bold text-white">{r.avgSalary}</p>
                      <p className="text-[10px] uppercase font-bold tracking-wider mt-1 text-white/40">Avg salary</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-3 text-white/40">TOP HIRING ROLES</p>
                    <div className="flex flex-wrap gap-2">
                      {r.hotRoles.map((role, j) => (
                        <span key={j} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-white/80">{role}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CERTIFICATIONS ── */}
        {activeTab === "certs" && (
          <div>
            <h2 className="text-xl font-headline font-bold text-white mb-4">🏆 High-ROI Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CERTS.map((c, i) => (
                <div key={i} style={{ ...glass, padding:22 }} className="shadow-xl">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center bg-white/10 border border-white/20">
                      <Award className="w-6 h-6 text-white"/>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-base leading-tight">{c.name}</h3>
                      <p className="text-xs font-bold tracking-wider uppercase mt-1 text-white/50">{c.provider}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm text-green-300">{c.salaryLift}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mt-0.5">salary lift</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl py-2 px-1 text-center">
                      <p className="text-xs font-bold text-white">{c.cost}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider mt-1 text-white/40">Cost</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl py-2 px-1 text-center">
                      <p className="text-xs font-bold text-white">{c.time}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider mt-1 text-white/40">Prep time</p>
                    </div>
                    <div className="rounded-xl py-2 px-1 text-center border border-white/10" style={{ background: c.roi === "High" ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.1)" }}>
                      <p className="text-xs font-bold" style={{ color: c.roi === "High" ? "#86efac" : "#ffffff" }}>{c.roi}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider mt-1 text-white/40">ROI</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SALARY GUIDE ── */}
        {activeTab === "salary" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-headline font-bold text-white mb-4">💰 Salary Progression by Experience</h2>
              <div className="space-y-3">
                {SALARY_PROGRESSION.map((s, i) => (
                  <div key={i} style={{ ...glass, padding:20 }} className="shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl border border-white/20">
                          {s.symbol}
                        </div>
                        <div>
                          <p className="font-bold text-white text-base">{s.level}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center sm:w-auto">
                        <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-white/40">🇮🇳 India</p>
                          <p className="font-bold text-white">{s.india}</p>
                        </div>
                        <div className="bg-white/10 border border-white/20 rounded-xl px-6 py-2.5 shadow-inner">
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-white/60">🌍 Global</p>
                          <p className="font-bold text-white">{s.global}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Role salary comparison */}
            <div>
              <h2 className="text-xl font-headline font-bold text-white mb-4">Top Paying Roles in India (2026)</h2>
              <div style={{ ...glass, padding:32 }} className="shadow-2xl">
                <div className="space-y-6">
                  {[
                    { role:"AI/ML Architect",     min:25, max:80, avg:45 },
                    { role:"Cloud Architect",      min:22, max:75, avg:42 },
                    { role:"Principal Engineer",   min:40, max:120, avg:70 },
                    { role:"Data Science Lead",    min:20, max:60, avg:38 },
                    { role:"DevOps/SRE Lead",      min:18, max:55, avg:32 },
                    { role:"Full Stack (Senior)",  min:15, max:45, avg:28 },
                    { role:"Product Manager",      min:18, max:60, avg:35 },
                    { role:"Cybersecurity Lead",   min:16, max:50, avg:30 },
                  ].map((r, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm text-white">{r.role}</span>
                        <span className="text-xs font-bold text-white/50">{r.min}–{r.max} LPA</span>
                      </div>
                      <div className="h-3 rounded-full overflow-hidden relative bg-white/10 border border-white/5">
                        {/* Full bar */}
                        <div className="absolute h-full rounded-full bg-white/30" style={{ left:`${r.min/1.5}%`, width:`${(r.max-r.min)/1.5}%` }}/>
                        {/* Avg marker */}
                        <div className="absolute h-full w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ left:`${r.avg/1.5}%` }}/>
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-[10px] font-bold text-white/30">₹{r.min}L</span>
                        <span className="text-[10px] font-bold text-white">avg ~₹{r.avg}L</span>
                        <span className="text-[10px] font-bold text-white/30">₹{r.max}L</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center shadow-2xl relative overflow-hidden" style={{ ...glass, padding:48 }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-3xl font-headline font-bold text-white mb-3">Ready to ride these market trends?</h3>
            <p className="text-sm mb-8 text-white/60">Generate your personalized roadmap based on today's hottest in-demand roles.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => router.push("/roadmap-generator")}
                className="px-8 py-4 rounded-xl text-white font-bold text-sm transition-all bg-white/20 hover:bg-white/30 border border-white/30 shadow-lg flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4"/> Generate My Roadmap
              </button>
              <button onClick={() => router.push("/ats-checker")}
                className="px-8 py-4 rounded-xl text-white font-bold text-sm transition-all bg-white/5 hover:bg-white/10 border border-white/20 shadow-lg flex items-center justify-center gap-2">
                <Briefcase className="w-4 h-4"/> Check My Resume
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}