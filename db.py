import os
import sqlite3
from .config import DB_PATH

SCHEMA = """
CREATE TABLE IF NOT EXISTS documents(
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, corpus TEXT NOT NULL,
  n_chunks INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS chunks(
  id INTEGER PRIMARY KEY AUTOINCREMENT, doc_id INTEGER NOT NULL, idx INTEGER NOT NULL,
  text TEXT NOT NULL, emb BLOB NOT NULL,
  FOREIGN KEY(doc_id) REFERENCES documents(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS evaluations(
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, prompt TEXT, response TEXT, corpus TEXT,
  verdict TEXT, composite REAL, data TEXT NOT NULL);
"""


def conn() -> sqlite3.Connection:
    d = os.path.dirname(DB_PATH)
    if d:
        os.makedirs(d, exist_ok=True)
    c = sqlite3.connect(DB_PATH)
    c.row_factory = sqlite3.Row
    c.execute("PRAGMA foreign_keys = ON")
    return c


def init_db() -> None:
    c = conn()
    c.executescript(SCHEMA)
    c.commit()
    c.close()
