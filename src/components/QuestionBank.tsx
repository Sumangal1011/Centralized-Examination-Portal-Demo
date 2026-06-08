import React, { useState, useEffect } from "react";
import { 
  Sparkles, Search, Plus, Trash2, Filter, 
  UploadCloud, Brain, HelpCircle, CheckCircle2, ChevronRight, RefreshCw
} from "lucide-react";
import { Question } from "../types";

interface QuestionBankProps {
  token: string;
}

export default function QuestionBank({ token }: QuestionBankProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filtDifficulty, setFiltDifficulty] = useState<"ALL" | "Easy" | "Medium" | "Hard">("ALL");

  // New Question form
  const [newText, setNewText] = useState("");
  const [newType, setNewType] = useState<"Multiple Choice" | "Short Answer" | "Coding">("Multiple Choice");
  const [newDiff, setNewDiff] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [newMarks, setNewMarks] = useState(5);
  const [newSubject, setNewSubject] = useState("Data Structures");

  // AI Syllabus generator state
  const [syllabusInput, setSyllabusInput] = useState("");
  const [aiDiff, setAiDiff] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [aiCount, setAiCount] = useState(3);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Question[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText) return;
    setErrorMsg(null);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          questionText: newText,
          type: newType,
          difficulty: newDiff,
          marks: newMarks,
          subject: newSubject
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setNewText("");
      setSuccessMsg("Question registered successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
      fetchQuestions();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        setSuccessMsg("Question removed from curriculum.");
        setTimeout(() => setSuccessMsg(null), 4000);
        fetchQuestions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAiGenerate = async () => {
    if (!syllabusInput) {
      setErrorMsg("Please enter syllabus descriptors/topics first to guide AI generation!");
      return;
    }
    setErrorMsg(null);
    setIsAiGenerating(true);
    setAiSuggestions([]);

    try {
      const res = await fetch("/api/gemini/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          syllabusText: syllabusInput,
          difficulty: aiDiff,
          count: aiCount
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed API response");

      setAiSuggestions(data.questions || []);
      setSuccessMsg(`Simulated AI analysis complete! Generated ${data.questions?.length || 0} proposals.`);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred with the Gemini model pipeline.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleApproveAiSuggestion = async (suggested: Question, index: number) => {
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          questionText: suggested.questionText,
          type: suggested.type,
          difficulty: suggested.difficulty,
          marks: suggested.marks,
          subject: suggested.subject
        })
      });
      if (res.ok) {
        // Remove from list
        setAiSuggestions((prev) => prev.filter((_, idx) => idx !== index));
        setSuccessMsg("Approved AI Question has been migrated to main curriculum!");
        setTimeout(() => setSuccessMsg(null), 4000);
        fetchQuestions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = questions.filter((q) => {
    const term = search.toLowerCase();
    const matchTerm = q.questionText.toLowerCase().includes(term) || q.subject.toLowerCase().includes(term) || q.type.toLowerCase().includes(term);
    const matchDiff = filtDifficulty === "ALL" || q.difficulty === filtDifficulty;
    return matchTerm && matchDiff;
  });

  return (
    <div id="question-bank-root" className="space-y-6">
      
      {/* AI Supercharge Curation Section */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden space-y-4">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">AI Question Curation Hub</h3>
              <p className="text-xs text-slate-400 mt-1">Supercharge your evaluations by inputting syllabus details to generate rigorous questions via Gemini 3.5 Flash.</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-850 text-slate-500">
            Powered by Google GenAI
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">Syllabus Excerpts or Core Topic Descriptors</label>
              <textarea
                value={syllabusInput}
                onChange={(e) => setSyllabusInput(e.target.value)}
                placeholder="Example: Data structures including doubly-linked lists, binary search trees, worst-case rotation rules in Red-Black trees or QuickSort recursion pivot analysis..."
                className="w-full min-h-[90px] bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-slate-700 leading-normal"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">Difficulty:</span>
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
                  {(["Easy", "Medium", "Hard"] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setAiDiff(diff)}
                      className={`py-1 px-2.5 text-[10px] font-mono rounded cursor-pointer ${
                        aiDiff === diff ? "bg-slate-800 text-white border border-slate-700/50" : "text-slate-500 hover:text-slate-350"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">Amount:</span>
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
                  {([1, 3, 5] as const).map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => setAiCount(cnt)}
                      className={`py-1 px-2 text-[10px] font-mono rounded cursor-pointer ${
                        aiCount === cnt ? "bg-slate-800 text-white border border-slate-700/50" : "text-slate-500 hover:text-slate-350"
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={isAiGenerating}
                className="ml-auto py-2 px-5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-teal-500/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isAiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-4 h-4" />}
                {isAiGenerating ? "Assembling Context..." : "AI Generate Questions"}
              </button>
            </div>
          </div>

          {/* AI Suggested Sidebar Column */}
          <div className="lg:col-span-4 bg-slate-950/60 p-4 border border-slate-850/60 rounded-xl space-y-3 max-h-[220px] overflow-y-auto">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">AI Suggestion Deck</span>
            
            <div className="space-y-2">
              {aiSuggestions.map((s, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
                  <p className="text-[11px] text-slate-300 font-sans line-clamp-2 leading-relaxed">
                    {s.questionText}
                  </p>
                  <div className="flex items-center justify-between gap-2 border-t border-slate-800/40 pt-1.5 text-[10px] font-mono">
                    <span className="text-teal-400 font-bold uppercase">{s.difficulty} // {s.marks}M</span>
                    <button
                      onClick={() => handleApproveAiSuggestion(s, idx)}
                      className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-semibold rounded text-[9px] hover:bg-emerald-400 transition-colors uppercase cursor-pointer"
                    >
                      Approve list
                    </button>
                  </div>
                </div>
              ))}

              {aiSuggestions.length === 0 && (
                <div className="text-center py-6 text-slate-550 font-mono text-[11px] leading-relaxed">
                  {isAiGenerating ? "Gemini model working..." : "Syllabus analyzer offline. Input topics and request AI generation above."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-950/40 border border-red-500/30 text-xs text-red-300 rounded-lg">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-teal-950/40 border border-teal-500/30 text-xs text-teal-350 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Curriculum Table */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">Main Curriculum Syllabus</h3>
            
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter curriculum..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-850 rounded-lg py-1 pl-8 pr-4 text-xs font-mono text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-slate-750"
                />
              </div>

              <div className="flex bg-slate-950 p-1 rounded border border-slate-850">
                {(["ALL", "Easy", "Medium", "Hard"] as const).map((df) => (
                  <button
                    key={df}
                    onClick={() => setFiltDifficulty(df)}
                    className={`py-0.5 px-2 text-[9px] font-mono uppercase tracking-wider rounded cursor-pointer ${
                      filtDifficulty === df ? "bg-slate-850 text-white" : "text-slate-500 hover:text-slate-350"
                    }`}
                  >
                    {df}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto text-xs font-mono">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/30">
                  <th className="p-3 w-3/5">Question Text</th>
                  <th className="p-3 text-center">Type</th>
                  <th className="p-3 text-center">Difficulty</th>
                  <th className="p-3 text-center">Marks</th>
                  <th className="p-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {filtered.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-950/10">
                    <td className="p-3 text-slate-250 leading-relaxed font-sans">{q.questionText}</td>
                    <td className="p-3 text-center text-slate-400">{q.type}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold leading-none ${
                        q.difficulty === "Easy" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : q.difficulty === "Medium" 
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                            : "bg-red-500/10 text-red-00 text-red-400 border border-red-500/20"
                      }`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-white">{q.marks} pts</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="p-1.5 hover:bg-red-950/20 text-slate-500 hover:text-red-400 rounded transition-colors cursor-pointer border border-transparent hover:border-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500 font-medium font-sans">
                      No active questions registered. Populate manually or utilize the AI Generator.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manual Addition Sidebar Column */}
        <div className="lg:col-span-4">
          <form onSubmit={handleAddQuestion} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5 border-b border-slate-820 pb-2">
              <Plus className="w-4.5 h-4.5 text-teal-400" />
              Manual Question Registry
            </h4>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 uppercase">Question Formulation</label>
              <textarea
                required
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Draft curriculum question text explicitly..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg p-2.5 min-h-[80px] focus:outline-none focus:border-slate-700 leading-normal"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Question Type</label>
                <select
                  value={newType}
                  onChange={(e: any) => setNewType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2 text-xs font-mono text-slate-300 focus:outline-none"
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="Short Answer">Short Answer</option>
                  <option value="Coding">Coding</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Marks Weight</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="50"
                  value={newMarks}
                  onChange={(e) => setNewMarks(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2.5 text-xs font-mono text-slate-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Difficulty</label>
                <select
                  value={newDiff}
                  onChange={(e: any) => setNewDiff(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2 text-xs font-mono text-slate-300 focus:outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Subject</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2.5 text-xs font-mono text-slate-300 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-xs font-bold font-mono uppercase tracking-wider rounded-lg border border-slate-700 hover:text-white transition-colors cursor-pointer"
            >
              Push into curriculum
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
