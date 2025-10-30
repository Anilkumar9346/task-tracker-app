const express = require('express');
const path = require('path');
const cors = require('cors');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'task_tracker.db');
let db = null;

// initialize DB and server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create tasks table according to required schema
    await db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')) NOT NULL DEFAULT 'Medium',
        due_date TEXT NOT NULL,
        status TEXT CHECK(status IN ('Open', 'In Progress', 'Done')) NOT NULL DEFAULT 'Open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Mount routes (single file)
    const tasksRoutes = require('./src/routes/tasks');
    tasksRoutes(app, db);

    app.get('/', (req, res) => res.send({ message: 'Task Tracker API running' }));

    const PORT = 3003;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  } catch (e) {
    console.error('DB Error:', e.message);
    process.exit(1);
  }
};

initializeDBAndServer();

module.exports = app;
