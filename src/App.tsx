import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, Shield, Radio, FileText, BarChart3, 
  HelpCircle, Settings, LogOut, LayoutGrid, Sliders, ChevronRight 
} from "lucide-react";
import LoginScreen from "./components/LoginScreen";
import CommandCenter from "./components/CommandCenter";
import ViolationReview from "./components/ViolationReview";
import AppealsDashboard from "./components/AppealsDashboard";
import QuestionBank from "./components/QuestionBank";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import IdentityVerification from "./components/IdentityVerification";
import ActiveExam from "./components/ActiveExam";
import AuditLogs from "./components/AuditLogs";

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<{ username: string; role: "student" | "examiner" | "admin"; name: string } | null>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
  );

  // Examiner active sidebar tabs: overview, appeals, analytics, review, curation, audits
  const [activeTab, setActiveTab] = useState<"overview" | "appeals" | "analytics" | "review" | "curation" | "audits">("overview");
  const [selectedStudentForReview, setSelectedStudentForReview] = useState<string>("Alex Johnson");

  // Student stages: verify, testing, finished
  const [studentStage, setStudentStage] = useState<"verify" | "testing" | "finished">("verify");

  const handleLoginSuccess = (newToken: string, loggedInUser: { username: string; role: "student" | "examiner" | "admin"; name: string }) => {
    setToken(newToken);
    setUser(loggedInUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    // Reset workflow
    setStudentStage("verify");
    setActiveTab("overview");
  };

  const handleSignOut = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Auto identify session validation
  useEffect(() => {
    if (token) {
      fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then((res) => {
        if (!res.ok) {
          handleSignOut();
        }
      })
      .catch(() => {
        // Safe keeping if server is booting up
      });
    }
  }, [token]);

  const navigateToReview = (studentName: string) => {
    setSelectedStudentForReview(studentName);
    setActiveTab("review");
  };

  // If not authenticated, force login screen
  if (!token || !user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // STUDENT VIEW CONTAINER
  if (user.role === "student") {
    if (studentStage === "verify") {
      return (
        <IdentityVerification 
          studentName={user.name} 
          onVerificationComplete={() => setStudentStage("testing")} 
        />
      );
    }

    if (studentStage === "testing") {
      return (
        <ActiveExam 
          studentName={user.name} 
          onExamFinish={() => setStudentStage("finished")} 
        />
      );
    }

    if (studentStage === "finished") {
      return (
        <div id="student-summary" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 font-sans selection:bg-teal-500 selection:text-slate-950">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto animate-pulse">
              <ShieldCheck className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase bg-emerald-950/40 text-emerald-400 border border-emerald-500/15 py-0.5 px-1.5 rounded font-bold tracking-widest">
                SESSION SUBMISSION RECEIVED
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight leading-tight uppercase font-mono mt-2">
                Exam Finalized Successfully
              </h2>
              <p className="text-xs text-slate-400 leading-normal max-w-sm mx-auto">
                Thank you, <strong>{user.name}</strong>. Your answers and proctoring logs have been compiled & sealed inside the institutional academic database.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-xs text-left text-slate-400 space-y-1.5">
              <div>Session Status: <strong className="text-emerald-400 uppercase">Sealed</strong></div>
              <div>Integrity Threats Recorded: <strong className="text-white">0 Flags Added</strong></div>
              <div>Calibration Match Code: <strong className="text-slate-200">DSA-6019-X</strong></div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold font-mono uppercase tracking-wider rounded-lg border border-slate-700 hover:text-white transition-colors cursor-pointer"
            >
              Sign Out Securely
            </button>
          </div>
        </div>
      );
    }
  }

  // EXAMINER & ADMIN DASHBOARD CONTAINER
  return (
    <div id="dashboard-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-teal-500 selection:text-slate-950">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-slate-900 lg:border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Logo with indicator */}
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(20,184,166,0.25)]">
              <Shield className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase text-teal-400 tracking-wider">ExamAudit Pro</span>
              <h2 className="text-xs font-bold font-mono tracking-tight text-white leading-none">COMMAND CENTER</h2>
            </div>
          </div>

          {/* User profile details */}
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-850 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-100 border border-slate-700">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-white truncate leading-tight">{user.name}</h4>
              <span className="text-[10px] uppercase font-mono text-slate-500 font-medium">
                {user.role} Module
              </span>
            </div>
          </div>

          {/* Active Navigation Menu links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeTab === "overview" 
                  ? "bg-slate-800 text-white font-bold border-l-2 border-teal-500" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <span className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-slate-400" />
                Live Proctoring
              </span>
              <ChevronRight className={`w-3 h-3 text-slate-500 transition-transform ${activeTab === "overview" ? "rotate-90" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("review")}
              className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeTab === "review" 
                  ? "bg-slate-800 text-white font-bold border-l-2 border-teal-500" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-400" />
                Forensic Review
              </span>
              <ChevronRight className={`w-3 h-3 text-slate-500 transition-transform ${activeTab === "review" ? "rotate-90" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("curation")}
              className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeTab === "curation" 
                  ? "bg-slate-800 text-white font-bold border-l-2 border-teal-500" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-slate-400" />
                Question Bank
              </span>
              <ChevronRight className={`w-3 h-3 text-slate-500 transition-transform ${activeTab === "curation" ? "rotate-90" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("appeals")}
              className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeTab === "appeals" 
                  ? "bg-slate-800 text-white font-bold border-l-2 border-teal-500" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Appeals Dashboard
              </span>
              <ChevronRight className={`w-3 h-3 text-slate-500 transition-transform ${activeTab === "appeals" ? "rotate-90" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeTab === "analytics" 
                  ? "bg-slate-800 text-white font-bold border-l-2 border-teal-500" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-400" />
                Analytics & Reports
              </span>
              <ChevronRight className={`w-3 h-3 text-slate-500 transition-transform ${activeTab === "analytics" ? "rotate-90" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("audits")}
              className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeTab === "audits" 
                  ? "bg-slate-800 text-white font-bold border-l-2 border-teal-500" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                System Audit Logs
              </span>
              <ChevronRight className={`w-3 h-3 text-slate-500 transition-transform ${activeTab === "audits" ? "rotate-90" : ""}`} />
            </button>
          </nav>
        </div>

        {/* Sign Out Trigger */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-950/20 cursor-pointer border border-transparent hover:border-red-500/15 transition-all mt-6"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out Registry
          </span>
        </button>
      </aside>

      {/* Main Content Workspace viewport */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        
        {/* Top Header line */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase font-mono">
              {activeTab === "overview" && "Live Proctoring Monitor"}
              {activeTab === "review" && `Forensic Audit Review: ${selectedStudentForReview}`}
              {activeTab === "curation" && "Academic Curriculum Bank"}
              {activeTab === "appeals" && "Institutions Appeals Registry"}
              {activeTab === "analytics" && "Analytical Performance Deck"}
              {activeTab === "audits" && "Institutional Audit Log"}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === "overview" && "Monitor real-time student video arrays and AI telemetry triggers."}
              {activeTab === "review" && "Forensically reconstruct student behavioral timelines and submit panel verdicts."}
              {activeTab === "curation" && "Curate test evaluations and generate rigorous exam questions via Gemini AI."}
              {activeTab === "appeals" && "Verify and reconcile student policy exemption appeals with full accountability."}
              {activeTab === "analytics" && "Visualize pass patterns, difficulty curves, and download compliance reports."}
              {activeTab === "audits" && "Inspect institutional compliance and proctoring activity logs."}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-mono uppercase text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
            <span>Server Live Node Connection</span>
          </div>
        </div>

        {/* Content View routers */}
        {activeTab === "overview" && (
          <CommandCenter 
            token={token} 
            onSelectStudentForReview={navigateToReview} 
          />
        )}

        {activeTab === "review" && (
          <ViolationReview 
            token={token} 
            selectedStudentName={selectedStudentForReview}
            onAdjudicationSuccess={() => {}}
          />
        )}

        {activeTab === "curation" && (
          <QuestionBank token={token} />
        )}

        {activeTab === "appeals" && (
          <AppealsDashboard token={token} />
        )}

        {activeTab === "analytics" && (
          <AnalyticsDashboard />
        )}

        {activeTab === "audits" && (
          <AuditLogs />
        )}

      </main>

    </div>
  );
}
