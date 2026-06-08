export type UserRole = "student" | "examiner" | "admin";

export interface User {
  _id: string;
  username: string;
  role: UserRole;
  name: string;
}

export interface Appeal {
  _id: string;
  caseId: string;
  studentName: string;
  examination: string;
  violationType: string;
  status: "Pending" | "Approved" | "Rejected";
  submissionDate: string;
  narrative?: string;
  proctorComment?: string;
}

export interface Question {
  _id: string;
  questionText: string;
  type: "Multiple Choice" | "Short Answer" | "Coding";
  difficulty: "Easy" | "Medium" | "Hard";
  marks: number;
  subject: string;
  isAiSuggested?: boolean;
}

export interface SystemAudit {
  _id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  severity: "info" | "warning" | "error";
}

export interface ProctorStudent {
  _id: string;
  name: string;
  examName: string;
  riskScore: number; // 0 to 100
  status: "Verified" | "Suspicious" | "Flagged";
  lastActive: string;
  violationsCount: number;
  avatarSeed: string;
}

export interface ViolationIncident {
  _id: string;
  studentName: string;
  examName: string;
  incidentType: string;
  confidence: number; // 0 to 100
  timestamp: string;
  status: "Flagged" | "Reviewed" | "Resolved";
  videoUrl?: string;
  timelineLogs: Array<{
    time: string;
    type: string;
    confidence: number;
    description: string;
  }>;
  proctorNotes?: string;
  verdict?: "Dismissed" | "Warned" | "Nullified";
}
