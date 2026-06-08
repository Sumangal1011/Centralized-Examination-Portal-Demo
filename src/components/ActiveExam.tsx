import React, { useState, useEffect } from "react";
import { 
  Clock, ShieldCheck, AlertOctagon, HelpCircle, 
  Bookmark, ArrowRight, CheckCircle2, ShieldAlert
} from "lucide-react";

interface ActiveExamProps {
  studentName: string;
  onExamFinish: () => void;
}

interface QuestionItem {
  number: number;
  text: string;
  options: string[];
  correct: number;
}

export default function ActiveExam({ studentName, onExamFinish }: ActiveExamProps) {
  // Configured questions
  const examQuestions: QuestionItem[] = [
    {
      number: 1,
      text: "What is correct about a circular doubly linked list's prev pointer in the head node?",
      options: [
        "It points directly to the tail node of the list, facilitating instant reverse lookup.",
        "It remains NULL throughout all node insertions or updates.",
        "It points recursively back to the head node itself.",
        "It triggers an out-of-bounds compiler warning upon traversal."
      ],
      correct: 0
    },
    {
      number: 2,
      text: "Which traversal mode is optimal for reconstructing a Binary Search Tree into a sorted list?",
      options: [
        "Pre-order traversal",
        "In-order traversal",
        "Post-order traversal",
        "Breadth-first level-by-level traversal"
      ],
      correct: 1
    },
    {
      number: 3,
      text: "What is the worst-case lookup complexity of a perfectly-balanced Red-Black tree containing N elements?",
      options: [
        "O(1)",
        "O(N)",
        "O(log N)",
        "O(N log N)"
      ],
      correct: 2
    },
    {
      number: 4,
      text: "In the algorithm context, how are collision chains handled within an open-addressing Hash Table?",
      options: [
        "Via dynamic allocation of auxiliary linked lists representing chain nodes.",
        "Via mathematical probing sequences (Linear, Quadratic, or Double Hashing).",
        "By discarding conflicting keys automatically.",
        "By expanding table capacity to the nearest Mersenne prime number."
      ],
      correct: 1
    },
    {
      number: 5,
      text: "What is the primary constraint of recursive depth in dynamic programming structures?",
      options: [
        "Risk of stack overflow errors due to nesting constraints.",
        "Excessive disk memory lookup times.",
        "Loss of type-safe execution guarantees.",
        "None of the above."
      ],
      correct: 0
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});
  const [visited, setVisited] = useState<Record<number, boolean>>({ 1: true });

  const activeQ = examQuestions[currentIdx];

  // Time tracker (starts at 01:45:22)
  const [secondsLeft, setSecondsLeft] = useState(1 * 3600 + 45 * 60 + 22);

  // Tab switch detected warning metrics (Warining 1 of 3)
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);
  const [warningsCount, setWarningsCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format HH:MM:SS
  const formatTime = (secs: number) => {
    const hh = Math.floor(secs / 3600).toString().padStart(2, "0");
    const mm = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
    const ss = (secs % 60).toString().padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  // Visibility change checking to trigger actual automated tab-switch warnings!
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Trigger tab switch detected overlay
        setWarningsCount((w) => {
          const newW = w + 1;
          setTabSwitchWarning(true);
          return newW;
        });
        
        // Report event back to server database to persist violation forensics
        fetch("/api/proctor/trigger-violation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentName,
            examName: "Data Structures Mid-Term",
            type: "Tab Switch Detected",
            confidence: 98,
            description: "Examinee navigated away from browser browser page."
          })
        }).catch(err => console.error(err));
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [studentName]);

  const handleSelectOption = (optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [activeQ.number]: optIdx }));
  };

  const toggleBookmark = () => {
    setBookmarks((prev) => ({ ...prev, [activeQ.number]: !prev[activeQ.number] }));
  };

  const handleNext = () => {
    if (currentIdx < examQuestions.length - 1) {
      const nextIdx = currentIdx + 1;
      setVisited((prev) => ({ ...prev, [examQuestions[nextIdx].number]: true }));
      setCurrentIdx(nextIdx);
    }
  };

  const handleFinish = () => {
    if (window.confirm("Are you sure you want to finalize and submit this exam session? Your integrity scoring profiles will be audited.")) {
      onExamFinish();
    }
  };

  const manualTriggerTabSwitchDemo = () => {
    setWarningsCount((w) => w + 1);
    setTabSwitchWarning(true);
    // Report
    fetch("/api/proctor/trigger-violation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName,
        examName: "Data Structures Mid-Term",
        type: "Tab Switch Detected",
        confidence: 95,
        description: "Tab focus switch simulation."
      })
    }).catch(err => console.error(err));
  };

  return (
    <div id="active-exam-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Banner Status Bar */}
      <header className="bg-slate-900 border-b border-slate-800 py-3.5 px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[9px] font-mono uppercase bg-red-950/40 text-red-400 border border-red-500/15 py-0.5 px-1.5 rounded font-black tracking-widest animate-pulse">
            SECURE EXAMINATION ENHANCED MODE
          </span>
          <h1 className="text-sm font-bold text-white tracking-tight uppercase font-mono mt-1">Data Structures Mid-Term</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-mono tracking-wider font-black text-white">
              {formatTime(secondsLeft)}
            </span>
          </div>

          <button
            onClick={manualTriggerTabSwitchDemo}
            className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/40 border border-red-500/20 text-[10px] font-mono text-red-300 rounded cursor-pointer"
            title="Demonstrates user-blur warning system overlay"
          >
            🚨 Sim Tab-Switch blur
          </button>

          <button
            onClick={handleFinish}
            className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-mono font-bold text-xs uppercase rounded hover:from-emerald-400 transition-colors cursor-pointer"
          >
            Submit Exam
          </button>
        </div>
      </header>

      {/* Main split dashboard panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        
        {/* Left Column navbar and questions list */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">Question Progression</h3>
            
            {/* Question status Grid (bubbles 1 to 20 as requested) */}
            <div className="grid grid-cols-5 gap-2.5">
              {Array.from({ length: 20 }, (_, i) => {
                const num = i + 1;
                // Since our actual quiz questions has length 5, let's map the rest to sample unvisited bubbles
                const isActual = num <= examQuestions.length;
                const index = num - 1;
                const isSelected = isActual && currentIdx === index;
                const hasAnswer = answers[num] !== undefined;
                const isBookmarked = bookmarks[num];
                const hasVisited = visited[num] || isSelected;

                let bgClass = "bg-slate-950 text-slate-500 border border-slate-850 hover:border-slate-800";
                if (isSelected) {
                  bgClass = "bg-teal-500 text-slate-950 border border-teal-400 font-bold scale-105 shadow-md shadow-teal-500/10";
                } else if (isBookmarked) {
                  bgClass = "bg-slate-950 text-amber-400 border-2 border-amber-500/60";
                } else if (hasAnswer) {
                  bgClass = "bg-teal-500/10 text-teal-300 border border-teal-500/30";
                } else if (hasVisited) {
                  bgClass = "bg-slate-900/60 text-slate-300 border border-slate-800/80";
                }

                return (
                  <button
                    key={num}
                    disabled={!isActual}
                    onClick={() => {
                      setCurrentIdx(index);
                      setVisited((v) => ({ ...v, [num]: true }));
                    }}
                    className={`aspect-square rounded-lg text-xs font-mono font-medium transition-all ${bgClass} cursor-pointer`}
                  >
                    {num.toString().padStart(2, "0")}
                  </button>
                );
              })}
            </div>

            {/* Bubble Legend Index keys */}
            <div className="border-t border-slate-800/60 pt-3 space-y-2 font-mono text-[10px]">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-2.5 h-2.5 rounded bg-teal-500" />
                <span>Active Target</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <span className="w-2.5 h-2.5 rounded bg-teal-500/10 border border-teal-500/30" />
                <span>Answered Questions</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <span className="w-2.5 h-2.5 rounded border-2 border-amber-500/60" />
                <span>Bookmarked Flags</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center active question panel */}
        <main className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Top Indicator */}
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
                Question {activeQ.number} of {examQuestions.length}
              </span>
              <span className="text-xs font-mono text-teal-400">Weight: 5 pts</span>
            </div>

            {/* Question Text */}
            <h2 className="text-sm sm:text-base font-medium text-white leading-relaxed font-sans">
              {activeQ.text}
            </h2>

            {/* Choices Options List */}
            <div className="space-y-2.5 pt-2">
              {activeQ.options.map((opt, oIdx) => {
                const isSelected = answers[activeQ.number] === oIdx;
                
                return (
                  <div
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex gap-3 text-xs leading-relaxed ${
                      isSelected 
                        ? "bg-teal-500/5 border-teal-500 text-teal-200" 
                        : "bg-slate-950/40 border-slate-850 hover:bg-slate-950 hover:border-slate-800 text-slate-300"
                    }`}
                  >
                    <span className="font-mono text-slate-500 font-bold">
                      {String.fromCharCode(65 + oIdx)}.
                    </span>
                    <span className="font-sans">{opt}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-between gap-4 border-t border-slate-800/80 pt-4 mt-6">
            <button
              onClick={toggleBookmark}
              className={`px-4 py-2 border rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                bookmarks[activeQ.number]
                  ? "bg-amber-950/20 border-amber-500 text-amber-300"
                  : "bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {bookmarks[activeQ.number] ? "Bookmarked!" : "Bookmark Item"}
            </button>

            <button
              onClick={handleNext}
              disabled={currentIdx === examQuestions.length - 1}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold uppercase tracking-wider text-slate-250 border border-slate-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
            >
              Save & Next
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </main>

        {/* Right Corner Proctor Webcam Feed and stats overlay */}
        <aside className="lg:col-span-3 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4 relative shadow-lg space-y-3.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span>Bio Proctor Feed</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>
            </div>

            {/* Webcam feed placeholder box */}
            <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-855 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950">
              
              <div className="text-center relative z-10 p-2">
                <img 
                  src="https://api.dicebear.com/7.x/pixel-art/svg?seed=alex&backgroundColor=0f172a" 
                  alt={studentName}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 mx-auto rounded-full border border-slate-800 bg-slate-950/40 p-1"
                />
                
                {/* Calibration points */}
                <div className="absolute inset-x-0 bottom-5 flex justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
              </div>

              {/* Status indicator widget */}
              <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-950/90 border border-slate-850 text-[8px] font-mono font-bold uppercase text-emerald-400 tracking-wider">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Verified LIVE</span>
              </div>

              <div className="absolute inset-0 bg-cyan-950/5 pointer-events-none opacity-20"></div>
            </div>

            <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-850 text-[10.5px] font-mono leading-relaxed text-slate-400 space-y-1">
              <div>Telemetry Status: <strong className="text-emerald-400">Compliant</strong></div>
              <div>Calibration Score: <strong className="text-white">99.4%</strong></div>
              <div>Warnings Counter: <strong className={`font-bold ${warningsCount > 0 ? "text-red-400 animate-pulse" : "text-white"}`}>{warningsCount} of 3</strong></div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Proctored Guidelines
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal font-sans">
              Autonomous Sentinel monitors layout changes, device calibration, out-of-frames, and clickouts. Navigating away from this tab triggers dynamic tab-switch warning blocks.
            </p>
          </div>

        </aside>

      </div>

      {/* --- VISUAL TRIGGER DEMO HIGH-STAKES WARNING OVERLAY --- */}
      {tabSwitchWarning && (
        <div className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in font-sans">
          <div className="w-full max-w-xl bg-slate-900 border border-red-500 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.25)] p-6 space-y-5 text-center">
            
            <div className="w-16 h-16 bg-red-500/10 border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 mx-auto shadow-lg animate-pulse">
              <AlertOctagon className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-widest animate-bounce">
                Security Alert: Tab Changed
              </span>
              <h2 className="text-xl font-black text-white uppercase tracking-tight font-mono">
                High-Stakes Violation Warning
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Our autonomous integrity monitors detected a browser focus switch or active window swap. All actions have been recorded.
              </p>
            </div>

            {/* Webcam Live Shot proof of violation */}
            <div className="relative aspect-video max-w-sm mx-auto bg-slate-950 rounded-xl overflow-hidden border border-red-500/30 flex items-center justify-center">
              <div className="text-center">
                <img 
                  src="https://api.dicebear.com/7.x/pixel-art/svg?seed=alex&backgroundColor=0f172a" 
                  alt={studentName}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 mx-auto rounded-full bg-slate-900 border-2 border-red-500 p-1"
                />
                <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold block mt-2">
                  VIOLATION FEED PROOF CALIBRATION
                </span>
                <p className="text-[9px] text-slate-500 font-mono mt-1">
                  Incident timestamp: {new Date().toLocaleTimeString()}
                </p>
              </div>

              {/* Red Target overlay */}
              <div className="absolute inset-5 border border-dashed border-red-500/30 rounded"></div>
              <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-red-600 text-[8px] font-mono font-bold text-white uppercase">
                WARNINGS: {warningsCount} OF 3
              </span>
            </div>

            <div className="bg-red-950/20 border border-red-500/20 p-3.5 rounded-lg text-left text-xs space-y-1.5">
              <span className="font-bold text-red-300 font-mono text-[10px] uppercase block tracking-wider">Termination Threats Notice:</span>
              <p className="text-slate-350 leading-relaxed">
                If the warning counter exceeds <strong>3 issues</strong>, your active exam session will be terminated immediately. No grade credit will be yielded.
              </p>
            </div>

            <button
              onClick={() => setTabSwitchWarning(false)}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-slate-950 font-black font-mono text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
            >
              I Acknowledge & Resume Examination
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
