import React, { useState } from "react";
import { 
  BarChart3, FileSpreadsheet, FileText, Download, TrendingUp, Sparkles, PieChart, Users2 
} from "lucide-react";

export default function AnalyticsDashboard() {
  const [exportLoading, setExportLoading] = useState(null);

  const triggerMockExport = (fmt) => {
    setExportLoading(fmt);
    setTimeout(() => {
      setExportLoading(null);
      // Trigger browser simulated download
      const element = document.createElement("a");
      const file = new Blob([`ExamAudit Pro - Forensic Analytics Summary (${fmt})\nGenerated on ${new Date().toLocaleString()}`], {type: "text/plain"});
      element.href = URL.createObjectURL(file);
      element.download = `ExamAudit_Pro_Report_${fmt.toLowerCase()}_${Date.now()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  // SVG dimensions for custom visual charts
  // Chart 1: Violation Trends Timeline (Line Chart)
  // Data: Jan: 10, Feb: 18, Mar: 12, Apr: 28, May: 15, Jun: 32 (recent)
  const linePoints = "30,120 100,100 170,110 240,60 310,95 380,40";
  const trendLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  // Chart 2: Exam Distribution by Difficulty (Donut Chart)
  const donutData = [
    { value: 45, label: "Easy (45%)", color: "text-emerald-400 stroke-emerald-400" },
    { value: 35, label: "Medium (35%)", color: "text-amber-400 stroke-amber-400" },
    { value: 20, label: "Hard (20%)", color: "text-rose-500 stroke-rose-500" }
  ];

  // Chart 3: Department Pass Rates (Bar Chart)
  const barData = [
    { label: "CompSci", rate: 82, color: "bg-teal-400 text-teal-400" },
    { label: "Engineering", rate: 74, color: "bg-blue-400 text-blue-400" },
    { label: "Mathematics", rate: 89, color: "bg-purple-400 text-purple-400" },
    { label: "Physics", rate: 68, color: "bg-amber-400 text-amber-400" },
    { label: "Business", rate: 91, color: "bg-emerald-400 text-emerald-400" }
  ];

  return (
    <div id="analytics-dashboard-root" className="space-y-6">
      
      {/* Visual Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Violation Trends Line Chart */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Violation Trends Timeline
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-955/40 px-2 py-0.5 rounded border border-cyan-500/10">3.4x peak flag</span>
          </div>

          <div className="relative h-44 w-full bg-slate-950 rounded-xl overflow-hidden p-4 flex flex-col justify-between">
            {/* SVG custom line chart with hover highlights */}
            <svg className="w-full h-[120px] overflow-visible" viewBox="0 0 400 150">
              {/* Guides */}
              <line x1="10" y1="30" x2="390" y2="30" className="stroke-slate-90" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="10" y1="80" x2="390" y2="80" className="stroke-slate-90" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="10" y1="130" x2="390" y2="130" className="stroke-slate-90" strokeWidth="0.5" strokeDasharray="3,3" />
              
              {/* Trend Glow Background Line */}
              <polyline
                fill="none"
                stroke="rgba(34,211,238,0.1)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={linePoints}
              />

              {/* Core Theme Color Trend Line */}
              <polyline
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={linePoints}
              />

              {/* Data dots */}
              <circle cx="30" cy="120" r="4.5" className="fill-slate-950 stroke-cyan-400 stroke-2 outline-none" />
              <circle cx="100" cy="100" r="4.5" className="fill-slate-950 stroke-cyan-400 stroke-2 outline-none" />
              <circle cx="170" cy="110" r="4.5" className="fill-slate-950 stroke-cyan-400 stroke-2 outline-none" />
              <circle cx="240" cy="60" r="4.5" className="fill-slate-950 stroke-cyan-400 stroke-2 outline-none" />
              <circle cx="310" cy="95" r="4.5" className="fill-slate-950 stroke-cyan-400 stroke-2 outline-none" />
              <circle cx="380" cy="40" r="5" className="fill-cyan-400 stroke-cyan-400 ring-4 ring-cyan-500/10 pointer-events-none" />
            </svg>

            {/* Labels */}
            <div className="flex justify-between px-1.5 font-mono text-[9px] text-slate-500 uppercase tracking-widest pt-2 border-t border-slate-900">
              {trendLabels.map((lbl, idx) => (
                <span key={idx}>{lbl}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Exam Distribution by Difficulty Donut */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-purple-400" />
              Curriculum Distribution
            </h3>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-955/40 px-2 py-0.5 rounded border border-purple-500/10">340 Total Questions</span>
          </div>

          <div className="h-44 bg-slate-950 rounded-xl p-4 flex items-center justify-between">
            {/* Visual Donut wrapper */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Gray back segment */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0f172a" strokeWidth="2.8" />
                
                {/* 45% emerald segment */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#34d399" strokeWidth="2.8" strokeDasharray="45 55" strokeDashoffset="0" />
                
                {/* 35% amber segment */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="2.8" strokeDasharray="35 65" strokeDashoffset="-45" />

                {/* 20% red segment */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="2.8" strokeDasharray="20 80" strokeDashoffset="-80" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">Ratio</span>
                <span className="text-sm font-mono font-black text-white leading-none">3-Tier</span>
              </div>
            </div>

            {/* Custom legends with styled colors */}
            <div className="space-y-1.5 flex-1 pl-4">
              {donutData.map((d, index) => (
                <div key={index} className="flex items-center gap-2 font-mono text-[10px]">
                  <span className={`w-2.5 h-2.5 rounded-full ${d.color.split(" ")[0]} bg-current`} />
                  <span className="text-slate-400 uppercase">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department-wise Pass Rates (Bar Chart) */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Departmental Pass Rates
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-955/40 px-2 py-0.5 rounded border border-emerald-500/10">80.2% Avg.</span>
          </div>

          <div className="h-44 bg-slate-950 rounded-xl p-4 flex flex-col justify-between font-mono text-[9px] text-slate-500">
            {/* Render vertical bars */}
            <div className="flex items-end justify-between h-[110px] px-2 relative">
              
              {/* Grid Guides behind bars */}
              <div className="absolute inset-x-0 top-0 border-t border-slate-900/50"></div>
              <div className="absolute inset-x-0 bottom-1/2 border-t border-slate-900/50"></div>

              {barData.map((b, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 w-1/5 group relative">
                  
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-6 bg-slate-900 border border-slate-800 text-[8px] text-white py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 block whitespace-nowrap">
                    {b.rate}% Pass
                  </div>

                  {/* Filled metric column */}
                  <div className="w-4 bg-slate-900 rounded-t h-[90px] flex items-end">
                    <div 
                      className={`w-full rounded-t transition-all duration-1000 ${b.color.split(" ")[0]}`} 
                      style={{ height: `${b.rate}%` }}
                    />
                  </div>
                  <span className="text-[7.5px] uppercase tracking-widest text-slate-500 rotate-12 mt-1 truncate max-w-full">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Performers Table */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Users2 className="w-4.5 h-4.5 text-teal-400" />
              High Performance Examinees
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Top 5 Records</span>
          </div>

          <div className="overflow-x-auto text-xs font-mono text-slate-300">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-850 text-slate-400 font-bold bg-slate-950/20">
                  <th className="p-3">Rank</th>
                  <th className="p-3">Examinee</th>
                  <th className="p-3">Course Metric</th>
                  <th className="p-3 text-center">Score Grade</th>
                  <th className="p-3 text-right">Accuracy Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                <tr className="hover:bg-slate-950/10">
                  <td className="p-3 text-slate-500 font-bold">#01</td>
                  <td className="p-3 font-semibold text-white">Sarah Chen</td>
                  <td className="p-3 text-slate-400">Advanced Algorithms</td>
                  <td className="p-3 text-center text-teal-400 font-bold">A+</td>
                  <td className="p-3 text-right text-teal-400 font-black">98.5%</td>
                </tr>
                <tr className="hover:bg-slate-950/10">
                  <td className="p-3 text-slate-500 font-bold">#02</td>
                  <td className="p-3 font-semibold text-white">Elena Rodriguez</td>
                  <td className="p-3 text-slate-400">Data Structures Mid-Term</td>
                  <td className="p-3 text-center text-teal-400 font-bold">A+</td>
                  <td className="p-3 text-right text-teal-400 font-black">96.8%</td>
                </tr>
                <tr className="hover:bg-slate-950/10">
                  <td className="p-3 text-slate-500 font-bold">#03</td>
                  <td className="p-3 font-semibold text-white">Marcus Wright</td>
                  <td className="p-3 text-slate-400">Discrete Mathematics</td>
                  <td className="p-3 text-center text-teal-400 font-bold">A</td>
                  <td className="p-3 text-right text-slate-300">93.4%</td>
                </tr>
                <tr className="hover:bg-slate-950/10">
                  <td className="p-3 text-slate-500 font-bold">#04</td>
                  <td className="p-3 font-semibold text-white">Priya Patel</td>
                  <td className="p-3 text-slate-400">Algorithms Mid-Term</td>
                  <td className="p-3 text-center text-teal-400 font-bold">A</td>
                  <td className="p-3 text-right text-slate-300">92.0%</td>
                </tr>
                <tr className="hover:bg-slate-950/10">
                  <td className="p-3 text-slate-500 font-bold">#05</td>
                  <td className="p-3 font-semibold text-white">Liam Thompson</td>
                  <td className="p-3 text-slate-400">Operating Systems Final</td>
                  <td className="p-3 text-center text-amber-400 font-bold">B</td>
                  <td className="p-3 text-right text-slate-400">84.2%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Reporting, Export & Action Controls */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold flex items-center gap-1.5">
              <Download className="w-4 h-4 text-teal-300" />
              Exports & Reporting deck
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal mt-1">
              Select desired compiled report type to trigger direct downloads on client local machine.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => triggerMockExport("PDF")}
              disabled={exportLoading !== null}
              className="w-full p-3 bg-slate-950/80 border border-slate-850 hover:border-slate-800 hover:bg-slate-950 text-xs font-mono text-slate-300 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-red-400 shrink-0" />
                <span className="font-bold">Generate Full Forensics PDF</span>
              </div>
              <span className="text-[10px] text-slate-500">
                {exportLoading === "PDF" ? "Assembling..." : "PDF Format"}
              </span>
            </button>

            <button
              onClick={() => triggerMockExport("CSV")}
              disabled={exportLoading !== null}
              className="w-full p-3 bg-slate-950/80 border border-slate-850 hover:border-slate-800 hover:bg-slate-950 text-xs font-mono text-slate-300 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold">Export Integrity CSV</span>
              </div>
              <span className="text-[10px] text-slate-500">
                {exportLoading === "CSV" ? "Compiling rows..." : "CSV Excel"}
              </span>
            </button>

            {/* Simulated Faculty Performance summary */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 font-mono text-xs">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Faculty Proctor Metrics</span>
              
              <div className="space-y-1.5 leading-relaxed text-slate-400">
                <div className="flex justify-between">
                  <span>Adjudication Turnaround:</span>
                  <span className="text-white font-bold">14m Avg.</span>
                </div>
                <div className="flex justify-between">
                  <span>Assigned Moderators:</span>
                  <span className="text-white font-bold">3 active</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy Agreement:</span>
                  <span className="text-teal-400 font-bold">98.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
