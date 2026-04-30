"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Download, LayoutTemplate } from 'lucide-react';
import { FrameCanvas } from "@/components/SkillBridge/FrameCanvas";

export default function ResumeBuilder() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', linkedin: '', location: '', targetRole: '',
    tone: 'Professional', template: 'Modern', summary: '', experience: '', skills: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScrollHeight > 0 ? Math.min(1, Math.max(0, scrollY / totalScrollHeight)) : 0;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    setTimeout(handleScroll, 100);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateResume = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/build-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      alert("Failed to generate resume. Check terminal for errors.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  // ── TEMPLATES ─────────────────────────────────────────────────────────

  const ModernTemplate = ({ data }: { data: any }) => (
    <div className="w-full h-full text-gray-800 bg-white leading-relaxed text-[13px]">
      <div className="bg-slate-800 text-white p-6 pb-8">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-1">{data.contact.name}</h1>
        <h2 className="text-lg font-medium text-blue-300">{formData.targetRole}</h2>
      </div>
      <div className="flex px-6 pt-6 pb-12 gap-8">
        {/* Left Column */}
        <div className="w-1/3 border-r border-gray-200 pr-6">
          <div className="mb-6 -mt-12 bg-white p-4 shadow-lg border border-gray-100 rounded-lg">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider mb-3 text-sm border-b pb-1">Contact</h3>
            <ul className="space-y-2 text-xs text-gray-600 break-all">
              {data.contact.email && <li>✉ {data.contact.email}</li>}
              {data.contact.phone && <li>☎ {data.contact.phone}</li>}
              {data.contact.location && <li>📍 {data.contact.location}</li>}
              {data.contact.linkedin && <li>🔗 {data.contact.linkedin.replace('https://','')}</li>}
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider mb-3 text-sm border-b pb-1">Skills</h3>
            <div className="mb-3">
              <p className="font-bold text-xs text-gray-700 mb-1">Technical</p>
              <div className="flex flex-wrap gap-1">
                {data.skills.technical?.map((s: string, i: number) => <span key={i} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-[10px] font-medium">{s}</span>)}
              </div>
            </div>
            <div>
              <p className="font-bold text-xs text-gray-700 mb-1">Soft Skills</p>
              <p className="text-xs text-gray-600 leading-relaxed">{data.skills.soft?.join(', ')}</p>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="w-2/3">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider mb-2 text-sm border-b pb-1">Profile</h3>
            <p className="text-gray-600 leading-relaxed">{data.summary}</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 uppercase tracking-wider mb-4 text-sm border-b pb-1">Experience</h3>
            <div className="space-y-5">
              {data.experience.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-800 text-sm">{exp.role}</h4>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{exp.duration}</span>
                  </div>
                  <p className="text-xs text-blue-600 font-medium mb-2">{exp.company} | {exp.location}</p>
                  <ul className="list-disc list-outside ml-4 space-y-1.5 text-gray-600">
                    {exp.bullets.map((b: string, idx: number) => <li key={idx} className="pl-1">{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MinimalTemplate = ({ data }: { data: any }) => (
    <div className="w-full h-full text-gray-800 bg-white leading-relaxed text-[13px] p-10 font-sans">
      <div className="mb-8">
        <h1 className="text-4xl font-light tracking-tight text-black mb-2">{data.contact.name}</h1>
        <h2 className="text-lg font-medium text-gray-500 mb-4">{formData.targetRole}</h2>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-medium">
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span>• {data.contact.phone}</span>}
          {data.contact.location && <span>• {data.contact.location}</span>}
        </div>
      </div>
      <div className="mb-8">
        <p className="text-gray-600 leading-relaxed">{data.summary}</p>
      </div>
      <div className="mb-8">
        <h3 className="font-bold text-black uppercase tracking-widest text-xs mb-5">Experience</h3>
        <div className="space-y-6">
          {data.experience.map((exp: any, i: number) => (
            <div key={i} className="relative pl-4 border-l-2 border-gray-200">
              <div className="absolute w-2 h-2 bg-gray-300 rounded-full -left-[5px] top-1.5"></div>
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-black text-sm">{exp.role} <span className="font-normal text-gray-500">at {exp.company}</span></h4>
                <span className="text-xs text-gray-400 font-medium">{exp.duration}</span>
              </div>
              <ul className="list-disc list-outside ml-4 mt-2 space-y-1.5 text-gray-600">
                {exp.bullets.map((b: string, idx: number) => <li key={idx} className="pl-1">{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-black uppercase tracking-widest text-xs mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {[...(data.skills.technical || []), ...(data.skills.soft || [])].map((s: string, i: number) => (
            <span key={i} className="border border-gray-300 text-gray-600 px-3 py-1 rounded-full text-xs">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );

  const ClassicTemplate = ({ data }: { data: any }) => (
    <div className="w-full h-full text-gray-900 bg-white leading-relaxed text-[13px] p-10 font-serif">
      <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-4xl font-bold mb-2 uppercase">{data.contact.name}</h1>
        <p className="text-sm text-gray-600 font-sans">
          {data.contact.location} | {data.contact.email} | {data.contact.phone}
        </p>
        <p className="text-sm text-gray-600 font-sans mt-1">
          {data.contact.linkedin}
        </p>
      </div>
      <div className="mb-5">
        <h3 className="font-bold text-gray-800 uppercase tracking-widest text-sm border-b border-gray-300 mb-2">Professional Summary</h3>
        <p className="text-gray-700 leading-relaxed text-justify">{data.summary}</p>
      </div>
      <div className="mb-5">
        <h3 className="font-bold text-gray-800 uppercase tracking-widest text-sm border-b border-gray-300 mb-3">Professional Experience</h3>
        <div className="space-y-4">
          {data.experience.map((exp: any, i: number) => (
            <div key={i}>
              <div className="flex justify-between items-baseline mb-0.5">
                <h4 className="font-bold text-gray-900 text-sm">{exp.role}</h4>
                <span className="text-xs font-bold text-gray-600">{exp.duration}</span>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm italic text-gray-700">{exp.company}</span>
                <span className="text-xs text-gray-500">{exp.location}</span>
              </div>
              <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700 font-sans text-xs">
                {exp.bullets.map((b: string, idx: number) => <li key={idx} className="pl-1">{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-gray-800 uppercase tracking-widest text-sm border-b border-gray-300 mb-2">Core Competencies</h3>
        <p className="text-gray-700 font-sans"><strong className="font-serif">Technical:</strong> {data.skills.technical?.join(', ')}</p>
        <p className="text-gray-700 font-sans mt-1"><strong className="font-serif">Soft Skills:</strong> {data.skills.soft?.join(', ')}</p>
      </div>
    </div>
  );

  // ──────────────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen bg-[#0A0510] text-white print:bg-white print:text-black">
      
      {/* ══ FIXED BACKGROUND CANVAS ══════════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none print:hidden">
        <FrameCanvas scrollProgress={scrollProgress} />
        <div className="absolute inset-0 bg-[#0A0510]/20" />
      </div>

      {/* ══ CONTENT ══════════════════════════════════════════════════════ */}
      <div className="relative z-10 p-6 max-w-[1400px] mx-auto pt-10 print:p-0 print:m-0">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md w-max print:hidden">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block print:gap-0">
          
          {/* LEFT: Input Form */}
          <div className="lg:col-span-5 glass-panel border border-white/20 p-8 rounded-3xl bg-white/5 backdrop-blur-xl shadow-2xl print:hidden h-fit">
            <h1 className="text-3xl font-headline font-bold mb-6 flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              AI Resume Builder
            </h1>
            <form onSubmit={generateResume} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <input name="fullName" placeholder="Full Name *" required onChange={handleChange} className="w-full bg-white/10 border border-white/10 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40" />
                <input name="targetRole" placeholder="Target Role *" required onChange={handleChange} className="w-full bg-white/10 border border-white/10 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40" />
                <input name="email" placeholder="Email" onChange={handleChange} className="w-full bg-white/10 border border-white/10 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40" />
                <input name="phone" placeholder="Phone" onChange={handleChange} className="w-full bg-white/10 border border-white/10 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <select name="template" onChange={handleChange} value={formData.template} className="w-full bg-white/20 border border-white/30 rounded-xl p-3 text-white focus:outline-none focus:border-white/50 appearance-none font-bold tracking-wide cursor-pointer">
                    <option value="Modern" className="bg-[#0A0510]">🟦 Modern Template</option>
                    <option value="Minimal" className="bg-[#0A0510]">⬜ Minimal Template</option>
                    <option value="Classic" className="bg-[#0A0510]">🏛 Classic Template</option>
                  </select>
                  <LayoutTemplate className="w-4 h-4 absolute right-4 top-3.5 pointer-events-none opacity-50" />
                </div>
                <select name="tone" onChange={handleChange} className="w-full bg-white/10 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/40 appearance-none cursor-pointer">
                  <option value="Professional" className="bg-[#0A0510]">Professional Tone</option>
                  <option value="Startup-Friendly" className="bg-[#0A0510]">Startup Tone</option>
                </select>
              </div>

              <textarea name="experience" placeholder="Paste raw work experience here (messy is fine)..." rows={5} onChange={handleChange} className="w-full bg-white/10 border border-white/10 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40 resize-none" />
              <textarea name="skills" placeholder="List your skills (comma separated)..." rows={2} onChange={handleChange} className="w-full bg-white/10 border border-white/10 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40 resize-none" />
              
              <button type="submit" disabled={loading} className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg">
                {loading ? 'AI is formatting and rewriting...' : 'Generate Resume'}
              </button>
            </form>
          </div>

          {/* RIGHT: Live Paper Preview */}
          <div className="lg:col-span-7 flex flex-col print:block print:w-full print:p-0 print:m-0">
            
            {/* Toolbar above Paper */}
            <div className="flex justify-between items-end mb-4 print:hidden px-2">
              <div>
                <h3 className="text-white/80 font-bold tracking-widest uppercase text-xs">Live Document Preview</h3>
                <p className="text-white/40 text-xs mt-1">Updates based on selected template</p>
              </div>
              {result && (
                <button onClick={handlePrint} className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-all font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              )}
            </div>

            {/* A4 Paper Container */}
            <div className="relative w-full bg-white rounded-md shadow-2xl overflow-hidden aspect-[210/297] print:aspect-auto print:rounded-none print:shadow-none print:w-full print:h-auto max-h-[850px] print:max-h-none overflow-y-auto">
              {!result ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50 text-sm">
                  <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4 bg-white">
                    <LayoutTemplate className="w-6 h-6 opacity-40" />
                  </div>
                  Your formatted resume will appear here on an A4 canvas.
                </div>
              ) : (
                <div className="w-full h-full print:w-[210mm] print:min-h-[297mm] mx-auto bg-white">
                  {formData.template === 'Classic' ? <ClassicTemplate data={result} /> : 
                   formData.template === 'Minimal' ? <MinimalTemplate data={result} /> : 
                   <ModernTemplate data={result} />}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Global Print Styles (Hides UI and formats paper) */}
    <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: A4; margin: 0; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}} />
    </div>
  );
}