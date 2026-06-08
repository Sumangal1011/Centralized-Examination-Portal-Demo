import React, { useState } from "react";
import { Shield, Lock, User, UserCheck, Key, ShieldAlert } from "lucide-react";

export default function LoginScreen({ onLoginSuccess }) {
  const [role, setRole] = useState("examiner");
  const [username, setUsername] = useState("examiner");
  const [password, setPassword] = useState("password");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Set default credentials on role switch for quick demo convenience
  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    if (!isRegister) {
      if (selectedRole === "admin") {
        setUsername("admin");
        setPassword("admin123");
      } else if (selectedRole === "examiner") {
        setUsername("examiner");
        setPassword("examiner123");
      } else {
        setUsername("student");
        setPassword("student123");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const body = { username, password, role };
    if (isRegister) {
      body.name = name || username.charAt(0).toUpperCase() + username.slice(1);
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      onLoginSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const triggerRegisterDemo = () => {
    setIsRegister(!isRegister);
    setError(null);
    setName("");
    if (!isRegister) {
      setUsername("new_user");
      setPassword("password123");
    } else {
      handleRoleChange(role);
    }
  };

  return (
    <div id="login-screen-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-teal-500 selection:text-slate-950 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Banner with secure indicators */}
        <div className="bg-slate-950 p-6 border-b border-slate-800 text-center flex flex-col items-center relative">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-teal-400">SSL Secure</span>
          </div>
          
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-slate-955 mb-3 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
            <Shield className="w-6 h-6 stroke-[2]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-mono">EXAMPORTAL</h1>
          <p className="text-xs text-slate-400 mt-1">Autonomous Integrity Adjudication Service</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Action Tabs for Roles */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono text-slate-405 uppercase tracking-wider">Select Credentials Scope</span>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800/80 text-slate-300">
              {["student", "examiner", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={`py-1.5 px-2 rounded font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    role === r
                      ? "bg-slate-800 text-white shadow-sm border border-slate-705"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Message */}
          {error && (
            <div className="p-3 bg-red-955/50 border border-red-500/30 rounded-lg flex items-start gap-2.5 text-xs text-red-300">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Input Fields */}
          <div className="space-y-3">
            {isRegister && (
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400 uppercase">Title / Full Name</label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-2.5 w-4 h-4 text-slate-505" />
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-100 placeholder:text-slate-650 focus:outline-none focus:border-teal-500/70 transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 uppercase">Username ID</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-505" />
                <input
                  type="text"
                  required
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-100 placeholder:text-slate-650 focus:outline-none focus:border-teal-500/70 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono text-slate-400 uppercase">Access Pass Key</label>
                <span className="text-[10px] text-teal-405 font-mono hover:underline cursor-pointer">SSO Active</span>
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-505" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-100 placeholder:text-slate-650 focus:outline-none focus:border-teal-500/70 transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-955 font-semibold rounded-lg py-2.5 text-sm transition-all focus:outline-none shadow-md shadow-teal-500/10 cursor-pointer flex justify-center items-center gap-1.5"
          >
            <Lock className="w-4 h-4" />
            {loading ? "Decrypting Key Security..." : isRegister ? "Generate Secure Account" : `Authorize Secure ${role.toUpperCase()}`}
          </button>

          <div className="text-center pt-2">
            <span
              onClick={triggerRegisterDemo}
              className="text-xs text-slate-500 hover:text-slate-350 transition-colors cursor-pointer"
            >
              {isRegister ? "Already registered? Return to Login" : "Or setup a new demo audit role? Register here"}
            </span>
          </div>

        </form>

        <div className="bg-slate-950/80 px-6 py-4 border-t border-slate-800/60 flex flex-col gap-1.5">
          <div className="text-[10px] font-mono text-slate-505 uppercase tracking-widest text-center">Demo Fast Credentials</div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
            <div className="bg-slate-900 border border-slate-800 p-1.5 rounded text-center">
              <span className="text-teal-450 font-bold block">STUDENT MODE</span>
              <span className="text-[10px] text-slate-500">student / student123</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-1.5 rounded text-center">
              <span className="text-cyan-455 font-bold block">EXAMINER MODE</span>
              <span className="text-[10px] text-slate-500">examiner / examiner123</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
