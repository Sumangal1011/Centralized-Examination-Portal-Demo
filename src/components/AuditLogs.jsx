import React, { useState, useEffect } from "react";
import { Info, AlertTriangle, ShieldCheck, Search, Filter } from "lucide-react";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/audit-logs");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = logs.filter((log) => {
    const term = search.toLowerCase();
    const matchesQuery = log.action.toLowerCase().includes(term) || log.user.toLowerCase().includes(term) || log.details.toLowerCase().includes(term);
    const matchesSeverity = severityFilter === "ALL" || log.severity === severityFilter;
    return matchesQuery && matchesSeverity;
  });

  return (
    <div id="audit-logs-root" className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">Departmental Audit Registry</h3>
          <p className="text-xs text-slate-400 mt-1 leading-normal font-sans">
            Verifiably track proctoring, administrative setups, registration updates, and candidate behavioral actions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search audit actions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950 border border-slate-850 rounded-lg py-1 pl-8 pr-4 text-xs font-mono text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-slate-755"
            />
          </div>

          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
            {["ALL", "info", "warning", "error"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`py-1 px-2 text-[9px] font-mono uppercase tracking-wider rounded cursor-pointer ${
                  severityFilter === sev 
                    ? "bg-slate-850 text-white" 
                    : "text-slate-500 hover:text-slate-350"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto text-xs font-mono">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/30">
              <th className="p-3 w-1/5">Timestamp</th>
              <th className="p-3 w-1/5">Action Name</th>
              <th className="p-3 w-1/6">Triggered User</th>
              <th className="p-3 w-2/5">Reconciliation Details</th>
              <th className="p-3 text-right">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/20">
            {filtered.map((log) => (
              <tr key={log._id} className="hover:bg-slate-950/10">
                <td className="p-3 text-slate-500">{log.timestamp}</td>
                <td className="p-3 font-semibold text-white">{log.action}</td>
                <td className="p-3 text-slate-300">{log.user}</td>
                <td className="p-3 text-slate-400 font-sans tracking-wide leading-relaxed">{log.details}</td>
                <td className="p-3 text-right">
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold justify-center inline-flex ${
                    log.severity === "error" 
                      ? "bg-red-500/10 text-red-00 border border-red-500/20" 
                      : log.severity === "warning" 
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                        : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                  }`}>
                    {log.severity}
                  </span>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500 font-medium">
                  No audited registry indicators found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
