import React, { useState } from "react";
import { Camera, ShieldCheck, UserCheck, RefreshCw } from "lucide-react";

interface IdentityVerificationProps {
  studentName: string;
  onVerificationComplete: () => void;
}

export default function IdentityVerification({ studentName, onVerificationComplete }: IdentityVerificationProps) {
  const [step, setStep] = useState<"align" | "capture" | "evaluating" | "success">("align");
  const [countdown, setCountdown] = useState(3);

  const startAnalysis = () => {
    setStep("evaluating");
    let currentCount = 3;
    setCountdown(3);

    const interval = setInterval(() => {
      currentCount--;
      setCountdown(currentCount);
      if (currentCount <= 0) {
        clearInterval(interval);
        setStep("success");
      }
    }, 1000);
  };

  return (
    <div id="identity-verification-root" className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Step Titles */}
        <div className="text-center space-y-1.5 border-b border-slate-800 pb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold">Security Step 1 of 2</span>
          <h2 className="text-lg font-bold text-white tracking-tight uppercase">Identity Biometric Verification</h2>
          <p className="text-xs text-slate-400">
            Align your face within standard biometric scopes to calibrate the high-stakes proctor telemetry.
          </p>
        </div>

        {/* Dynamic Scan Canvas Screen */}
        <div className="aspect-video bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950">
          
          {step === "align" && (
            <div className="text-center space-y-4 relative z-10 w-full p-4">
              
              {/* Elliptical Scan Reticle */}
              <div className="w-36 h-48 mx-auto border-2 border-dashed border-teal-500/50 rounded-full flex items-center justify-center relative animate-pulse">
                <img 
                  src="https://api.dicebear.com/7.x/pixel-art/svg?seed=alex&backgroundColor=0f172a" 
                  alt={studentName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-full p-2 opacity-50"
                />
                {/* Crosshairs */}
                <span className="absolute left-1/2 -top-2.5 transform -translate-x-1/2 w-4 h-1 bg-teal-400"></span>
                <span className="absolute left-1/2 -bottom-2.5 transform -translate-x-1/2 w-4 h-1 bg-teal-400"></span>
                <span className="absolute -left-2.5 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-teal-400"></span>
                <span className="absolute -right-2.5 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-teal-400"></span>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Align your face inside of the alignment markers.
              </div>
            </div>
          )}

          {step === "evaluating" && (
            <div className="text-center space-y-4 relative z-10">
              <RefreshCw className="w-10 h-10 text-teal-400 animate-spin mx-auto" />
              <div className="text-sm font-mono text-teal-400 font-bold uppercase tracking-wider animate-pulse">
                Simulating Facial Scanning // {countdown}s
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Running 1024-point mathematical triangulation comparison
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="text-center space-y-3 relative z-10">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <UserCheck className="w-8 h-8" />
              </div>
              <div className="text-base font-bold font-mono text-emerald-400 uppercase tracking-widest">
                VERIFICATION MATCH!
              </div>
              <p className="text-xs text-slate-400 font-sans max-w-xs leading-relaxed">
                Matches institutional records for <strong>{studentName}</strong>. Calibration locked.
              </p>
            </div>
          )}

          {/* Canvas Static Filter Overlay */}
          <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-b from-transparent via-cyan-950/5 to-transparent pointer-events-none opacity-20"></div>
        </div>

        {/* Bottom instructions, buttons */}
        <div className="space-y-4 pt-2">
          {step === "align" && (
            <button
              onClick={startAnalysis}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-teal-500/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              Capture & Verify Biometrics
            </button>
          )}

          {step === "success" && (
            <button
              onClick={onVerificationComplete}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black font-mono text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-emerald-500/10 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Approve & Launch Data Structures Exam
            </button>
          )}

          {/* Privacy statement info */}
          <div className="text-[10px] text-slate-500 leading-normal font-sans border-t border-slate-800/60 pt-3 text-center">
            🔒 Institutional Biometric Privacy Policy: Facial calibration credentials are never stored externally or transmitted to public web spaces. Scanning handles verification locally within sandbox scopes.
          </div>
        </div>

      </div>
    </div>
  );
}
