import React, { useState, useEffect } from "react";
import { 
  Play, Pause, Sliders, AlertTriangle, ShieldCheck, 
  Trash2, Mail, Send, Sparkles, CheckCircle2
} from "lucide-react";

export default function ViolationReview({ token, selectedStudentName, onAdjudicationSuccess }) {
  const [incident, setIncident] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineSec, setTimelineSec] = useState(45);
  const [verdict, setVerdict] = useState("Warned");
  const [proctorNotes, setProctorNotes] = useState("");
  const [notifyStudent, setNotifyStudent] = useState(true);
  const [escalateDean, setEscalateDean] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Load first matching incident for the specified student
  const fetchIncident = async () => {
    try {
      const res = await fetch("/api/violation-incidents");
      const data = await res.json();
      const match = data.find((i) => i.studentName === selectedStudentName);
      if (match) {
        setIncident(match);
        setProctorNotes(match.proctorNotes || "");
        if (match.verdict) {
          setVerdict(match.verdict);
        }
      } else {
        // Create fallback mock inline incident so UI doesn't look empty
        setIncident({
          _id: "v-fallback",
          studentName: selectedStudentName,
          examName: "Data Structures Mid-Term",
          incidentType: "Tab Switch Detected",
          confidence: 94,
          timestamp: "14:32:05",
          status: "Flagged",
          timelineLogs: [
            { time: "14:15:10", type: "Identity Verified", confidence: 99, description: "Facial authentication successful." },
            { time: "14:22:45", type: "Face Not Aligned", confidence: 60, description: "Candidate drifted left out of bounds." },
            { time: "14:32:05", type: "Tab Switch Detected", confidence: 94, description: "Active browser tab changed to external resource." }
          ]
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncident();
  }, [selectedStudentName]);

  // Video scrubber simulation
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimelineSec((prev) => (prev >= 120 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSubmittingAdjudication = async (e) => {
    e.preventDefault();
    if (!incident) return;
    setSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch("/api/violation-incidents/adjudicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: incident._id,
          verdict,
          proctorNotes,
          notifyStudent,
          escalateDean
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed submit adjudication");

      setFeedbackMsg(`Verdict '${verdict}' successfully recorded to academic registry!`);
      setTimeout(() => setFeedbackMsg(null), 5000);
      onAdjudicationSuccess();
      fetchIncident();
    } catch (err) {
      setFeedbackMsg(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!incident) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-505 font-mono">
        Select a flagged student to initiate forensic investigation and review incidents.
      </div>
    );
  }

  // Format MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const ss = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
  };

  return (
    <div id="violation-review-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      
      {/* Simulation Feed Video & Timeline logs */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Visual Frame */}
        <div className="bg-slate-900 border border-slate-805 rounded-2xl overflow-hidden relative shadow-lg">
          <div className="bg-slate-950 p-3 border-b border-slate-800 flex justify-between items-center">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Forensic Recording Feed (Review)
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-905 text-slate-400 font-mono">
              CAM_ROOM_04A // {selectedStudentName}
            </span>
          </div>

          {/* Interactive Simulated Video Overlay with AI Reticle */}
          <div className="aspect-video bg-slate-955 relative flex items-center justify-center border-b border-slate-800">
            {/* Main Pixel Frame Representing student */}
            <div className="text-center space-y-3 relative z-10 p-4">
              <div className="w-32 h-32 mx-auto rounded-full bg-slate-900 border border-slate-800 p-1 flex items-center justify-center relative">
                <img 
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${selectedStudentName === "Alex Johnson" ? "alex" : selectedStudentName === "Liam Thompson" ? "liam" : "sarah"}&backgroundColor=0f172a`} 
                  alt={selectedStudentName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-full"
                />
                
                {/* Yellow Face Bounding box wrapper */}
                <div className="absolute inset-0 border-2 border-dashed border-red-500/80 animate-pulse rounded-lg"></div>
                <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 bg-red-650 border border-red-500 text-[8px] font-mono font-bold text-white uppercase rounded whitespace-nowrap">
                  FACE DETECTION: LOW CONF
                </span>
                
                {/* Secondary AI Tracking Reticle */}
                {isPlaying && (
                  <div className="absolute inset-x-0 top-1/3 border-t border-cyan-400/40 animate-[bounce_2s_infinite]"></div>
                )}
              </div>
              <p className="text-xs text-slate-505 font-mono">
                Frame {1240 + timelineSec * 15} // Camera FPS: 30.00
              </p>
            </div>

            {/* Video overlay guidelines */}
            <div className="absolute top-4 left-4 font-mono text-[10px] text-teal-400 space-y-1 bg-slate-950/80 p-1.5 rounded border border-slate-800">
              <div>LATENCY: 42ms</div>
              <div>EYE_GAZE: UNSTABLE</div>
              <div>TAB_BURST: YES</div>
            </div>

            <div className="absolute bottom-4 right-4 font-mono text-[10px] text-red-400 space-y-1 bg-slate-955/80 p-1.5 rounded border border-slate-800 animate-pulse">
              <div>MUTED: FALSE</div>
              <div>AUDIO_RMS: 0.08</div>
              <div>VIOLATION: HIGH_RISK</div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-slate-955/40 via-transparent to-slate-955/20 pointer-events-none"></div>
          </div>

          {/* Video Controller Hub */}
          <div className="p-4 bg-slate-955/60 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold uppercase rounded text-white flex items-center gap-1.5 border border-slate-705 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                {isPlaying ? "Pause Feed" : "Analyze Frame"}
              </button>

              <div className="flex-1 flex items-center gap-3 font-mono text-xs">
                <span className="text-slate-550 font-medium">{formatTime(timelineSec)}</span>
                <input
                  type="range"
                  min="0"
                  max="120"
                  value={timelineSec}
                  onChange={(e) => setTimelineSec(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <span className="text-slate-550 font-medium font-bold">02:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Local Violation Timeline Logs */}
        <div className="space-y-3 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-405" />
            AI Behavioral Violation Log
          </h3>

          <div className="divide-y divide-slate-800/60">
            {incident.timelineLogs?.map((log, index) => (
              <div key={index} className="py-2.5 flex justify-between items-start gap-4 text-xs font-mono">
                <div className="flex items-start gap-2.5">
                  <span className="text-slate-500 shrink-0 text-[10px] bg-slate-950 px-1.5 py-0.5 rounded mt-0.5">
                    {log.time}
                  </span>
                  <div>
                    <span className="text-slate-205 font-bold block">{log.type}</span>
                    <span className="text-slate-405 text-[11px] block mt-0.5">{log.description}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                    log.confidence >= 90 
                      ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {log.confidence}% AI Match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Adjudication Panel Column */}
      <div className="lg:col-span-5">
        
        <form onSubmit={handleSubmittingAdjudication} className="bg-slate-900 border border-slate-808 p-6 rounded-2xl space-y-5 h-full flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-805 pb-3">
              <h3 className="text-sm font-bold font-mono tracking-wide text-white uppercase flex items-center gap-2">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-400" />
                INTEGRITY PANEL ADJUDICATION
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                Forensically lock details and log direct academic verdicts.
              </p>
            </div>

            {feedbackMsg && (
              <div className="p-3 bg-teal-955/40 border border-teal-505/30 rounded-lg text-xs text-teal-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            {/* Verdict selectors */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Select Active Verdict</label>
              <div className="grid grid-cols-1 gap-2">
                
                <label className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                  verdict === "Dismissed" 
                    ? "bg-emerald-955/30 border-emerald-500 text-teal-200" 
                    : "bg-slate-950/50 border-slate-850 hover:border-slate-800 text-slate-300"
                }`}>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider">Dismiss Flag</span>
                    <span className="text-[10px] text-slate-400 leading-normal font-sans">Exonerate candidate, clear proctor counters.</span>
                  </div>
                  <input
                    type="radio"
                    name="verdict"
                    checked={verdict === "Dismissed"}
                    onChange={() => setVerdict("Dismissed")}
                    className="accent-emerald-500 cursor-pointer h-4 w-4"
                  />
                </label>

                <label className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                  verdict === "Warned" 
                    ? "bg-amber-955/30 border-amber-500 text-amber-200" 
                    : "bg-slate-950/50 border-slate-855 hover:border-slate-800 text-slate-300"
                }`}>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider">Issue Official Warning</span>
                    <span className="text-[10px] text-slate-400 leading-normal font-sans">Subtract integrity scoring points, notify applicant.</span>
                  </div>
                  <input
                    type="radio"
                    name="verdict"
                    checked={verdict === "Warned"}
                    onChange={() => setVerdict("Warned")}
                    className="accent-amber-500 cursor-pointer h-4 w-4"
                  />
                </label>

                <label className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                  verdict === "Nullified" 
                    ? "bg-red-955/30 border-red-500 text-red-200" 
                    : "bg-slate-950/50 border-slate-855 hover:border-slate-800 text-slate-300"
                }`}>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider">Nullify Examination</span>
                    <span className="text-[10px] text-slate-400 leading-normal font-sans">Force-submit with 0% absolute grade, notify Dean.</span>
                  </div>
                  <input
                    type="radio"
                    name="verdict"
                    checked={verdict === "Nullified"}
                    onChange={() => setVerdict("Nullified")}
                    className="accent-red-500 cursor-pointer h-4 w-4"
                  />
                </label>

              </div>
            </div>

            {/* Proctor Notes */}
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block">Adjudication Notes</label>
              <textarea
                value={proctorNotes}
                onChange={(e) => setProctorNotes(e.target.value)}
                placeholder="Log granular visual observations or external justifications for the verdict..."
                className="w-full min-h-[100px] bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-205 placeholder:text-slate-650 focus:outline-none focus:border-slate-700 leading-normal font-sans"
              />
            </div>

            {/* Verification Toggles */}
            <div className="space-y-2 bg-slate-950/40 p-3 rounded-lg border border-slate-850 text-slate-300">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-505 font-bold block">Integrity Notifications</label>
              
              <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notifyStudent}
                  onChange={(e) => setNotifyStudent(e.target.checked)}
                  className="accent-teal-500 h-3.5 w-3.5 rounded cursor-pointer"
                />
                <span className="font-sans">Notify student immediately via secure post portal</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={escalateDean}
                  onChange={(e) => setEscalateDean(e.target.checked)}
                  className="accent-teal-500 h-3.5 w-3.5 rounded cursor-pointer"
                />
                <span className="font-sans">Escalate case documentation to Department Dean</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-955 font-bold font-mono text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-teal-500/10 cursor-pointer flex justify-center items-center gap-1.5 transition-all mt-4"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? "Committing Verdict..." : "Submit Decision"}
          </button>
        </form>

      </div>
    </div>
  );
}
