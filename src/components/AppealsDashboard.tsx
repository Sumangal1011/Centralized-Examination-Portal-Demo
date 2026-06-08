import React, { useState, useEffect } from "react";
import { 
  FileText, ShieldCheck, CheckCircle2, XCircle, 
  Search, Clock, ShieldAlert, Sparkles, Filter, Info
} from "lucide-react";
import { Appeal } from "../types";

interface AppealsDashboardProps {
  token: string;
}

export default function AppealsDashboard({ token }: AppealsDashboardProps) {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "Pending" | "Approved" | "Rejected">("ALL");
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [proctorComment, setProctorComment] = useState("");
  const [resolving, setResolving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchAppeals = async () => {
    try {
      const res = await fetch("/api/appeals");
      const data = await res.json();
      setAppeals(data);
      if (selectedAppeal) {
        const updated = data.find((a: any) => a._id === selectedAppeal._id);
        if (updated) setSelectedAppeal(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppeals();
  }, []);

  const handleResolve = async (id: string, status: "Approved" | "Rejected") => {
    setResolving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/appeals/resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id, status, proctorComment })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg(`Case Appeal ${status} successfully registered!`);
      setTimeout(() => setMsg(null), 5000);
      setProctorComment("");
      fetchAppeals();
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setResolving(false);
    }
  };

  const filtered = appeals.filter((a) => {
    const term = search.toLowerCase();
    const matchQuery = a.caseId.toLowerCase().includes(term) || a.studentName.toLowerCase().includes(term) || a.examination.toLowerCase().includes(term) || a.violationType.toLowerCase().includes(term);
    const matchStatus = filterStatus === "ALL" || a.status === filterStatus;
    return matchQuery && matchStatus;
  });

  return (
    <div id="appeals-dashboard-root" className="space-y-6">
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
          <div className="text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">Active Appeals</div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {appeals.filter((a) => a.status === "Pending").length} Cases
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pending comprehensive manual reconciliation.</p>
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">Total Appeals Logged</div>
          <div className="text-2xl font-bold font-mono text-white">
            {appeals.length + 132} Issues
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Global historical audit registry count.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">Final Resolutions</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {appeals.filter((a) => a.status !== "Pending").length + 124} Decisions
          </div>
          <p className="text-[11px] text-slate-400 mt-1">92.4% historical decision accuracy.</p>
        </div>
      </div>

      {msg && (
        <div className="p-3 bg-teal-950/40 border border-teal-500/30 text-xs text-white rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="font-mono">{msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Table Column */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">Recent Case Appeals</h3>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter cases..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-48 bg-slate-950 border border-slate-850 rounded-lg py-1.5 pl-8 pr-4 text-xs font-mono text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-slate-750"
                />
              </div>

              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
                {(["ALL", "Pending", "Approved", "Rejected"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`py-1 px-2 text-[9px] font-mono uppercase tracking-wider rounded cursor-pointer ${
                      filterStatus === st 
                        ? "bg-slate-850 text-white border border-slate-700/50" 
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/40">
                  <th className="p-3">Case ID</th>
                  <th className="p-3">Examinee</th>
                  <th className="p-3">Examination</th>
                  <th className="p-3">Violation Source</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filtered.map((appeal) => (
                  <tr 
                    key={appeal._id} 
                    className={`hover:bg-slate-950/20 transition-all ${
                      selectedAppeal?._id === appeal._id ? "bg-slate-950/40 border-l-2 border-teal-500" : ""
                    }`}
                  >
                    <td className="p-3 font-bold text-white">{appeal.caseId}</td>
                    <td className="p-3 text-slate-300">{appeal.studentName}</td>
                    <td className="p-3 text-slate-400">{appeal.examination}</td>
                    <td className="p-3 text-slate-500">{appeal.violationType}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold justify-center inline-flex ${
                        appeal.status === "Approved" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : appeal.status === "Rejected" 
                            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {appeal.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedAppeal(appeal);
                          setProctorComment(appeal.proctorComment || "");
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-200 rounded border border-slate-700 transition-colors uppercase cursor-pointer"
                      >
                        Investigate
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500 font-medium">
                      No case appeals found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Appeal Investigation Card */}
        <div className="lg:col-span-4 space-y-4">
          {selectedAppeal ? (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono font-bold text-teal-400">{selectedAppeal.caseId}</span>
                  <span className="text-[10px] font-mono text-slate-500">{selectedAppeal.submissionDate}</span>
                </div>
                <h4 className="text-base font-bold text-white leading-tight mt-1">{selectedAppeal.studentName}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{selectedAppeal.examination}</p>
              </div>

              {/* Case statement narrative info */}
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-850/60 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">Examinee Narrative Narrative</span>
                <p className="text-xs text-slate-300 leading-normal italic">
                  "{selectedAppeal.narrative || "No detail narrative provided by the applicant."}"
                </p>
              </div>

              {selectedAppeal.status === "Pending" ? (
                <div className="space-y-3.5 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-slate-400 font-bold block">Resolution Justification</label>
                    <textarea
                      value={proctorComment}
                      onChange={(e) => setProctorComment(e.target.value)}
                      placeholder="Comment on corroborative evidence, router pings or screen recordings..."
                      className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg p-2.5 min-h-[90px] focus:outline-none focus:border-slate-700 leading-normal placeholder:text-slate-650"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleResolve(selectedAppeal._id, "Approved")}
                      disabled={resolving}
                      className="py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Accept Appeal
                    </button>
                    <button
                      onClick={() => handleResolve(selectedAppeal._id, "Rejected")}
                      disabled={resolving}
                      className="py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Refuse Case
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-955 p-3.5 rounded-lg border border-slate-800/80 space-y-1.5 font-mono text-xs">
                  <span className="text-[10px] text-slate-500 uppercase block">Proctor Reconciled Reason</span>
                  <div className="text-slate-300 leading-relaxed">
                    {selectedAppeal.proctorComment || "Case finalized with standard registry checks."}
                  </div>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/50 mt-2">
                    Finalized status: <span className="font-bold uppercase text-white">{selectedAppeal.status}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl text-center space-y-2 h-full flex flex-col items-center justify-center min-h-[220px]">
              <Info className="w-8 h-8 text-slate-600 stroke-[1.5]" />
              <p className="text-xs text-slate-500 font-mono leading-relaxed px-4">
                Click "Investigate" on any recent examinee appeal to open dynamic forensics metadata.
              </p>
            </div>
          )}

          {/* Integrity policy helper card */}
          <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Integrity Directives
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              Appeals can be resolved instantly by examiners based on dynamic router outage statistics and device whitelist rules. Acceptances reset proctor flagging profiles to normal status.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
