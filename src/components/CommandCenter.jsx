import React, { useState, useEffect } from "react";
import { 
  Users, BookOpen, AlertTriangle, ShieldCheck, 
  Search, RefreshCw, Radio, ExternalLink, ShieldAlert
} from "lucide-react";

export default function CommandCenter({ token, onSelectStudentForReview }) {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [customViolationAlert, setCustomViolationAlert] = useState(null);

  // Load students from DB
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proctor/students");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // Auto refresh proctor candidates every 8 seconds
    const interval = setInterval(fetchStudents, 8000);
    return () => clearInterval(interval);
  }, []);

  const triggerSimulation = async (studentName, type, confidence, desc) => {
    try {
      const res = await fetch("/api/proctor/trigger-violation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          studentName,
          examName: studentName === "Liam Thompson" ? "Operating Systems Final" : "Data Structures Mid-Term",
          type,
          confidence,
          description: desc
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCustomViolationAlert(`Triggered simulation for ${studentName}: ${type} (${confidence}% confidence)!`);
        setTimeout(() => setCustomViolationAlert(null), 4000);
        fetchStudents();
      }
    } catch (err) {
      console.error("Simulation error", err);
    }
  };

  // Filter lists
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.examName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div id="command-center-root" className="space-y-6">
      
      {/* Simulation Helper Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-sm font-semibold font-mono text-teal-400 flex items-center gap-1.5 uppercase">
            <Radio className="w-4 h-4 animate-ping text-teal-400 shrink-0" />
            Integrity Simulation Deck
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Test the full-stack event pipeline by triggering real-time AI security incidents for live examinees.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => triggerSimulation("Alex Johnson", "Tab Switch Detected", 94, "Switched window tabs to Google Search engine.")}
            className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/40 border border-red-500/20 rounded text-xs font-mono text-red-300 transition-colors cursor-pointer"
          >
            + Sim Tab-Switch (Alex)
          </button>
          <button
            onClick={() => triggerSimulation("Liam Thompson", "Secondary Device Detected", 91, "Phone screen illuminated near user hand.")}
            className="px-3 py-1.5 bg-red-955/40 hover:bg-red-900/40 border border-red-500/20 rounded text-xs font-mono text-red-300 transition-colors cursor-pointer"
          >
            + Sim Device (Liam)
          </button>
          <button
            onClick={() => triggerSimulation("Sarah Chen", "Out of Frame / Left Desk", 88, "Candidate seat unoccupied.")}
            className="px-3 py-1.5 bg-yellow-955/40 hover:bg-yellow-905/40 border border-yellow-500/20 rounded text-xs font-mono text-yellow-300 transition-colors cursor-pointer"
          >
            + Sim Out-of-Frame (Sarah)
          </button>
          <button
            onClick={fetchStudents}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 cursor-pointer"
            title="Refresh database state"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {customViolationAlert && (
        <div className="p-3 bg-red-950/80 border border-red-500 rounded-lg flex items-center gap-3 text-xs text-white shadow-lg animate-bounce">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <span className="font-mono">{customViolationAlert}</span>
        </div>
      )}

      {/* KPI Overviews */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-slate-300">
        
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 bg-teal-950/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-505 font-bold">Total Students</div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">4,250</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Enrolled Examinees</div>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 bg-blue-950/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-505 font-bold">Active Exams</div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">12</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Simultaneous Sessions</div>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-450 bg-rose-950/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-505 font-bold">Total Violations</div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              {students.reduce((acc, s) => acc + (s.violationsCount || 0), 0) + 78}
            </div>
            <div className="text-[10px] text-rose-300 mt-0.5 animate-pulse font-mono">Flagged System-wide</div>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-440 bg-emerald-950/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-505 font-bold">Avg. Integrity</div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">92%</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Compliant Cohorts</div>
          </div>
        </div>

      </div>

      {/* Live Monitor Roster and Thumbnails */}
      <div className="space-y-4">
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 p-4 border border-slate-800/80 rounded-xl">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold font-mono text-white uppercase tracking-wider">Live Proctoring Feeds</h3>
            <span className="px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-[10px] uppercase font-mono text-teal-400 font-bold tracking-widest leading-none">Real-time</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            
            {/* Search Input */}
            <div className="relative flex-1 md:flex-initial min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search candidate or exam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-880 rounded-lg py-1.5 pl-8 pr-4 text-xs font-mono text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-slate-750"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-850">
              {["ALL", "Verified", "Suspicious", "Flagged"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`py-1 px-2 text-[10px] font-mono uppercase tracking-wider rounded cursor-pointer ${
                    filterStatus === st 
                      ? "bg-slate-800 text-white border border-slate-700/50" 
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Live Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            
            // Risk color metrics
            const isRedRisk = student.riskScore >= 70;
            const isYellowRisk = student.riskScore >= 30 && student.riskScore < 70;
            const borderColors = isRedRisk 
              ? "border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.15)]" 
              : isYellowRisk 
                ? "border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.1)]" 
                : "border-slate-800 hover:border-slate-705";

            const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${student.avatarSeed}&backgroundColor=0f172a`;

            return (
              <div 
                key={student._id}
                className={`bg-slate-900 rounded-xl overflow-hidden border ${borderColors} transition-all duration-300 flex flex-col justify-between group relative`}
              >
                {/* Simulated Webcam Video Frame */}
                <div className="relative aspect-video bg-slate-955 flex items-center justify-center overflow-hidden">
                  
                  {/* Status Overlay Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-[10px] font-mono uppercase z-10 backdrop-blur-sm">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      student.status === "Flagged" 
                        ? "bg-red-500 animate-ping" 
                        : student.status === "Suspicious" 
                          ? "bg-amber-450" 
                          : "bg-emerald-500"
                    }`}></span>
                    <span className={
                      student.status === "Flagged" 
                        ? "text-red-400 font-bold" 
                        : student.status === "Suspicious" 
                          ? "text-amber-400" 
                          : "text-emerald-400 font-bold"
                    }>
                      {student.status}
                    </span>
                  </div>

                  {/* Top-Right Risk Dial */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950/90 border border-slate-800 text-[10px] font-mono z-10 text-slate-300">
                    <span className="text-slate-500 uppercase">Risk:</span>
                    <span className={`font-bold ${isRedRisk ? "text-red-400" : isYellowRisk ? "text-amber-400" : "text-emerald-400"}`}>
                      {student.riskScore}%
                    </span>
                  </div>

                  {/* Character Webcam Mock Face */}
                  <div className="relative w-28 h-28 transform group-hover:scale-105 transition-transform duration-500 flex flex-col items-center">
                    <img 
                      src={avatarUrl} 
                      alt={student.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rounded-full border border-slate-800 bg-slate-950/40 p-1"
                    />
                    
                    {/* Simulated Scanner Reticle (Visible on high Risk) */}
                    {student.riskScore > 30 && (
                      <div className={`absolute -inset-1 rounded-full border border-dashed animate-spin duration-1000 ${
                        isRedRisk ? "border-red-500/60" : "border-amber-500/50"
                      }`}></div>
                    )}
                  </div>

                  {/* AI Face Detection Overlays on high-risk students */}
                  {student.riskScore > 50 && (
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-red-950/80 border border-red-500/40 py-1 px-2 rounded font-mono text-[9px] text-red-300 flex justify-between items-center whitespace-nowrap">
                      <span>[FLAG DETECTED]</span>
                      <span className="animate-pulse">AUTO-SAVING EVIDENCE</span>
                    </div>
                  )}

                  {/* Horizontal static lines or flicker */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-955/5 to-transparent pointer-events-none opacity-20"></div>
                </div>

                {/* Candidate Meta Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-white tracking-tight">{student.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 font-sans">{student.examName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-950 p-2 rounded-lg border border-slate-850">
                    <div>
                      <span className="text-slate-500 uppercase block">Active Violations</span>
                      <span className={`font-bold ${student.violationsCount > 0 ? "text-red-400" : "text-slate-300"}`}>
                        {student.violationsCount} Occurrences
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase block">Sync Ping</span>
                      <span className="text-slate-400 block">{student.lastActive}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectStudentForReview(student.name)}
                      className="flex-1 text-center py-1.5 rounded bg-slate-800 hover:bg-slate-705 text-xs font-mono font-bold text-slate-200 border border-slate-700 transition-colors uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Manual Review</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredStudents.length === 0 && (
          <div className="p-12 text-center bg-slate-900 rounded-xl border border-slate-800 font-mono text-slate-500 text-sm">
            No live students match criteria. Adjust search queries or statuses above.
          </div>
        )}

      </div>
    </div>
  );
}
