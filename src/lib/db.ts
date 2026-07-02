import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'predictflow.db')

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    initializeDb(db)
  }
  return db
}

function initializeDb(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS simulations (
      id TEXT PRIMARY KEY,
      scenario_type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      parameters TEXT,
      department TEXT,
      initiated_by TEXT,
      risk_score REAL,
      confidence_score REAL,
      severity TEXT,
      recommended_action TEXT,
      impacts TEXT,
      execution_time_ms INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS approvals (
      id TEXT PRIMARY KEY,
      simulation_id TEXT NOT NULL,
      risk_score REAL,
      severity TEXT,
      requested_by TEXT,
      requested_at TEXT,
      status TEXT DEFAULT 'pending',
      reviewed_by TEXT,
      reviewed_at TEXT,
      comments TEXT,
      rationale TEXT,
      FOREIGN KEY (simulation_id) REFERENCES simulations(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      timestamp TEXT DEFAULT (datetime('now')),
      read INTEGER DEFAULT 0
    );
  `)
}

export function closeDb(): void {
  if (db) {
    db.close()
    db = null
  }
}
