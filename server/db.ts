import fs from "fs";
import path from "path";
import { MongoClient, Db } from "mongodb";

// Simulating MongoDB shell/Mongoose with file-backed storage
const DB_FILE = path.join(process.cwd(), "data", "db_store.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_FILE))) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}

interface DBStructure {
  users: any[];
  appeals: any[];
  questions: any[];
  proctorStudents: any[];
  violationIncidents: any[];
  audits: any[];
}

const DEFAULT_DB: DBStructure = {
  users: [
    { _id: "u1", username: "admin", password: "pbkdf2_sha256$somehash$admin123", role: "admin", name: "Dr. Catherine Vance" },
    { _id: "u2", username: "examiner", password: "pbkdf2_sha256$somehash$examiner123", role: "examiner", name: "Prof. Arthur Pendelton" },
    { _id: "u3", username: "student", password: "pbkdf2_sha256$somehash$student123", role: "student", name: "Alex Johnson" }
  ],
  appeals: [
    { _id: "app1", caseId: "CASE-4091", studentName: "Liam Thompson", examination: "Operating Systems Final", violationType: "Secondary Device Detected", status: "Pending", submissionDate: "June 05, 2026", narrative: "The secondary device was indeed my calculator which was approved by the course outline. It was mistaken for a smart phone." },
    { _id: "app2", caseId: "CASE-3892", studentName: "Sarah Chen", examination: "Advanced Algorithms", violationType: "Multiple Retakes / Out-of-Frame", status: "Approved", submissionDate: "June 03, 2026", narrative: "My connection dropped repeatedly due to storm outages and I had to lean over to restart the router. The proctor was notified, but the system auto-flagged.", proctorComment: "Approved. Verified router reset logs match timeline." },
    { _id: "app3", caseId: "CASE-3742", studentName: "Marcus Wright", examination: "Discrete Mathematics", violationType: "Tab Switching Detected", status: "Rejected", submissionDate: "May 28, 2026", narrative: "I accidentally clicked a popup notification of my system update.", proctorComment: "Appealed tab-switching logs show 14 distinct switches and Google Search query strings for mathematics formulas." }
  ],
  questions: [
    { _id: "q1", questionText: "What is correct about a circular doubly linked list's prev pointer in the head node?", type: "Multiple Choice", difficulty: "Medium", marks: 5, subject: "Data Structures", isAiSuggested: false },
    { _id: "q2", questionText: "Explain how average-case complexity is derived for Quicksort, and state why the worst-case occurs.", type: "Short Answer", difficulty: "Hard", marks: 10, subject: "Algorithms", isAiSuggested: false },
    { _id: "q3", questionText: "Implement a function that reverses a singly linked list in-place. Provide O(N) time and O(1) space complexity.", type: "Coding", difficulty: "Medium", marks: 15, subject: "Data Structures", isAiSuggested: false },
    { _id: "q4", questionText: "What is the time complexity of lookup in a Red-Black tree in the worst case?", type: "Multiple Choice", difficulty: "Easy", marks: 5, subject: "Data Structures", isAiSuggested: false }
  ],
  proctorStudents: [
    { _id: "p1", name: "Alex Johnson", examName: "Data Structures Mid-Term", riskScore: 65, status: "Suspicious", lastActive: "Just now", violationsCount: 2, avatarSeed: "alex" },
    { _id: "p2", name: "Sarah Chen", examName: "Algorithms Mid-Term", riskScore: 15, status: "Verified", lastActive: "3s ago", violationsCount: 0, avatarSeed: "sarah" },
    { _id: "p3", name: "Marcus Wright", examName: "Discrete Mathematics Mid-Term", riskScore: 32, status: "Verified", lastActive: "1m ago", violationsCount: 0, avatarSeed: "marcus" },
    { _id: "p4", name: "Elena Rodriguez", examName: "Data Structures Mid-Term", riskScore: 12, status: "Verified", lastActive: "2m ago", violationsCount: 0, avatarSeed: "elena" },
    { _id: "p5", name: "Liam Thompson", examName: "Operating Systems Final", riskScore: 88, status: "Flagged", lastActive: "10s ago", violationsCount: 4, avatarSeed: "liam" },
    { _id: "p6", name: "Priya Patel", examName: "Algorithms Mid-Term", riskScore: 5, status: "Verified", lastActive: "5m ago", violationsCount: 0, avatarSeed: "priya" }
  ],
  violationIncidents: [
    {
      _id: "v1",
      studentName: "Alex Johnson",
      examName: "Data Structures Mid-Term",
      incidentType: "Tab Switch Detected",
      confidence: 94,
      timestamp: "14:32:05",
      status: "Flagged",
      timelineLogs: [
        { time: "14:15:10", type: "Identity Verified", confidence: 99, description: "Facial authentication successful." },
        { time: "14:22:45", type: "Face Not Aligned", confidence: 60, description: "Candidate drifted left out of bounds." },
        { time: "14:32:05", type: "Tab Switch Detected", confidence: 94, description: "Active browser tab changed to external resource." },
        { time: "14:35:12", type: "Tab Switch Detected", confidence: 97, description: "Opened second desktop browser session." }
      ],
      proctorNotes: ""
    }
  ],
  audits: [
    { _id: "au1", action: "User Registration", user: "System", timestamp: "2026-06-08 09:00:00", details: "Bootstrapped system user accounts and roles.", severity: "info" },
    { _id: "au2", action: "Policy Violation Logged", user: "Sentinel AI Engine", timestamp: "2026-06-08 14:32:05", details: "Auto-flagged student Alex Johnson. Incident: Tab Switch Detected.", severity: "warning" },
    { _id: "au3", action: "Appeal Response", user: "Prof. Arthur Pendelton", timestamp: "2026-06-08 11:15:20", details: "Case ID CASE-3892 marked Approved. Notes: verified router outages.", severity: "info" }
  ]
};

// Global MongoDB Database references
let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;
const mongoUri = process.env.MONGODB_URI;

// Initialize dynamic connection and seeds
export async function initDB() {
  if (mongoUri) {
    try {
      console.log("Connecting to real MongoDB database at:", mongoUri.split("@").pop());
      mongoClient = new MongoClient(mongoUri);
      await mongoClient.connect();
      mongoDb = mongoClient.db();
      console.log("Successfully connected to MongoDB.");

      // Seed any missing collections
      const collections = Object.keys(DEFAULT_DB) as (keyof DBStructure)[];
      for (const colName of collections) {
        const col = mongoDb.collection(colName);
        const count = await col.countDocuments();
        if (count === 0) {
          console.log(`Seeding MongoDB collection: ${colName}`);
          await col.insertMany(DEFAULT_DB[colName]);
        }
      }
    } catch (e) {
      console.error("MongoDB init failed, reverting to local disk fallback:", e);
      mongoDb = null;
      initFileDB();
    }
  } else {
    initFileDB();
  }
}

function initFileDB() {
  if (!fs.existsSync(DB_FILE)) {
    saveToDisk(DEFAULT_DB);
  } else {
    // Read and merge any missing fields
    try {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
      let updated = false;
      const keys = Object.keys(DEFAULT_DB) as (keyof DBStructure)[];
      for (const k of keys) {
        if (!parsed[k]) {
          parsed[k] = DEFAULT_DB[k];
          updated = true;
        }
      }
      if (updated) {
        saveToDisk(parsed);
      }
    } catch (e) {
      saveToDisk(DEFAULT_DB);
    }
  }
}

function readFromDisk(): DBStructure {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch (e) {
    return DEFAULT_DB;
  }
}

function saveToDisk(data: DBStructure) {
  // Ensure folder exists (double-check)
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Model simulation
class Collection<T extends { _id: string }> {
  private key: keyof DBStructure;

  constructor(key: keyof DBStructure) {
    this.key = key;
  }

  async find(query: Partial<T> = {}): Promise<T[]> {
    if (mongoDb) {
      try {
        const list = await mongoDb.collection(this.key).find(query as any).toArray();
        return list as unknown as T[];
      } catch (err) {
        console.error(`MongoDB find error on ${this.key}:`, err);
      }
    }

    const data = readFromDisk();
    const list = (data[this.key] || []) as T[];
    return list.filter((item: any) => {
      for (const qKey in query) {
        if (item[qKey] !== query[qKey]) {
          return false;
        }
      }
      return true;
    });
  }

  async findOne(query: Partial<T>): Promise<T | null> {
    if (mongoDb) {
      try {
        const item = await mongoDb.collection(this.key).findOne(query as any);
        return item as unknown as T | null;
      } catch (err) {
        console.error(`MongoDB findOne error on ${this.key}:`, err);
      }
    }

    const records = await this.find(query);
    return records.length > 0 ? records[0] : null;
  }

  async create(record: Omit<T, "_id"> & Partial<{ _id: string }>): Promise<T> {
    const generatedId = record._id || Math.random().toString(36).substr(2, 9);
    const newRecord = {
      _id: generatedId,
      ...record
    } as unknown as T;

    if (mongoDb) {
      try {
        await mongoDb.collection(this.key).insertOne(newRecord as any);
        return newRecord;
      } catch (err) {
        console.error(`MongoDB create error on ${this.key}:`, err);
      }
    }

    const data = readFromDisk();
    const list = data[this.key] || [];
    list.push(newRecord);
    data[this.key] = list;
    saveToDisk(data);
    return newRecord;
  }

  async updateOne(query: Partial<T>, updates: Partial<T>): Promise<boolean> {
    if (mongoDb) {
      try {
        const result = await mongoDb.collection(this.key).updateOne(query as any, { $set: updates });
        return result.modifiedCount > 0 || result.matchedCount > 0;
      } catch (err) {
        console.error(`MongoDB updateOne error on ${this.key}:`, err);
      }
    }

    const data = readFromDisk();
    const list = data[this.key] || [];
    let updated = false;

    const newList = list.map((item: any) => {
      let matches = true;
      for (const qKey in query) {
        if (item[qKey] !== query[qKey]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        updated = true;
        return { ...item, ...updates };
      }
      return item;
    });

    if (updated) {
      data[this.key] = newList;
      saveToDisk(data);
    }
    return updated;
  }

  async deleteOne(query: Partial<T>): Promise<boolean> {
    if (mongoDb) {
      try {
        const result = await mongoDb.collection(this.key).deleteOne(query as any);
        return result.deletedCount > 0;
      } catch (err) {
        console.error(`MongoDB deleteOne error on ${this.key}:`, err);
      }
    }

    const data = readFromDisk();
    const list = data[this.key] || [];
    const initialLen = list.length;

    const newList = list.filter((item: any) => {
      let matches = true;
      for (const qKey in query) {
        if (item[qKey] !== query[qKey]) {
          matches = false;
          break;
        }
      }
      return !matches;
    });

    if (newList.length < initialLen) {
      data[this.key] = newList;
      saveToDisk(data);
      return true;
    }
    return false;
  }
}

// Simulated Mongo Models
export const MongoModels = {
  User: new Collection<any>("users"),
  Appeal: new Collection<any>("appeals"),
  Question: new Collection<any>("questions"),
  ProctorStudent: new Collection<any>("proctorStudents"),
  ViolationIncident: new Collection<any>("violationIncidents"),
  Audit: new Collection<any>("audits")
};
